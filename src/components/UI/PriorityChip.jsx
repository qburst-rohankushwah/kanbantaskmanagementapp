import Button from "./Button";

const PriorityChip = ({ showSelected, onChange, data, currentValue }) => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
      {data.map((item) => (
        <Button
          key={item.name}
          label={item.name}
          onClick={() => showSelected && onChange && onChange({ key: "priority", value: item.value })}
          className={`${item.type} ${currentValue === item.value && showSelected ? "selected-chip" : ""}`}
        />
      ))}
    </div>
  );
};

export default PriorityChip;
