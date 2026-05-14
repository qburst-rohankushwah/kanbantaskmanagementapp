import { useNavigate } from "react-router-dom";

const Setting = () => {
  const navigate = useNavigate();

  const settings = [
    { label: "Notifications", description: "Manage how you receive alerts" },
    { label: "Privacy", description: "Control who can see your activity" },
    { label: "Account", description: "Update your personal information" },
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

        <h1 className="text-4xl font-bold mb-10" style={{ color: "var(--text-h)" }}>Settings</h1>

        <div className="flex flex-col gap-6">
          {settings.map((setting, index) => (
            <div key={index} className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--color-surface)] shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold" style={{ color: "var(--text-h)" }}>{setting.label}</h3>
                <p className="text-sm opacity-50">{setting.description}</p>
              </div>
              <button className="px-4 py-2 rounded-lg text-sm font-semibold border border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                Configure
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Setting;