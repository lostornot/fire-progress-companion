const SESSION_KEY = "fire-demo-session";

export function createDemoSession(provider: "google" | "apple") {
  const session = {
    provider,
    userId: "demo-user",
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function readDemoSession() {
  const raw = window.localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearDemoSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
