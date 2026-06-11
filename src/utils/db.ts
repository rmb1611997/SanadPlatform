import { hashPassword } from './crypto';

export interface UserProfile {
  name: string;
  phone: string;
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
      parentPhone: student.parentPhone,
      country: student.country,
      location: student.location,
      gender: student.gender,
      stage: student.stage,
      grade: student.grade,
      passwordHash: hash,
      role: 'student',
      studentCode: code
    });
  }

  localStorage.setItem('sanad_users_db', JSON.stringify(seededUsers));
  localStorage.setItem('sanad_db_seeded_v4', 'true');
  
  // Seed initial failed attempts log tracker
  localStorage.setItem('sanad_security_logs', JSON.stringify([]));
}

/**
 * Retrieve all registered users of any role. Matches/migrates missing student unique codes automatically on retrieval.
 */
export function getAllUsers(): UserProfile[] {
  const raw = localStorage.getItem('sanad_users_db');
  if (!raw) return [];
  try {
    const users: UserProfile[] = JSON.parse(raw);
    let updated = false;
    const existingCodes = new Set<string>();

    // First draft: extract all non-empty student codes
    users.forEach(u => {
      if (u.studentCode) {
        existingCodes.add(u.studentCode);
      }
    });

    // Check if any student needs a new code
    const migratedUsers = users.map(u => {
      if (u.role === 'student' && !u.studentCode) {
        const code = generateUniqueStudentCode(existingCodes);
        existingCodes.add(code);
        updated = true;
        return { ...u, studentCode: code };
      }
      return u;
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
 * Register a new student securely, storing they hashed password. Generates a guaranteed unmodifiable 8-digit random unique student code.
 */
export async function registerStudent(student: {
  name: string;
  phone: string;
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
    parentPhone: student.parentPhone,
    country: student.country,
    location: student.location,
    gender: student.gender,
    stage: student.stage,
    grade: student.grade,
    passwordHash: hash,
    role: 'student',
    studentCode: code
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
}): Promise<{ success: boolean; error?: string }> {
  const users = getAllUsers();
  const exists = users.some(u => u.phone === teacher.phone);
  if (exists) {
    return { success: false, error: 'رقم هاتف المدرس مسجل مسبقاً في النظام' };
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
    specialty: teacher.specialty
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
  localStorage.setItem('sanad_users_db', JSON.stringify(users));
  return true;
}
