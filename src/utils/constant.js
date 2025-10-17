

//==================Admin===================//


const API_BASE = import.meta.env.VITE_API_URL || '';

//==================Admin===================//
export const ADMIN_AUTH_ENDPOINT = `${API_BASE}/api/v1/admin/auth`;
export const ADMIN_LEAVE_ENDPOINT = `${API_BASE}/api/v1/admin/leave`;
export const ADMIN_PROJECT_ENDPOINT = `${API_BASE}/api/v1/admin/project`;
export const ADMIN_PAYROLL_ENDPOINT = `${API_BASE}/api/v1/admin/payroll`;

//==================Employee===================//
export const EMPLOYEE_AUTH_ENDPOINT = `${API_BASE}/api/v1/employee/auth`;
export const EMPLOYEE_LEAVE_ENDPOINT = `${API_BASE}/api/v1/employee/leave`;

//==================Both===================//
export const BOTH_PROFILE_ENDPOINT = `${API_BASE}/api/v1/both/profile-details`;
export const BOTH_NOTIFICATION_ENDPOINT = `${API_BASE}/api/v1/both/notification`;
export const BOTH_ATTENDANCE_ENDPOINT = `${API_BASE}/api/v1/both/attendance`;
export const BOTH_DOCUMENT_ENDPOINT = `${API_BASE}/api/v1/both/document`;
export const BOTH_PASSWORD_ENDPOINT = `${API_BASE}/api/v1/both/password`;
export const BOTH_TASK_ENDPOINT = `${API_BASE}/api/v1/both/project-task`;





