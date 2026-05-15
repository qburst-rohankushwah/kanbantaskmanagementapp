import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TaskModalProvider } from "./contexts/TaskModalContext";
import { SearchProvider } from "./contexts/SearchContext";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isDesktop) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white text-center p-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Desktop Only</h1>

          <p className="text-gray-300">
            This application is available only on desktop devices.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <TaskModalProvider>
        <SearchProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SearchProvider>
      </TaskModalProvider>
    </ThemeProvider>
  );
}

export default App;
