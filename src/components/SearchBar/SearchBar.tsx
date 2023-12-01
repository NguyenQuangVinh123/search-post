import React, { KeyboardEvent, useEffect, useState } from "react";
import { QueryFilter } from "../../App";

interface SearchBarProps {
  onSearch: (query: string) => void;
  queryFilter: QueryFilter;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, queryFilter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (queryFilter) {
      setSearchQuery(queryFilter.q || "");
    }
  }, [queryFilter]);
  const handleSearch = () => {
    onSearch(searchQuery);
  };
  const handleKeyBoard = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg flex items-center gap-3 flex-wrap">
      <div>Find post</div>
      <input
        type="text"
        placeholder="Search by title or body"
        className="p-1 border border-gray-300 focus:outline-none focus:border-blue-500 rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => handleKeyBoard(e)}
      />
      <button
        onClick={handleSearch}
        className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
