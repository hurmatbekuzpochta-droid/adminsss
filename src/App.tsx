/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, Paperclip, Image, Mic, MicOff, MapPin, Trash2, Heart, 
  Smile, ShieldCheck, ArrowLeft, Volume2, Plus, LogIn, Sparkles, 
  Users, User, Check, CheckCheck, Menu, X, Smartphone, 
  Copy, Monitor, Settings, Eye, Globe
} from "lucide-react";

// Predefined chat rooms/contacts interface
interface Contact {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  statusText: string;
  isGroup: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  mediaType: 'text' | 'photo' | 'video' | 'voice' | 'location';
  mediaUrl?: string;
  latitude?: number;
  longitude?: number;
  timestamp: Date;
  read: boolean;
}

const PRESET_CONTACTS: Contact[] = [
  {
    id: "group-1",
    name: "Toshkent Grand Guruh",
    nickname: "@grand_tashkent",
    avatar: "TG",
    color: "bg-[#2EA6DA]",
    isOnline: true,
    statusText: "152 a'zo faol",
    isGroup: true
  },
  {
    id: "bot-1",
    name: "Hikmatlar AI Bot",
    nickname: "@uz_hikmat_bot",
    avatar: "HB",
    color: "bg-emerald-500",
    isOnline: true,
    statusText: "online • bot",
    isGroup: false
  },
  {
    id: "friend-1",
    name: "Hurmatbek (Biznes Hamkor)",
    nickname: "@hurmat_developer",
    avatar: "H",
    color: "bg-amber-500",
    isOnline: true,
    statusText: "yozmoqda...",
    isGroup: false
  }
];

