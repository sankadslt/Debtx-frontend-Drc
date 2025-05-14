/* Purpose: This template is used for the 2.2 - Distribute TO RO.
Created Date: 2025-01-08
Created By: Geeth (eshaneperera@gmail.com)
Last Modified Date: 2025-01-08
Modified Date: 2025-02-23
Modified By: Geeth(eshaneperera@gmail.com), Nimesh Perera(nimeshmathew999@gmail.com), Sasindu Srinayaka(sasindusrinayaka@gmail.com)
Version: node 20
ui number : 2.2
Dependencies: tailwind css
Related Files: (routes)
Notes: This page includes a filter and a table */


import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { listHandlingCasesByDRC } from "../../services/case/CaseService";
import { getActiveRODetailsByDrcID } from "../../services/Ro/RO";
import { getActiveRTOMsByDRCID } from "../../services/rtom/RtomService";
import { assignROToCase } from "../../services/case/CaseService";
import { fetchAllArrearsBands } from "../../services/case/CaseService";
import { getLoggedUserId } from "../../services/auth/authService.js";
import Swal from 'sweetalert2';

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

const DistributeTORO = () => {
  const [rtoms, setRtoms] = useState([]);
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
  const [arrearsAmounts, setArrearsAmounts] = useState([]);
  const [selectedArrearsBand, setSelectedArrearsBand] = useState("");
  const [userData, setUserData] = useState(null);
  const [filteredOfficers, setFilteredOfficers] = useState([]);

  // const loadUser = async () => {
  //   let token = localStorage.getItem("accessToken");
  //   if (!token) {
  //     setUserData(null);
  //     return;
  //   }

  //   try {
  //     let decoded = jwtDecode(token);
  //     const currentTime = Date.now() / 1000;
  //     if (decoded.exp < currentTime) {
  //       token = await refreshAccessToken();
  //       if (!token) return;
  //       decoded = jwtDecode(token);
  //     }

  //     setUserData({
  //       id: decoded.user_id,
  //       role: decoded.role,
  //       drc_id: decoded.drc_id,
  //       ro_id: decoded.ro_id,
  //     });
  //   } catch (error) {
  //     console.error("Invalid token:", error);
  //   }
  // };

  // useEffect(() => {
  //   loadUser();
  // }, [localStorage.getItem("accessToken")]);

  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    console.log("User data:", user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userData?.drc_id) {
          setError("DRC ID not found in URL. (try http://localhost:5173/pages/Distribute/DistributeTORO/userData?.drc_id)");
          return;
        }
        // Step 3: Fetch arrears bands and ro list
        const arrearsAmounts = await fetchAllArrearsBands();
        setArrearsAmounts(arrearsAmounts);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [userData?.drc_id]);

  // Fetch data and RTOMs when drc_id changes
  useEffect(() => {

    console.log("fromDatea:", fromDate);
    console.log("toDate:", toDate);
    const fetchData = async () => {
      try {
        if (userData?.drc_id) {
          const payload = parseInt(userData?.drc_id);

          // Fetch RTOMs
          const rtomsList = await getActiveRTOMsByDRCID(payload);
          setRtoms(rtomsList);

        } else {
          setError("DRC ID not found in URL. (try http://localhost:5173/pages/Distribute/DistributeTORO/userData?.drc_id)");
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
        if (userData?.drc_id) {
          const numericDrcId = Number(userData?.drc_id);
          const officers = await getActiveRODetailsByDrcID(numericDrcId);

          if (Array.isArray(officers)) {
            // Map recovery officers with ro_id and other details
            const formattedOfficers = officers.map((officer) => ({
              ro_id: officer.ro_id,
              ro_name: officer.ro_name,
              rtoms_for_ro: officer.rtoms_for_ro || [], // Ensure rtoms_for_ro is never undefined
            }));

            setRecoveryOfficers(formattedOfficers);
            console.log("Recovery Officers:", formattedOfficers);
          } else {
            console.error("Invalid response format:", officers);
            setRecoveryOfficers([]);
            setError("Failed to fetch recovery officers. Invalid response format.");
          }
        } else {
          setError("DRC ID not found in URL.");
        }
      } catch (error) {
        console.error("Error fetching recovery officers:", error);
        setError("Failed to fetch recovery officers.");
        setRecoveryOfficers([]); // Set empty array to prevent further errors
      }
    };
    fetchData();
    fetchRecoveryOfficers();

  }, [userData?.drc_id]);



  const handlestartdatechange = (date) => {
    if (date === null) {
      setFromDate(null);
      return;
    }

    if (toDate) {

      if (date > toDate) {

        Swal.fire({
          title: "Warning",
          text: "The 'From' date cannot be later than the 'To' date.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      } else {
        checkdatediffrence(date, toDate);
        setFromDate(date);
      }

    } else {

      setFromDate(date);

    }


  };
  const handleenddatechange = (date) => {
    if (date === null) {
      setToDate(null);
      return;
    }

    if (fromDate) {
      if (date < fromDate) {
        Swal.fire({
          title: "Warning",
          text: "The 'To' date cannot be before the 'From' date.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      } else {
        checkdatediffrence(fromDate, date);
        setToDate(date);
      }
    } else {
      setToDate(date);
    }
  };


  const checkdatediffrence = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffInMs = end - start;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const diffInMonths = diffInDays / 30;

    if (diffInMonths > 1) {
      Swal.fire({
        title: "Date Range Exceeded",
        text: "The selected dates have more than a 1-month gap.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          setToDate(null);
          console.log("Dates cleared");
        }
      }
      );
    };
  };


  const handleFilter = async () => {
    try {
      setFilteredData([]); // Clear previous results
      setSelectedRows(new Set()); // Clear row selections
      setSelectAll(false); // Reset select all

      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };

      if (!selectedArrearsBand && !selectedRTOM && !fromDate && !toDate) {
        Swal.fire({
          title: "Missing Filters",
          text: "Please select at least one filter.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      };


      if ((fromDate && !toDate) || (!fromDate && toDate)) {
        Swal.fire({
          title: "Warning",
          text: "Both From Date and To Date must be selected.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setToDate(null);
        setFromDate(null);
        return;
      }


      if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        Swal.fire({
          title: "Warning",
          text: "To date should be greater than or equal to From date",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setToDate(null);
        setFromDate(null);
        return;
      };

      const payload = {
        drc_id: Number(userData?.drc_id),
        rtom: selectedRTOM,
        arrears_band: selectedArrearsBand,
        ro_id: selectedRO ? Number(selectedRO) : "", // Ensure it's properly assigned
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
      };

      const response = await listHandlingCasesByDRC(payload);

      if (Array.isArray(response)) {
        setFilteredData(response);
        setCurrentPage(1); // Reset to first page after filtering
      } else {
        console.error("No valid cases data found in response.");
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error"
      });
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
      // Add all rows to the selected set
      const allSelected = new Set(currentData.map((_, index) => index));
      setSelectedRows(allSelected);
    } else {
      // Deselect all rows
      setSelectedRows(new Set());
    }

    // Update filtered officers based on selection
    updateFilteredOfficers(isSelectedAll ? currentData.map((_, index) => index) : []);
  };

  //Rows with boxes are checked
  const handleRowSelect = (index) => {
    const newSelectedRows = new Set(selectedRows);

    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }

    setSelectedRows(newSelectedRows);

    // Update filtered officers based on selected rows
    updateFilteredOfficers(Array.from(newSelectedRows));

    // Update select all checkbox state
    setSelectAll(newSelectedRows.size === currentData.length);
  };

  // Filter Recovery Officers based on selected RTOM Areas
  const updateFilteredOfficers = (selectedIndices) => {
    if (selectedIndices.length === 0) {
      setFilteredOfficers(recoveryOfficers);
      return;
    }

    // Get RTOM areas of the selected rows
    const selectedAreas = selectedIndices.map((index) => currentData[index].area);

    // Filter officers who have matching RTOM areas
    const officers = recoveryOfficers.filter((officer) => {
      return officer.rtoms_for_ro && Array.isArray(officer.rtoms_for_ro) &&
        officer.rtoms_for_ro.some(rtom => selectedAreas.includes(rtom.name));
    });

    setFilteredOfficers(officers);

    // Reset selected RO if it's no longer in the filtered list
    if (selectedRO && !officers.some(officer => officer.ro_id.toString() === selectedRO.toString())) {
      setSelectedRO("");
    }
  };

  // Update filtered officers when selected rows change
  useEffect(() => {
    updateFilteredOfficers(Array.from(selectedRows));
  }, [selectedRows]);

  // Initialize filtered officers with all officers
  useEffect(() => {
    setFilteredOfficers(recoveryOfficers);
  }, [recoveryOfficers]);

  const handleSubmit = async () => {
    try {
      if (!selectedRO) {
        Swal.fire({
          title: "Error",
          text: "No Recovery Officer selected!",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        return;
      }

      if (!selectedRows || selectedRows.size === 0) {
        Swal.fire({
          title: "Error",
          text: "Please select at least one row before submitting!",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        return;
      }

      // Find the selected recovery officer by ro_id
      const selectedOfficer = recoveryOfficers.find((officer) => officer.ro_id.toString() === selectedRO.toString());

      if (!selectedOfficer) {
        Swal.fire({
          title: "Error",
          text: "Selected Recovery Officer not found!",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        return;
      }

      const ro_id = selectedOfficer.ro_id;

      if (!ro_id) {
        Swal.fire({
          title: "Error",
          text: "Recovery Officer ID is missing.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        return;
      }

      const selectedCaseIds = Array.from(selectedRows).map((index) => currentData[index]?.case_id);

      if (selectedCaseIds.length === 0) {
        Swal.fire({
          title: "Error",
          text: "No cases selected!",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        return;
      }

      const userId = await getLoggedUserId();

      // Create the payload object with all required parameters
      const assignmentPayload = {
        caseIds: selectedCaseIds,
        drcId: userData?.drc_id,
        roId: ro_id,
        assigned_by: userId, // Include assigned_by in the payload
      };

      // Update the API call to pass the complete payload
      const response = await assignROToCase(assignmentPayload);

      if (response.details?.failed_cases?.length > 0) {
        Swal.fire({
          title: "Error",
          text: "The RTOM area does not match any RTOM area assigned to Recovery Officer",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        return;
      }

      if (response.status === 'success') {
        Swal.fire({
          title: "Success",
          text: "Cases assigned successfully!",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        navigate(`/drc/assigned-ro-case-log`);
      } else {
        Swal.fire({
          title: "Error",
          text: response.message || "An error occurred while assigning cases.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      }

    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while assigning cases.",
        icon: "error",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <span className="text-gray-500">N/A</span>;

    switch (status.toLowerCase()) {
      case "open no agent":
        return <img src={Open_No_Agent} alt="Open No Agent" title="Open No Agent" className="w-5 h-5" />;
      case "open with agent":
        return <img src={Open_With_Agent} alt="Open With Agent" title="Open With Agent" className="w-5 h-5" />;
      case "negotiation settle pending":
        return <img src={Negotiation_Settle_Pending} alt="Negotiation Settle Pending" title="Negotiation Settle Pending" className="w-5 h-5" />;
      case "negotiation settle open pending":
        return <img src={Negotiation_Settle_Open_Pending} alt="Negotiation Settle Open Pending" title="Negotiation Settle Open Pending" className="w-5 h-5" />;
      case "negotiation settle active":
        return <img src={Negotiation_Settle_Active} alt="Negotiation Settle Active" title="Negotiation Settle Active" className="w-5 h-5" />;
      case "fmb":
        return <img src={FMB} alt="FMB" title="FMB" className="w-5 h-5" />;
      case "fmb settle pending":
        return <img src={FMB_Settle_Pending} alt="FMB Settle Pending" title="FMB Settle Pending" className="w-5 h-5" />;
      case "fmb settle open pending":
        return <img src={FMB_Settle_Open_Pending} alt="FMB Settle Open Pending" title="FMB Settle Open Pending" className="w-5 h-5" />;
      case "fmb settle active":
        return <img src={FMB_Settle_Active} alt="FMB Settle Active" title="FMB Settle Active" className="w-5 h-5" />;
      default:
        return <span className="text-gray-500">N/A</span>;
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
          {arrearsAmounts.length > 0 ? (
            arrearsAmounts.map((band, index) => (
              <option key={index} value={band.key}>
                {band.value}
              </option>
            ))
          ) : (
            <option value="">Loading...</option>
          )}
        </select>

        {/* Date Picker */}
        <div className="flex flex-col ">
          <div className={GlobalStyle.datePickerContainer}>
            <label className={GlobalStyle.dataPickerDate}>Date</label>
            <DatePicker
              selected={fromDate}
              onChange={handlestartdatechange}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className={GlobalStyle.inputText}
            />
            <DatePicker
              selected={toDate}
              onChange={handleenddatechange}
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
              <th className={GlobalStyle.tableHeader}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mx-auto"
                  disabled={currentData.length === 0}
                />
              </th>
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
                  <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>{getStatusIcon(item.status)}</td>
                  <td className={GlobalStyle.tableData}> {item.case_id || "N/A"} </td>

                  <td className={GlobalStyle.tableData}> {item.created_dtm
                    ? new Date(item.created_dtm).toLocaleDateString("en-GB")
                    : "N/A"} </td>
                  <td className={GlobalStyle.tableData}> {item.current_arrears_amount || "N/A"} </td>
                  <td className={GlobalStyle.tableData}> {item.remark || "N/A"} </td>
                  <td className={GlobalStyle.tableData}> {item.area || "N/A"} </td>
                  <td className={GlobalStyle.tableData}> {item.ro_name || "N/A"} </td>
                  <td className={GlobalStyle.tableData}>  {item.expire_dtm
                    ? new Date(item.expire_dtm).toLocaleDateString("en-GB")
                    : "N/A"}  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">No cases available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {filteredDataBySearch.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            onClick={() => handlePrevNext("prev")}
            disabled={currentPage === 1}
            className={`${GlobalStyle.navButton} ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <FaArrowLeft />
          </button>
          <span className={`${GlobalStyle.pageIndicator} mx-4`}>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => handlePrevNext("next")}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`${GlobalStyle.navButton} ${(currentPage === totalPages || totalPages === 0) ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {/* RO Selection and Submit Section */}
      <div className="flex justify-end gap-4 mt-4">
        {/* Recovery Officer (RO) Select Dropdown */}
        <select
          id="ro-select"
          className={GlobalStyle.selectBox}
          value={selectedRO}
          onChange={(e) => setSelectedRO(e.target.value)}
          disabled={selectedRows.size === 0}
        >
          <option value="">Select RO</option>
          {filteredOfficers.map((officer) => (
            <option key={officer.ro_id} value={officer.ro_id}>
              {officer.ro_name} - {officer.rtoms_for_ro.map(rtom => rtom.name).join(", ")}
            </option>
          ))}
        </select>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`${GlobalStyle.buttonPrimary} ${selectedRows.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={selectedRows.size === 0}
        >
          Submit
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`${GlobalStyle.navButton} mt-4`}
      >
        <FaArrowLeft className="mr-2" />Go Back
      </button>
    </div>
  );
};

export default DistributeTORO;