import { useNavigate } from "react-router-dom";

const Report = () => {
  const navigate = useNavigate();

  const metrics = [
    { label: "Total Tasks", value: 24 },
    { label: "Completed", value: 18 },
    { label: "In Progress", value: 4 },
    { label: "Overdue", value: 2 },
  ];

  const completionRate = Math.round((metrics[1].value / metrics[0].value) * 100);

  return (
    <div 
      className="min-h-screen p-8 transition-colors overflow-y-auto" 
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 mb-8 text-sm font-semibold hover:opacity-80 transition-all"
          style={{ color: "var(--color-primary)" }}
          aria-label="Back to Board"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Board</span>
        </button>

        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--text-h)" }}>
              Performance Report
            </h1>
            <p className="opacity-60 mt-2">Insights and task analytics for Sprint 4</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs uppercase font-bold opacity-40">Project Health</p>
            <p className="text-2xl font-black text-[var(--color-success-dark)]">{completionRate}%</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--color-surface)] shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-xs opacity-50 mb-1 uppercase tracking-widest font-bold">{metric.label}</p>
              <p className="text-4xl font-black" style={{ color: "var(--color-primary)" }}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Visual Progress Section */}
        <div className="mb-10 p-8 rounded-2xl border border-[var(--border)] bg-[var(--color-surface)]">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: "var(--text-h)" }}>Completion Progress</h2>
            <span className="font-bold">{completionRate}%</span>
          </div>
          <div className="w-full h-4 bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
            <div 
              className="h-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${completionRate}%`, 
                backgroundColor: "var(--color-success-dark)" 
              }}
            />
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-10 p-8 rounded-2xl border border-[var(--border)] bg-[var(--color-surface)]">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-h)" }}>Weekly Insights</h2>
          <p className="opacity-70 leading-relaxed">
            Your productivity has increased by <span className="text-[var(--color-success-dark)] font-bold">12%</span> compared to last week. 
            Most of your tasks are being completed in the "In Progress" stage within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Report;