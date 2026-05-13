import "./style.css";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="searchFilterContainer">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchInput"
      />
    </div>
  );
};

export default SearchBar;
