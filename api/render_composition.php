<?php
require __DIR__ . '/config.php';
if($_SERVER['REQUEST_METHOD']!=='POST')json_response(['ok'=>false,'error'=>'Método no permitido.'],405);
$p=json_decode(file_get_contents('php://input'),true)?:[];
$media=is_array($p['media']??null)?$p['media']:[];$tracks=is_array($p['tracks']??null)?$p['tracks']:[];$clips=is_array($p['clips']??null)?$p['clips']:[];$settings=is_array($p['settings']??null)?$p['settings']:[];
$W=max(1,min(3840,(int)($settings['width']??1080)));$H=max(1,min(3840,(int)($settings['height']??1920)));$fps=max(1,min(120,(int)($settings['fps']??30)));$duration=max(0,(float)($p['duration']??0));
function find_media(array $media,string $id):?array{foreach($media as $m)if((string)($m['id']??'')===$id)return$m;return null;}
function file_for_media(?array $m):?string{if(!$m)return null;$id=preg_replace('/[^a-zA-Z0-9_-]/','',(string)($m['id']??''));$kind=$m['kind']??'';$dirs=$kind==='audio'?[AUDIO_DIR]:($kind==='video'?[VIDEO_DIR]:[VIDEO_DIR]);foreach($dirs as$d){foreach(glob($d.DIRECTORY_SEPARATOR.$id.'.*')?:[] as$f)if(is_file($f))return$f;}return null;}
$videoClips=array_values(array_filter($clips,fn($c)=>($c['kind']??'')==='video'));
if(!$videoClips)json_response(['ok'=>false,'error'=>'No hay clips de video para renderizar.'],422);
$base=null;foreach($videoClips as$c){$m=find_media($media,(string)($c['sourceId']??''));$f=file_for_media($m);if($f){$base=$f;break;}}
if(!$base)json_response(['ok'=>false,'error'=>'No se encontró el archivo de video fuente.'],404);
$out=OUTPUT_DIR.DIRECTORY_SEPARATOR.bin2hex(random_bytes(8)).'.mp4';
$vf="scale={$W}:{$H}:force_original_aspect_ratio=increase,crop={$W}:{$H},format=yuv420p";$cmd=FFMPEG_BIN.' -hide_banner -loglevel error -y -i '.escapeshellarg($base).' -vf '.escapeshellarg($vf).' -r '.escapeshellarg((string)$fps).' -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart '.escapeshellarg($out).' 2>&1';
$lines=[];$code=0;exec($cmd,$lines,$code);if($code!==0||!is_file($out))json_response(['ok'=>false,'error'=>'FFmpeg no pudo crear la composición.','details'=>implode("\n",$lines)],422);
json_response(['ok'=>true,'url'=>'storage/outputs/'.basename($out),'file'=>basename($out),'format'=>$W.'x'.$H,'fps'=>$fps,'clips'=>count($clips),'tracks'=>count($tracks)]);
