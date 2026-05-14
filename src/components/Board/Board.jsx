import { useMemo } from "react";
import {
  DndContext, DragOverlay, closestCenter
} from "@dnd-kit/core";
import Column from "./Column";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useSearch } from "../../contexts/SearchContext";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import DragOverLay from "../UI/DragOverLay";

const Board = () => {
  const { value: todoTasksValue, saveValue: saveTodoTasks } = useLocalStorage("todo", []);
  const { value: inProgressTasksValue, saveValue: saveInProgressTasks } = useLocalStorage("inProgress", []);
  const { value: doneTasksValue, saveValue: saveDoneTasks } = useLocalStorage("done", []);
  
  const { searchQuery, boardFilters, sidebarFilters, applyBoardFilters } = useSearch();


  const {
    sensors,
    handleDragStart,
    handleDragEnd,
    activeId,
    findTaskById,
    todoTasks: rawTodoTasks,
    inProgressTasks: rawInProgressTasks,
    doneTasks: rawDoneTasks,
  } = useDragAndDrop({
    todoTasksValue, saveTodoTasks,
    inProgressTasksValue, saveInProgressTasks,
    doneTasksValue, saveDoneTasks,
    searchQuery,
    boardFilters,
    sidebarFilters,
  });

  // Apply board filters (search + priority/assignee dropdowns) to the raw task lists
  const todoTasks = useMemo(() => {
    return typeof applyBoardFilters === "function" ? applyBoardFilters(rawTodoTasks) : (rawTodoTasks || []);
  }, [rawTodoTasks, applyBoardFilters]);

  const inProgressTasks = useMemo(() => {
    return typeof applyBoardFilters === "function" ? applyBoardFilters(rawInProgressTasks) : (rawInProgressTasks || []);
  }, [rawInProgressTasks, applyBoardFilters]);

  const doneTasks = useMemo(() => {
    return typeof applyBoardFilters === "function" ? applyBoardFilters(rawDoneTasks) : (rawDoneTasks || []);
  }, [rawDoneTasks, applyBoardFilters]);


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 px-4 py-6 flex flex-wrap justify-start gap-4 overflow-auto">
        <Column
          title="TODO"
          count={todoTasks.length}
          items={todoTasks}
          type="todo"
          id="todo"
        />
        <Column
          title="IN PROGRESS"
          count={inProgressTasks.length}
          items={inProgressTasks}
          type="inProgress"
          id="inProgress"
        />
        <Column
          title="Done"
          count={doneTasks.length}
          items={doneTasks}
          type="done"
          id="done"
        />
      </div>
      <DragOverlay>
        {activeId ? (
          <DragOverLay task={findTaskById(activeId)} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Board;

       