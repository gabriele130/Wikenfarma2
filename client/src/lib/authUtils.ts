export function isAuthenticated(): boolean {
  // Placeholder authentication check
  return true;
}

export function getCurrentUser() {
  return {
    id: "1",
    email: "user@example.com",
    role: "user"
  };
}

export function logout() {
  window.location.href = '/api/logout';
}