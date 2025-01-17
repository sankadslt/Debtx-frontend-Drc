// Purpose: This template is used for the DRC Case List page (1.A.17).
// Created Date: 2024-01-07
// Created By: H.P.R Chandrasekara (hprchandrasekara@gmail.com)
// Last Modified Date: 2024-01-07
// Modified Date: 2024-01-07
// Modified By: H.P.R Chandrasekara (hprchandrasekara@gmail.com)
// Version: node 11
// ui number :1.A.17
// Dependencies: tailwind css
// Related Files:  app.js (routes)
// Notes:.
import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Import GlobalStyle

export default function AssignDRCsLOG() {
  const navigate = useNavigate();

  // Table data
  const tableData = [
    {
      status: "Pending",
      caseId: "87234",
      accountNo: "12345",
      amount: "15,000",
      assignedDate: "2024-11-01",
      endDate: "2024-11-10",
    },
    {
      status: "Pending",
      caseId: "87235",
      accountNo: "54321",
      amount: "20,000",
      assignedDate: "2024-11-05",
      endDate: "2024-11-15",
    },
    {
      status: "Closed",
      caseId: "87236",
      accountNo: "67890",
      amount: "50,000",
      assignedDate: "2024-11-07",
      endDate: "2024-11-20",
    },
    {
      status: "Closed",
      caseId: "87236",
      accountNo: "67890",
      amount: "50,000",
      assignedDate: "2024-11-07",
      endDate: "2024-11-20",
    },
    {
      status: "Closed",
      caseId: "87236",
      accountNo: "67890",
      amount: "50,000",
      assignedDate: "2024-11-07",
      endDate: "2024-11-20",
    },
    {
      status: "Closed",
      caseId: "87236",
      accountNo: "67890",
      amount: "50,000",
      assignedDate: "2024-11-07",
      endDate: "2024-11-20",
    },
    {
      status: "Closed",
      caseId: "87236",
      accountNo: "67890",
      amount: "50,000",
      assignedDate: "2024-11-07",
      endDate: "2024-11-20",
    },
  ];

  // Filter state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState(tableData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");

  //search fuction 1
  const filteredSearchData = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination state
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredSearchData.length / itemsPerPage);

  // Filter handler
  const handleFilter = () => {
    if (startDate && endDate) {
      const filtered = tableData.filter((row) => {
        const assignedDate = new Date(row.assignedDate);
        const endDate1 = new Date(row.endDate);
        return assignedDate >= startDate && endDate1 <= endDate;
      });
      handleFilterByType;
      setFilteredData(filtered);
    } else {
      setFilteredData(tableData); // Reset if dates are not selected
    }

    if (filterType && filterValue) {
      const filtered = tableData.filter((row) => {
        const valueToCheck =
          filterType === "Account No" ? row.accountNo : row.caseId;
        return valueToCheck.toLowerCase().includes(filterValue.toLowerCase());
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(tableData); // Reset to original data if no filter applied
    }
  };

  // Pagination handler
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredSearchData.slice(startIndex, endIndex);

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <h1 className={`${GlobalStyle.headingLarge}`}>DRC Case List</h1>
      <h1 className={`${GlobalStyle.headingMedium} mb-5`}>DRC : TCM</h1>

      {/* Filter Section */}
      <div className="flex justify-end gap-10 my-12">
        <div className="flex gap-10 mt-2">
          {/* Filter Dropdown (Account No or Case ID) */}
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`${GlobalStyle.selectBox} h-[36px]`}
            >
              <option value="">Select</option>
              <option value="Account No">Account No</option>
              <option value="Case ID">Case ID</option>
            </select>
          </div>

          {/* Input field for filtering based on selected type */}

          <div>
            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder={`Enter ${filterType}`}
              className={`${GlobalStyle.inputText} `}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col mb-4">
            <div className={GlobalStyle.datePickerContainer}>
              <label className={GlobalStyle.dataPickerDate}>Date </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/MM/yyyy"
                className={GlobalStyle.inputText}
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/MM/yyyy"
                className={GlobalStyle.inputText}
              />
            </div>
          </div>
        </div>
        <button
          className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2`}
          onClick={handleFilter}
        >
          Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
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
        </div>{" "}
        <div className={GlobalStyle.tableContainer}>
          <table className={`${GlobalStyle.table}`}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Case ID
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Status
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Account No
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Arrears Amount
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Assigned Date and Time
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  End Date
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
                  <td className={GlobalStyle.tableData}>{row.caseId}</td>
                  <td className={GlobalStyle.tableData}>{row.status}</td>
                  <td className={GlobalStyle.tableData}>{row.accountNo}</td>
                  <td className={GlobalStyle.tableData}>{row.amount}</td>
                  <td className={GlobalStyle.tableData}>{row.assignedDate}</td>
                  <td className={GlobalStyle.tableData}>{row.endDate}</td>
                  <td className={GlobalStyle.tableData}>
                    <div className="flex justify-center gap-2">
                      <button
                        className={GlobalStyle.buttonPrimary} // Prevents text from wrapping
                        onClick={() =>
                          navigate(
                            `/pages/Distribute/ReAssignDRC?caseId=${row.caseId}&accountNo=${row.accountNo}`
                          )
                        }
                      >
                        Re-Assign
                      </button>
                      <button className={GlobalStyle.buttonPrimary}>
                        {" "}
                        {/* Increased width */}
                        Withdraw
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        <span>
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
    </div>
  );
}
