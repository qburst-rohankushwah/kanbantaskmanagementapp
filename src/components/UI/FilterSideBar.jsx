import { useMemo, useState, useEffect } from "react";
import { useSearch } from "../../contexts/SearchContext";
import { readStorage } from "../../hooks/useLocalStorage";
import "./style.css";
import { fetchAssignee, isOverDue } from "../../utils/utils";
import { CheckBox } from "./CheckBox";
import Button from "./Button";

const FilterSideBar = () => {
  const { 
    isFilterOpen, 
    setIsFilterOpen, 
    sidebarFilters: filters, 
    toggleSidebarFilter: toggleFilter, 
    clearSidebarFilters: clearFilters,
    applySidebarFilters,
  } = useSearch();
  const [storageUpdate, setStorageUpdate] = useState(0);

  // Listen for storage changes to keep the data fresh while the sidebar is open
  useEffect(() => {
    const handleStorageChange = () => setStorageUpdate((prev) => prev + 1);
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Get all tasks from storage for the preview section
  const allTasks = useMemo(() => {
    const todo = readStorage("todo", []);
    const inProgress = readStorage("inProgress", []);
    const done = readStorage("done", []);
    return [...todo, ...inProgress, ...done];
  }, [isFilterOpen, storageUpdate]); // Refresh when opened or storage changes

  const priorities = ["low", "medium", "high"];
  const allAssignees = useMemo(() => fetchAssignee(allTasks), [allTasks]); // Fetch assignees once, passing allTasks

  const filteredData = useMemo(() => {
    return typeof applySidebarFilters === "function" ? applySidebarFilters(allTasks) : (allTasks || []);
  }, [allTasks, applySidebarFilters, filters]); // Added filters as dependency to ensure preview updates
  
  if (!isFilterOpen) return null;

    const OverdueIndicator = () => <span className="priority mr-3 fontColor high">Overdue</span>;


  return (
    <div className="filterModalOverlay" onClick={() => setIsFilterOpen(false)}>
      <div
        className="filterModalContainer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="filterModalHeader">
          <h3>FILTERS</h3>
          <h3>
            Filtered Result ({filteredData?.length}{" "}
            {filteredData?.length <= 1 ? "task" : "tasks"})
          </h3>
          <button
            className="closeButton"
            onClick={() => setIsFilterOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="filterModalBody">
          {/* Section 1: Checkboxes */}

          <div className="filterOptionsSection">
            <h4>Priority</h4>
            <div className="checkboxGroup">
              {priorities.map((priority) => (
                <label key={priority} className="checkboxLabel">
                  <CheckBox
                    checked={filters?.priority?.includes(priority)}
                    onChange={() => toggleFilter("priority", priority)}
                    className={priority}
                  />
                  <span className="capitalize">{priority}</span>
                </label>
              ))}
            </div>

            <h4 className="mt-6">Assignee</h4>
            <div className="checkboxGroup">
              {allAssignees.length > 0 ? (
                allAssignees.map((assignee) => (
                  <label key={assignee} className="checkboxLabel">
                    <CheckBox
                      checked={filters?.assignee?.includes(assignee)}
                      onChange={() => toggleFilter("assignee", assignee)}
                      className="assignee"
                    />
                    <span>{assignee}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">No assignees found.</p>
              )}
            </div>

            <h4 className="mt-6">Status</h4>
            <div className="checkboxGroup">
              <label className="checkboxLabel">
                <CheckBox
                  checked={filters?.isOverdue}
                  onChange={() => toggleFilter("isOverdue")}
                  className="high"
                />
                <span>Overdue</span>
              </label>
              <label className="checkboxLabel">
                <CheckBox
                  checked={filters?.isDueToday}
                  onChange={() => toggleFilter("isDueToday")}
                />
                <span>Due Today</span>
              </label>
            </div>

            <Button
              type="button"
              className="clearFiltersButton mt-6 high"
              onClick={clearFilters}
              label={"Clear All Filters"}
            />
            
          </div>

          {/* Section 2: Filtered Data */}
          <div className="filterResultsSection">
            <div className="resultsList">
              {filteredData.length > 0 ? (
                filteredData.map((task) => (
                  <div key={task.id} className="filterResultItem">
                    <div className="filterResultItemTop">
                      <p className="resultTitle">{task.title}</p>
                    </div>
                    <div className="filterResultItemBottom">
                      {task.assignee && (
                        <span className="resultAssignee">{task.assignee}</span>
                      )}
                      {task.dueDate && (
                        <span className="resultDueDate">{task.dueDate}</span>
                      )}
                      <span
                        className={`priority mr-3 ${task.priority} fontColor`}
                      >
                        {task?.priority?.toLocaleUpperCase()}
                      </span>
                      {isOverDue(task?.dueDate) && <OverdueIndicator />}
                      <span className="resultColumn">
                        {task?.column?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="noResults">No tasks match selected filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
