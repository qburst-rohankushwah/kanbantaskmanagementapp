import { useNavigate } from "react-router-dom";

const MyTask = () => {
  const navigate = useNavigate();

  const dummyTasks = [
    { id: 1, title: "Analyze Performance Metrics", priority: "high", status: "In Progress" },
    { id: 2, title: "Update User Documentation", priority: "medium", status: "Todo" },
    { id: 3, title: "Refactor Theme Provider", priority: "low", status: "Done" },
  ];

  return (
    <div className="min-h-screen p-8 transition-colors" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-8 text-sm font-semibold hover:opacity-80 transition-opacity"
          style={{ color: "var(--color-primary)" }}
        >
          <span className="text-xl">←</span>
          <span>Back to Board</span>
        </button>

        <h1 className="text-4xl font-bold mb-10" style={{ color: "var(--text-h)" }}>My Tasks</h1>

        <div className="flex flex-col gap-4">
          {dummyTasks.map((task) => (
            <div key={task.id} className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--color-surface)] shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold" style={{ color: "var(--text-h)" }}>{task.title}</h3>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${task.priority === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                  {task.priority}
                </div>
              </div>
              <p className="text-sm opacity-50">Current Status: <span className="font-semibold">{task.status}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTask;