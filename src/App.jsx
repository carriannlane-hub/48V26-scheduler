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
  maxChampionsPerShift: 4,
  maxTechPerShift: 1,
  maxGamesPerShift: 2,
  maxTalentExchangePerShift: 2,
  maxProducerPerShift: 2,
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
    text: '#f0ebe5',
    textMuted: '#c4b5a5',
    title: '#e2e8f0',
    accent: '#14b8a6',
    techAccent: '#f59e0b',
    gamesAccent: '#84cc16',
    talentAccent: '#06b6d4',
    producerAccent: '#fb923c',
    onGamesAccent: '#1a2e05',
    onTalentAccent: '#083344',
    border: '#6a6a8a',
    available: '#10b981',
    partial: '#0ea5e9',
    full: '#94a3b8',
    selectedBorder: '#2dd4bf',
    error: '#fca5a5',
    overlay: 'rgba(0,0,0,0.8)',
    expandBg: '#3d3d5c',
    onAccent: '#042f2e',
    onAvailable: '#052e16',
    onPartial: '#082f49',
    onTechAccent: '#451a03',
    onProducerAccent: '#fff7ed',
  },
  light: {
    bg: '#f8fafc',
    bgSecondary: '#ffffff',
    text: '#1e293b',
    textMuted: '#475569',
    title: '#0f172a',
    accent: '#0f766e',
    techAccent: '#b45309',
    gamesAccent: '#65a30d',
    talentAccent: '#0891b2',
    producerAccent: '#ea580c',
    border: '#94a3b8',
    available: '#047857',
    partial: '#0369a1',
    full: '#475569',
    selectedBorder: '#14b8a6',
    error: '#dc2626',
    overlay: 'rgba(0,0,0,0.5)',
    expandBg: '#e2e8f0',
    onAccent: '#f0fdfa',
    onAvailable: '#f0fdf4',
    onPartial: '#f0f9ff',
    onTechAccent: '#fffbeb',
    onGamesAccent: '#f7fee7',
    onTalentAccent: '#ecfeff',
    onProducerAccent: '#fff7ed',
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
    games: "Games",
    gamesFull: "Games Champion",
    gamesDescription: "You'll support the Games sessions, helping participants navigate activities and facilitating game play across the event.",
    addGames: "Add Games Champion",
    talentExchange: "Talent Exchange",
    talentExchangeFull: "Talent Exchange Champion",
    talentExchangeDescription: "You'll support the Talent Exchange sessions, connecting talent and helping participants showcase and discover skills across the event.",
    addTalentExchange: "Add Talent Exchange Champion",
    producer: "Producer",
    producerFull: "Event Producer",
    producerDescription: "As a Producer, you'll manage behind-the-scenes logistics, coordination, and technical production support.",
    addProducer: "Add Producer",
    specialtyRoles: "Specialty Roles",
    techDescription: "Technical troubleshooting experience required. You'll help with A/V, streaming, and technical issues.",
    submit: "Submit Sign-Up",
    submitting: "Submitting...",
    timezoneNote: "All shifts are displayed in your local time. \"Sententral Time\" is Central Time (US).",
    cancel: "Cancel",
    adminMode: "Admin Mode",
    exitAdmin: "Exit Admin",
    clearAll: "Clear All",
    clearAllConfirm: "Are you sure you want to remove ALL sign-ups? This cannot be undone.",
    enterPassword: "Enter admin password",
    login: "Login",
    wrongPassword: "Incorrect password",
    export: "Export Schedule",
    printSchedule: "Print Schedule",
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
    rulesDialogue: `Hello Champions! Thanks for bringing GamiCon48V to life!

If you are an Event Champion, please take "Champions" shifts.

<strong>Event Champion Role:</strong> You'll help deliver a seamless, high-energy experience across all time zones. Serve 12 hours during the 48-hour broadcast to assist with chat moderation, participant support, transitions, and surprise moments of delight.

If you have been confirmed as a Tech Support Champion, you can take "Tech" shifts.

<strong>Tech Support Champion Role:</strong> You'll provide proactive technical support for all participants, speakers, and hosts across the global broadcast. Oversee setup, troubleshooting, and smooth operation of all digital platforms, including GoBrunch and the BlueRabbit app, live streaming systems and recordings of all sessions, to ensure flawless execution. <strong>Only take a shift in this role if you have been approved to do so by Monica Cornetti or the Chief of Staff.</strong>

Shifts are 2 hours each. You can take up to 2 shifts back-to-back (4 hours max), then please rest for at least 2 hours. We would like you to take up to 12 hours total. We want you energized, not exhausted! If you have questions, please contact Carriann Lane through the Event Champions WhatsApp group. She's happy to help!`,
    blocked: "Blocked (need 2-hour break)",
    dayLimit: "Total limit reached",
    totalLimit: "12-hour limit reached",
    alreadySignedUp: "You're signed up",
    signUpSuccess: "Successfully signed up!",
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
    tapToExpand: "TAP TO SEE SHIFTS",
    shiftsAvailable: "shifts available",
    currentShift: "NOW",
    upNext: "UP NEXT",
    eventEnded: "Event has ended. Thank you Champions!",
    confirmTechRole: "Tech Support requires technical experience. Are you sure?",
    techConfirmYes: "Yes, I have tech experience",
    techConfirmNo: "No, go back",
    seeMyShifts: "See My Shifts",
    print: "Print",
    seeMyShiftsHint: "Use \"See My Shifts\" anytime to view or print your schedule.",
    enterYourEmail: "Enter your email to see your shifts",
    lookupShifts: "Look Up My Shifts",
    noShiftsFound: "No shifts found for this email.",
    myShiftsTitle: "My Shifts",
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
    games: "游戏",
    gamesFull: "游戏冠军",
    gamesDescription: "您将支持游戏环节，帮助参与者参与活动并促进整个活动的游戏进行。",
    addGames: "添加游戏冠军",
    talentExchange: "人才交流",
    talentExchangeFull: "人才交流冠军",
    talentExchangeDescription: "您将支持人才交流环节，连接人才并帮助参与者展示和发现整个活动中的技能。",
    addTalentExchange: "添加人才交流冠军",
    producer: "制作人",
    producerFull: "活动制作人",
    producerDescription: "作为制作人，您将管理幕后后勤、协调和技术制作支持。",
    addProducer: "添加制作人",
    specialtyRoles: "专业角色",
    techDescription: "需要技术故障排除经验。您将帮助处理音视频、流媒体和技术问题。",
    submit: "提交报名",
    submitting: "提交中...",
    timezoneNote: "所有班次均以您当地时间显示。\"Sententral Time\" 是美国中部时间。",
    cancel: "取消",
    adminMode: "管理员模式",
    exitAdmin: "退出管理",
    clearAll: "清除全部",
    clearAllConfirm: "您确定要删除所有报名吗？此操作无法撤销。",
    enterPassword: "输入管理员密码",
    login: "登录",
    wrongPassword: "密码错误",
    export: "导出日程",
    printSchedule: "打印日程",
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
    tapToExpand: "点击查看班次",
    shiftsAvailable: "个班次可用",
    currentShift: "现在",
    upNext: "下一个",
    eventEnded: "活动已结束。感谢冠军们！",
    confirmTechRole: "技术支持需要技术经验。您确定吗？",
    techConfirmYes: "是的，我有技术经验",
    techConfirmNo: "不，返回",
    seeMyShifts: "查看我的班次",
    print: "打印",
    seeMyShiftsHint: "随时使用「查看我的班次」来查看或打印您的排班。",
    enterYourEmail: "输入您的邮箱查看您的班次",
    lookupShifts: "查找我的班次",
    noShiftsFound: "未找到该邮箱的班次。",
    myShiftsTitle: "我的班次",
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
    games: "เกมส์",
    gamesFull: "แชมเปี้ยนเกมส์",
    gamesDescription: "คุณจะสนับสนุนเซสชันเกมส์ ช่วยผู้เข้าร่วมในกิจกรรมและอำนวยความสะดวกในการเล่นเกมส์ตลอดงาน",
    addGames: "เพิ่มแชมเปี้ยนเกมส์",
    talentExchange: "แลกเปลี่ยนความสามารถ",
    talentExchangeFull: "แชมเปี้ยนแลกเปลี่ยนความสามารถ",
    talentExchangeDescription: "คุณจะสนับสนุนเซสชันแลกเปลี่ยนความสามารถ เชื่อมต่อผู้มีความสามารถและช่วยผู้เข้าร่วมแสดงและค้นพบทักษะตลอดงาน",
    addTalentExchange: "เพิ่มแชมเปี้ยนแลกเปลี่ยนความสามารถ",
    producer: "ผู้จัดการ",
    producerFull: "ผู้จัดการงาน",
    producerDescription: "ในฐานะผู้จัดการ คุณจะดูแลด้านหลังเวที ประสานงาน และสนับสนุนการผลิต",
    addProducer: "เพิ่มผู้จัดการ",
    specialtyRoles: "บทบาทพิเศษ",
    techDescription: "ต้องมีประสบการณ์ด้านเทคนิค คุณจะช่วยเรื่องเสียง/ภาพ การสตรีม และปัญหาทางเทคนิค",
    submit: "ส่งการลงทะเบียน",
    submitting: "กำลังส่ง...",
    timezoneNote: "กะทั้งหมดแสดงตามเวลาท้องถิ่นของคุณ \"Sententral Time\" คือเวลามาตรฐานกลางสหรัฐ",
    cancel: "ยกเลิก",
    adminMode: "โหมดผู้ดูแล",
    exitAdmin: "ออกจากโหมดผู้ดูแล",
    clearAll: "ล้างทั้งหมด",
    clearAllConfirm: "คุณแน่ใจหรือไม่ว่าต้องการลบการลงทะเบียนทั้งหมด? การดำเนินการนี้ไม่สามารถยกเลิกได้",
    enterPassword: "ใส่รหัสผ่านผู้ดูแล",
    login: "เข้าสู่ระบบ",
    wrongPassword: "รหัสผ่านไม่ถูกต้อง",
    export: "ส่งออกตาราง",
    printSchedule: "พิมพ์ตาราง",
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
    tapToExpand: "แตะเพื่อดูกะ",
    shiftsAvailable: "กะที่ว่าง",
    currentShift: "ตอนนี้",
    upNext: "ถัดไป",
    eventEnded: "อีเวนต์สิ้นสุดแล้ว ขอบคุณแชมเปี้ยนทุกคน!",
    confirmTechRole: "ฝ่ายเทคนิคต้องมีประสบการณ์ทางเทคนิค คุณแน่ใจหรือไม่?",
    techConfirmYes: "ใช่ ฉันมีประสบการณ์",
    techConfirmNo: "ไม่ กลับ",
    seeMyShifts: "ดูกะของฉัน",
    print: "พิมพ์",
    seeMyShiftsHint: "ใช้ 'ดูกะของฉัน' เพื่อดูหรือพิมพ์ตารางของคุณได้ตลอดเวลา",
    enterYourEmail: "ใส่อีเมลเพื่อดูกะของคุณ",
    lookupShifts: "ค้นหากะของฉัน",
    noShiftsFound: "ไม่พบกะสำหรับอีเมลนี้",
    myShiftsTitle: "กะของฉัน",
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
    games: "الألعاب",
    gamesFull: "بطل الألعاب",
    gamesDescription: "ستدعم جلسات الألعاب، مساعدة المشاركين في الأنشطة وتيسير اللعب عبر الفعالية.",
    addGames: "إضافة بطل الألعاب",
    talentExchange: "تبادل المواهب",
    talentExchangeFull: "بطل تبادل المواهب",
    talentExchangeDescription: "ستدعم جلسات تبادل المواهب، وربط المواهب ومساعدة المشاركين على عرض المهارات واكتشافها.",
    addTalentExchange: "إضافة بطل تبادل المواهب",
    producer: "منتج",
    producerFull: "منتج الفعالية",
    producerDescription: "بصفتك منتجاً، ستدير الخدمات اللوجستية خلف الكواليس والتنسيق ودعم الإنتاج التقني.",
    addProducer: "إضافة منتج",
    specialtyRoles: "الأدوار المتخصصة",
    techDescription: "يتطلب خبرة في استكشاف الأخطاء التقنية. ستساعد في الصوت والفيديو والبث والمشاكل التقنية.",
    submit: "إرسال التسجيل",
    submitting: "جارٍ الإرسال...",
    timezoneNote: "جميع النوبات معروضة بتوقيتك المحلي. \"Sententral Time\" هو التوقيت المركزي الأمريكي.",
    cancel: "إلغاء",
    adminMode: "وضع المسؤول",
    exitAdmin: "خروج المسؤول",
    clearAll: "مسح الكل",
    clearAllConfirm: "هل أنت متأكد أنك تريد إزالة جميع التسجيلات؟ لا يمكن التراجع عن هذا.",
    enterPassword: "أدخل كلمة مرور المسؤول",
    login: "تسجيل الدخول",
    wrongPassword: "كلمة مرور خاطئة",
    export: "تصدير الجدول",
    printSchedule: "طباعة الجدول",
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
    tapToExpand: "انقر لعرض النوبات",
    shiftsAvailable: "نوبات متاحة",
    currentShift: "الآن",
    upNext: "التالي",
    eventEnded: "انتهى الحدث. شكراً للأبطال!",
    confirmTechRole: "الدعم الفني يتطلب خبرة تقنية. هل أنت متأكد؟",
    techConfirmYes: "نعم، لدي خبرة تقنية",
    techConfirmNo: "لا، العودة",
    seeMyShifts: "عرض نوباتي",
    print: "طباعة",
    seeMyShiftsHint: "استخدم 'عرض نوباتي' في أي وقت لعرض أو طباعة جدولك.",
    enterYourEmail: "أدخل بريدك الإلكتروني لعرض نوباتك",
    lookupShifts: "البحث عن نوباتي",
    noShiftsFound: "لم يتم العثور على نوبات لهذا البريد الإلكتروني.",
    myShiftsTitle: "نوباتي",
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
    games: "Jeux",
    gamesFull: "Champion Jeux",
    gamesDescription: "Vous soutiendrez les sessions Jeux, aidant les participants à naviguer dans les activités et facilitant le jeu.",
    addGames: "Ajouter champion Jeux",
    talentExchange: "Échange de talents",
    talentExchangeFull: "Champion Échange de talents",
    talentExchangeDescription: "Vous soutiendrez les sessions Échange de talents, connectant les talents et aidant les participants à présenter et découvrir des compétences.",
    addTalentExchange: "Ajouter champion Échange de talents",
    producer: "Producteur",
    producerFull: "Producteur de l'événement",
    producerDescription: "En tant que producteur, vous gérerez la logistique en coulisses, la coordination et le support technique.",
    addProducer: "Ajouter producteur",
    specialtyRoles: "Rôles spécialisés",
    techDescription: "Expérience technique requise. Vous aiderez avec l'audio/vidéo, le streaming et les problèmes techniques.",
    submit: "Soumettre l'inscription",
    submitting: "Envoi en cours...",
    timezoneNote: "Tous les créneaux sont affichés dans votre heure locale. \"Sententral Time\" correspond à l'heure centrale américaine.",
    cancel: "Annuler",
    adminMode: "Mode admin",
    exitAdmin: "Quitter admin",
    clearAll: "Tout effacer",
    clearAllConfirm: "Êtes-vous sûr de vouloir supprimer TOUTES les inscriptions ? Cette action est irréversible.",
    enterPassword: "Entrez le mot de passe admin",
    login: "Connexion",
    wrongPassword: "Mot de passe incorrect",
    export: "Exporter le planning",
    printSchedule: "Imprimer le planning",
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
    tapToExpand: "APPUYEZ POUR VOIR",
    shiftsAvailable: "créneaux disponibles",
    currentShift: "EN COURS",
    upNext: "SUIVANT",
    eventEnded: "L'événement est terminé. Merci Champions !",
    confirmTechRole: "Le support technique nécessite une expérience technique. Êtes-vous sûr ?",
    techConfirmYes: "Oui, j'ai l'expérience",
    techConfirmNo: "Non, retour",
    seeMyShifts: "Voir mes créneaux",
    print: "Imprimer",
    seeMyShiftsHint: "Utilisez 'Voir mes créneaux' pour consulter ou imprimer votre planning.",
    enterYourEmail: "Entrez votre e-mail pour voir vos créneaux",
    lookupShifts: "Chercher mes créneaux",
    noShiftsFound: "Aucun créneau trouvé pour cet e-mail.",
    myShiftsTitle: "Mes créneaux",
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format date for ICS files (UTC format)
const formatICSDate = (date) => {
  return date.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
};

// Generate ICS file content for all shifts at once (Apple / Outlook)
const generateICS = (shiftsList, role, roleLabel) => {
  const events = shiftsList.map((shift, i) => [
    'BEGIN:VEVENT',
    `UID:gamicon48v-shift-${shift.id}-${i}@gamicon2026`,
    `DTSTART:${formatICSDate(shift.start)}`,
    `DTEND:${formatICSDate(shift.end)}`,
    `SUMMARY:GamiCon48V 2026 \u2013 ${roleLabel}`,
    `DESCRIPTION:Your ${roleLabel} shift for GamiCon48V 2026. Questions? Contact Carriann Lane through the Event Champions WhatsApp group.`,
    'END:VEVENT'
  ].join('\r\n')).join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GamiCon48V//Event Champion Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    events,
    'END:VCALENDAR'
  ].join('\r\n');
};

