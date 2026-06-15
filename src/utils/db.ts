import { hashPassword } from './crypto';

export interface UserProfile {
  name: string;
  phone: string;
  email?: string;
  parentPhone?: string;
  country: 'EG' | 'SA';
  location: string; // Governorate or Region
  gender: 'male' | 'female';
  stage?: 'middle' | 'high';
  grade?: string;
  passwordHash: string;
  role: 'student' | 'teacher' | 'admin';
  specialty?: string; // For teachers
  studentCode?: string; // Random unmodifiable 8-digit numeric student code
  isBanned?: boolean; // Blocked students capability
  subject?: string;
  subjects?: string[];
  grades?: string[];
  supportPhones?: string[];
  nationality?: string;
  curriculum?: string;
  currency?: 'EGP' | 'SAR';
  cardImage?: string;
  pageImage?: string;
  socialLinks?: {
    facebook?: { url: string; isVisible: boolean };
    youtube?: { url: string; isVisible: boolean };
    tiktok?: { url: string; isVisible: boolean };
    whatsapp?: { url: string; isVisible: boolean };
    telegram?: { url: string; isVisible: boolean };
  };
  lastPasswordChange?: string; // ISO string
  authorizedDevices?: string[]; // List of unique device/browser IDs
  teacherCode?: string;
  status?: 'active' | 'suspended';
  createdAt?: string;
  adminNote?: string;
}

/**
 * Generates an 8-digit unique student code consisting of numbers (0-9) only.
 */
