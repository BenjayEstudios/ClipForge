<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['ok'=>false,'error'=>'Método no permitido.'],405);

$payload = json_decode(file_get_contents('php://input'), true) ?: [];
$videoId = clean_id((string)($payload['video_id'] ?? ''));
$audioId = clean_id((string)($payload['audio_id'] ?? ''));
$segments = is_array($payload['segments'] ?? null) ? $payload['segments'] : [];

if ($videoId === '') json_response(['ok'=>false,'error'=>'Falta el video del proyecto.'],400);
$video = null;
foreach (glob(VIDEO_DIR.DIRECTORY_SEPARATOR.$videoId.'.*') ?: [] as $p) { if (is_file($p)) { $video=$p; break; } }
if (!$video) json_response(['ok'=>false,'error'=>'No se encontró el video del proyecto.'],404);

$audio = null;
if ($audioId !== '') foreach (glob(AUDIO_DIR.DIRECTORY_SEPARATOR.$audioId.'.*') ?: [] as $p) { if (is_file($p)) { $audio=$p; break; } }

foreach ($segments as $s) {
    if (!isset($s['start'],$s['end']) || !is_numeric($s['start']) || !is_numeric($s['end'])) json_response(['ok'=>false,'error'=>'Un corte de la timeline no es válido.'],422);
    if ((float)$s['end'] <= (float)$s['start']) json_response(['ok'=>false,'error'=>'Hay un segmento con duración inválida.'],422);
}

$filters=[];
if (count($segments)) {
    $parts=[];
    foreach ($segments as $s) { $a=max(0,(float)$s['start']); $b=max($a,(float)$s['end']); $parts[]="between(t,$a,$b)"; }
    $filters[]='not(or('.implode(',',$parts).'))';
}
$id = bin2hex(random_bytes(8));
$out = OUTPUT_DIR.DIRECTORY_SEPARATOR.$id.'.mp4';
$v = escapeshellarg($video); $o=escapeshellarg($out);

if (count($segments)) {
    $vf = count($filters) ? ' -vf "select=\'' . implode("' + '",$filters) . '\',setpts=N/FRAME_RATE/TB"' : '';
    $cmd = FFMPEG_BIN.' -hide_banner -loglevel error -y -i '.$v;
    if ($audio) {
        $a=escapeshellarg($audio);
        $cmd .= ' -i '.$a.' -filter_complex "[0:v]'.$filters[0].',setpts=N/FRAME_RATE/TB[v];[1:a]asetpts=N/SR/TB[a]" -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 20 -c:a aac -b:a 192k -shortest '.$o.' 2>&1';
    } else {
        $cmd .= $vf.' -an -c:v libx264 -preset veryfast -crf 20 '.$o.' 2>&1';
    }
} else {
    $cmd = FFMPEG_BIN.' -hide_banner -loglevel error -y -i '.$v;
    if ($audio) {
        $a=escapeshellarg($audio);
        $cmd .= ' -i '.$a.' -map 0:v:0 -map 1:a:0 -c:v libx264 -preset veryfast -crf 20 -c:a aac -b:a 192k -shortest '.$o.' 2>&1';
    } else {
        $cmd .= ' -c:v libx264 -preset veryfast -crf 20 -c:a aac -b:a 192k '.$o.' 2>&1';
    }
}

exec($cmd,$lines,$code);
if ($code!==0 || !is_file($out)) json_response(['ok'=>false,'error'=>'FFmpeg no pudo renderizar el proyecto.','details'=>implode("\n",$lines)],422);
json_response(['ok'=>true,'url'=>'storage/outputs/'.basename($out),'file'=>basename($out)]);
