const isBrowser = typeof window !== 'undefined';

const getLocalStorageValue = (key: string): string | null => {
  if (isBrowser) {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorageValue = (key: string, value: string): void => {
  if (isBrowser) {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorageValue = (key: string): void => {
  if (isBrowser) {
    localStorage.removeItem(key);
  }
};

const clearLocalStorage = (): void => {
  if (isBrowser) {
    localStorage.clear();
  }
};

export {
  getLocalStorageValue,
  setLocalStorageValue,
  removeLocalStorageValue,
  clearLocalStorage
};

// For backward compatibility
export default getLocalStorageValue;
