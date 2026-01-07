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
  startTime: new Date('2026-03-21T19:00:00-05:00'), // 7 PM Central (CDT is UTC-5 in March)
  endTime: new Date('2026-03-23T07:00:00-05:00'),   // 7 AM Central
  shiftDurationHours: 2,
  maxChampionsPerShift: 2,
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
    text: '#e8e0d5',
    textMuted: '#a89984',
    title: '#e2e8f0',
    accent: '#14b8a6',
    border: '#4a4a6a',
    available: '#10b981',
    partial: '#0ea5e9',
    full: '#94a3b8',
    selectedBorder: '#2dd4bf',
    error: '#e57373',
    overlay: 'rgba(0,0,0,0.8)',
  },
  light: {
    bg: '#f8fafc',
    bgSecondary: '#ffffff',
    text: '#1e293b',
    textMuted: '#64748b',
    title: '#0f172a',
    accent: '#0d9488',
    border: '#cbd5e1',
    available: '#059669',
    partial: '#0284c7',
    full: '#64748b',
    selectedBorder: '#14b8a6',
    error: '#dc2626',
    overlay: 'rgba(0,0,0,0.5)',
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
    submit: "Submit Sign-Up",
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
    shift: "Shift",
    champions: "Champions",
    remove: "Remove",
    add: "Add Champion",
    save: "Save",
    noShifts: "No shifts selected",
    rules: "How Shifts Work",
    rule1: "Maximum 4 consecutive hours (2 shifts), then 2-hour break required",
    rule2: "Maximum 12 hours per day",
    rule3: "2 Champions per shift (ideal), 1 minimum",
    rulesDialogue: "Hey Champions! Shifts are 2 hours each. You can take up to 2 shifts back-to-back (4 hours max), then please rest for at least 2 hours. We would like you to take up to 12 hours total. We want you energized, not exhausted! If you have questions, contact Carriann Lane. She's happy to help.",
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
    addToCalendar: "Add to Calendar",
    googleCalendar: "Google Calendar",
    downloadIcs: "Download .ics",
    emailIcs: "Email to myself",
    calendarEventTitle: "GamiCon48V - Event Champion",
    icsEmailTip: "Tip: Open the email on your phone, tap the attachment, then tap Add to Calendar."
  },
  zh: {
    title: "活动冠军调度器",
    subtitle: "GamiCon48V 2026",
    signUp: "报名",
    name: "您的姓名",
    email: "您的邮箱",
    selectShifts: "选择您的班次",
    submit: "提交报名",
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
    shift: "班次",
    champions: "冠军",
    remove: "移除",
    add: "添加冠军",
    save: "保存",
    noShifts: "未选择班次",
    rules: "班次说明",
    rule1: "最多连续4小时（2个班次），之后需要2小时休息",
    rule2: "每天最多12小时",
    rule3: "每班次2名冠军（理想），最少1名",
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
    addToCalendar: "添加到日历",
    googleCalendar: "Google 日历",
    downloadIcs: "下载 .ics",
    emailIcs: "发送到我的邮箱",
    calendarEventTitle: "GamiCon48V - 活动冠军",
    icsEmailTip: "提示：在手机上打开邮件，点击附件，然后点击添加到日历。"
  },
  th: {
    title: "ตารางเวลาแชมเปี้ยนอีเวนต์",
    subtitle: "GamiCon48V 2026",
    signUp: "ลงทะเบียน",
    name: "ชื่อของคุณ",
    email: "อีเมลของคุณ",
    selectShifts: "เลือกกะของคุณ",
    submit: "ส่งการลงทะเบียน",
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
    shift: "กะ",
    champions: "แชมเปี้ยน",
    remove: "ลบ",
    add: "เพิ่มแชมเปี้ยน",
    save: "บันทึก",
    noShifts: "ไม่ได้เลือกกะ",
    rules: "วิธีการทำงานกะ",
    rule1: "สูงสุด 4 ชั่วโมงติดต่อกัน (2 กะ) จากนั้นต้องพัก 2 ชั่วโมง",
    rule2: "สูงสุด 12 ชั่วโมงต่อวัน",
    rule3: "2 แชมเปี้ยนต่อกะ (เหมาะสม) อย่างน้อย 1 คน",
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
    addToCalendar: "เพิ่มไปยังปฏิทิน",
    googleCalendar: "Google ปฏิทิน",
    downloadIcs: "ดาวน์โหลด .ics",
    emailIcs: "ส่งอีเมลถึงตัวเอง",
    calendarEventTitle: "GamiCon48V - แชมเปี้ยนอีเวนต์",
    icsEmailTip: "เคล็ดลับ: เปิดอีเมลบนโทรศัพท์ แตะไฟล์แนบ แล้วแตะเพิ่มไปยังปฏิทิน"
  },
  ar: {
    title: "جدول أبطال الحدث",
    subtitle: "GamiCon48V 2026",
    signUp: "التسجيل",
    name: "اسمك",
    email: "بريدك الإلكتروني",
    selectShifts: "اختر نوباتك",
    submit: "إرسال التسجيل",
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
    shift: "نوبة",
    champions: "الأبطال",
    remove: "إزالة",
    add: "إضافة بطل",
    save: "حفظ",
    noShifts: "لم يتم اختيار نوبات",
    rules: "كيف تعمل النوبات",
    rule1: "بحد أقصى 4 ساعات متتالية (نوبتان)، ثم استراحة إلزامية لمدة ساعتين",
    rule2: "بحد أقصى 12 ساعة في اليوم",
    rule3: "بطلان لكل نوبة (مثالي)، واحد كحد أدنى",
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
    addToCalendar: "إضافة إلى التقويم",
    googleCalendar: "تقويم Google",
    downloadIcs: "تحميل .ics",
    emailIcs: "إرسال إلى بريدي",
    calendarEventTitle: "GamiCon48V - بطل الحدث",
    icsEmailTip: "نصيحة: افتح البريد على هاتفك، اضغط على المرفق، ثم اضغط على إضافة إلى التقويم."
  },
  fr: {
    title: "Planificateur des Champions",
    subtitle: "GamiCon48V 2026",
    signUp: "S'inscrire",
    name: "Votre nom",
    email: "Votre e-mail",
    selectShifts: "Sélectionnez vos créneaux",
    submit: "Soumettre l'inscription",
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
    shift: "Créneau",
    champions: "Champions",
    remove: "Supprimer",
    add: "Ajouter un Champion",
    save: "Enregistrer",
    noShifts: "Aucun créneau sélectionné",
    rules: "Comment ça marche",
    rule1: "Maximum 4 heures consécutives (2 créneaux), puis pause de 2 heures requise",
    rule2: "Maximum 12 heures au total",
    rule3: "2 Champions par créneau (idéal), 1 minimum",
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
    addToCalendar: "Ajouter au calendrier",
    googleCalendar: "Google Agenda",
    downloadIcs: "Télécharger .ics",
    emailIcs: "M'envoyer par e-mail",
    calendarEventTitle: "GamiCon48V - Champion d'événement",
    icsEmailTip: "Astuce : Ouvrez l'e-mail sur votre téléphone, appuyez sur la pièce jointe, puis appuyez sur Ajouter au calendrier."
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
      champions: []
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

const getDay = (date, timezone = 'America/Chicago') => {
  return new Date(date.toLocaleString('en-US', { timeZone: timezone })).getDay();
};

const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
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

// ============================================
// MAIN COMPONENT
// ============================================
export default function App() {
  const [shifts, setShifts] = useState(generateShifts());
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [showSignUp, setShowSignUp] = useState(false);
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
  const [lastSignedUpEmail, setLastSignedUpEmail] = useState('');
  
  // Sign-up form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  
  // Refs for focus management
  const signUpButtonRef = React.useRef(null);
  const adminButtonRef = React.useRef(null);
  const signUpModalRef = React.useRef(null);
  const adminModalRef = React.useRef(null);
  const signUpFirstInputRef = React.useRef(null);
  const adminFirstInputRef = React.useRef(null);
  
  const t = translations[language];
  const isRTL = language === 'ar';
  const colors = themes[theme];
  
  // Generate theme-aware styles
  const styles = getStyles(colors);
  
  // Focus management for sign-up modal
  useEffect(() => {
    if (showSignUp && signUpFirstInputRef.current) {
      signUpFirstInputRef.current.focus();
    }
  }, [showSignUp]);
  
  // Focus management for admin modal
  useEffect(() => {
    if (showAdminLogin && adminFirstInputRef.current) {
      adminFirstInputRef.current.focus();
    }
  }, [showAdminLogin]);
  
  // Escape key handler and focus trap
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape to close modals
      if (e.key === 'Escape') {
        if (showSignUp) {
          setShowSignUp(false);
          signUpButtonRef.current?.focus();
        }
        if (showAdminLogin) {
          setShowAdminLogin(false);
          adminButtonRef.current?.focus();
        }
        if (showExport) {
          setShowExport(false);
        }
        if (showSuccessModal) {
          setShowSuccessModal(false);
        }
      }
      
      // Focus trap for modals
      if (e.key === 'Tab') {
        const activeModal = showSignUp ? signUpModalRef.current : showAdminLogin ? adminModalRef.current : null;
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
    
    if (showSignUp || showAdminLogin || showExport || showSuccessModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showSignUp, showAdminLogin, showExport, showSuccessModal]);
  
  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('shifts')
          .select('id, champions')
          .order('id');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Merge saved champions with generated shifts
          const baseShifts = generateShifts();
          const mergedShifts = baseShifts.map(shift => {
            const saved = data.find(s => s.id === shift.id);
            return saved ? { ...shift, champions: saved.champions || [] } : shift;
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
      // Update each shift that has champions
      for (const shift of newShifts) {
        const { error } = await supabase
          .from('shifts')
          .update({ champions: shift.champions })
          .eq('id', shift.id);
        
        if (error) throw error;
      }
    } catch (e) {
      console.error('Failed to save:', e);
    }
  }, []);
  
  // Close modal and return focus
  const closeSignUpModal = () => {
    setShowSignUp(false);
    setTimeout(() => signUpButtonRef.current?.focus(), 0);
  };
  
  const closeAdminModal = () => {
    setShowAdminLogin(false);
    setTimeout(() => adminButtonRef.current?.focus(), 0);
  };
  
  // Check if shift can be selected based on rules
  const canSelectShift = (shiftId, currentSelections, userEmail = null) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return { allowed: false, reason: 'invalid' };
    
    // Check if already full
    if (shift.champions.length >= EVENT_CONFIG.maxChampionsPerShift) {
      return { allowed: false, reason: 'full' };
    }
    
    // Check if user already signed up for this shift
    if (userEmail && shift.champions.some(c => c.email.toLowerCase() === userEmail.toLowerCase())) {
      return { allowed: false, reason: 'alreadySignedUp' };
    }
    
    // Get all shifts this user would have (current selections + already signed up)
    const allUserShiftIds = [...currentSelections];
    if (userEmail) {
      shifts.forEach(s => {
        if (s.champions.some(c => c.email.toLowerCase() === userEmail.toLowerCase())) {
          allUserShiftIds.push(s.id);
        }
      });
    }
    
    // Add the potential new shift
    const potentialShifts = [...new Set([...allUserShiftIds, shiftId])].sort((a, b) => a - b);
    
    // Check consecutive hours rule
    let consecutiveCount = 0;
    let maxConsecutive = 0;
    
    for (let i = 0; i < potentialShifts.length; i++) {
      if (i === 0 || potentialShifts[i] === potentialShifts[i - 1] + 1) {
        consecutiveCount++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
      } else {
        // Check if there's enough break
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
  
  const handleShiftToggle = (shiftId) => {
    if (selectedShifts.includes(shiftId)) {
      setSelectedShifts(selectedShifts.filter(id => id !== shiftId));
    } else {
      const check = canSelectShift(shiftId, selectedShifts, formEmail);
      if (check.allowed) {
        setSelectedShifts([...selectedShifts, shiftId]);
      }
    }
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formName.trim()) errors.name = t.nameRequired;
    if (!formEmail.trim()) errors.email = t.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) errors.email = t.emailInvalid;
    if (selectedShifts.length === 0) errors.shifts = t.noShiftsSelected;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    // Store the shifts being signed up for calendar export
    const signedUpShiftData = selectedShifts.map(id => shifts.find(s => s.id === id));
    
    const newShifts = shifts.map(shift => {
      if (selectedShifts.includes(shift.id)) {
        return {
          ...shift,
          champions: [...shift.champions, { name: formName.trim(), email: formEmail.trim() }]
        };
      }
      return shift;
    });
    
    setShifts(newShifts);
    await saveShifts(newShifts);
    
    // Store for calendar export before clearing
    setLastSignedUpShifts(signedUpShiftData);
    setLastSignedUpEmail(formEmail.trim());
    
    setFormName('');
    setFormEmail('');
    setSelectedShifts([]);
    closeSignUpModal();
    setShowSuccessModal(true);
  };
  
  const handleAdminRemove = async (shiftId, championIndex) => {
    if (!window.confirm(t.removeConfirm)) return;
    
    const newShifts = shifts.map(shift => {
      if (shift.id === shiftId) {
        const newChampions = [...shift.champions];
        newChampions.splice(championIndex, 1);
        return { ...shift, champions: newChampions };
      }
      return shift;
    });
    
    setShifts(newShifts);
    await saveShifts(newShifts);
  };
  
  const handleAdminAdd = async (shiftId, name, email) => {
    if (!name.trim() || !email.trim()) return;
    
    const newShifts = shifts.map(shift => {
      if (shift.id === shiftId) {
        return {
          ...shift,
          champions: [...shift.champions, { name: name.trim(), email: email.trim() }]
        };
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
      champions: []
    }));
    
    setShifts(clearedShifts);
    await saveShifts(clearedShifts);
    setSuccessMessage('All sign-ups cleared');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleAdminLogin = () => {
    if (adminPassword === EVENT_CONFIG.adminPassword) {
      setIsAdmin(true);
      setShowAdminLogin(false); // Don't use closeAdminModal - button won't exist
      setAdminPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };
  
  const exportSchedule = () => {
    const timezone = showLocalTime ? userTimezone : 'America/Chicago';
    let csv = 'Shift,Date,Start Time,End Time,Time Period,Champion 1,Email 1,Champion 2,Email 2\n';
    
    shifts.forEach((shift, index) => {
      const timePeriod = getTimePeriod(shift.start, timezone);
      const row = [
        index + 1,
        formatDate(shift.start, timezone),
        formatTime(shift.start, timezone),
        formatTime(shift.end, timezone),
        timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1),
        shift.champions[0]?.name || '',
        shift.champions[0]?.email || '',
        shift.champions[1]?.name || '',
        shift.champions[1]?.email || ''
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
      // Fallback for older browsers
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
  
  // Generate Google Calendar URL for shifts
  const generateGoogleCalendarUrl = (shiftsToAdd) => {
    // Google Calendar only supports adding one event at a time via URL
    // So we'll create a URL for the first shift and note about multiple events
    if (shiftsToAdd.length === 0) return null;
    
    const shift = shiftsToAdd[0];
    const title = encodeURIComponent(t.calendarEventTitle);
    const startStr = shift.start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const endStr = shift.end.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const details = encodeURIComponent(`Event Champion shift for GamiCon48V 2026`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}`;
  };
  
  // Generate .ics file content for all shifts with reminders
  const generateIcsContent = (shiftsToAdd) => {
    const formatIcsDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };
    
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
SUMMARY:${t.calendarEventTitle}
DESCRIPTION:Event Champion shift ${index + 1} for GamiCon48V 2026
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Your GamiCon48V Event Champion shift starts tomorrow!
END:VALARM
BEGIN:VALARM
TRIGGER:-PT2H
ACTION:DISPLAY
DESCRIPTION:Your GamiCon48V Event Champion shift starts in 2 hours!
END:VALARM
END:VEVENT
`;
    });
    
    icsContent += `END:VCALENDAR`;
    return icsContent;
  };
  
  const downloadIcsFile = () => {
    const icsContent = generateIcsContent(lastSignedUpShifts);
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
  
  const emailIcsFile = () => {
    // First download the file
    downloadIcsFile();
    
    // Then open mailto with instructions
    const subject = encodeURIComponent('My GamiCon48V Event Champion Shifts');
    const shiftList = lastSignedUpShifts.map((shift, i) => {
      const date = formatDate(shift.start, timezone);
      const start = formatTime(shift.start, timezone);
      const end = formatTime(shift.end, timezone);
      return `  Shift ${i + 1}: ${date} ${start} - ${end}`;
    }).join('\n');
    
    const body = encodeURIComponent(
`Here are my GamiCon48V Event Champion shifts:

${shiftList}

IMPORTANT: Attach the downloaded file "gamicon48v-shifts.ics" to this email before sending.

Then open this email on your phone and tap the attachment to add shifts to your calendar.`
    );
    
    window.location.href = `mailto:${lastSignedUpEmail}?subject=${subject}&body=${body}`;
  };
  
  const openGoogleCalendar = () => {
    // For multiple shifts, we'll open the first one and show instructions
    const url = generateGoogleCalendarUrl(lastSignedUpShifts);
    if (url) {
      window.open(url, '_blank');
    }
  };
  
  const getShiftStatus = (shift) => {
    if (shift.champions.length >= EVENT_CONFIG.maxChampionsPerShift) return 'full';
    if (shift.champions.length === 1) return 'partial';
    return 'available';
  };
  
  const timezone = showLocalTime ? userTimezone : 'America/Chicago';
  
  // Group shifts by day
  const shiftsByDay = shifts.reduce((acc, shift) => {
    const dayKey = formatDate(shift.start, timezone);
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(shift);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} aria-label="Loading">
          <div style={styles.spinnerGear}>⚙</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, direction: isRTL ? 'rtl' : 'ltr' }}>
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
                {t.yourTimezone}
              </label>
              <button
                id="timezone-toggle"
                onClick={() => setShowLocalTime(!showLocalTime)}
                style={styles.toggleButton}
                aria-pressed={showLocalTime}
              >
                {showLocalTime ? userTimezone.split('/').pop().replace('_', ' ') : t.centralTime}
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
        <button
          ref={signUpButtonRef}
          onClick={() => setShowSignUp(true)}
          style={styles.primaryButton}
          aria-label={t.signUp}
        >
          {t.signUp}
        </button>
        
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
      
      {/* Rules Panel */}
      {/* Rules - Friendly Dialogue */}
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
      </div>
      
      {/* Schedule Grid */}
      <main style={styles.scheduleContainer}>
        {Object.entries(shiftsByDay).map(([day, dayShifts]) => (
          <section key={day} style={styles.daySection}>
            <h2 style={styles.dayHeader}>{day}</h2>
            <div style={styles.shiftsGrid}>
              {dayShifts.map((shift) => {
                const status = getShiftStatus(shift);
                const openSpots = EVENT_CONFIG.maxChampionsPerShift - shift.champions.length;
                const timePeriod = getTimePeriod(shift.start, timezone);
                
                return (
                  <div
                    key={shift.id}
                    style={{
                      ...styles.shiftCard,
                      ...styles[`shiftCard_${status}`]
                    }}
                    role="article"
                    aria-label={`${t.shift} ${shift.id + 1}: ${formatTime(shift.start, timezone)} - ${formatTime(shift.end, timezone)}, ${t[timePeriod]}, ${openSpots} ${openSpots === 1 ? t.spot : t.spots} ${t.open}`}
                  >
                    <div style={styles.timePeriodBadge}>
                      <span aria-hidden="true">{timePeriodIcons[timePeriod]}</span> {t[timePeriod]}
                    </div>
                    
                    <div style={styles.shiftTime}>
                      {formatTime(shift.start, timezone)} - {formatTime(shift.end, timezone)}
                    </div>
                    
                    <div style={styles.shiftStatus}>
                      {status === 'available' && (
                        <span style={styles.statusBadge_available}>2 {t.spots} {t.open}</span>
                      )}
                      {status === 'partial' && (
                        <span style={styles.statusBadge_partial}>1 {t.spot} {t.open}</span>
                      )}
                      {status === 'full' && (
                        <span style={styles.statusBadge_full}>{t.full}</span>
                      )}
                    </div>
                    
                    <div style={styles.championsList}>
                      {shift.champions.map((champion, idx) => (
                        <div key={idx} style={styles.championItem}>
                          <span style={styles.championName}>{champion.name}</span>
                          {isAdmin && (
                            <button
                              onClick={() => handleAdminRemove(shift.id, idx)}
                              style={styles.removeButton}
                              aria-label={`${t.removeFrom}: ${champion.name}`}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {isAdmin && shift.champions.length < EVENT_CONFIG.maxChampionsPerShift && (
                      <AdminAddForm
                        shiftId={shift.id}
                        onAdd={handleAdminAdd}
                        t={t}
                        styles={styles}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
      
      {/* Sign Up Modal */}
      {showSignUp && (
        <div
          style={styles.modalOverlay}
          onClick={(e) => e.target === e.currentTarget && closeSignUpModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="signup-title"
        >
          <div style={styles.modal} ref={signUpModalRef}>
            <h2 id="signup-title" style={styles.modalTitle}>{t.signUp}</h2>
            
            <div style={styles.formGroup}>
              <label htmlFor="signup-name" style={styles.label}>{t.name}</label>
              <input
                id="signup-name"
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                style={styles.input}
                ref={signUpFirstInputRef}
                aria-invalid={!!formErrors.name}
                aria-describedby={formErrors.name ? 'name-error' : undefined}
              />
              {formErrors.name && (
                <span id="name-error" style={styles.errorText} role="alert">{formErrors.name}</span>
              )}
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="signup-email" style={styles.label}>{t.email}</label>
              <input
                id="signup-email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                style={styles.input}
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? 'email-error' : undefined}
              />
              {formErrors.email && (
                <span id="email-error" style={styles.errorText} role="alert">{formErrors.email}</span>
              )}
            </div>
            
            <fieldset style={styles.fieldset}>
              <legend style={styles.legend2}>{t.selectShifts}</legend>
              {formErrors.shifts && (
                <span style={styles.errorText} role="alert">{formErrors.shifts}</span>
              )}
              
              <div style={styles.shiftSelectionGrid}>
                {shifts.map((shift) => {
                  const status = getShiftStatus(shift);
                  const isSelected = selectedShifts.includes(shift.id);
                  const checkResult = canSelectShift(shift.id, selectedShifts.filter(id => id !== shift.id), formEmail);
                  const canSelect = isSelected || checkResult.allowed;
                  const timePeriod = getTimePeriod(shift.start, timezone);
                  
                  return (
                    <button
                      key={shift.id}
                      onClick={() => handleShiftToggle(shift.id)}
                      disabled={!canSelect && !isSelected}
                      style={{
                        ...styles.shiftSelectButton,
                        ...(isSelected ? styles.shiftSelectButton_selected : {}),
                        ...(!canSelect && !isSelected ? styles.shiftSelectButton_disabled : {})
                      }}
                      aria-pressed={isSelected}
                      aria-label={`${formatDate(shift.start, timezone)} ${formatTime(shift.start, timezone)} - ${formatTime(shift.end, timezone)}, ${t[timePeriod]}${!canSelect && !isSelected ? `, ${t[checkResult.reason] || t.blocked}` : ''}`}
                    >
                      <span style={styles.shiftSelectPeriod}>
                        <span aria-hidden="true">{timePeriodIcons[timePeriod]}</span> {t[timePeriod]}
                      </span>
                      <span style={styles.shiftSelectDate}>{formatDate(shift.start, timezone)}</span>
                      <span style={styles.shiftSelectTime}>
                        {formatTime(shift.start, timezone)} - {formatTime(shift.end, timezone)}
                      </span>
                      {!canSelect && !isSelected && (
                        <span style={styles.shiftSelectReason}>
                          {t[checkResult.reason] || t.blocked}
                        </span>
                      )}
                      {status === 'partial' && !isSelected && canSelect && (
                        <span style={styles.shiftSelectPartial}>1 {t.spot}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            
            <div style={styles.modalActions}>
              <button onClick={closeSignUpModal} style={styles.secondaryButton}>
                {t.cancel}
              </button>
              <button onClick={handleSubmit} style={styles.primaryButton}>
                {t.submit}
              </button>
            </div>
          </div>
        </div>
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
      
      {/* Success Modal with Calendar Options */}
      {showSuccessModal && (
        <div
          style={styles.modalOverlay}
          onClick={(e) => e.target === e.currentTarget && setShowSuccessModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          <div style={{ ...styles.modal, maxWidth: '500px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h2 id="success-title" style={styles.modalTitle}>{t.signUpSuccess}</h2>
            
            <p style={{ color: colors.textMuted, marginBottom: '1.5rem' }}>
              {lastSignedUpShifts.length} {lastSignedUpShifts.length === 1 ? t.shift : 'shifts'} 
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: colors.text, marginBottom: '1rem', fontWeight: '600' }}>
                {t.addToCalendar}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={openGoogleCalendar} 
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
                  onClick={downloadIcsFile} 
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
                  onClick={emailIcsFile} 
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
                marginTop: '1rem',
                backgroundColor: colors.bg,
                padding: '0.75rem',
                borderRadius: '8px',
                lineHeight: '1.5'
              }}>
                💡 {t.icsEmailTip}
              </p>
            </div>
            
            <button 
              onClick={() => setShowSuccessModal(false)} 
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
function AdminAddForm({ shiftId, onAdd, t, styles }) {
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
      <button onClick={() => setIsOpen(true)} style={styles.addButton}>
        + {t.add}
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
        <button onClick={handleSubmit} style={styles.smallPrimaryButton}>
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
    color: '#fff',
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
    color: colors.bg,
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
  
  daySection: {
    marginBottom: '2rem',
  },
  
  dayHeader: {
    fontSize: '1.5rem',
    color: colors.accent,
    borderBottom: `2px solid ${colors.border}`,
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
  },
  
  shiftsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
    gap: '1rem',
  },
  
  shiftCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: '12px',
    padding: '1.25rem',
    border: '2px solid',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  
  shiftCard_available: {
    borderColor: colors.available,
  },
  
  shiftCard_partial: {
    borderColor: colors.partial,
  },
  
  shiftCard_full: {
    borderColor: colors.full,
    opacity: 0.85,
  },
  
  timePeriodBadge: {
    fontSize: '0.8rem',
    color: colors.textMuted,
    marginBottom: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  
  shiftTime: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.text,
    marginBottom: '0.5rem',
  },
  
  shiftStatus: {
    marginBottom: '0.75rem',
  },
  
  statusBadge_available: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: colors.available,
    color: '#fff',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  
  statusBadge_partial: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: colors.partial,
    color: '#fff',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  
  statusBadge_full: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: colors.full,
    color: '#fff',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  
  championsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  
  championItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg,
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
  },
  
  championName: {
    fontWeight: '600',
  },
  
  removeButton: {
    backgroundColor: 'transparent',
    color: colors.error,
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.25rem',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  
  addButton: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    width: '100%',
    backgroundColor: 'transparent',
    color: colors.accent,
    border: `2px dashed ${colors.accent}`,
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    minHeight: '48px',
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  
  adminAddForm: {
    marginTop: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  
  adminInput: {
    padding: '0.75rem',
    fontSize: '16px',
    backgroundColor: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    minHeight: '44px',
    WebkitAppearance: 'none',
    appearance: 'none',
  },
  
  adminAddActions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
  },
  
  smallSecondaryButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    backgroundColor: 'transparent',
    color: colors.textMuted,
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    cursor: 'pointer',
    minHeight: '44px',
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  
  smallPrimaryButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    backgroundColor: colors.accent,
    color: colors.bg,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    minHeight: '44px',
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
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
  
  shiftSelectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))',
    gap: '0.75rem',
    marginTop: '1rem',
    maxHeight: '50vh',
    overflow: 'auto',
    padding: '0.5rem',
    WebkitOverflowScrolling: 'touch',
  },
  
  shiftSelectButton: {
    padding: '1rem',
    backgroundColor: colors.bg,
    color: colors.text,
    border: `2px solid ${colors.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    minHeight: '72px',
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  
  shiftSelectButton_selected: {
    backgroundColor: colors.available,
    borderColor: colors.selectedBorder,
  },
  
  shiftSelectButton_disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    backgroundColor: colors.bg,
  },
  
  shiftSelectPeriod: {
    fontSize: '0.75rem',
    color: colors.textMuted,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
  },
  
  shiftSelectDate: {
    fontSize: '0.85rem',
    color: colors.textMuted,
  },
  
  shiftSelectTime: {
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  
  shiftSelectReason: {
    fontSize: '0.8rem',
    color: colors.error,
    marginTop: '0.25rem',
  },
  
  shiftSelectPartial: {
    fontSize: '0.8rem',
    color: colors.partial,
    marginTop: '0.25rem',
  },
  
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1.5rem',
  },
});

// Add CSS animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
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
  
  button:focus-visible {
    outline: 3px solid #14b8a6;
    outline-offset: 2px;
  }
  
  input:focus-visible, select:focus-visible {
    outline: 3px solid #14b8a6;
    outline-offset: 2px;
    border-color: #14b8a6;
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
  
  /* Improve modal behavior on mobile with keyboard open */
  @supports (padding: max(0px)) {
    .modal-open {
      padding-bottom: env(keyboard-inset-height, 0px);
    }
  }
`;
document.head.appendChild(styleSheet);
