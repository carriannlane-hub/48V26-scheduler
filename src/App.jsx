import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============================================
// SUPABASE CLIENT
// ============================================
const supabase = createClient(
  'https://vmfprzghlymiwlljrnjp.supabase.co',
  'sb_publishable_MBGeeg28AtVPLNmpdPTJXQ_VWQ4vXyk'
);

// ============================================
// CONFIGURATION
// ============================================
const EVENT_CONFIG = {
  name: "GamiCon48V 2026",
  startTime: new Date('2026-03-21T19:00:00-05:00'), // 7 PM Central
  endTime: new Date('2026-03-23T19:00:00-05:00'),   // 7 PM Central (48 hours)
  shiftDurationHours: 2,
  maxChampionsPerShift: 2,
  maxTechPerShift: 1,
  maxConsecutiveHours: 4,
  requiredBreakHours: 2,
  maxHoursTotal: 12,
  adminPassword: '1F7champ!'
};

// ============================================
// THEME COLORS
// ============================================
const themes = {
  dark: {
    bg: '#1a1a2e',
    bgSecondary: '#2d2d44',
    text: '#f0ebe5', // Lightened for better contrast
    textMuted: '#c4b5a5', // Lightened for better contrast (was #a89984)
    title: '#e2e8f0',
    accent: '#14b8a6',
    techAccent: '#f59e0b',
    border: '#6a6a8a', // Lightened for better visibility (was #4a4a6a)
    available: '#10b981',
    partial: '#0ea5e9',
    full: '#94a3b8',
    selectedBorder: '#2dd4bf',
    error: '#fca5a5', // Lightened for better contrast (was #e57373)
    overlay: 'rgba(0,0,0,0.8)',
    expandBg: '#3d3d5c',
    // High contrast text for colored backgrounds
    onAccent: '#042f2e', // Dark teal on teal backgrounds
    onAvailable: '#052e16', // Dark green on green backgrounds
    onPartial: '#082f49', // Darker blue for better contrast on blue backgrounds
    onTechAccent: '#451a03', // Dark brown on amber backgrounds
  },
  light: {
    bg: '#f8fafc',
    bgSecondary: '#ffffff',
    text: '#1e293b',
    textMuted: '#475569', // Darkened for better contrast (was #64748b)
    title: '#0f172a',
    accent: '#0f766e', // Darkened for better contrast (was #0d9488)
    techAccent: '#b45309', // Darkened for better contrast (was #d97706)
    border: '#94a3b8', // Darkened for better visibility (was #cbd5e1)
    available: '#047857', // Darkened (was #059669)
    partial: '#0369a1', // Darkened (was #0284c7)
    full: '#475569', // Darkened (was #64748b)
    selectedBorder: '#14b8a6',
    error: '#dc2626',
    overlay: 'rgba(0,0,0,0.5)',
    expandBg: '#e2e8f0',
    // High contrast text for colored backgrounds
    onAccent: '#f0fdfa', // Light teal on teal backgrounds
    onAvailable: '#f0fdf4', // Light green on green backgrounds
    onPartial: '#f0f9ff', // Light blue on blue backgrounds
    onTechAccent: '#fffbeb', // Light cream on amber backgrounds
  }
};

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
  en: {
    title: "Event Champion Scheduler",
    subtitle: "GamiCon48V 2026",
    signUp: "Sign Up",
    name: "Your Name",
    email: "Your Email",
    selectShifts: "Select Your Shifts",
    selectRole: "Select Your Role",
    eventChampion: "Event Champion",
    techSupport: "Tech Support Champion",
    techDescription: "Technical troubleshooting experience required. You'll help with A/V, streaming, and technical issues.",
    submit: "Submit Sign-Up",
    submitting: "Submitting...",
    cancel: "Cancel",
    adminMode: "Admin Mode",
    exitAdmin: "Exit Admin",
    clearAll: "Clear All",
    clearAllConfirm: "Are you sure you want to remove ALL sign-ups? This cannot be undone.",
    enterPassword: "Enter admin password",
    login: "Login",
    wrongPassword: "Incorrect password",
    export: "Export Schedule",
    available: "Available",
    partial: "1 Champion",
    full: "Full",
    yourTimezone: "Your timezone",
    centralTime: "Central Time",
    sententralTime: "Sententral Time",
    shift: "Shift",
    champions: "Champions",
    tech: "Tech",
    remove: "Remove",
    add: "Add Champion",
    addTech: "Add Tech",
    save: "Save",
    noShifts: "No shifts selected",
    rules: "How Shifts Work",
    rule1: "Maximum 4 consecutive hours (2 shifts), then 2-hour break required",
    rule2: "Maximum 12 hours total",
    rule3: "2 Event Champions per shift (ideal), 1 minimum",
    rule4: "1 Tech Support Champion per shift",
    rulesDialogue: "Hey Champions! Shifts are 2 hours each. You can take up to 2 shifts back-to-back (4 hours max), then please rest for at least 2 hours. We would like you to take up to 12 hours total. We want you energized, not exhausted! If you have questions, contact Carriann Lane. She's happy to help.",
    blocked: "Blocked (need 2-hour break)",
    dayLimit: "Total limit reached",
    totalLimit: "12-hour limit reached",
    alreadySignedUp: "You're signed up",
    signUpSuccess: "Successfully signed up!",
    scheduleMore: "Schedule More Shifts",
    addToCalendarNow: "Add to Calendar",
    pendingShifts: "shifts ready to add to calendar",
    addAllToCalendar: "Add All to Calendar",
    removeConfirm: "Remove this champion?",
    languageLabel: "Language",
    scheduleFor: "Schedule for",
    open: "open",
    spots: "spots",
    spot: "spot",
    day1: "Saturday",
    day2: "Sunday",
    day3: "Monday",
    nameRequired: "Name is required",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email",
    noShiftsSelected: "Please select at least one shift",
    close: "Close",
    signUpFor: "Sign up for shift",
    removeFrom: "Remove from shift",
    darkMode: "Dark",
    lightMode: "Light",
    theme: "Theme",
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
    addToCalendar: "Add to Calendar",
    googleCalendar: "Google Calendar",
    downloadIcs: "Download .ics",
    emailIcs: "Email to myself",
    calendarEventTitle: "GamiCon48V - Event Champion",
    calendarEventTitleTech: "GamiCon48V - Tech Support",
    icsEmailTip: "Tip: Open the email on your phone, tap the attachment, then tap Add to Calendar.",
    tapToExpand: "TAP TO SEE SHIFTS",
    shiftsAvailable: "shifts available",
    currentShift: "NOW",
    upNext: "UP NEXT",
    eventEnded: "Event has ended. Thank you Champions!",
    confirmTechRole: "Tech Support requires technical experience. Are you sure?",
    techConfirmYes: "Yes, I have tech experience",
    techConfirmNo: "No, go back",
  },
  zh: {
    title: "活动冠军调度器",
    subtitle: "GamiCon48V 2026",
    signUp: "报名",
    name: "您的姓名",
    email: "您的邮箱",
    selectShifts: "选择您的班次",
    selectRole: "选择您的角色",
    eventChampion: "活动冠军",
    techSupport: "技术支持冠军",
    techDescription: "需要技术故障排除经验。您将帮助处理音视频、流媒体和技术问题。",
    submit: "提交报名",
    submitting: "提交中...",
    cancel: "取消",
    adminMode: "管理员模式",
    exitAdmin: "退出管理",
    clearAll: "清除全部",
    clearAllConfirm: "您确定要删除所有报名吗？此操作无法撤销。",
    enterPassword: "输入管理员密码",
    login: "登录",
    wrongPassword: "密码错误",
    export: "导出日程",
    available: "可用",
    partial: "1位冠军",
    full: "已满",
    yourTimezone: "您的时区",
    centralTime: "美国中部时间",
    sententralTime: "Sententral Time",
    shift: "班次",
    champions: "冠军",
    tech: "技术",
    remove: "移除",
    add: "添加冠军",
    addTech: "添加技术",
    save: "保存",
    noShifts: "未选择班次",
    rules: "班次说明",
    rule1: "最多连续4小时（2个班次），之后需要2小时休息",
    rule2: "总共最多12小时",
    rule3: "每班次2名活动冠军（理想），最少1名",
    rule4: "每班次1名技术支持冠军",
    rulesDialogue: "嗨，冠军们！每个班次2小时。您可以连续值班最多2个班次（4小时），之后请休息至少2小时。我们希望每人总共承担最多12小时。我们希望您精力充沛，而不是疲惫不堪！如有问题，请联系 Carriann Lane，她很乐意帮助您。",
    blocked: "已阻止（需要2小时休息）",
    dayLimit: "已达总时限",
    totalLimit: "已达12小时上限",
    alreadySignedUp: "您已报名",
    signUpSuccess: "报名成功！",
    scheduleMore: "安排更多班次",
    addToCalendarNow: "添加到日历",
    pendingShifts: "个班次待添加到日历",
    addAllToCalendar: "全部添加到日历",
    removeConfirm: "移除此冠军？",
    languageLabel: "语言",
    scheduleFor: "日程安排",
    open: "开放",
    spots: "个名额",
    spot: "个名额",
    day1: "周六",
    day2: "周日",
    day3: "周一",
    nameRequired: "姓名为必填项",
    emailRequired: "邮箱为必填项",
    emailInvalid: "请输入有效的邮箱地址",
    noShiftsSelected: "请至少选择一个班次",
    close: "关闭",
    signUpFor: "报名班次",
    removeFrom: "从班次移除",
    darkMode: "深色",
    lightMode: "浅色",
    theme: "主题",
    morning: "早晨",
    afternoon: "下午",
    evening: "傍晚",
    night: "夜间",
    addToCalendar: "添加到日历",
    googleCalendar: "Google 日历",
    downloadIcs: "下载 .ics",
    emailIcs: "发送到我的邮箱",
    calendarEventTitle: "GamiCon48V - 活动冠军",
    calendarEventTitleTech: "GamiCon48V - 技术支持",
    icsEmailTip: "提示：在手机上打开邮件，点击附件，然后点击添加到日历。",
    tapToExpand: "点击查看班次",
    shiftsAvailable: "个班次可用",
    currentShift: "现在",
    upNext: "下一个",
    eventEnded: "活动已结束。感谢冠军们！",
    confirmTechRole: "技术支持需要技术经验。您确定吗？",
    techConfirmYes: "是的，我有技术经验",
    techConfirmNo: "不，返回",
  },
  th: {
    title: "ตารางเวลาแชมเปี้ยนอีเวนต์",
    subtitle: "GamiCon48V 2026",
    signUp: "ลงทะเบียน",
    name: "ชื่อของคุณ",
    email: "อีเมลของคุณ",
    selectShifts: "เลือกกะของคุณ",
    selectRole: "เลือกบทบาทของคุณ",
    eventChampion: "แชมเปี้ยนอีเวนต์",
    techSupport: "แชมเปี้ยนฝ่ายเทคนิค",
    techDescription: "ต้องมีประสบการณ์ด้านเทคนิค คุณจะช่วยเรื่องเสียง/ภาพ การสตรีม และปัญหาทางเทคนิค",
    submit: "ส่งการลงทะเบียน",
    submitting: "กำลังส่ง...",
    cancel: "ยกเลิก",
    adminMode: "โหมดผู้ดูแล",
    exitAdmin: "ออกจากโหมดผู้ดูแล",
    clearAll: "ล้างทั้งหมด",
    clearAllConfirm: "คุณแน่ใจหรือไม่ว่าต้องการลบการลงทะเบียนทั้งหมด? การดำเนินการนี้ไม่สามารถยกเลิกได้",
    enterPassword: "ใส่รหัสผ่านผู้ดูแล",
    login: "เข้าสู่ระบบ",
    wrongPassword: "รหัสผ่านไม่ถูกต้อง",
    export: "ส่งออกตาราง",
    available: "ว่าง",
    partial: "1 แชมเปี้ยน",
    full: "เต็ม",
    yourTimezone: "เขตเวลาของคุณ",
    centralTime: "เวลาภาคกลางสหรัฐ",
    sententralTime: "Sententral Time",
    shift: "กะ",
    champions: "แชมเปี้ยน",
    tech: "เทคนิค",
    remove: "ลบ",
    add: "เพิ่มแชมเปี้ยน",
    addTech: "เพิ่มเทคนิค",
    save: "บันทึก",
    noShifts: "ไม่ได้เลือกกะ",
    rules: "วิธีการทำงานกะ",
    rule1: "สูงสุด 4 ชั่วโมงติดต่อกัน (2 กะ) จากนั้นต้องพัก 2 ชั่วโมง",
    rule2: "รวมสูงสุด 12 ชั่วโมง",
    rule3: "2 แชมเปี้ยนอีเวนต์ต่อกะ (เหมาะสม) อย่างน้อย 1 คน",
    rule4: "1 แชมเปี้ยนฝ่ายเทคนิคต่อกะ",
    rulesDialogue: "สวัสดีแชมเปี้ยน! แต่ละกะใช้เวลา 2 ชั่วโมง คุณสามารถทำงานติดต่อกันได้สูงสุด 2 กะ (4 ชั่วโมง) จากนั้นกรุณาพักอย่างน้อย 2 ชั่วโมง เราอยากให้คุณรับรวมสูงสุด 12 ชั่วโมง เราอยากให้คุณมีพลัง ไม่ใช่เหนื่อยล้า! หากมีคำถาม ติดต่อ Carriann Lane เธอยินดีช่วยเหลือ",
    blocked: "ถูกบล็อก (ต้องพัก 2 ชั่วโมง)",
    dayLimit: "ถึงขีดจำกัดแล้ว",
    totalLimit: "ถึงขีดจำกัด 12 ชั่วโมงแล้ว",
    alreadySignedUp: "คุณลงทะเบียนแล้ว",
    signUpSuccess: "ลงทะเบียนสำเร็จ!",
    scheduleMore: "ลงทะเบียนกะเพิ่มเติม",
    addToCalendarNow: "เพิ่มลงปฏิทิน",
    pendingShifts: "กะรอเพิ่มลงปฏิทิน",
    addAllToCalendar: "เพิ่มทั้งหมดลงปฏิทิน",
    removeConfirm: "ลบแชมเปี้ยนนี้?",
    languageLabel: "ภาษา",
    scheduleFor: "ตารางสำหรับ",
    open: "เปิด",
    spots: "ที่",
    spot: "ที่",
    day1: "วันเสาร์",
    day2: "วันอาทิตย์",
    day3: "วันจันทร์",
    nameRequired: "ต้องระบุชื่อ",
    emailRequired: "ต้องระบุอีเมล",
    emailInvalid: "กรุณาใส่อีเมลที่ถูกต้อง",
    noShiftsSelected: "กรุณาเลือกอย่างน้อยหนึ่งกะ",
    close: "ปิด",
    signUpFor: "ลงทะเบียนกะ",
    removeFrom: "ลบออกจากกะ",
    darkMode: "มืด",
    lightMode: "สว่าง",
    theme: "ธีม",
    morning: "เช้า",
    afternoon: "บ่าย",
    evening: "เย็น",
    night: "กลางคืน",
    addToCalendar: "เพิ่มไปยังปฏิทิน",
    googleCalendar: "Google ปฏิทิน",
    downloadIcs: "ดาวน์โหลด .ics",
    emailIcs: "ส่งอีเมลถึงตัวเอง",
    calendarEventTitle: "GamiCon48V - แชมเปี้ยนอีเวนต์",
    calendarEventTitleTech: "GamiCon48V - ฝ่ายเทคนิค",
    icsEmailTip: "เคล็ดลับ: เปิดอีเมลบนโทรศัพท์ แตะไฟล์แนบ แล้วแตะเพิ่มไปยังปฏิทิน",
    tapToExpand: "แตะเพื่อดูกะ",
    shiftsAvailable: "กะที่ว่าง",
    currentShift: "ตอนนี้",
    upNext: "ถัดไป",
    eventEnded: "อีเวนต์สิ้นสุดแล้ว ขอบคุณแชมเปี้ยนทุกคน!",
    confirmTechRole: "ฝ่ายเทคนิคต้องมีประสบการณ์ทางเทคนิค คุณแน่ใจหรือไม่?",
    techConfirmYes: "ใช่ ฉันมีประสบการณ์",
    techConfirmNo: "ไม่ กลับ",
  },
  ar: {
    title: "جدول أبطال الحدث",
    subtitle: "GamiCon48V 2026",
    signUp: "التسجيل",
    name: "اسمك",
    email: "بريدك الإلكتروني",
    selectShifts: "اختر نوباتك",
    selectRole: "اختر دورك",
    eventChampion: "بطل الحدث",
    techSupport: "بطل الدعم الفني",
    techDescription: "يتطلب خبرة في استكشاف الأخطاء التقنية. ستساعد في الصوت والفيديو والبث والمشاكل التقنية.",
    submit: "إرسال التسجيل",
    submitting: "جارٍ الإرسال...",
    cancel: "إلغاء",
    adminMode: "وضع المسؤول",
    exitAdmin: "خروج المسؤول",
    clearAll: "مسح الكل",
    clearAllConfirm: "هل أنت متأكد أنك تريد إزالة جميع التسجيلات؟ لا يمكن التراجع عن هذا.",
    enterPassword: "أدخل كلمة مرور المسؤول",
    login: "تسجيل الدخول",
    wrongPassword: "كلمة مرور خاطئة",
    export: "تصدير الجدول",
    available: "متاح",
    partial: "بطل واحد",
    full: "ممتلئ",
    yourTimezone: "منطقتك الزمنية",
    centralTime: "التوقيت المركزي",
    sententralTime: "Sententral Time",
    shift: "نوبة",
    champions: "الأبطال",
    tech: "فني",
    remove: "إزالة",
    add: "إضافة بطل",
    addTech: "إضافة فني",
    save: "حفظ",
    noShifts: "لم يتم اختيار نوبات",
    rules: "كيف تعمل النوبات",
    rule1: "بحد أقصى 4 ساعات متتالية (نوبتان)، ثم استراحة إلزامية لمدة ساعتين",
    rule2: "بحد أقصى 12 ساعة إجمالاً",
    rule3: "بطلان لكل نوبة (مثالي)، واحد كحد أدنى",
    rule4: "بطل دعم فني واحد لكل نوبة",
    rulesDialogue: "مرحباً أيها الأبطال! كل نوبة مدتها ساعتان. يمكنك أخذ نوبتين متتاليتين (4 ساعات كحد أقصى)، ثم نرجو أن ترتاح ساعتين على الأقل. نود منك أن تأخذ حتى 12 ساعة إجمالاً. نريدك نشيطاً، لا منهكاً! إذا كانت لديك أسئلة، تواصل مع Carriann Lane. ستكون سعيدة بمساعدتك.",
    blocked: "محظور (تحتاج استراحة ساعتين)",
    dayLimit: "تم الوصول للحد الأقصى",
    totalLimit: "تم الوصول لحد 12 ساعة",
    alreadySignedUp: "أنت مسجل",
    signUpSuccess: "تم التسجيل بنجاح!",
    scheduleMore: "جدولة المزيد من النوبات",
    addToCalendarNow: "أضف إلى التقويم",
    pendingShifts: "نوبات جاهزة للإضافة إلى التقويم",
    addAllToCalendar: "أضف الكل إلى التقويم",
    removeConfirm: "إزالة هذا البطل؟",
    languageLabel: "اللغة",
    scheduleFor: "الجدول لـ",
    open: "مفتوح",
    spots: "أماكن",
    spot: "مكان",
    day1: "السبت",
    day2: "الأحد",
    day3: "الإثنين",
    nameRequired: "الاسم مطلوب",
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInvalid: "يرجى إدخال بريد إلكتروني صحيح",
    noShiftsSelected: "يرجى اختيار نوبة واحدة على الأقل",
    close: "إغلاق",
    signUpFor: "التسجيل في النوبة",
    removeFrom: "الإزالة من النوبة",
    darkMode: "داكن",
    lightMode: "فاتح",
    theme: "السمة",
    morning: "صباح",
    afternoon: "ظهر",
    evening: "مساء",
    night: "ليل",
    addToCalendar: "إضافة إلى التقويم",
    googleCalendar: "تقويم Google",
    downloadIcs: "تحميل .ics",
    emailIcs: "إرسال إلى بريدي",
    calendarEventTitle: "GamiCon48V - بطل الحدث",
    calendarEventTitleTech: "GamiCon48V - الدعم الفني",
    icsEmailTip: "نصيحة: افتح البريد على هاتفك، اضغط على المرفق، ثم اضغط على إضافة إلى التقويم.",
    tapToExpand: "انقر لعرض النوبات",
    shiftsAvailable: "نوبات متاحة",
    currentShift: "الآن",
    upNext: "التالي",
    eventEnded: "انتهى الحدث. شكراً للأبطال!",
    confirmTechRole: "الدعم الفني يتطلب خبرة تقنية. هل أنت متأكد؟",
    techConfirmYes: "نعم، لدي خبرة تقنية",
    techConfirmNo: "لا، العودة",
  },
  fr: {
    title: "Planificateur des Champions",
    subtitle: "GamiCon48V 2026",
    signUp: "S'inscrire",
    name: "Votre nom",
    email: "Votre e-mail",
    selectShifts: "Sélectionnez vos créneaux",
    selectRole: "Sélectionnez votre rôle",
    eventChampion: "Champion d'événement",
    techSupport: "Champion support technique",
    techDescription: "Expérience technique requise. Vous aiderez avec l'audio/vidéo, le streaming et les problèmes techniques.",
    submit: "Soumettre l'inscription",
    submitting: "Envoi en cours...",
    cancel: "Annuler",
    adminMode: "Mode admin",
    exitAdmin: "Quitter admin",
    clearAll: "Tout effacer",
    clearAllConfirm: "Êtes-vous sûr de vouloir supprimer TOUTES les inscriptions ? Cette action est irréversible.",
    enterPassword: "Entrez le mot de passe admin",
    login: "Connexion",
    wrongPassword: "Mot de passe incorrect",
    export: "Exporter le planning",
    available: "Disponible",
    partial: "1 Champion",
    full: "Complet",
    yourTimezone: "Votre fuseau horaire",
    centralTime: "Heure centrale",
    sententralTime: "Sententral Time",
    shift: "Créneau",
    champions: "Champions",
    tech: "Tech",
    remove: "Supprimer",
    add: "Ajouter un Champion",
    addTech: "Ajouter Tech",
    save: "Enregistrer",
    noShifts: "Aucun créneau sélectionné",
    rules: "Comment ça marche",
    rule1: "Maximum 4 heures consécutives (2 créneaux), puis pause de 2 heures requise",
    rule2: "Maximum 12 heures au total",
    rule3: "2 Champions par créneau (idéal), 1 minimum",
    rule4: "1 Champion support technique par créneau",
    rulesDialogue: "Salut les Champions ! Chaque créneau dure 2 heures. Vous pouvez enchaîner jusqu'à 2 créneaux (4 heures max), puis veuillez vous reposer au moins 2 heures. Nous souhaitons que vous preniez jusqu'à 12 heures au total. Nous voulons que vous soyez en forme, pas épuisés ! Si vous avez des questions, contactez Carriann Lane. Elle sera ravie de vous aider.",
    blocked: "Bloqué (pause de 2h requise)",
    dayLimit: "Limite totale atteinte",
    totalLimit: "Limite de 12 heures atteinte",
    alreadySignedUp: "Vous êtes inscrit",
    signUpSuccess: "Inscription réussie !",
    scheduleMore: "Programmer d'autres créneaux",
    addToCalendarNow: "Ajouter au calendrier",
    pendingShifts: "créneaux prêts à ajouter au calendrier",
    addAllToCalendar: "Tout ajouter au calendrier",
    removeConfirm: "Supprimer ce champion ?",
    languageLabel: "Langue",
    scheduleFor: "Planning pour",
    open: "disponible(s)",
    spots: "places",
    spot: "place",
    day1: "Samedi",
    day2: "Dimanche",
    day3: "Lundi",
    nameRequired: "Le nom est requis",
    emailRequired: "L'e-mail est requis",
    emailInvalid: "Veuillez entrer un e-mail valide",
    noShiftsSelected: "Veuillez sélectionner au moins un créneau",
    close: "Fermer",
    signUpFor: "S'inscrire au créneau",
    removeFrom: "Retirer du créneau",
    darkMode: "Sombre",
    lightMode: "Clair",
    theme: "Thème",
    morning: "Matin",
    afternoon: "Après-midi",
    evening: "Soir",
    night: "Nuit",
    addToCalendar: "Ajouter au calendrier",
    googleCalendar: "Google Agenda",
    downloadIcs: "Télécharger .ics",
    emailIcs: "M'envoyer par e-mail",
    calendarEventTitle: "GamiCon48V - Champion d'événement",
    calendarEventTitleTech: "GamiCon48V - Support technique",
    icsEmailTip: "Astuce : Ouvrez l'e-mail sur votre téléphone, appuyez sur la pièce jointe, puis appuyez sur Ajouter au calendrier.",
    tapToExpand: "APPUYEZ POUR VOIR",
    shiftsAvailable: "créneaux disponibles",
    currentShift: "EN COURS",
    upNext: "SUIVANT",
    eventEnded: "L'événement est terminé. Merci Champions !",
    confirmTechRole: "Le support technique nécessite une expérience technique. Êtes-vous sûr ?",
    techConfirmYes: "Oui, j'ai l'expérience",
    techConfirmNo: "Non, retour",
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const generateShifts = () => {
  const shifts = [];
  let current = new Date(EVENT_CONFIG.startTime);
  let id = 0;
  
  while (current < EVENT_CONFIG.endTime) {
    const start = new Date(current);
    const end = new Date(current.getTime() + EVENT_CONFIG.shiftDurationHours * 60 * 60 * 1000);
    
    shifts.push({
      id: id++,
      start,
      end,
      champions: [],
      techChampions: []
    });
    
    current = end;
  }
  
  return shifts;
};

const formatTime = (date, timezone = 'America/Chicago') => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone
  });
};

