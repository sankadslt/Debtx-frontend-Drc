// Purpose: This template is used for the Assigned DRC Summary page (1.C.13).
// Created Date: 2025-01-07
// Created By: H.P.R Chandrasekara (hprchandrasekara@gmail.com)
// Last Modified Date:  2025-01-07
// Modified Date:  2025-01-07
// Modified By: H.P.R Chandrasekara (hprchandrasekara@gmail.com)
// Version: node 11
// ui number :1.C.13
// Dependencies: tailwind css
// Related Files:  app.js (routes)
// Notes:.

import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function AssignedDRCSummaryCollectCPE() {
  const data = [
    {
      status: "open no agent",
      createdDate: "2025.01.05",
      drc: "DRC1",
      caseCount: "100",
    },
    {
      status: "open no agent1",
      createdDate: "2025.01.06",
      drc: "DRC1",
      caseCount: "1001",
    },
    {
      status: "open no agent2",
      createdDate: "2025.01.06",
      drc: "DRC2",
      caseCount: "1001",
    },
    {
      status: "open no agent3",
      createdDate: "2025.01.08",
      drc: "DRC3",
      caseCount: "100",
    },
    {
      status: "open no agent3",
      createdDate: "2025.01.08",
      drc: "DRC3",
      caseCount: "100",
    },
    {
      status: "open no agent3",
      createdDate: "2025.01.08",
      drc: "DRC3",
      caseCount: "100",
    },
  ];

  // State for search query and filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState(data);
  const [drcFilter, setDrcFilter] = useState(""); // DRC filter state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  // Filter data based on selected filters
  const applyFilters = () => {
    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.createdDate.split(".").join("-")); // Convert item date to Date object

      // Apply DRC filter
      const isDRCMatch = drcFilter
        ? item.drc.toLowerCase().includes(drcFilter.toLowerCase())
        : true;

      // Apply Date Range filter
      const isDateInRange =
        (!startDate || itemDate >= new Date(startDate)) &&
        (!endDate || itemDate <= new Date(endDate));

      return isDRCMatch && isDateInRange;
    });

    setFilteredData(filteredData);
  };
  // Handle pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filtering the data based on search query
  const filteredDataBySearch = currentData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Select rows state
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(new Set(currentData.map((_, index) => index)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleRowSelect = (index) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }
    setSelectedRows(newSelectedRows);
  };

  function onSubmit() {
    alert("Create task and let me know");
  }
  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Assigned DRC Summary</h1>
      <div className="flex justify-between mt-16 mb-6">
        <div className="flex justify-start mb-8">
          <div className={GlobalStyle.searchBarContainer}>
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={GlobalStyle.inputSearch}
            />
            <FaSearch className={GlobalStyle.searchBarIcon} />
          </div>
        </div>

        <div className="flex gap-10">
          {" "}
          <div className="flex gap-4 h-[35px] mt-2">
            <h1>DRC</h1>
            <select
              className={GlobalStyle.selectBox}
              value={drcFilter}
              onChange={(e) => setDrcFilter(e.target.value)}
            >
              <option value="" selected>
                ALL
              </option>
              <option value="DRC1">DRC1</option>
              <option value="DRC2">DRC2</option>
              <option value="DRC3">DRC3</option>
            </select>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className={GlobalStyle.datePickerContainer}>
              <label className={GlobalStyle.dataPickerDate}>Date </label>

              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={GlobalStyle.inputText}
              />

              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={GlobalStyle.inputText}
              />
            </div>
          </div>
          <button
            onClick={applyFilters}
            className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2`}
          >
            Filter
          </button>
        </div>
      </div>

      {/* Search Section */}

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>
                {/* <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mx-auto"
                /> */}
              </th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Created Date</th>
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>Case count</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.map((item, index) => (
              <tr
                key={item.caseId}
                className={
                  index % 2 === 0
                    ? GlobalStyle.tableRowEven
                    : GlobalStyle.tableRowOdd
                }
              >
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(index)}
                    onChange={() => handleRowSelect(index)}
                    className="mx-auto"
                  />
                </td>
                <td className={GlobalStyle.tableData}>{item.status}</td>
                <td className={GlobalStyle.tableData}>{item.createdDate}</td>
                <td className={GlobalStyle.tableData}>{item.drc}</td>
                <td className={GlobalStyle.tableData}>{item.caseCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className={GlobalStyle.navButtonContainer}>
        <button
          onClick={() => handlePrevNext("prev")}
          disabled={currentPage === 1}
          className={`${GlobalStyle.navButton} ${
            currentPage === 1 ? "cursor-not-allowed" : ""
          }`}
        >
          <FaArrowLeft />
        </button>
        <span className={`${GlobalStyle.pageIndicator} mx-4`}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePrevNext("next")}
          disabled={currentPage === totalPages}
          className={`${GlobalStyle.navButton} ${
            currentPage === totalPages ? "cursor-not-allowed" : ""
          }`}
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Select All Data Checkbox and Approve Button */}
      <div className="flex justify-end gap-4 mt-4">
        {/* Select All Data Checkbox */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-lg"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          Select All Data
        </label>

        {/* Approve Button */}
        <button
          onClick={onSubmit}
          className={GlobalStyle.buttonPrimary}
          //   disabled={selectedRows.size === 0} // Disable if no rows are selected
        >
          Create task and let me know
        </button>
      </div>
    </div>
  );
}
