/*Purpose: This template is used for the 2.1- Assigned case list for DRC
Created Date: 2025-01-07
Created By: Chamithu (chamithujayathilaka2003@gmail.com)
Last Modified Date: 2025-01-07
Version: node 20
ui number : 2.1
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for the assigned case list for DRC  */


import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import DatePicker from "react-datepicker";

export default function AssignedCaseListforDRC() {
    // Data for the table
  const data = [
    {
      caseId: "C001",
      status: "Pending",
      date: "2024.11.05",
      amount: "15,000",
      action: "Arrears Collect",
      rtomArea: "Kegalle",
      expiredate: "2024.12.20",
      ro:"Silva Perera"
      
    },
    
    {
      caseId: "C002",
      status: "Pending",
      date: "2024.11.05",
      amount: "50,000",
      action: "Arrears Collect",
      rtomArea: "Colombo",
      expiredate: "2024.11.20",
      ro:"P.B.Silva"
    },
    {
      caseId: "C003",
      status: "Pending",
      date: "2025.01.01",
      amount: "30,000",
      action: "Arrears Collect",
      rtomArea: "Kegalle",
      expiredate: "2025.02.10",
      ro:"Silva Perera"
    },
      {
      caseId: "C004",
      status: "Pending",
      date: "2025.01.01",
      amount: "15,000",
      action: "Arrears Collect",
      rtomArea: "Kegalle",
      expiredate: "2025.01.20",
      ro:"P.B.Silva"
      },
  ];

  // State for search query and filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState(data);
  const [filterValue, setFilterValue] = useState(""); // This holds the filter value for the Arreas Amount Filter 

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Filter state
  const [filterRO, setRO] = useState(""); 
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Filtering the data based on filter the date and other filters
  const filterData = () => {
    let tempData = data;
    if (filterValue) {
      tempData = tempData.filter((item) =>
        item.amount.includes(filterValue)
      );
    }
    if (filterRO) {
      tempData = tempData.filter((item) =>
        item.ro.includes(filterRO)
      );
    }
    if (fromDate) {
        tempData = tempData.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= fromDate;
        });
      }
      if (toDate) {
        tempData = tempData.filter((item) => {
          const itemExpireDate = new Date(item.expiredate);
          return itemExpireDate <= toDate;
        });
      }
    setFilteredData(tempData);
    
  };

  // Search Section
  const filteredDataBySearch = currentData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Case List</h1>
      
      <div className="flex gap-4 items-center flex-wrap mt-4 ">
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder="Enter Arrears Amount"
          className={GlobalStyle.inputText}
        />
        <input
          type="text"
          value={filterRO}
          onChange={(e) => setRO(e.target.value)}
          placeholder="Enter RO"
          className={GlobalStyle.inputText}
        />
        <div className={`${GlobalStyle.datePickerContainer} flex items-center gap-2`}>
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
            onClick={filterData}
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
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Date</th>
              <th className={GlobalStyle.tableHeader}>Amount</th>
              <th className={GlobalStyle.tableHeader}>Action</th>
              <th className={GlobalStyle.tableHeader}>RTOM Area</th>
              <th className={GlobalStyle.tableHeader}>Expire Date</th>
              <th className={GlobalStyle.tableHeader}>RO</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.map((item, index) => (
              <tr
                key={item.caseId}
                className={
                  index % 2 === 0
                    ? GlobalStyle.tableRowEven
                    : GlobalStyle.tableRowOdd
                }
              >
                <td className={`${GlobalStyle.tableData}  text-black hover:underline cursor-pointer`}>{item.caseId}</td>
                <td className={GlobalStyle.tableData}>{item.status}</td>
                <td className={GlobalStyle.tableData}>{item.date}</td>
                <td className={GlobalStyle.tableData}>{item.amount}</td>
                <td className={GlobalStyle.tableData}>{item.action}</td>
                <td className={GlobalStyle.tableData}>{item.rtomArea}</td>
                <td className={GlobalStyle.tableData}>{item.expiredate}</td>
                <td className={GlobalStyle.tableData}>{item.ro}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      

    </div>
  );
}


