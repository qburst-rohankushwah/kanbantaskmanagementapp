import { useCallback, useEffect, useState } from "react";

const isBrowser = typeof window !== "undefined";

const readStorage = (key, fallbackValue) => {
  if (!isBrowser) return fallbackValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallbackValue;
  } catch (error) {
    console.error(`useLocalStorage read error for key:\n  ${key}`, error);
    return fallbackValue;
  }
};

const dispatchStorageUpdate = (key) => {
  if (!isBrowser) return;

  const event = new CustomEvent("local-storage", { detail: { key } });
  window.dispatchEvent(event);
};

const writeStorage = (key, value) => {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    dispatchStorageUpdate(key);
  } catch (error) {
    console.error(`useLocalStorage write error for key:\n  ${key}`, error);
  }
};

const removeStorage = (key) => {
  if (!isBrowser) return;

  try {
    window.localStorage.removeItem(key);
    dispatchStorageUpdate(key);
  } catch (error) {
    console.error(`useLocalStorage remove error for key:\n  ${key}`, error);
  }
};

const useLocalStorage = (key, initialValue = null) => {
  const [storedValue, setStoredValue] = useState(() => readStorage(key, initialValue));

  useEffect(() => {
    const handleStorageChange = (event) => {
      const eventKey = event?.key ?? event?.detail?.key;
      if (eventKey && eventKey !== key) return;
      setStoredValue(readStorage(key, initialValue));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
  }, [key, initialValue]);

  const saveValue = useCallback(
    (value) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      writeStorage(key, valueToStore);
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    removeStorage(key);
  }, [initialValue, key]);

  const readValue = useCallback(() => readStorage(key, initialValue), [key, initialValue]);

  return {
    value: storedValue,
    saveValue,
    removeValue,
    readValue,
  };
};

export default useLocalStorage;
export { readStorage, writeStorage, removeStorage };
