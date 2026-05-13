
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div
      className="confirmationModalOverlay"
      onClick={onCancel}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div
        className="confirmationModal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirmationContent">
          <p>{message}</p>
          <div className="confirmationActions">
            <button onClick={onConfirm} className="confirmButton">
              Yes
            </button>
            <button onClick={onCancel} className="cancelButton">
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
