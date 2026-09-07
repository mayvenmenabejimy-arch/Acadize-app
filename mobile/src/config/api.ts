import AsyncStorage from '@react-native-async-storage/async-storage';

// Default production URL of the Acadize platform (Express backend hosted on Render)
export const DEFAULT_API_URL = 'https://eduverse-20jy.onrender.com/api';
export const DEFAULT_TENANT_SUBDOMAIN = 'default';

const STORAGE_API_URL_KEY = '@acadize_custom_api_url';
const STORAGE_TENANT_KEY = '@acadize_tenant_subdomain';

let currentApiUrl = DEFAULT_API_URL;
let currentTenantSubdomain = DEFAULT_TENANT_SUBDOMAIN;

// Initialize custom URL from storage if user customized it (e.g., local dev)
export const initApiConfig = async () => {
  try {
    const savedUrl = await AsyncStorage.getItem(STORAGE_API_URL_KEY);
    if (savedUrl) {
      currentApiUrl = savedUrl;
    }
    const savedTenant = await AsyncStorage.getItem(STORAGE_TENANT_KEY);
    if (savedTenant) {
      currentTenantSubdomain = savedTenant;
    }
  } catch (error) {
    console.warn('Failed to load custom API URL from storage:', error);
  }
};

export const getApiUrl = (): string => currentApiUrl;
export const getTenantSubdomain = (): string => currentTenantSubdomain;

export const setApiUrl = async (newUrl: string) => {
  currentApiUrl = newUrl.trim().replace(/\/$/, ''); // Remove trailing slash
  await AsyncStorage.setItem(STORAGE_API_URL_KEY, currentApiUrl);
};

export const setTenantSubdomain = async (subdomain: string) => {
  currentTenantSubdomain = subdomain.trim().toLowerCase();
  await AsyncStorage.setItem(STORAGE_TENANT_KEY, currentTenantSubdomain);
};

export const resetApiConfig = async () => {
  currentApiUrl = DEFAULT_API_URL;
  currentTenantSubdomain = DEFAULT_TENANT_SUBDOMAIN;
  await AsyncStorage.removeItem(STORAGE_API_URL_KEY);
  await AsyncStorage.removeItem(STORAGE_TENANT_KEY);
};

// API Endpoint builder matching Acadize server routes
export const endpoints = {
  // Auth
  login: () => `${getApiUrl()}/auth/login`,
  register: () => `${getApiUrl()}/auth/register`,
  refresh: () => `${getApiUrl()}/auth/refresh`,
  me: () => `${getApiUrl()}/profile/me`,

  // Courses & Enrollments
  courses: () => `${getApiUrl()}/courses`,
  userCourses: () => `${getApiUrl()}/courses/user`,
  courseDetails: (id: string | number) => `${getApiUrl()}/courses/${id}`,
  courseLessons: (courseId: string | number) => `${getApiUrl()}/courses/${courseId}/lessons`,
  joinPreview: (code: string) => `${getApiUrl()}/enrollments/join/preview?joinCode=${encodeURIComponent(code)}`,
  joinCourse: () => `${getApiUrl()}/enrollments/join`,

  // Subscriptions & Paymob
  subscriptionStatus: () => `${getApiUrl()}/subscription/status`,
  checkSubscription: () => `${getApiUrl()}/subscription/check-subscription`,
  validatePromo: () => `${getApiUrl()}/subscription/validate-promo`,
  activateTrial: () => `${getApiUrl()}/subscription/activate-trial`,
  activateFreeTrial: () => `${getApiUrl()}/subscription/activate-free-trial`,
  checkout: () => `${getApiUrl()}/subscription/checkout`,

  // Student & Dashboard
  studentDashboard: () => `${getApiUrl()}/student/dashboard`,
  studentAttendance: () => `${getApiUrl()}/attendance/my`,
  studentAssignments: () => `${getApiUrl()}/assignments/student`,
  scanAttendance: () => `${getApiUrl()}/attendance/scan`,
  announcements: () => `${getApiUrl()}/announcements`,

  // Teacher Endpoints
  teacherCourses: () => `${getApiUrl()}/courses/user`,
  teacherAssignments: () => `${getApiUrl()}/assignments/teacher`,
  teacherExams: () => `${getApiUrl()}/teacher/exams`,
  teacherSessions: () => `${getApiUrl()}/sessions`,

  // Parent Endpoints
  parentOverview: () => `${getApiUrl()}/parent/dashboard/overview`,
  parentChildren: () => `${getApiUrl()}/parent/children`,
  parentChildGrades: (childId: string | number) => `${getApiUrl()}/parent/children/${childId}/grades`,
  parentChildAttendance: (childId: string | number) => `${getApiUrl()}/parent/children/${childId}/attendance`,
  parentChildAssignments: (childId: string | number) => `${getApiUrl()}/parent/children/${childId}/assignments`,

  // Notifications (matching server/src/api/notifications.routes.ts)
  notifications: (unreadOnly = false) => `${getApiUrl()}/notifications?unreadOnly=${unreadOnly}`,
  notificationsUnreadCount: () => `${getApiUrl()}/notifications/unread-count`,
  markNotificationRead: (id: string | number) => `${getApiUrl()}/notifications/${id}/read`,
  markAllNotificationsRead: () => `${getApiUrl()}/notifications/read-all`,

  // AI Study Buddy (Versa)
  aiPersonas: () => `${getApiUrl()}/ai-chat/personas`,
  aiMessage: () => `${getApiUrl()}/ai-chat/message`,

  // Admin APIs (matching server/src/api/admin.routes.ts & admin-gamification.routes.ts)
  adminStats: () => `${getApiUrl()}/admin/stats`,
  adminUserStats: () => `${getApiUrl()}/admin/stats/users`,
  adminAnalytics: () => `${getApiUrl()}/admin/analytics`,
  adminUsers: (params = '') => `${getApiUrl()}/admin/users${params ? '?' + params : ''}`,
  adminUserDetail: (id: string | number) => `${getApiUrl()}/admin/users/${id}`,
  adminUserStatus: (id: string | number) => `${getApiUrl()}/admin/users/${id}/status`,
  adminReports: (status = 'pending') => `${getApiUrl()}/admin/reports?status=${status}&limit=10`,
  adminGamificationRules: () => `${getApiUrl()}/admin/gamification/rules`,
  adminGamificationBadges: () => `${getApiUrl()}/admin/gamification/badges`,
  adminGamificationSettings: () => `${getApiUrl()}/admin/gamification/settings`,
};
