/*Purpose: This template is used for the 2.1- Assigned case list for DRC
Created Date: 2025-01-07
Created By: Chamithu (chamithujayathilaka2003@gmail.com)
Last Modified Date: 2025-02-18
Modified by: Nimesh Perera(nimeshmathew999@gmail.com)
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

//Status Icons
import Open_No_Agent from "../../assets/images/status/Open_No_Agent.png";
import Open_With_Agent from "../../assets/images/status/Open_With_Agent.png";
import Negotiation_Settle_Pending from "../../assets/images/status/Negotiation_Settle_Pending.png";
import Negotiation_Settle_Open_Pending from "../../assets/images/status/Negotiation_Settle_Open_Pending.png";
import Negotiation_Settle_Active from "../../assets/images/status/Negotiation_Settle_Active.png";
import FMB from "../../assets/images/status/Forward_to_Mediation_Board.png";
import FMB_Settle_Pending from "../../assets/images/status/MB_Settle_pending.png";
import FMB_Settle_Open_Pending from "../../assets/images/status/MB_Settle_open_pending.png";
import FMB_Settle_Active from "../../assets/images/status/MB_Settle_Active.png";


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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  //Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filter state
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

  // Search Section
  const filteredDataBySearch = currentData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "open no agent":
        return <img src={Open_No_Agent} alt="Open No Agent" className="w-5 h-5" />;
      case "open with agent":
        return <img src={Open_With_Agent} alt="Open With Agent" className="w-5 h-5" />;
      case "negotiation settle pending":
        return <img src={Negotiation_Settle_Pending} alt="Negotiation Settle Pending" className="w-5 h-5" />;
      case "negotiation settle open pending":
        return <img src={Negotiation_Settle_Open_Pending} alt="Negotiation Settle Open Pending" className="w-5 h-5" />;
      case "negotiation settle active":
        return <img src={Negotiation_Settle_Active} alt="Negotiation Settle Active" title="Negotiation Settle Active" className="w-5 h-5" />;
      case "fmb":
        return <img src={FMB} alt="FMB" className="w-5 h-5" />;
      case "fmb settle pending":
        return <img src={FMB_Settle_Pending} alt="FMB Settle Pending" className="w-5 h-5" />;
      case "fmb settle open pending":
        return <img src={FMB_Settle_Open_Pending} alt="FMB Settle Open Pending" className="w-5 h-5" />;
      case "fmb settle active":
        return <img src={FMB_Settle_Active} alt="FMB Settle Active" className="w-5 h-5" />;
      default:
        return <span className="text-gray-500">N/A</span>;
    }
  };
  
  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Case List</h1>
      
      <div className="flex gap-4 items-center flex-wrap mt-4 ">
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
                  <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>{getStatusIcon(item.status)}</td>
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


