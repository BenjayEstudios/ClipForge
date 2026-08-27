<?php
require __DIR__ . '/config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['ok'=>false,'error'=>'Método no permitido.'],405);
$p=json_decode(file_get_contents('php://input'),true)?:[];
$videoId=clean_id((string)($p['video_id']??''));$audioId=clean_id((string)($p['audio_id']??''));
$keep=is_array($p['keep_segments']??null)?$p['keep_segments']:[];$texts=is_array($p['texts']??null)?$p['texts']:[];
if($videoId==='')json_response(['ok'=>false,'error'=>'Falta el video del proyecto.'],400);
$video=null;foreach(glob(VIDEO_DIR.DIRECTORY_SEPARATOR.$videoId.'.*')?:[] as $x){if(is_file($x)){$video=$x;break;}}
if(!$video)json_response(['ok'=>false,'error'=>'No se encontró el video del proyecto.'],404);
$audio=null;if($audioId!=='')foreach(glob(AUDIO_DIR.DIRECTORY_SEPARATOR.$audioId.'.*')?:[] as $x){if(is_file($x)){$audio=$x;break;}}
if(!$keep)json_response(['ok'=>false,'error'=>'No hay segmentos para exportar.'],422);
$norm=[];foreach($keep as $s){$a=(float)($s['start']??-1);$b=(float)($s['end']??-1);if($a<0||$b<=$a)json_response(['ok'=>false,'error'=>'Hay un segmento inválido en la timeline.'],422);$norm[]=[$a,$b];}
$id=bin2hex(random_bytes(8));$out=OUTPUT_DIR.DIRECTORY_SEPARATOR.$id.'.mp4';
$cmd=FFMPEG_BIN.' -hide_banner -loglevel error -y -i '.escapeshellarg($video);if($audio)$cmd.=' -i '.escapeshellarg($audio);
$vf=[];$af=[];$n=count($norm);
$font=defined('FFMPEG_FONT')?FFMPEG_FONT:((getenv('WINDIR')?:'C:/Windows').'/Fonts/arial.ttf');
foreach($norm as $i=>$s){[$a,$b]=$s;$dur=$b-$a;$filters="trim=start=$a:end=$b,setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920";
 foreach($texts as $t){$ts=(float)($t['start']??-1);$te=(float)($t['end']??-1);$txt=(string)($t['text']??'');if($txt===''||$te<=$a||$ts>=$b)continue;$relS=max(0,$ts-$a);$relE=min($dur,$te-$a);if($relE<=$relS)continue;$txt=str_replace(['\\','\'',':',',','%'],'\\\\\\\\\'', $txt);$txt=str_replace(["\\r","\\n"],['','\\\\n'],$txt);$size=max(18,min(180,(int)($t['size']??64)));$color=preg_match('/^#[0-9a-fA-F]{6}$/',(string)($t['color']??''))?$t['color']:'#ffffff';$fontName=(string)($t['font']??'Arial');$bold=!empty($t['bold'])?'fontstyle=Bold,':'';$y=!empty($t['position'])&&$t['position']==='top'?'120':((!empty($t['position'])&&$t['position']==='center')?'(h-text_h)/2':'h-text_h-150');$filters.=",drawtext=fontfile='".str_replace('\\','/',$font)."':text='".$txt."':fontcolor=".$color.":fontsize=$size:borderw=3:bordercolor=black@0.75:x=(w-text_w)/2:y=$y:enable='between(t,$relS,$relE)'"; }
 $vf[]="[$i:v]".$filters."[v$i]";
 $aud="atrim=start=$a:end=$b,asetpts=PTS-STARTPTS";if($audio)$aud.=';[1:a]';
 $af[]=$audio?"[1:a]atrim=start=$a:end=$b,asetpts=PTS-STARTPTS,apad=whole_dur=$dur,atrim=duration=$dur[a$i]":"[0:a]atrim=start=$a:end=$b,asetpts=PTS-STARTPTS,apad=whole_dur=$dur,atrim=duration=$dur[a$i]";
}
$vins=$ains='';for($i=0;$i<$n;$i++){$vins.="[v$i]";$ains.="[a$i]";}
$filter=implode(';',$vf).';'.implode(';',$af).';'.$vins.'concat=n='.$n.':v=1:a=0[outv];'.$ains.'concat=n='.$n.':v=0:a=1[outa]';
$cmd.=' -filter_complex '.escapeshellarg($filter).' -map '.escapeshellarg('[outv]').' -map '.escapeshellarg('[outa]').' -r 30 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart '.escapeshellarg($out).' 2>&1';
exec($cmd,$lines,$code);if($code!==0||!is_file($out))json_response(['ok'=>false,'error'=>'FFmpeg no pudo renderizar el Reel.','details'=>implode("\n",$lines)],422);
json_response(['ok'=>true,'url'=>'storage/outputs/'.basename($out),'file'=>basename($out),'format'=>'1080x1920','audio'=>$audio?'external':'source']);