const formatDate = (date, timezone = 'America/Chicago') => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: timezone
  });
};

const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Get display name for timezone (e.g., "CST", "PST", "GMT+7")
const getTimezoneName = (timezone) => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    }).formatToParts(new Date());
    const tzPart = parts.find(part => part.type === 'timeZoneName');
    return tzPart ? tzPart.value : timezone.split('/').pop().replace('_', ' ');
  } catch {
    return timezone.split('/').pop().replace('_', ' ');
  }
};

// Get time period (morning, afternoon, evening, night) based on hour
const getTimePeriod = (date, timezone = 'America/Chicago') => {
  const hour = parseInt(date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone: timezone
  }));
  
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

const timePeriodIcons = {
  morning: '🌅',
  afternoon: '☀️',
  evening: '🌆',
  night: '🌙'
};

// Group shifts into time blocks for collapsible sections
const groupShiftsIntoBlocks = (shifts, timezone) => {
  const blocks = [];
  let currentBlock = null;
  
  shifts.forEach((shift) => {
    const period = getTimePeriod(shift.start, timezone);
    const dateStr = formatDate(shift.start, timezone);
    const blockKey = `${dateStr}-${period}`;
    
    if (!currentBlock || currentBlock.key !== blockKey) {
      currentBlock = {
        key: blockKey,
        date: dateStr,
        period,
        shifts: [],
        label: `${dateStr} - ${period.charAt(0).toUpperCase() + period.slice(1)}`
      };
      blocks.push(currentBlock);
    }
    currentBlock.shifts.push(shift);
  });
  
  return blocks;
};

