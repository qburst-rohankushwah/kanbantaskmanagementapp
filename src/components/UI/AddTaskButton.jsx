import { AddIcon } from "../../assets/Icons/Add";

const AddTaskButton = ({ onClick, variant = "primary" }) => {
  return (
    <button
      className={`addItemButton ${variant === "primary" ? "btn-primary" : "btn-secondary"}`}
      onClick={() => onClick()}
    >
      {AddIcon()} Add Task
    </button>
  );
};

export default AddTaskButton;
