/*Purpose: This template is used for the 1.7.1-incident filter(open incidnet),1.7.2- (rejected incident),1.9-direct LOD and 1.7.3 Collect CPE
Created Date: 2025-01-07
Created By: Naflan (naflanm084@gmail.com)
Last Modified Date: 2025-01-09
Version: node 20
ui number : 1.7.1, 1.7.2, 1.9 and 1.7.3
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for open incidnet,rejected incident,direct LOD and Collect CPE the UI's 
*/

import React, { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const IncidentFilter = () => {
  const [activeTab, setActiveTab] = useState("OpenIncidents");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll1, setSelectAll1] = useState(false);
  const [selectedRows1, setSelectedRows1] = useState(new Set());
  const [selectAll2, setSelectAll2] = useState(false);
  const [selectedRows2, setSelectedRows2] = useState(new Set());
  const [selectAll3, setSelectAll3] = useState(false);
  const [selectedRows3, setSelectedRows3] = useState(new Set());
  const [selectAll4, setSelectAll4] = useState(false);
  const [selectedRows4, setSelectedRows4] = useState(new Set());
  const [source, setSource] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [currentPage1, setCurrentPage1] = useState(1);
  const [searchQuery2, setSearchQuery2] = useState("");
  const [currentPage2, setCurrentPage2] = useState(1);

  // Data for Open Incidents
  const openIncidents = [
    {
      id: "RC001",
      Status: "open",
      accountNo: "0115678",
      action: "-",
      amount: "54,000",
      createdDate: "2025.01.05",
    },
    {
      id: "RC002",
      Status: "open",
      accountNo: "8765946",
      action: "-",
      amount: "54,000",
      createdDate: "2025.01.06",
    },
    {
      id: "RC002",
      Status: "open",
      accountNo: "8765946",
      action: "-",
      amount: "54,000",
      createdDate: "2025.01.07",
    },
    {
      id: "RC002",
      Status: "open",
      accountNo: "8765946",
      action: "-",
      amount: "54,000",
      createdDate: "2025.01.08",
    },
    {
      id: "RC002",
      Status: "open",
      accountNo: "8765946",
      action: "-",
      amount: "54,000",
      createdDate: "2025.01.05",
    },
    {
      id: "RC002",
      Status: "open",
      accountNo: "8765946",
      action: "-",
      amount: "54,000",
      createdDate: "2025.01.05",
    },
    {
      id: "RC002",
      Status: "open",
      accountNo: "8765946",
      action: "-",
      amount: "54,000",
      createdDate: "2025.01.05",
    },
  ];

  // Data for Rejected Incidents
  const rejectedIncidents = [
    {
      id: "RC001",
      Status: "Rejected",
      accountNo: "8765946",
      filteredReason: "Credit Class = VIP",
      rejectedOn: "Rejected",
      createdDate: "2025-01-05",
    },
    {
      id: "RC002",
      Status: "Rejected",
      accountNo: "8765946",
      filteredReason: "Credit Class = VIP",
      rejectedOn: "Rejected",
      createdDate: "2025.01.07",
    },
    {
      id: "RC002",
      Status: "Rejected",
      accountNo: "8765946",
      filteredReason: "Credit Class = VIP",
      rejectedOn: "Rejected",
      createdDate: "2025.01.09",
    },
    {
      id: "RC002",
      Status: "Rejected",
      accountNo: "8765946",
      filteredReason: "Credit Class = VIP",
      rejectedOn: "Rejected",
      createdDate: "2025.01.05",
    },
    {
      id: "RC002",
      Status: "Rejected",
      accountNo: "8765946",
      filteredReason: "Credit Class = VIP",
      rejectedOn: "Rejected",
      createdDate: "2025.01.05",
    },
  ];

  // Data for Direct LOD
  const directLODData = [
    {
      id: "RC001",
      Status: "Direct LD",
      accountNo: "0115678",
      amount: "500",
      action: "Direct LOD",
      createdDate: "2025-01-05",
    },
    {
      id: "RC002",
      Status: "Direct LD",
      accountNo: "8765946",
      amount: "590",
      action: "Direct LOD",
      createdDate: "2025-01-05",
    },
    {
      id: "RC003",
      Status: "Direct LD",
      accountNo: "3754918",
      amount: "900",
      action: "Direct LOD",
      createdDate: "2025-01-07",
    },
    {
      id: "RC003",
      Status: "Direct LD",
      accountNo: "3754918",
      amount: "900",
      action: "Direct LOD",
      createdDate: "2025-01-09",
    },
    {
      id: "RC003",
      Status: "Direct LD",
      accountNo: "3754918",
      amount: "900",
      action: "Direct LOD",
      createdDate: "2025-01-10",
    },
  ];

  // Data for Collect CPE
  const collectCPEData = [
    {
      id: "CP001",
      Status: "Collect CPE",
      accountNo: "0987654",
      action: "Collect CPE",
      createdDate: "2025-01-05",
    },
    {
      id: "CP002",
      Status: "Collect CPE",
      accountNo: "0987654",
      action: "Collect CPE",
      createdDate: "2025-01-05",
    },
    {
      id: "CP003",
      Status: "Collect CPE",
      accountNo: "0987654",
      action: "Collect CPE",
      createdDate: "2025-01-08",
    },
    {
      id: "CP003",
      Status: "Collect CPE",
      accountNo: "0987654",
      action: "Collect CPE",
      createdDate: "2025-01-09",
    },
    {
      id: "CP003",
      Status: "Collect CPE",
      accountNo: "0987654",
      action: "Collect CPE",
      createdDate: "2025-01-02",
    },
  ];

  const [filterdata1, setFilterdata1] = useState(rejectedIncidents);
  const [filterdata2, setFilterdata2] = useState(directLODData);
  const [filterdata3, setFilterdata3] = useState(collectCPEData);
  const handleProceedAll = () => {
    alert("Proceed All clicked");
  };
  const rejectAllFunction = () => {
    alert(`rejectAll`);
  };

  const rmoveForwadeFunction = () => {
    alert(`rmoveForwade`);
  };
  //search fuction 1
  const filteredSearchData1 = openIncidents.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery1.toLowerCase())
  );
  //search fuction 2
  const filteredSearchData2 = filterdata1.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery1.toLowerCase())
  );
  //search fuction 3
  const filteredSearchData3 = filterdata2.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery1.toLowerCase())
  );
  //search fuction 4
  const filteredSearchData4 = filterdata3.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery1.toLowerCase())
  );

  // Pagination state1
  const itemsPerPage1 = 4;
  const totalPages1 =
    activeTab === "OpenIncidents"
      ? Math.ceil(filteredSearchData1.length / itemsPerPage1)
      : Math.ceil(filteredSearchData2.length / itemsPerPage1);

  // Pagination handler

  const startIndex1 = (currentPage1 - 1) * itemsPerPage1;
  const endIndex1 = startIndex1 + itemsPerPage1;
  const Data1 = filteredSearchData1.slice(startIndex1, endIndex1);

  // Pagination state1
  const itemsPerPage2 = 4;

  const startIndex2 = (currentPage1 - 1) * itemsPerPage2;
  const endIndex2 = startIndex2 + itemsPerPage2;
  const Data2 = filteredSearchData2.slice(startIndex2, endIndex2);

  const itemsPerPage3 = 4;
  const totalPages2 =
    activeTab === "DirectLOD"
      ? Math.ceil(filteredSearchData3.length / itemsPerPage1)
      : Math.ceil(filteredSearchData4.length / itemsPerPage1);

  const startIndex3 = (currentPage2 - 1) * itemsPerPage3;
  const endIndex3 = startIndex3 + itemsPerPage3;
  const Data3 = filteredSearchData3.slice(startIndex3, endIndex3);

  const itemsPerPage4 = 4;

  const startIndex4 = (currentPage2 - 1) * itemsPerPage4;
  const endIndex4 = startIndex4 + itemsPerPage4;
  const Data4 = filteredSearchData4.slice(startIndex4, endIndex4);

  const handlePrevNext1 = (direction) => {
    if (direction === "prev" && currentPage1 > 1) {
      setCurrentPage1(currentPage1 - 1);
    }
    if (direction === "next" && currentPage1 < totalPages1) {
      setCurrentPage1(currentPage1 + 1);
    }
  };

  const handlePrevNext2 = (direction) => {
    if (direction === "prev" && currentPage2 > 1) {
      setCurrentPage2(currentPage2 - 1);
    }
    if (direction === "next" && currentPage2 < totalPages2) {
      setCurrentPage2(currentPage2 + 1);
    }
  };

  const applyFilters = () => {
    if (activeTab === "RejectedIncidents") {
      console.log("Original Data:", rejectedIncidents);

      const filteredData = rejectedIncidents.filter((item) => {
        // Normalize date parsing
        const itemDate = new Date(item.createdDate.replace(/\./g, "-")); // Replace "." with "-" for consistent format

        // Apply Date Range filter
        const isDateInRange =
          (!fromDate || itemDate >= new Date(fromDate)) && // Check if itemDate is after or equal to fromDate
          (!toDate || itemDate <= new Date(toDate)); // Check if itemDate is before or equal to toDate

        return isDateInRange;
      });

      console.log("Filtered Data:", filteredData);
      setFilterdata1(filteredData);
    } else if (activeTab === "DirectLOD") {
      console.log("Original Data:", directLODData);

      const filteredData = directLODData.filter((item) => {
        // Normalize date parsing
        const itemDate = new Date(item.createdDate.replace(/\./g, "-")); // Replace "." with "-" for consistent format

        // Apply Date Range filter
        const isDateInRange =
          (!fromDate || itemDate >= new Date(fromDate)) && // Check if itemDate is after or equal to fromDate
          (!toDate || itemDate <= new Date(toDate)); // Check if itemDate is before or equal to toDate

        return isDateInRange;
      });
      setFilterdata2(filteredData);
    } else if (activeTab === "CollectCPE") {
      console.log("Original Data:", collectCPEData);

      const filteredData = collectCPEData.filter((item) => {
        // Normalize date parsing
        const itemDate = new Date(item.createdDate.replace(/\./g, "-")); // Replace "." with "-" for consistent format

        // Apply Date Range filter
        const isDateInRange =
          (!fromDate || itemDate >= new Date(fromDate)) && // Check if itemDate is after or equal to fromDate
          (!toDate || itemDate <= new Date(toDate)); // Check if itemDate is before or equal to toDate

        return isDateInRange;
      });
      setFilterdata3(filteredData);
    } else {
      ("");
    }
  };

  // All Check box select function
  const handleSelectAll = () => {
    if (activeTab === "OpenIncidents") {
      setSelectAll2(!selectAll2);
      if (!selectAll2) {
        setSelectedRows2(new Set(openIncidents.map((_, index) => index)));
      } else {
        setSelectedRows2(new Set());
      }
    } else if (activeTab === "RejectedIncidents") {
      setSelectAll1(!selectAll1);
      if (!selectAll1) {
        setSelectedRows1(new Set(filterdata1.map((_, index) => index)));
      } else {
        setSelectedRows1(new Set());
      }
    } else if (activeTab === "DirectLOD") {
      setSelectAll3(!selectAll3);
      if (!selectAll3) {
        setSelectedRows3(new Set(filterdata2.map((_, index) => index)));
      } else {
        setSelectedRows3(new Set());
      }
    } else if (activeTab === "CollectCPE") {
      setSelectAll4(!selectAll4);
      if (!selectAll4) {
        setSelectedRows4(new Set(filterdata3.map((_, index) => index)));
      } else {
        setSelectedRows4(new Set());
      }
    } else {
      ("");
    }
  };

  // Check box select function
  const handleRowSelect = (index) => {
    if (activeTab === "OpenIncidents") {
      const newSelectedRows = new Set(selectedRows2);
      if (newSelectedRows.has(index)) {
        newSelectedRows.delete(index);
      } else {
        newSelectedRows.add(index);
      }
      setSelectedRows2(newSelectedRows);
    } else if (activeTab === "RejectedIncidents") {
      const newSelectedRows = new Set(selectedRows1);
      if (newSelectedRows.has(index)) {
        newSelectedRows.delete(index);
      } else {
        newSelectedRows.add(index);
      }
      setSelectedRows1(newSelectedRows);
    } else if (activeTab === "DirectLOD") {
      const newSelectedRows = new Set(selectedRows3);
      if (newSelectedRows.has(index)) {
        newSelectedRows.delete(index);
      } else {
        newSelectedRows.add(index);
      }
      setSelectedRows3(newSelectedRows);
    } else if (activeTab === "CollectCPE") {
      const newSelectedRows = new Set(selectedRows4);
      if (newSelectedRows.has(index)) {
        newSelectedRows.delete(index);
      } else {
        newSelectedRows.add(index);
      }
      setSelectedRows4(newSelectedRows);
    } else {
      ("");
    }
  };

  const renderTableContent = () => {
    let dataToDisplay = [];
    if (activeTab === "OpenIncidents") {
      dataToDisplay = Data1;
    } else if (activeTab === "RejectedIncidents") {
      dataToDisplay = Data2;
    } else if (activeTab === "DirectLOD") {
      dataToDisplay = Data3;
    } else if (activeTab === "CollectCPE") {
      dataToDisplay = Data4;
    }

    const currentRows = dataToDisplay;

    const handleReject = (id) => {
      alert(`Reject clicked for ID: ${id}`);
    };

    const handleProceed = (id) => {
      alert(`Proceed clicked for ID: ${id}`);
    };

    // Table structure for Direct LOD and Collect CPE tabs
    if (activeTab === "DirectLOD" || activeTab === "CollectCPE") {
      return (
        <>
          {/* table */}
          <div className={GlobalStyle.tableContainer}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th className={GlobalStyle.tableHeader}></th>
                  <th className={GlobalStyle.tableHeader}>ID</th>
                  <th className={GlobalStyle.tableHeader}>Status</th>
                  {activeTab === "DirectLOD" ? (
                    <>
                      <th className={GlobalStyle.tableHeader}>Account No</th>
                      <th className={GlobalStyle.tableHeader}>Amount</th>
                    </>
                  ) : (
                    <>
                      <th className={GlobalStyle.tableHeader}>Account No</th>
                      <th className={GlobalStyle.tableHeader}>Action</th>
                    </>
                  )}
                  <th className={GlobalStyle.tableHeader}></th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, index) => (
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
                        checked={
                          activeTab === "DirectLOD"
                            ? selectedRows3.has(index)
                            : activeTab === "CollectCPE"
                            ? selectedRows4.has(index)
                            : false
                        }
                        onChange={() => handleRowSelect(index)}
                        className="mx-auto"
                      />
                    </td>
                    <td className={GlobalStyle.tableData}>{row.id}</td>
                    <td className={GlobalStyle.tableData}>{row.Status}</td>
                    {activeTab === "DirectLOD" ? (
                      <>
                        <td className={GlobalStyle.tableData}>
                          {row.accountNo}
                        </td>
                        <td className={GlobalStyle.tableData}>{row.amount}</td>
                      </>
                    ) : (
                      <>
                        <td className={GlobalStyle.tableData}>
                          {row.accountNo}
                        </td>
                        <td className={GlobalStyle.tableData}>{row.action}</td>
                      </>
                    )}
                    <td className={GlobalStyle.tableData}>
                      <button
                        className={GlobalStyle.buttonPrimary}
                        onClick={() => {
                          handleProceed(row.id);
                        }}
                      >
                        {activeTab === "DirectLOD" ? "Proceed" : "Proceed"}
                      </button>
                    </td>
                  </tr>
                ))}
                {currentRows.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-4 text-center">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={`${GlobalStyle.navButtonContainer} mb-14`}>
            <button
              onClick={() => handlePrevNext2("prev")}
              disabled={currentPage2 === 1}
              className={`${GlobalStyle.navButton} ${
                currentPage2 === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <FaArrowLeft />
            </button>
            <span>
              Page {currentPage2} of {totalPages2}
            </span>
            <button
              onClick={() => handlePrevNext2("next")}
              disabled={currentPage2 === totalPages1}
              className={`${GlobalStyle.navButton} ${
                currentPage2 === totalPages2 ? "cursor-not-allowed" : ""
              }`}
            >
              <FaArrowRight />
            </button>
          </div>
        </>
      );
    }

    // Default table for Open/Rejected incidents
    return (
      <>
        {" "}
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr className={GlobalStyle.thead}>
                <th className={GlobalStyle.tableHeader}></th>
                <th className={GlobalStyle.tableHeader}>ID</th>
                <th className={GlobalStyle.tableHeader}>Status</th>
                <th className={GlobalStyle.tableHeader}>Account No.</th>
                <th className={GlobalStyle.tableHeader}>
                  {activeTab === "OpenIncidents" ? "Action" : "Filtered Reason"}
                </th>
                {activeTab === "OpenIncidents" ? (
                  <th className={GlobalStyle.tableHeader}>Amount</th>
                ) : (
                  <th className={GlobalStyle.tableHeader}>Rejected On</th>
                )}
                {activeTab === "OpenIncidents" ? (
                  ""
                ) : (
                  <th className={GlobalStyle.tableHeader}></th>
                )}

                {/* New column */}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, index) => (
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
                      checked={
                        activeTab === "OpenIncidents"
                          ? selectedRows2.has(index)
                          : activeTab === "RejectedIncidents"
                          ? selectedRows1.has(index)
                          : false
                      }
                      onChange={() => handleRowSelect(index)}
                      className="mx-auto"
                    />
                  </td>
                  <td className={GlobalStyle.tableData}>{row.id}</td>
                  <td className={GlobalStyle.tableData}>{row.Status}</td>
                  <td className={GlobalStyle.tableData}>
                    {activeTab === "OpenIncidents"
                      ? row.accountNo
                      : row.accountNo}
                  </td>
                  {activeTab === "OpenIncidents" ? (
                    <td className={GlobalStyle.tableData}>{row.action}</td>
                  ) : (
                    <td className={GlobalStyle.tableData}>
                      {row.filteredReason}
                    </td>
                  )}
                  <td className={GlobalStyle.tableData}>
                    {activeTab === "OpenIncidents"
                      ? row.amount
                      : row.createdDate}
                  </td>
                  {activeTab === "OpenIncidents" ? (
                    ""
                  ) : (
                    <td className={GlobalStyle.tableData}>
                      <button
                        className={GlobalStyle.buttonPrimary}
                        onClick={() => {
                          handleReject(row.id);
                        }}
                      >
                        {activeTab === "OpenIncidents" ? "" : "Reject"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {currentRows.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-center">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={`${GlobalStyle.navButtonContainer} mb-14`}>
          <button
            onClick={() => handlePrevNext1("prev")}
            disabled={currentPage1 === 1}
            className={`${GlobalStyle.navButton} ${
              currentPage1 === 1 ? "cursor-not-allowed" : ""
            }`}
          >
            <FaArrowLeft />
          </button>
          <span>
            Page {currentPage1} of {totalPages1}
          </span>
          <button
            onClick={() => handlePrevNext1("next")}
            disabled={currentPage1 === totalPages1}
            className={`${GlobalStyle.navButton} ${
              currentPage1 === totalPages1 ? "cursor-not-allowed" : ""
            }`}
          >
            <FaArrowRight />
          </button>
        </div>
      </>
    );
  };
  const handleCreateTask = () => {
    alert("Clicked create task and let me know!");
  };

  return (
    <div className={`${GlobalStyle.fontPoppins} p-6`}>
      {/* Heading and Button */}
      <div className="flex items-center justify-between mb-5">
        <h1 className={GlobalStyle.headingLarge}>Incident Details</h1>
        <button
          onClick={handleCreateTask}
          className={GlobalStyle.buttonPrimary}
        >
          Create task and let me know
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("OpenIncidents")}
          className={`px-4 py-2 ${
            activeTab === "OpenIncidents"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-500"
          }`}
        >
          Open Incidents
        </button>
        <button
          onClick={() => setActiveTab("RejectedIncidents")}
          className={`px-4 py-2 ${
            activeTab === "RejectedIncidents"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-500"
          }`}
        >
          Rejected Incidents
        </button>
        <button
          onClick={() => setActiveTab("DirectLOD")}
          className={`px-4 py-2 ${
            activeTab === "DirectLOD"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-500"
          }`}
        >
          Direct LOD
        </button>
        <button
          onClick={() => setActiveTab("CollectCPE")}
          className={`px-4 py-2 ${
            activeTab === "CollectCPE"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-500"
          }`}
        >
          Collect CPE
        </button>
      </div>

      {activeTab === "OpenIncidents" ? (
        <></>
      ) : (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-6 mb-0">
            <div className="flex items-center gap-2 mb-4">
              <label className="flex gap-4">Source:</label>
              <select
                className={GlobalStyle.selectBox}
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="">Select</option>
                <option value="source1">Source 1</option>
                <option value="source2">Source 2</option>
              </select>
            </div>

            <div className="flex flex-col mb-4">
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
              {error && <span className={GlobalStyle.errorText}>{error}</span>}
            </div>
            <button
              className={`${GlobalStyle.buttonPrimary} mb-4`}
              onClick={() => {
                applyFilters();
              }}
            >
              Filter
            </button>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="flex justify-start mb-4">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            placeholder=""
            value={searchQuery1}
            onChange={(e) => setSearchQuery1(e.target.value)}
            className={GlobalStyle.inputSearch}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

      {/* Display Case Count Bar only for OpenIncidents tab */}
      {activeTab === "OpenIncidents" && (
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
      )}

      {/* Content */}
      {renderTableContent()}

      <div className="flex items-center justify-end gap-6 mt-8">
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded-lg"
              checked={
                activeTab === "OpenIncidents"
                  ? selectAll2
                  : activeTab === "RejectedIncidents"
                  ? selectAll1
                  : activeTab === "DirectLOD"
                  ? selectAll3
                  : activeTab === "CollectCPE"
                  ? selectAll4
                  : ""
              }
              onChange={handleSelectAll}
            />
            Select All
          </label>
        </div>

        {activeTab === "RejectedIncidents" ? (
          <>
            <button
              className={GlobalStyle.buttonPrimary}
              onClick={() => {
                rejectAllFunction();
              }}
            >
              Reject All
            </button>
            <button
              className={GlobalStyle.buttonPrimary}
              onClick={rmoveForwadeFunction}
            >
              Move Forward
            </button>
          </>
        ) : (
          <button
            className={GlobalStyle.buttonPrimary}
            onClick={handleProceedAll}
          >
            Proceed
          </button>
        )}
      </div>
    </div>
  );
};

export default IncidentFilter;