const LAST_LOGIN_METHOD_KEY = "lastLoginMethod";

export const setLastLoginMethod = (method: "github" | "google") =>
  localStorage.setItem(LAST_LOGIN_METHOD_KEY, method);

export const getLastLoginMethod = () =>
  localStorage.getItem(LAST_LOGIN_METHOD_KEY);
