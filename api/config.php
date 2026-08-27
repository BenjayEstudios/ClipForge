<?php
// ClipForge - configuración local. Funciona con XAMPP/PHP embebido y FFmpeg instalado en Windows.
$envFfmpeg=getenv('CLIPFORGE_FFMPEG');$envFfprobe=getenv('CLIPFORGE_FFPROBE');
$ffmpegCandidates=[$envFfmpeg?:'',dirname(__DIR__).DIRECTORY_SEPARATOR.'bin'.DIRECTORY_SEPARATOR.'ffmpeg.exe','C:\\ffmpeg\\bin\\ffmpeg.exe','C:\\ffmpeg\\ffmpeg-9.0.1-essentials_build\\bin\\ffmpeg.exe','C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe','ffmpeg'];
$ffprobeCandidates=[$envFfprobe?:'',dirname(__DIR__).DIRECTORY_SEPARATOR.'bin'.DIRECTORY_SEPARATOR.'ffprobe.exe','C:\\ffmpeg\\bin\\ffprobe.exe','C:\\ffmpeg\\ffmpeg-9.0.1-essentials_build\\bin\\ffprobe.exe','C:\\Program Files\\ffmpeg\\bin\\ffprobe.exe','ffprobe'];
function first_executable(array $candidates):string{foreach($candidates as $candidate){if($candidate&&($candidate==='ffmpeg'||$candidate==='ffprobe'||is_file($candidate)))return$candidate;}return'';}
define('FFMPEG_BIN',first_executable($ffmpegCandidates));define('FFPROBE_BIN',first_executable($ffprobeCandidates));
define('STORAGE_DIR',dirname(__DIR__).DIRECTORY_SEPARATOR.'storage');define('VIDEO_DIR',STORAGE_DIR.DIRECTORY_SEPARATOR.'videos');define('AUDIO_DIR',STORAGE_DIR.DIRECTORY_SEPARATOR.'audio');define('OUTPUT_DIR',STORAGE_DIR.DIRECTORY_SEPARATOR.'outputs');
foreach([STORAGE_DIR,VIDEO_DIR,AUDIO_DIR,OUTPUT_DIR]as$dir){if(!is_dir($dir))@mkdir($dir,0775,true);}
function json_response(array$data,int$status=200){http_response_code($status);header('Content-Type: application/json; charset=utf-8');echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit;}
function clean_id(string$id):string{return preg_replace('/[^a-zA-Z0-9_-]/','',$id);}
function php_upload_error(int$code):string{$messages=[UPLOAD_ERR_INI_SIZE=>'El archivo supera upload_max_filesize de PHP.',UPLOAD_ERR_FORM_SIZE=>'El archivo supera el límite del formulario.',UPLOAD_ERR_PARTIAL=>'La subida quedó incompleta.',UPLOAD_ERR_NO_FILE=>'No se seleccionó ningún archivo.',UPLOAD_ERR_NO_TMP_DIR=>'PHP no tiene carpeta temporal configurada.',UPLOAD_ERR_CANT_WRITE=>'PHP no pudo escribir el archivo temporal.',UPLOAD_ERR_EXTENSION=>'Una extensión de PHP detuvo la subida.'];return$messages[$code]??('Error de subida. Código PHP: '.$code);}
if(FFMPEG_BIN==='')error_log('[ClipForge] FFmpeg no encontrado.');
