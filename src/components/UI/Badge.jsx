import "./style.css";

const Badge = ({ count }) => {
  return <div className="cardCount circle count fontColor">{count}</div>;
};

export default Badge;
