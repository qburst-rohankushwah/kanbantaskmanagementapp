import { useState, useEffect, useMemo } from "react";
import { useSearch } from "../../contexts/SearchContext";
import { readStorage, writeStorage } from "../../hooks/useLocalStorage";
import "./style.css";

const HistorySideBar = () => {
  const { isHistoryOpen, setIsHistoryOpen } = useSearch();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isHistoryOpen) {
      setHistory(readStorage("history", []));
    }
  }, [isHistoryOpen]);

  // Get current board state to verify if undo is valid
  const allTasksOnBoard = useMemo(() => {
    const todo = readStorage("todo", []);
    const inProgress = readStorage("inProgress", []);
    const done = readStorage("done", []);
    return [...todo, ...inProgress, ...done];
  }, [history, isHistoryOpen]);

  const handleUndo = (item) => {
    const { type, task, from, to } = item;

    if (type === "CREATE") {
      const tasks = readStorage(to, []);
      writeStorage(to, tasks.filter((t) => t.id !== task.id));
    } else if (type === "DELETE") {
      const tasks = readStorage(from, []);
      writeStorage(from, [...tasks, task]);
    } else if (type === "MOVE") {
      const toTasks = readStorage(to, []);
      const fromTasks = readStorage(from, []);
      writeStorage(to, toTasks.filter((t) => t.id !== task.id));
      writeStorage(from, [...fromTasks, { ...task, column: from }]);
    }

    const updatedHistory = history.filter((h) => h.id !== item.id);
    setHistory(updatedHistory);
    writeStorage("history", updatedHistory);

    // Trigger re-render across the app
    window.dispatchEvent(new Event("storage"));
  };

  const clearHistory = () => {
    writeStorage("history", []);
    setHistory([]);
  };

  if (!isHistoryOpen) return null;

  return (
    <div className="historyModalOverlay" onClick={() => setIsHistoryOpen(false)}>
      <div
        className="historyModalContainer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="filterModalHeader">
          <h3 className="font-bold">ACTIVITY HISTORY</h3>
          <button
            className="closeButton"
            onClick={() => setIsHistoryOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="filterModalBody">
          <div className="historyList w-full overflow-y-auto px-4 py-4">
            {history?.length > 0 ? (
              <>
                {history?.map((item) => {
                  const taskOnBoard = allTasksOnBoard.find((t) => t.id === item.task.id);
                  const isUndoDisabled = item.type === "CREATE" && taskOnBoard?.column !== item.to;

                  return (
                    <div key={item.id} className="historyItem mb-4 p-3 border rounded-lg bg-surface">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`typeTag ${item.type.toLowerCase()}`}>
                          {item.type}
                        </span>
                        <button 
                          className={`undoButton text-xs ${isUndoDisabled ? 'text-gray-400 cursor-not-allowed no-underline' : 'text-blue-500 hover:underline'}`}
                          onClick={() => !isUndoDisabled && handleUndo(item)}
                          disabled={isUndoDisabled}
                        >
                          Undo
                        </button>
                      </div>
                      <p className="text-sm font-medium">{item.task.title}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.type === "MOVE" ? `${item.from} → ${item.to}` : `Column: ${item.from || item.to}`}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">{item.timestamp}</p>
                    </div>
                  );
                })}
                <button 
                  className="clearHistoryBtn w-full mt-4 p-2 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50"
                  onClick={clearHistory}
                >
                  Clear All History
                </button>
              </>
            ) : (
              <p className="text-center text-gray-500 mt-10">No recent activity found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorySideBar;