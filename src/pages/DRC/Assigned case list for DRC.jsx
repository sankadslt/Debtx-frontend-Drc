/*Purpose: This template is used for the 2.1- Assigned case list for DRC
Created Date: 2025-01-07
Created By: Chamithu (chamithujayathilaka2003@gmail.com)
Last Modified Date: 2025-01-07
Version: node 20
ui number : 2.1
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for the assigned case list for DRC  */


import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import DatePicker from "react-datepicker";
import { roassignedbydrc } from "../../services/Ro/RO.js";
import { fetchAllArrearsBands, listHandlingCasesByDRC } from "../../services/case/CaseService.js";

export default function AssignedCaseListforDRC() {
  

  const {drc_id} =useParams();

  //State for dropdowns
  const [arrearsAmounts, setArrearsAmounts] = useState([]);
  const [selectedArrearsAmount, setSelectedArrearsAmount] =useState("");
  const [roList, setRoList] = useState([]);
  const [selectedRo, setSelectedRo] =useState("");

  // State for search query and filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]);
  // const [filterValue, setFilterValue] = useState(""); // This holds the filter value for the Arreas Amount Filter 

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filter state
  // const [filterRO, setRO] = useState(""); 
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    const fetchData =async () => {
      try {
        const arrearsAmounts =await fetchAllArrearsBands();        
        setArrearsAmounts(arrearsAmounts);

        if (drc_id) {
          const roData =await roassignedbydrc(drc_id);
          setRoList(roData);
        }

      } catch (error) {
        console.log("Data fetching failed : " , error);
        setArrearsAmounts([]);
      }
      
    }
    fetchData();
    
  }, [drc_id]);

  // Handle filtering cases
  const handleFilter =async () => {
    try {
      setFilteredData([]);

      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };

      const payload ={
        drc_id: Number(drc_id),
        arrears_band: selectedArrearsAmount || "",
        ro_id: selectedRo ? Number(selectedRo) : "", // Ensure it's properly assigned
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
      };

      console.log("Payload sent to API: ", payload);
      

      const response =await listHandlingCasesByDRC(payload);

      if (Array.isArray(response)) {
        console.log(response);
        
        setFilteredData(response);
      } else {
          console.error("No valid cases data found in response.");
      }

    } catch (error) {
        console.error("Error filtering cases:", error);
    }
  }

  // // Filtering the data based on filter the date and other filters
  // const filterData = () => {
  //   let tempData = data;
  //   if (filterValue) {
  //     tempData = tempData.filter((item) =>
  //       item.amount.includes(filterValue)
  //     );
  //   }
  //   if (filterRO) {
  //     tempData = tempData.filter((item) =>
  //       item.ro.includes(filterRO)
  //     );
  //   }
  //   if (fromDate) {
  //       tempData = tempData.filter((item) => {
  //         const itemDate = new Date(item.date);
  //         return itemDate >= fromDate;
  //       });
  //     }
  //     if (toDate) {
  //       tempData = tempData.filter((item) => {
  //         const itemExpireDate = new Date(item.expiredate);
  //         return itemExpireDate <= toDate;
  //       });
  //     }
  //   setFilteredData(tempData);
    
  // };

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
        {/* <input
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
        /> */}

        {/* Dropdown for Arrears Amount */}
        <select
          className={GlobalStyle.selectBox}
          value={selectedArrearsAmount}
          onChange={(e) => setSelectedArrearsAmount(e.target.value)}
        >
        <option value="">Arrears Band</option>
          {arrearsAmounts.length > 0 ? (
            arrearsAmounts.map((amount, index) => (
              <option key={index} value={amount.key}>
                {amount.value}
              </option>
            ))
          ) : (
            <option value="">Loading...</option>
          )}
        </select>

        {/* Dropdown for RO */}
        <select 
          className={GlobalStyle.selectBox}
          value={selectedRo}
          onChange={(e) => setSelectedRo(e.target.value)}
        >
          <option value="">Select RO</option>
          {roList.map((ro) => (
            <option key={ro.ro_id} value={ro.ro_id}>{ro.ro_name}</option>
          ))}
        </select>

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
            {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
              filteredDataBySearch.map((item, index) => (
                <tr
                  key={item.case_id || index}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td className={`${GlobalStyle.tableData}  text-black hover:underline cursor-pointer`}>{item.case_id || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>{item.status || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>{new Date(item.created_dtm).toLocaleDateString("en-CA") || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>{item.current_arrears_amount || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>{item.remark || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>{item.area || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>
                    {item.expire_dtm && !isNaN(new Date(item.expire_dtm).getTime()) 
                        ? new Date(item.expire_dtm).toLocaleDateString("en-CA") 
                        : "N/A"
                    }
                  </td>
                  <td className={GlobalStyle.tableData}>{item.ro_name}</td>
                  
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center">No cases available</td>
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


