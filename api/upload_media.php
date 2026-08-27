<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok'=>false,'error'=>'Método no permitido.'],405);
}

$kind = $_POST['kind'] ?? '';
if (!in_array($kind, ['video','audio'], true)) {
    json_response(['ok'=>false,'error'=>'Tipo de medio no válido.'],400);
}

$fileKey = $kind;
if (!isset($_FILES[$fileKey])) {
    json_response(['ok'=>false,'error'=>"No se recibió ningún archivo $kind."],400);
}

$f = $_FILES[$fileKey];
if ($f['error'] !== UPLOAD_ERR_OK) {
    json_response(['ok'=>false,'error'=>php_upload_error($f['error'])],400);
}

if ($f['size'] > 1024*1024*1024) {
    json_response(['ok'=>false,'error'=>'El archivo supera 1 GB.'],400);
}

$mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
$videoAllowed = [
    'video/mp4'=>'mp4', 'video/webm'=>'webm', 'video/quicktime'=>'mov',
    'video/x-msvideo'=>'avi', 'video/x-matroska'=>'mkv'
];
$audioAllowed = [
    'audio/mpeg'=>'mp3', 'audio/wav'=>'wav', 'audio/x-wav'=>'wav',
    'audio/ogg'=>'ogg', 'audio/mp4'=>'m4a', 'audio/x-m4a'=>'m4a',
    'audio/aac'=>'aac', 'audio/flac'=>'flac', 'audio/webm'=>'webm'
];

// La pista AUDIO acepta también un archivo de VIDEO. Solo se conserva su audio.
$audioSourceIsVideo = ($kind === 'audio' && isset($videoAllowed[$mime]));

if ($audioSourceIsVideo) {
    $ext = $videoAllowed[$mime];
} else {
    $allowed = $kind === 'audio' ? $audioAllowed : $videoAllowed;
    if (!isset($allowed[$mime])) {
        json_response(['ok'=>false,'error'=>'Formato no soportado para esta pista: '.$mime],415);
    }
    $ext = $allowed[$mime];
}

$id = bin2hex(random_bytes(8));
$dir = $kind === 'audio' ? AUDIO_DIR : VIDEO_DIR;
if (!is_dir($dir) && !@mkdir($dir,0775,true)) {
    json_response(['ok'=>false,'error'=>'No fue posible crear el directorio de almacenamiento.'],500);
}

if ($audioSourceIsVideo) {
    $source = $dir.DIRECTORY_SEPARATOR.$id.'.'.$ext;
    if (!move_uploaded_file($f['tmp_name'], $source)) {
        json_response(['ok'=>false,'error'=>'No fue posible guardar temporalmente el video. Revisa permisos de XAMPP.'],500);
    }

    $outputName = $id.'.m4a';
    $output = $dir.DIRECTORY_SEPARATOR.$outputName;
    $sourceArg = escapeshellarg($source);
    $outputArg = escapeshellarg($output);
    $cmd = FFMPEG_BIN.' -hide_banner -loglevel error -y -i '.$sourceArg.' -vn -map 0:a:0 -c:a aac -b:a 192k '.$outputArg.' 2>&1';
    $lines = [];
    $code = 0;
    exec($cmd, $lines, $code);
    @unlink($source);

    if ($code !== 0 || !is_file($output)) {
        json_response([
            'ok'=>false,
            'error'=>'El video no contiene un audio utilizable o FFmpeg no pudo extraerlo.',
            'details'=>implode("\n", $lines)
        ],422);
    }

    json_response([
        'ok'=>true,
        'id'=>$id,
        'kind'=>'audio',
        'source_kind'=>'video',
        'file'=>$outputName,
        'url'=>'storage/audio/'.$outputName,
        'message'=>'Audio extraído correctamente desde el video.'
    ]);
}

$name = $id.'.'.$ext;
$target = $dir.DIRECTORY_SEPARATOR.$name;
if (!move_uploaded_file($f['tmp_name'],$target)) {
    json_response(['ok'=>false,'error'=>'No fue posible guardar el archivo. Revisa permisos de XAMPP.'],500);
}

json_response([
    'ok'=>true,
    'id'=>$id,
    'kind'=>$kind,
    'source_kind'=>$kind,
    'file'=>$name,
    'url'=>($kind === 'audio' ? 'storage/audio/' : 'storage/videos/').$name
]);
