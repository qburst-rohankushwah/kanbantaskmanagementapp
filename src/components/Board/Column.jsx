import "./style.css";
import TaskCard from "../Task/TaskCard";
import Badge from "../UI/Badge";
import { useTaskModal } from "../../contexts/TaskModalContext";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AddTaskButton from "../UI/AddTaskButton";

const Column = ({ title, count, items, type, id }) => {
  const { openModal } = useTaskModal();
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const taskIds = (Array.isArray(items) ? items : []).map((item) => item.id);

  return (
    <div
      ref={setNodeRef}
      className={`cardContainer ${type} ${isOver ? "dragging-over" : ""}`}
    >
      <div className="cardHeader mb-4 itemLayout ">
        <h2 className="cardTitle fontColor">{title}</h2>
        <Badge count={count} />
      </div>
      <div className="cardContent">
        <div className="cardItems">
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {(Array.isArray(items) ? items : []).map((item) => (
              <TaskCard key={item.id} data={item} />
            ))}
          </SortableContext>
        </div>
      </div>
      <div className="cardFooter">
        <AddTaskButton onClick={openModal} />
      </div>
    </div>
  );
};

export default Column;
