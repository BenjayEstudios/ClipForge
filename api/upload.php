<?php
require __DIR__ . '/config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_FILES['video'])) json_response(['ok'=>false,'error'=>'No se recibió ningún video.'],400);
$f=$_FILES['video'];
if ($f['error'] !== UPLOAD_ERR_OK) json_response(['ok'=>false,'error'=>'La subida falló. Código: '.$f['error']],400);
if ($f['size'] > 1024*1024*1024) json_response(['ok'=>false,'error'=>'El video supera 1 GB.'],400);
$mime=(new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
$allowed=['video/mp4'=>'mp4','video/webm'=>'webm','video/quicktime'=>'mov','video/x-msvideo'=>'avi','video/x-matroska'=>'mkv'];
if (!isset($allowed[$mime])) json_response(['ok'=>false,'error'=>'Formato de video no soportado: '.$mime],415);
$id=bin2hex(random_bytes(8));$ext=$allowed[$mime];$name=$id.'.'.$ext;$target=VIDEO_DIR.DIRECTORY_SEPARATOR.$name;
if (!move_uploaded_file($f['tmp_name'],$target)) json_response(['ok'=>false,'error'=>'No fue posible guardar el video.'],500);
json_response(['ok'=>true,'id'=>$id,'file'=>$name,'url'=>'storage/videos/'.$name]);