export function generateUniqueStudentCode(existingCodes: Set<string>): string {
  let isUnique = false;
  let code = '';
  let iterations = 0;
  while (!isUnique && iterations < 1000) {
    iterations++;
    code = '';
    for (let i = 0; i < 8; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    if (!existingCodes.has(code)) {
      isUnique = true;
    }
  }
  return code;
}

export interface SecurityLog {
  timestamp: string;
  phone: string;
  event: 'login_success' | 'login_failed' | 'multiple_clicks' | 'ip_blocked' | 'logout';
  ip?: string;
  role?: string;
}

// Initial default seed credentials (hashed on load)
const DEFAULT_STUDENTS = [
  {
    name: "أحمد بن محمد بن محمود رجب",
    phone: "01111111111",
    parentPhone: "01222222222",
    country: "EG" as const,
    location: "القاهرة",
    gender: "male" as const,
    stage: "high" as const,
    grade: "الصف الثالث الثانوي",
    plainPassword: "123456",
    role: "student" as const
  },
  {
    name: "سليمان عبد الرحمن فهد العصيمي",
    phone: "0512345678",
    parentPhone: "0598765432",
    country: "SA" as const,
    location: "الرياض",
    gender: "male" as const,
    stage: "high" as const,
    grade: "الصف الثالث الثانوي - مسارات",
    plainPassword: "123456",
    role: "student" as const
  }
];

const DEFAULT_TEACHERS = [
  {
    name: "أ. أحمد سامي",
    phone: "01234567890",
    country: "EG" as const,
    location: "القاهرة",
    gender: "male" as const,
    plainPassword: "teacher",
    role: "teacher" as const,
    specialty: "الفيزياء - الثانوية العامة والمسارات"
  },
  {
    name: "أ. فهد العتيبي",
    phone: "0555555555",
    country: "SA" as const,
    location: "الرياض",
    gender: "male" as const,
    plainPassword: "teacher",
    role: "teacher" as const,
    specialty: "الرياضيات والقدرات والتحصيلي"
  }
];

const DEFAULT_ADMINS = [
  {
    name: "المهندس أحمد صالح (مدير المنصة)",
    phone: "01010101010",
    country: "EG" as const,
    location: "القاهرة",
    gender: "male" as const,
    plainPassword: "admin",
    role: "admin" as const
  }
];

/**
 * Perform asynchronous database seeding with SHA-256 secure hashes.
 */
export async function seedDatabaseIfNeeded() {
  const check = localStorage.getItem('sanad_db_seeded_v4');
  if (check === 'true') {
    return;
  }

  // Clear all demo data and statistics
  const keysToClear = [
    'sanad_custom_courses_db',
    'sanad_modules_config_db',
    'sanad_videos_config_db',
    'sanad_handouts_config_db',
    'sanad_tasks_config_db',
    'sanad_questions_config_db',
    'sanad_notifications',
    'sanad_counseling_questions',
    'sanad_staff_members',
    'sanad_security_logs'
  ];

  for (const k of keysToClear) {
    localStorage.removeItem(k);
  }

  // Clear student custom progress databases
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('sanad_student_watch_') ||
        key.startsWith('sanad_student_scores_') ||
        key.startsWith('sanad_purchased_') ||
        key.startsWith('sanad_student_discussions_') ||
        key.startsWith('sanad_wallet_')
      )) {
        keys.push(key);
      }
    }
    for (const key of keys) {
      localStorage.removeItem(key);
    }
  } catch (err) {
    console.error('Error clearing storage keys:', err);
  }

  // Reset default credit balances for the seeded accounts
  localStorage.setItem('sanad_wallet_أحمد بن محمد بن محمود رجب', '150');
  localStorage.setItem('sanad_wallet_سليمان عبد الرحمن فهد العصيمي', '150');

  const seededUsers: UserProfile[] = [];
  const existingCodes = new Set<string>();

  // Seed Admin Accounts
  for (const admin of DEFAULT_ADMINS) {
    const hash = await hashPassword(admin.plainPassword);
    seededUsers.push({
      name: admin.name,
      phone: admin.phone,
      country: admin.country,
      location: admin.location,
      gender: admin.gender,
      passwordHash: hash,
      role: 'admin'
    });
  }

  // Seed Teachers
  for (const teacher of DEFAULT_TEACHERS) {
    const hash = await hashPassword(teacher.plainPassword);
    seededUsers.push({
      name: teacher.name,
      phone: teacher.phone,
      country: teacher.country,
      location: teacher.location,
      gender: teacher.gender,
      passwordHash: hash,
      role: 'teacher',
      specialty: teacher.specialty
    });
  }

  // Seed Students
  for (const student of DEFAULT_STUDENTS) {
    const hash = await hashPassword(student.plainPassword);
    const code = generateUniqueStudentCode(existingCodes);
    existingCodes.add(code);
    seededUsers.push({
      name: student.name,
      phone: student.phone,
      email: student.phone + '@gmail.com',
      parentPhone: student.parentPhone,
      country: student.country,
      location: student.location,
      gender: student.gender,
      stage: student.stage,
      grade: student.grade,
      passwordHash: hash,
      role: 'student',
      studentCode: code,
      lastPasswordChange: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString() // Seed as 31 days ago to allow initial change
    });
  }

  localStorage.setItem('sanad_users_db', JSON.stringify(seededUsers));
  localStorage.setItem('sanad_db_seeded_v4', 'true');
  
  // Seed initial failed attempts log tracker
  localStorage.setItem('sanad_security_logs', JSON.stringify([]));
}

/**
 * Retrieve all registered users of any role. Matches/migrates missing student unique codes and teacher administrative fields automatically on retrieval.
 */
