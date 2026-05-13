const DragOverLay = ({ task }) => {
  return (
    <div className="taskCard dragOverlay">
      <div className="taskCardHeader">
        <div className="flex items-center space-x-2">
          <div data-testid="priority-dot"
            className={`dot ${task?.priority} fontColor`}
          />
          <p className="cardItemTitle fontColor">
            {task?.title}
          </p>
        </div>
      </div>
      <div className="cardItemDetails">
        <span
          className={`priority mr-3 ${task?.priority} fontColor`}
        >
          {task?.priority?.toLocaleUpperCase()}
        </span>
        <span className="dueDate fontColor">
          {task?.dueDate}
        </span>
        <span className="circle low font-normal float-end fontColor">
          {task?.assignee
            ? task
                .assignee.split(" ")
                .map((word) => word[0].toUpperCase())
                .join("")
            : "?"}
        </span>
      </div>
    </div>
  );
};

export default DragOverLay;
