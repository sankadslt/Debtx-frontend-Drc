/* Purpose: This template is used for the 2.2 - Distribute TO RO.
Created Date: 2025-01-08
Created By: Geeth (eshaneperera@gmail.com)
Last Modified Date: 2025-01-08
Modified By: Geeth(eshaneperera@gmail.com)
Version: node 20
ui number : 2.2
Dependencies: tailwind css
Related Files: (routes)
Notes: This page includes a filter and a table */

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; 

const DistributeTORO = () => {
  // Sample data for the table
  const data = [
    {
      status: "Pending",
      caseId: "C001",
      date: "2025.01.05",
      amount: "15,000",
      action: "Arrears Collect",
      rtomArea: "Kegalle",
      expireDate: "2025.02.10",
      ro: "-",
    },
    {
        status: "Pending",
        caseId: "C002",
        date: "2025.01.04",
        amount: "10,000",
        action: "Arrears Collect",
        rtomArea: "Colombo",
        expireDate: "2025.02.14",
        ro: "-",
      },
      {
        status: "Pending",
        caseId: "C003",
        date: "2024.11.05",
        amount: "25,000",
        action: "Arrears Collect",
        rtomArea: "Gampaha",
        expireDate: "2025.11.20",
        ro: "-",
      },
  ];

  // State for filters and table
  const [selectedRTOM, setSelectedRTOM] = useState("");
  const [selectedArrearsBand, setSelectedArrearsBand] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

    // Filtering the data based on search query
    const filteredDataBySearch = filteredData.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 2;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredDataBySearch.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredDataBySearch.length / recordsPerPage);

  // Handle filter action
  const handleFilter = () => {
    const filtered = data.filter((item) => {
        // Validate RTOM
        const rtomValid = !selectedRTOM || item.rtomArea.includes(selectedRTOM);

        // Validate arrears band
        const arrearsBandValid = !selectedArrearsBand || (() => {
            const bandRange = selectedArrearsBand
              .split(" - ")
              .map((v) => parseFloat(v.replace(/[^0-9]/g, "")));
            const amount = parseFloat(item.amount.replace(/[^0-9]/g, ""));
            return bandRange.length === 2
              ? amount >= bandRange[0] && amount <= bandRange[1]
              : bandRange.length === 1 && amount > bandRange[0];
          })();
          

         // Validate date range
         const dateValid = !fromDate || new Date(item.date) >= new Date(fromDate);
         const expireDateValid = !toDate || new Date(item.expireDate) <= new Date(toDate);
 
         return rtomValid && arrearsBandValid && dateValid && expireDateValid;
     });
 
     setFilteredData(filtered);
     setCurrentPage(1); // Reset to the first page after filtering
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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleApprove = () => {
    if (selectedRows.size > 0) {
      setIsModalOpen(true); // Open modal if at least one row is selected
      setTimeout(() => {
        closeModal(); // Redirect after 2 seconds
      }, 2000); // Adjusted to 2 seconds
    }
  };

  const closeModal = () => {
    navigate("/drc/assigned-ro-case-log"); // Redirect after approval
  };



  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Distribution</h1>

      {/* Filter Section */}
      <div className="flex items-center justify-end gap-4 mt-20 mb-4">
        {/* RTOM Select Dropdown */}
           <select
             className={GlobalStyle.selectBox}
             value={selectedRTOM}
             onChange={(e) => setSelectedRTOM(e.target.value)}
           >
         <option value="">RTOM</option>
           {["AD", "AG", "AP", "AW", "BC", "BD", "BW"].map((RTOM) => (
             <option key={RTOM} value={RTOM}>
                {RTOM}
            </option>
            ))}
           </select>

          <select
          className={GlobalStyle.selectBox}
          value={selectedArrearsBand}
          onChange={(e) => setSelectedArrearsBand(e.target.value)}
             >
           <option value="">Arrears Band</option>
             {["5,000 - 10,000", "10,000 - 25,000", "25,000 - 50,000", "50,000 - 100,000", ">100,000"].map(
                 (band, index) => (
           <option key={`${band}-${index}`} value={band}>
                 {band}
                   </option>
                 )
                     )}
                   </select>
  
        {/* Date Picker */}
        <div className="flex flex-col mb-4">
          <div className={GlobalStyle.datePickerContainer}>
            <label className={GlobalStyle.dataPickerDate}>Date</label>
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
            placeholder="Search"
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
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Date</th>
              <th className={GlobalStyle.tableHeader}>Amount</th>
              <th className={GlobalStyle.tableHeader}>Action</th>
              <th className={GlobalStyle.tableHeader}>RTOM Area</th>
              <th className={GlobalStyle.tableHeader}>Expire Date</th>
              <th className={GlobalStyle.tableHeader}>RO</th>
            </tr>
          </thead>
          <tbody>
          {currentData.map((item, index) => (
            <tr
  key={item.caseId} // Use only caseId if it is unique
  className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
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
      <td className={GlobalStyle.tableData}>{item.caseId}</td>
      <td className={GlobalStyle.tableData}>{item.date}</td>
      <td className={GlobalStyle.tableData}>{item.amount}</td>
      <td className={GlobalStyle.tableData}>{item.action}</td>
      <td className={GlobalStyle.tableData}>{item.rtomArea}</td>
      <td className={GlobalStyle.tableData}>{item.expireDate}</td>
      <td className={GlobalStyle.tableData}>{item.ro}</td>
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

        <select
          className={GlobalStyle.selectBox}
          value={selectedRTOM}
          onChange={(e) => setSelectedRTOM(e.target.value)}
        >
          <option value="">RO</option>
          {["...", "...", "...", "...", "...", "..."].map(
            (RTOM) => (
              <option key={RTOM} value={RTOM}>
                {RTOM}
              </option>
            )
          )}
        </select>

        {/* Approve Button */}
        <button
          onClick={handleApprove}
          className={GlobalStyle.buttonPrimary}
          disabled={selectedRows.size === 0} // Disable if no rows are selected
        >
          Submit
        </button>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 text-center bg-white rounded-lg shadow-lg">
            {" "}
            {/* Added text-center here */}
            <h2 className="text-xl font-bold">Submitted</h2>
            <p>Redirecting...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributeTORO;
