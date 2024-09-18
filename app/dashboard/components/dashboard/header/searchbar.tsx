"use client"
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons"; // Search icon

const SearchBar = () => {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-2 w-full max-w-xs">
      {/* Search Icon */}
      <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search"
        className="border-none outline-none ml-2 text-gray-700 w-full"
      />
    </div>
  );
};

export default SearchBar;
