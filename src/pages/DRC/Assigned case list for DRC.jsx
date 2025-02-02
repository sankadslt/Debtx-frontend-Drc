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
import { useParams } from "react-router-dom"; 
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import DatePicker from "react-datepicker";
import { listHandlingCasesByDRC } from "../../services/case/CaseService";

export default function AssignedCaseListforDRC() {
  const { drc_id } = useParams();

  // State for search query and filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]); // Initialize with an empty array
  const [filterValue, setFilterValue] = useState(""); // This holds the filter value for the Arreas Amount Filter 
  
  // Filter state
  const [filterRO, setRO] = useState(""); 
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleFilter = async () => {
    try {
      setFilteredData([]); // Clear existing data
  
      // Determine the arrears band based on the entered amount (filterValue)
      let arrearsBand = "";
      const amount = parseFloat(filterValue); // Convert the entered value to a number
  
      if (amount > 0 && amount < 5000) {
        // If amount is between 0 and 5000, don't fetch any records
        setFilteredData([]);
        return;
      } else if (amount >= 5000 && amount < 10000) {
        arrearsBand = "AB-5_10";
      } else if (amount >= 10000 && amount < 25000) {
        arrearsBand = "AB-10_25";
      } else if (amount >= 25000 && amount < 50000) {
        arrearsBand = "AB-25_50";
      } else if (amount >= 50000 && amount < 100000) {
        arrearsBand = "AB-50_100";
      } else if (amount >= 100000) {
        arrearsBand = "AB-100<";
      } else {
        // If the amount is 0 or left empty, don't apply the arrears band filter
        arrearsBand = "";
      }
  
      // Construct the correct payload structure
      const payload = {
        drc_id: Number(drc_id), // Ensure DRC ID is numeric
        ro_name: filterRO ? filterRO.trim() : "", // Ensure 'ro_name' is trimmed and in the correct format
        arrears_band: arrearsBand, // Use the determined arrears band
        from_date: fromDate ? fromDate.toISOString() : "", // Format the date as ISO string
        to_date: toDate ? toDate.toISOString() : "", // Format the date as ISO string
      };
  
      console.log("Payload sent to API:", payload); // Log the correctly formatted payload
  
      const response = await listHandlingCasesByDRC(payload); // Call the API with the updated payload
  
      if (response?.data) {
        console.log("Response Data:", response.data);
        setFilteredData(response.data); // Set response data to state
      } else {
        console.error("No valid data received.");
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  // Filtering the data based on filter the date and other filters
  const filterData = () => {
    let tempData = filteredData; // Use filteredData instead of data
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

  // Search Section - Filter the data by search query
  const filteredDataBySearch = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredDataBySearch.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredDataBySearch.length / recordsPerPage);

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


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
        <button onClick={handleFilter} className={`${GlobalStyle.buttonPrimary}`}>
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
        <th className={GlobalStyle.tableHeader}></th>
        <th className={GlobalStyle.tableHeader}>Status</th>
        <th className={GlobalStyle.tableHeader}>Case ID</th>
        <th className={GlobalStyle.tableHeader}>Date</th>
        <th className={GlobalStyle.tableHeader}>Amount</th>
        <th className={GlobalStyle.tableHeader}>Action</th>
        <th className={GlobalStyle.tableHeader}>RTOM Area</th>
        <th className={GlobalStyle.tableHeader}>RO</th>
        <th className={GlobalStyle.tableHeader}>Expire Date</th>
      </tr>
    </thead>
    <tbody>
      {currentData && currentData.length > 0 ? (
        currentData.map((item, index) => (
          <tr
            key={item.case_id || index} // Use case_id if available, else fallback to index
            className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
          >
            <td className="text-center"></td>
            <td className={GlobalStyle.tableData}>{item.status || "N/A"}</td>
            <td className={GlobalStyle.tableData}>{item.case_id || "N/A"}</td>
            <td className={GlobalStyle.tableData}>
              {item.created_dtm ? new Date(item.created_dtm).toISOString().split('T')[0] : "N/A"}
            </td>
            <td className={GlobalStyle.tableData}>{item.current_arreas_amount || "N/A"}</td>
            <td className={GlobalStyle.tableData}>{item.action || "N/A"}</td>
            <td className={GlobalStyle.tableData}>{item.area || "N/A"}</td>
            <td className={GlobalStyle.tableData}>{item.ro_name || "N/A"}</td>
            <td className={GlobalStyle.tableData}>
              {item.expire_dtm ? new Date(item.expire_dtm).toISOString().split('T')[0] : "N/A"}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="9" className="text-center">No data available</td>
        </tr>
      )}
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
    </div>
  );
}


