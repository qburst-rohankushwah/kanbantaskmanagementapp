import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priority: [],
    assignee: [],
    isOverdue: false,
    isDueToday: false,
  });

  const value = {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    isFilterOpen,
    setIsFilterOpen,
    isHistoryOpen,
    setIsHistoryOpen,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};