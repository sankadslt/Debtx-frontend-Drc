/* Purpose: This template is used for the 2.2 - Distribute TO RO.
Created Date: 2025-01-08
Created By: Geeth (eshaneperera@gmail.com)
Last Modified Date: 2025-01-08
Modified Date: 2025-01-12
Modified By: Geeth(eshaneperera@gmail.com)
Version: node 20
ui number : 2.2
Dependencies: tailwind css
Related Files: (routes)
Notes: This page includes a filter and a table */


import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { listHandlingCasesByDRC } from "../../services/case/CaseService";
import { listAllActiveRosByDRCID } from "../../services/case/CaseService";
import { getRTOMsByDRCID } from "../../services/rtom/RtomService"; 
import { assignROToCase } from "../../services/case/CaseService";
import Swal from 'sweetalert2';

const DistributeTORO = () => {
  const [rtoms, setRtoms] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRTOM, setSelectedRTOM] = useState("");
  const [selectedRO, setSelectedRO] = useState("");
  const [selectedArrearsBand, setSelectedArrearsBand] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recoveryOfficers, setRecoveryOfficers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Use useParams hook to get the drc_id from the URL
  const { drc_id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (drc_id) {
          const payload = parseInt(drc_id, 10); // Convert drc_id to number
  
          // Fetch RTOMs by DRC ID
          const rtomsList = await getRTOMsByDRCID(payload);
          setRtoms(rtomsList); // Set RTOMs to state
  
          const response = await listHandlingCasesByDRC(payload);
  
          if (response && Array.isArray(response.data)) {
            setData(response.data);
            setFilteredData(response.data);
          } else {
            setError("No data found.");
          }
        } else {
          setError("DRC ID not found in URL.(try http://localhost:5173/pages/Distribute/DistributeTORO/200 )");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
   
    const fetchRecoveryOfficers = async () => {
      try {
        if (drc_id) {
          // Convert drc_id to a number
          const numericDrcId = Number(drc_id);
    
          // Collect RTOM Areas from selected rows
          const selectedAreas = Array.from(selectedRows).map((index) => currentData[index]?.area);
    
          // Fetch Recovery Officers for each RTOM Area
          const officers = await Promise.all(
            selectedAreas.map((area) => listAllActiveRosByDRCID(numericDrcId, area))
          );
    
          // Flatten the array of officer lists
          const flattenedOfficers = officers.flat();
          setRecoveryOfficers(flattenedOfficers);
        } else {
          setError("DRC ID not found in URL. (try http://localhost:5173/pages/Distribute/DistributeTORO/200)");
        }
      } catch (error) {
        console.error("Error fetching recovery officers:", error);
        setError("Failed to fetch recovery officers.");
      }
    };
    

  fetchData();
  fetchRecoveryOfficers();
}, [drc_id, selectedRows]); // Including drc_id to the Dependency array
  
  
   // Filter Function
  const handleFilter = () => {
    const filtered = data.filter((item) => {
      // RTOM Area Filter
      const rtomValid = !selectedRTOM || item.area?.includes(selectedRTOM);
  
      // Arrears Band Filter
      const arrearsBandValid = !selectedArrearsBand || (() => {
        // Remove commas and convert to numbers
        const bandRange = selectedArrearsBand
          .split(" - ")
          .map((v) => parseFloat(v.replace(/,/g, ""))); // Remove commas and parse as floats
        const amount = parseFloat(item.current_arrears_amount?.toString().replace(/,/g, "")) || 0; // Remove commas from the amount
  
        return bandRange.length === 2
          ? amount >= bandRange[0] && amount <= bandRange[1]
          : bandRange.length === 1 && amount > bandRange[0];
      })();
  
      // Date Filters
      const dateValid = !fromDate || (
        item.last_payment_dtm && new Date(item.last_payment_dtm) >= new Date(fromDate)
      );
      const expireDateValid = !toDate || (
        item.case_status?.[0]?.expired_dtm && new Date(item.case_status[0].expired_dtm) <= new Date(toDate)
      );
  
      return rtomValid && arrearsBandValid && dateValid && expireDateValid;
    });
  
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };
  

