-- -------------------------------------------------------------
-- Ma'lumotlar bazasi jadvali strukturasi
-- Telegram Web Clone - cPanel Hosting uchun moslangan
-- -------------------------------------------------------------

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Jadval: `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `nickname` VARCHAR(50) NOT NULL UNIQUE,
  `fullname` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(255) DEFAULT 'default_avatar.png',
  `last_active` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_admin` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Jadval: `messages`
--

CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT NOT NULL,
  `message_text` TEXT DEFAULT NULL,
  `media_url` VARCHAR(255) DEFAULT NULL,
  `media_type` ENUM('text', 'photo', 'video', 'voice', 'location') DEFAULT 'text',
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_sender` (`sender_id`),
  FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Jadval: `settings`
--

CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `chat_wallpaper` VARCHAR(255) DEFAULT 'default_pattern',
  `allow_voice` TINYINT(1) DEFAULT 1,
  `allow_video` TINYINT(1) DEFAULT 1,
  `google_client_id` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Default ma'lumotlarni kiritish
--

INSERT INTO `settings` (`chat_wallpaper`, `allow_voice`, `allow_video`) 
VALUES ('default_pattern', 1, 1)
ON DUPLICATE KEY UPDATE `id`=`id`;

COMMIT;
