import { useState, useEffect } from "react";
import Button from "./Button";

const PriorityChip = ({ showSelected, onChange, data }) => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (showSelected) {
      onChange({ key: "priority", value: selected });
    }
  }, [selected]);

  return (
    <div className="flex space-x-4 items-center">
      {data.map((item) => (
        <Button
          key={item.name}
          label={item.name}
          onClick={() => setSelected(item.value)}
          className={`${item.type} ${selected === item.value && showSelected ? "selected-chip" : ""}`}
        />
      ))}
    </div>
  );
};

export default PriorityChip;
