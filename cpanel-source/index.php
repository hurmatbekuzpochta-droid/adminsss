<?php
/**
 * Telegram Chat Web Clone Front-End View for cPanel
 * Powered by beautiful CSS, responsive mobile-friendly layouts, and complete JavaScript.
 */
require_once 'config.php';

// Check if user is logged in
$loggedIn = isset($_SESSION['user_id']);
?>
<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Telegram Web Clone - cPanel Chat</title>
    <!-- Tailwind CSS CDN for elegant utility styles -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        /* Specific mobile layout constraints to avoid horizontal sliding/zooming issues */
        html, body {
            overflow: hidden;
            width: 100%;
            height: 100%;
            position: fixed;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        /* Custome theme support based on user wallpaper configuration */
        .chat-wallpaper {
            background-color: #eef2f3;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath fill-rule='evenodd' d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.133 7-7s-3.134-7-7-7-7 3.133-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm1-61c3.16 0 6-1.84 6-5s-2.84-5-6-5-6 1.84-6 5 2.84 5 6 5zm29 57c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM25 40c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm47 3c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM11 5c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm68 58c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM44 65c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-2 29c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm25-10c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z'/%3E%/svg%3E");
        }
        .message-incoming {
            background-color: #ffffff;
            border-radius: 12px 12px 12px 0px;
        }
        .message-outgoing {
            background-color: #d9fdd3;
            border-radius: 12px 12px 0px 12px;
        }
    </style>
</head>
<body class="bg-[#f0f2f5] text-gray-800 flex items-center justify-center">

<?php if (!$loggedIn): ?>
    <!-- REGISTER / LOGIN OVERLAY (Full screen) -->
    <div class="fixed inset-0 bg-[#537395]/40 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div class="bg-white w-full max-w-sm rounded-[24px] shadow-2xl p-6 border border-gray-100 flex flex-col gap-4">
            <div class="text-center">
                <div class="w-16 h-16 bg-[#2EA6DA] text-white rounded-full mx-auto flex items-center justify-center mb-3">
                    <i data-lucide="send" class="w-8 h-8 rotate-45 transform -translate-x-0.5"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-800">Telegram cPanel Chat</h2>
                <p class="text-xs text-gray-500 mt-1">Foydalanish uchun avval kiring yoki ro'yxatdan o'ting</p>
            </div>

            <div id="auth-box">
                <!-- Registration & Login Form -->
                <form id="auth-form" class="space-y-3">
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Tizimga kirish Logini (Username)</label>
                        <input type="text" name="username" placeholder="hurmatbek" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2EA6DA]">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider font-semibold">Parol</label>
                        <input type="password" name="password" placeholder="••••••••" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2EA6DA]">
                    </div>

                    <!-- Hidden fields for new users setup -->
                    <div id="sign-up-fields" class="hidden space-y-3 pt-2 border-t border-gray-100">
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Ism va Familiyangiz</label>
                            <input type="text" name="fullname" placeholder="Hurmatbek UZ" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Taxallus (Nickname)</label>
                            <input type="text" name="nickname" placeholder="@hurmat_uz" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none">
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-[#2EA6DA] hover:bg-[#258BB8] text-white py-3 rounded-xl text-sm font-semibold transition-all">
                        Tizimga kirish
                    </button>
                </form>

                <div class="text-center mt-4">
                    <button id="toggle-auth-mode" class="text-xs text-[#2EA6DA] hover:underline font-semibold focus:outline-none">
                        Menda akkaunt yo'q. Ro'yxatdan o'tish
                    </button>
                </div>
            </div>
        </div>
    </div>
<?php else: ?>
    <!-- MAIN TELEGRAM DESKTOP/MOBILE WORKSPACE -->
    <div class="w-full h-full flex overflow-hidden">
        
        <!-- SIDEBAR: Users list (Hidden on small mobile when chat is active) -->
        <aside id="chat-sidebar" class="w-full md:w-[360px] bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">
            <header class="p-4 border-b border-gray-100 flex items-center justify-between bg-[#517da2] text-white">
                <div class="flex items-center gap-2">
                    <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
                        H
                    </div>
                    <div>
                        <h3 class="text-sm font-bold leading-tight"><?php echo htmlspecialchars($_SESSION['fullname']); ?></h3>
                        <p class="text-[10px] text-white/75"><?php echo htmlspecialchars($_SESSION['nickname']); ?></p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <a href="admin.php" class="p-1.5 hover:bg-white/10 rounded-lg transition" title="Admin Panel">
                        <i data-lucide="shield-check" class="w-5 h-5"></i>
                    </a>
                </div>
            </header>

            <!-- Contacts/Conversations scroll area -->
            <div class="flex-grow overflow-y-auto p-2 space-y-1">
                <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer">
                    <div class="relative">
                        <div class="w-11 h-11 rounded-full bg-[#2190f3] text-white flex items-center justify-center font-bold">
                            TG
                        </div>
                        <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-bold text-gray-800">Umumiy Guruh</span>
                            <span class="text-[10px] text-gray-400">Online</span>
                        </div>
                        <p class="text-xs text-gray-500 truncate">Hamma shu yerda fikr almashmoqda...</p>
                    </div>
                </div>
            </div>
        </aside>

        <!-- CHAT ACTIVE AREA -->
        <main id="chat-main" class="flex-grow flex flex-col h-full bg-[#f4f4f5] relative">
            <!-- Header -->
            <header class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 flex-shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-[#2190f3] text-white flex items-center justify-center font-bold">
                         TG
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-gray-800">Umumiy Guruh</h4>
                        <p class="text-[10px] text-green-500 font-medium">Barcha foydalanuvchilar faol</p>
                    </div>
                </div>
            </header>

            <!-- Message Area -->
            <div id="messages-container" class="flex-grow chat-wallpaper overflow-y-auto px-4 py-6 space-y-4">
                <!-- Fetching and rendering of messages are handled dynamically via JS -->
            </div>

            <!-- Input area -->
            <footer class="p-3 bg-white border-t border-gray-200 z-10">
                <form id="message-form" class="flex items-center gap-2 max-w-4xl mx-auto">
                    <!-- Attachment button with dropdown options -->
                    <div class="relative">
                        <button id="attachment-btn" type="button" class="w-10 h-10 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition focus:outline-none">
                            <i data-lucide="paperclip" class="w-5 h-5"></i>
                        </button>
                        
                        <!-- Dropdown panel -->
                        <div id="attachment-panel" class="hidden absolute bottom-12 left-0 bg-white shadow-xl rounded-2xl p-2 border border-gray-100 flex flex-col gap-1 w-40 z-20">
                            <!-- Image input -->
                            <label class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-xl cursor-pointer text-xs">
                                <i data-lucide="image" class="w-4 h-4 text-emerald-500"></i>
                                <span>Rasm yuborish</span>
                                <input type="file" id="media-image-input" accept="image/*" class="hidden">
                            </label>
                            <!-- Audio input -->
                            <button type="button" id="voice-record-btn" class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-xl text-left text-xs text-gray-700">
                                <i data-lucide="mic" class="w-4 h-4 text-red-500"></i>
                                <span id="record-text">Audioni yozish</span>
                            </button>
                            <!-- Location trigger -->
                            <button type="button" id="location-btn" class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-xl text-left text-xs text-gray-700">
                                <i data-lucide="map-pin" class="w-4 h-4 text-blue-500"></i>
                                <span>Lokatsiya</span>
                            </button>
                        </div>
                    </div>

                    <!-- Text input -->
                    <input type="text" id="chat-input" placeholder="Xabar yozing..." class="flex-grow bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#2EA6DA]">

                    <!-- Send action button -->
                    <button type="submit" class="w-10 h-10 bg-[#2EA6DA] hover:bg-[#258BB8] text-white rounded-full flex items-center justify-center transition shadow-md focus:outline-none">
                        <i data-lucide="send" class="w-5 h-5 rotate-45 transform -translate-x-0.5"></i>
                    </button>
                </form>
            </footer>
        </main>
    </div>

    <!-- Image Expansion pop-up Modal -->
    <div id="lightbox-modal" class="hidden fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
        <button id="lightbox-close" class="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition focus:outline-none">
            <i data-lucide="x" class="w-6 h-6"></i>
        </button>
        <img id="lightbox-img" src="" alt="Yoyilgan rasm" class="max-w-full max-h-full rounded-lg shadow-2xl object-contain">
    </div>
<?php endif; ?>

<script>
    // Initialize icons
    lucide.createIcons();

    // Setup interactive views
    <?php if (!$loggedIn): ?>
    const authForm = document.getElementById('auth-form');
    const toggleBtn = document.getElementById('toggle-auth-mode');
    const signUpFields = document.getElementById('sign-up-fields');
    let isRegisterMode = false;

    toggleBtn.addEventListener('click', () => {
        isRegisterMode = !isRegisterMode;
        if (isRegisterMode) {
            signUpFields.classList.remove('hidden');
            toggleBtn.innerText = "Menda allaqachon akkaunt bor. Kirish";
            authForm.querySelector('button[type="submit"]').innerText = "Ro'yxatdan o'tish";
        } else {
            signUpFields.classList.add('hidden');
            toggleBtn.innerText = "Menda akkaunt yo'q. Ro'yxatdan o'tish";
            authForm.querySelector('button[type="submit"]').innerText = "Tizimga kirish";
        }
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(authForm);
        const action = isRegisterMode ? 'register' : 'login';
        
        try {
            const res = await fetch(`api.php?action=${action}`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                window.location.reload();
            } else {
                alert(data.error || 'Noma\'lum xatolik yuz berdi');
            }
        } catch (err) {
            alert('Server ulanishida muammo!');
        }
    });
    <?php else: ?>
    // Authorized Code Space
    const attachmentBtn = document.getElementById('attachment-btn');
    const attachmentPanel = document.getElementById('attachment-panel');
    const messagesContainer = document.getElementById('messages-container');
    const mediaImageInput = document.getElementById('media-image-input');
    const voiceRecordBtn = document.getElementById('voice-record-btn');
    const textInput = document.getElementById('chat-input');
    const locationBtn = document.getElementById('location-btn');
    const messageForm = document.getElementById('message-form');

    // Lightbox Selectors
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    // Toggle attachment panel visibility
    attachmentBtn.addEventListener('click', () => {
        attachmentPanel.classList.toggle('hidden');
    });

    // Close panel when click occurs elsewhere
    document.addEventListener('click', (e) => {
        if (!attachmentBtn.contains(e.target) && !attachmentPanel.contains(e.target)) {
            attachmentPanel.classList.add('hidden');
        }
    });

    // Send Message AJAX controller
    async function submitMessage(formData) {
        try {
            const res = await fetch('api.php?action=send_message', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                textInput.value = '';
                attachmentPanel.classList.add('hidden');
                loadMessages();
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error('Xabarni uzatishda muammo:', err);
        }
    }

    // Attachment: Image select
    mediaImageInput.addEventListener('change', async () => {
        if (mediaImageInput.files.length === 0) return;
        const formData = new FormData();
        formData.append('media_file', mediaImageInput.files[0]);
        formData.append('media_type', 'photo');
        formData.append('message_text', 'Rasm yuborildi');
        await submitMessage(formData);
    });

    // Attachment: Simulated Voice record handler
    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;

    voiceRecordBtn.addEventListener('click', async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Platforma audio yozishni qo\'llab quvvatlamaydi!');
            return;
        }

        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                isRecording = true;
                document.getElementById('record-text').innerText = 'Yozishni to\'xtatish...';

                mediaRecorder.ondataavailable = (e) => {
                    audioChunks.push(e.data);
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                    const file = new File([audioBlob], 'voice_recording.mp3', { type: 'audio/mp3' });
                    const formData = new FormData();
                    formData.append('media_file', file);
                    formData.append('media_type', 'voice');
                    formData.append('message_text', 'Ovozli xabar');
                    await submitMessage(formData);
                    document.getElementById('record-text').innerText = 'Audioni yozish';
                };

                mediaRecorder.start();
            } catch (err) {
                alert('Mikrofondan foydalanish xatosi: ' + err.message);
            }
        } else {
            mediaRecorder.stop();
            isRecording = false;
        }
    });

    // Attachment: Location selection simulation
    locationBtn.addEventListener('click', async () => {
        // Safe mock coordinate tags for Tashkent center points
        const lat = 41.311081;
        const lon = 69.240562;

        const formData = new FormData();
        formData.append('media_type', 'location');
        formData.append('latitude', lat);
        formData.append('longitude', lon);
        formData.append('message_text', 'Manzilim: Toshkent shahri koordinatasi');
        await submitMessage(formData);
    });

    // Normal Text message submission
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = textInput.value.trim();
        if (!text) return;

        const formData = new FormData();
        formData.append('message_text', text);
        formData.append('media_type', 'text');
        await submitMessage(formData);
    });

    // Pull Messages periodic updater (Long poll simulation)
    async function loadMessages() {
        try {
            const res = await fetch('api.php?action=get_messages');
            const data = await res.json();
            if (data.messages) {
                renderMessages(data.messages);
            }
        } catch (err) {
            console.error('Yuklash xatoligi:', err);
        }
    }

    // Render logic
    function renderMessages(list) {
        messagesContainer.innerHTML = '';
        list.forEach(msg => {
            const currentUserId = "<?php echo $_SESSION['user_id']; ?>";
            const isOutgoing = msg.sender_id == currentUserId;
            const messageWrapper = document.createElement('div');
            messageWrapper.className = `flex ${isOutgoing ? 'justify-end' : 'justify-start'} w-full`;
            
            let mediaContent = '';
            // Match custom formats
            if (msg.media_type === 'photo' && msg.media_url) {
                mediaContent = `<img src="${msg.media_url}" class="rounded-xl max-w-xs h-auto border pointer-events-auto cursor-zoom-in my-1.5 shadow-sm" onclick="showLightbox('${msg.media_url}')">`;
            } else if (msg.media_type === 'voice' && msg.media_url) {
                mediaContent = `<audio src="${msg.media_url}" class="mt-1 max-w-full" controls></audio>`;
            } else if (msg.media_type === 'location') {
                mediaContent = `
                    <div class="p-2 border rounded-xl bg-blue-50/50 flex flex-col gap-1.5 max-w-xs mt-1.5">
                        <div class="flex items-center gap-1 text-blue-600 font-semibold text-xs">
                            <i data-lucide="map-pin" class="w-4 h-4"></i>
                            <span>Joylashgan Yer (Lokatsiya)</span>
                        </div>
                        <p class="text-xs text-gray-500 font-mono">Kenglik: ${msg.latitude}, Uzunlik: ${msg.longitude}</p>
                        <a href="https://maps.google.com/?q=${msg.latitude},${msg.longitude}" target="_blank" class="text-xs text-blue-500 hover:underline font-bold">Xaritada ochish →</a>
                    </div>
                `;
            }

            const bubbleClass = isOutgoing ? 'message-outgoing' : 'message-incoming';
            
            messageWrapper.innerHTML = `
                <div class="max-w-[85%] sm:max-w-md ${bubbleClass} shadow-xs p-3 relative group transition">
                    <div class="flex justify-between items-start gap-3">
                        <span class="text-xs font-bold ${isOutgoing ? 'text-emerald-700' : 'text-blue-600'}">${msg.fullname}</span>
                        <div class="flex items-center gap-1.5">
                            <span class="text-[9px] text-gray-400 font-mono">${new Date(msg.created_at).toLocaleTimeString('uz-UZ', {hour: '2-digit', minute: '2-digit'})}</span>
                            <!-- Delete action for self/everyone -->
                            <button onclick="deleteChatMessage(${msg.id})" class="opacity-0 group-hover:opacity-100 transition absolute top-2 right-2 text-red-500 hover:text-red-700" title="O'chirish">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                    <p class="text-sm mt-1 mb-0.5 leading-relaxed">${msg.message_text ? msg.message_text : ''}</p>
                    ${mediaContent}
                </div>
            `;
            
            messagesContainer.appendChild(messageWrapper);
        });

        // Autofocus view scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        lucide.createIcons();
    }

    // Full screen expandable view handler
    function showLightbox(src) {
        lightboxImg.src = src;
        lightboxModal.classList.remove('hidden');
    }

    lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.add('hidden');
    });

    async function deleteChatMessage(id) {
        if (!confirm('Xabarni haqqoniy ravishda hammasi uchun o\'chirmoqchimisiz?')) return;
        try {
            const res = await fetch(`api.php?action=delete_message&id=${id}`);
            const data = await res.json();
            if (data.success) {
                loadMessages();
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error('O\'chirish xatoligi:', err);
        }
    }

    // Refresh every 3 seconds to test in client
    setInterval(loadMessages, 3000);
    loadMessages();
    <?php endif; ?>
</script>
</body>
</html>
