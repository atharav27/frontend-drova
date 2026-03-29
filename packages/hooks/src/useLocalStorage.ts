// Re-export localStorage utilities from @repo/lib for backward compatibility
export {
  getLocalStorageValue,
  setLocalStorageValue,
  removeLocalStorageValue,
  clearLocalStorage,
  getLocalStorageValue as default
} from '@repo/lib/localStorage';
