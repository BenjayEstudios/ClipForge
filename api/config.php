<?php
// Si ffmpeg.exe está en el PATH de Windows, deja este valor como 'ffmpeg'.
define('FFMPEG_BIN', 'ffmpeg');
define('STORAGE_DIR', dirname(__DIR__) . DIRECTORY_SEPARATOR . 'storage');
define('VIDEO_DIR', STORAGE_DIR . DIRECTORY_SEPARATOR . 'videos');
define('OUTPUT_DIR', STORAGE_DIR . DIRECTORY_SEPARATOR . 'outputs');

foreach ([STORAGE_DIR, VIDEO_DIR, OUTPUT_DIR] as $dir) {
    if (!is_dir($dir)) @mkdir($dir, 0775, true);
}

function json_response(array $data, int $status = 200): {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function clean_id(string $id): string {
    return preg_replace('/[^a-zA-Z0-9_-]/', '', $id);
}
