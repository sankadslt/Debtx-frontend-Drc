// Purpose: This template is used for Request Response Log
// Created Date: 2025/01/07
// Created By:W.R.S.M.Bandara
// Last Modified Date: 2025/01/09
// Modified By: savindyabandara413@gmail.com
// Version: node 11
// ui number : v2.14
// Dependencies: tailwind css
// Related Files:
// Notes: This template uses a tailwind css form for the styling

import React, { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const RequestResponseLog = () => {
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState(null); // From date
  const [toDate, setToDate] = useState(null); // To date
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [currentPage, setCurrentPage] = useState(0);

  const statuses = ["Pending FMB", "Inprogress"];
  const rowsPerPage = 5;

  const Data = [
    {
      caseId: "C001",
      status: "Pending FMB",
      requestStatus: "Open",
      validityPeriod: "11/12/2024 - 11/23/2024",
      drc: "ABCD",
      requestDetails: "...",
      approvedOn: "11/15/2024",
      approvedBy: "RO",
      remark: "RO",
    },
    {
      caseId: "C002",
      status: "Pending FMB",
      requestStatus: "Close",
      validityPeriod: "04/12/2024 - 12/05/2024",
      drc: "ABCD",
      requestDetails: "...",
      approvedOn: "12/01/2024",
      approvedBy: "RO",
      remark: "RO",
    },
    {
      caseId: "C003",
      status: "Inprogress",
      requestStatus: "Open",
      validityPeriod: "04/20/2024 - 12/24/2024",
      drc: "ABCD",
      requestDetails: "...",
      approvedOn: "12/15/2024",
      approvedBy: "RO",
      remark: "RO",
    },
    {
      caseId: "C004",
      status: "Inprogress",
      requestStatus: "Open",
      validityPeriod: "04/20/2024 - 12/24/2024",
      drc: "ABCD",
      requestDetails: "...",
      approvedOn: "12/15/2024",
      approvedBy: "RO",
      remark: "RO",
    },
    {
      caseId: "C005",
      status: "Inprogress",
      requestStatus: "Open",
      validityPeriod: "04/20/2024 - 12/24/2024",
      drc: "ABCD",
      requestDetails: "...",
      approvedOn: "12/15/2024",
      approvedBy: "RO",
      remark: "RO",
    },
    {
      caseId: "C006",
      status: "Pending FMB",
      requestStatus: "Close",
      validityPeriod: "04/12/2024 - 12/05/2024",
      drc: "ABCD",
      requestDetails: "...",
      approvedOn: "12/01/2024",
      approvedBy: "RO",
      remark: "RO",
    },
  ];

  // Filtered data based on applied filters
  const filteredData = Data.filter((row) => {
    const matchesSearchQuery = Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = !status || row.status === status;
    const approvedOnDate = new Date(row.approvedOn);
    const matchesDateRange =
      (!fromDate || approvedOnDate >= fromDate) &&
      (!toDate || approvedOnDate <= toDate);

    return matchesSearchQuery && matchesStatus && matchesDateRange;
  });

  const pages = Math.ceil(filteredData.length / rowsPerPage);

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Pagination indexes
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleTask =()=>{
    alert("Task Created");
    //add a navigate function to navigate another page
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Request Response Log</h1>
      <div className="flex flex-col mb-10">
        <div className="flex gap-4 justify-end">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={GlobalStyle.selectBox}
          >
            <option value="">Select Status</option>
            {statuses.map((statusOption, index) => (
              <option key={index} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
          <div className={GlobalStyle.datePickerContainer}>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="From Date"
              className={GlobalStyle.inputText}
            />
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="To Date"
              className={GlobalStyle.inputText}
            />
          </div>
          <button
            onClick={() => setCurrentPage(0)} // Reset pagination on filter
            className={GlobalStyle.buttonPrimary}
          >
            Filter
          </button>
        </div>
      </div>
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Request Status</th>
              <th className={GlobalStyle.tableHeader}>Validity Period</th>
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>Request Details</th>
              <th className={GlobalStyle.tableHeader}>Approved On</th>
              <th className={GlobalStyle.tableHeader}>Approved By</th>
              <th className={GlobalStyle.tableHeader}>Remark</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((detail, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0
                    ? "bg-white bg-opacity-75"
                    : "bg-gray-50 bg-opacity-50"
                } border-b`}
              >
                <td className={GlobalStyle.tableData}>{detail.caseId}</td>
                <td className={GlobalStyle.tableData}>{detail.status}</td>
                <td className={GlobalStyle.tableData}>
                  {detail.requestStatus}
                </td>
                <td className={GlobalStyle.tableData}>
                  {detail.validityPeriod}
                </td>
                <td className={GlobalStyle.tableData}>{detail.drc}</td>
                <td className={GlobalStyle.tableData}>
                  {detail.requestDetails}
                </td>
                <td className={GlobalStyle.tableData}>{detail.approvedOn}</td>
                <td className={GlobalStyle.tableData}>{detail.approvedBy}</td>
                <td className={GlobalStyle.tableData}>{detail.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredData.length > rowsPerPage && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            className={GlobalStyle.navButton}
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            <FaArrowLeft />
          </button>
          <span>
            Page {currentPage + 1} of {pages}
          </span>
          <button
            className={GlobalStyle.navButton}
            onClick={handleNextPage}
            disabled={currentPage === pages - 1}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
      <div className="flex gap-4 justify-end">
        <button className={GlobalStyle.buttonPrimary}
        onClick={handleTask}>
          Create task and let me know
        </button>
      </div>
    </div>
  );
};

export default RequestResponseLog;
