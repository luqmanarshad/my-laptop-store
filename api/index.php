<?php

// Vercel serverless functions have a read-only filesystem except for /tmp
if (!file_exists('/tmp/storage/framework/views')) {
    mkdir('/tmp/storage/framework/views', 0777, true);
}
if (!file_exists('/tmp/storage/framework/sessions')) {
    mkdir('/tmp/storage/framework/sessions', 0777, true);
}
if (!file_exists('/tmp/storage/framework/cache')) {
    mkdir('/tmp/storage/framework/cache', 0777, true);
}
if (!file_exists('/tmp/storage/logs')) {
    mkdir('/tmp/storage/logs', 0777, true);
}

$_ENV['APP_STORAGE'] = '/tmp/storage';

require __DIR__ . '/../public/index.php';