// Determine which block should be expanded based on current time
const getDefaultExpandedBlocks = (blocks, isEventActive, isEventOver) => {
  const now = new Date();
  
  if (isEventOver) {
    return {}; // All collapsed after event
  }
  
  if (!isEventActive) {
    // Before event: first block expanded
    return blocks.length > 0 ? { [blocks[0].key]: true } : {};
  }
  
  // During event: find current/next block
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const lastShift = block.shifts[block.shifts.length - 1];
    
    // If this block contains current or future shifts
    if (lastShift.end > now) {
      return { [block.key]: true };
    }
  }
  
  return {};
};

// Check if event is currently active
const isEventCurrentlyActive = () => {
  const now = new Date();
  return now >= EVENT_CONFIG.startTime && now <= EVENT_CONFIG.endTime;
};

// Check if event is over
const isEventOver = () => {
  return new Date() > EVENT_CONFIG.endTime;
};

// Get current shift index (for highlighting)
const getCurrentShiftIndex = (shifts) => {
  const now = new Date();
  return shifts.findIndex(s => now >= s.start && now < s.end);
};

// Get next upcoming shift index
const getNextShiftIndex = (shifts) => {
  const now = new Date();
  return shifts.findIndex(s => s.start > now);
};

// Filter shifts for during-event view (only current and future)
const filterShiftsForEvent = (shifts) => {
  const now = new Date();
  // Show shifts that haven't ended yet
  return shifts.filter(s => s.end > now);
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function App() {
  const [shifts, setShifts] = useState(generateShifts());
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [userTimezone] = useState(getUserTimezone());
  const [showLocalTime, setShowLocalTime] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [exportData, setExportData] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [lastSignedUpShifts, setLastSignedUpShifts] = useState([]);
  const [lastSignedUpEmail, setLastSignedUpEmail] = useState('');
  const [lastSignedUpRole, setLastSignedUpRole] = useState('champion');
  const [pendingCalendarShifts, setPendingCalendarShifts] = useState([]); // Accumulates shifts for batch calendar add
  const [expandedBlocks, setExpandedBlocks] = useState({});
  const [inlineSignUp, setInlineSignUp] = useState(null); // { shiftId, role }
  const [savedUserInfo, setSavedUserInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('gamicon48v-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  // Inline sign-up form state
  const [inlineName, setInlineName] = useState('');
  const [inlineEmail, setInlineEmail] = useState('');
  const [inlineErrors, setInlineErrors] = useState({});
  const [isInlineSubmitting, setIsInlineSubmitting] = useState(false);
  
  // Refs for focus management
  const adminButtonRef = React.useRef(null);
  const adminModalRef = React.useRef(null);
  const adminFirstInputRef = React.useRef(null);
  
  const t = translations[language];
  const isRTL = language === 'ar';
  const colors = themes[theme];
  const timezone = showLocalTime ? userTimezone : 'America/Chicago';
  
  // Event status
  const eventActive = isEventCurrentlyActive();
  const eventOver = isEventOver();
  
  // Get display shifts (filtered during event)
  const displayShifts = eventActive ? filterShiftsForEvent(shifts) : shifts;
  
  // Group shifts into blocks
  const shiftBlocks = groupShiftsIntoBlocks(displayShifts, timezone);
  
  // Current/next shift indices for highlighting
  const currentShiftIdx = getCurrentShiftIndex(shifts);
  const nextShiftIdx = getNextShiftIndex(shifts);
  
  // Generate theme-aware styles
  const styles = getStyles(colors);
  
  // Initialize expanded blocks on first render
  useEffect(() => {
    const defaultExpanded = getDefaultExpandedBlocks(shiftBlocks, eventActive, eventOver);
    setExpandedBlocks(defaultExpanded);
  }, [eventActive, eventOver]); // Re-run when event status changes
  
  // Focus management for admin modal
  useEffect(() => {
    if (showAdminLogin && adminFirstInputRef.current) {
      adminFirstInputRef.current.focus();
    }
  }, [showAdminLogin]);
  
  // Escape key handler and focus trap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showAdminLogin) {
          setShowAdminLogin(false);
          adminButtonRef.current?.focus();
        }
        if (showExport) {
          setShowExport(false);
        }
        if (showSuccessModal) {
          handleScheduleMore();
        }
        if (showCalendarModal) {
          handleCalendarDone();
        }
        if (inlineSignUp) {
          setInlineSignUp(null);
        }
      }
      
      // Focus trap for modals
      if (e.key === 'Tab') {
        const activeModal = showAdminLogin ? adminModalRef.current : null;
        if (!activeModal) return;
        
        const focusableElements = activeModal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    if (showAdminLogin || showExport || showSuccessModal || showCalendarModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showAdminLogin, showExport, showSuccessModal, showCalendarModal, inlineSignUp]);
  
  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('shifts')
          .select('id, champions, tech_champions')
          .order('id');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const baseShifts = generateShifts();
          const mergedShifts = baseShifts.map(shift => {
            const saved = data.find(s => s.id === shift.id);
            return saved ? { 
              ...shift, 
              champions: saved.champions || [],
              techChampions: saved.tech_champions || []
            } : shift;
          });
          setShifts(mergedShifts);
        }
      } catch (e) {
        console.log('Error loading data:', e);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);
  
  // Save data to Supabase
  const saveShifts = useCallback(async (newShifts) => {
    try {
      for (const shift of newShifts) {
        const { error } = await supabase
          .from('shifts')
          .update({ 
            champions: shift.champions,
            tech_champions: shift.techChampions 
          })
          .eq('id', shift.id);
        
        if (error) throw error;
      }
    } catch (e) {
      console.error('Failed to save:', e);
    }
  }, []);
  
  const closeAdminModal = () => {
    setShowAdminLogin(false);
    setTimeout(() => adminButtonRef.current?.focus(), 0);
  };
  
  // Toggle block expansion
  const toggleBlock = (blockKey) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockKey]: !prev[blockKey]
    }));
  };
  
  // Check if shift can be selected based on rules
  const canSelectShift = (shiftId, currentSelections, userEmail = null, role = 'champion') => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return { allowed: false, reason: 'invalid' };
    
    // Check if already full for this role
    if (role === 'champion' && shift.champions.length >= EVENT_CONFIG.maxChampionsPerShift) {
      return { allowed: false, reason: 'full' };
    }
    if (role === 'tech' && shift.techChampions.length >= EVENT_CONFIG.maxTechPerShift) {
      return { allowed: false, reason: 'full' };
    }
    
    // Check if user already signed up for this shift (either role)
    if (userEmail) {
      const inChampions = shift.champions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
      const inTech = shift.techChampions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
      if (inChampions || inTech) {
        return { allowed: false, reason: 'alreadySignedUp' };
      }
    }
    
    // Get all shifts this user would have
    const allUserShiftIds = [...currentSelections];
    if (userEmail) {
      shifts.forEach(s => {
        const inC = s.champions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
        const inT = s.techChampions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
        if (inC || inT) {
          allUserShiftIds.push(s.id);
        }
      });
    }
    
    const potentialShifts = [...new Set([...allUserShiftIds, shiftId])].sort((a, b) => a - b);
    
    // Check consecutive hours rule
    let consecutiveCount = 0;
    let maxConsecutive = 0;
    
    for (let i = 0; i < potentialShifts.length; i++) {
      if (i === 0 || potentialShifts[i] === potentialShifts[i - 1] + 1) {
        consecutiveCount++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
      } else {
        const gap = potentialShifts[i] - potentialShifts[i - 1];
        const breakHours = gap * EVENT_CONFIG.shiftDurationHours;
        if (consecutiveCount >= 2 && breakHours < EVENT_CONFIG.requiredBreakHours) {
          return { allowed: false, reason: 'blocked' };
        }
        consecutiveCount = 1;
      }
    }
    
    if (maxConsecutive * EVENT_CONFIG.shiftDurationHours > EVENT_CONFIG.maxConsecutiveHours) {
      return { allowed: false, reason: 'blocked' };
    }
    
    // Check total hours limit
    const totalHours = potentialShifts.length * EVENT_CONFIG.shiftDurationHours;
    if (totalHours > EVENT_CONFIG.maxHoursTotal) {
      return { allowed: false, reason: 'totalLimit' };
    }
    
    return { allowed: true };
  };
  
  const handleAdminRemove = async (shiftId, championIndex, isTech = false) => {
    if (!window.confirm(t.removeConfirm)) return;
    
    const newShifts = shifts.map(shift => {
      if (shift.id === shiftId) {
        if (isTech) {
          const newTech = [...shift.techChampions];
          newTech.splice(championIndex, 1);
          return { ...shift, techChampions: newTech };
        } else {
          const newChampions = [...shift.champions];
          newChampions.splice(championIndex, 1);
          return { ...shift, champions: newChampions };
        }
      }
      return shift;
    });
    
    setShifts(newShifts);
    await saveShifts(newShifts);
  };
  
  const handleAdminAdd = async (shiftId, name, email, isTech = false) => {
    if (!name.trim() || !email.trim()) return;
    
    const newShifts = shifts.map(shift => {
      if (shift.id === shiftId) {
        if (isTech) {
          return {
            ...shift,
            techChampions: [...shift.techChampions, { name: name.trim(), email: email.trim() }]
          };
        } else {
          return {
            ...shift,
            champions: [...shift.champions, { name: name.trim(), email: email.trim() }]
          };
        }
      }
      return shift;
    });
    
    setShifts(newShifts);
    await saveShifts(newShifts);
  };
  
  const handleClearAll = async () => {
    if (!window.confirm(t.clearAllConfirm)) return;
    
    const clearedShifts = shifts.map(shift => ({
      ...shift,
      champions: [],
      techChampions: []
    }));
    
    setShifts(clearedShifts);
    await saveShifts(clearedShifts);
    setSuccessMessage('All sign-ups cleared');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleAdminLogin = () => {
    if (adminPassword === EVENT_CONFIG.adminPassword) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };
  
  const exportSchedule = () => {
    const tz = showLocalTime ? userTimezone : 'America/Chicago';
    let csv = 'Shift,Date,Start Time,End Time,Time Period,Champion 1,Email 1,Champion 2,Email 2,Tech Support,Tech Email\n';
    
    shifts.forEach((shift, index) => {
      const timePeriod = getTimePeriod(shift.start, tz);
      const row = [
        index + 1,
        formatDate(shift.start, tz),
        formatTime(shift.start, tz),
        formatTime(shift.end, tz),
        timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1),
        shift.champions[0]?.name || '',
        shift.champions[0]?.email || '',
        shift.champions[1]?.name || '',
        shift.champions[1]?.email || '',
        shift.techChampions[0]?.name || '',
        shift.techChampions[0]?.email || ''
      ];
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    setExportData(csv);
    setShowExport(true);
  };
  
  const copyExportToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportData);
      setSuccessMessage('Copied to clipboard!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = exportData;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setSuccessMessage('Copied to clipboard!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };
  
  // Calendar functions
  const generateGoogleCalendarUrl = (shiftsToAdd) => {
    if (shiftsToAdd.length === 0) return null;
    
    const shift = shiftsToAdd[0];
    const title = encodeURIComponent(lastSignedUpRole === 'tech' ? t.calendarEventTitleTech : t.calendarEventTitle);
    const startStr = shift.start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const endStr = shift.end.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const details = encodeURIComponent(`${lastSignedUpRole === 'tech' ? 'Tech Support' : 'Event Champion'} shift for GamiCon48V 2026`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}`;
  };
  
  const generateIcsContent = (shiftsToAdd) => {
    const formatIcsDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };
    
    const title = lastSignedUpRole === 'tech' ? t.calendarEventTitleTech : t.calendarEventTitle;
    
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GamiCon48V//Event Champion Scheduler//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;
    
    shiftsToAdd.forEach((shift, index) => {
      const uid = `gamicon48v-shift-${shift.id}-${Date.now()}@gamicon.org`;
      icsContent += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatIcsDate(new Date())}
DTSTART:${formatIcsDate(shift.start)}
DTEND:${formatIcsDate(shift.end)}
SUMMARY:${title}
DESCRIPTION:${lastSignedUpRole === 'tech' ? 'Tech Support' : 'Event Champion'} shift ${index + 1} for GamiCon48V 2026
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Your GamiCon48V shift starts tomorrow!
END:VALARM
BEGIN:VALARM
TRIGGER:-PT2H
ACTION:DISPLAY
DESCRIPTION:Your GamiCon48V shift starts in 2 hours!
END:VALARM
END:VEVENT
`;
    });
    
    icsContent += `END:VCALENDAR`;
    return icsContent;
  };
  
  const downloadIcsFile = (shiftsToDownload = null) => {
    const shiftsForCalendar = shiftsToDownload || pendingCalendarShifts;
    const icsContent = generateIcsContent(shiftsForCalendar);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gamicon48v-shifts.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const emailIcsFile = (shiftsToEmail = null) => {
    const shiftsForCalendar = shiftsToEmail || pendingCalendarShifts;
    downloadIcsFile(shiftsForCalendar);
    
    const subject = encodeURIComponent('My GamiCon48V Shifts');
    const shiftList = shiftsForCalendar.map((shift, i) => {
      const date = formatDate(shift.start, timezone);
      const start = formatTime(shift.start, timezone);
      const end = formatTime(shift.end, timezone);
      return `  Shift ${i + 1}: ${date} ${start} - ${end}`;
    }).join('\n');
    
    const body = encodeURIComponent(
`Here are my GamiCon48V shifts:

${shiftList}

IMPORTANT: Attach the downloaded file "gamicon48v-shifts.ics" to this email before sending.

Then open this email on your phone and tap the attachment to add shifts to your calendar.`
    );
    
    window.location.href = `mailto:${lastSignedUpEmail}?subject=${subject}&body=${body}`;
  };
  
  const openGoogleCalendar = (shiftsToAdd = null) => {
    const shiftsForCalendar = shiftsToAdd || pendingCalendarShifts;
    const url = generateGoogleCalendarUrl(shiftsForCalendar);
    if (url) {
      window.open(url, '_blank');
    }
  };
  
  // Handle "Schedule More" - add to pending and close
  const handleScheduleMore = () => {
    setPendingCalendarShifts(prev => [...prev, ...lastSignedUpShifts]);
    setShowSuccessModal(false);
  };
  
  // Handle "Add to Calendar Now" - add current shift to pending and show calendar modal
  const handleAddToCalendarNow = () => {
    setPendingCalendarShifts(prev => [...prev, ...lastSignedUpShifts]);
    setShowSuccessModal(false);
    setShowCalendarModal(true);
  };
  
  // Clear pending shifts after adding to calendar
  const handleCalendarDone = () => {
    setPendingCalendarShifts([]);
    setShowCalendarModal(false);
  };
  
  // Get status helpers
  const getChampionStatus = (shift) => {
    if (shift.champions.length >= EVENT_CONFIG.maxChampionsPerShift) return 'full';
    if (shift.champions.length === 1) return 'partial';
    return 'available';
  };
  
  const getTechStatus = (shift) => {
    if (shift.techChampions.length >= EVENT_CONFIG.maxTechPerShift) return 'full';
    return 'available';
  };
  
  // Count available spots in a block
  const countAvailableInBlock = (block) => {
    let count = 0;
    block.shifts.forEach(shift => {
      if (shift.champions.length < EVENT_CONFIG.maxChampionsPerShift) count++;
      if (shift.techChampions.length < EVENT_CONFIG.maxTechPerShift) count++;
    });
    return count;
  };
  
  // Open inline sign-up form for a specific slot
  const openInlineSignUp = (shiftId, role) => {
    setInlineSignUp({ shiftId, role });
    // Pre-fill with saved info if available
    if (savedUserInfo) {
      setInlineName(savedUserInfo.name);
      setInlineEmail(savedUserInfo.email);
    } else {
      setInlineName('');
      setInlineEmail('');
    }
    setInlineErrors({});
  };
  
  // Close inline sign-up
  const closeInlineSignUp = () => {
    setInlineSignUp(null);
    setInlineErrors({});
  };
  
  // Validate inline form
  const validateInlineForm = () => {
    const errors = {};
    if (!inlineName.trim()) errors.name = t.nameRequired;
    if (!inlineEmail.trim()) errors.email = t.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inlineEmail)) errors.email = t.emailInvalid;
    setInlineErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Submit inline sign-up
  const handleInlineSubmit = async () => {
    if (!validateInlineForm() || isInlineSubmitting || !inlineSignUp) return;
    
    const { shiftId, role } = inlineSignUp;
    
    // Validate shift rules (consecutive hours, total hours, etc.)
    const ruleCheck = canSelectShift(shiftId, [], inlineEmail.trim(), role);
    if (!ruleCheck.allowed) {
      setInlineErrors(prev => ({
        ...prev,
        rules: t[ruleCheck.reason] || t.blocked
      }));
      return;
    }
    
    setIsInlineSubmitting(true);
    
    try {
      const shift = shifts.find(s => s.id === shiftId);
      
      const newShifts = shifts.map(s => {
        if (s.id === shiftId) {
          if (role === 'tech') {
            return {
              ...s,
              techChampions: [...s.techChampions, { name: inlineName.trim(), email: inlineEmail.trim() }]
            };
          } else {
            return {
              ...s,
              champions: [...s.champions, { name: inlineName.trim(), email: inlineEmail.trim() }]
            };
          }
        }
        return s;
      });
      
      setShifts(newShifts);
      await saveShifts(newShifts);
      
      // Save user info for future quick sign-ups
      const userInfo = { name: inlineName.trim(), email: inlineEmail.trim() };
      localStorage.setItem('gamicon48v-user', JSON.stringify(userInfo));
      setSavedUserInfo(userInfo);
      
      // Set up success modal
      setLastSignedUpShifts([shift]);
      setLastSignedUpEmail(inlineEmail.trim());
      setLastSignedUpRole(role);
      
      closeInlineSignUp();
      setShowSuccessModal(true);
    } finally {
      setIsInlineSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} aria-label="Loading">
          <div style={styles.spinnerGear}>⚙</div>
        </div>
      </div>
    );
  }

  if (eventOver) {
    return (
      <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.titleGroup}>
              <h1 style={styles.title}>{t.title}</h1>
              <p style={styles.subtitle}>{t.subtitle}</p>
            </div>
          </div>
        </header>
        <div style={styles.eventEndedMessage}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2>{t.eventEnded}</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Skip Link for keyboard navigation */}
      <a 
        href="#main-schedule" 
        style={styles.skipLink}
        onFocus={(e) => e.target.style.top = '0'}
        onBlur={(e) => e.target.style.top = '-100px'}
      >
        Skip to schedule
      </a>
      
      {/* Live region for screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        style={styles.srOnly}
        id="sr-announcements"
      >
        {successMessage}
      </div>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleGroup}>
            <h1 style={styles.title}>{t.title}</h1>
            <p style={styles.subtitle}>{t.subtitle}</p>
          </div>
          
          <div style={styles.controls}>
            {/* Language Selector */}
            <div style={styles.controlGroup}>
              <label htmlFor="language-select" style={styles.controlLabel}>
                {t.languageLabel}
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={styles.select}
                aria-label={t.languageLabel}
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="th">ไทย</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
              </select>
            </div>
            
            {/* Timezone Toggle */}
            <div style={styles.controlGroup}>
              <label htmlFor="timezone-toggle" style={styles.controlLabel}>
                {showLocalTime ? t.yourTimezone : t.sententralTime}
              </label>
              <button
                id="timezone-toggle"
                onClick={() => setShowLocalTime(!showLocalTime)}
                style={styles.toggleButton}
                aria-pressed={showLocalTime}
              >
                {showLocalTime ? getTimezoneName(userTimezone) : t.centralTime}
              </button>
            </div>
            
            {/* Theme Toggle */}
            <div style={styles.controlGroup}>
              <label htmlFor="theme-toggle" style={styles.controlLabel}>
                {t.theme}
              </label>
              <button
                id="theme-toggle"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={styles.toggleButton}
                aria-pressed={theme === 'dark'}
              >
                {theme === 'dark' ? '☀️ ' + t.lightMode : '🌙 ' + t.darkMode}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Success Message */}
      {successMessage && (
        <div style={styles.successBanner} role="status" aria-live="polite">
          ✓ {successMessage}
        </div>
      )}
      
      {/* Action Bar */}
      <div style={styles.actionBar}>
        <div style={styles.actionGroup}>
          {isAdmin ? (
            <>
              <button onClick={exportSchedule} style={styles.secondaryButton}>
                {t.export}
              </button>
              <button onClick={handleClearAll} style={styles.dangerButton}>
                {t.clearAll}
              </button>
              <button
                onClick={() => setIsAdmin(false)}
                style={styles.secondaryButton}
              >
                {t.exitAdmin}
              </button>
            </>
          ) : (
            <button
              ref={adminButtonRef}
              onClick={() => setShowAdminLogin(true)}
              style={styles.secondaryButton}
            >
              {t.adminMode}
            </button>
          )}
        </div>
      </div>
      
      {/* Pending Calendar Shifts Banner */}
      {pendingCalendarShifts.length > 0 && (
        <div style={styles.pendingBanner}>
          <span>📅 {pendingCalendarShifts.length} {t.pendingShifts}</span>
          <button 
            onClick={() => setShowCalendarModal(true)}
            style={styles.pendingBannerButton}
          >
            {t.addAllToCalendar}
          </button>
        </div>
      )}
      
      {/* Rules Panel */}
      <details style={styles.rulesPanel}>
        <summary style={styles.rulesSummary}>{t.rules}</summary>
        <p style={styles.rulesDialogue}>{t.rulesDialogue}</p>
      </details>
      
      {/* Legend */}
      <div style={styles.legend} role="list" aria-label="Shift status legend">
        <div style={styles.legendItem} role="listitem">
          <span style={{ ...styles.legendDot, backgroundColor: colors.available }} aria-hidden="true"></span>
          <span>{t.available}</span>
        </div>
        <div style={styles.legendItem} role="listitem">
          <span style={{ ...styles.legendDot, backgroundColor: colors.partial }} aria-hidden="true"></span>
          <span>{t.partial}</span>
        </div>
        <div style={styles.legendItem} role="listitem">
          <span style={{ ...styles.legendDot, backgroundColor: colors.full }} aria-hidden="true"></span>
          <span>{t.full}</span>
        </div>
        <div style={styles.legendItem} role="listitem">
          <span style={{ ...styles.legendDot, backgroundColor: colors.techAccent }} aria-hidden="true"></span>
          <span>{t.techSupport}</span>
        </div>
      </div>
      
      {/* Schedule - Collapsible Blocks */}
      <main id="main-schedule" style={styles.scheduleContainer} role="main" aria-label="Shift schedule">
        {shiftBlocks.map((block, blockIndex) => {
          const isExpanded = expandedBlocks[block.key];
          const availableCount = countAvailableInBlock(block);
          const isFirstBlock = blockIndex === 0;
          
          return (
            <section key={block.key} style={styles.blockSection}>
              {/* Block Header - Always visible */}
              <button
                onClick={() => toggleBlock(block.key)}
                style={{
                  ...styles.blockHeader,
                  ...(isExpanded ? styles.blockHeaderExpanded : {}),
                  ...(!isExpanded && isFirstBlock && !eventActive ? styles.blockHeaderHighlight : {})
                }}
                aria-expanded={isExpanded}
                aria-controls={`block-${block.key}`}
              >
                <div style={styles.blockHeaderLeft}>
                  <span style={styles.blockIcon} aria-hidden="true">
                    {timePeriodIcons[block.period]}
                  </span>
                  <span style={styles.blockTitle}>
                    {block.date} • {t[block.period]}
                  </span>
                </div>
                <div style={styles.blockHeaderRight}>
                  {!isExpanded && (
                    <span style={styles.availableBadge}>
                      {availableCount} {t.shiftsAvailable}
                    </span>
                  )}
                  <span style={styles.expandIcon} aria-hidden="true">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>
              </button>
              
              {/* Block Content - Shifts */}
              {isExpanded && (
                <div id={`block-${block.key}`} style={styles.blockContent}>
                  {block.shifts.map((shift) => {
                    const champStatus = getChampionStatus(shift);
                    const techStatus = getTechStatus(shift);
                    const isCurrent = shift.id === currentShiftIdx;
                    const isNext = shift.id === nextShiftIdx && !isCurrent;
                    
                    return (
                      <div
                        key={shift.id}
                        style={{
                          ...styles.shiftRow,
                          ...(isCurrent ? styles.shiftRowCurrent : {}),
                          ...(isNext ? styles.shiftRowNext : {})
                        }}
                      >
                        {/* Time column */}
                        <div style={styles.shiftTimeCol}>
                          <div style={styles.shiftTime}>
                            {formatTime(shift.start, timezone)}
                          </div>
                          <div style={styles.shiftTimeTo}>to</div>
                          <div style={styles.shiftTime}>
                            {formatTime(shift.end, timezone)}
                          </div>
                          {isCurrent && <div style={styles.nowBadge}>{t.currentShift}</div>}
                          {isNext && <div style={styles.nextBadge}>{t.upNext}</div>}
                        </div>
                        
                        {/* Champions column */}
                        <div style={styles.roleColumn}>
                          <div style={styles.roleHeader}>
                            <span style={{ ...styles.roleLabel, color: colors.accent }}>
                              {t.champions}
                            </span>
                            <span style={{
                              ...styles.statusDot,
                              backgroundColor: champStatus === 'full' ? colors.full : 
                                              champStatus === 'partial' ? colors.partial : colors.available
                            }} />
                          </div>
                          <div style={styles.championsList}>
                            {shift.champions.map((champ, idx) => (
                              <div key={idx} style={styles.championChip}>
                                <span>{champ.name}</span>
                                {isAdmin && (
                                  <button
                                    onClick={() => handleAdminRemove(shift.id, idx, false)}
                                    style={styles.removeChip}
                                    aria-label={`${t.remove} ${champ.name}`}
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            ))}
                            {shift.champions.length < EVENT_CONFIG.maxChampionsPerShift && (
                              inlineSignUp?.shiftId === shift.id && inlineSignUp?.role === 'champion' ? (
                                <div 
                                  style={styles.inlineForm}
                                  role="form"
                                  aria-label={`Sign up as Event Champion for ${formatTime(shift.start, timezone)} shift`}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Escape') closeInlineSignUp();
                                    if (e.key === 'Enter' && !isInlineSubmitting) handleInlineSubmit();
                                  }}
                                >
                                  {inlineErrors.rules && (
                                    <div style={styles.inlineRulesError} role="alert">
                                      ⚠️ {inlineErrors.rules}
                                    </div>
                                  )}
                                  <label htmlFor={`inline-name-${shift.id}`} style={styles.srOnly}>
                                    {t.name}
                                  </label>
                                  <input
                                    id={`inline-name-${shift.id}`}
                                    type="text"
                                    placeholder={t.name}
                                    value={inlineName}
                                    onChange={(e) => setInlineName(e.target.value)}
                                    style={styles.inlineInput}
                                    autoFocus
                                    aria-invalid={!!inlineErrors.name}
                                    aria-describedby={inlineErrors.name ? `name-error-${shift.id}` : undefined}
                                  />
                                  {inlineErrors.name && (
                                    <span id={`name-error-${shift.id}`} style={styles.inlineError} role="alert">
                                      {inlineErrors.name}
                                    </span>
                                  )}
                                  <label htmlFor={`inline-email-${shift.id}`} style={styles.srOnly}>
                                    {t.email}
                                  </label>
                                  <input
                                    id={`inline-email-${shift.id}`}
                                    type="email"
                                    placeholder={t.email}
                                    value={inlineEmail}
                                    onChange={(e) => setInlineEmail(e.target.value)}
                                    style={styles.inlineInput}
                                    aria-invalid={!!inlineErrors.email}
                                    aria-describedby={inlineErrors.email ? `email-error-${shift.id}` : undefined}
                                  />
                                  {inlineErrors.email && (
                                    <span id={`email-error-${shift.id}`} style={styles.inlineError} role="alert">
                                      {inlineErrors.email}
                                    </span>
                                  )}
                                  <div style={styles.inlineActions}>
                                    <button 
                                      onClick={closeInlineSignUp} 
                                      style={styles.inlineCancelBtn}
                                      type="button"
                                    >
                                      {t.cancel}
                                    </button>
                                    <button 
                                      onClick={handleInlineSubmit} 
                                      style={styles.inlineSubmitBtn}
                                      disabled={isInlineSubmitting}
                                      aria-busy={isInlineSubmitting}
                                      type="submit"
                                    >
                                      {isInlineSubmitting ? '...' : t.signUp}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => openInlineSignUp(shift.id, 'champion')}
                                  style={styles.openSlotButton}
                                  aria-label={`${t.signUpFor} ${formatTime(shift.start, timezone)}`}
                                >
                                  <span style={styles.openSlotPlus}>+</span>
                                  <span>{EVENT_CONFIG.maxChampionsPerShift - shift.champions.length} {t.open}</span>
                                </button>
                              )
                            )}
                            {isAdmin && shift.champions.length < EVENT_CONFIG.maxChampionsPerShift && !inlineSignUp && (
                              <AdminAddForm
                                shiftId={shift.id}
                                onAdd={(id, name, email) => handleAdminAdd(id, name, email, false)}
                                t={t}
                                styles={styles}
                                colors={colors}
                              />
                            )}
                          </div>
                        </div>
                        
                        {/* Tech column */}
                        <div style={styles.roleColumn}>
                          <div style={styles.roleHeader}>
                            <span style={{ ...styles.roleLabel, color: colors.techAccent }}>
                              {t.tech}
                            </span>
                            <span style={{
                              ...styles.statusDot,
                              backgroundColor: techStatus === 'full' ? colors.full : colors.techAccent
                            }} />
                          </div>
                          <div style={styles.championsList}>
                            {shift.techChampions.map((tech, idx) => (
                              <div key={idx} style={{ ...styles.championChip, borderColor: colors.techAccent }}>
                                <span>{tech.name}</span>
                                {isAdmin && (
                                  <button
                                    onClick={() => handleAdminRemove(shift.id, idx, true)}
                                    style={styles.removeChip}
                                    aria-label={`${t.remove} ${tech.name}`}
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            ))}
                            {shift.techChampions.length < EVENT_CONFIG.maxTechPerShift && (
                              inlineSignUp?.shiftId === shift.id && inlineSignUp?.role === 'tech' ? (
                                <div 
                                  style={{ ...styles.inlineForm, borderColor: colors.techAccent }}
                                  role="form"
                                  aria-label={`Sign up as Tech Support Champion for ${formatTime(shift.start, timezone)} shift`}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Escape') closeInlineSignUp();
                                    if (e.key === 'Enter' && !isInlineSubmitting) handleInlineSubmit();
                                  }}
                                >
                                  {inlineErrors.rules && (
                                    <div style={styles.inlineRulesError} role="alert">
                                      ⚠️ {inlineErrors.rules}
                                    </div>
                                  )}
                                  <div style={styles.techWarning} role="note">{t.techDescription}</div>
                                  <label htmlFor={`inline-tech-name-${shift.id}`} style={styles.srOnly}>
                                    {t.name}
                                  </label>
                                  <input
                                    id={`inline-tech-name-${shift.id}`}
                                    type="text"
                                    placeholder={t.name}
                                    value={inlineName}
                                    onChange={(e) => setInlineName(e.target.value)}
                                    style={{ ...styles.inlineInput, borderColor: colors.techAccent }}
                                    autoFocus
                                    aria-invalid={!!inlineErrors.name}
                                    aria-describedby={inlineErrors.name ? `tech-name-error-${shift.id}` : undefined}
                                  />
                                  {inlineErrors.name && (
                                    <span id={`tech-name-error-${shift.id}`} style={styles.inlineError} role="alert">
                                      {inlineErrors.name}
                                    </span>
                                  )}
                                  <label htmlFor={`inline-tech-email-${shift.id}`} style={styles.srOnly}>
                                    {t.email}
                                  </label>
                                  <input
                                    id={`inline-tech-email-${shift.id}`}
                                    type="email"
                                    placeholder={t.email}
                                    value={inlineEmail}
                                    onChange={(e) => setInlineEmail(e.target.value)}
                                    style={{ ...styles.inlineInput, borderColor: colors.techAccent }}
                                    aria-invalid={!!inlineErrors.email}
                                    aria-describedby={inlineErrors.email ? `tech-email-error-${shift.id}` : undefined}
                                  />
                                  {inlineErrors.email && (
                                    <span id={`tech-email-error-${shift.id}`} style={styles.inlineError} role="alert">
                                      {inlineErrors.email}
                                    </span>
                                  )}
                                  <div style={styles.inlineActions}>
                                    <button 
                                      onClick={closeInlineSignUp} 
                                      style={styles.inlineCancelBtn}
                                      type="button"
                                    >
                                      {t.cancel}
                                    </button>
                                    <button 
                                      onClick={handleInlineSubmit} 
                                      style={{ ...styles.inlineSubmitBtn, backgroundColor: colors.techAccent, color: colors.onTechAccent }}
                                      disabled={isInlineSubmitting}
                                      aria-busy={isInlineSubmitting}
                                      type="submit"
                                    >
                                      {isInlineSubmitting ? '...' : t.signUp}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => openInlineSignUp(shift.id, 'tech')}
                                  style={{ ...styles.openSlotButton, borderColor: colors.techAccent, color: colors.techAccent }}
                                  aria-label={`${t.signUpFor} ${t.techSupport} ${formatTime(shift.start, timezone)}`}
                                >
                                  <span style={styles.openSlotPlus}>+</span>
                                  <span>1 {t.open}</span>
                                </button>
                              )
                            )}
                            {isAdmin && shift.techChampions.length < EVENT_CONFIG.maxTechPerShift && !inlineSignUp && (
                              <AdminAddForm
                                shiftId={shift.id}
                                onAdd={(id, name, email) => handleAdminAdd(id, name, email, true)}
                                t={t}
                                styles={styles}
                                colors={colors}
                                isTech={true}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </main>
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div
          style={styles.modalOverlay}
          onClick={(e) => e.target === e.currentTarget && closeAdminModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-title"
        >
          <div style={{ ...styles.modal, maxWidth: '400px' }} ref={adminModalRef}>
            <h2 id="admin-title" style={styles.modalTitle}>{t.adminMode}</h2>
            
            <div style={styles.formGroup}>
              <label htmlFor="admin-password" style={styles.label}>{t.enterPassword}</label>
              <input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setPasswordError(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                style={styles.input}
                ref={adminFirstInputRef}
                aria-invalid={passwordError}
                aria-describedby={passwordError ? 'password-error' : undefined}
              />
              {passwordError && (
                <span id="password-error" style={styles.errorText} role="alert">
                  {t.wrongPassword}
                </span>
              )}
            </div>
            
            <div style={styles.modalActions}>
              <button onClick={closeAdminModal} style={styles.secondaryButton}>
                {t.cancel}
              </button>
              <button onClick={handleAdminLogin} style={styles.primaryButton}>
                {t.login}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Export Modal */}
      {showExport && (
        <div
          style={styles.modalOverlay}
          onClick={(e) => e.target === e.currentTarget && setShowExport(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-title"
        >
          <div style={styles.modal}>
            <h2 id="export-title" style={styles.modalTitle}>{t.export}</h2>
            <p style={{ color: colors.textMuted, marginBottom: '1rem' }}>
              Copy the CSV below and paste into Google Sheets or Excel.
            </p>
            <textarea
              value={exportData}
              readOnly
              style={{
                width: '100%',
                height: '300px',
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                backgroundColor: colors.bg,
                color: colors.text,
                border: `2px solid ${colors.border}`,
                borderRadius: '8px',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
              onClick={(e) => e.target.select()}
            />
            <div style={styles.modalActions}>
              <button onClick={() => setShowExport(false)} style={styles.secondaryButton}>
                {t.close}
              </button>
              <button onClick={copyExportToClipboard} style={styles.primaryButton}>
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Modal - Choose next action */}
      {showSuccessModal && (
        <div
          style={styles.modalOverlay}
          onClick={(e) => e.target === e.currentTarget && handleScheduleMore()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          <div style={{ ...styles.modal, maxWidth: '450px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h2 id="success-title" style={{
              ...styles.modalTitle,
              color: lastSignedUpRole === 'tech' ? colors.techAccent : colors.accent
            }}>
              {t.signUpSuccess}
            </h2>
            
            <p style={{ color: colors.textMuted, marginBottom: '1.5rem' }}>
              {lastSignedUpShifts.length} {lastSignedUpShifts.length === 1 ? t.shift : 'shifts'} 
              {' • '}
              {lastSignedUpRole === 'tech' ? t.techSupport : t.eventChampion}
            </p>
            
            {pendingCalendarShifts.length > 0 && (
              <p style={{ 
                color: colors.accent, 
                fontSize: '0.9rem', 
                marginBottom: '1rem',
                backgroundColor: `${colors.accent}15`,
                padding: '0.5rem 1rem',
                borderRadius: '8px'
              }}>
                📅 {pendingCalendarShifts.length + lastSignedUpShifts.length} {t.pendingShifts}
              </p>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={handleScheduleMore}
                style={{
                  ...styles.primaryButton,
                  ...(lastSignedUpRole === 'tech' ? { backgroundColor: colors.techAccent, color: colors.onTechAccent } : {})
                }}
              >
                {t.scheduleMore}
              </button>
              <button 
                onClick={handleAddToCalendarNow}
                style={styles.secondaryButton}
              >
                📅 {t.addToCalendarNow}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Calendar Modal - Add all pending shifts */}
      {showCalendarModal && (
        <div
          style={styles.modalOverlay}
          onClick={(e) => e.target === e.currentTarget && handleCalendarDone()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="calendar-title"
        >
          <div style={{ ...styles.modal, maxWidth: '500px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h2 id="calendar-title" style={styles.modalTitle}>
              {t.addToCalendar}
            </h2>
            
            <p style={{ color: colors.textMuted, marginBottom: '1.5rem' }}>
              {pendingCalendarShifts.length} {pendingCalendarShifts.length === 1 ? t.shift : 'shifts'}
            </p>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <button 
                onClick={() => openGoogleCalendar()} 
                style={{
                  ...styles.secondaryButton,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                📅 {t.googleCalendar}
              </button>
              <button 
                onClick={() => downloadIcsFile()} 
                style={{
                  ...styles.secondaryButton,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                📥 {t.downloadIcs}
              </button>
              <button 
                onClick={() => emailIcsFile()} 
                style={{
                  ...styles.secondaryButton,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                ✉️ {t.emailIcs}
              </button>
            </div>
            
            <p style={{ 
              color: colors.textMuted, 
              fontSize: '0.85rem', 
              marginBottom: '1.5rem',
              backgroundColor: colors.bg,
              padding: '0.75rem',
              borderRadius: '8px',
              lineHeight: '1.5'
            }}>
              💡 {t.icsEmailTip}
            </p>
            
            <button 
              onClick={handleCalendarDone}
              style={styles.primaryButton}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Add Form Component
function AdminAddForm({ shiftId, onAdd, t, styles, colors, isTech = false }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = () => {
    onAdd(shiftId, name, email);
    setName('');
    setEmail('');
    setIsOpen(false);
  };
  
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        style={{
          ...styles.addButton,
          ...(isTech ? { borderColor: colors.techAccent, color: colors.techAccent } : {})
        }}
      >
        + {isTech ? t.addTech : t.add}
      </button>
    );
  }
  
  return (
    <div style={styles.adminAddForm}>
      <input
        type="text"
        placeholder={t.name}
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.adminInput}
        aria-label={t.name}
      />
      <input
        type="email"
        placeholder={t.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.adminInput}
        aria-label={t.email}
      />
      <div style={styles.adminAddActions}>
        <button onClick={() => setIsOpen(false)} style={styles.smallSecondaryButton}>
          {t.cancel}
        </button>
        <button 
          onClick={handleSubmit} 
          style={{
            ...styles.smallPrimaryButton,
            ...(isTech ? { backgroundColor: colors.techAccent } : {})
          }}
        >
          {t.save}
        </button>
      </div>
    </div>
  );
}

// ============================================
// STYLES
// ============================================
const getStyles = (colors) => ({
  container: {
    minHeight: '100vh',
    backgroundColor: colors.bg,
    color: colors.text,
    fontFamily: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  
  // Skip link for keyboard navigation (visible on focus)
  skipLink: {
    position: 'absolute',
    top: '-100px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: colors.accent,
    color: colors.onAccent,
    padding: '1rem 2rem',
    borderRadius: '0 0 8px 8px',
    zIndex: 9999,
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'top 0.2s ease',
  },
  
  // Screen reader only (visually hidden)
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
  
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  
  loadingSpinner: {
    textAlign: 'center',
  },
  
  spinnerGear: {
    fontSize: '4rem',
    color: colors.accent,
    animation: 'spin 2s linear infinite',
  },
  
  eventEndedMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    textAlign: 'center',
    padding: '2rem',
    color: colors.accent,
  },
  
  header: {
    background: `linear-gradient(135deg, ${colors.bgSecondary} 0%, ${colors.bg} 100%)`,
    borderBottom: `3px solid ${colors.title}`,
    padding: '1.5rem max(1rem, env(safe-area-inset-left)) 1.5rem max(1rem, env(safe-area-inset-right))',
    paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
  },
  
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  
  titleGroup: {
    flex: '1 1 auto',
  },
  
  title: {
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    fontWeight: '700',
    color: colors.title,
    margin: '0',
    letterSpacing: '0.05em',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  
  subtitle: {
    fontSize: '1.1rem',
    color: colors.textMuted,
    margin: '0.25rem 0 0 0',
    fontStyle: 'italic',
  },
  
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'flex-end',
  },
  
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  
  controlLabel: {
    fontSize: '0.8rem',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  
  select: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    backgroundColor: colors.bgSecondary,
    color: colors.text,
    border: `2px solid ${colors.border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    minWidth: '120px',
    minHeight: '44px',
    touchAction: 'manipulation',
  },
  
  toggleButton: {
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    backgroundColor: colors.bgSecondary,
    color: colors.text,
    border: `2px solid ${colors.border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '44px',
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  
  successBanner: {
    backgroundColor: colors.available,
    color: colors.onAvailable,
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  
  actionBar: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1.5rem max(1rem, env(safe-area-inset-left)) 1.5rem max(1rem, env(safe-area-inset-right))',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  
  actionGroup: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  
  pendingBanner: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0.75rem max(1rem, env(safe-area-inset-left))',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: `${colors.accent}15`,
    borderTop: `2px solid ${colors.accent}`,
    borderBottom: `2px solid ${colors.accent}`,
    color: colors.accent,
    fontWeight: '600',
  },
  
  pendingBannerButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    backgroundColor: colors.accent,
    color: colors.onAccent,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  
  primaryButton: {
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: colors.accent,
    color: colors.onAccent,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    minHeight: '48px',
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  
  secondaryButton: {
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: 'transparent',
    color: colors.accent,
    border: `2px solid ${colors.accent}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '48px',
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  
  dangerButton: {
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: 'transparent',
    color: colors.error,
    border: `2px solid ${colors.error}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '48px',
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  
  rulesPanel: {
    maxWidth: '1400px',
    margin: '0 auto 1rem auto',
    padding: '0 2rem',
  },
  
  rulesSummary: {
    cursor: 'pointer',
    color: colors.accent,
    fontSize: '1rem',
    fontWeight: '600',
    padding: '0.5rem 0',
  },
  
  rulesDialogue: {
    backgroundColor: colors.bgSecondary,
    padding: '1.25rem',
    borderRadius: '8px',
    marginTop: '0.5rem',
    lineHeight: '1.7',
    fontSize: '1rem',
    color: colors.text,
  },
  
  legend: {
    maxWidth: '1400px',
    margin: '0 auto 1.5rem auto',
    padding: '0 2rem',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  legendDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: `2px solid ${colors.border}`,
  },
  
  scheduleContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 max(1rem, env(safe-area-inset-left)) 3rem max(1rem, env(safe-area-inset-right))',
    paddingBottom: 'max(3rem, env(safe-area-inset-bottom))',
  },
  
  // Collapsible Block Styles
  blockSection: {
    marginBottom: '1rem',
    borderRadius: '12px',
    overflow: 'hidden',
    border: `2px solid ${colors.border}`,
  },
  
  blockHeader: {
    width: '100%',
    padding: '1rem 1.25rem',
    backgroundColor: colors.bgSecondary,
    color: colors.text,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    transition: 'all 0.2s ease',
    minHeight: '60px',
    touchAction: 'manipulation',
  },
  
  blockHeaderExpanded: {
    backgroundColor: colors.accent,
    color: colors.onAccent,
  },
  
  blockHeaderHighlight: {
    animation: 'pulse 2s infinite',
    boxShadow: `0 0 0 3px ${colors.accent}`,
  },
  
  blockHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  
  blockIcon: {
    fontSize: '1.5rem',
  },
  
  blockTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  
  blockHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  
  availableBadge: {
    backgroundColor: colors.available,
    color: colors.onAvailable,
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  
  expandIcon: {
    fontSize: '1rem',
    transition: 'transform 0.2s ease',
  },
  
  tapHint: {
    backgroundColor: colors.expandBg,
    color: colors.accent,
    textAlign: 'center',
    padding: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    borderTop: `1px dashed ${colors.border}`,
    animation: 'bounce 1s infinite',
  },
  
  blockContent: {
    backgroundColor: colors.bg,
    padding: '1rem',
  },
  
  // Shift Row Styles (combined layout)
  shiftRow: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 1fr',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: colors.bgSecondary,
    borderRadius: '8px',
    marginBottom: '0.75rem',
    alignItems: 'start',
  },
  
  shiftRowCurrent: {
    border: `3px solid ${colors.available}`,
    boxShadow: `0 0 15px ${colors.available}40`,
  },
  
  shiftRowNext: {
    border: `2px dashed ${colors.partial}`,
  },
  
  shiftTimeCol: {
    textAlign: 'center',
    paddingTop: '0.25rem',
  },
  
  shiftTime: {
    fontSize: '1rem',
    fontWeight: '700',
    color: colors.text,
  },
  
  shiftTimeTo: {
    fontSize: '0.75rem',
    color: colors.textMuted,
    margin: '0.125rem 0',
  },
  
  nowBadge: {
    backgroundColor: colors.available,
    color: colors.onAvailable,
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '700',
    marginTop: '0.5rem',
    display: 'inline-block',
  },
  
  nextBadge: {
    backgroundColor: colors.partial,
    color: colors.onPartial,
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '700',
    marginTop: '0.5rem',
    display: 'inline-block',
  },
  
  roleColumn: {
    minWidth: 0,
  },
  
  roleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  
  roleLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  
  championsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  
  championChip: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg,
    padding: '0.4rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    border: `1px solid ${colors.accent}`,
  },
  
  removeChip: {
    background: 'none',
    border: 'none',
    color: colors.error,
    cursor: 'pointer',
    padding: '0.25rem',
    fontSize: '0.9rem',
    minWidth: '28px',
    minHeight: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  openSlot: {
    fontSize: '0.8rem',
    color: colors.textMuted,
    fontStyle: 'italic',
    padding: '0.25rem 0',
  },
  
  openSlotButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'transparent',
    color: colors.accent,
    border: `2px dashed ${colors.accent}`,
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    width: '100%',
    justifyContent: 'center',
  },
  
  openSlotPlus: {
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  
  inlineForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: colors.bg,
    borderRadius: '8px',
    border: `2px solid ${colors.accent}`,
  },
  
  inlineInput: {
    padding: '0.6rem',
    fontSize: '14px',
    backgroundColor: colors.bgSecondary,
    color: colors.text,
    border: `2px solid ${colors.accent}`,
    borderRadius: '6px',
    width: '100%',
    boxSizing: 'border-box',
  },
  
  inlineError: {
    color: colors.error,
    fontSize: '0.75rem',
    marginTop: '-0.25rem',
  },
  
  inlineRulesError: {
    color: colors.error,
    fontSize: '0.8rem',
    padding: '0.5rem',
    backgroundColor: `${colors.error}15`,
    borderRadius: '4px',
    lineHeight: '1.4',
    fontWeight: '500',
  },
  
  inlineActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.25rem',
  },
  
  inlineCancelBtn: {
    flex: 1,
    padding: '0.5rem',
    fontSize: '0.85rem',
    backgroundColor: 'transparent',
    color: colors.text,
    border: `2px solid ${colors.border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    minHeight: '44px',
    fontWeight: '500',
  },
  
  inlineSubmitBtn: {
    flex: 1,
    padding: '0.5rem',
    fontSize: '0.85rem',
    backgroundColor: colors.accent,
    color: colors.onAccent,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    minHeight: '44px',
  },
  
  techWarning: {
    fontSize: '0.75rem',
    color: colors.techAccent,
    padding: '0.5rem',
    backgroundColor: `${colors.techAccent}15`,
    borderRadius: '4px',
    lineHeight: '1.4',
  },
  
  addButton: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    width: '100%',
    backgroundColor: 'transparent',
    color: colors.accent,
    border: `1px dashed ${colors.accent}`,
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    minHeight: '36px',
    touchAction: 'manipulation',
  },
  
  adminAddForm: {
    marginTop: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  
  adminInput: {
    padding: '0.5rem',
    fontSize: '14px',
    backgroundColor: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    minHeight: '36px',
    WebkitAppearance: 'none',
    appearance: 'none',
  },
  
  adminAddActions: {
    display: 'flex',
    gap: '0.4rem',
    justifyContent: 'flex-end',
  },
  
  smallSecondaryButton: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
    backgroundColor: 'transparent',
    color: colors.text,
    border: `2px solid ${colors.border}`,
    borderRadius: '4px',
    cursor: 'pointer',
    minHeight: '44px',
    touchAction: 'manipulation',
  },
  
  smallPrimaryButton: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
    backgroundColor: colors.accent,
    color: colors.onAccent,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    minHeight: '44px',
    touchAction: 'manipulation',
  },
  
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '1rem',
    paddingTop: 'max(1rem, env(safe-area-inset-top))',
    paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
    zIndex: 1000,
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  
  modal: {
    backgroundColor: colors.bgSecondary,
    borderRadius: '16px',
    padding: '1.5rem',
    maxWidth: '800px',
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
    border: `3px solid ${colors.accent}`,
    maxHeight: 'calc(100vh - 2rem)',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  
  modalTitle: {
    fontSize: '1.75rem',
    color: colors.accent,
    marginTop: 0,
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  
  formGroup: {
    marginBottom: '1.25rem',
  },
  
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: colors.text,
    fontWeight: '600',
  },
  
  input: {
    width: '100%',
    padding: '0.875rem',
    fontSize: '16px',
    backgroundColor: colors.bg,
    color: colors.text,
    border: `2px solid ${colors.border}`,
    borderRadius: '8px',
    boxSizing: 'border-box',
    minHeight: '48px',
    WebkitAppearance: 'none',
    appearance: 'none',
  },
  
  errorText: {
    color: colors.error,
    fontSize: '0.9rem',
    marginTop: '0.25rem',
    display: 'block',
  },
  
  fieldset: {
    border: `2px solid ${colors.border}`,
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  
  legend2: {
    color: colors.accent,
    fontWeight: '600',
    padding: '0 0.5rem',
  },
  
  // Role selection
  roleSelection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '0.75rem',
  },
  
  roleButton: {
    padding: '1rem',
    backgroundColor: colors.bg,
    color: colors.text,
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    minHeight: '80px',
  },
  
  roleButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    color: colors.bg,
  },
  
  roleButtonTech: {
    borderColor: colors.techAccent,
  },
  
  roleButtonTechSelected: {
    backgroundColor: colors.techAccent,
    borderColor: colors.techAccent,
    color: colors.onTechAccent,
  },
  
  roleButtonIcon: {
    fontSize: '1.5rem',
  },
  
  roleButtonText: {
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  
  techDescription: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: `${colors.techAccent}20`,
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: colors.text,
    lineHeight: '1.5',
    borderLeft: `3px solid ${colors.techAccent}`,
  },
  
  // Shift selection grid
  shiftSelectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))',
    gap: '0.75rem',
    marginTop: '1rem',
    maxHeight: '45vh',
    overflow: 'auto',
    padding: '0.5rem',
    WebkitOverflowScrolling: 'touch',
  },
  
  shiftSelectButton: {
    padding: '0.75rem',
    backgroundColor: colors.bg,
    color: colors.text,
    border: `2px solid ${colors.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    minHeight: '70px',
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  
  shiftSelectButton_selected: {
    backgroundColor: colors.available,
    borderColor: colors.selectedBorder,
    color: colors.onAvailable,
  },
  
  shiftSelectButtonTechSelected: {
    backgroundColor: colors.techAccent,
    borderColor: colors.techAccent,
    color: colors.onTechAccent,
  },
  
  shiftSelectButton_disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: colors.bg,
  },
  
  shiftSelectPeriod: {
    fontSize: '0.7rem',
    color: colors.textMuted,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
  },
  
  shiftSelectDate: {
    fontSize: '0.8rem',
    color: colors.textMuted,
  },
  
  shiftSelectTime: {
    fontSize: '1rem',
    fontWeight: '600',
  },
  
  shiftSelectReason: {
    fontSize: '0.75rem',
    color: colors.error,
    marginTop: '0.2rem',
  },
  
  shiftSelectPartial: {
    fontSize: '0.75rem',
    color: colors.partial,
    marginTop: '0.2rem',
  },
  
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1.5rem',
  },
});

// Add CSS animation for spinner and pulse
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
  
  /* Only apply hover effects on devices that support hover (not touch) */
  @media (hover: hover) and (pointer: fine) {
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
    }
  }
  
  /* Active state for touch devices */
  button:active:not(:disabled) {
    transform: scale(0.98);
    opacity: 0.9;
  }
  
  /* Enhanced focus indicators for accessibility - 3px solid outline */
  button:focus-visible,
  a:focus-visible,
  summary:focus-visible {
    outline: 3px solid #14b8a6;
    outline-offset: 3px;
    box-shadow: 0 0 0 6px rgba(20, 184, 166, 0.25);
  }
  
  input:focus-visible, 
  select:focus-visible,
  textarea:focus-visible {
    outline: 3px solid #14b8a6;
    outline-offset: 2px;
    border-color: #14b8a6;
    box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.2);
  }
  
  /* Ensure focus is never hidden by other elements */
  *:focus-visible {
    z-index: 1;
  }
  
  details[open] summary {
    margin-bottom: 0.5rem;
  }
  
  /* Better touch scrolling */
  * {
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Prevent iOS text size adjustment */
  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  
  /* Hide scrollbars on mobile, show on desktop */
  @media (pointer: coarse) {
    ::-webkit-scrollbar {
      display: none;
    }
    * {
      scrollbar-width: none;
    }
  }
  
  @media (pointer: fine) {
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #1a1a2e;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #4a4a6a;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #14b8a6;
    }
  }
  
  /* Responsive grid for shift rows on mobile */
  @media (max-width: 600px) {
    .shift-row-mobile {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);
