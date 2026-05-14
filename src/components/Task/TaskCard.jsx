import { useState } from "react";
import "./style.css";
import { EditIcon } from "../../assets/Icons/Edit";
import { DeleteIcon } from "../../assets/Icons/Delete";
import { useTaskModal } from "../../contexts/TaskModalContext";
import { readStorage, writeStorage } from "../../hooks/useLocalStorage";
import ConfirmationModal from "../../components/Task/ConfirmationModal";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { isOverDue, logActivity } from "../../utils/utils";

const TaskCard = ({ data }) => {
  const { openModal } = useTaskModal();
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: data.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const assigneeTag = data.assignee
    ? data.assignee
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join("")
    : "?";

  const handleDelete = () => {
    const selectedTaskColumn = readStorage(data.column, []);
    const filteredTasks = selectedTaskColumn.filter(
      (task) => task.id !== data.id,
    );
    writeStorage(data.column, filteredTasks);
    logActivity({ type: "DELETE", task: data, from: data.column });
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const handleDeleteModal = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };


  const OverdueIndicator = () => <span className="priority mr-3 fontColor high">Overdue</span>;
  

  return (
    <>
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-3 itemLayout taskCard ${isDragging ? "dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      <div className="taskCardHeader">
        <div className="flex items-center space-x-2">
          <div className={`dot ${data.priority} fontColor`} />
          <p className="cardItemTitle fontColor">{data.title}</p>
        </div>
        <div className="taskCardActions">
          <button
            type="button"
            className="iconButton editButton"
            onClick={(e) => {
              e.stopPropagation();
              openModal(data);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="Edit task"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className="iconButton deleteButton"
            onClick={ (e) =>  handleDeleteModal(e) }
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="Delete task"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
      <div className="cardItemDetails">
        <span className={`priority mr-3 ${data?.priority} fontColor`}>
          {data?.priority?.toLocaleUpperCase()}
        </span>
        <span className="dueDate fontColor">{data?.dueDate} {isOverDue(data?.dueDate) && <OverdueIndicator />}</span>
        <span className="circle low font-normal float-end fontColor">
          {assigneeTag}
        </span>
      </div>
    </div>

    {showConfirm && (
      <ConfirmationModal
        message="Are you sure you want to delete this task?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    )}
    </>
  );
};

export default TaskCard;
