export const storageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  try {
    const storage = window[type];
    const testItem = '__storage_test__';
    storage.setItem(testItem, testItem);
    storage.removeItem(testItem);
    return true;
  } catch (e) {
    return false;
  }
};

export const getCartFromStorage = (): any[] => {
  if (!storageAvailable('localStorage')) {
    console.warn('localStorage is not available');
    return [];
  }

  try {    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

export const saveCartToStorage = (cart: any[]): void => {
  if (!storageAvailable('localStorage')) {
    console.warn('localStorage is not available');
    return;
  }

  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};