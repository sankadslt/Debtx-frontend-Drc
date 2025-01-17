/* Purpose: This template is used for the 1.A.15 DRC Assign Manager Approval
Created Date: 2025-01-07
Created By: U.H.Nandali Linara
Version: node 20
ui number : 1.A.15
Dependencies: tailwind css
Related Files: (routes)
Notes: This page includes a filter and a table */

/* Purpose: This template is used for the 1.A.15 DRC Assign Manager Approval
Created Date: 2025-01-07
Created By: U.H.Nandali Linara
Version: node 20
ui number : 1.A.15
Dependencies: tailwind css
Related Files: (routes)
Notes: This page includes a filter and a table */


import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

const DRCAssignManagerApproval = () => {
  // Sample data for the table
  const data = [
    {
      batchId: "C001",
      caseId: "C001",
      actionType: "Action",
      createdDate: "2024.11.05",
      drc: "CMS",
      caseAmount: "100",
      approvedBy: "Pending",
      approvedOn: "mm/dd/yyyy",
    },
    {
      batchId: "",
      caseId: "C002",
      actionType: "Review",
      createdDate: "2024.11.06",
      drc: "RE",
      caseAmount: "100",
      approvedBy: "Pending",
      approvedOn: "mm/dd/yyyy",
    },
    {
      batchId: "",
      caseId: "C003",
      actionType: "Assignment",
      createdDate: "2024.11.07",
      drc: "CO LAN",
      caseAmount: "100",
      approvedBy: "Pending",
      approvedOn: "mm/dd/yyyy",
    },
    {
      batchId: "",
      caseId: "C004",
      createdDate: "2024.11.08",
      actionType: "Verification",
      drc: "ACCIVA",
      caseAmount: "600",
      approvedBy: "Pending",
      approvedOn: "mm/dd/yyyy",
    },
    {
      batchId: "C003",
      caseId: "C006",
      createdDate: "2024.11.09",
      actionType: "Approval",
      drc: "PROMPT",
      caseAmount: "800",
      approvedBy: "Pending",
      approvedOn: "mm/dd/yyyy",
    },
    {
      batchId: "C004",
      caseId: "C007",
      createdDate: "2024.11.09",
      actionType: "Approval",
      drc: "PROMPT",
      caseAmount: "900",
      approvedBy: "Pending",
      approvedOn: "mm/dd/yyyy",
    },
    {
      batchId: "C005",
      caseId: "C008",
      createdDate: "2024.11.09",
      actionType: "Approval",
      drc: "PROMPT",
      caseAmount: "1000",
      approvedBy: "Pending",
      approvedOn: "mm/dd/yyyy",
    },
    {
      batchId: "C008",
      caseId: "C010",
      createdDate: "2024.11.09",
      actionType: "Approval",
      drc: "PROMPT",
      caseAmount: "1300",
      approvedBy: "Pending",
      approvedOn: "mm/dd/yyyy",
    },
    {
      batchId: "C011",
      caseId: "C011",
      createdDate: "2024.11.09",
      actionType: "Approval",
      drc: "PROMPT",
      caseAmount: "1400",
      approvedBy: "Pending",
      approvedOn: "mm/dd/yyyy",
    },
  ];

  // State for filters and table
  const [selectedDRC, setSelectedDRC] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // Filtering the data based on search query
  const filteredDataBySearch = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

// Apply pagination to the search-filtered data
const currentData = filteredDataBySearch.slice(
  indexOfFirstRecord,
  indexOfLastRecord
);
const totalPages = Math.ceil(filteredDataBySearch.length / recordsPerPage);

  // Modified handleDRCChange to only update state without filtering
  const handleDRCChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedDRC(selectedValue);
  };

  // Handle filter action - all filtering happens here
  const handleFilter = () => {
    const filtered = data.filter((item) => {
      const drcMatch = selectedDRC === "" || item.drc === selectedDRC;
      const createdDateValid = !fromDate || new Date(item.createdDate) >= new Date(fromDate);
      const approvedOnValid =
        !toDate ||
        item.approvedOn === "mm/dd/yyyy" ||
        new Date(item.approvedOn) <= new Date(toDate);
      return drcMatch && createdDateValid && approvedOnValid;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle checkbox selection
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

  const handleCreateTask = () => {
    alert("Create Task and Let Me Know button clicked!");
  };
  
  const handleApprove = () => {
    alert("Approve button clicked!");
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>DRC Assign Manager Approval</h1>

      {/* Filter Section */}
      <div className="flex px-3 py-2 items-center justify-end gap-4 mt-20 mb-4">
        {/* DRC Select Dropdown */}
        <select
          className={GlobalStyle.selectBox}
          value={selectedDRC}
          onChange={handleDRCChange}
        >
          <option value="">DRC</option>
          {["CMS", "TCM", "RE", "CO LAN", "ACCIVA", "VISONCOM", "PROMPT"].map(
            (drc) => (
              <option key={drc} value={drc}>
                {drc}
              </option>
            )
          )}
        </select>

        

        {/* Date Picker */}
        <div className="flex items-center gap-2">
          <div className={GlobalStyle.datePickerContainer}>
            <label className={GlobalStyle.dataPickerDate}>Date </label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className={GlobalStyle.inputText}
            />
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className={GlobalStyle.inputText}
            />
          </div>
        </div>

        <select
          className={GlobalStyle.selectBox}
          value={selectedDRC}
          onChange={handleDRCChange}
        >
          <option value="">Status</option>
          {["Pending", "Approved", "Rejected"].map(
            (drc) => (
              <option key={drc} value={drc}>
                {drc}
              </option>
            )
          )}
        </select>

        {/* Filter Button */}
        <button
          onClick={handleFilter}
          className={`${GlobalStyle.buttonPrimary}`}
        >
          Filter
        </button>
      </div>

      {/* Search Section */}
      <div className="flex justify-start mb-4">
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

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}></th>
              <th className={GlobalStyle.tableHeader}>Batch ID</th>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Action Type</th>
              <th className={GlobalStyle.tableHeader}>Created Date</th>
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>Case Count</th>
              <th className={GlobalStyle.tableHeader}>Approved By</th>
              <th className={GlobalStyle.tableHeader}>Approved On</th>
            </tr>
          </thead>
          <tbody>
  {currentData.map((item, index) => (
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
      <td className={GlobalStyle.tableData}>{item.batchId}</td>
      <td className={GlobalStyle.tableData}>{item.caseId}</td>
      <td className={GlobalStyle.tableData}>{item.actionType}</td>
      <td className={GlobalStyle.tableData}>{item.createdDate}</td>
      <td className={GlobalStyle.tableData}>{item.drc}</td>
      <td className={GlobalStyle.tableData}>{item.caseAmount}</td>
      <td className={GlobalStyle.tableData}>{item.approvedBy}</td>
      <td className={GlobalStyle.tableData}>{item.approvedOn}</td>
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
    
{/* Select All Data Checkbox and Buttons */}
<div className="flex justify-between items-center mt-4">
  {/* Left-aligned button */}
  <button
    onClick={handleCreateTask}
    className={GlobalStyle.buttonPrimary} // Same style as Approve button
  >
    Create Task and Let Me Know
  </button>

  {/* Right-aligned checkbox and Approve button */}
  <div className="flex items-center gap-4">
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        className="rounded-lg"
        checked={selectAll}
        onChange={handleSelectAll}
      />
      Select All Data
    </label>

    <button
      onClick={handleApprove}
      className={GlobalStyle.buttonPrimary}
      disabled={selectedRows.size === 0}
    >
      Approve
    </button>
  </div>
</div>

    </div>
  );
};

export default DRCAssignManagerApproval;