export function getAllUsers(): UserProfile[] {
  const raw = localStorage.getItem('sanad_users_db');
  if (!raw) return [];
  try {
    const users: UserProfile[] = JSON.parse(raw);
    let updated = false;
    const existingStudentCodes = new Set<string>();
    const existingTeacherCodes = new Set<string>();

    users.forEach(u => {
      if (u.studentCode) {
        existingStudentCodes.add(u.studentCode);
      }
      if (u.teacherCode) {
        existingTeacherCodes.add(u.teacherCode);
      }
    });

    const migratedUsers = users.map(u => {
      let changed = false;
      const newUser = { ...u };

      if (newUser.role === 'student' && !newUser.studentCode) {
        const code = generateUniqueStudentCode(existingStudentCodes);
        existingStudentCodes.add(code);
        newUser.studentCode = code;
        changed = true;
      }

      if (newUser.role === 'teacher') {
        if (!newUser.teacherCode) {
          let codeCandidate = '';
          let isUnique = false;
          let attempts = 0;
          while (!isUnique && attempts < 1000) {
            attempts++;
            const num = Math.floor(100000 + Math.random() * 900000);
            codeCandidate = `T-${num}`;
            if (!existingTeacherCodes.has(codeCandidate)) {
              isUnique = true;
            }
          }
          existingTeacherCodes.add(codeCandidate);
          newUser.teacherCode = codeCandidate;
          changed = true;
        }
        if (!newUser.createdAt) {
          // default date
          newUser.createdAt = "2026-06-11";
          changed = true;
        }
        if (!newUser.status) {
          newUser.status = 'active';
          changed = true;
        }
        if (newUser.adminNote === undefined) {
          newUser.adminNote = '';
          changed = true;
        }
        if (!newUser.currency) {
          const cur = newUser.curriculum || '';
          if (cur.includes('مصر') || cur.includes('Egypt') || cur === 'المنهج المصري') {
            newUser.currency = 'EGP';
          } else if (cur.includes('سعود') || cur.includes('Saudi') || cur === 'المنهج السعودي') {
            newUser.currency = 'SAR';
          } else {
            newUser.currency = newUser.country === 'SA' ? 'SAR' : 'EGP';
          }
          changed = true;
        }
      }

      if (changed) {
        updated = true;
      }
      return newUser;
    });

    if (updated) {
      localStorage.setItem('sanad_users_db', JSON.stringify(migratedUsers));
      return migratedUsers;
    }

    return users;
  } catch {
    return [];
  }
}

/**
 * Update a user's details (Admin operation).
 */
export function updateUserByAdmin(phone: string, updatedData: Partial<UserProfile>): boolean {
  const users = getAllUsers();
  const index = users.findIndex(u => u.phone === phone);
  if (index === -1) return false;
  users[index] = { ...users[index], ...updatedData };
  localStorage.setItem('sanad_users_db', JSON.stringify(users));
  return true;
}

/**
 * Register a new student securely, storing they hashed password. Generates a guaranteed unmodifiable 8-digit random unique student code.
 */
export async function registerStudent(student: {
  name: string;
  phone: string;
  email: string;
  parentPhone: string;
  country: 'EG' | 'SA';
  location: string;
  gender: 'male' | 'female';
  stage: 'middle' | 'high';
  grade: string;
  passwordPlane: string;
}): Promise<{ success: boolean; error?: string }> {
  const users = getAllUsers();
  const exists = users.some(u => u.phone === student.phone);
  if (exists) {
    return { success: false, error: 'رقم هاتف الطالب مسجل بالفعل في منصة سند' };
  }

  const existingCodes = new Set<string>();
  users.forEach(u => {
    if (u.studentCode) {
      existingCodes.add(u.studentCode);
    }
  });
  
  const code = generateUniqueStudentCode(existingCodes);
  const hash = await hashPassword(student.passwordPlane);
  const newUser: UserProfile = {
    name: student.name,
    phone: student.phone,
    email: student.email,
    parentPhone: student.parentPhone,
    country: student.country,
    location: student.location,
    gender: student.gender,
    stage: student.stage,
    grade: student.grade,
    passwordHash: hash,
    role: 'student',
    studentCode: code,
    lastPasswordChange: new Date().toISOString(),
  };

  localStorage.setItem('sanad_users_db', JSON.stringify([...users, newUser]));
  return { success: true };
}

/**
 * Add a teacher account (Admin operation).
 */
