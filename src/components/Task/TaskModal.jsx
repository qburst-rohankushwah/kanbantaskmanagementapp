import { useState, useEffect, useMemo } from "react";
import { readStorage, writeStorage } from "../../hooks/useLocalStorage";
import "./style.css";
import { useTaskModal } from "../../contexts/TaskModalContext";
import { logActivity } from "../../utils/utils";
import { Status } from "../../utils/constant";
import PriorityChip from "../UI/PriorityChip";

const TaskModal = ({ isOpen, onClose }) => {
  const defaultTaskData = useMemo(
    () => ({
      title: "",
      description: "",
      assignee: "",
      dueDate: "",
      column: "todo",
      priority: "medium",
    }),
    [],
  );

  const { task } = useTaskModal();
   
  const initialFormData = useMemo(() => {
    return task
      ? {
          title: task.title || "",
          description: task.description || "",
          assignee: task.assignee || "",
          dueDate: task.dueDate || "",
          column: task.column || "todo",
          priority: task.priority || "medium",
          id: task.id || null,
        }
      : defaultTaskData;
  }, [task, defaultTaskData]);

  const [formData, setFormData] = useState(initialFormData);

  const resetForm = () => setFormData(defaultTaskData);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        assignee: task.assignee || "",
        dueDate: task.dueDate || "",
        column: task.column || "todo",
        priority: task.priority || "medium",
        id: task.id || null,
      });
    } else {
      resetForm();
    }
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriorityChange = (priority) => {
    setFormData((prev) => ({
      ...prev,
      [priority.key]: priority.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return;
    const ensureArray = (value) => (Array.isArray(value) ? value : []);
    if (task === null) {
      const selectedTaskColumn = ensureArray(readStorage(formData.column, []));
      const newTask = {
        ...formData,
        createdAt: Date.now(),
        id: `task-${Date.now()}`,
      };

      writeStorage(newTask.column, [...selectedTaskColumn, newTask]);
      logActivity({ type: "CREATE", task: newTask, to: newTask.column });
    } else {
      const selectedTaskColumn = ensureArray(readStorage(formData.column, []));
      if (task?.id) {
        const updatedTask = {
          ...formData,
          updatedAt: Date.now(),
        };

        if (task.column !== formData.column) {
          const oldColumnTasks = ensureArray(readStorage(task.column, []));
          const updatedOldColumn = oldColumnTasks.filter(
            (t) => t.id !== task.id,
          );
          const newColumnTasks = ensureArray(readStorage(formData.column, []));

          writeStorage(task.column, updatedOldColumn);
          writeStorage(formData.column, [...newColumnTasks, updatedTask]);
          logActivity({
            type: "MOVE",
            task: updatedTask,
            from: task.column,
            to: formData.column,
          });
        } else {
          const tasks = selectedTaskColumn.map((existing) =>
            existing.id === task.id ? updatedTask : existing,
          );

          writeStorage(formData.column, tasks);
        }
      }
    }

    resetForm();
    onClose();

    // Trigger re-render across the app by notifying components listening for storage changes
    window.dispatchEvent(new Event("storage"));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modalBackdrop" onClick={handleBackdropClick} data-testid="modal-backdrop">
      <div className="modalContent w-full max-w-lg mx-4 sm:mx-auto max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="modalHeader">
          <h2 className="modalTitle">
            {task?.id ? "Update Task" : "Add New Task"}
          </h2>
          <button className="modalCloseButton" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modalForm">
          <div className="formGroup">
            <label htmlFor="title" className="formLabel">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="formInput"
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="description" className="formLabel">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="formTextarea"
              placeholder="Enter task description"
              rows="3"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="assignee" className="formLabel">
              Assignee
            </label>
            <input
              type="text"
              id="assignee"
              name="assignee"
              value={formData.assignee}
              onChange={handleInputChange}
              className="formInput"
              placeholder="Enter assignee name"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="dueDate" className="formLabel">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="formInput"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="priority" className="formLabel">
              Priority
            </label>
            <PriorityChip
              showSelected={true}
              onChange={handlePriorityChange}
              data={Status}
              currentValue={formData.priority}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="column" className="formLabel">
              Column
            </label>
            <select
              id="column"
              name="column"
              value={formData.column}
              onChange={handleInputChange}
              className="formSelect"
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="modalActions flex flex-col-reverse sm:flex-row gap-2 mt-8">
            <button type="button" className="cancelButton" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submitButton">
              {task?.id ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
