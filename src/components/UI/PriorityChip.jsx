import Button from "./Button";

const PriorityChip = ({ showSelected, onChange, data, currentValue }) => {
  return (
    <div className="flex space-x-4 items-center">
      {data.map((item) => (
        <Button
          key={item.name}
          label={item.name}
          onClick={() => onChange({ key: "priority", value: item.value })}
          className={`${item.type} ${currentValue === item.value && showSelected ? "selected-chip" : ""}`}
        />
      ))}
    </div>
  );
};

export default PriorityChip;
