export function isAuthenticated(): boolean {
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

export function isUnauthorizedError(error: any): boolean {
  return error?.status === 401 || error?.message?.includes('Unauthorized');
}