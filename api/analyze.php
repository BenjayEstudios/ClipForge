<?php
require __DIR__ . '/config.php';
$id=clean_id($_POST['id']??'');$threshold=(float)($_POST['threshold']??-35);$min=(float)($_POST['min_duration']??0.8);
if(!$id) json_response(['ok'=>false,'error'=>'ID inválido.'],400);$files=glob(VIDEO_DIR.DIRECTORY_SEPARATOR.$id.'.*');if(!$files) json_response(['ok'=>false,'error'=>'Video no encontrado.'],404);
$threshold=max(-80,min(-10,$threshold));$min=max(.2,min(10,$min));$file=$files[0];
$cmd=FFMPEG_BIN.' -hide_banner -i '.escapeshellarg($file).' -af '.escapeshellarg("silencedetect=noise={$threshold}dB:d={$min}").' -f null NUL 2>&1';
$out=[];$code=0;exec($cmd,$out,$code);$text=implode("\n",$out);
preg_match_all('/silence_start:\s*([0-9.]+)/',$text,$starts);preg_match_all('/silence_end:\s*([0-9.]+)/',$text,$ends);$silences=[];
$startVals=$starts[1]??[];$endVals=$ends[1]??[];foreach($startVals as $i=>$s){if(isset($endVals[$i])){$e=(float)$endVals[$i];$s=(float)$s;if($e>$s)$silences[]=['start'=>$s,'end'=>$e,'duration'=>$e-$s];}}
json_response(['ok'=>true,'silences'=>$silences,'ffmpeg_code'=>$code]);
