const Button = ({ onClick, label, className = "" }) => {
  return (
    <button
    //   key={item.name} // Added key for list items
      type="button"
      className={`px-4 py-2 rounded-md text-sm font-medium hover:opacity-80 transition-colors button ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
