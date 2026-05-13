import Header from "../../components/Layout";
import BoardHeader from "../../components/BoardHeader";
import Board from "../../components/Board/Board";
import TaskModal from "../../components/Task/TaskModal";
import { useTaskModal } from "../../contexts/TaskModalContext";
import FilterSideBar from "../../components/UI/FilterSideBar";
import HistorySideBar from "../../components/UI/HistorySideBar";

const Dashboard = () => {
  const { isOpen, closeModal } = useTaskModal(); 

  return (
    <div
      className="h-screen w-full flex flex-col transition-colors"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <Header />
      <BoardHeader />
      <Board />
      <FilterSideBar />
      <HistorySideBar />
      <TaskModal
        isOpen={isOpen}
        onClose={closeModal}
        type="add"
      />
    </div>
  );
};

export default Dashboard;
