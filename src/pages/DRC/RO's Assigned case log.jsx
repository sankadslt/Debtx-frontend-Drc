/* Purpose: This template is used for the 2.6 - RO's Assigned case log .
Created Date: 2024-01-08
Created By: Chamath (chamathjayasanka20@gmail.com)
Last Modified Date:2025-01-08
Version: node 20
ui number : 2.6
Dependencies: tailwind css
Related Files: (routes)
Notes:  The following page conatins the code for the RO's Assigned case log Screen */


import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
// import { listDRCAllCases } from "../../services/case/CaseService";


export default function ROsAssignedcaselog() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const rowsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [roList, setRoList] = useState([]);

  // API Call to fetch assigned cases
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const params = {
          drc_id: "DRC123", 
          ro_id: "RO456",
          From_DAT: "2024-01-01",
          TO_DAT: "2024-01-31",
          case_current_status: "Open",
        };
        const response = await listDRCAllCases(params);
        if (response.status === "success") {
          setCases(response.data);
        } else {
          setError(response.message || "Failed to fetch cases.");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCases();
  }, []);

  const handleFilter = () => {
    let filtered = cases;

    if (selectedStatus) {
      filtered = filtered.filter((item) => item.case_status === selectedStatus);
    }

    if (fromDate && toDate) {
      filtered = filtered.filter((item) => {
        const caseDate = new Date(item.date);
        return caseDate >= fromDate && caseDate <= toDate;
      });
    }

    setFilteredCases(filtered);
    setCurrentPage(0);
  };

 

  const pages = Math.ceil(cases.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const paginatedData = cases.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <h1 className={GlobalStyle.headingLarge}>Case List</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-4 items-center justify-end flex-wrap mt-4 ">
        {/* Dropdown for Status */}
        <select
          className={GlobalStyle.selectBox}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="">Open</option>
          <option value=""> Pending</option>
          <option value=""> Close</option>
        </select>

        <div className={`${GlobalStyle.datePickerContainer} flex gap-2`}>
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
        <button
          onClick={handleFilter}
          className={`${GlobalStyle.buttonPrimary}`}
        >
          Filter
        </button>
      </div>

      {/* Search Section */}
      <div className="flex justify-start mt-10 mb-4">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
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
              <th className={GlobalStyle.tableHeader}>Date</th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Name</th>
              <th className={GlobalStyle.tableHeader}>Contact No</th>
              <th className={GlobalStyle.tableHeader}>RTOM</th>
              <th className={GlobalStyle.tableHeader}>Action</th>
              <th className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className={GlobalStyle.tableData}>{item.date}</td>
                <td className={GlobalStyle.tableData}>{item.case_status}</td>
                <td className={GlobalStyle.tableData}>{item.case_id}</td>
                <td className={GlobalStyle.tableData}>{item.name}</td>
                <td className={GlobalStyle.tableData}>{item.contact_no}</td>
                <td className={GlobalStyle.tableData}>{item.rtom}</td>
                <td className={GlobalStyle.tableData}>{item.action}</td>
                <td className={GlobalStyle.tableData}>
                  <button
                    className={`${GlobalStyle.button} ${GlobalStyle.buttonPrimary}`}
                  >
                    Edit
                  </button>
                  <button
                    className={`${GlobalStyle.button} ${GlobalStyle.buttonPrimary}`}
                  >
                    Negotiation
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className={GlobalStyle.navButtonContainer}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          className={GlobalStyle.navButton}
        >
          <FaArrowLeft />
        </button>
        <span>
          Page {currentPage + 1} of {pages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, pages - 1))
          }
          className={GlobalStyle.navButton}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
