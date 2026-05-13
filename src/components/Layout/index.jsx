import React, { useMemo, useState } from "react";
import ThemeToggle from "../ThemeToggle";
import "./style.css";
import { MenuItems } from "./constant";

const Header = () => {
  const [selectedMenu, setSelectedMenu] = useState("Board");
 
  const menuItems = useMemo(() => {
    return (Array.isArray(MenuItems) ? MenuItems : []).map((item) => (
      <a
        key={item.name}
        href={item.href}
        onClick={() => setSelectedMenu(item.name)}
        className={`transition-colors hover:opacity-80 cursor-pointer ${selectedMenu === item.name ? "selectedMenu" : "nonSelectedMenu"}`}
      >
        {item.name}
      </a>
    ));
  }, [selectedMenu]);

  return (
    <header className="px-6 py-4 flex items-center justify-between transition-colors header">
      {/* Project Name */}
      <div
        className="text-2xl font-bold flex items-center space-x-3 logo"
        style={{ color: "var(--text-h)" }}
      >
        <div className="headerLogo">T</div>
        <span >TeamFlow</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex space-x-8 menu">{menuItems}</nav>

      {/* Theme Toggle and Profile Icon */}
      <div className="flex items-center space-x-4 action justify-end">
        <ThemeToggle />
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
          style={{ backgroundColor: "var(--border)", color: "var(--text)" }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default React.memo(Header);
