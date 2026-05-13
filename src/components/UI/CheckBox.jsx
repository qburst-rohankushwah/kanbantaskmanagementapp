import "./style.css";

export const CheckBox = ({ checked, onChange, className = "" }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`custom-checkbox ${checked ? className : ''}`}
    />
  );
};
