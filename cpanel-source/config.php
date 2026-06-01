<?php
/**
 * Telegram Chat Web Clone Config File
 * This file connects securely to your hosting database using PHP PDO.
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'my_telegram_db'); // Replace with your real cPanel DB Name
define('DB_USER', 'my_telegram_user'); // Replace with your real cPanel DB User
define('DB_PASS', 'my_secure_password'); // Replace with your real cPanel DB Password

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Return nice, helpful JSON or error message
    header('Content-Type: application/json');
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

// Start user sessions securely
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
