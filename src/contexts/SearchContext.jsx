import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { isOverDue, isDueToday } from "../utils/utils";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [boardFilters, setBoardFilters] = useState({
    priority: [],
    assignee: [],
    isOverdue: false,
    isDueToday: false,
  });

  const [sidebarFilters, setSidebarFilters] = useState({
    priority: [],
    assignee: [],
    isOverdue: false,
    isDueToday: false,
  });

  const toggleBoardFilter = useCallback((type, value) => {
    setBoardFilters((prev) => {
      if (type === "priority" || type === "assignee") {
        const current = prev[type] || [];
        const next = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];
        return { ...prev, [type]: next };
      }
      return { ...prev, [type]: !prev[type] };
    });
  }, []);

  const toggleSidebarFilter = useCallback((type, value) => {
    setSidebarFilters((prev) => {
      if (type === "priority" || type === "assignee") {
        const current = prev[type] || [];
        const next = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];
        return { ...prev, [type]: next };
      }
      return { ...prev, [type]: !prev[type] };
    });
  }, []);

  const clearBoardFilters = useCallback(() => {
    setBoardFilters({
      priority: [],
      assignee: [],
      isOverdue: false,
      isDueToday: false,
    });
  }, []);

  const clearSidebarFilters = useCallback(() => {
    setSidebarFilters({
      priority: [],
      assignee: [],
      isOverdue: false,
      isDueToday: false,
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    clearBoardFilters();
    clearSidebarFilters();
    setSearchQuery("");
  }, [clearBoardFilters, clearSidebarFilters]);

  const applyBoardFilters = useCallback(
    (tasks) => {
      if (!Array.isArray(tasks)) return [];
      return tasks.filter((task) => {
        const matchesSearch =
          !searchQuery ||
          task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority =
          boardFilters.priority.length === 0 ||
          boardFilters.priority.includes(task.priority);
        const matchesAssignee =
          boardFilters.assignee.length === 0 ||
          (task.assignee && boardFilters.assignee.includes(task.assignee));
        const matchesOverdue =
          !boardFilters.isOverdue || isOverDue(task.dueDate);
        const matchesDueToday =
          !boardFilters.isDueToday || isDueToday(task.dueDate);

        return (
          matchesSearch && matchesPriority && matchesAssignee && matchesOverdue && matchesDueToday
        );
      });
    },
    [boardFilters, searchQuery],
  );

  const applySidebarFilters = useCallback(
    (tasks) => {
      if (!Array.isArray(tasks)) return [];
      return tasks.filter((task) => {
        const matchesPriority =
          sidebarFilters.priority.length === 0 ||
          sidebarFilters.priority.includes(task.priority);
        const matchesAssignee =
          sidebarFilters.assignee.length === 0 ||
          (task.assignee && sidebarFilters.assignee.includes(task.assignee));
        const matchesOverdue =
          !sidebarFilters.isOverdue || isOverDue(task.dueDate);
        const matchesDueToday =
          !sidebarFilters.isDueToday || isDueToday(task.dueDate);

        return matchesPriority && matchesAssignee && matchesOverdue && matchesDueToday;
      });
    },
    [sidebarFilters],
  );

  const isBoardFilterActive = useMemo(() => (
    boardFilters.priority.length > 0 ||
    boardFilters.assignee.length > 0 ||
    boardFilters.isOverdue ||
    boardFilters.isDueToday
  ), [boardFilters]);

  const isSidebarFilterActive = useMemo(() => (
    sidebarFilters.priority.length > 0 ||
    sidebarFilters.assignee.length > 0 ||
    sidebarFilters.isOverdue ||
    sidebarFilters.isDueToday
  ), [sidebarFilters]);

  const isAnyFilterActive = useMemo(() => (
    isBoardFilterActive ||
    isSidebarFilterActive ||
    searchQuery.trim() !== ""
  ), [isBoardFilterActive, isSidebarFilterActive, searchQuery]);

  const value = {
    searchQuery,
    setSearchQuery,
    boardFilters,
    sidebarFilters,
    toggleBoardFilter,
    toggleSidebarFilter,
    clearBoardFilters,
    clearSidebarFilters,
    clearAllFilters,
    applyBoardFilters,
    applySidebarFilters,
    isBoardFilterActive,
    isSidebarFilterActive,
    isAnyFilterActive,
    isFilterOpen,
    setIsFilterOpen,
    isHistoryOpen,
    setIsHistoryOpen,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context)
    throw new Error("useSearch must be used within a SearchProvider");
  return context;
};
