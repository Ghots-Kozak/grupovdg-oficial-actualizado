<?php
declare(strict_types=1);
/* Activar con VDG_TO_EMAIL y VDG_FROM_EMAIL en el servidor y un MTA autorizado. */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function reply(int $status, bool $ok, string $message): never {
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405, false, 'Usa el formulario del sitio para enviar la solicitud.');
if (strpos(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json') !== 0) reply(415, false, 'Formato de solicitud no compatible.');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]) reply(403, false, 'Origen no permitido.');
if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') reply(403, false, 'Origen no permitido.');
$to = getenv('VDG_TO_EMAIL') ?: '';
$from = getenv('VDG_FROM_EMAIL') ?: '';
if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $to . $from)) reply(503, false, 'El canal de correo todavía no está habilitado. Descarga la solicitud para conservarla.');
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 30000) reply(413, false, 'La solicitud es demasiado extensa.');
$body = file_get_contents('php://input', false, null, 0, 30001);
if ($body === false || strlen($body) > 30000) reply(413, false, 'La solicitud es demasiado extensa.');
$d = json_decode($body, true);
if (!is_array($d)) reply(400, false, 'No se pudo interpretar la solicitud.');
foreach (['name'=>100,'email'=>160,'phone'=>25,'company'=>120,'reason'=>100,'channel'=>40,'message'=>4000,'reference'=>80,'estimate'=>18000,'website'=>200] as $key => $limit) {
    if (isset($d[$key]) && !is_string($d[$key])) reply(422, false, 'Hay datos con formato no válido.');
    $d[$key] = trim((string)($d[$key] ?? ''));
    if (strlen($d[$key]) > $limit * 4) reply(422, false, 'Hay un campo demasiado extenso.');
}
if ($d['website'] !== '') reply(422, false, 'No se pudo validar la solicitud.');
if (strlen($d['name']) < 2 || strlen($d['message']) < 15 || !filter_var($d['email'], FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $d['email']) || ($d['consent'] ?? false) !== true) reply(422, false, 'Revisa nombre, correo, descripción y autorización.');
$phoneDigits = preg_replace('/\D/', '', $d['phone']);
if (($d['phone'] !== '' && (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 15)) || ($d['channel'] !== 'Correo' && $d['phone'] === '')) reply(422, false, 'Revisa el teléfono y el medio de contacto.');
if (!preg_match('/^[A-Z0-9-]{5,80}$/', $d['reference'])) reply(422, false, 'Referencia no válida.');
// Ventana móvil bajo bloqueo de archivo: máximo 5 intentos / 15 min por dirección.
// Solo se conserva una clave hash y marcas de tiempo; se depuran entradas antiguas.
$dir = sys_get_temp_dir() . '/VDG-contact-limit';
if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) reply(503, false, 'No se pudo verificar el envío. Intenta más tarde.');
$path = $dir . '/requests.json';
$handle = @fopen($path, 'c+');
if (!$handle || !flock($handle, LOCK_EX)) reply(503, false, 'El servicio está ocupado. Intenta de nuevo.');
@chmod($path, 0600);
$records = json_decode(stream_get_contents($handle) ?: '{}', true);
if (!is_array($records)) $records = [];
$now = time();
foreach ($records as $k => $timestamps) {
    $records[$k] = array_values(array_filter((array)$timestamps, fn($t) => is_int($t) && $now - $t < 900));
    if (!$records[$k]) unset($records[$k]);
}
$clientKey = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', getenv('VDG_RATE_SECRET') ?: $from);
$attempts = $records[$clientKey] ?? [];
if (count($attempts) >= 5) {flock($handle, LOCK_UN); fclose($handle); reply(429, false, 'Has enviado varias solicitudes. Conserva el archivo e intenta más tarde.');}
if (count($records) > 10000) {flock($handle, LOCK_UN); fclose($handle); reply(503, false, 'El servicio está ocupado. Intenta más tarde.');}
$records[$clientKey] = array_merge($attempts, [$now]);
rewind($handle); ftruncate($handle, 0); fwrite($handle, json_encode($records)); fflush($handle); flock($handle, LOCK_UN); fclose($handle);
$message = "Solicitud de proyecto para Grupo VDG\nReferencia: {$d['reference']}\nNombre: {$d['name']}\nCorreo: {$d['email']}\nTeléfono: {$d['phone']}\nEmpresa: {$d['company']}\nMotivo: {$d['reason']}\nContacto preferido: {$d['channel']}\n\n{$d['message']}\n\n{$d['estimate']}\n\nLa estimación recibida viene del navegador: no constituye precio autorizado ni se utiliza para cobros.\n";
$headers = ['From: ' . $from, 'Reply-To: ' . $d['email'], 'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8'];
$accepted = @mail($to, 'Solicitud de proyecto ' . $d['reference'], $message, implode("\r\n", $headers));
if (!$accepted) reply(502, false, 'El servidor no confirmó la aceptación del correo. Descarga la solicitud y vuelve a intentar.');
reply(200, true, 'El servicio de correo aceptó la solicitud para envío. No confirma la lectura ni la entrega final.');
