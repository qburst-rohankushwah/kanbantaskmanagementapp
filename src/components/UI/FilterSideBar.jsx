import { useMemo } from "react";
import { useSearch } from "../../contexts/SearchContext";
import { readStorage } from "../../hooks/useLocalStorage";
import "./style.css";
import { fetchAssignee, isOverDue, isDueToday } from "../../utils/utils";
import { CheckBox } from "./CheckBox";
import Button from "./Button";

const FilterSideBar = () => {
  const { isFilterOpen, setIsFilterOpen, filters, setFilters } = useSearch();

  // Get all tasks from storage for the preview section
  const allTasks = useMemo(() => {
    const todo = readStorage("todo", []);
    const inProgress = readStorage("inProgress", []);
    const done = readStorage("done", []);
    return [...todo, ...inProgress, ...done];
  }, [isFilterOpen]); // Refresh when opened

  const priorities = ["low", "medium", "high"];
  const allAssignees = useMemo(() => fetchAssignee(allTasks), [allTasks]); // Fetch assignees once, passing allTasks

  const handlePriorityChange = (priority) => {
    setFilters((prev) => {
      const current = prev.priority;
      const next = current.includes(priority)
        ? current.filter((p) => p !== priority)
        : [...current, priority];
      return { ...prev, priority: next };
    });
  };

  const handleAssigneeChange = (assignee) => {
    setFilters((prev) => {
      const current = Array.isArray(prev.assignee) ? prev.assignee : [];
      const next = current?.includes(assignee)
        ? current.filter((a) => a !== assignee)
        : [...current, assignee];
      return { ...prev, assignee: next };
    });
  };

  const handleOverdueChange = (checked) => {
    setFilters((prev) => ({ ...prev, isOverdue: checked }));
  };

  const handleDueTodayChange = (checked) => {
    setFilters((prev) => ({ ...prev, isDueToday: checked }));
  };

  const filteredData = useMemo(() => {
    let currentFilteredTasks = allTasks;

    // Apply priority filter
    if (filters?.priority?.length > 0) {
      currentFilteredTasks = currentFilteredTasks.filter((task) =>
        filters.priority.includes(task.priority),
      );
    }

    // Apply assignee filter
    if (filters?.assignee?.length > 0) {
      currentFilteredTasks = currentFilteredTasks.filter(
        (task) => task.assignee && filters.assignee.includes(task.assignee),
      );
    }

    // Apply overdue filter
    if (filters?.isOverdue) {
      currentFilteredTasks = currentFilteredTasks.filter((task) =>
        isOverDue(task.dueDate),
      );
    }

    // Apply due today filter
    if (filters?.isDueToday) {
      currentFilteredTasks = currentFilteredTasks.filter((task) =>
        isDueToday(task.dueDate),
      );
    }

    return currentFilteredTasks;
  }, [
    allTasks,
    // Add isDueToday to dependencies for isDueToday utility function
    // Add isOverDue to dependencies for isOverDue utility function
    // This ensures that if these utility functions somehow change (though unlikely for pure functions),
    // the memoized value would re-evaluate. More importantly, it makes the dependency array exhaustive
    // as per React's linting rules, acknowledging their use within the memoized callback.
    isDueToday,
    isOverDue,
    // Existing filter dependencies
    filters?.priority,
    filters?.assignee,
    filters?.isOverdue,
    filters?.isDueToday,
  ]);

  if (!isFilterOpen) return null;

  const handleClearFilters = () => {
    setFilters({
      priority: [],
      assignee: [],
      isOverdue: false,
      isDueToday: false,
    });
  };

  return (
    <div className="filterModalOverlay" onClick={() => setIsFilterOpen(false)}>
      <div
        className="filterModalContainer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="filterModalHeader">
          <h3>FILTERS</h3>
          <h3>
            Filtered Result ({filteredData.length}{" "}
            {filteredData.length <= 1 ? "task" : "tasks"})
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
                    checked={filters.priority.includes(priority)}
                    onChange={() => handlePriorityChange(priority)}
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
                      onChange={() => handleAssigneeChange(assignee)}
                      className="assigne"
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
                  checked={filters.isOverdue}
                  onChange={(e) => handleOverdueChange(e.target.checked)}
                  className="high"
                />
                <span>Overdue</span>
              </label>
              <label className="checkboxLabel">
                <CheckBox
                  checked={filters.isDueToday}
                  onChange={(e) => handleDueTodayChange(e.target.checked)}
                />
                <span>Due Today</span>
              </label>
            </div>

            <Button
              type="button"
              className="clearFiltersButton mt-6 high"
              onClick={handleClearFilters}
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
                        {task.priority.toLocaleUpperCase()}
                      </span>
                      <span className="resultColumn">
                        {task.column.toUpperCase()}
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
