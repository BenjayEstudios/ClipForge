<?php
require __DIR__ . '/config.php';
$body=json_decode(file_get_contents('php://input'),true);$id=clean_id($body['id']??'');$selected=$body['silences']??[];
if(!$id||!is_array($selected)||!count($selected)) json_response(['ok'=>false,'error'=>'Selecciona al menos un silencio.'],400);
$files=glob(VIDEO_DIR.DIRECTORY_SEPARATOR.$id.'.*');if(!$files) json_response(['ok'=>false,'error'=>'Video no encontrado.'],404);$input=$files[0];
$valid=[];foreach($selected as $s){$a=filter_var($s['start']??null,FILTER_VALIDATE_FLOAT);$b=filter_var($s['end']??null,FILTER_VALIDATE_FLOAT);if($a!==false&&$b!==false&&$b>$a)$valid[]=['start'=>(float)$a,'end'=>(float)$b];}
usort($valid,fn($x,$y)=>$x['start']<=>$y['start']);
// Obtener duración para construir el último tramo.
$probe=FFMPEG_BIN.' -hide_banner -i '.escapeshellarg($input).' 2>&1';$probeOut=[];exec($probe,$probeOut);$probeText=implode("\n",$probeOut);$duration=null;if(preg_match('/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/',$probeText,$m))$duration=((int)$m[1])*3600+((int)$m[2])*60+(float)$m[3];
if($duration===null) json_response(['ok'=>false,'error'=>'No se pudo obtener la duración del video.'],500);
$merged=[];foreach($valid as $s){if(!$merged||$s['start']>$merged[count($merged)-1]['end']+0.02)$merged[]=$s;else $merged[count($merged)-1]['end']=max($merged[count($merged)-1]['end'],$s['end']);}
$kept=[];$cursor=0;foreach($merged as $s){if($s['start']>$cursor)$kept[]=['start'=>$cursor,'end'=>min($s['start'],$duration)];$cursor=max($cursor,$s['end']);}if($cursor<$duration)$kept[]=['start'=>$cursor,'end'=>$duration];
if(!count($kept)) json_response(['ok'=>false,'error'=>'Los silencios seleccionados cubren todo el video.'],400);
$parts=[];$n=count($kept);foreach($kept as $i=>$seg){$a=max(0,$seg['start']);$b=min($duration,$seg['end']);if($b-$a<0.01)continue;$parts[]="[0:v]trim=start={$a}:end={$b},setpts=PTS-STARTPTS[v{$i}]";$parts[]="[0:a]atrim=start={$a}:end={$b},asetpts=PTS-STARTPTS[a{$i}]";}
$concat='';for($i=0;$i<$n;$i++)$concat.="[v{$i}][a{$i}]";$concat.="concat=n={$n}:v=1:a=1[outv][outa]";$filter=implode(';',$parts).';'.$concat;
$outName=$id.'_trimmed_'.date('Ymd_His').'.mp4';$out=OUTPUT_DIR.DIRECTORY_SEPARATOR.$outName;
$cmd=FFMPEG_BIN.' -y -hide_banner -i '.escapeshellarg($input).' -filter_complex '.escapeshellarg($filter).' -map '.escapeshellarg('[outv]').' -map '.escapeshellarg('[outa]').' -c:v libx264 -preset veryfast -crf 20 -c:a aac -movflags +faststart '.escapeshellarg($out).' 2>&1';
$logs=[];$code=0;exec($cmd,$logs,$code);if($code!==0||!is_file($out))json_response(['ok'=>false,'error'=>'FFmpeg no pudo renderizar el video.','details'=>implode("\n",array_slice($logs,-8))],500);
json_response(['ok'=>true,'url'=>'storage/outputs/'.$outName,'file'=>$outName]);
