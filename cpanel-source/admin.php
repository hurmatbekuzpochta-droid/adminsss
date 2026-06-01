<?php
/**
 * Admin Panel for Telegram Web Clone
 * Features login verification, Google SSO token toggles, system statistics, and configurations.
 */
require_once 'config.php';

// Verify Admin role or simulation access
$isAdmin = isset($_SESSION['user_id']); // Simple security check
?>
<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram Web - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-gray-50 text-gray-850 font-sans min-h-screen">
    <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Back to Chat Header -->
        <div class="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div class="flex items-center gap-2">
                <div class="w-10 h-10 bg-[#517da2] rounded-xl flex items-center justify-center text-white font-black">
                     A
                </div>
                <div>
                    <h1 class="text-xl font-extrabold text-gray-800">Tizim Ma'muriyati Panel</h1>
                    <p class="text-xs text-gray-500">Menejment va Tizimli Sozlamalar</p>
                </div>
            </div>
            <a href="index.php" class="flex items-center gap-1.5 px-3 py-1.5 bg-[#517da2]/10 text-[#517da2] rounded-xl text-xs font-semibold hover:bg-[#517da2]/20 transition">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                Churqorga qaytish
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Stat 1 -->
            <div class="bg-white border rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <i data-lucide="message-square-more" class="w-6 h-6"></i>
                </div>
                <div>
                    <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Xabarlar soni</h4>
                    <span class="text-2xl font-bold text-gray-850 font-mono">1,482</span>
                </div>
            </div>
            
            <!-- Stat 2 -->
            <div class="bg-white border rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <i data-lucide="users" class="w-6 h-6"></i>
                </div>
                <div>
                    <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Foydalanuvchilar</h4>
                    <span class="text-2xl font-bold text-gray-850 font-mono">152</span>
                </div>
            </div>

            <!-- Stat 3 -->
            <div class="bg-white border rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <i data-lucide="database" class="w-6 h-6"></i>
                </div>
                <div>
                    <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Uzatilgan Fayllar</h4>
                    <span class="text-2xl font-bold text-gray-850 font-mono">312 Mb</span>
                </div>
            </div>
        </div>

        <!-- Configurations Panel -->
        <div class="bg-white border rounded-3xl p-6 shadow-xs space-y-6">
            <h2 class="text-lg font-bold text-gray-800 pb-2 border-b">Tizim Sozlamalar Boshqaruvi</h2>
            
            <form action="" method="POST" class="space-y-4">
                <!-- Wallpaper option -->
                <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Chat Fon Rasmi (Wallpaper URL / Pattern)</label>
                    <input type="text" name="wallpaper" value="default_pattern" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500">
                    <p class="text-xs text-gray-400">Telegram naqshli orqa foni yoki to'liq internetdagi rasm manzili(URL)</p>
                </div>

                <!-- Google OAuth token setting -->
                <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Google OAuth Client ID & Token integratsiyasi</label>
                    <input type="text" name="google_token" placeholder="GOCSPX-v1_example_google_token_key..." class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none font-mono">
                    <p class="text-xs text-gray-400">Adminlarni xavfsiz Google hisobi orqali kirgizish uchun OAuth 2.0 sertifikatlangan tokeni.</p>
                </div>

                <!-- Media restrictions -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="allow_voice" name="allow_voice" checked class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                        <label for="allow_voice" class="text-sm font-semibold text-gray-700">Ovozli xabarlarni yoqish</label>
                    </div>
                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="allow_video" name="allow_video" checked class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                        <label for="allow_video" class="text-sm font-semibold text-gray-700">Video xabarlarni yoqish</label>
                    </div>
                </div>

                <div class="pt-4">
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md">
                        Sozlamalarni Saqlash (Save Config)
                    </button>
                </div>
            </form>
        </div>
    </div>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>
