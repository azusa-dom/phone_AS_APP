export const safeParse = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const safeStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
};

export const getLocal = (key, fallback = null) => {
  try {
    const v = window.localStorage.getItem(key);
    return v ? safeParse(v, fallback) : fallback;
  } catch {
    return fallback;
  }
};

export const setLocal = (key, value) => {
  try {
    window.localStorage.setItem(key, safeStringify(value));
  } catch {}
};

export const removeLocal = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {}
};


