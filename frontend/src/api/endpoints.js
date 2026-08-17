import api from "./axios";

export const AuthAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

export const UserAPI = {
  updateProfile: (data) => api.put("/users/profile", data),
  updateGoals: (data) => api.put("/users/goals", data),
  updateNotificationPrefs: (data) => api.put("/users/notifications/prefs", data),
  changePassword: (data) => api.put("/users/password", data),
  toggleEmergencySupport: (enabled) => api.put("/users/emergency-support/toggle", { enabled }),
  addTrustedContact: (data) => api.post("/users/trusted-contacts", data),
  removeTrustedContact: (id) => api.delete(`/users/trusted-contacts/${id}`),
};

export const MoodAPI = {
  create: (data) => api.post("/mood", data),
  list: (period) => api.get("/mood", { params: { period } }),
  heatmap: (year) => api.get("/mood/heatmap", { params: { year } }),
  update: (id, data) => api.put(`/mood/${id}`, data),
  remove: (id) => api.delete(`/mood/${id}`),
};

export const JournalAPI = {
  create: (data) => api.post("/journal", data),
  list: (period) => api.get("/journal", { params: { period } }),
  getOne: (id) => api.get(`/journal/${id}`),
  update: (id, data) => api.put(`/journal/${id}`, data),
  remove: (id) => api.delete(`/journal/${id}`),
  analyze: (id) => api.post(`/journal/${id}/analyze`),
};

export const SleepAPI = {
  create: (data) => api.post("/sleep", data),
  list: (period) => api.get("/sleep", { params: { period } }),
  update: (id, data) => api.put(`/sleep/${id}`, data),
  remove: (id) => api.delete(`/sleep/${id}`),
};

export const StressAPI = {
  create: (data) => api.post("/stress", data),
  list: (period) => api.get("/stress", { params: { period } }),
  update: (id, data) => api.put(`/stress/${id}`, data),
  remove: (id) => api.delete(`/stress/${id}`),
};

export const ExerciseAPI = {
  create: (data) => api.post("/exercise", data),
  list: (period) => api.get("/exercise", { params: { period } }),
  remove: (id) => api.delete(`/exercise/${id}`),
};

export const WaterAPI = {
  log: (amountMl) => api.post("/water", { amountMl }),
  today: () => api.get("/water/today"),
  history: (period) => api.get("/water", { params: { period } }),
};

export const HabitAPI = {
  create: (data) => api.post("/habits", data),
  list: () => api.get("/habits"),
  toggle: (id) => api.post(`/habits/${id}/toggle`),
  archive: (id) => api.delete(`/habits/${id}`),
};

export const ChatAPI = {
  send: (message, history) => api.post("/chat", { message, history }),
};

export const AnalyticsAPI = {
  dashboard: (period) => api.get("/analytics/dashboard", { params: { period } }),
  weeklySummary: () => api.get("/analytics/weekly-summary"),
};

export const NotificationAPI = {
  list: () => api.get("/notifications"),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all"),
  remove: (id) => api.delete(`/notifications/${id}`),
};

export const AdminAPI = {
  users: (params) => api.get("/admin/users", { params }),
  setUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  analytics: () => api.get("/admin/analytics"),
  moderateJournal: (id, action) => api.put(`/admin/journal/${id}/moderate`, { action }),
  report: () => api.get("/admin/reports"),
};
