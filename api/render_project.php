<?php
require __DIR__ . '/config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['ok'=>false,'error'=>'Método no permitido.'],405);
$p=json_decode(file_get_contents('php://input'),true)?:[];
$videoId=clean_id((string)($p['video_id']??''));$audioId=clean_id((string)($p['audio_id']??''));
$keep=is_array($p['keep_segments']??null)?$p['keep_segments']:[];$texts=is_array($p['texts']??null)?$p['texts']:[];
$audioVolume=max(0,min(1,(float)($p['audio_volume']??0.28)));$fadeIn=max(0,(float)($p['audio_fade_in']??0));$fadeOut=max(0,(float)($p['audio_fade_out']??0));$ducking=!empty($p['ducking']);
if($videoId==='')json_response(['ok'=>false,'error'=>'Falta el video del proyecto.'],400);
$video=null;foreach(glob(VIDEO_DIR.DIRECTORY_SEPARATOR.$videoId.'.*')?:[] as $x){if(is_file($x)){$video=$x;break;}}
if(!$video)json_response(['ok'=>false,'error'=>'No se encontró el video del proyecto.'],404);
$audio=null;if($audioId!=='')foreach(glob(AUDIO_DIR.DIRECTORY_SEPARATOR.$audioId.'.*')?:[] as $x){if(is_file($x)){$audio=$x;break;}}
if(!$keep)json_response(['ok'=>false,'error'=>'No quedan segmentos para exportar.'],422);
$norm=[];foreach($keep as $s){$a=(float)($s['start']??-1);$b=(float)($s['end']??-1);if($a<0||$b<=$a)json_response(['ok'=>false,'error'=>'Hay un segmento inválido en la timeline.'],422);$norm[]=[$a,$b];}
$id=bin2hex(random_bytes(8));$out=OUTPUT_DIR.DIRECTORY_SEPARATOR.$id.'.mp4';
function has_audio_stream(string $file): bool { $probe=defined('FFPROBE_BIN')?FFPROBE_BIN:'ffprobe';$cmd=$probe.' -v error -select_streams a:0 -show_entries stream=codec_type -of csv=p=0 '.escapeshellarg($file).' 2>&1';$lines=[];$code=0;exec($cmd,$lines,$code);return $code===0 && trim(implode('',$lines))!==''; }
function filter_escape(string $s): string { return str_replace(['\\',"'",':',',','%'],['\\\\',"\\'",'\\:','\\,','\\%'],$s); }
function text_y(array $t): string { $p=(string)($t['position']??'bottom');return $p==='top'?'120':($p==='center'?'(h-text_h)/2':'h-text_h-150'); }
$videoHasAudio=has_audio_stream($video);$cmd=FFMPEG_BIN.' -hide_banner -loglevel error -y -i '.escapeshellarg($video);if($audio)$cmd.=' -i '.escapeshellarg($audio);
$vf=[];$af=[];$n=count($norm);$font=((getenv('WINDIR')?:'C:/Windows').'/Fonts/arial.ttf');
foreach($norm as $i=>$s){[$a,$b]=$s;$dur=$b-$a;$filters="trim=start=$a:end=$b,setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920";foreach($texts as $t){$ts=(float)($t['start']??-1);$te=(float)($t['end']??-1);$raw=(string)($t['text']??'');if($raw===''||$te<=$a||$ts>=$b)continue;$rs=max(0,$ts-$a);$re=min($dur,$te-$a);if($re<=$rs)continue;$txt=filter_escape($raw);$size=max(18,min(180,(int)($t['size']??54)));$color=preg_match('/^#[0-9a-fA-F]{6}$/',(string)($t['color']??''))?$t['color']:'#ffffff';$filters.=",drawtext=fontfile='".str_replace('\\','/',$font)."':text='".$txt."':fontcolor=$color:fontsize=$size:borderw=3:bordercolor=black@0.78:x=(w-text_w)/2:y=".text_y($t).":enable='between(t,$rs,$re)'";}$vf[]="[0:v]$filters[v$i]";
if($videoHasAudio)$orig="[0:a]atrim=start=$a:end=$b,asetpts=PTS-STARTPTS,volume=1";else $orig='anullsrc=r=48000:cl=stereo';
if($audio){$music="[1:a]atrim=start=$a:end=$b,asetpts=PTS-STARTPTS";$vol=$audioVolume;$music.=" ,volume=$vol";if($fadeIn>0)$music.=" ,afade=t=in:st=0:d=".$fadeIn;if($fadeOut>0)$music.=" ,afade=t=out:st=".max(0,$dur-$fadeOut).":d=".$fadeOut;$af[]="$orig[a{$i}v];$music[a{$i}m];[a{$i}v][a{$i}m]amix=inputs=2:duration=first:dropout_transition=2,aresample=48000[a$i]";}else{$af[]="$orig,aresample=48000,atrim=duration=$dur[a$i]";}}
$vins='';$ains='';for($i=0;$i<$n;$i++){$vins.="[v$i]";$ains.="[a$i]";}
$filter=implode(';',$vf).';'.implode(';',$af).';'.$vins.'concat=n='.$n.':v=1:a=0[outv];'.$ains.'concat=n='.$n.':v=0:a=1[outa]';
$cmd.=' -filter_complex '.escapeshellarg($filter).' -map '.escapeshellarg('[outv]').' -map '.escapeshellarg('[outa]').' -r 30 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart '.escapeshellarg($out).' 2>&1';
$lines=[];$code=0;exec($cmd,$lines,$code);if($code!==0||!is_file($out))json_response(['ok'=>false,'error'=>'FFmpeg no pudo renderizar el Reel.','details'=>implode("\n",$lines)],422);
json_response(['ok'=>true,'url'=>'storage/outputs/'.basename($out),'file'=>basename($out),'format'=>'1080x1920','audio'=>$audio?'voice-plus-background':'source','volume'=>$audioVolume,'ducking'=>$ducking]);