export async function addTeacherByAdmin(teacher: {
  name: string;
  phone: string;
  country: 'EG' | 'SA';
  location: string;
  gender: 'male' | 'female';
  specialty: string;
  passwordPlane: string;
  subject?: string;
  subjects?: string[];
  grades?: string[];
  supportPhones?: string[];
  nationality?: string;
  curriculum?: string;
  currency?: 'EGP' | 'SAR';
  cardImage?: string;
  pageImage?: string;
  socialLinks?: {
    facebook?: { url: string; isVisible: boolean };
    youtube?: { url: string; isVisible: boolean };
    tiktok?: { url: string; isVisible: boolean };
    whatsapp?: { url: string; isVisible: boolean };
    telegram?: { url: string; isVisible: boolean };
  };
}): Promise<{ success: boolean; error?: string }> {
  const users = getAllUsers();
  const exists = users.some(u => u.phone === teacher.phone);
  if (exists) {
    return { success: false, error: 'رقم هاتف المدرس مسجل مسبقاً في النظام' };
  }

  // Generate a unique teacherCode
  const existingTeacherCodes = new Set(users.map(u => u.teacherCode).filter(Boolean));
  let codeCandidate = '';
  let isUnique = false;
  let attempts = 0;
  while (!isUnique && attempts < 1000) {
    attempts++;
    const num = Math.floor(100000 + Math.random() * 900000);
    codeCandidate = `T-${num}`;
    if (!existingTeacherCodes.has(codeCandidate)) {
      isUnique = true;
    }
  }

  const hash = await hashPassword(teacher.passwordPlane);
  const newTeacher: UserProfile = {
    name: teacher.name,
    phone: teacher.phone,
    country: teacher.country,
    location: teacher.location,
    gender: teacher.gender,
    passwordHash: hash,
    role: 'teacher',
    specialty: teacher.specialty,
    subject: teacher.subject,
    subjects: teacher.subjects,
    grades: teacher.grades,
    supportPhones: teacher.supportPhones,
    nationality: teacher.nationality,
    curriculum: teacher.curriculum,
    currency: teacher.currency,
    cardImage: teacher.cardImage,
    pageImage: teacher.pageImage,
    socialLinks: teacher.socialLinks,
    // Admin fields
    teacherCode: codeCandidate,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
    adminNote: ''
  };

  localStorage.setItem('sanad_users_db', JSON.stringify([...users, newTeacher]));
  return { success: true };
}

/**
 * Delete a user account (Admin operation).
 */
export function deleteUserByAdmin(phone: string): boolean {
  const users = getAllUsers();
  const filtered = users.filter(u => u.phone !== phone);
  localStorage.setItem('sanad_users_db', JSON.stringify(filtered));
  return true;
}

/**
 * Tracking login security attempts and logs
 */
