<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok'=>false,'error'=>'Método no permitido.'],405);
}

$kind = $_POST['kind'] ?? '';
$fileKey = $kind === 'audio' ? 'audio' : 'video';
if (!isset($_FILES[$fileKey])) {
    json_response(['ok'=>false,'error'=>"No se recibió ningún archivo $kind."],400);
}

$f = $_FILES[$fileKey];
if ($f['error'] !== UPLOAD_ERR_OK) {
    $messages = [
        UPLOAD_ERR_INI_SIZE => 'El archivo supera el límite upload_max_filesize de PHP.',
        UPLOAD_ERR_FORM_SIZE => 'El archivo supera el límite indicado por el formulario.',
        UPLOAD_ERR_PARTIAL => 'La subida quedó incompleta.',
        UPLOAD_ERR_NO_FILE => 'No se seleccionó ningún archivo.',
        UPLOAD_ERR_NO_TMP_DIR => 'Falta la carpeta temporal de PHP.',
        UPLOAD_ERR_CANT_WRITE => 'PHP no pudo escribir el archivo.',
        UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la subida.'
    ];
    json_response(['ok'=>false,'error'=>$messages[$f['error']] ?? ('La subida falló. Código: '.$f['error'])],400);
}

if ($f['size'] > 1024*1024*1024) {
    json_response(['ok'=>false,'error'=>'El archivo supera 1 GB.'],400);
}

$mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
$videoAllowed = ['video/mp4'=>'mp4','video/webm'=>'webm','video/quicktime'=>'mov','video/x-msvideo'=>'avi','video/x-matroska'=>'mkv'];
$audioAllowed = ['audio/mpeg'=>'mp3','audio/wav'=>'wav','audio/x-wav'=>'wav','audio/ogg'=>'ogg','audio/mp4'=>'m4a','audio/x-m4a'=>'m4a','audio/aac'=>'aac','audio/flac'=>'flac','audio/webm'=>'webm'];
$allowed = $kind === 'audio' ? $audioAllowed : $videoAllowed;

if (!isset($allowed[$mime])) {
    json_response(['ok'=>false,'error'=>'Formato no soportado: '.$mime],415);
}

$id = bin2hex(random_bytes(8));
$ext = $allowed[$mime];
$name = $id.'.'.$ext;
$dir = $kind === 'audio' ? STORAGE_DIR.DIRECTORY_SEPARATOR.'audio' : VIDEO_DIR;
if (!is_dir($dir) && !@mkdir($dir,0775,true)) {
    json_response(['ok'=>false,'error'=>'No fue posible crear el directorio de almacenamiento.'],500);
}
$target = $dir.DIRECTORY_SEPARATOR.$name;
if (!move_uploaded_file($f['tmp_name'],$target)) {
    json_response(['ok'=>false,'error'=>'No fue posible guardar el archivo. Revisa permisos de XAMPP.'],500);
}

json_response([
    'ok'=>true,
    'id'=>$id,
    'kind'=>$kind,
    'file'=>$name,
    'url'=>($kind === 'audio' ? 'storage/audio/' : 'storage/videos/').$name
]);
