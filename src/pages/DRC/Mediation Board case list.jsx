/* Purpose: This template is used for the 2.15 - Mediation Board case list .
Created Date: 2024-01-08
Created By: Chamath (chamathjayasanka20@gmail.com)
Last Modified Date:2025-01-08
Last Modified Date:2025-02-01
Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
Version: node 20
ui number : 2.15
Dependencies: tailwind css
Related Files: (routes)
Notes:  The following page conatins the code for the Mediation Board case list Screen */

import React, { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

export default function MediationBoardcaselist() {
  const [fromDate, setFromDate] = useState(null); //for date
  const [toDate, setToDate] = useState(null); // for date
  const [error, setError] = useState(""); // for error message
  const [currentPage, setCurrentPage] = useState(0); // For managing the current page
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const rowsPerPage = 7; // Number of rows per page

  // validation for date
  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      setError("The 'From' date cannot be later than the 'To' date.");
    } else {
      setError("");
      setFromDate(date);
    }
  };

  // validation for date
  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      setError("The 'To' date cannot be earlier than the 'From' date.");
    } else {
      setError("");
      setToDate(date);
    }
  };


  //dummy data for table
  const data = [
    {
      caseId: "C001",
      status: "pending",
      date: "05/16/2024",
      name: "Silva Perera",
      contactNo: "0112345678",
      rtom: "RTOM 01",
      action: "Arrears Collect",
    },
    {
      caseId: "C002",
      status: "pending",
      date: "05/17/2024",
      name: "Kamal Fernando",
      contactNo: "0112233445",
      rtom: "RTOM 02",
      action: "Payment Follow-Up",
    },
    {
      caseId: "C001",
      status: "pending",
      date: "05/16/2024",
      name: "Silva Perera",
      contactNo: "0112345678",
      rtom: "RTOM 01",
      action: "Arrears Collect",
    },
    {
      caseId: "C002",
      status: "pending",
      date: "05/17/2024",
      name: "Kamal Fernando",
      contactNo: "0112233445",
      rtom: "RTOM 02",
      action: "Payment Follow-Up",
    },
  ];

  //search fuction
  const filteredData = data.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleOpen = () => {
    alert("Open button clicked");
  };

  const pages = Math.ceil(filteredData.length / rowsPerPage);

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

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Mediation Board Case List</h1>

      {/* Filter Section */}
      <div className="flex justify-end gap-10 my-6 items-center">
        {/* Source Dropdown */}
        <div className="flex items-center gap-4">
        <select className={GlobalStyle.selectBox}>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        </div>

        {/* Date Picker Section */}
        <div className="flex items-center gap-4">
          <label>Date:</label>
          <DatePicker
            selected={fromDate}
            onChange={handleFromDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/MM/yyyy"
            className={GlobalStyle.inputText}
          />
          <DatePicker
            selected={toDate}
            onChange={handleToDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/MM/yyyy"
            className={GlobalStyle.inputText}
          />
          {error && <span className={GlobalStyle.errorText}>{error}</span>}
        </div>

        {/* Filter Button */}
        <button
          className={`${GlobalStyle.buttonPrimary} h-[35px]`}
          onClick={() => {}}
        >
          Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        {/* Search Bar Section */}
        <div className="mb-4 flex justify-start">
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

        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Case ID
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Status
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Date
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Name
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Contact No
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  RTOM
                </th>

                <th scope="col" className={GlobalStyle.tableHeader}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white bg-opacity-75"
                      : "bg-gray-50 bg-opacity-50"
                  } border-b`}
                >
                  <td className={GlobalStyle.tableData}>
                    <a href={`#${row.caseId}`} className="hover:underline">
                      {row.caseId}
                    </a>
                  </td>
                  <td className={GlobalStyle.tableData}>{row.status}</td>
                  <td className={GlobalStyle.tableData}>{row.date}</td>
                  <td className={GlobalStyle.tableData}>{row.name}</td>
                  <td className={GlobalStyle.tableData}>{row.contactNo}</td>
                  <td className={GlobalStyle.tableData}>{row.rtom}</td>

                  <td className={GlobalStyle.tableData}>
                    <button
                      className={`${GlobalStyle.button} ${GlobalStyle.buttonPrimary}`}
                      style={{ marginRight: "10px" }}
                      onClick={handleOpen}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Buttons */}
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
    </div>
  );
}