// Generate a Google Calendar URL for a single shift
const getGoogleCalendarURL = (shift, roleLabel) => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `GamiCon48V 2026 \u2013 ${roleLabel}`,
    dates: `${formatICSDate(shift.start)}/${formatICSDate(shift.end)}`,
    details: `Your ${roleLabel} shift for GamiCon48V 2026. Questions? Contact Carriann Lane through the Event Champions WhatsApp group.`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Trigger ICS file download
const downloadICS = (content, filename) => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

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
      techChampions: [],
      gamesChampions: [],
      talentExchangeChampions: [],
      producerChampions: [],
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

const getDefaultExpandedBlocks = (blocks, isEventActive, isEventOver) => {
  const now = new Date();
  
  if (isEventOver) {
    return {};
  }
  
  if (!isEventActive) {
    return blocks.length > 0 ? { [blocks[0].key]: true } : {};
  }
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const lastShift = block.shifts[block.shifts.length - 1];
    
    if (lastShift.end > now) {
      return { [block.key]: true };
    }
  }
  
  return {};
};

const isEventOver = () => {
  return new Date() > EVENT_CONFIG.endTime;
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
  const [lastSignedUpShifts, setLastSignedUpShifts] = useState([]);
  const [lastSignedUpRole, setLastSignedUpRole] = useState('champion');
  const [expandedBlocks, setExpandedBlocks] = useState({});
  const [inlineSignUp, setInlineSignUp] = useState(null);
  const [showMyShifts, setShowMyShifts] = useState(false);
  const [myShiftsEmail, setMyShiftsEmail] = useState('');
  const [myShiftsList, setMyShiftsList] = useState([]);
  const [myShiftsRole, setMyShiftsRole] = useState('');
  const [myShiftsLoading, setMyShiftsLoading] = useState(false);
  const [myShiftsError, setMyShiftsError] = useState('');
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [savedUserInfo, setSavedUserInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('gamicon48v-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [inlineName, setInlineName] = useState('');
  const [inlineEmail, setInlineEmail] = useState('');
  const [inlineErrors, setInlineErrors] = useState({});
  const [isInlineSubmitting, setIsInlineSubmitting] = useState(false);
  
  const adminButtonRef = React.useRef(null);
  const adminModalRef = React.useRef(null);
  const adminFirstInputRef = React.useRef(null);
  
  const t = translations[language];
  const isRTL = language === 'ar';
  const colors = themes[theme];
  const timezone = showLocalTime ? userTimezone : 'America/Chicago';
  
  const eventOver = isEventOver();
  const shiftBlocks = groupShiftsIntoBlocks(shifts, timezone);
  const styles = getStyles(colors);
  
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 600);
  const [isTablet, setIsTablet] = useState(() => typeof window !== 'undefined' && window.innerWidth < 900);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
      setIsTablet(window.innerWidth < 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const defaultExpanded = getDefaultExpandedBlocks(shiftBlocks, false, eventOver);
    setExpandedBlocks(defaultExpanded);
  }, [eventOver]);
  
  useEffect(() => {
    if (showAdminLogin && adminFirstInputRef.current) {
      adminFirstInputRef.current.focus();
    }
  }, [showAdminLogin]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showAdminLogin) {
          setShowAdminLogin(false);
          adminButtonRef.current?.focus();
        }
        if (showExport) setShowExport(false);
        if (showSuccessModal) setShowSuccessModal(false);
        if (inlineSignUp) setInlineSignUp(null);
        if (showMyShifts) {
          setShowMyShifts(false);
          setMyShiftsList([]);
          setShowCalendarDropdown(false);
        }
        if (showCalendarDropdown) setShowCalendarDropdown(false);
      }
      
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
    
    if (showAdminLogin || showExport || showSuccessModal || showMyShifts) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showAdminLogin, showExport, showSuccessModal, showMyShifts, inlineSignUp, showCalendarDropdown]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('shifts')
          .select('id, champions, tech_champions, gte_champions, talent_exchange_champions, producer_champions')
          .order('id');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const baseShifts = generateShifts();
          const mergedShifts = baseShifts.map(shift => {
            const saved = data.find(s => s.id === shift.id);
            return saved ? { 
              ...shift, 
              champions: saved.champions || [],
              techChampions: saved.tech_champions || [],
              gamesChampions: saved.gte_champions || [],
              talentExchangeChampions: saved.talent_exchange_champions || [],
              producerChampions: saved.producer_champions || [],
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
  
  const saveShifts = useCallback(async (newShifts) => {
    try {
      for (const shift of newShifts) {
        const { error } = await supabase
          .from('shifts')
          .update({ 
            champions: shift.champions,
            tech_champions: shift.techChampions,
            gte_champions: shift.gamesChampions,
            talent_exchange_champions: shift.talentExchangeChampions,
            producer_champions: shift.producerChampions,
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
  
  const toggleBlock = (blockKey) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockKey]: !prev[blockKey]
    }));
  };
  
  const canSelectShift = (shiftId, currentSelections, userEmail = null, role = 'champion') => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return { allowed: false, reason: 'invalid' };
    
    if (role === 'champion' && shift.champions.length >= EVENT_CONFIG.maxChampionsPerShift) {
      return { allowed: false, reason: 'full' };
    }
    if (role === 'tech' && shift.techChampions.length >= EVENT_CONFIG.maxTechPerShift) {
      return { allowed: false, reason: 'full' };
    }
    if (role === 'games' && shift.gamesChampions.length >= EVENT_CONFIG.maxGamesPerShift) {
      return { allowed: false, reason: 'full' };
    }
    if (role === 'talentExchange' && shift.talentExchangeChampions.length >= EVENT_CONFIG.maxTalentExchangePerShift) {
      return { allowed: false, reason: 'full' };
    }
    if (role === 'producer' && shift.producerChampions.length >= EVENT_CONFIG.maxProducerPerShift) {
      return { allowed: false, reason: 'full' };
    }
    
    if (userEmail) {
      const inChampions = shift.champions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
      const inTech = shift.techChampions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
      const inGames = shift.gamesChampions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
      const inProducer = shift.producerChampions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
      if (inChampions || inTech || inGames || inProducer) {
        return { allowed: false, reason: 'alreadySignedUp' };
      }
    }
    
    const allUserShiftIds = [...currentSelections];
    if (userEmail) {
      shifts.forEach(s => {
        const inC = s.champions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
        const inT = s.techChampions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
        const inG = s.gamesChampions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
        const inP = s.producerChampions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
        if (inC || inT || inG || inP) allUserShiftIds.push(s.id);
      });
    }
    
    const potentialShifts = [...new Set([...allUserShiftIds, shiftId])].sort((a, b) => a - b);
    
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
    
    const totalHours = potentialShifts.length * EVENT_CONFIG.shiftDurationHours;
    if (totalHours > EVENT_CONFIG.maxHoursTotal) {
      return { allowed: false, reason: 'totalLimit' };
    }
    
    return { allowed: true };
  };
  
  const handleAdminRemove = async (shiftId, championIndex, roleType = 'champion') => {
    if (!window.confirm(t.removeConfirm)) return;
    
    const newShifts = shifts.map(shift => {
      if (shift.id === shiftId) {
        if (roleType === 'tech') {
          const newTech = [...shift.techChampions];
          newTech.splice(championIndex, 1);
          return { ...shift, techChampions: newTech };
        } else if (roleType === 'games') {
          const newGames = [...shift.gamesChampions];
          newGames.splice(championIndex, 1);
          return { ...shift, gamesChampions: newGames };
        } else if (roleType === 'talentExchange') {
          const newTalent = [...shift.talentExchangeChampions];
          newTalent.splice(championIndex, 1);
          return { ...shift, talentExchangeChampions: newTalent };
        } else if (roleType === 'producer') {
          const newProducer = [...shift.producerChampions];
          newProducer.splice(championIndex, 1);
          return { ...shift, producerChampions: newProducer };
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
  
  const handleAdminAdd = async (shiftId, name, email, roleType = 'champion') => {
    if (!name.trim() || !email.trim()) return;
    
    const newShifts = shifts.map(shift => {
      if (shift.id === shiftId) {
        if (roleType === 'tech') {
          return { ...shift, techChampions: [...shift.techChampions, { name: name.trim(), email: email.trim() }] };
        } else if (roleType === 'games') {
          return { ...shift, gamesChampions: [...shift.gamesChampions, { name: name.trim(), email: email.trim() }] };
        } else if (roleType === 'talentExchange') {
          return { ...shift, talentExchangeChampions: [...shift.talentExchangeChampions, { name: name.trim(), email: email.trim() }] };
        } else if (roleType === 'producer') {
          return { ...shift, producerChampions: [...shift.producerChampions, { name: name.trim(), email: email.trim() }] };
        } else {
          return { ...shift, champions: [...shift.champions, { name: name.trim(), email: email.trim() }] };
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
      techChampions: [],
      gamesChampions: [],
      talentExchangeChampions: [],
      producerChampions: [],
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
    let csv = 'Shift,Date,Start Time,End Time,Time Period,Champion 1,Email 1,Champion 2,Email 2,Champion 3,Email 3,Champion 4,Email 4,Tech Support,Tech Email,Games 1,Games Email 1,Games 2,Games Email 2,Talent Exchange 1,Talent Email 1,Talent Exchange 2,Talent Email 2,Producer 1,Producer Email 1,Producer 2,Producer Email 2\n';
    
    shifts.forEach((shift, index) => {
      const timePeriod = getTimePeriod(shift.start, tz);
      const row = [
        index + 1,
        formatDate(shift.start, tz),
        formatTime(shift.start, tz),
        formatTime(shift.end, tz),
        timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1),
        shift.champions[0]?.name || '', shift.champions[0]?.email || '',
        shift.champions[1]?.name || '', shift.champions[1]?.email || '',
        shift.champions[2]?.name || '', shift.champions[2]?.email || '',
        shift.champions[3]?.name || '', shift.champions[3]?.email || '',
        shift.techChampions[0]?.name || '', shift.techChampions[0]?.email || '',
        shift.gamesChampions[0]?.name || '', shift.gamesChampions[0]?.email || '',
        shift.gamesChampions[1]?.name || '', shift.gamesChampions[1]?.email || '',
        shift.talentExchangeChampions[0]?.name || '', shift.talentExchangeChampions[0]?.email || '',
        shift.talentExchangeChampions[1]?.name || '', shift.talentExchangeChampions[1]?.email || '',
        shift.producerChampions[0]?.name || '', shift.producerChampions[0]?.email || '',
        shift.producerChampions[1]?.name || '', shift.producerChampions[1]?.email || '',
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
  
  const printFullSchedule = () => {
    const tz = showLocalTime ? userTimezone : 'America/Chicago';
    const tzLabel = showLocalTime ? getTimezoneName(userTimezone) : 'Central Time';
    
    const dayGroups = {};
    shifts.forEach(shift => {
      const dayKey = shift.start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: tz });
      if (!dayGroups[dayKey]) dayGroups[dayKey] = [];
      dayGroups[dayKey].push(shift);
    });
    
    let tableRows = '';
    Object.entries(dayGroups).forEach(([day, dayShifts]) => {
      tableRows += `<tr><td colspan="4" style="padding:12px 12px 8px;font-weight:700;font-size:1.1rem;background:#f1f5f9;border-bottom:2px solid #14b8a6;color:#0f172a">${day}</td></tr>`;
      
      dayShifts.forEach(shift => {
        const startTime = formatTime(shift.start, tz);
        const endTime = formatTime(shift.end, tz);
        const timeStr = `${startTime} – ${endTime}`;
        
        const volunteers = [];
        shift.champions.forEach(c => volunteers.push({ name: c.name, role: 'Event Champion', color: '#14b8a6' }));
        shift.gamesChampions.forEach(c => volunteers.push({ name: c.name, role: 'Games', color: '#8b5cf6' }));
        shift.talentExchangeChampions.forEach(c => volunteers.push({ name: c.name, role: 'Talent Exchange', color: '#06b6d4' }));
        shift.producerChampions.forEach(c => volunteers.push({ name: c.name, role: 'Producer', color: '#f97316' }));
        shift.techChampions.forEach(c => volunteers.push({ name: c.name, role: 'Tech Support', color: '#f59e0b' }));

        const emptyChampion = EVENT_CONFIG.maxChampionsPerShift - shift.champions.length;
        const emptyGames = EVENT_CONFIG.maxGamesPerShift - shift.gamesChampions.length;
        const emptyTalent = EVENT_CONFIG.maxTalentExchangePerShift - shift.talentExchangeChampions.length;
        const emptyProducer = EVENT_CONFIG.maxProducerPerShift - shift.producerChampions.length;
        const emptyTech = EVENT_CONFIG.maxTechPerShift - shift.techChampions.length;
        for (let i = 0; i < emptyChampion; i++) volunteers.push({ name: '—', role: 'Event Champion', color: '#94a3b8', empty: true });
        for (let i = 0; i < emptyGames; i++) volunteers.push({ name: '—', role: 'Games', color: '#94a3b8', empty: true });
        for (let i = 0; i < emptyTalent; i++) volunteers.push({ name: '—', role: 'Talent Exchange', color: '#94a3b8', empty: true });
        for (let i = 0; i < emptyProducer; i++) volunteers.push({ name: '—', role: 'Producer', color: '#94a3b8', empty: true });
        for (let i = 0; i < emptyTech; i++) volunteers.push({ name: '—', role: 'Tech Support', color: '#94a3b8', empty: true });
        
        volunteers.forEach((vol, idx) => {
          const timeCell = idx === 0 
            ? `<td rowspan="${volunteers.length}" style="padding:8px 12px;border-bottom:1px solid #e2e8f0;vertical-align:top;font-weight:600;white-space:nowrap">${timeStr}</td>` 
            : '';
          const nameStyle = vol.empty ? 'color:#94a3b8;font-style:italic' : 'color:#1e293b';
          tableRows += `<tr>${timeCell}<td style="padding:4px 12px;border-bottom:${idx === volunteers.length - 1 ? '1px solid #e2e8f0' : 'none'};${nameStyle}">${vol.name}</td><td style="padding:4px 12px;border-bottom:${idx === volunteers.length - 1 ? '1px solid #e2e8f0' : 'none'}"><span style="padding:2px 8px;border-radius:12px;font-size:0.8rem;font-weight:600;background:${vol.color}20;color:${vol.color}">${vol.role}</span></td></tr>`;
        });
      });
    });
    
    const totalVolunteers = new Set();
    let filledSlots = 0;
    let totalSlots = shifts.length * (EVENT_CONFIG.maxChampionsPerShift + EVENT_CONFIG.maxTechPerShift + EVENT_CONFIG.maxGamesPerShift + EVENT_CONFIG.maxTalentExchangePerShift + EVENT_CONFIG.maxProducerPerShift);
    shifts.forEach(s => {
      s.champions.forEach(c => totalVolunteers.add(c.email.toLowerCase()));
      s.techChampions.forEach(c => totalVolunteers.add(c.email.toLowerCase()));
      s.gamesChampions.forEach(c => totalVolunteers.add(c.email.toLowerCase()));
      s.talentExchangeChampions.forEach(c => totalVolunteers.add(c.email.toLowerCase()));
      s.producerChampions.forEach(c => totalVolunteers.add(c.email.toLowerCase()));
      filledSlots += s.champions.length + s.techChampions.length + s.gamesChampions.length + s.talentExchangeChampions.length + s.producerChampions.length;
    });
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>GamiCon48V Full Schedule</title></head>
        <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:800px;margin:2rem auto;color:#1e293b;padding:0 1rem">
          <h1 style="font-size:1.5rem;margin-bottom:0.25rem">GamiCon48V 2026 — Full Schedule</h1>
          <p style="color:#64748b;margin-bottom:0.5rem">All times shown in ${tzLabel}</p>
          <p style="color:#64748b;margin-bottom:1.5rem;font-size:0.9rem">${totalVolunteers.size} volunteers · ${filledSlots}/${totalSlots} slots filled</p>
          <table style="width:100%;border-collapse:collapse">
            <thead><tr style="background:#f8fafc">
              <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #cbd5e1">Time</th>
              <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #cbd5e1">Volunteer</th>
              <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #cbd5e1">Role</th>
            </tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          <p style="color:#94a3b8;font-size:0.8rem;margin-top:2rem;text-align:center">Printed ${new Date().toLocaleString()}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  const lookupMyShifts = () => {
    if (!myShiftsEmail.trim()) {
      setMyShiftsError(t.emailRequired);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(myShiftsEmail)) {
      setMyShiftsError(t.emailInvalid);
      return;
    }
    setMyShiftsLoading(true);
    setMyShiftsError('');
    const email = myShiftsEmail.trim().toLowerCase();
    const found = [];
    let role = 'champion';
    shifts.forEach(shift => {
      const inChampions = shift.champions.some(c => c.email.toLowerCase() === email);
      const inTech = shift.techChampions.some(c => c.email.toLowerCase() === email);
      const inGames = shift.gamesChampions.some(c => c.email.toLowerCase() === email);
      const inTalent = shift.talentExchangeChampions.some(c => c.email.toLowerCase() === email);
      const inProducer = shift.producerChampions.some(c => c.email.toLowerCase() === email);
      if (inChampions) found.push({ ...shift, myRole: 'champion' });
      if (inTech) { found.push({ ...shift, myRole: 'tech' }); role = 'tech'; }
      if (inGames) found.push({ ...shift, myRole: 'games' });
      if (inTalent) found.push({ ...shift, myRole: 'talentExchange' });
      if (inProducer) found.push({ ...shift, myRole: 'producer' });
    });
    setMyShiftsList(found);
    setMyShiftsRole(role);
    setLastSignedUpRole(role);
    setMyShiftsLoading(false);
  };

  // Delete a single shift for the current user
  const handleDeleteMyShift = async (shift) => {
    const timeStr = shift.start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
    const dateStr = shift.start.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    if (!window.confirm(`Remove your shift on ${dateStr} at ${timeStr}? This cannot be undone.`)) return;

    const email = myShiftsEmail.trim().toLowerCase();

    const newShifts = shifts.map(s => {
      if (s.id !== shift.id) return s;
      return {
        ...s,
        champions: s.champions.filter(c => c.email.toLowerCase() !== email),
        techChampions: s.techChampions.filter(c => c.email.toLowerCase() !== email),
        gamesChampions: s.gamesChampions.filter(c => c.email.toLowerCase() !== email),
        talentExchangeChampions: s.talentExchangeChampions.filter(c => c.email.toLowerCase() !== email),
        producerChampions: s.producerChampions.filter(c => c.email.toLowerCase() !== email),
      };
    });

    setShifts(newShifts);
    await saveShifts(newShifts);

    // Update the displayed list
    setMyShiftsList(prev => prev.filter(ms => ms.id !== shift.id));
    setSuccessMessage('Shift removed successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Add to Calendar handler
  const handleAddToCalendar = (calendarType) => {
    setShowCalendarDropdown(false);
    const roleLabel = myShiftsRole === 'tech' ? t.techSupport : t.eventChampion;

    if (calendarType === 'google') {
      // Open one tab per shift with a small delay to avoid popup blockers
      myShiftsList.forEach((shift, i) => {
        setTimeout(() => {
          window.open(getGoogleCalendarURL(shift, roleLabel), '_blank');
        }, i * 400);
      });
    } else {
      // Apple or Outlook — single ICS file with all shifts
      const ics = generateICS(myShiftsList, myShiftsRole, roleLabel);
      downloadICS(ics, 'gamicon48v-shifts.ics');
    }
  };

  const printMyShifts = () => {
    const shiftRows = myShiftsList.map(shift => {
      const dayName = shift.start.toLocaleDateString(undefined, { weekday: 'long' });
      const dateStr = shift.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const startTime = shift.start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
      const endTime = shift.end.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
      const role = shift.myRole === 'tech' ? t.techSupport : t.eventChampion;
      return `<tr><td style="padding:8px 12px;border-bottom:1px solid #ddd">${dayName}, ${dateStr}</td><td style="padding:8px 12px;border-bottom:1px solid #ddd">${startTime} – ${endTime}</td><td style="padding:8px 12px;border-bottom:1px solid #ddd">${role}</td></tr>`;
    }).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>My GamiCon48V Shifts</title></head>
        <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:2rem auto;color:#1e293b">
          <h1 style="font-size:1.5rem;margin-bottom:0.25rem">My GamiCon48V Shifts</h1>
          <p style="color:#64748b;margin-bottom:1.5rem">${myShiftsList.length} shift${myShiftsList.length !== 1 ? 's' : ''} scheduled</p>
          <table style="width:100%;border-collapse:collapse">
            <thead><tr style="background:#f1f5f9">
              <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #cbd5e1">Day</th>
              <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #cbd5e1">Time</th>
              <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #cbd5e1">Role</th>
            </tr></thead>
            <tbody>${shiftRows}</tbody>
          </table>
          <p style="color:#94a3b8;font-size:0.85rem;margin-top:2rem">Questions? Contact Carriann Lane through the Event Champions WhatsApp group.</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  
  const getChampionStatus = (shift) => {
    if (shift.champions.length >= EVENT_CONFIG.maxChampionsPerShift) return 'full';
    if (shift.champions.length >= 1) return 'partial';
    return 'available';
  };
  
  const getTechStatus = (shift) => {
    if (shift.techChampions.length >= EVENT_CONFIG.maxTechPerShift) return 'full';
    return 'available';
  };

  const getGamesStatus = (shift) => {
    if (shift.gamesChampions.length >= EVENT_CONFIG.maxGamesPerShift) return 'full';
    if (shift.gamesChampions.length >= 1) return 'partial';
    return 'available';
  };

  const getTalentStatus = (shift) => {
    if (shift.talentExchangeChampions.length >= EVENT_CONFIG.maxTalentExchangePerShift) return 'full';
    if (shift.talentExchangeChampions.length >= 1) return 'partial';
    return 'available';
  };
  
  const countAvailableInBlock = (block) => {
    let count = 0;
    block.shifts.forEach(shift => {
      if (shift.champions.length < EVENT_CONFIG.maxChampionsPerShift) count++;
      if (shift.gamesChampions.length < EVENT_CONFIG.maxGamesPerShift) count++;
      if (shift.talentExchangeChampions.length < EVENT_CONFIG.maxTalentExchangePerShift) count++;
      if (shift.techChampions.length < EVENT_CONFIG.maxTechPerShift) count++;
      if (shift.producerChampions.length < EVENT_CONFIG.maxProducerPerShift) count++;
    });
    return count;
  };
  
  const openInlineSignUp = (shiftId, role) => {
    setInlineSignUp({ shiftId, role });
    if (savedUserInfo) {
      setInlineName(savedUserInfo.name);
      setInlineEmail(savedUserInfo.email);
    } else {
      setInlineName('');
      setInlineEmail('');
    }
    setInlineErrors({});
  };
  
  const closeInlineSignUp = () => {
    setInlineSignUp(null);
    setInlineErrors({});
  };
  
  const validateInlineForm = () => {
    const errors = {};
    if (!inlineName.trim()) errors.name = t.nameRequired;
    if (!inlineEmail.trim()) errors.email = t.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inlineEmail)) errors.email = t.emailInvalid;
    setInlineErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleInlineSubmit = async () => {
    if (!validateInlineForm() || isInlineSubmitting || !inlineSignUp) return;
    
    const { shiftId, role } = inlineSignUp;
    
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
            return { ...s, techChampions: [...s.techChampions, { name: inlineName.trim(), email: inlineEmail.trim() }] };
          } else if (role === 'games') {
            return { ...s, gamesChampions: [...s.gamesChampions, { name: inlineName.trim(), email: inlineEmail.trim() }] };
          } else if (role === 'talentExchange') {
            return { ...s, talentExchangeChampions: [...s.talentExchangeChampions, { name: inlineName.trim(), email: inlineEmail.trim() }] };
          } else if (role === 'producer') {
            return { ...s, producerChampions: [...s.producerChampions, { name: inlineName.trim(), email: inlineEmail.trim() }] };
          } else {
            return { ...s, champions: [...s.champions, { name: inlineName.trim(), email: inlineEmail.trim() }] };
          }
        }
        return s;
      });
      
      setShifts(newShifts);
      await saveShifts(newShifts);
      
      const userInfo = { name: inlineName.trim(), email: inlineEmail.trim() };
      localStorage.setItem('gamicon48v-user', JSON.stringify(userInfo));
      setSavedUserInfo(userInfo);
      
      setLastSignedUpShifts([shift]);
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
      <a 
        href="#main-schedule" 
        style={styles.skipLink}
        onFocus={(e) => e.target.style.top = '0'}
        onBlur={(e) => e.target.style.top = '-100px'}
      >
        Skip to schedule
      </a>
      
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        style={styles.srOnly}
        id="sr-announcements"
      >
        {successMessage}
      </div>
      
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleGroup}>
            <h1 style={styles.title}>{t.title}</h1>
            <p style={styles.subtitle}>{t.subtitle}</p>
          </div>
          
          <div style={{
            ...styles.controls,
            ...(isMobile ? { gap: '0.5rem' } : {})
          }}>
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
            
            {!isMobile && (
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
            )}
            
            <div style={styles.controlGroup}>
              {!isMobile && (
                <label htmlFor="theme-toggle" style={styles.controlLabel}>
                  {t.theme}
                </label>
              )}
              <button
                id="theme-toggle"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{
                  ...styles.toggleButton,
                  ...(isMobile ? { padding: '0.75rem', minWidth: '44px' } : {})
                }}
                aria-pressed={theme === 'dark'}
                aria-label={theme === 'dark' ? t.lightMode : t.darkMode}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
                {!isMobile && (' ' + (theme === 'dark' ? t.lightMode : t.darkMode))}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div style={styles.timezoneNote}>
        📍 {t.timezoneNote}
      </div>
      
      {successMessage && (
        <div style={styles.successBanner} role="status" aria-live="polite">
          ✓ {successMessage}
        </div>
      )}
      
      {isAdmin && (
        <div style={styles.actionBar}>
          <div style={styles.actionGroup}>
            <button onClick={printFullSchedule} style={styles.secondaryButton}>
              🖨️ {t.printSchedule || 'Print Schedule'}
            </button>
            <button onClick={exportSchedule} style={styles.secondaryButton}>
              {t.export}
            </button>
            <button onClick={handleClearAll} style={styles.dangerButton}>
              {t.clearAll}
            </button>
            <button onClick={() => setIsAdmin(false)} style={styles.secondaryButton}>
              {t.exitAdmin}
            </button>
          </div>
        </div>
      )}
      
      <details style={styles.rulesPanel}>
        <summary style={styles.rulesSummary}>{t.rules}</summary>
        <div style={styles.rulesDialogue} dangerouslySetInnerHTML={{ __html: t.rulesDialogue.replace(/\n\n/g, '<br/><br/>') }} />
      </details>
      
      <div style={styles.myShiftsBar}>
        <button
          onClick={() => {
            if (savedUserInfo) setMyShiftsEmail(savedUserInfo.email);
            setShowMyShifts(true);
          }}
          style={styles.myShiftsButton}
        >
          📋 {t.seeMyShifts}
        </button>
      </div>
      
      <main id="main-schedule" style={styles.scheduleContainer} role="main" aria-label="Shift schedule">
        {shiftBlocks.map((block, blockIndex) => {
          const isExpanded = expandedBlocks[block.key];
          const availableCount = countAvailableInBlock(block);
          
          return (
            <section key={block.key} style={styles.blockSection}>
              <button
                onClick={() => toggleBlock(block.key)}
                style={{
                  ...styles.blockHeader,
                  ...(isExpanded ? styles.blockHeaderExpanded : {})
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
              
              {isExpanded && (
                <div id={`block-${block.key}`} style={styles.blockContent}>
                  {block.shifts.map((shift) => {
                    const champStatus = getChampionStatus(shift);
                    const techStatus = getTechStatus(shift);
                    
                    return (
                      <div
                        key={shift.id}
                        style={
                          isMobile ? styles.shiftRowMobile :
                          isTablet ? styles.shiftRowTablet :
                          styles.shiftRow
                        }
                      >
                        <div style={isMobile ? styles.shiftTimeColMobile : styles.shiftTimeCol}>
                          <div style={styles.shiftTime}>
                            {formatTime(shift.start, timezone)}
                          </div>
                          <div style={styles.shiftTimeTo}>{isMobile ? '–' : 'to'}</div>
                          <div style={styles.shiftTime}>
                            {formatTime(shift.end, timezone)}
                          </div>
                        </div>
                        
                        {/* Champions column */}
                        <div style={styles.roleColumn}>
                          <div style={styles.roleHeader}>
                            <span style={{ ...styles.roleLabel, color: colors.accent }}>{t.champions}</span>
                            <span style={{ ...styles.statusDot, backgroundColor: champStatus === 'full' ? colors.full : champStatus === 'partial' ? colors.partial : colors.available }} />
                          </div>
                          <div style={styles.championsList}>
                            {shift.champions.map((champ, idx) => (
                              <div key={idx} style={styles.championChip}>
                                <span>{champ.name}</span>
                                {isAdmin && <button onClick={() => handleAdminRemove(shift.id, idx, false)} style={styles.removeChip} aria-label={`${t.remove} ${champ.name}`}>✕</button>}
                              </div>
                            ))}
                            {shift.champions.length < EVENT_CONFIG.maxChampionsPerShift && (
                              <button onClick={() => openInlineSignUp(shift.id, 'champion')} style={styles.openSlotButton} aria-label={`${t.signUpFor} ${formatTime(shift.start, timezone)}`}>
                                <span style={styles.openSlotPlus}>+</span>
                                <span>{EVENT_CONFIG.maxChampionsPerShift - shift.champions.length} {t.open}</span>
                              </button>
                            )}
                            {isAdmin && shift.champions.length < EVENT_CONFIG.maxChampionsPerShift && !inlineSignUp && (
                              <AdminAddForm shiftId={shift.id} onAdd={(id, name, email) => handleAdminAdd(id, name, email, false)} t={t} styles={styles} colors={colors} />
                            )}
                          </div>
                        </div>

                        {/* Specialty Roles panel — 2×2 grid: Tech, Games, Talent Exchange, Producer */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          backgroundColor: colors.expandBg,
                          borderRadius: '8px',
                          border: `1px solid ${colors.border}`,
                        }}>
                          {[
                            { key: 'tech',          label: t.tech,          color: colors.techAccent,     list: shift.techChampions,            max: EVENT_CONFIG.maxTechPerShift,          roleType: 'tech',          ariaLabel: t.techSupport },
                            { key: 'producer',      label: t.producer,      color: colors.producerAccent, list: shift.producerChampions,        max: EVENT_CONFIG.maxProducerPerShift,      roleType: 'producer',      ariaLabel: t.producerFull },
                            { key: 'games',         label: t.games,         color: colors.gamesAccent,    list: shift.gamesChampions,           max: EVENT_CONFIG.maxGamesPerShift,         roleType: 'games',         ariaLabel: t.gamesFull },
                            { key: 'talentExchange',label: t.talentExchange, color: colors.talentAccent,  list: shift.talentExchangeChampions,  max: EVENT_CONFIG.maxTalentExchangePerShift, roleType: 'talentExchange', ariaLabel: t.talentExchangeFull },
                          ].map(({ key, label, color, list, max, roleType, ariaLabel }) => (
                            <div key={key} style={styles.roleColumn}>
                              <div style={styles.roleHeader}>
                                <span style={{ ...styles.roleLabel, color, fontSize: '0.78rem' }}>{label}</span>
                                <span style={{ ...styles.statusDot, backgroundColor: list.length >= max ? colors.full : color }} />
                              </div>
                              <div style={styles.championsList}>
                                {list.map((person, idx) => (
                                  <div key={idx} style={{ ...styles.championChip, borderColor: color }}>
                                    <span style={{ fontSize: isMobile ? '0.75rem' : '0.85rem' }}>{person.name}</span>
                                    {isAdmin && <button onClick={() => handleAdminRemove(shift.id, idx, roleType)} style={styles.removeChip} aria-label={`${t.remove} ${person.name}`}>✕</button>}
                                  </div>
                                ))}
                                {list.length < max && (
                                  <button
                                    onClick={() => openInlineSignUp(shift.id, roleType)}
                                    style={{ ...styles.openSlotButton, borderColor: color, color, fontSize: '0.78rem', padding: '0.35rem 0.5rem' }}
                                    aria-label={`${t.signUpFor} ${ariaLabel} ${formatTime(shift.start, timezone)}`}
                                  >
                                    <span style={styles.openSlotPlus}>+</span>
                                    <span>{max - list.length} {t.open}</span>
                                  </button>
                                )}
                                {isAdmin && list.length < max && !inlineSignUp && (
                                  <AdminAddForm shiftId={shift.id} onAdd={(id, name, email) => handleAdminAdd(id, name, email, roleType)} t={t} styles={styles} colors={colors} roleType={roleType} />
                                )}
                              </div>
                            </div>
                          ))}
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

      {!isAdmin && (
        <footer style={styles.footer}>
          <button 
            ref={adminButtonRef}
            onClick={() => setShowAdminLogin(true)} 
            style={styles.footerAdminButton}
          >
            {t.adminMode}
          </button>
        </footer>
      )}
      
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
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div
          style={styles.modalOverlay}
          onClick={(e) => e.target === e.currentTarget && handleSuccessClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          <div style={{ ...styles.modal, maxWidth: '450px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h2 id="success-title" style={{
              ...styles.modalTitle,
              color: lastSignedUpRole === 'tech' ? colors.techAccent :
                     lastSignedUpRole === 'games' ? colors.gamesAccent :
                     lastSignedUpRole === 'talentExchange' ? colors.talentAccent :
                     lastSignedUpRole === 'producer' ? colors.producerAccent :
                     colors.accent
            }}>
              {t.signUpSuccess}
            </h2>
            
            <p style={{ color: colors.textMuted, marginBottom: '1.5rem' }}>
              {lastSignedUpShifts.length} {lastSignedUpShifts.length === 1 ? t.shift : 'shifts'} 
              {' • '}
              {lastSignedUpRole === 'tech' ? t.techSupport :
               lastSignedUpRole === 'games' ? t.gamesFull :
               lastSignedUpRole === 'talentExchange' ? t.talentExchangeFull :
               lastSignedUpRole === 'producer' ? t.producerFull :
               t.eventChampion}
            </p>
            
            <p style={{ color: colors.textMuted, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {t.seeMyShiftsHint || 'Use "See My Shifts" anytime to view or print your schedule.'}
            </p>
            
            <button 
              onClick={handleSuccessClose}
              style={{
                ...styles.primaryButton,
                ...(lastSignedUpRole === 'tech' ? { backgroundColor: colors.techAccent, color: colors.onTechAccent } :
                    lastSignedUpRole === 'games' ? { backgroundColor: colors.gamesAccent, color: colors.onGamesAccent } :
                    lastSignedUpRole === 'talentExchange' ? { backgroundColor: colors.talentAccent, color: colors.onTalentAccent } :
                    lastSignedUpRole === 'producer' ? { backgroundColor: colors.producerAccent, color: colors.onProducerAccent } : {})
              }}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
      
      {/* Sign-Up Bottom Sheet */}
      {inlineSignUp && (
        <>
          <div style={styles.modalOverlay} onClick={closeInlineSignUp} />
          <div style={styles.bottomSheet}>
            <div style={styles.bottomSheetHandle} />
            
            <div style={styles.bottomSheetHeader}>
              <div style={styles.bottomSheetTitle}>{t.signUp}</div>
              <div style={styles.bottomSheetSubtitle}>
                {(() => {
                  const shift = shifts.find(s => s.id === inlineSignUp.shiftId);
                  if (!shift) return '';
                  return `${formatTime(shift.start, timezone)} - ${formatTime(shift.end, timezone)}`;
                })()}
              </div>
              <div style={{
                ...styles.bottomSheetRole,
                backgroundColor: inlineSignUp.role === 'tech' ? `${colors.techAccent}20` :
                                 inlineSignUp.role === 'games' ? `${colors.gamesAccent}20` :
                                 inlineSignUp.role === 'talentExchange' ? `${colors.talentAccent}20` :
                                 inlineSignUp.role === 'producer' ? `${colors.producerAccent}20` :
                                 `${colors.accent}20`,
                color: inlineSignUp.role === 'tech' ? colors.techAccent :
                       inlineSignUp.role === 'games' ? colors.gamesAccent :
                       inlineSignUp.role === 'talentExchange' ? colors.talentAccent :
                       inlineSignUp.role === 'producer' ? colors.producerAccent :
                       colors.accent,
              }}>
                {inlineSignUp.role === 'tech' ? `🔧 ${t.techSupport}` :
                 inlineSignUp.role === 'games' ? `🎮 ${t.gamesFull}` :
                 inlineSignUp.role === 'talentExchange' ? `🌟 ${t.talentExchangeFull}` :
                 inlineSignUp.role === 'producer' ? `🎬 ${t.producerFull}` :
                 `🏆 ${t.eventChampion}`}
              </div>
            </div>
            
            {inlineSignUp.role === 'tech' && (
              <div style={styles.techWarning} role="note">{t.techDescription}</div>
            )}
            {inlineSignUp.role === 'games' && (
              <div style={{ ...styles.techWarning, color: colors.gamesAccent, backgroundColor: `${colors.gamesAccent}15` }} role="note">{t.gamesDescription}</div>
            )}
            {inlineSignUp.role === 'talentExchange' && (
              <div style={{ ...styles.techWarning, color: colors.talentAccent, backgroundColor: `${colors.talentAccent}15` }} role="note">{t.talentExchangeDescription}</div>
            )}
            {inlineSignUp.role === 'producer' && (
              <div style={{ ...styles.techWarning, color: colors.producerAccent, backgroundColor: `${colors.producerAccent}15` }} role="note">{t.producerDescription}</div>
            )}
            
            {inlineErrors.rules && (
              <div style={styles.bottomSheetRulesError} role="alert">
                ⚠️ {inlineErrors.rules}
              </div>
            )}
            
            <div style={styles.bottomSheetForm}>
              <div>
                <label htmlFor="bottom-sheet-name" style={styles.srOnly}>{t.name}</label>
                <input
                  id="bottom-sheet-name"
                  type="text"
                  placeholder={t.name}
                  value={inlineName}
                  onChange={(e) => setInlineName(e.target.value)}
                  style={{
                    ...styles.bottomSheetInput,
                    borderColor: inlineSignUp.role === 'tech' ? colors.techAccent :
                                 inlineSignUp.role === 'games' ? colors.gamesAccent :
                                 inlineSignUp.role === 'talentExchange' ? colors.talentAccent :
                                 inlineSignUp.role === 'producer' ? colors.producerAccent :
                                 colors.accent,
                  }}
                  autoFocus
                  aria-invalid={!!inlineErrors.name}
                />
                {inlineErrors.name && <div style={styles.bottomSheetError} role="alert">{inlineErrors.name}</div>}
              </div>
              
              <div>
                <label htmlFor="bottom-sheet-email" style={styles.srOnly}>{t.email}</label>
                <input
                  id="bottom-sheet-email"
                  type="email"
                  placeholder={t.email}
                  value={inlineEmail}
                  onChange={(e) => setInlineEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInlineSubmit()}
                  style={{
                    ...styles.bottomSheetInput,
                    borderColor: inlineSignUp.role === 'tech' ? colors.techAccent :
                                 inlineSignUp.role === 'games' ? colors.gamesAccent :
                                 inlineSignUp.role === 'talentExchange' ? colors.talentAccent :
                                 inlineSignUp.role === 'producer' ? colors.producerAccent :
                                 colors.accent,
                  }}
                  aria-invalid={!!inlineErrors.email}
                />
                {inlineErrors.email && <div style={styles.bottomSheetError} role="alert">{inlineErrors.email}</div>}
              </div>
              
              <div style={styles.bottomSheetActions}>
                <button 
                  onClick={closeInlineSignUp} 
                  style={{
                    ...styles.bottomSheetCancel,
                    ...(isInlineSubmitting ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                  }}
                  disabled={isInlineSubmitting}
                  type="button"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={handleInlineSubmit} 
                  style={{
                    ...styles.bottomSheetSubmit,
                    backgroundColor: inlineSignUp.role === 'tech' ? colors.techAccent :
                                     inlineSignUp.role === 'games' ? colors.gamesAccent :
                                     inlineSignUp.role === 'talentExchange' ? colors.talentAccent :
                                     inlineSignUp.role === 'producer' ? colors.producerAccent :
                                     colors.accent,
                    ...(isInlineSubmitting ? { opacity: 0.7, cursor: 'wait' } : {}),
                  }}
                  disabled={isInlineSubmitting}
                  aria-busy={isInlineSubmitting}
                  type="submit"
                >
                  {isInlineSubmitting ? t.submitting : t.signUp}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* My Shifts Modal */}
      {showMyShifts && (
        <div
          style={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowMyShifts(false);
              setShowCalendarDropdown(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="my-shifts-title"
        >
          <div style={{ ...styles.modal, maxWidth: '550px' }}>
            <h2 id="my-shifts-title" style={styles.modalTitle}>
              📋 {t.myShiftsTitle}
            </h2>

            {myShiftsList.length === 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: colors.textMuted, marginBottom: '1rem', textAlign: 'center' }}>
                  {t.enterYourEmail}
                </p>
                <input
                  type="email"
                  placeholder={t.email}
                  value={myShiftsEmail}
                  onChange={(e) => { setMyShiftsEmail(e.target.value); setMyShiftsError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && lookupMyShifts()}
                  style={styles.input}
                  autoFocus
                />
                {myShiftsError && (
                  <div style={{ color: colors.error, fontSize: '0.9rem', marginTop: '0.5rem' }} role="alert">
                    {myShiftsError}
                  </div>
                )}
                <div style={{ ...styles.modalActions, marginTop: '1rem' }}>
                  <button onClick={() => setShowMyShifts(false)} style={styles.secondaryButton}>
                    {t.close}
                  </button>
                  <button onClick={lookupMyShifts} style={styles.primaryButton}>
                    {t.lookupShifts}
                  </button>
                </div>
              </div>
            )}

            {myShiftsList.length > 0 && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {myShiftsList.map((shift, i) => {
                    const dayName = shift.start.toLocaleDateString(undefined, { weekday: 'long' });
                    const dateStr = shift.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    const startTime = shift.start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
                    const endTime = shift.end.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
                    const roleColor = shift.myRole === 'tech' ? colors.techAccent :
                                      shift.myRole === 'games' ? colors.gamesAccent :
                                      shift.myRole === 'talentExchange' ? colors.talentAccent :
                                      shift.myRole === 'producer' ? colors.producerAccent :
                                      colors.accent;
                    return (
                      <div key={shift.id} style={{
                        padding: '1rem', backgroundColor: colors.bg, borderRadius: '10px',
                        borderLeft: `4px solid ${roleColor}`, display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '700', fontSize: '1rem', color: colors.text }}>
                            {dayName}, {dateStr}
                          </div>
                          <div style={{ color: colors.textMuted, fontSize: '0.95rem', marginTop: '0.25rem' }}>
                            {startTime} – {endTime}
                          </div>
                        </div>
                        <div style={{
                          padding: '0.25rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem',
                          fontWeight: '600', backgroundColor: `${roleColor}20`, color: roleColor,
                          whiteSpace: 'nowrap',
                        }}>
                          {shift.myRole === 'tech' ? t.techSupport :
                           shift.myRole === 'games' ? t.gamesFull :
                           shift.myRole === 'talentExchange' ? t.talentExchangeFull :
                           shift.myRole === 'producer' ? t.producerFull :
                           t.eventChampion}
                        </div>
                        <button
                          onClick={() => handleDeleteMyShift(shift)}
                          style={{
                            background: 'none',
                            border: `1px solid ${colors.error}`,
                            borderRadius: '6px',
                            color: colors.error,
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            padding: '0.3rem 0.6rem',
                            minHeight: '32px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                          aria-label={`Remove shift on ${dateStr} at ${startTime}`}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    );
                  })}
                </div>

                <p style={{ color: colors.textMuted, fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' }}>
                  {myShiftsList.length} {myShiftsList.length === 1 ? t.shift : 'shifts'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    flexDirection: isMobile ? 'column' : 'row',
                    width: isMobile ? '100%' : 'auto',
                  }}>
                    <button
                      onClick={printMyShifts}
                      style={{
                        ...styles.secondaryButton,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        ...(isMobile ? { width: '100%' } : {})
                      }}
                    >
                      🖨️ {t.print || 'Print'}
                    </button>

                    <div style={{ position: 'relative', ...(isMobile ? { width: '100%' } : {}) }}>
                      <button
                        onClick={() => setShowCalendarDropdown(prev => !prev)}
                        style={{
                          ...styles.secondaryButton,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          ...(isMobile ? { width: '100%' } : {})
                        }}
                        aria-haspopup="true"
                        aria-expanded={showCalendarDropdown}
                      >
                        📅 Add to Calendar
                      </button>

                      {showCalendarDropdown && (
                        <div style={{
                          position: 'fixed',
                          bottom: '6rem',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: colors.bgSecondary,
                          border: `2px solid ${colors.accent}`,
                          borderRadius: '10px',
                          overflow: 'hidden',
                          zIndex: 1010,
                          minWidth: '220px',
                          maxWidth: 'calc(100vw - 2rem)',
                          boxShadow: '0 -4px 16px rgba(0,0,0,0.3)',
                        }}>
                          {[
                            { label: '🍎 Apple Calendar', type: 'apple' },
                            { label: '📅 Google Calendar', type: 'google' },
                            { label: '📧 Outlook', type: 'outlook' },
                          ].map(({ label, type }) => (
                            <button
                              key={type}
                              onClick={() => handleAddToCalendar(type)}
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '0.875rem 1.25rem',
                                backgroundColor: 'transparent',
                                color: colors.text,
                                border: 'none',
                                borderBottom: type !== 'outlook' ? `1px solid ${colors.border}` : 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                              }}
                            >
                              {label}
                            </button>
                          ))}
                          {myShiftsList.length > 1 && (
                            <p style={{
                              fontSize: '0.75rem',
                              color: colors.textMuted,
                              padding: '0.5rem 1rem',
                              margin: 0,
                              borderTop: `1px solid ${colors.border}`,
                              fontStyle: 'italic',
                            }}>
                              Google opens {myShiftsList.length} tabs, one per shift.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => { setShowMyShifts(false); setShowCalendarDropdown(false); }}
                      style={{
                        ...styles.primaryButton,
                        ...(isMobile ? { width: '100%' } : {})
                      }}
                    >
                      {t.close}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Add Form Component
function AdminAddForm({ shiftId, onAdd, t, styles, colors, roleType = 'champion' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = () => {
    onAdd(shiftId, name, email);
    setName('');
    setEmail('');
    setIsOpen(false);
  };

  const accentColor = roleType === 'tech' ? colors.techAccent :
                      roleType === 'games' ? colors.gamesAccent : colors.accent;
  const buttonLabel = roleType === 'tech' ? t.addTech :
                      roleType === 'games' ? t.addGames :
                      roleType === 'talentExchange' ? t.addTalentExchange :
                      roleType === 'producer' ? t.addProducer : t.add;
  
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        style={{
          ...styles.addButton,
          borderColor: accentColor,
          color: accentColor,
        }}
      >
        + {buttonLabel}
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
            backgroundColor: accentColor,
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
    fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
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
  timezoneNote: {
    backgroundColor: colors.bgSecondary,
    color: colors.textMuted,
    padding: '0.75rem 1rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    borderBottom: `1px solid ${colors.border}`,
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
    margin: '1.5rem auto 1rem auto',
    padding: '0 max(2rem, env(safe-area-inset-right)) 0 max(2rem, env(safe-area-inset-left))',
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
  scheduleContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 max(1rem, env(safe-area-inset-left)) 3rem max(1rem, env(safe-area-inset-right))',
    paddingBottom: 'max(3rem, env(safe-area-inset-bottom))',
  },
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
  shiftRow: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr 1.2fr',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: colors.bgSecondary,
    borderRadius: '8px',
    marginBottom: '0.75rem',
    alignItems: 'start',
  },
  shiftRowTablet: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr 1.1fr',
    gap: '0.75rem',
    padding: '0.875rem',
    backgroundColor: colors.bgSecondary,
    borderRadius: '8px',
    marginBottom: '0.75rem',
    alignItems: 'start',
  },
  shiftRowMobile: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: colors.bgSecondary,
    borderRadius: '8px',
    marginBottom: '0.75rem',
    alignItems: 'start',
  },
  shiftTimeCol: {
    textAlign: 'center',
    paddingTop: '0.25rem',
  },
  shiftTimeColMobile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: `1px solid ${colors.border}`,
    marginBottom: '0.25rem',
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
  roleColumn: {
    minWidth: 0,
    overflow: 'hidden',
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
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
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
    minHeight: '44px',
  },
  openSlotPlus: {
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  bottomSheet: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    padding: '1.5rem',
    paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
    zIndex: 1001,
    maxHeight: '85vh',
    overflowY: 'auto',
  },
  bottomSheetHandle: {
    width: '40px',
    height: '4px',
    backgroundColor: colors.border,
    borderRadius: '2px',
    margin: '0 auto 1rem',
  },
  bottomSheetHeader: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  bottomSheetTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.text,
    marginBottom: '0.5rem',
  },
  bottomSheetSubtitle: {
    fontSize: '1rem',
    color: colors.textMuted,
  },
  bottomSheetRole: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
  bottomSheetForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  bottomSheetInput: {
    padding: '1rem',
    fontSize: '16px',
    backgroundColor: colors.bg,
    color: colors.text,
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    width: '100%',
    boxSizing: 'border-box',
  },
  bottomSheetError: {
    color: colors.error,
    fontSize: '0.85rem',
    marginTop: '0.5rem',
  },
  bottomSheetRulesError: {
    color: colors.error,
    fontSize: '0.9rem',
    padding: '0.75rem',
    backgroundColor: `${colors.error}15`,
    borderRadius: '8px',
    lineHeight: '1.4',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  bottomSheetActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  bottomSheetCancel: {
    flex: 1,
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: 'transparent',
    color: colors.textMuted,
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    cursor: 'pointer',
    minHeight: '52px',
  },
  bottomSheetSubmit: {
    flex: 2,
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: colors.accent,
    color: colors.onAccent,
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    minHeight: '52px',
  },
  techWarning: {
    fontSize: '0.85rem',
    color: colors.techAccent,
    padding: '0.75rem',
    backgroundColor: `${colors.techAccent}15`,
    borderRadius: '8px',
    lineHeight: '1.4',
    textAlign: 'center',
    marginBottom: '1rem',
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
  footer: {
    padding: '2rem 1rem',
    textAlign: 'center',
    borderTop: `1px solid ${colors.border}`,
    marginTop: '2rem',
  },
  footerAdminButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    backgroundColor: 'transparent',
    color: colors.textMuted,
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    opacity: 0.6,
    touchAction: 'manipulation',
  },
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
  myShiftsBar: {
    maxWidth: '1400px',
    margin: '0.75rem auto 1.5rem',
    padding: '0 max(2rem, env(safe-area-inset-right)) 0 max(2rem, env(safe-area-inset-left))',
    textAlign: 'left',
  },
  myShiftsButton: {
    padding: '0.6rem 1.5rem',
    borderRadius: '10px',
    border: `2px solid ${colors.accent}`,
    backgroundColor: `${colors.accent}10`,
    color: colors.accent,
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
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
  
  @media (hover: hover) and (pointer: fine) {
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
    }
  }
  
  button:active:not(:disabled) {
    transform: scale(0.98);
    opacity: 0.9;
  }
  
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
  
  *:focus-visible {
    z-index: 1;
  }
  
  details[open] summary {
    margin-bottom: 0.5rem;
  }
  
  * {
    -webkit-tap-highlight-color: transparent;
  }
  
  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  
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
`;
document.head.appendChild(styleSheet);