//Search Logic
const searchInNestedObject = (obj, query) => {
  if (typeof obj === "string") {
    return obj.toLowerCase().includes(query.toLowerCase());
  }
  if (typeof obj === "number") {
    // Convert number to string and check for the query
    return obj.toString().toLowerCase().includes(query.toLowerCase());
  }
  if (typeof obj === "object" && obj !== null) {
    return Object.values(obj).some((value) => searchInNestedObject(value, query));
  }
  return false;
};

const filteredDataBySearch = filteredData.filter((row) =>
  searchInNestedObject(row, searchQuery)
);


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

  // Select All Logic
  const handleSelectAll = () => {
    const isSelectedAll = !selectAll;
    setSelectAll(isSelectedAll);
  
    if (isSelectedAll) {
      // Add all rows to the selected set and log their RTOM Areas and Case IDs
      const allSelected = new Set(currentData.map((_, index) => index));
      setSelectedRows(allSelected);
  
      currentData.forEach((row) => {
        console.log("Selected RTOM Area (Select All):", row.area);
        console.log("Selected Case ID (Select All):", row.case_id);
      });
    } else {
      // Deselect all rows
      setSelectedRows(new Set());
    }
  };
  
   //Rows with boxes are checked
   const handleRowSelect = (index) => {
    const newSelectedRows = new Set(selectedRows);
  
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
      const selectedRow = currentData[index]; // Get the selected row data
      console.log("Selected RTOM Area:", selectedRow.area); // Log RTOM Area
      console.log("Selected Case ID:", selectedRow.case_id); // Log Case ID
    }
  
    setSelectedRows(newSelectedRows);
  };
  

  // Filter Recovery Officers based on selected RTOM Areas
  const filteredOfficers = recoveryOfficers.filter((officer) => {
    // Get RTOM areas of the selected rows
    const selectedAreas = Array.from(selectedRows).map((index) => currentData[index].area);
  
    // Check if officer.rtoms_for_ro exists and is an array
    return officer.rtoms_for_ro && Array.isArray(officer.rtoms_for_ro) &&
           officer.rtoms_for_ro.some(area => selectedAreas.includes(area.name));
  });
  

