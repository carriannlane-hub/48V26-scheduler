import { useState, useEffect, useCallback } from 'react';

// ============================================
// CONFIGURATION
// ============================================
const EVENT_CONFIG = {
  name: "GamiCon48V 2026",
  startTime: new Date('2026-03-21T19:00:00-05:00'),
  endTime: new Date('2026-03-23T19:00:00-05:00'),
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
    text: '#f0ebe5',
    textMuted: '#c4b5a5',
    title: '#e2e8f0',
    accent: '#14b8a6',
    techAccent: '#f59e0b',
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
  },
  light: {
    bg: '#f8fafc',
    bgSecondary: '#ffffff',
    text: '#1e293b',
    textMuted: '#475569',
    title: '#0f172a',
    accent: '#0f766e',
    techAccent: '#b45309',
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
  }
};

// ============================================
// TRANSLATIONS (English only for preview)
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
    timezoneNote: 'All shifts are displayed in your local time. "Sententral Time" is Central Time (US).',
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
    rulesDialogue: `Hello Champions! Thanks for bringing GamiCon48V to life!\n\nIf you are an Event Champion, please take "Champions" shifts.\n\n<strong>Event Champion Role:</strong> You'll help deliver a seamless, high-energy experience across all time zones. Serve 12 hours during the 48-hour broadcast.\n\nIf you have been confirmed as a Tech Support Champion, you can take "Tech" shifts.\n\n<strong>Tech Support Champion Role:</strong> You'll provide proactive technical support for all participants.\n\nShifts are 2 hours each. You can take up to 2 shifts back-to-back (4 hours max), then please rest for at least 2 hours. Maximum 12 hours total. If you have questions, please contact Carriann Lane.`,
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
    seeMyShifts: "See My Shifts",
    enterYourEmail: "Enter your email to see your shifts",
    lookupShifts: "Look Up My Shifts",
    noShiftsFound: "No shifts found for this email.",
    myShiftsTitle: "My Shifts",
    exportAll: "Export All to Calendar",
  },
};

// ============================================
// SHIFT GENERATION
// ============================================
const generateShifts = () => {
  const shifts = [];
  const startTime = new Date(EVENT_CONFIG.startTime);
  const totalShifts = 48 / EVENT_CONFIG.shiftDurationHours;
  for (let i = 0; i < totalShifts; i++) {
    const shiftStart = new Date(startTime.getTime() + i * EVENT_CONFIG.shiftDurationHours * 60 * 60 * 1000);
    const shiftEnd = new Date(shiftStart.getTime() + EVENT_CONFIG.shiftDurationHours * 60 * 60 * 1000);
    shifts.push({
      id: i + 1,
      start: shiftStart,
      end: shiftEnd,
      champions: [],
      techChampions: []
    });
  }
  return shifts;
};

// MOCK DATA - pre-populate some shifts to show the UI
const addMockData = (shifts) => {
  const mockNames = [
    { name: "Carriann L.", email: "carriann@example.com" },
    { name: "Monica C.", email: "monica@example.com" },
    { name: "Alex T.", email: "alex@example.com" },
    { name: "Sam W.", email: "sam@example.com" },
    { name: "Jordan K.", email: "jordan@example.com" },
  ];
  // Add some champions to various shifts
  shifts[0].champions = [mockNames[0], mockNames[1]];
  shifts[0].techChampions = [mockNames[2]];
  shifts[1].champions = [mockNames[0]];
  shifts[1].techChampions = [mockNames[2]];
  shifts[2].champions = [mockNames[3], mockNames[4]];
  shifts[4].champions = [mockNames[1]];
  shifts[5].techChampions = [mockNames[2]];
  shifts[8].champions = [mockNames[3]];
  shifts[12].champions = [mockNames[0], mockNames[4]];
  shifts[12].techChampions = [mockNames[2]];
  return shifts;
};

// ============================================
// UTILITIES
// ============================================
const formatTime = (date, timezone = 'America/Chicago') => {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: timezone });
};

const formatDate = (date, timezone = 'America/Chicago') => {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: timezone });
};

const getUserTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

const getTimezoneName = (timezone) => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' }).formatToParts(new Date());
    const tzPart = parts.find(part => part.type === 'timeZoneName');
    return tzPart ? tzPart.value : timezone.split('/').pop().replace('_', ' ');
  } catch {
    return timezone.split('/').pop().replace('_', ' ');
  }
};

