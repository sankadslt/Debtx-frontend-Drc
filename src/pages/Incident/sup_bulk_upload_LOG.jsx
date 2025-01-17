/*Purpose: 
Created Date: 2025-01-09
Created By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Version: React v18
ui number : 1.2
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";

const SupBulkUploadLog = () => {
 
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [status, setStatus] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterFromDate, setFilterFromDate] = useState(null);
    const [filterToDate, setFilterToDate] = useState(null);
    const rowsPerPage = 7;


    const handleFromDateChange = (date) => {
        if (toDate && date > toDate) {
            setError("The 'From' date cannot be later than the 'To' date.");
        } else {
            setError("");
            setFromDate(date);
        }
    };

    const handleToDateChange = (date) => {
        if (fromDate && date < fromDate) {
            setError("The 'To' date cannot be earlier than the 'From' date.");
        } else {
            setError("");
            setToDate(date);
        }
    };


    const data = [
        {
            dateTime: "2024.11.04",
            createdTime: "1 pm",
            uploadedBy: "ABCD",
            fileName: "Unit Collection 11.05.csv",
            type: "Incident creation",
            status: "Success"
        },
        {
            dateTime: "2024.11.04",
            createdTime: "2 pm",
            uploadedBy: "EFGH",
            fileName: "Bulk Upload 11.05.csv",
            type: "Incident update",
            status: "Failed"
        },

    ];

   
    const handleFilter = () => {
        setFilterStatus(status);
        setFilterFromDate(fromDate);
        setFilterToDate(toDate);
        setCurrentPage(0);
    };

  
    const filteredData = data.filter((row) => {
        const matchesSearch = Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus = !filterStatus || row.status.toLowerCase() === filterStatus.toLowerCase();

     
        const rowDate = new Date(row.dateTime);
        const matchesDateRange = (!filterFromDate || rowDate >= filterFromDate) &&
            (!filterToDate || rowDate <= filterToDate);

        return matchesSearch && matchesStatus && matchesDateRange;
    });

 
    const pages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);


    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < pages - 1) setCurrentPage(currentPage + 1);
    };

 
    const handleUploadClick = () => {
        
        console.log("Upload button clicked");
    };

    return (
        <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
            <h1 className={GlobalStyle.headingLarge}>Incident Upload Log</h1>

            {/* Upload Button */}
            <div className="flex justify-end mb-6">
                <button 
                    className={GlobalStyle.buttonPrimary}
                    onClick={handleUploadClick}
                >
                    Upload a new file
                </button>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <span>Status:</span>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">All</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                    </select>

                    <label className={GlobalStyle.dataPickerDate}>Date:</label>
                    <DatePicker
                        selected={fromDate}
                        onChange={handleFromDateChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="From"
                        className={GlobalStyle.inputText}
                    />
                    <span>To:</span>
                    <DatePicker
                        selected={toDate}
                        onChange={handleToDateChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="To"
                        className={GlobalStyle.inputText}
                    />
                    <button
                        className={GlobalStyle.buttonPrimary}
                        onClick={handleFilter}
                    >
                        Filter
                    </button>
                </div>
                {error && <span className={GlobalStyle.errorText}>{error}</span>}
            </div>


            {/* Table Section */}
            <div className="flex flex-col">
                {/* Search Bar */}
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


                {/* Table */}
                <div className={GlobalStyle.tableContainer}>
                    <table className={GlobalStyle.table}>
                        <thead className={GlobalStyle.thead}>
                            <tr>
                                <th className={GlobalStyle.tableHeader}>Date & time</th>
                                <th className={GlobalStyle.tableHeader}>Created Time</th>
                                <th className={GlobalStyle.tableHeader}>Uploaded By</th>
                                <th className={GlobalStyle.tableHeader}>Status</th>
                                <th className={GlobalStyle.tableHeader}>File Name</th>
                                <th className={GlobalStyle.tableHeader}>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((row, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                                >
                                    <td className={GlobalStyle.tableData}>{row.dateTime}</td>
                                    <td className={GlobalStyle.tableData}>{row.createdTime}</td>
                                    <td className={GlobalStyle.tableData}>{row.uploadedBy}</td>
                                    <td className={GlobalStyle.tableData}>
                                        <span
                                            className={`px-2 py-1 rounded-full ${row.status.toLowerCase() === "success"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className={GlobalStyle.tableData}>{row.fileName}</td>
                                    <td className={GlobalStyle.tableData}>{row.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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
        </div>
    );
};

export default SupBulkUploadLog;
