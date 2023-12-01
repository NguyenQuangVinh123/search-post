import React, { useState, useEffect, KeyboardEvent } from "react";
import { QueryFilter } from "../../App";

interface FilterDropdownProps {
  onFilter: (filters: any) => void;
  allTags: string[];
  queryFilter: QueryFilter;
  isOpenFilter: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  onFilter,
  allTags,
  queryFilter,
  isOpenFilter = false,
}) => {
  const [userId, setUserId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minReactions, setMinReactions] = useState<number>(0);

  const handleFilter = () => {
    const filters = {
      userId: userId || "",
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      minReactions: minReactions ? minReactions : undefined,
    };

    onFilter(filters);
  };
  const resetFilter = () => {
    setUserId("");
    setSelectedTags([]);
    setMinReactions(0);
  };
  useEffect(() => {
    handleFilter();
  }, [selectedTags, minReactions, userId]);
  const handleKeyBoard = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      handleFilter();
    }
  };
  useEffect(() => {
    if (queryFilter) {
      setUserId(queryFilter.userId || "");
      setSelectedTags(queryFilter.tags?.split(",") || []);
      setMinReactions(queryFilter.minReactions || 0);
    }
  }, [queryFilter]);
  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg">
      <div className="flex mb-2 items-center">
        <div className="mr-2">User ID:</div>
        <input
          type="number"
          value={userId}
          min="1"
          onChange={(e) => setUserId(e.target.value)}
          className="p-1 border border-gray-300 focus:outline-none focus:border-blue-500 rounded"
        />
      </div>
      <div className="flex mb-2">
        <label className="mr-2">Tags:</label>
        <div className="flex flex-wrap">
          {allTags.map((tag) => (
            <label key={tag} className="mr-2">
              <input
                type="checkbox"
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => {
                  setSelectedTags((prevTags) =>
                    prevTags.includes(tag)
                      ? prevTags.filter((prevTag) => prevTag !== tag)
                      : [...prevTags, tag]
                  );
                }}
                className="mr-1"
                onKeyDown={(e) => handleKeyBoard(e)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-7 items-center">
        <div className="mb-2 inline-block">Min Reactions:</div>
        <input
          type="range"
          className="transparent h-[4px] cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600"
          min="0"
          max="5"
          id="customRange2"
          value={minReactions}
          onChange={(e) => setMinReactions(parseInt(e.target.value))}
        />
        {minReactions}
      </div>

      <button
        onClick={resetFilter}
        className="mt-2 p-2 bg-blue-500 text-white rounded cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterDropdown;