const handleSubmit = async () => {
  // Get the selected Case IDs
  const selectedCaseIds = Array.from(selectedRows).map((index) => currentData[index].case_id);

  if (selectedCaseIds.length === 0) {
    // SweetAlert if no rows are selected
    Swal.fire({
      icon: 'warning',
      title: 'No rows selected',
      text: 'Please select at least one row to submit.',
    });
    return;
  }

  if (!selectedRO) {
    // SweetAlert if no Recovery Officer is selected
    Swal.fire({
      icon: 'warning',
      title: 'No Recovery Officer selected',
      text: 'Please select a Recovery Officer to assign.',
    });
    return;
  }

  try {
    // Make the API request
    const response = await assignROToCase(selectedCaseIds, selectedRO);

    // SweetAlert success message
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Recovery Officer successfully assigned to the selected cases!',
    });

    console.log("API Response:", response);
  } catch (error) {
    // SweetAlert error message
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to assign Recovery Officer. Please try again.',
    });

    console.error("Error submitting data:", error);
  }
};
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Distribution</h1>

      <div className="flex items-center justify-end gap-4 mt-20 mb-4"> 

      {/* RTOM Select Dropdown */}
            <select
          className={GlobalStyle.selectBox}
          value={selectedRTOM}
          onChange={(e) => setSelectedRTOM(e.target.value)}
        >
            <option value="">RTOM</option>
             {rtoms.length > 0 ? (
               rtoms.map((rtom) => (
            <option key={rtom.rtom_id} value={rtom.area_name}>
              {rtom.area_name} {/* Ensure this is the correct name for the RTOM area */}
            </option>
         ))
      ) : (
           <option disabled>No RTOMs found</option>
         )}
      </select>

  {/* Arrears Band Select Dropdown */}
           <select
              className={GlobalStyle.selectBox}
              value={selectedArrearsBand}
              onChange={(e) => setSelectedArrearsBand(e.target.value)}
           >
     <option value="">Arrears Band</option>
       {["5,000 - 10,000", "10,000 - 25,000", "25,000 - 50,000", "50,000 - 100,000", ">100,000"].map(
            (band) => (
        <option key={band} value={band}>
             {band}
        </option>
       )
      )}
    </select>

      {/* Date Picker */}
     <div className="flex flex-col mb-4">
     <div className={GlobalStyle.datePickerContainer}>
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
     </div>

  {/* Filter Button */}
    <button onClick={handleFilter} className={`${GlobalStyle.buttonPrimary}`}>
       Filter
    </button>
   </div>

   {/* Search Section */}
   <div className="flex justify-start mb-4">
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
         {currentData.map((item, index) => (
           <tr
             key={item._id || index} // Use _id if available
             className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
           >
          <td className="text-center">
            <input
              type="checkbox"
              checked={selectedRows.has(index)}
              onChange={() => handleRowSelect(index)}
              className="mx-auto"
            />
          </td>
         <td className={GlobalStyle.tableData}> {item.case_status?.[0]?.case_status || "N/A"} </td>
         <td className={GlobalStyle.tableData}> {item.case_id || "N/A"} </td>
         <td className={GlobalStyle.tableData}> {item.case_status && item.case_status[0] && item.case_status[0].created_dtm  ? new Date(item.case_status[0].created_dtm).toLocaleDateString("en-CA")  : "N/A"} </td>
         <td className={GlobalStyle.tableData}> {item.current_arrears_amount || "N/A"} </td>
         <td className={GlobalStyle.tableData}> {item.action_type || "N/A"} </td>
         <td className={GlobalStyle.tableData}> {item.area || "N/A"} </td>
         <td className={GlobalStyle.tableData}> {item.drc?.[0]?.recovery_officers?.[0]?.name || "N/A"} </td>
         <td className={GlobalStyle.tableData}> {item.case_status?.[0]?.expired_dtm && item.case_status[0].expired_dtm !== ""  ? new Date(item.case_status[0].expired_dtm).toLocaleDateString("en-CA")  : "N/A"} </td> 
        </tr>
      ))}
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

   {/* Select All Data Checkbox and Submit Button */}
    <div className="flex justify-end gap-4 mt-4">
     {/* Select All Data Checkbox */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded-lg"
          checked={selectAll}
          onChange={handleSelectAll}
        />
            Select All Data
       </label>

    {/* Recovery Officer (RO) Select Dropdown */}
    <select
    id="ro-select"
    className={GlobalStyle.selectBox}
    value={selectedRO}
    onChange={(e) => {
        const selectedName = e.target.value;
        setSelectedRO(selectedName);
    }}
>
    <option value="" disabled hidden>
        Select RO
    </option>
    {recoveryOfficers && recoveryOfficers.length > 0 ? (
        // Flatten all officers into a single array
        [...new Set(recoveryOfficers.flatMap(response => response.data.map(officer => officer.ro_name)))].map((ro_name) => {
            const officer = recoveryOfficers.flatMap(response => response.data).find(o => o.ro_name === ro_name);
            return (
                <option
                    key={`${officer.ro_id}-${officer.ro_name}`}
                    value={officer.ro_name}
                >
                    {officer.ro_name}
                </option>
            );
        })
    ) : (
        <option value="" disabled>
            No officers available 
        </option>
    )}
</select>

  {/* Submit Button */}
    <button
      onClick={handleSubmit}
      className={GlobalStyle.buttonPrimary}
      disabled={selectedRows.size === 0} // Disable if no rows are selected
    >
      Submit
    </button>
  </div>
      </div>
    );
  };

export default DistributeTORO;

