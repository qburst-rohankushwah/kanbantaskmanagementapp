import "./style.css";
import SearchBar from "../UI/SearchBar";
import { useSearch } from "../../contexts/SearchContext";
import { FilterIcon } from "../../assets/Icons/Filter"; // New import
import { HistoryIcon } from "../../assets/Icons/History";
import BoardFilter from "../UI/BoardFilter";

const BoardHeader = () => {
  const { searchQuery, setSearchQuery, setIsFilterOpen, setIsHistoryOpen } =
    useSearch();

  return (
    <header className="px-6 py-4 transition-colors borderHeader">
      <div>
        <div className="flex justify-between items-baseline mb-4">
          <div className="titleContainer">
            <h6
              className="text-2xl font-bold"
              style={{ color: "var(--text-h)" }}
            >
              Sprint 4 - TeamFlow Board
            </h6>
          </div>
          <BoardFilter />
          <SearchBar searchTerm={searchQuery} setSearchTerm={setSearchQuery} />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="filterButton bg-[var(--color-surface)] text-[var(--text)] flex items-center px-4 py-2 rounded-md text-sm font-medium hover:opacity-80 transition-colors"
            onClick={() => setIsFilterOpen(true)}
          >
            <FilterIcon className="mr-2" /> {/* Icon with margin-right */}
            Filter Task{" "}
          </button>
          <button
            type="button"
            className="filterButton bg-[var(--color-surface)] text-[var(--text)] flex items-center px-4 py-2 rounded-md text-sm font-medium hover:opacity-80 transition-colors"
            onClick={() => setIsHistoryOpen(true)}
          >
            <HistoryIcon className="mr-2" />
            View History
          </button>
        </div>
      </div>
    </header>
  );
};

export default BoardHeader;