const getTimePeriod = (date, timezone = 'America/Chicago') => {
  const hour = parseInt(date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false, timeZone: timezone }));
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

const timePeriodIcons = { morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙' };

const groupShiftsIntoBlocks = (shifts, timezone) => {
  const blocks = [];
  let currentBlock = null;
  shifts.forEach((shift) => {
    const period = getTimePeriod(shift.start, timezone);
    const dateStr = formatDate(shift.start, timezone);
    const blockKey = `${dateStr}-${period}`;
    if (!currentBlock || currentBlock.key !== blockKey) {
      currentBlock = { key: blockKey, date: dateStr, period, shifts: [], label: `${dateStr} - ${period.charAt(0).toUpperCase() + period.slice(1)}` };
      blocks.push(currentBlock);
    }
    currentBlock.shifts.push(shift);
  });
  return blocks;
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function App() {
  const [shifts, setShifts] = useState(() => addMockData(generateShifts()));
  const [theme, setTheme] = useState('dark');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [userTimezone] = useState(getUserTimezone());
  const [showLocalTime, setShowLocalTime] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedBlocks, setExpandedBlocks] = useState({});
  const [inlineSignUp, setInlineSignUp] = useState(null);
  const [showMyShifts, setShowMyShifts] = useState(false);
  const [myShiftsEmail, setMyShiftsEmail] = useState('');
  const [myShiftsList, setMyShiftsList] = useState([]);
  const [myShiftsRole, setMyShiftsRole] = useState('');
  const [myShiftsError, setMyShiftsError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSignedUpShifts, setLastSignedUpShifts] = useState([]);
  const [lastSignedUpEmail, setLastSignedUpEmail] = useState('');
  const [lastSignedUpRole, setLastSignedUpRole] = useState('champion');
  const [pendingCalendarShifts, setPendingCalendarShifts] = useState([]);
  const [inlineName, setInlineName] = useState('');
  const [inlineEmail, setInlineEmail] = useState('');
  const [inlineErrors, setInlineErrors] = useState({});
  const [isInlineSubmitting, setIsInlineSubmitting] = useState(false);
  const [savedUserInfo, setSavedUserInfo] = useState(null);

  const t = translations.en;
  const colors = themes[theme];
  const timezone = showLocalTime ? userTimezone : 'America/Chicago';
  const shiftBlocks = groupShiftsIntoBlocks(shifts, timezone);
  const styles = getStyles(colors);

  useEffect(() => {
    const first = shiftBlocks.length > 0 ? { [shiftBlocks[0].key]: true } : {};
    setExpandedBlocks(first);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showAdminLogin) setShowAdminLogin(false);
        if (showSuccessModal) handleScheduleMore();
        if (inlineSignUp) setInlineSignUp(null);
        if (showMyShifts) { setShowMyShifts(false); setMyShiftsList([]); }
      }
    };
    if (showAdminLogin || showSuccessModal || showMyShifts || inlineSignUp) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = ''; };
  }, [showAdminLogin, showSuccessModal, showMyShifts, inlineSignUp]);

  const toggleBlock = (blockKey) => {
    setExpandedBlocks(prev => ({ ...prev, [blockKey]: !prev[blockKey] }));
  };

  const canSelectShift = (shiftId, currentSelections, userEmail = null, role = 'champion') => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return { allowed: false, reason: 'invalid' };
    if (role === 'champion' && shift.champions.length >= EVENT_CONFIG.maxChampionsPerShift) return { allowed: false, reason: 'full' };
    if (role === 'tech' && shift.techChampions.length >= EVENT_CONFIG.maxTechPerShift) return { allowed: false, reason: 'full' };
    if (userEmail) {
      const inChampions = shift.champions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
      const inTech = shift.techChampions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
      if (inChampions || inTech) return { allowed: false, reason: 'alreadySignedUp' };
    }
    const allUserShiftIds = [...currentSelections];
    if (userEmail) {
      shifts.forEach(s => {
        const inC = s.champions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
        const inT = s.techChampions.some(c => c.email.toLowerCase() === userEmail.toLowerCase());
        if (inC || inT) allUserShiftIds.push(s.id);
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
        if (consecutiveCount >= 2 && breakHours < EVENT_CONFIG.requiredBreakHours) return { allowed: false, reason: 'blocked' };
        consecutiveCount = 1;
      }
    }
    if (maxConsecutive * EVENT_CONFIG.shiftDurationHours > EVENT_CONFIG.maxConsecutiveHours) return { allowed: false, reason: 'blocked' };
    const totalHours = potentialShifts.length * EVENT_CONFIG.shiftDurationHours;
    if (totalHours > EVENT_CONFIG.maxHoursTotal) return { allowed: false, reason: 'totalLimit' };
    return { allowed: true };
  };

  const getChampionStatus = (shift) => {
    if (shift.champions.length >= EVENT_CONFIG.maxChampionsPerShift) return 'full';
    if (shift.champions.length === 1) return 'partial';
    return 'available';
  };

  const getTechStatus = (shift) => {
    if (shift.techChampions.length >= EVENT_CONFIG.maxTechPerShift) return 'full';
    return 'available';
  };

  const countAvailableInBlock = (block) => {
    let count = 0;
    block.shifts.forEach(shift => {
      if (shift.champions.length < EVENT_CONFIG.maxChampionsPerShift) count++;
      if (shift.techChampions.length < EVENT_CONFIG.maxTechPerShift) count++;
    });
    return count;
  };

  const openInlineSignUp = (shiftId, role) => {
    setInlineSignUp({ shiftId, role });
    if (savedUserInfo) { setInlineName(savedUserInfo.name); setInlineEmail(savedUserInfo.email); }
    else { setInlineName(''); setInlineEmail(''); }
    setInlineErrors({});
  };

  const closeInlineSignUp = () => { setInlineSignUp(null); setInlineErrors({}); };

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
      setInlineErrors(prev => ({ ...prev, rules: t[ruleCheck.reason] || t.blocked }));
      return;
    }
    setIsInlineSubmitting(true);
    try {
      const shift = shifts.find(s => s.id === shiftId);
      const newShifts = shifts.map(s => {
        if (s.id === shiftId) {
          if (role === 'tech') return { ...s, techChampions: [...s.techChampions, { name: inlineName.trim(), email: inlineEmail.trim() }] };
          else return { ...s, champions: [...s.champions, { name: inlineName.trim(), email: inlineEmail.trim() }] };
        }
        return s;
      });
      setShifts(newShifts);
      const userInfo = { name: inlineName.trim(), email: inlineEmail.trim() };
      setSavedUserInfo(userInfo);
      setLastSignedUpShifts([shift]);
      setLastSignedUpEmail(inlineEmail.trim());
      setLastSignedUpRole(role);
      closeInlineSignUp();
      setShowSuccessModal(true);
    } finally {
      setIsInlineSubmitting(false);
    }
  };

  const handleScheduleMore = () => {
    setPendingCalendarShifts(prev => [...prev, ...lastSignedUpShifts]);
    setShowSuccessModal(false);
  };

  const handleAdminRemove = (shiftId, championIndex, isTech = false) => {
    if (!window.confirm(t.removeConfirm)) return;
    const newShifts = shifts.map(shift => {
      if (shift.id === shiftId) {
        if (isTech) { const newTech = [...shift.techChampions]; newTech.splice(championIndex, 1); return { ...shift, techChampions: newTech }; }
        else { const newChampions = [...shift.champions]; newChampions.splice(championIndex, 1); return { ...shift, champions: newChampions }; }
      }
      return shift;
    });
    setShifts(newShifts);
  };

  const lookupMyShifts = () => {
    if (!myShiftsEmail.trim()) { setMyShiftsError(t.emailRequired); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(myShiftsEmail)) { setMyShiftsError(t.emailInvalid); return; }
    setMyShiftsError('');
    const email = myShiftsEmail.trim().toLowerCase();
    const found = [];
    let role = 'champion';
    shifts.forEach(shift => {
      const inChampions = shift.champions.some(c => c.email.toLowerCase() === email);
      const inTech = shift.techChampions.some(c => c.email.toLowerCase() === email);
      if (inChampions) found.push({ ...shift, myRole: 'champion' });
      if (inTech) { found.push({ ...shift, myRole: 'tech' }); role = 'tech'; }
    });
    setMyShiftsList(found);
    setMyShiftsRole(role);
  };

  const handleAdminLogin = () => {
    if (adminPassword === EVENT_CONFIG.adminPassword) {
      setIsAdmin(true); setShowAdminLogin(false); setAdminPassword(''); setPasswordError(false);
    } else { setPasswordError(true); }
  };

  return (
    <div style={styles.container}>
      {/* Skip Link */}
      <a href="#main-schedule" style={styles.skipLink}>Skip to schedule</a>

      {/* Live region */}
      <div role="status" aria-live="polite" aria-atomic="true" style={styles.srOnly}>{successMessage}</div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.titleGroup}>
            <h1 style={styles.title}>{t.title}</h1>
            <p style={styles.subtitle}>{t.subtitle}</p>
          </div>
          <div style={styles.controls}>
            <div style={styles.controlGroup}>
              <label htmlFor="timezone-toggle" style={styles.controlLabel}>
                {showLocalTime ? t.yourTimezone : t.sententralTime}
              </label>
              <button id="timezone-toggle" onClick={() => setShowLocalTime(!showLocalTime)} style={styles.toggleButton} aria-pressed={showLocalTime}>
                {showLocalTime ? getTimezoneName(userTimezone) : t.centralTime}
              </button>
            </div>
            <div style={styles.controlGroup}>
              <label htmlFor="theme-toggle" style={styles.controlLabel}>{t.theme}</label>
              <button id="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={styles.toggleButton} aria-pressed={theme === 'dark'}>
                {theme === 'dark' ? '☀️ ' + t.lightMode : '🌙 ' + t.darkMode}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Preview banner */}
      <div style={{ background: 'linear-gradient(90deg, #f59e0b, #14b8a6)', color: '#000', textAlign: 'center', padding: '0.5rem', fontWeight: 700, fontSize: '0.85rem' }}>
        ⚡ PREVIEW MODE — Mock data shown. Sign-ups work locally but don't save to the database.
      </div>

      {/* Timezone Note */}
      <div style={styles.timezoneNote}>📍 {t.timezoneNote}</div>

      {/* Success Message */}
      {successMessage && <div style={styles.successBanner} role="status" aria-live="polite">✓ {successMessage}</div>}

      {/* Admin bar */}
      {isAdmin && (
        <div style={styles.actionBar}>
          <div style={styles.actionGroup}>
            <button onClick={() => setIsAdmin(false)} style={styles.secondaryButton}>{t.exitAdmin}</button>
          </div>
        </div>
      )}

      {/* Pending Calendar Banner */}
      {pendingCalendarShifts.length > 0 && (
        <div style={styles.pendingBanner}>
          <span>📅 {pendingCalendarShifts.length} {t.pendingShifts}</span>
          <button onClick={() => setPendingCalendarShifts([])} style={styles.pendingBannerButton}>
            {t.addAllToCalendar}
          </button>
        </div>
      )}

      {/* Rules */}
      <details style={styles.rulesPanel}>
        <summary style={styles.rulesSummary}>{t.rules}</summary>
        <div style={styles.rulesDialogue} dangerouslySetInnerHTML={{ __html: t.rulesDialogue.replace(/\n\n/g, '<br/><br/>') }} />
      </details>

      {/* See My Shifts - prominent for returning users */}
      <div style={styles.myShiftsBar}>
        <button onClick={() => { if (savedUserInfo) setMyShiftsEmail(savedUserInfo.email); setShowMyShifts(true); }} style={styles.myShiftsButton}>
          📋 {t.seeMyShifts}
        </button>
      </div>

      {/* Schedule */}
      <main id="main-schedule" style={styles.scheduleContainer} role="main" aria-label="Shift schedule">
        {shiftBlocks.map((block) => {
          const isExpanded = expandedBlocks[block.key];
          const availableCount = countAvailableInBlock(block);
          return (
            <section key={block.key} style={styles.blockSection}>
              <button onClick={() => toggleBlock(block.key)} style={{ ...styles.blockHeader, ...(isExpanded ? styles.blockHeaderExpanded : {}) }} aria-expanded={isExpanded} aria-controls={`block-${block.key}`}>
                <div style={styles.blockHeaderLeft}>
                  <span style={styles.blockIcon} aria-hidden="true">{timePeriodIcons[block.period]}</span>
                  <span style={styles.blockTitle}>{block.date} • {t[block.period]}</span>
                </div>
                <div style={styles.blockHeaderRight}>
                  {!isExpanded && <span style={styles.availableBadge}>{availableCount} {t.shiftsAvailable}</span>}
                  <span style={styles.expandIcon} aria-hidden="true">{isExpanded ? '▼' : '▶'}</span>
                </div>
              </button>

              {isExpanded && (
                <div id={`block-${block.key}`} style={styles.blockContent}>
                  {block.shifts.map((shift) => {
                    const champStatus = getChampionStatus(shift);
                    const techStatus = getTechStatus(shift);
                    return (
                      <div key={shift.id} style={styles.shiftRow}>
                        {/* Time */}
                        <div style={styles.shiftTimeCol}>
                          <div style={styles.shiftTime}>{formatTime(shift.start, timezone)}</div>
                          <div style={styles.shiftTimeTo}>to</div>
                          <div style={styles.shiftTime}>{formatTime(shift.end, timezone)}</div>
                        </div>
                        {/* Champions */}
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
                          </div>
                        </div>
                        {/* Tech */}
                        <div style={styles.roleColumn}>
                          <div style={styles.roleHeader}>
                            <span style={{ ...styles.roleLabel, color: colors.techAccent }}>{t.tech}</span>
                            <span style={{ ...styles.statusDot, backgroundColor: techStatus === 'full' ? colors.full : colors.techAccent }} />
                          </div>
                          <div style={styles.championsList}>
                            {shift.techChampions.map((tech, idx) => (
                              <div key={idx} style={{ ...styles.championChip, borderColor: colors.techAccent }}>
                                <span>{tech.name}</span>
                                {isAdmin && <button onClick={() => handleAdminRemove(shift.id, idx, true)} style={styles.removeChip} aria-label={`${t.remove} ${tech.name}`}>✕</button>}
                              </div>
                            ))}
                            {shift.techChampions.length < EVENT_CONFIG.maxTechPerShift && (
                              <button onClick={() => openInlineSignUp(shift.id, 'tech')} style={{ ...styles.openSlotButton, borderColor: colors.techAccent, color: colors.techAccent }} aria-label={`${t.signUpFor} ${t.techSupport} ${formatTime(shift.start, timezone)}`}>
                                <span style={styles.openSlotPlus}>+</span>
                                <span>1 {t.open}</span>
                              </button>
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

      {/* Footer */}
      {!isAdmin && (
        <footer style={styles.footer}>
          <button onClick={() => setShowAdminLogin(true)} style={styles.footerAdminButton}>{t.adminMode}</button>
        </footer>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowAdminLogin(false)} role="dialog" aria-modal="true" aria-labelledby="admin-title">
          <div style={{ ...styles.modal, maxWidth: '400px' }}>
            <h2 id="admin-title" style={styles.modalTitle}>{t.adminMode}</h2>
            <div style={styles.formGroup}>
              <label htmlFor="admin-password" style={styles.label}>{t.enterPassword}</label>
              <input id="admin-password" type="password" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); setPasswordError(false); }} onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()} style={styles.input} autoFocus aria-invalid={passwordError} />
              {passwordError && <span style={styles.errorText} role="alert">{t.wrongPassword}</span>}
            </div>
            <div style={styles.modalActions}>
              <button onClick={() => setShowAdminLogin(false)} style={styles.secondaryButton}>{t.cancel}</button>
              <button onClick={handleAdminLogin} style={styles.primaryButton}>{t.login}</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && handleScheduleMore()} role="dialog" aria-modal="true">
          <div style={{ ...styles.modal, maxWidth: '450px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ ...styles.modalTitle, color: lastSignedUpRole === 'tech' ? colors.techAccent : colors.accent }}>{t.signUpSuccess}</h2>
            <p style={{ color: colors.textMuted, marginBottom: '1.5rem' }}>
              {lastSignedUpShifts.length} {lastSignedUpShifts.length === 1 ? t.shift : 'shifts'} • {lastSignedUpRole === 'tech' ? t.techSupport : t.eventChampion}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={handleScheduleMore} style={{ ...styles.primaryButton, ...(lastSignedUpRole === 'tech' ? { backgroundColor: colors.techAccent, color: colors.onTechAccent } : {}) }}>{t.scheduleMore}</button>
            </div>
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
              <div style={{ ...styles.bottomSheetRole, backgroundColor: inlineSignUp.role === 'tech' ? `${colors.techAccent}20` : `${colors.accent}20`, color: inlineSignUp.role === 'tech' ? colors.techAccent : colors.accent }}>
                {inlineSignUp.role === 'tech' ? `🔧 ${t.techSupport}` : `🏆 ${t.eventChampion}`}
              </div>
            </div>
            {inlineSignUp.role === 'tech' && <div style={styles.techWarning} role="note">{t.techDescription}</div>}
            {inlineErrors.rules && <div style={styles.bottomSheetRulesError} role="alert">⚠️ {inlineErrors.rules}</div>}
            <div style={styles.bottomSheetForm}>
              <div>
                <label htmlFor="bottom-sheet-name" style={styles.srOnly}>{t.name}</label>
                <input id="bottom-sheet-name" type="text" placeholder={t.name} value={inlineName} onChange={(e) => setInlineName(e.target.value)} style={{ ...styles.bottomSheetInput, borderColor: inlineSignUp.role === 'tech' ? colors.techAccent : colors.accent }} autoFocus aria-invalid={!!inlineErrors.name} />
                {inlineErrors.name && <div style={styles.bottomSheetError} role="alert">{inlineErrors.name}</div>}
              </div>
              <div>
                <label htmlFor="bottom-sheet-email" style={styles.srOnly}>{t.email}</label>
                <input id="bottom-sheet-email" type="email" placeholder={t.email} value={inlineEmail} onChange={(e) => setInlineEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleInlineSubmit()} style={{ ...styles.bottomSheetInput, borderColor: inlineSignUp.role === 'tech' ? colors.techAccent : colors.accent }} aria-invalid={!!inlineErrors.email} />
                {inlineErrors.email && <div style={styles.bottomSheetError} role="alert">{inlineErrors.email}</div>}
              </div>
              <div style={styles.bottomSheetActions}>
                <button onClick={closeInlineSignUp} style={{ ...styles.bottomSheetCancel, ...(isInlineSubmitting ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }} disabled={isInlineSubmitting} type="button">{t.cancel}</button>
                <button onClick={handleInlineSubmit} style={{ ...styles.bottomSheetSubmit, backgroundColor: inlineSignUp.role === 'tech' ? colors.techAccent : colors.accent, ...(isInlineSubmitting ? { opacity: 0.7, cursor: 'wait' } : {}) }} disabled={isInlineSubmitting} aria-busy={isInlineSubmitting} type="submit">{isInlineSubmitting ? t.submitting : t.signUp}</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* My Shifts Modal */}
      {showMyShifts && (
        <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowMyShifts(false)} role="dialog" aria-modal="true" aria-labelledby="my-shifts-title">
          <div style={{ ...styles.modal, maxWidth: '550px' }}>
            <h2 id="my-shifts-title" style={styles.modalTitle}>📋 {t.myShiftsTitle}</h2>
            {myShiftsList.length === 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: colors.textMuted, marginBottom: '1rem', textAlign: 'center' }}>{t.enterYourEmail}</p>
                <input type="email" placeholder={t.email} value={myShiftsEmail} onChange={(e) => { setMyShiftsEmail(e.target.value); setMyShiftsError(''); }} onKeyDown={(e) => e.key === 'Enter' && lookupMyShifts()} style={styles.input} autoFocus />
                {myShiftsError && <div style={{ color: colors.error, fontSize: '0.9rem', marginTop: '0.5rem' }} role="alert">{myShiftsError}</div>}
                <p style={{ color: colors.textMuted, fontSize: '0.8rem', marginTop: '0.75rem', textAlign: 'center' }}>Try: carriann@example.com or alex@example.com</p>
                <div style={{ ...styles.modalActions, marginTop: '1rem' }}>
                  <button onClick={() => setShowMyShifts(false)} style={styles.secondaryButton}>{t.close}</button>
                  <button onClick={lookupMyShifts} style={styles.primaryButton}>{t.lookupShifts}</button>
                </div>
              </div>
            )}
            {myShiftsList.length > 0 && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {myShiftsList.map((shift) => {
                    const dayName = shift.start.toLocaleDateString(undefined, { weekday: 'long' });
                    const dateStr = shift.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    const startTime = shift.start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
                    const endTime = shift.end.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
                    const roleColor = shift.myRole === 'tech' ? colors.techAccent : colors.accent;
                    return (
                      <div key={shift.id + shift.myRole} style={{ padding: '1rem', backgroundColor: colors.bg, borderRadius: '10px', borderLeft: `4px solid ${roleColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '1rem', color: colors.text }}>{dayName}, {dateStr}</div>
                          <div style={{ color: colors.textMuted, fontSize: '0.95rem', marginTop: '0.25rem' }}>{startTime} – {endTime}</div>
                        </div>
                        <div style={{ padding: '0.25rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', backgroundColor: `${roleColor}20`, color: roleColor }}>
                          {shift.myRole === 'tech' ? t.techSupport : t.eventChampion}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p style={{ color: colors.textMuted, fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' }}>{myShiftsList.length} {myShiftsList.length === 1 ? t.shift : 'shifts'}</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button onClick={() => { setMyShiftsList([]); setMyShiftsEmail(''); }} style={styles.secondaryButton}>← {t.lookupShifts}</button>
                  <button onClick={() => setShowMyShifts(false)} style={styles.primaryButton}>{t.close}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// STYLES
// ============================================
const getStyles = (colors) => ({
  container: { minHeight: '100vh', backgroundColor: colors.bg, color: colors.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', margin: 0, padding: 0 },
  skipLink: { position: 'absolute', top: '-100px', left: '10px', background: colors.accent, color: '#fff', padding: '0.5rem 1rem', zIndex: 1000, borderRadius: '4px', textDecoration: 'none', fontWeight: 600 },
  srOnly: { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 },
  header: { background: `linear-gradient(135deg, ${colors.bgSecondary}, ${colors.bg})`, borderBottom: `2px solid ${colors.border}`, padding: '1.25rem 1.5rem' },
  headerContent: { maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  titleGroup: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  title: { fontSize: '1.5rem', fontWeight: 700, color: colors.title, margin: 0 },
  subtitle: { fontSize: '0.95rem', color: colors.accent, margin: 0, fontWeight: 600 },
  controls: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' },
  controlGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' },
  controlLabel: { fontSize: '0.7rem', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' },
  toggleButton: { padding: '0.4rem 0.75rem', borderRadius: '20px', border: `2px solid ${colors.border}`, background: colors.bgSecondary, color: colors.text, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
  select: { padding: '0.4rem 0.75rem', borderRadius: '20px', border: `2px solid ${colors.border}`, background: colors.bgSecondary, color: colors.text, fontSize: '0.85rem', cursor: 'pointer' },
  timezoneNote: { maxWidth: '1000px', margin: '0 auto', padding: '0.75rem 1.5rem', fontSize: '0.85rem', color: colors.textMuted },
  successBanner: { maxWidth: '1000px', margin: '0 auto', padding: '0.75rem 1.5rem', backgroundColor: `${colors.available}20`, color: colors.available, borderRadius: '8px', fontWeight: 600, textAlign: 'center' },
  actionBar: { maxWidth: '1000px', margin: '0 auto', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'flex-end' },
  actionGroup: { display: 'flex', gap: '0.75rem' },
  pendingBanner: { maxWidth: '1000px', margin: '0.5rem auto', padding: '0.75rem 1.5rem', backgroundColor: `${colors.accent}15`, borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: colors.accent, fontWeight: 600, fontSize: '0.9rem' },
  pendingBannerButton: { padding: '0.4rem 1rem', borderRadius: '20px', border: `2px solid ${colors.accent}`, background: 'transparent', color: colors.accent, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' },
  rulesPanel: { maxWidth: '1000px', margin: '0.5rem auto', padding: '0 1.5rem' },
  rulesSummary: { padding: '0.75rem 1rem', backgroundColor: colors.bgSecondary, borderRadius: '10px', border: `2px solid ${colors.border}`, color: colors.accent, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', listStyle: 'none' },
  rulesDialogue: { padding: '1rem', color: colors.textMuted, lineHeight: 1.7, fontSize: '0.9rem' },
  scheduleContainer: { maxWidth: '1000px', margin: '0 auto', padding: '0.5rem 1rem' },
  blockSection: { marginBottom: '0.5rem' },
  blockHeader: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', backgroundColor: colors.bgSecondary, border: `2px solid ${colors.border}`, borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', color: colors.text, fontSize: '1rem', fontWeight: 600, boxSizing: 'border-box' },
  blockHeaderExpanded: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: `2px solid ${colors.accent}` },
  blockHeaderLeft: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  blockIcon: { fontSize: '1.3rem' },
  blockTitle: { fontSize: '1rem', fontWeight: 600 },
  blockHeaderRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  availableBadge: { fontSize: '0.8rem', color: colors.available, fontWeight: 600, padding: '0.2rem 0.6rem', backgroundColor: `${colors.available}15`, borderRadius: '12px' },
  expandIcon: { fontSize: '0.8rem', color: colors.textMuted },
  blockContent: { border: `2px solid ${colors.border}`, borderTop: 'none', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', overflow: 'hidden' },
  shiftRow: { display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '1rem', padding: '1rem 1.25rem', borderBottom: `1px solid ${colors.border}30`, alignItems: 'start' },
  shiftTimeCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', minWidth: '70px', paddingTop: '0.25rem' },
  shiftTime: { fontSize: '0.9rem', fontWeight: 700, color: colors.text, whiteSpace: 'nowrap' },
  shiftTimeTo: { fontSize: '0.7rem', color: colors.textMuted },
  roleColumn: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  roleHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  roleLabel: { fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%' },
  championsList: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  championChip: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.6rem', backgroundColor: `${colors.accent}15`, borderRadius: '8px', fontSize: '0.85rem', color: colors.text, border: `1px solid ${colors.accent}40` },
  removeChip: { background: 'none', border: 'none', color: colors.error, cursor: 'pointer', fontSize: '0.8rem', padding: '0 0.2rem', lineHeight: 1 },
  openSlotButton: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem', backgroundColor: 'transparent', borderRadius: '8px', border: `2px dashed ${colors.accent}60`, color: colors.accent, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
  openSlotPlus: { fontSize: '1rem', fontWeight: 700 },
  footer: { textAlign: 'center', padding: '2rem 1rem', borderTop: `1px solid ${colors.border}30` },
  footerAdminButton: { background: 'none', border: 'none', color: colors.textMuted, fontSize: '0.8rem', cursor: 'pointer', padding: '0.5rem 1rem', opacity: 0.6 },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { backgroundColor: colors.bgSecondary, borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '85vh', overflow: 'auto', border: `2px solid ${colors.border}` },
  modalTitle: { fontSize: '1.3rem', fontWeight: 700, color: colors.title, marginBottom: '1rem', marginTop: 0 },
  formGroup: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.85rem', color: colors.textMuted, marginBottom: '0.4rem', fontWeight: 600 },
  input: { width: '100%', padding: '0.7rem 1rem', borderRadius: '10px', border: `2px solid ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontSize: '1rem', boxSizing: 'border-box', outline: 'none' },
  errorText: { color: colors.error, fontSize: '0.85rem', marginTop: '0.3rem', display: 'block' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' },
  primaryButton: { padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', backgroundColor: colors.accent, color: colors.onAccent, fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },
  secondaryButton: { padding: '0.6rem 1.25rem', borderRadius: '10px', border: `2px solid ${colors.border}`, backgroundColor: 'transparent', color: colors.text, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
  dangerButton: { padding: '0.6rem 1.25rem', borderRadius: '10px', border: `2px solid ${colors.error}`, backgroundColor: 'transparent', color: colors.error, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' },
  bottomSheet: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: colors.bgSecondary, borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '1rem 1.5rem 2rem', zIndex: 1001, maxHeight: '80vh', overflow: 'auto', boxShadow: `0 -4px 20px ${colors.overlay}` },
  bottomSheetHandle: { width: '40px', height: '4px', backgroundColor: colors.border, borderRadius: '2px', margin: '0 auto 1rem' },
  bottomSheetHeader: { textAlign: 'center', marginBottom: '1rem' },
  bottomSheetTitle: { fontSize: '1.1rem', fontWeight: 700, color: colors.title },
  bottomSheetSubtitle: { fontSize: '0.95rem', color: colors.textMuted, marginTop: '0.25rem' },
  bottomSheetRole: { display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.5rem' },
  techWarning: { backgroundColor: `${colors.techAccent}15`, color: colors.techAccent, padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 },
  bottomSheetRulesError: { backgroundColor: `${colors.error}15`, color: colors.error, padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 },
  bottomSheetForm: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  bottomSheetInput: { width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '2px solid', backgroundColor: colors.bg, color: colors.text, fontSize: '1rem', boxSizing: 'border-box', outline: 'none' },
  bottomSheetError: { color: colors.error, fontSize: '0.8rem', marginTop: '0.25rem' },
  bottomSheetActions: { display: 'flex', gap: '0.75rem', marginTop: '0.5rem' },
  bottomSheetCancel: { flex: 1, padding: '0.75rem', borderRadius: '12px', border: `2px solid ${colors.border}`, backgroundColor: 'transparent', color: colors.text, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  bottomSheetSubmit: { flex: 2, padding: '0.75rem', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' },
  myShiftsBar: { maxWidth: '1000px', margin: '0.75rem auto 0.25rem', padding: '0 1.5rem', textAlign: 'center' },
  myShiftsButton: { padding: '0.6rem 1.5rem', borderRadius: '10px', border: `2px solid ${colors.accent}`, backgroundColor: `${colors.accent}10`, color: colors.accent, fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', width: '100%', maxWidth: '400px' },
});
