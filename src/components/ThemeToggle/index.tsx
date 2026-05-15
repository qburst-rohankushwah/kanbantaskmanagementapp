import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { DarkThemeIcon } from "../../assets/Icons/DarkTheme";
import { LightThemeIcon } from "../../assets/Icons/LightTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
      style={{ backgroundColor: "var(--border)", color: "var(--text)" }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        // Moon icon for dark mode
        <DarkThemeIcon />
      ) : (
        // Sun icon for light mode
        <LightThemeIcon />
      )}
    </button>
  );
};

export default ThemeToggle;