export function getSecurityLogs(): SecurityLog[] {
  const raw = localStorage.getItem('sanad_security_logs');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addSecurityLog(log: Omit<SecurityLog, 'timestamp'>) {
  const logs = getSecurityLogs();
  const newLog: SecurityLog = {
    ...log,
    timestamp: new Date().toISOString()
  };
  // Cap at 100 logs for memory performance
  const updatedLogs = [newLog, ...logs].slice(0, 100);
  localStorage.setItem('sanad_security_logs', JSON.stringify(updatedLogs));
}

/**
 * Reset user password (Admin operation)
 */
export async function resetUserPassword(phone: string, newPasswordPlane: string): Promise<boolean> {
  const users = getAllUsers();
  const index = users.findIndex(u => u.phone === phone);
  if (index === -1) return false;
  
  const hash = await hashPassword(newPasswordPlane);
  users[index].passwordHash = hash;
  users[index].lastPasswordChange = new Date().toISOString(); 
  localStorage.setItem('sanad_users_db', JSON.stringify(users));
  return true;
}

/**
 * Password Reset System Logic
 */
export interface PasswordResetToken {
  token: string;
  phone: string;
  expires: string;
  used: boolean;
}

export function getResetTokens(): PasswordResetToken[] {
  const raw = localStorage.getItem('sanad_reset_tokens');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveResetTokens(tokens: PasswordResetToken[]) {
  localStorage.setItem('sanad_reset_tokens', JSON.stringify(tokens));
}

/**
 * Validates the 30-day password change policy.
 */
export function canChangePassword(user: UserProfile): { can: boolean; lastChange?: string; daysRemaining?: number } {
  if (!user.lastPasswordChange) return { can: true };
  
  const lastChange = new Date(user.lastPasswordChange);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastChange.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return { 
      can: false, 
      lastChange: user.lastPasswordChange,
      daysRemaining: 30 - diffDays
    };
  }
  
  return { can: true };
}

/**
 * Verifies matching triple identifiers (Phone, Parent Phone, Email)
 */
export function verifyResetIdentity(studentPhone: string, parentPhone: string, email: string): UserProfile | null {
  const users = getAllUsers();
  const found = users.find(u => 
    u.phone === studentPhone && 
    u.parentPhone === parentPhone && 
    u.email.toLowerCase() === email.toLowerCase() &&
    u.role === 'student'
  );
  return found || null;
}

/**
 * Initiates reset by generating a one-time secure link (simulation)
 */
export async function initiatePasswordReset(studentPhone: string, parentPhone: string, email: string): Promise<{ success: boolean; token?: string; error?: string }> {
  const user = verifyResetIdentity(studentPhone, parentPhone, email);
  if (!user) {
    return { success: false, error: 'البيانات المدخلة غير متطابقة مع أي حساب مسجل' };
  }

  // Check 30-day policy
  const policy = canChangePassword(user);
  if (!policy.can) {
    const lastDate = new Date(policy.lastChange!).toLocaleDateString('ar-EG');
    return { 
      success: false, 
      error: `لا يمكن تغيير كلمة المرور حالياً. آخر تغيير كان في ${lastDate}. يرجى المحاولة بعد مرور 30 يوم.` 
    };
  }

  // Generate Token
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiration = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(); // 1 hour

  const tokens = getResetTokens();
  const newToken: PasswordResetToken = {
    token,
    phone: studentPhone,
    expires: expiration,
    used: false
  };

  saveResetTokens([...tokens, newToken]);
  
  // In a real system, we'd send an email here.
  console.log(`[SIMULATION] Password Reset Link for ${email}: https://sanad.platform/reset-password?token=${token}`);
  
  return { success: true, token };
}

/**
 * Completes the reset with a new password
 */
export async function completePasswordReset(token: string, newPasswordPlane: string): Promise<{ success: boolean; error?: string }> {
  const tokens = getResetTokens();
  const tokenIdx = tokens.findIndex(t => t.token === token && !t.used);
  
  if (tokenIdx === -1) {
    return { success: false, error: 'رابط إعادة التعيين غير صالح أو تم استخدامه من قبل' };
  }

  const tokenData = tokens[tokenIdx];
  if (new Date() > new Date(tokenData.expires)) {
    return { success: false, error: 'انتهت صلاحية رابط إعادة التعيين' };
  }

  const users = getAllUsers();
  const userIdx = users.findIndex(u => u.phone === tokenData.phone);
  
  if (userIdx === -1) {
    return { success: false, error: 'فشل في العثور على المستخدم' };
  }

  // Update Password
  const hash = await hashPassword(newPasswordPlane);
  users[userIdx].passwordHash = hash;
  users[userIdx].lastPasswordChange = new Date().toISOString();
  
  // Update tokens
  tokens[tokenIdx].used = true;
  saveResetTokens(tokens);
  
  // Save Users
  localStorage.setItem('sanad_users_db', JSON.stringify(users));
  
  addSecurityLog({
    phone: tokenData.phone,
    event: 'login_success', // Re-using event type for simplicity or adding a new one
    role: 'student'
  });

  return { success: true };
}
