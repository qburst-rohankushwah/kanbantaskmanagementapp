import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import useLocalStorage, {
  readStorage,
  writeStorage,
  removeStorage,
} from "../useLocalStorage";

describe("useLocalStorage utilities", () => {
  const testKey = "test-item";
  const testValue = { data: "hello" };
  const stringifiedValue = JSON.stringify(testValue);

  let localStorageMock;
  let dispatchEventSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    let store = {};
    localStorageMock = {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => { store[key] = value; }),
      removeItem: vi.fn((key) => { delete store[key]; }),
      clear: vi.fn(() => { store = {}; }),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    dispatchEventSpy = vi.spyOn(window, "dispatchEvent");
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("readStorage", () => {
    it("returns fallbackValue if item does not exist in localStorage", () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      const result = readStorage(testKey, "fallback");
      expect(localStorageMock.getItem).toHaveBeenCalledWith(testKey);
      expect(result).toBe("fallback");
    });

    it("returns parsed JSON value if item exists", () => {
      localStorageMock.getItem.mockReturnValueOnce(stringifiedValue);
      const result = readStorage(testKey, "fallback");
      expect(localStorageMock.getItem).toHaveBeenCalledWith(testKey);
      expect(result).toEqual(testValue);
    });

    it("returns fallbackValue and logs error if JSON parsing fails", () => {
      localStorageMock.getItem.mockReturnValueOnce("invalid json");
      const result = readStorage(testKey, "fallback");
      expect(localStorageMock.getItem).toHaveBeenCalledWith(testKey);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result).toBe("fallback");
    });

    it("returns fallbackValue and logs error if localStorage.getItem throws", () => {
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error("getItem error");
      });
      const result = readStorage(testKey, "fallback");
      expect(localStorageMock.getItem).toHaveBeenCalledWith(testKey);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result).toBe("fallback");
    });
  });

  describe("writeStorage", () => {
    it("calls localStorage.setItem with stringified value", () => {
      writeStorage(testKey, testValue);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        testKey,
        stringifiedValue,
      );
    });

    it("dispatches a custom 'local-storage' event", () => {
      writeStorage(testKey, testValue);
      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "local-storage",
          detail: { key: testKey },
        }),
      );
    });

    it("logs error if localStorage.setItem throws", () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error("setItem error");
      });
      writeStorage(testKey, testValue);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("removeStorage", () => {
    it("calls localStorage.removeItem", () => {
      removeStorage(testKey);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(testKey);
    });

    it("dispatches a custom 'local-storage' event", () => {
      removeStorage(testKey);
      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "local-storage",
          detail: { key: testKey },
        }),
      );
    });

    it("logs error if localStorage.removeItem throws", () => {
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error("removeItem error");
      });
      removeStorage(testKey);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});

describe("useLocalStorage hook", () => {
  const hookKey = "hook-item";
  const initialValue = "initial";
  const newValue = "updated";

  let localStorageMock;

  beforeEach(() => {
    let store = {};
    localStorageMock = {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => { store[key] = value; }),
      removeItem: vi.fn((key) => { delete store[key]; }),
      clear: vi.fn(() => { store = {}; }),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
    vi.clearAllMocks();
  });

  it("initializes with initialValue if localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage(hookKey, initialValue));
    expect(result.current.value).toBe(initialValue);
  });

  it("initializes with localStorage value if present", () => {
    localStorageMock.setItem(hookKey, JSON.stringify(newValue));
    const { result } = renderHook(() => useLocalStorage(hookKey, initialValue));
    expect(result.current.value).toBe(newValue);
  });

  it("saveValue updates state and localStorage", () => {
    const { result } = renderHook(() => useLocalStorage(hookKey, initialValue));

    act(() => {
      result.current.saveValue(newValue);
    });

    expect(result.current.value).toBe(newValue);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      hookKey,
      JSON.stringify(newValue),
    );
  });

  it("saveValue handles functional updates", () => {
    localStorageMock.setItem(hookKey, JSON.stringify("old"));
    const { result } = renderHook(() => useLocalStorage(hookKey, "old"));

    act(() => {
      result.current.saveValue((prev) => prev + "-new");
    });

    expect(result.current.value).toBe("old-new");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      hookKey,
      JSON.stringify("old-new"),
    );
  });

  it("removeValue resets state to initialValue and removes from localStorage", () => {
    localStorageMock.setItem(hookKey, JSON.stringify(newValue));
    const { result } = renderHook(() => useLocalStorage(hookKey, initialValue));

    act(() => {
      result.current.removeValue();
    });

    expect(result.current.value).toBe(initialValue);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(hookKey);
  });

  it("readValue returns the current value from localStorage", () => {
    localStorageMock.setItem(hookKey, JSON.stringify(newValue));
    const { result } = renderHook(() => useLocalStorage(hookKey, initialValue));

    expect(result.current.readValue()).toBe(newValue);
  });

  it("updates value when 'local-storage' event is dispatched for the same key", () => {
    localStorageMock.setItem(hookKey, JSON.stringify("initial"));
    const { result } = renderHook(() => useLocalStorage(hookKey, "initial"));

    expect(result.current.value).toBe("initial");

    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify("external update"));
    act(() => {
      window.dispatchEvent(new CustomEvent("local-storage", { detail: { key: hookKey } }));
    });

    expect(result.current.value).toBe("external update");
  });

  it("does not update value when 'local-storage' event is dispatched for a different key", () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify("initial"));
    const { result } = renderHook(() => useLocalStorage(hookKey, "initial"));

    expect(result.current.value).toBe("initial");

    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify("external update"));
    act(() => {
      window.dispatchEvent(new CustomEvent("local-storage", { detail: { key: "other-key" } }));
    });

    expect(result.current.value).toBe("initial"); // Should not change
  });

  it("cleans up event listeners on unmount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useLocalStorage(hookKey, initialValue));

    expect(addEventListenerSpy).toHaveBeenCalledWith("storage", expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith("local-storage", expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("storage", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("local-storage", expect.any(Function));
  });
});