import { useState, useMemo } from "react";
import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { logActivity } from "../utils/utils";

const filterTasks = (tasks, searchQuery) => {
  const tasksArray = Array.isArray(tasks) ? tasks : [];
  if (!searchQuery) return tasksArray;
  const query = searchQuery.toLowerCase();
  return tasksArray.filter(task =>
    task.title.toLowerCase().includes(query) ||
    (task.description && task.description.toLowerCase().includes(query))
  );
};

const useDragAndDrop = ({
  todoTasksValue,
  saveTodoTasks,
  inProgressTasksValue,
  saveInProgressTasks,
  doneTasksValue,
  saveDoneTasks,
  searchQuery,
}) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const todoTasks = useMemo(() => filterTasks(todoTasksValue, searchQuery), [searchQuery, todoTasksValue]);
  const inProgressTasks = useMemo(() => filterTasks(inProgressTasksValue, searchQuery), [searchQuery, inProgressTasksValue]);
  const doneTasks = useMemo(() => filterTasks(doneTasksValue, searchQuery), [searchQuery, doneTasksValue]);

  const findTaskById = (id) => {
    const allTasks = [...todoTasksValue, ...inProgressTasksValue, ...doneTasksValue];
    return allTasks.find((task) => task.id === id);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the active task
    const activeTask = findTaskById(activeId);
    if (!activeTask) return;

    // If dropping on a column (not another task)
    if (overId === "todo" || overId === "inProgress" || overId === "done") {
      const newColumn = overId;

      // If task is already in the target column, do nothing
      if (activeTask.column === newColumn) {
        setActiveId(null);
        return;
      }

      // Remove from old column
      const oldColumnTasks = activeTask.column === "todo" ? [...todoTasksValue] :
                           activeTask.column === "inProgress" ? [...inProgressTasksValue] : [...doneTasksValue];
      const filteredOldTasks = oldColumnTasks.filter(task => task.id !== activeId);

      // Add to new column
      const newColumnTasks = newColumn === "todo" ? [...todoTasksValue] :
                           newColumn === "inProgress" ? [...inProgressTasksValue] : [...doneTasksValue];
      const updatedTask = { ...activeTask, column: newColumn };
      newColumnTasks.push(updatedTask);

      // Update localStorage
      if (activeTask.column === "todo") saveTodoTasks(filteredOldTasks);
      else if (activeTask.column === "inProgress") saveInProgressTasks(filteredOldTasks);
      else saveDoneTasks(filteredOldTasks);

      if (newColumn === "todo") saveTodoTasks(newColumnTasks);
      else if (newColumn === "inProgress") saveInProgressTasks(newColumnTasks);
      else saveDoneTasks(newColumnTasks);

      logActivity({
        type: "MOVE",
        task: updatedTask,
        from: activeTask.column,
        to: newColumn,
      });

    } else {
      // Dropping on another task - reorder within same column
      const activeColumn = activeTask.column;
      const columnTasks = activeColumn === "todo" ? [...todoTasksValue] :
                         activeColumn === "inProgress" ? [...inProgressTasksValue] : [...doneTasksValue];

      const activeIndex = columnTasks.findIndex(task => task.id === activeId);
      const overIndex = columnTasks.findIndex(task => task.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const reorderedTasks = arrayMove(columnTasks, activeIndex, overIndex);

        if (activeColumn === "todo") saveTodoTasks(reorderedTasks);
        else if (activeColumn === "inProgress") saveInProgressTasks(reorderedTasks);
        else saveDoneTasks(reorderedTasks);
      }
    }

    setActiveId(null);
  };

  return {
    sensors,
    handleDragStart,
    handleDragEnd,
    activeId,
    findTaskById,
    todoTasks,
    inProgressTasks,
    doneTasks,
  };
};

export default useDragAndDrop;
