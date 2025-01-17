// Purpose: This  is the Additional Request Log page.
// Created Date: 2025-01-07
// Created By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
// Last Modified Date: 2025-01-09
// Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
// Version: node 22.2.0
// ui number : v2.10
// Dependencies: tailwind css
// Notes :

import { useState } from 'react';
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {useNavigate } from "react-router-dom";
import GlobalStyle from '../../assets/prototype/GlobalStyle';

const RecoveryOfficerRequests = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [requestType, setRequestType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const rowsPerPage = 7;

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

  const requestsData = [
    {
      caseId: 'C001',
      status: 'Pending FMB',
      requestStatus: 'Pending',
      amount: '10,000',
      validityPeriod: 'mm/dd/yyyy - mm/dd/yyyy',
      drc: 'ABCD',
      requestType: 'FMB',
      requestedDate: 'mm/dd/yyyy'
    },
    {
      caseId: 'C002',
      status: 'RO nego',
      requestStatus: 'Pending',
      amount: '30,000',
      validityPeriod: 'mm/dd/yyyy - mm/dd/yyyy',
      drc: 'ABCD',
      requestType: 'Period extension',
      requestedDate: 'mm/dd/yyyy'
    },
  ];

  // Filter data based on search query
  const filteredData = requestsData.filter(row =>
    Object.values(row)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const navi = () => {
    navigate("");
  };

  const pages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

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

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Requests from Recovery Officer</h1>
      <div className="flex justify-end gap-6 items-center mb-8">
        <div className="flex items-center gap-2">
          <span className={GlobalStyle.headingMedium}>Request Type:</span>
          <select 
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            className={GlobalStyle.selectBox}
          >
            <option value="">Select</option>
            <option value="fmb">FMB</option>
            <option value="period_extension">Period Extension</option>
          </select>
        </div>

        <div className={GlobalStyle.datePickerContainer}>
          <span className={GlobalStyle.dataPickerDate}>Date </span>
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
        </div>
        {error && <span className={GlobalStyle.errorText}>{error}</span>}
        <button className={GlobalStyle.buttonPrimary}>
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

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th scope="col" className={GlobalStyle.tableHeader}>Case ID</th>
              <th scope="col" className={GlobalStyle.tableHeader}>Status</th>
              <th scope="col" className={GlobalStyle.tableHeader}>Request Status</th>
              <th scope="col" className={GlobalStyle.tableHeader}>Amount</th>
              <th scope="col" className={GlobalStyle.tableHeader}>Validity Period</th>
              <th scope="col" className={GlobalStyle.tableHeader}>DRC</th>
              <th scope="col" className={GlobalStyle.tableHeader}>Request Type</th>
              <th scope="col" className={GlobalStyle.tableHeader}>Requested date</th>
              <th scope="col" className={GlobalStyle.tableHeader}>Action</th>
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
                <td className={GlobalStyle.tableData}>{row.requestStatus}</td>
                <td className={GlobalStyle.tableData}>{row.amount}</td>
                <td className={GlobalStyle.tableData}>{row.validityPeriod}</td>
                <td className={GlobalStyle.tableData}>{row.drc}</td>
                <td className={GlobalStyle.tableData}>{row.requestType}</td>
                <td className={GlobalStyle.tableData}>{row.requestedDate}</td>
                <td
                    className={`${GlobalStyle.tableData} text-center px-6 py-4`}
                  >
                    <button
                      className={`${GlobalStyle.buttonPrimary} mx-auto`}
                      onClick={navi}
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
};


export default RecoveryOfficerRequests;