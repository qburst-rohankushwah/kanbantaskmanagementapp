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

    // Find if we are dropping over a task or a column container
    const overTask = findTaskById(overId);
    const destinationColumn = overTask ? overTask.column : overId;

    // Ensure the drop target is a valid column
    if (!["todo", "inProgress", "done"].includes(destinationColumn)) {
      setActiveId(null);
      return;
    }

    // Scenario 1: Moving to a different column
    if (activeTask.column !== destinationColumn) {
      const sourceCol = activeTask.column;
      const destCol = destinationColumn;

      const sourceTasks = sourceCol === "todo" ? todoTasksValue : sourceCol === "inProgress" ? inProgressTasksValue : doneTasksValue;
      const destTasks = destCol === "todo" ? todoTasksValue : destCol === "inProgress" ? inProgressTasksValue : doneTasksValue;

      const filteredSource = sourceTasks.filter(t => t.id !== activeId);
      const updatedTask = { ...activeTask, column: destCol };
      const updatedDest = [...destTasks, updatedTask];

      if (sourceCol === "todo") saveTodoTasks(filteredSource);
      else if (sourceCol === "inProgress") saveInProgressTasks(filteredSource);
      else saveDoneTasks(filteredSource);

      if (destCol === "todo") saveTodoTasks(updatedDest);
      else if (destCol === "inProgress") saveInProgressTasks(updatedDest);
      else saveDoneTasks(updatedDest);

      logActivity({ type: "MOVE", task: updatedTask, from: sourceCol, to: destCol });
    } 
    // Scenario 2: Reordering in the same column
    else if (overTask && activeId !== overId) {
      const col = activeTask.column;
      const tasks = col === "todo" ? todoTasksValue : col === "inProgress" ? inProgressTasksValue : doneTasksValue;
      const oldIndex = tasks.findIndex(t => t.id === activeId);
      const newIndex = tasks.findIndex(t => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
        if (col === "todo") saveTodoTasks(reorderedTasks);
        else if (col === "inProgress") saveInProgressTasks(reorderedTasks);
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
