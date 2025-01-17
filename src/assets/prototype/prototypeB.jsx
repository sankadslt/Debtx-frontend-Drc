import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyle from "./GlobalStyle";

const PrototypeB = () => {
  const [fromDate, setFromDate] = useState(null); //for date
  const [toDate, setToDate] = useState(null); // for date
  const [error, setError] = useState(""); // for error message
  const [searchQuery, setSearchQuery] = useState(""); // for searching
  const [selectAllData, setSelectAllData] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
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

  //dummy data for table
  const data = [
    {
      caseId: "C001",
      amount: "54,000",
      failReason: "-",
      status: "open",
    },
    {
      caseId: "C002",
      amount: "-",
      failReason: "-",
      status: "-",
    },
    {
      caseId: "C005",
      amount: "43,750",
      failReason: "-",
      status: "-",
    },
    {
      caseId: "C001",
      amount: "54,000",
      failReason: "-",
      status: "open",
    },
    {
      caseId: "C002",
      amount: "-",
      failReason: "-",
      status: "-",
    },
    {
      caseId: "C005",
      amount: "43,750",
      failReason: "-",
      status: "-",
    },
    {
      caseId: "C001",
      amount: "54,000",
      failReason: "-",
      status: "open",
    },
    {
      caseId: "C002",
      amount: "-",
      failReason: "-",
      status: "-",
    },
    {
      caseId: "C005",
      amount: "43,750",
      failReason: "-",
      status: "-",
    },
    // Add more data rows as needed
  ];

  //search fuction
  const filteredData = data.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const navi = () => {
    navigate("/lod/ftl-log/preview");
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

  const handleRowCheckboxChange = (caseId) => {
    if (selectedRows.includes(caseId)) {
      setSelectedRows(selectedRows.filter((id) => id !== caseId));
    } else {
      setSelectedRows([...selectedRows, caseId]);
    }
  };

  const handleSelectAllDataChange = () => {
    if (selectAllData) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((row) => row.caseId));
    }
    setSelectAllData(!selectAllData);
  };

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      {/* case count Bar */}
      <div className={`${GlobalStyle.caseCountBar}`}>
        <div className="flex">
          <span className={GlobalStyle.countBarTopic}>Case count</span>
        </div>
        <div className={GlobalStyle.countBarSubTopicContainer}>
          <div className={GlobalStyle.countBarMainBox}>
            <span>Total:</span>
            <p className={GlobalStyle.countBarMainTopic}>1259</p>
          </div>
          <div className={GlobalStyle.countBarSubBox}>
            <span>5,000 - 10,000</span>
            <p className={GlobalStyle.countBarSubTopic}>100</p>
          </div>
          <div className={GlobalStyle.countBarSubBox}>
            <span>10,000 - 25,000</span>
            <p className={GlobalStyle.countBarSubTopic}>250</p>
          </div>
          <div className={GlobalStyle.countBarSubBox}>
            <span>25,000 - 50,000</span>
            <p className={GlobalStyle.countBarSubTopic}>800</p>
          </div>
          <div className={GlobalStyle.countBarSubBox}>
            <span>50,000 - 100,000</span>
            <p className={GlobalStyle.countBarSubTopic}>61</p>
          </div>
          <div className={GlobalStyle.countBarSubBox}>
            <span>&gt; 100,000</span>
            <p className={GlobalStyle.countBarSubTopic}>98</p>
          </div>
        </div>
      </div>

      {/* mini case count bar */}

      
      <div className={`${GlobalStyle.miniCaseCountBar}`}>
        <div className="flex">
          <span className={GlobalStyle.miniCountBarTopic}>Mini Case count</span>
        </div>
        <div className={GlobalStyle.miniCountBarSubTopicContainer}>
          <div className={GlobalStyle.miniCountBarMainBox}>
            <span>Total:</span>
            <p className={GlobalStyle.miniCountBarMainTopic}>1259</p>
          </div>
          <div className={GlobalStyle.miniCountBarSubBox}>
            <span>5,000 - 10,000</span>
            <p className={GlobalStyle.miniCountBarSubTopic}>100</p>
          </div>
          <div className={GlobalStyle.miniCountBarSubBox}>
            <span>10,000 - 25,000</span>
            <p className={GlobalStyle.miniCountBarSubTopic}>250</p>
          </div>
        </div>
      </div>

      {/* card box*/}
      <div className={`${GlobalStyle.cardContainer}`}>
        <p className="mb-2">
          <strong>Case ID:</strong>
        </p>
        <p className="mb-2">
          <strong>Customer Ref:</strong>{" "}
        </p>
        <p className="mb-2">
          <strong>Account no:</strong>{" "}
        </p>
        <p className="mb-2">
          <strong>Arrears Amount:</strong>{" "}
        </p>
        <p className="mb-2">
          <strong>Last Payment Date:</strong>{" "}
        </p>
      </div>

      {/* remark box */}
      <div className="mb-6">
        <label className={GlobalStyle.remarkTopic}>Remark</label>
        <textarea
          value=""
          className={`${GlobalStyle.remark}`}
          rows="5"
        ></textarea>
      </div>

      <h1 className="flex">Date picker</h1>
      <br />
      
      {/* Date Picker Section */}
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
     
      <br />
      <h1 className={`${GlobalStyle.headingLarge}`}>Table</h1>
      <h1 className={GlobalStyle.headingMedium}>Table heading</h1>
      <h1 className={GlobalStyle.headingSmall}>Table data</h1>
      <br />

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

        {/* table */}
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={GlobalStyle.tableHeader}></th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Case ID
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Amount
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Fail Reason
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Status
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
                    <input
                      type="checkbox"
                      className={"rounded-lg"}
                      checked={selectedRows.includes(row.caseId)}
                      onChange={() => handleRowCheckboxChange(row.caseId)}
                    />
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <a href={`#${row.caseId}`} className="hover:underline">
                      {row.caseId}
                    </a>
                  </td>
                  <td className={GlobalStyle.tableData}>{row.amount}</td>
                  <td className={GlobalStyle.tableData}>{row.failReason}</td>
                  <td className={GlobalStyle.tableData}>{row.status}</td>
                  <td
                    className={`${GlobalStyle.tableData} text-center px-6 py-4`}
                  >
                    <button
                      className={`${GlobalStyle.buttonPrimary} mx-auto`}
                      onClick={navi}
                    >
                      Preview
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

      <div className="flex justify-end items-center w-full mt-6">
        {/* Select All Data Checkbox */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-lg"
            checked={selectAllData}
            onChange={handleSelectAllDataChange}
          />
          Select All Data
        </label>

        <Link
          className={`${GlobalStyle.buttonPrimary} ml-4`}
          to="/lod/ftllod/ftllod/downloadcreateftllod"
        >
          Create
        </Link>
      </div>
    </div>
  );
};

export default PrototypeB;
