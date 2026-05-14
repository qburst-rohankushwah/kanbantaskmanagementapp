import React, { useMemo, useState } from "react";
import ThemeToggle from "../ThemeToggle";
import "./style.css";
import { MenuItems } from "./constant";
import { ProfileIcon } from "../../assets/Icons/Profile";

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
      <div className="text-2xl font-bold flex items-center space-x-6 logo text-[var(--text-h)]">
        <div className="headerLogo">T</div>
        <span>TeamFlow</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex space-x-8 menu">{menuItems}</nav>

      {/* Theme Toggle and Profile Icon */}
      <div className="flex items-center space-x-4 action justify-end">
        <ThemeToggle />
        <button className="w-10 h-10 text-[var(--text)] bg-[var(--border)] rounded-full flex items-center justify-center transition-colors hover:opacity-80">
          <ProfileIcon />
        </button>
      </div>
    </header>
  );
};

export default React.memo(Header);
