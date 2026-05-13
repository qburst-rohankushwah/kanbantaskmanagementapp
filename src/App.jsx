import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TaskModalProvider } from "./contexts/TaskModalContext";
import { SearchProvider } from "./contexts/SearchContext";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";

function App() {
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
