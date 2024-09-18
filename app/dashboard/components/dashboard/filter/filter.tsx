"use client" 
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFilter } from "@fortawesome/free-solid-svg-icons";

const filter = () => {
  const [selected, setSelected] = useState("30 days");

  const timeRanges = ["12 months", "30 days", "7 days", "24 hours"];

  return (
    <div className="flex justify-between items-center space-x-4  p-2">
      {/* Time Range Buttons */}
      <div className="flex ">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelected(range)}
            className={`px-4 py-2 border rounded-md ${
              selected === range ? "bg-blue-500 text-white" : "bg-white text-black"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Action Buttons: Select Dates and Filters */}
      <div className="flex space-x-2">
        <button className="flex items-center px-4 py-2 border rounded-md bg-white text-black">
          <FontAwesomeIcon icon={faCalendar} className="mr-2" />
          Select dates
        </button>
        <button className="flex items-center px-4 py-2 border rounded-md bg-white text-black">
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          Filters
        </button>
      </div>
    </div>
  );
};

export default filter;
