<?php
require __DIR__ . '/config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['ok'=>false,'error'=>'Método no permitido.'],405);
$p=json_decode(file_get_contents('php://input'),true)?:[];$videoId=clean_id((string)($p['video_id']??''));$audioId=clean_id((string)($p['audio_id']??''));$keep=is_array($p['keep_segments']??null)?$p['keep_segments']:[];
if($videoId==='')json_response(['ok'=>false,'error'=>'Falta el video del proyecto.'],400);
$video=null;foreach(glob(VIDEO_DIR.DIRECTORY_SEPARATOR.$videoId.'.*')?:[] as $x){if(is_file($x)){$video=$x;break;}}
if(!$video)json_response(['ok'=>false,'error'=>'No se encontró el video del proyecto.'],404);
$audio=null;if($audioId!=='')foreach(glob(AUDIO_DIR.DIRECTORY_SEPARATOR.$audioId.'.*')?:[] as $x){if(is_file($x)){$audio=$x;break;}}
if(!$keep)json_response(['ok'=>false,'error'=>'No hay segmentos para exportar.'],422);
$norm=[];foreach($keep as $s){$a=(float)($s['start']??-1);$b=(float)($s['end']??-1);if($a<0||$b<=$a)json_response(['ok'=>false,'error'=>'Hay un segmento inválido en la timeline.'],422);$norm[]=[$a,$b];}
$id=bin2hex(random_bytes(8));$out=OUTPUT_DIR.DIRECTORY_SEPARATOR.$id.'.mp4';$cmd=FFMPEG_BIN.' -hide_banner -loglevel error -y -i '.escapeshellarg($video);
if($audio)$cmd.=' -i '.escapeshellarg($audio);
$vf=[];$af=[];foreach($norm as $i=>$s){[$a,$b]=$s;$vf[]="[0:v]trim=start=$a:end=$b,setpts=PTS-STARTPTS[v$i]";if($audio)$af[]="[1:a]atrim=start=$a:end=$b,asetpts=PTS-STARTPTS[a$i]";else $af[]="[0:a]atrim=start=$a:end=$b,asetpts=PTS-STARTPTS[a$i]";}
$n=count($norm);$vins='';for($i=0;$i<$n;$i++)$vins.="[v$i]";$ains='';for($i=0;$i<$n;$i++)$ains.="[a$i]";
$filter=implode(';',$vf).';'.implode(';',$af).';'.$vins.'concat=n='.$n.':v=1:a=0[outv];'.$ains.'concat=n='.$n.':v=0:a=1[outa]';
$cmd.=' -filter_complex '.escapeshellarg($filter).' -map '.escapeshellarg('[outv]').' -map '.escapeshellarg('[outa]').' -c:v libx264 -preset veryfast -crf 20 -c:a aac -b:a 192k -movflags +faststart '.escapeshellarg($out).' 2>&1';
exec($cmd,$lines,$code);if($code!==0||!is_file($out))json_response(['ok'=>false,'error'=>'FFmpeg no pudo renderizar el proyecto.','details'=>implode("\n",$lines)],422);
json_response(['ok'=>true,'url'=>'storage/outputs/'.basename($out),'file'=>basename($out)]);
