<?php
/**
 * REST API Backend for Telegram Web Clone
 * Handles message retrieval, uploads (images, audio recorded messages, videos), and deletions.
 */

require_once 'config.php';

header('Content-Type: application/json');

// Get active session user
$userId = $_SESSION['user_id'] ?? null;

// Helper function to update online status
function updateActivity($pdo, $uid) {
    if ($uid) {
        $stmt = $pdo->prepare("UPDATE users SET last_active = NOW() WHERE id = ?");
        $stmt->execute([$uid]);
    }
}

// Ensure user is authorized except for authentication endpoints
$action = $_GET['action'] ?? '';

if (empty($userId) && !in_array($action, ['login', 'register'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

updateActivity($pdo, $userId);

switch ($action) {
    case 'login':
        $username = trim($_POST['username'] ?? '');
        $password = trim($_POST['password'] ?? '');

        if (!$username || !$password) {
            echo json_encode(['error' => 'Barcha maydonlarni to\'ldiring!']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['fullname'] = $user['fullname'];
            $_SESSION['nickname'] = $user['nickname'];
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['error' => 'Login yoki parol noto\'g\'ri!']);
        }
        break;

    case 'register':
        $username = trim($_POST['username'] ?? '');
        $password = trim($_POST['password'] ?? '');
        $fullname = trim($_POST['fullname'] ?? '');
        $nickname = trim($_POST['nickname'] ?? '');

        if (!$username || !$password || !$fullname || !$nickname) {
            echo json_encode(['error' => 'Barcha ma\'lumotlarni kiriting!']);
            exit;
        }

        // Check unique nickname
        $stmt = $pdo->prepare("SELECT id FROM users WHERE nickname = ? OR username = ?");
        $stmt->execute([$nickname, $username]);
        if ($stmt->fetch()) {
            echo json_encode(['error' => 'Nickname yoki Username allaqachon mavjud!']);
            exit;
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, nickname, fullname, password_hash) VALUES (?, ?, ?, ?)");
        
        try {
            $stmt->execute([$username, $nickname, $fullname, $hash]);
            $newId = $pdo->lastInsertId();
            $_SESSION['user_id'] = $newId;
            $_SESSION['fullname'] = $fullname;
            $_SESSION['nickname'] = $nickname;
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Xatolik yuz berdi: ' . $e->getMessage()]);
        }
        break;

    case 'send_message':
        $text = trim($_POST['message_text'] ?? '');
        $type = $_POST['media_type'] ?? 'text';
        $lat = $_POST['latitude'] ?? null;
        $lon = $_POST['longitude'] ?? null;
        $mediaUrl = null;

        // Handle File upload
        if (isset($_FILES['media_file']) && $_FILES['media_file']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['media_file'];
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $fileName = uniqid('file_') . '.' . $ext;
            
            // Create uploads folder automatically if not exist
            if (!is_dir('uploads')) {
                mkdir('uploads', 0755, true);
            }
            
            $target = 'uploads/' . $fileName;
            if (move_uploaded_file($file['tmp_name'], $target)) {
                $mediaUrl = $target;
            }
        }

        if (!$text && !$mediaUrl && $type !== 'location') {
            echo json_encode(['error' => 'Xabar bo\'sh bo\'lolmaydi!']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO messages (sender_id, message_text, media_url, media_type, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $text, $mediaUrl, $type, $lat, $lon]);
        
        echo json_encode(['success' => true, 'message_id' => $pdo->lastInsertId()]);
        break;

    case 'get_messages':
        // Safe query retrieval with sender nickname, online indicators
        $stmt = $pdo->query("
            SELECT m.*, u.fullname, u.nickname, u.avatar,
                   CASE WHEN u.last_active > NOW() - INTERVAL 1 MINUTE THEN 1 ELSE 0 END as is_online
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            ORDER BY m.created_at ASC
        ");
        $messages = $stmt->fetchAll();
        echo json_encode(['messages' => $messages]);
        break;

    case 'delete_message':
        $messageId = $_GET['id'] ?? null;
        if (!$messageId) {
            echo json_encode(['error' => 'Xabar ID ko\'rsatilmadi!']);
            exit;
        }

        // Verify sender ownership or Admin privileges
        $stmt = $pdo->prepare("SELECT sender_id FROM messages WHERE id = ?");
        $stmt->execute([$messageId]);
        $msg = $stmt->fetch();

        if ($msg) {
            $isAdminStmt = $pdo->prepare("SELECT is_admin FROM users WHERE id = ?");
            $isAdminStmt->execute([$userId]);
            $user_info = $isAdminStmt->fetch();
            $isAdmin = $user_info ? $user_info['is_admin'] : 0;

            if ($msg['sender_id'] == $userId || $isAdmin == 1) {
                $deleteStmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
                $deleteStmt->execute([$messageId]);
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['error' => 'Siz ushbu xabarni o\'chira olmaysiz!']);
            }
        } else {
            echo json_encode(['error' => 'Xabar topilmadi!']);
        }
        break;

    default:
        echo json_encode(['error' => 'Action topilmadi']);
        break;
}
