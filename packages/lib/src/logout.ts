/**
 * Shared logout utility function
 * Clears all localStorage data and redirects to login page
 */
export const logout = (redirectPath = "/login") => {
  // Clear all localStorage data (including accessToken, refreshToken, etc.)
  localStorage.clear();

  // Redirect to login page
  window.location.href = redirectPath;
};

export default logout;
