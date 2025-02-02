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
import { getActiveRODetailsByDrcID } from "../../services/Ro/RO";
import { getRTOMsByDRCID } from "../../services/rtom/RtomService";
import { assignROToCase } from "../../services/case/CaseService";
import { fetchAllArrearsBands } from "../../services/case/CaseService";
import Swal from 'sweetalert2';


const DistributeTORO = () => {
  const [rtoms, setRtoms] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRTOM, setSelectedRTOM] = useState("");
  const [selectedRO, setSelectedRO] = useState("");
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
  const [arrearsBands, setArrearsBands] = useState([]);
  const [selectedArrearsBand, setSelectedArrearsBand] = useState("");


  // Use useParams hook to get the drc_id from the URL
  const { drc_id } = useParams();

  useEffect(() => {
    const fetchArrearsBands = async () => {
      try {
        const bands = await fetchAllArrearsBands();
        setArrearsBands(bands);
      } catch (error) {
        console.error("Error fetching arrears bands:", error);
      }
    };
    fetchArrearsBands();
  }, []);

  // Fetch data and recovery officers when drc_id changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (drc_id) {
          const payload = parseInt(drc_id, 10);

          // Fetch RTOMs
          const rtomsList = await getRTOMsByDRCID(payload);
          setRtoms(rtomsList);

        } else {
          setError("DRC ID not found in URL. (try http://localhost:5173/pages/Distribute/DistributeTORO/200)");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRecoveryOfficers = async () => {
      try {
        if (drc_id) {
          const numericDrcId = Number(drc_id);
          const response = await getActiveRODetailsByDrcID(numericDrcId);

          // Map recovery officers with ro_id and other details
          const officers = response.data.map((officer) => ({
            ro_id: officer.ro_id, // Include ro_id
            ro_name: officer.ro_name,
            rtoms_for_ro: officer.rtoms_for_ro,
          }));
          setRecoveryOfficers(officers);
        } else {
          setError("DRC ID not found in URL.");
        }
      } catch (error) {
        console.error("Error fetching recovery officers:", error);
        setError("Failed to fetch recovery officers.");
      }
    };

    fetchData();
    fetchRecoveryOfficers();

  }, [drc_id]);

  const handleFilter = async () => {
    try {
      // Clear existing data (reset the table)
      setFilteredData([]); // Empty the data before making the API request

      // Create the payload with the filter data
      const payload = {
        drc_id: Number(drc_id), // Convert drc_id to a number
        rtom: selectedRTOM, // Selected RTOM area
        recovery_officer: selectedRO, // Selected Recovery Officer
        arrears_band: selectedArrearsBand, // Selected Arrears Band
        from_date: fromDate ? fromDate.toISOString() : null, // From date
        to_date: toDate ? toDate.toISOString() : null, // To date
      };

      // Log the request body (payload) to the console
      console.log("Request Payload:", payload);

      // Call the listHandlingCasesByDRC function with the payload
      const response = await listHandlingCasesByDRC(payload);

      // Log the response data
      console.log("API Response:", response);

      // If the response contains 'data' and we get an array of cases
      if (response.data && Array.isArray(response.data)) {
        // Set the data in state
        setFilteredData(response.data);
      } else {
        console.error("No valid cases data found in response.");
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      // Handle any error that may occur
    }
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
    try {
      // Extract selected case IDs
      const selectedCaseIds = Array.from(selectedRows).map((index) => currentData[index]?.case_id);

      if (selectedCaseIds.length === 0) {
        Swal.fire("Error", "No cases selected!", "error");
        return;
      }

      // Extract RTOM Area from selected rows
      const selectedAreas = Array.from(selectedRows).map((index) => currentData[index]?.area);
      console.log("Selected Areas:", selectedAreas);

      // Normalize selected areas for comparison
      const normalizedSelectedAreas = selectedAreas.map((area) => area?.toLowerCase().trim());

      // Find recovery officer for the selected location
      const selectedOfficer = filteredOfficers.find((officer) =>
        officer.rtoms_for_ro.some((rtom) =>
          normalizedSelectedAreas.includes(rtom.name?.toLowerCase().trim())
        )
      );
      console.log("Selected Officer:", selectedOfficer);

      if (!selectedOfficer) {
        Swal.fire("Error", "No recovery officer available for the selected areas!", "error");
        return;
      }

      // Prepare the payload (correct structure)
      const payload = {
        case_ids: selectedCaseIds, // Correctly structure case_ids as an array
        ro_id: selectedOfficer.ro_id, // Correctly set ro_id
      };

      // Log the payload being sent to the API
      console.log("Payload being sent to API:", JSON.stringify(payload));

      // Use the custom assignROToCase function with axios
      const response = await assignROToCase(selectedCaseIds, selectedOfficer.ro_id);

      if (response.status === 'success') {
        Swal.fire("Success", "Cases assigned successfully!", "success");
      } else {
        Swal.fire("Error", response.message, "error");
      }

    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Swal.fire("Error", "An error occurred while assigning cases.", "error");
    }
  };


  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Distribution</h1>

      <div className="flex items-center justify-end gap-4 mt-20 mb-4">

        {/* RTOM Select Dropdown */}
        <select
          className={GlobalStyle.selectBox}
          value={selectedRTOM}
          onChange={(e) => {
            const selectedAreaName = e.target.value;
            setSelectedRTOM(selectedAreaName);

            // Loop through the recovery officers to find matching area name in rtoms_for_ro
            const matchingROs = recoveryOfficers.filter(officer =>
              officer.rtoms_for_ro.some(rtom => rtom.name === selectedAreaName)
            );

            if (matchingROs.length > 0) {
              matchingROs.forEach(officer => {
                const matchingRTOM = officer.rtoms_for_ro.find(rtom => rtom.name === selectedAreaName);
                if (matchingRTOM) {
                  console.log(`RO Name for ${selectedAreaName}: ${officer.ro_name}`);
                }
              });
            } else {
              console.log(`No matching recovery officer found for ${selectedAreaName}`);
            }
          }}
        >
          <option value="">RTOM</option>
          {rtoms.length > 0 ? (
            rtoms.map((rtom) => (
              <option key={rtom.rtom_id} value={rtom.area_name}>
                {rtom.area_name}
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
          {arrearsBands.length > 0 ? (
            arrearsBands.map((band, index) => (
              <option key={index} value={band.key}>
                {band.value}
              </option>
            ))
          ) : (
            <option value="">Loading...</option>
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
            {currentData && currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={item.case_id || index} // Use case_id if available, else fallback to index
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
                  <td className={GlobalStyle.tableData}> {item.remark || "N/A"} </td>
                  <td className={GlobalStyle.tableData}> {item.case_id || "N/A"} </td>
                  <td className={GlobalStyle.tableData}> {new Date(item.created_dtm).toLocaleDateString("en-CA") || "N/A"} </td>
                  <td className={GlobalStyle.tableData}> {item.current_arreas_amount || "N/A"} </td>
                  <td className={GlobalStyle.tableData}> {item.remark || "N/A"} </td>
                  <td className={GlobalStyle.tableData}> {item.area || "N/A"} </td>
                  <td className={GlobalStyle.tableData}> {item.ro_name || "N/A"} </td>
                  <td className={GlobalStyle.tableData}> {new Date(item.expire_dtm).toLocaleDateString("en-CA") || "N/A"} </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No cases available</td>
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
          className={`${GlobalStyle.navButton} ${currentPage === 1 ? "cursor-not-allowed" : ""
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
          className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""
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
            recoveryOfficers.map((officer, index) => {
              // Format the display as "ro_name - rtoms_for_ro.name"
              const rtomsNames = officer.rtoms_for_ro.map((rtom) => rtom.name).join(", ");
              const displayName = `${officer.ro_name} - ${rtomsNames}`;

              return (
                <option key={`ro-${index}`} value={officer.ro_name}>
                  {displayName}
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

