import { useState, useMemo, useEffect } from "react";
import { useSearch } from "../../contexts/SearchContext";
import { readStorage } from "../../hooks/useLocalStorage";
import { fetchAssignee } from "../../utils/utils";
import { CheckBox } from "./CheckBox";
import "./style.css";

const BoardFilter = () => {
  const { 
    boardFilters: filters, 
    toggleBoardFilter: toggleFilter, 
    clearBoardFilters: clearFilters, 
    isBoardFilterActive 
  } = useSearch();
  const [openDropdown, setOpenDropdown] = useState(null); // 'priority', 'assignee', 'due'
  const [storageUpdate, setStorageUpdate] = useState(0);

  // Listen for storage changes to keep the assignee list fresh
  useEffect(() => {
    const handleStorageChange = () => setStorageUpdate((prev) => prev + 1);
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Get all tasks to extract unique assignees for the filter list
  const allTasks = useMemo(() => {
    const todo = readStorage("todo", []);
    const inProgress = readStorage("inProgress", []);
    const done = readStorage("done", []);
    return [...todo, ...inProgress, ...done];
  }, [storageUpdate]);

  const priorities = ["low", "medium", "high"];
  const allAssignees = useMemo(() => fetchAssignee(allTasks), [allTasks]);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Close dropdown when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".filter-dropdown-container")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3 mb-4 filter-dropdown-container">
      {/* Priority Multi-Select Dropdown */}
      <div className="relative">
        <button
          className="px-4 py-2 text-sm font-medium border rounded-lg bg-surface hover:bg-gray-50 flex items-center gap-2 transition-colors border-gray-200"
          onClick={() => toggleDropdown("priority")}
        >
          Priority {filters?.priority?.length > 0 && `(${filters?.priority?.length})`}
          <span className="text-[10px] opacity-50">▼</span>
        </button>
        {openDropdown === "priority" && (
          <div className="absolute dropdown top-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-50 py-2 border-gray-100">
            {priorities.map((p) => (
              <label key={p} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer group">
                <CheckBox
                  checked={filters?.priority?.includes(p)}
                  onChange={() => toggleFilter("priority", p)}
                  className={p}
                />
                <span className="text-sm capitalize ml-2 text-gray-700 group-hover:text-black">{p}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Assignee Multi-Select Dropdown */}
      <div className="relative">
        <button
          className="px-4 py-2 text-sm font-medium border rounded-lg bg-surface hover:bg-gray-50 flex items-center gap-2 transition-colors border-gray-200"
          onClick={() => toggleDropdown("assignee")}
        >
          Assignee {filters?.assignee?.length > 0 && `(${filters?.assignee?.length})`}
          <span className="text-[10px] opacity-50">▼</span>
        </button>
        {openDropdown === "assignee" && (
          <div className="absolute dropdown top-full left-0 mt-2 w-56 border rounded-lg shadow-xl z-50 py-2 border-gray-100 max-h-72 overflow-y-auto">
            {allAssignees.length > 0 ? (
              allAssignees.map((a) => (
                <label key={a} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer group">
                  <CheckBox
                    checked={filters?.assignee?.includes(a)}
                    onChange={() => toggleFilter("assignee", a)}
                    className="assignee"
                  />
                  <span className="text-sm ml-2 text-gray-700 group-hover:text-black">{a}</span>
                </label>
              ))
            ) : (
              <div className="px-4 py-2 text-xs text-gray-400 italic">No assignees found</div>
            )}
          </div>
        )}
      </div>

      {/* Due Status Multi-Select Dropdown */}
      <div className="relative">
        <button
          className="px-4 py-2 text-sm font-medium border rounded-lg bg-surface hover:bg-gray-50 flex items-center gap-2 transition-colors border-gray-200"
          onClick={() => toggleDropdown("due")}
        >
          Due Status {(filters?.isOverdue || filters?.isDueToday) && " (Active)"}
          <span className="text-[10px] opacity-50">▼</span>
        </button>
        {openDropdown === "due" && (
          <div className="absolute dropdown top-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-50 py-2 border-gray-100">
            <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer group">
              <CheckBox
                checked={filters?.isOverdue}
                onChange={() => toggleFilter("isOverdue")}
                className="high"
              />
              <span className="text-sm ml-2 text-gray-700 group-hover:text-black">Overdue</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer group">
              <CheckBox
                checked={filters?.isDueToday}
                onChange={() => toggleFilter("isDueToday")}
              />
              <span className="text-sm ml-2 text-gray-700 group-hover:text-black">Due Today</span>
            </label>
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {typeof isBoardFilterActive === 'function' && isBoardFilterActive() && (
        <button
          onClick={() => {
            clearFilters();
            setOpenDropdown(null);
          }}
          className="ml-2 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors flex items-center gap-1"
        >
          ✕ Clear All
        </button>
      )}
    </div>
  );
};

export default BoardFilter;