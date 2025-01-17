/*Purpose:
Created Date: 2025-01-09
Created By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Version: React v18
ui number : 1.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";

const Incident_List = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const rowsPerPage = 7;
    const [fromDate, setFromDate] = useState(null); //for date
    const [toDate, setToDate] = useState(null); // for date
    const [error, setError] = useState(""); // for error message

    const [status1, setStatus1] = useState("");
    const [status2, setStatus2] = useState("");



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

    const [appliedFilters, setAppliedFilters] = useState({
        actionType: "",
        status: "",
        dateRange: { from: "", to: "" }
    });

    const data = [
        { caseID: "001", status: "Open", accountNo: "1234567890", action: "Pending Review", createdDTM: "2025-01-01" },
        { caseID: "002", status: "Closed", accountNo: "9876543210", action: "Reviewed", createdDTM: "2025-01-02" },
        { caseID: "003", status: "Pending", accountNo: "1122334455", action: "In Progress", createdDTM: "2025-01-03" },
        { caseID: "004", status: "Open", accountNo: "5566778899", action: "Awaiting Approval", createdDTM: "2025-01-04" },
        { caseID: "005", status: "Closed", accountNo: "9988776655", action: "Completed", createdDTM: "2025-01-05" },
        { caseID: "006", status: "Pending", accountNo: "4433221100", action: "Pending Response", createdDTM: "2025-01-06" },
        { caseID: "007", status: "Open", accountNo: "6655443322", action: "Action Required", createdDTM: "2025-01-07" },
        { caseID: "008", status: "Pending", accountNo: "4433221100", action: "Pending Response", createdDTM: "2025-01-06" },
        { caseID: "009", status: "Open", accountNo: "6655443322", action: "Action Required", createdDTM: "2025-01-07" },
    ];


    const filteredData = data
        .filter((row) =>
            Object.values(row)
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
        .filter((row) =>
            (appliedFilters.actionType ? row.action.toLowerCase() === appliedFilters.actionType.toLowerCase() : true) &&
            (appliedFilters.status ? row.status.toLowerCase() === appliedFilters.status.toLowerCase() : true) &&
            (appliedFilters.dateRange.from && appliedFilters.dateRange.to
                ? new Date(row.createdDTM) >= new Date(appliedFilters.dateRange.from) && 
                  new Date(row.createdDTM) <= new Date(appliedFilters.dateRange.to)
                : true)
        );

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

    const handleFilter = () => {
        if (!fromDate || !toDate) {
          setError("Both 'From' and 'To' dates must be selected.");
          return;
        }
      
        setAppliedFilters({
          actionType: status1,
          status: status2,
          dateRange: { from: fromDate, to: toDate },
        });
      
        setError(""); 
        setCurrentPage(0); 
      };
      

    const HandleAddIncident = () => {
        const navigate = useNavigate();
        navigate('/add-incident');
    };

    const HandleCreateTask = () => {
        const navigate = useNavigate();
        navigate('/add-incident');
    };

    return (
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>Incident Log</h2>

            <div className="flex justify-end mt-6">
                <button onClick={HandleAddIncident} className={GlobalStyle.buttonPrimary}>
                    Add Incident
                </button>
            </div>

            <div className="w-full mb-8 mt-8">
                {/* Dropdowns Section */}
                <div className="flex items-center justify-end w-full space-x-6">

                    <select
                        value={status1}
                        onChange={(e) => setStatus1(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Action Type</option>
                        <option value="Pending Review">Pending Review</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Awaiting Approval">Awaiting Approval</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending Response">Pending Response</option>
                        <option value="Action Required">Action Required</option>
                    </select>


                    <select
                        value={status2}
                        onChange={(e) => setStatus2(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Status</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                    </select>


                    <div className="flex flex-col mb-4">
        <div className={GlobalStyle.datePickerContainer}>
          <label className={GlobalStyle.dataPickerDate}>Date </label>
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
      </div>


                    <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>
                        Filter
                    </button>
                </div>
            </div>


            <div className="mb-4 flex justify-start">
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

            <div className={GlobalStyle.tableContainer}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                ID
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Status
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Account No.
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Action
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Created DTM
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((log, index) => (
                            <tr
                                key={index}
                                className={`${index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"} border-b`}
                            >
                                <td className={GlobalStyle.tableData}>{log.caseID}</td>
                                <td className={GlobalStyle.tableData}>{log.status}</td>
                                <td className={GlobalStyle.tableData}>{log.accountNo}</td>
                                <td className={GlobalStyle.tableData}>{log.action}</td>
                                <td className={GlobalStyle.tableData}>{log.createdDTM}</td>
                            </tr>
                        ))}
                        {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    No logs found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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

            {/* Create task button */}
            <div className="flex justify-end mt-6">
                <button onClick={HandleCreateTask} className={GlobalStyle.buttonPrimary}>
                    Create task and let me know
                </button>
            </div>
        </div>
    );
};

export default Incident_List;