const PRESET_PROVERBS = [
  "Mehmon — atoyi xudo.",
  "Ilm — baxt kaliti.",
  "Do'st achitib gapirar, dushman — kuldirib.",
  "Til — dil kaliti.",
  "Tomchi-tomchi ko'l bo'lur.",
  "Yaxshi so'z — jon ozig'i."
];

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("tg_auth") === "true";
  });
  const [userProfile, setUserProfile] = useState<{
    fullname: string;
    nickname: string;
    avatar: string;
  }>(() => {
    const saved = localStorage.getItem("tg_profile");
    return saved ? JSON.parse(saved) : { fullname: "", nickname: "", avatar: "U" };
  });

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [fullnameInput, setFullnameInput] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Core Chat Application States
  const [activeContactId, setActiveContactId] = useState<string>("group-1");
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("tg_messages_store_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {
        return [];
      }
    }
    // Default messages
    return [
      {
        id: "msg-1",
        senderId: "system",
        senderName: "Admin",
        text: "Assalomu alaykum Toshkent Grand Guruhiga xush kelibsiz! Bu yerda cPanel o'rnatmalari, HTML/PHP texnologiyalari va mukammal chat aloqalarini sinab ko'rishingiz mumkin.",
        mediaType: 'text',
        timestamp: new Date(Date.now() - 3600000),
        read: true
      },
      {
        id: "msg-2",
        senderId: "friend-1",
        senderName: "Hurmatbek",
        text: "Salom do'stlar! Bu chat juda zo'r ekan, ovozli xabar va lokatsiyalar ham bemalol ishlaydi.",
        mediaType: 'text',
        timestamp: new Date(Date.now() - 1800000),
        read: true
      }
    ];
  });

  const [inputText, setInputText] = useState("");
  const [showAttachmentDropdown, setShowAttachmentDropdown] = useState(false);
  const [chatWallpaper, setChatWallpaper] = useState<string>("default-pattern");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Responsiveness: Mobile sidebar state
  const [mobileSidebarActive, setMobileSidebarActive] = useState(true);

  // Admin panel views
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminToken, setAdminToken] = useState("GOCSPX-v1_example_google_token_key_2026");
  const [activeCopiedText, setActiveCopiedText] = useState<string | null>(null);

  // Persistent storage coordination
  useEffect(() => {
    localStorage.setItem("tg_messages_store_v2", JSON.stringify(messages));
  }, [messages]);

  // Audio Timer Hook
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingSeconds(0);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Dynamic status updates & simple response simulator
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate Hurmatbek writing state
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.senderId === userProfile.nickname && Math.random() > 0.6) {
          // Trigger automatic mock response from Hurmatbek or Bot
          const replyText = activeContactId === "bot-1" 
             ? `Siz uchun hikmat topildi: “${PRESET_PROVERBS[Math.floor(Math.random() * PRESET_PROVERBS.length)]}”`
             : "Albatta, do'stim! Biz barcha loyihalarni cPanel-ga upload qilib ishga tushirsak mukammal ishlaydi.";
          
          const newReply: Message = {
            id: `reply-${Date.now()}`,
            senderId: activeContactId,
            senderName: activeContactId === "bot-1" ? "Hikmatlar AI Bot" : "Hurmatbek",
            text: replyText,
            mediaType: 'text',
            timestamp: new Date(),
            read: true
          };
          return [...prev, newReply];
        }
        return prev;
      });
    }, 12000);

    return () => clearInterval(timer);
  }, [activeContactId, userProfile.nickname]);

  // Core Login Execution
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    if (isRegistering) {
      if (!fullnameInput.trim() || !nicknameInput.trim()) {
        alert("Ism oila va taxallus kiritilishi shart!");
        return;
      }
      const nicknameClean = nicknameInput.trim().startsWith("@") ? nicknameInput.trim() : `@${nicknameInput.trim()}`;
      const profile = {
        fullname: fullnameInput.trim(),
        nickname: nicknameClean,
        avatar: fullnameInput.trim().substring(0, 2).toUpperCase()
      };
      localStorage.setItem("tg_profile", JSON.stringify(profile));
      localStorage.setItem("tg_auth", "true");
      setUserProfile(profile);
      setIsAuthenticated(true);
    } else {
      // Direct pass for demo
      const profile = {
        fullname: usernameInput.trim() + " UZ",
        nickname: `@${usernameInput.trim()}`,
        avatar: usernameInput.trim().substring(0, 2).toUpperCase()
      };
      localStorage.setItem("tg_profile", JSON.stringify(profile));
      localStorage.setItem("tg_auth", "true");
      setUserProfile(profile);
      setIsAuthenticated(true);
    }
  };

  // Logout reset
  const handleLogout = () => {
    localStorage.removeItem("tg_auth");
    localStorage.removeItem("tg_profile");
    setIsAuthenticated(false);
    setUserProfile({ fullname: "", nickname: "", avatar: "U" });
  };

  // Submit Text/Generic message
  const handleSendMessage = (textToSend = inputText, type: Message['mediaType'] = 'text', mediaUrl?: string, lat?: number, lon?: number) => {
    if (!textToSend.trim() && !mediaUrl && type !== 'location') return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: userProfile.nickname,
      senderName: userProfile.fullname,
      text: textToSend,
      mediaType: type,
      mediaUrl: mediaUrl,
      latitude: lat,
      longitude: lon,
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setShowAttachmentDropdown(false);

    // Trigger instant trigger responses for Bot
    if (activeContactId === "bot-1" && type === 'text') {
      setTimeout(() => {
        const matchingProverb = PRESET_PROVERBS[Math.floor(Math.random() * PRESET_PROVERBS.length)];
        const botReply: Message = {
          id: `bot-reply-${Date.now()}`,
          senderId: "bot-1",
          senderName: "Hikmatlar AI Bot",
          text: `Sizga atalgan sharqona hikmat: \n“${matchingProverb}”`,
          mediaType: 'text',
          timestamp: new Date(),
          read: true
        };
        setMessages(prev => [...prev, botReply]);
      }, 1000);
    }
    
    // Toggle view on mobile to show messaging area
    setMobileSidebarActive(false);
  };

  // Trigger Local Image Selection
  const handleImageUploadTrigger = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleSendMessage("Chiroyli rasm ulashildi", 'photo', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Location simulation attachment
  const handleSendLocation = (spotName: string, lat: number, lon: number) => {
    handleSendMessage(`Joylashgan joy: ${spotName}`, 'location', undefined, lat, lon);
  };

  // Audio Recording Native Control
  const startRecordingAudio = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Sizning brauzeringiz mikrofon yozishni qo'llab-quvvatlamaydi!");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const record = new MediaRecorder(stream);
      mediaRecorderRef.current = record;
      audioChunksRef.current = [];

      record.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      record.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audUrl = URL.createObjectURL(audioBlob);
        handleSendMessage("Ovozli xabar yuborildi", 'voice', audUrl);
      };

      record.start();
      setIsRecording(true);
    } catch (err: any) {
      // Fallback virtual audio simulation for browser restriction
      console.warn("Real microphone entry error. Initializing virtual simulation...", err);
      setIsRecording(true);
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    } else {
      // Handled in simulation
      const simulatedWaveUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      handleSendMessage("Simulyatsiya qilingan ovozli xabar", 'voice', simulatedWaveUrl);
    }
    setIsRecording(false);
  };

  // Delete message function
  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  // Copy helper
  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setActiveCopiedText(label);
    setTimeout(() => {
      setActiveCopiedText(null);
    }, 2500);
  };

  const currentActiveContact = PRESET_CONTACTS.find(c => c.id === activeContactId) || PRESET_CONTACTS[0];
  const filteredMessages = messages; // Show all or filter by contact context if wanted, let's show simulated chat streams

  // Quick factory reset
  const handleResetFactory = () => {
    if (confirm("Hamma xabarlar va profil sozlamalarini tozalashni xohlaysizmi?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div id="wrapper-root" className="w-screen h-screen bg-[#1E252D] flex items-center justify-center p-0 md:p-3 overflow-hidden text-gray-200">
      
      {/* Lightbox pop-up Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            id="lightbox-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              id="lightbox-btn-close"
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-md transition"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              id="lightbox-img-source"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={lightboxImage}
              alt="Scaled highres viewer"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-sm font-mono text-gray-400 mt-4 bg-white/5 py-1.5 px-3 rounded-xl border border-white/5">
              Kliklang yoki x yordamida yoping
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic responsive app device simulator wrapper */}
      <div 
        id="applet-frame" 
        className="w-full h-full max-w-7xl md:h-[94vh] bg-[#1a2026] md:rounded-[24px] md:shadow-[0_24px_70px_rgba(0,0,0,0.6)] border border-[#2d3742] flex flex-col overflow-hidden relative"
      >
        
        {/* LOG IN OR REGISTER SCREEN */}
        {!isAuthenticated ? (
          <div id="login-container" className="flex-grow flex flex-col justify-center items-center p-6 bg-radial from-[#1e293b] via-[#0f172a] to-[#020617] relative">
            <div id="login-deco-glow" className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#2EA6DA]/5 blur-3xl pointer-events-none" />
            
            <div className="w-full max-w-md bg-[#1a222d] border border-[#2d3846] rounded-[28px] p-6 md:p-8 flex flex-col gap-6 text-center shadow-2xl">
              <div>
                <div id="tg-logo-badge" className="w-16 h-16 bg-gradient-to-tr from-[#2ca5da] to-[#3ca9fc] text-white rounded-3xl mx-auto flex items-center justify-center shadow-[0_10px_25px_rgba(46,166,218,0.3)] animate-bounce">
                  <Send className="w-8 h-8 rotate-45 transform -translate-x-0.5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-4">Telegram Web Clone</h2>
                <p className="text-xs text-[#a4b5c6] mt-1.5">
                  cPanel uchun maxsus tayyorlangan tezkor xabar almashish prototipi
                </p>
              </div>

              <form id="app-auth-form" onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-[#738a9e] mb-1.5">
                    Kirish Logini (Username)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="hurmatbek"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full bg-[#11171d] border border-[#2d3846] rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2EA6DA] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-[#738a9e] mb-1.5">
                    Tizim Paroli
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Siz xohlagan ixtiyoriy parol"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-[#11171d] border border-[#2d3846] rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2EA6DA] transition-all"
                  />
                </div>

                {isRegistering && (
                  <motion.div
                    id="register-input-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 pt-4 border-t border-[#2d3846]"
                  >
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-[#738a9e] mb-1.5">
                        Ism va Familiyangiz
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Hurmatbek UZ"
                        value={fullnameInput}
                        onChange={(e) => setFullnameInput(e.target.value)}
                        className="w-full bg-[#11171d] border border-[#2d3846] rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2EA6DA] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-[#738a9e] mb-1.5">
                        Foydalanuvchi Taxallusi (Nickname)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="@hurmatbek"
                        value={nicknameInput}
                        onChange={(e) => setNicknameInput(e.target.value)}
                        className="w-full bg-[#11171d] border border-[#2d3846] rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2EA6DA] transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-[#2ca5da] to-[#2594c7] hover:brightness-110 active:scale-[0.99] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition shadow-lg"
                >
                  {isRegistering ? "Profilni yaratish va kirish" : "Tizimga xavfsiz kirish"}
                </button>
              </form>

              <div className="flex flex-col gap-2">
                <button
                  id="btn-toggle-auth"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-xs text-[#2EA6DA] hover:underline font-medium"
                >
                  {isRegistering ? "Menda allaqachon hisob bor • Kirish" : "Menda akkaunt yo'q • Ro'yxatdan o'tish"}
                </button>
                <div className="text-[10px] text-gray-400 mt-2">
                  Demo login paroli: istalgan narsani yozishingiz mumkin (e.g. 12345)
                </div>
              </div>

            </div>
          </div>
        ) : (
          
          /* AUTHENTICATED ADVANCED DESKTOP/MOBILE WORKSPACE */
          <div id="auth-layout" className="flex-grow flex overflow-hidden h-full relative">
            
            {/* SIDEBAR: Contacts and Simulated logs */}
            <aside 
              id="sidebar-container" 
              className={`absolute md:relative inset-y-0 left-0 z-30 w-full md:w-[380px] bg-[#1a222c] border-r border-[#242f3d] flex flex-col transition-transform duration-300 md:translate-x-0 ${
                mobileSidebarActive ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              {/* Header profile info */}
              <div id="sidebar-header" className="p-4 bg-[#24303f] flex items-center justify-between border-b border-[#1b2532]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2ca5da] to-[#1e8cc0] text-white flex items-center justify-center font-extrabold text-sm border-2 border-[#2b3a4a]">
                    {userProfile.avatar}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-white line-clamp-1 leading-tight">{userProfile.fullname}</h3>
                    <p className="text-[11px] text-[#2EA6DA] font-mono">{userProfile.nickname}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    id="admin-btn"
                    onClick={() => setIsAdminView(!isAdminView)} 
                    className={`p-2 rounded-xl transition ${isAdminView ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-700/60'}`}
                    title="Admin sozlamalari"
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </button>
                  <button 
                    id="reset-btn"
                    onClick={handleResetFactory} 
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition"
                    title="Tozalash"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contacts / Rooms tab */}
              <div id="contacts-scroller" className="flex-grow overflow-y-auto p-2 space-y-1.5">
                <span id="contacts-label" className="block text-[10px] font-semibold text-gray-500 tracking-wider uppercase px-3 py-2 mt-1">
                  Muloqot xonalari (Chats)
                </span>
                
                {PRESET_CONTACTS.map((contact) => {
                  const isActive = activeContactId === contact.id;
                  return (
                    <button
                      key={contact.id}
                      onClick={() => {
                        setActiveContactId(contact.id);
                        setMobileSidebarActive(false); // Auto hide sidebar on mobile select
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl cursor-pointer text-left transition-all border ${
                        isActive 
                        ? 'bg-[#293646] border-[#37495e] text-white shadow-md' 
                        : 'bg-transparent border-transparent hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <div className="relative">
                        <div className={`w-11 h-11 rounded-2xl ${contact.color} text-white flex items-center justify-center font-black text-sm`}>
                          {contact.avatar}
                        </div>
                        {contact.isOnline && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-3 border-[#1a222c] animate-pulse"></span>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-sm font-bold truncate">{contact.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">11:08</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{contact.nickname}</p>
                          <span className="text-[9px] text-[#2EA6DA] bg-[#2EA6DA]/15 px-1.5 py-0.5 rounded-full font-semibold">{contact.statusText}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}

                <div id="sidebar-cpanel-banner" className="mt-8 mx-2 p-3.5 bg-[#253246]/50 border border-[#30455d]/40 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2 text-[#2EA6DA]">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">cPanel integration</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-light">
                    Ushbu chat loyihasini hostingga yuklab ishlatish kodi tayyor! Tepada joylashgan <strong className="text-orange-400">Admin</strong> belgisi orqali PHP fayllarni oling.
                  </p>
                </div>
              </div>

              {/* Sidebar bottom indicator */}
              <div id="sidebar-footer" className="p-3 border-t border-[#242f3d] bg-[#141b23] text-center text-[10px] text-gray-500 font-mono">
                Oxirgi faollik: 2026-06-01 11:08 UTC
              </div>
            </aside>

            {/* CHAT DISPLAY CONTAINER */}
            <main id="chat-scroller" className="flex-grow flex flex-col h-full bg-[#0d1218] relative z-10 transition-all">
              
              {/* Header profile of current talk */}
              <header id="chat-bar-header" className="h-16 bg-[#161f28] border-b border-[#242f3d] px-4 flex items-center justify-between z-10 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    id="mobile-menu-btn"
                    onClick={() => setMobileSidebarActive(true)} 
                    className="md:hidden p-2 bg-[#2d3a4e]/40 hover:bg-[#2d3a4e] text-white rounded-xl transition mr-1"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  
                  <div className={`w-10 h-10 rounded-2xl ${currentActiveContact.color} text-white flex items-center justify-center font-black`}>
                    {currentActiveContact.avatar}
                  </div>
                  
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white mb-0.5 leading-snug">{currentActiveContact.name}</h4>
                    <p className="text-[10px] text-emerald-400 font-semibold">{currentActiveContact.statusText}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    id="active-settings-btn"
                    onClick={() => setIsAdminView(!isAdminView)} 
                    className="p-2 hover:bg-gray-800 text-gray-400 rounded-xl transition"
                    title="Ko'rish"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button 
                    id="btn-active-logout"
                    onClick={handleLogout} 
                    className="text-xs bg-[#2d353f] hover:bg-red-900/40 text-gray-300 font-bold py-1.5 px-3 rounded-lg transition"
                  >
                    Chiqish
                  </button>
                </div>
              </header>

              {/* CHAT WALLPAPER ENGINE CHANNELS */}
              {!isAdminView ? (
                <>
                  {/* WALLPAPER CONTAINER wrapper */}
                  <div 
                    id="chat-wall-viewport"
                    className="flex-grow overflow-y-auto px-4 py-6 space-y-4 relative"
                    style={{
                      backgroundImage: chatWallpaper === 'default-pattern' 
                        ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'80\' viewBox=\'0 0 80 80\'%3E%3Cg fill=\'%23537295\' fill-opacity=\'0.06\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.133 7-7s-3.134-7-7-7-7 3.133-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z\'/%3E%3C/g%3E%3C/svg%3E")'
                        : undefined,
                      backgroundColor: chatWallpaper === 'sleek-slate' ? '#111822' : chatWallpaper === 'desert-sand' ? '#221B15' : '#0B1016'
                    }}
                  >
                    
                    {/* Welcome Notice Bubble */}
                    <div className="flex justify-center my-2">
                      <span className="bg-[#1e2733]/85 text-[11px] text-gray-300 px-4 py-1.5 rounded-full border border-white/5 font-medium shadow-xs">
                        Toshkent vaqti: {new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* RENDER MESSAGES LIST */}
                    {filteredMessages.map((msg) => {
                      const isOwner = msg.senderId === userProfile.nickname;
                      return (
                        <motion.div
                          id={`msg-card-${msg.id}`}
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwner ? 'justify-end' : 'justify-start'} w-full items-end gap-2 my-2`}
                        >
                          {!isOwner && (
                            <div className="w-8 h-8 rounded-xl bg-gray-700 font-extrabold text-[#2EA6DA] flex items-center justify-center text-xs flex-shrink-0">
                              {msg.senderName.substring(0,2).toUpperCase()}
                            </div>
                          )}

                          <div 
                            className={`max-w-[85%] sm:max-w-md p-3 px-4 relative shadow-md group transition ${
                              isOwner 
                                ? 'bg-gradient-to-tr from-[#2b5c8f] to-[#3a75b2] text-white rounded-[18px_18px_4px_18px]' 
                                : 'bg-[#182533] text-gray-100 rounded-[18px_18px_18px_4px] border border-[#233547]'
                            }`}
                          >
                            <div className="flex justify-between items-baseline gap-4 mb-1">
                              <span className={`text-[11px] font-bold pb-0.5 ${isOwner ? 'text-[#aee2ff]' : 'text-[#2EA6DA]'}`}>
                                {msg.senderName}
                              </span>
                              
                              <div className="flex items-center gap-1">
                                <span className="text-[9px] text-gray-400 font-mono">
                                  {msg.timestamp.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false})}
                                </span>
                                {isOwner && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                              </div>
                            </div>

                            {/* Normal Chat message content */}
                            {msg.text && (
                              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                {msg.text}
                              </p>
                            )}

                            {/* Render Photo attach */}
                            {msg.mediaType === 'photo' && msg.mediaUrl && (
                              <div className="relative mt-2 rounded-xl overflow-hidden group/image border border-white/5 bg-black/20">
                                <img 
                                  src={msg.mediaUrl} 
                                  alt="Yuborilgan fayl" 
                                  className="w-full max-h-72 object-cover cursor-zoom-in hover:brightness-105 transition"
                                  onClick={() => setLightboxImage(msg.mediaUrl || null)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/image:opacity-100 flex items-end p-2 transition">
                                  <span className="text-[10px] text-white font-mono uppercase">Kliklang • Kattalashtirish</span>
                                </div>
                              </div>
                            )}

                            {/* Render Simulated Voice player */}
                            {msg.mediaType === 'voice' && (
                              <div className="mt-2.5 bg-black/20 p-2 rounded-xl border border-white/5 flex items-center gap-3">
                                <button className="w-8 h-8 rounded-full bg-[#2EA6DA]/20 text-[#2EA6DA] flex items-center justify-center hover:bg-[#2EA6DA]/30 focus:outline-none transition active:scale-95">
                                  <Volume2 className="w-4 h-4" />
                                </button>
                                <div className="flex-grow flex flex-col">
                                  <div className="h-6 flex items-center gap-0.5">
                                    <span className="h-3 w-1 bg-[#2EA6DA] rounded-full animate-pulse"></span>
                                    <span className="h-5 w-1 bg-[#2EA6DA]/85 rounded-full animate-pulse"></span>
                                    <span className="h-4 w-1 bg-[#2EA6DA]/70 rounded-full animate-pulse"></span>
                                    <span className="h-2 w-1 bg-[#2EA6DA]/50 rounded-full"></span>
                                    <span className="h-3 w-1 bg-[#2EA6DA] rounded-full"></span>
                                    <span className="h-5 w-1 bg-[#2EA6DA]/85 rounded-full"></span>
                                    <span className="h-4 w-1 bg-[#2EA6DA] rounded-full"></span>
                                    <span className="h-2 w-1 bg-[#2EA6DA]/30 rounded-full"></span>
                                  </div>
                                  <span className="text-[9px] text-gray-400 font-mono">0:04 • Ovozli xabar</span>
                                </div>
                              </div>
                            )}

                            {/* Render Location map with Google maps redirection hyperlink */}
                            {msg.mediaType === 'location' && (
                              <div className="mt-2.5 bg-black/20 border border-[#2EA6DA]/35 p-3 rounded-2xl flex flex-col gap-2">
                                <div className="flex items-center gap-1.5 text-xs text-[#2EA6DA] font-extrabold">
                                  <MapPin className="w-4 h-4 text-orange-500 animate-bounce" />
                                  <span>Toshkent lokatsiyasi</span>
                                </div>
                                <p className="text-[11px] font-mono text-gray-300">
                                  Kenglik: <b>{msg.latitude}</b>, Uzunlik: <b>{msg.longitude}</b>
                                </p>
                                <a 
                                  href={`https://maps.google.com/?q=${msg.latitude},${msg.longitude}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-[#2EA6DA] font-bold hover:underline bg-white/5 py-1 px-2.5 rounded-lg text-center"
                                >
                                  Xaritada ko'rish →
                                </a>
                              </div>
                            )}

                            {/* DELETE xabar button for absolute authority */}
                            <button
                              id={`delete-btn-${msg.id}`}
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 text-red-400 rounded-lg transition"
                              title="Xabarni o'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            
                          </div>
                        </motion.div>
                      );
                    })}

                  </div>

                  {/* BOTTOM INPUT AND CONTROLLERS PANEL */}
                  <footer id="input-chat-footer" className="p-3 bg-[#17212b] border-t border-[#242f3d] flex flex-col gap-2 flex-shrink-0 z-20">
                    
                    {/* Fast presets for Wallpapers & test attachments */}
                    <div id="quick-presets" className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        <span className="text-[10px] font-mono text-gray-400">Wallpapers:</span>
                        <button onClick={() => setChatWallpaper('default-pattern')} className="text-[10px] bg-[#24303f] hover:bg-[#2e3e52] px-2.5 py-1 rounded-lg text-gray-200">Naqshli</button>
                        <button onClick={() => setChatWallpaper('sleek-slate')} className="text-[10px] bg-[#111822] hover:brightness-125 px-2.5 py-1 rounded-lg text-sky-400 font-bold border border-sky-400/15">Sleek Dark</button>
                        <button onClick={() => setChatWallpaper('desert-sand')} className="text-[10px] bg-[#221B15] hover:brightness-125 px-2.5 py-1 rounded-lg text-amber-300">Warm Sand</button>
                      </div>

                      {/* Fast Proverb Trigger */}
                      <button 
                        id="fast-wisdom-tip"
                        onClick={() => handleSendMessage(`AI sharqona hikmatini o'ylamoqda...`, 'text')}
                        className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                      >
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        <span>Hikmat so'rash</span>
                      </button>
                    </div>

                    <form 
                      id="active-message-form"
                      onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                      className="flex items-center gap-2 relative"
                    >
                      {/* Attachment trigger */}
                      <div className="relative">
                        <button
                          id="active-clip-btn"
                          type="button"
                          onClick={() => setShowAttachmentDropdown(!showAttachmentDropdown)}
                          className="w-11 h-11 bg-[#24303f] hover:bg-[#2d3b4e] text-gray-300 rounded-xl flex items-center justify-center transition active:scale-95"
                          title="Fayl qo'shish"
                        >
                          <Paperclip className="w-5 h-5" />
                        </button>
                        
                        {/* Dropdown panel detail */}
                        {showAttachmentDropdown && (
                          <div id="active-clip-dropdown" className="absolute bottom-14 left-0 bg-[#1e2a38] border border-[#2c3d52] shadow-2xl rounded-2xl p-2 flex flex-col gap-1 w-44 z-50">
                            
                            {/* Device Image Select */}
                            <label className="flex items-center gap-2 px-3 py-2.5 hover:bg-white/5 rounded-xl cursor-pointer text-xs text-gray-200 transition-all">
                              <Image className="w-4 h-4 text-emerald-400" />
                              <span>Rasm yuborish</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageUploadTrigger} 
                              />
                            </label>

                            {/* Location preset 1 */}
                            <button
                              id="btn-loc-chorsu"
                              type="button"
                              onClick={() => handleSendLocation("Chorsu bozori", 41.327429, 69.231149)}
                              className="flex items-center gap-2 px-3 py-2.5 hover:bg-white/5 rounded-xl text-left text-xs text-gray-200 transition-all"
                            >
                              <MapPin className="w-4 h-4 text-blue-400" />
                              <span>Chorsu Bozori</span>
                            </button>

                            {/* Location preset 2 */}
                            <button
                              id="btn-loc-city"
                              type="button"
                              onClick={() => handleSendLocation("Tashkent City", 41.311081, 69.240562)}
                              className="flex items-center gap-2 px-3 py-2.5 hover:bg-white/5 rounded-xl text-left text-xs text-gray-200 transition-all"
                            >
                              <MapPin className="w-4 h-4 text-orange-400" />
                              <span>Tashkent City</span>
                            </button>

                            <div className="h-px bg-white/5 my-1" />
                            <div className="text-[9px] text-[#2EA6DA] px-3">Tanlagan zahoti yuboriladi</div>
                          </div>
                        )}
                      </div>

                      {/* Main Message Input Bar */}
                      <input
                        id="active-chat-input"
                        type="text"
                        placeholder="Xabar yozing (Telegram cPanel Clone)..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="flex-grow bg-[#11171d] border border-[#24303f] rounded-xl py-3 px-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#2EA6DA]"
                      />

                      {/* Micro audio recording trigger */}
                      <button
                        id="mic-recording-btn"
                        type="button"
                        onClick={isRecording ? stopRecordingAudio : startRecordingAudio}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition active:scale-95 ${
                          isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[#24303f] hover:bg-[#2d3b4e] text-gray-300'
                        }`}
                        title={isRecording ? "Ovozni to'xtatish" : "Ovoz yozish"}
                      >
                        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>

                      {/* Send button */}
                      <button
                        id="active-send-btn"
                        type="submit"
                        className="w-11 h-11 bg-gradient-to-tr from-[#2ca5da] to-[#1e8cc0] hover:brightness-110 text-white rounded-xl flex items-center justify-center transition active:scale-95 shadow-md"
                      >
                        <Send className="w-4 h-4 rotate-45 transform -translate-x-0.5" />
                      </button>
                    </form>

                    {isRecording && (
                      <div id="recording-stats" className="flex items-center gap-2 text-red-400 text-xs font-mono px-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                        <span>Mikrofon faol: {recordingSeconds} soniya. Havola yozib yuborish uchun to'xtating.</span>
                      </div>
                    )}
                  </footer>
                </>
              ) : (
                
                /* DYNAMIC INTERACTIVE ADMIN PANEL EXPORTER VIEW */
                <div id="admin-panel-container" className="flex-grow overflow-y-auto p-4 md:p-8 bg-[#10161d] space-y-6">
                  
                  {/* Title Bar */}
                  <div className="flex justify-between items-center pb-4 border-b border-[#242f3d]">
                    <div className="text-left">
                      <div className="flex items-center gap-2 text-orange-500 font-extrabold text-sm mb-1">
                        <ShieldCheck className="w-5 h-5 animate-pulse" />
                        <span>CPANEL ADMIN INTERACTIVE LOGS</span>
                      </div>
                      <h2 className="text-xl font-bold text-white">Xosting va Tizim Boshqaruvi</h2>
                    </div>

                    <button 
                      id="admin-close-btn"
                      onClick={() => setIsAdminView(false)} 
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202935] hover:bg-[#2d3b4e] text-gray-300 rounded-xl text-xs font-semibold transition"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Orqaga Chatga
                    </button>
                  </div>

                  {/* Operational Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Form settings panel */}
                    <div className="bg-[#161f28] border border-[#242f3d] p-5 rounded-3xl space-y-4">
                      <h3 className="text-sm font-bold text-gray-300 pb-1.5 border-b border-white/5">Tizim Sozlamalari</h3>
                      
                      <div className="space-y-1 text-left">
                        <label className="text-xs font-mono text-gray-400">Google OAuth Client ID / Token</label>
                        <input 
                          type="text" 
                          value={adminToken}
                          onChange={(e) => setAdminToken(e.target.value)}
                          className="w-full bg-[#11171d] border border-white/10 rounded-xl p-2.5 text-xs text-orange-400 font-mono" 
                        />
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-gray-300 font-light">Online foydalanuvchilar soni</span>
                        <span className="text-xs font-mono bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/25">
                          Pulse check: online
                        </span>
                      </div>

                      <button
                        onClick={() => alert("Muvaffaqiyatli saqlandi! barcha cPanel sozlamalari yangilandi.")}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
                      >
                        Sozlamalarni qo'llash (Apply Changes)
                      </button>
                    </div>

                    {/* Quick Database view logs */}
                    <div className="bg-[#161f28] border border-[#242f3d] p-5 rounded-3xl space-y-3">
                      <h3 className="text-sm font-bold text-gray-300 pb-1.5 border-b border-white/5 flex justify-between">
                        <span>Ma'lumotlar Bazasi Monitori</span>
                        <span className="text-[10px] font-mono text-emerald-400">PDO ACTIVE</span>
                      </h3>
                      
                      <div className="space-y-2 h-36 overflow-y-auto font-mono text-[10px] text-gray-400 bg-black/30 p-3 rounded-2xl scrollbar-none">
                        <p className="text-gray-500">[2026-06-01 11:08:23] DB Connection success query PDO.</p>
                        <p className="text-emerald-500">[SUCCESS] User {userProfile.fullname} logged in session_id: {Math.floor(Math.random()*90000)}</p>
                        <p className="text-blue-400">[INSERT] Message table write sender: {userProfile.nickname}</p>
                        <p className="text-[#2EA6DA]">[SELECT] Fetch all matching global messages. List count: {messages.length}</p>
                      </div>
                    </div>

                  </div>

                  {/* GIT CLONE CPANEL CODES FOR DOWNLOADING DIRECTLY */}
                  <div className="bg-[#161f28] border border-[#242f3d] p-5 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/5 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white">cPanel Hostinqda Ishlatiladigan PHP / SQL Fayllar</h3>
                        <p className="text-xs text-gray-400">Git clone qilib bemalol PHP hostingga joylashingiz mumkin bo'lgan professional kodlar.</p>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        tayyor oson sozlama
                      </span>
                    </div>

                    {/* Files container */}
                    <div className="space-y-4">
                      
                      {/* File item 1 */}
                      <div className="border border-white/5 bg-black/20 p-3.5 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-emerald-400 font-mono">1. database.sql (MySQL Ma'lumotlar bazasi)</span>
                          <button 
                            onClick={() => handleCopyToClipboard(`CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  nickname VARCHAR(50) NOT NULL UNIQUE,
  fullname VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT 'default_avatar.png',
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_admin TINYINT(1) DEFAULT 0
);`, "sql")}
                            className="text-[11px] font-mono text-[#2EA6DA] hover:underline flex items-center gap-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            {activeCopiedText === "sql" ? "Nusxalandi!" : "Nusxa olish"}
                          </button>
                        </div>
                        <p className="text-xs text-gray-400">Ushbu SQL kodini cPanel phpMyAdmin bo'limiga kirib SQL so'rovnomasiga tashlab runs qilasiz.</p>
                      </div>

                      {/* File item 2 */}
                      <div className="border border-white/5 bg-black/20 p-3.5 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-emerald-400 font-mono">2. config.php (Ulanish sozlamasi)</span>
                          <button 
                            onClick={() => handleCopyToClipboard(`<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'my_db');
define('DB_USER', 'my_user');
define('DB_PASS', 'my_pass');
$pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);`, "config")}
                            className="text-[11px] font-mono text-[#2EA6DA] hover:underline flex items-center gap-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            {activeCopiedText === "config" ? "Nusxalandi!" : "Nusxa olish"}
                          </button>
                        </div>
                        <p className="text-xs text-gray-400">Bu yerda database nomi, foydalanuvchisi va parolini cPanelda yasaganingizdek to'g'irlaysiz.</p>
                      </div>

                    </div>
                  </div>

                </div>
              )}

            </main>

          </div>
        )}

      </div>
    </div>
  );
}
