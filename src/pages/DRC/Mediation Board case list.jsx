/* Purpose: This template is used for the 2.15 - Mediation Board case list .
Created Date: 2024-01-08
Created By: Chamath (chamathjayasanka20@gmail.com)
Last Modified Date:2025-01-08
Last Modified Date:2025-02-01
Last Modified Date:2025-02-17
Last Modified Date:2025-07-29
Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
Modified By: Chathundi Sakumini (sakuminic@gmail.com)
Modified By: Sathmi Peiris (sathmipeiris@gmail.com)
Version: node 20
ui number : 2.15
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Mediation Board case list Screen */


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { ListALLMediationCasesownnedbyDRCRO } from "../../services/case/CaseService.js";
import { getActiveRTOMsByDRCID } from "../../services/rtom/RtomService.js";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import edit from "../../assets/images/mediationBoard/edit.png";
import { getLoggedUserId } from "../../services/auth/authService.js";
import Swal from 'sweetalert2';
// Import status icons with correct file extensions
import Forward_to_Mediation_Board from "../../assets/images/mediationBoard/Forward_to_Mediation_Board.png";
import MB_fail_with_pending_non_settlement from "../../assets/images/mediationBoard/MB_fail_with_pending_non_settlement.png";
import MB_Handed_Customer_Info from "../../assets/images/mediationBoard/MB_Handed_Customer_Info.png";
import MB_Negotiation from "../../assets/images/mediationBoard/MB_Negotiation.png";
import MB_Request_Customer_Info from "../../assets/images/mediationBoard/MB_Request_Customer_Info.png";
import MB_Settle_Active from "../../assets/images/mediationBoard/MB_Settle_Active.png";
import MB_Settle_open_pending from "../../assets/images/mediationBoard/MB_Settle_open_pending.png";
import MB_Settle_pending from "../../assets/images/mediationBoard/MB_Settle_pending.png";
import MB_Fail_with_non_settlement from "../../assets/images/mediationBoard/MB_fail_with_non_settlement.png";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import { Tooltip } from "react-tooltip";

// Status icon mapping
const STATUS_ICONS = {
  "Forward to Mediation Board": {
    icon: Forward_to_Mediation_Board,
    tooltip: "Forward to Mediation Board"
  },
  "MB Fail with Pending Non-Settlement": {
    icon: MB_fail_with_pending_non_settlement,
    tooltip: "MB Fail with Pending Non-Settlement"
  },
  "MB Fail with Non-Settlement": {
    icon: MB_Fail_with_non_settlement,
    tooltip: "MB Fail with Non-Settlement"
  },
  "MB Negotiation": {
    icon: MB_Negotiation,
    tooltip: "MB Negotiation"
  },
  "MB_Request_Customer_Info": {
    icon: MB_Request_Customer_Info,
    tooltip: "MB Request Customer Info"
  },
  "MB Settle Active": {
    icon: MB_Settle_Active,
    tooltip: "MB Settle Active"
  },
  "MB Settle Open-Pending": {
    icon: MB_Settle_open_pending,
    tooltip: "MB Settle Open-Pending"
  },
  "MB Settle Pending": {
    icon: MB_Settle_pending,
    tooltip: "MB Settle Pending"
  }
};

// Status Icon component with tooltip
const StatusIcon = ({ status }) => {
  const statusInfo = STATUS_ICONS[status];
  const tooltipId = `tooltip-${status.replace(/\s+/g, '-')}`;
  if (!statusInfo) return <span>{status}</span>;

  return (
    <div className="relative group">
      <img
        src={statusInfo.icon}
        alt={status}
        data-tooltip-id={tooltipId}
        data-tooltip-content={statusInfo.tooltip}

        className="w-6 h-6 "
      />
      {/* <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded px-2 py-1 left-1/2 transform -translate-x-1/2 bottom-full mb-1 whitespace-nowrap z-10">
        {statusInfo.tooltip}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-gray-800 rotate-45"></div>
      </div> */}
    </div>
  );
};


const MediationBoardCaselist = () => {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  const [rtoms, setRtoms] = useState([]);
  const [rtom, setRtom] = useState("");

  const [drcId, setDrcId] = useState("");
  const [status, setStatus] = useState("");
  const [roId, setRoId] = useState("");
  const [actionType, setActionType] = useState("");

  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


 
  const [error, setError] = useState("");
 
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [userData, setUserData] = useState(null);
  // const [filters, setFilters] = useState({
  //   rtom: "",
  //   action_type: "",
  //   status: "",
  // });
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
   const [userRole, setUserRole] = useState(null); // Role-Based Buttons

    // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // const [totalAPIPages, setTotalAPIPages] = useState(1);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true); // State to track if more data is available
  const rowsPerPage = 10; // Number of rows per page

  // variables need for table
  // const maxPages = Math.ceil(filteredDataBySearch.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  const [committedFilters, setCommittedFilters] = useState({
     rtom: "",
    actionType: "",
    status: "",
    fromDate: null,
    toDate: null
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        refreshAccessToken().then((newToken) => {
          if (!newToken) return;
          const newDecoded = jwtDecode(newToken);
          setUserRole(newDecoded.role);
        });
      } else {
        setUserRole(decoded.role);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    console.log("User data:", user);
    console.log("User DRC ID:", user?.drc_id);
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Then update your useEffect that fetches RTOMs
  useEffect(() => {
    const fetchRTOMs = async () => {
      try {
        if (userData?.drc_id) {
                    console.log("drc id:",userData?.drc_id);


          console.log("Fetching RTOMs for DRC ID:", userData?.drc_id);
          // Fetch RTOMs by DRC ID
          const rtomsList = await getActiveRTOMsByDRCID(userData?.drc_id);
          console.log("RTOM list retrieved:", rtomsList);
          
          // Check if the response is successful and has data
          if (rtomsList && Array.isArray(rtomsList)) {
            setRtoms(rtomsList);
          } else {
            console.warn("No RTOMs found or invalid response format:", rtomsList);
            setRtoms([]);
          }
        } else {
          console.log("No DRC ID available yet, skipping RTOM fetch");
        }
      } catch (error) {
        console.error("Error fetching RTOMs:", error);
      }
    };

    fetchRTOMs();
  }, [userData?.drc_id, userData?.ro_id]); // Only depend on userData


  const handlestartdatechange = (date) => {
    setFromDate(date);
    // if (toDate) checkdatediffrence(date, toDate);
  };

  const handleenddatechange = (date) => {
    setToDate(date);
    // if (fromDate) checkdatediffrence(fromDate, date);
  };

  // Check if toDate is greater than fromDate
  useEffect(() => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      Swal.fire({
        title: "Warning",
        text: "To date should be greater than or equal to From date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      setToDate(null);
      setFromDate(null);
      return;
    }
  }, [fromDate, toDate]);

    // Search Section
  const filteredDataBySearch = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

         const filterValidations = () => {
    if (!rtom && !actionType && !status && !fromDate && !toDate ) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please, select a filter.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      setToDate(null);
      setFromDate(null);
      return false;
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Warning",
        text: "Both From Date and To Date must be selected.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      setToDate(null);
      setFromDate(null);
      return false;
    }

    return true; // All validations passed
  };

  

  
  // Function to call the API and fetch filtered data
  const callAPI = async (filters) => {
    try {
      // Check if userData is available before proceeding
      if (!userData || !userData.drc_id) {
        console.error("User data not available or missing DRC ID");
        Swal.fire({
          title: "Error",
          text: "User data not available. Please refresh the page and try again.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
        return;
      }

      console.log(currentPage);

   

      const payload = {
        drc_id: userData.drc_id,
        ro_id: userData.ro_id,
        rtom: filters.rtom ,
        action_type: filters.actionType,
        status: filters.status,
        from_date: filters.fromDate,
        to_date: filters.toDate, 
        pages: filters.page,
        
      };
      console.log("Payload sent to API: ", payload);

      setIsLoading(true); // Set loading state to true
      const response = await ListALLMediationCasesownnedbyDRCRO(payload);
      setIsLoading(false); // Set loading state to false

      // Updated response handling
      if (response) {
        console.log("API Response:", response);
        // console.log("Valid data received:", response.data);
        if ( response && response.length > 0) {
          if (currentPage === 1) {
            setFilteredData(response)
            console.log("filyter data:", filteredData);
          } else {
            setFilteredData((prevData) => [...prevData, ...response]);
            console.log("filyter data:", filteredData);
          }
        }

        if (response.status === 204) {
          setIsMoreDataAvailable(false); // No more data available
          if (currentPage === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found for the selected filters.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor: "#f1c40f"
            });
          } else if (currentPage === 2) {
            setCurrentPage(1); // Reset to page 1 if no data found on page 2
          }
        } else {
          const maxData = currentPage === 1 ? 10 : 30;
          if (response.length < maxData) {
            setIsMoreDataAvailable(false); // More data available
          }
        }

      } else {
        Swal.fire({
          title: "Error",
          text: "No valid Mediation Board data found in response.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  }



    // Handle filter button click
  const handleFilterButton = () => {
    setIsMoreDataAvailable(true);
    setTotalPages(0); // Reset total pages
    setMaxCurrentPage(0);
    const isValid = filterValidations();
    if (!isValid) {
      return; // If validation fails, do not proceed
    } else {
      // setFilteredData([]);
      setCommittedFilters({
          rtom,
          actionType,
          status,
          fromDate,
          toDate
      });
      setFilteredData([]); // Clear previous results

      if (currentPage === 1) {
        callAPI({
          rtom,
          actionType,
          status,
          fromDate,
          toDate,
          page: 1
        });
      } else {
        setCurrentPage(1);
      }
      
    }
  }



    // return true; // All validations passed


  

 


  const handleClear = () => {
    setActionType("");
    setRtom("");
    setStatus("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setTotalPages(0); // Reset total pages
    setFilteredData([]); // Clear filtered data
    setMaxCurrentPage(0); // Reset max current page
    setIsMoreDataAvailable(true); // Reset more data available state
    // Clear committed filters
    setCommittedFilters({
      actionType: "",
      rtom: "",
      status: "",
      fromDate: null,
      toDate: null
    });
    if (currentPage != 1) {
      setCurrentPage(1); // Reset to page 1
    } else {
      setCurrentPage(0); // Temp set to 0
      setTimeout(() => setCurrentPage(1), 0); // Reset to 1 after
    }
  };



  useEffect(() => {
    if (isMoreDataAvailable && currentPage > maxCurrentPage && userData?.drc_id) {
      setMaxCurrentPage(currentPage); // Update max current page
      // callAPI(); // Call the function whenever currentPage changes
      callAPI({
        ...committedFilters,
        page: currentPage
      });
    }
  }, [currentPage, userData?.drc_id]);

 

   // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // console.log("Current Page:", currentPage);
    } else if (direction === "next") {
      if (isMoreDataAvailable) {
        setCurrentPage(currentPage + 1);
      } else {
        if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
          setCurrentPage(currentPage + 1);
        }
      }
      // console.log("Current Page:", currentPage);
    }
  };

    // display loading animation when data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Mediation Board Case List</h1>

      <div  className={`${GlobalStyle.cardContainer} w-full gap-4 mt-8` }>
        <div className="flex  flex-wrap items-center justify-end  gap-2 "> 
        {/* <select
          name="rtom"
          value={filters.rtom}
          onChange={handleFilterChange}
          className={`${GlobalStyle.selectBox}  w-32 md:w-40`}
           style={{ color: filters.rtom === "" ? "gray" : "black" }}
        > */}
          <select
              value={rtom}
              onChange={(e) => setRtom(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: rtom === "" ? "gray" : "black" }}
            >
          
          <option value="" hidden>Rtom</option>
          {rtoms.map((rtom) => (
            <option key={rtom.area_name} value={rtom.area_name} style={{ color: "black" }}>
              {rtom.area_name}
            </option>
          ))}
        </select>

        <select
          name="actionType"
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
          className={`${GlobalStyle.selectBox}   w-32 md:w-40`}
          style={{ color: actionType === "" ? "gray" : "black" }}
        >
          <option value="" hidden>Action Type</option>
          <option value="Arrears Collect" style={{ color: "black" }}>Arrears Collect</option>
          <option value="Arrears and CPE Collect" style={{ color: "black" }}>
            Arrears and CPE Collect
          </option>
          <option value="CPE Collect" style={{ color: "black" }}>CPE Collect</option>
        </select>

        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`${GlobalStyle.selectBox}  w-32 md:w-40`}
          style={{ color: status === "" ? "gray" : "black" }}
        >
          <option value="" hidden>Status</option>
          <option value="Forward to Mediation Board" style={{ color: "black" }}>Forward to Mediation Board</option>
          <option value="MB Negotiation" style={{ color: "black" }}>MB Negotiation</option>
          <option value="MB Settle Pending" style={{ color: "black" }}>MB Settle Pending</option>
          <option value="MB Settle Open-Pending" style={{ color: "black" }}>MB Settle Open-Pending</option>
          <option value="MB Settle Active" style={{ color: "black" }}>MB Settle Active</option>
          <option value="MB Fail with Pending Non-Settlement" style={{ color: "black" }}>MB Fail with Pending Non-Settlement</option>
          <option value="MB Fail with Non-Settlement" style={{ color: "black" }}>MB Fail with Non-Settlement</option>
        </select>

        <label className={GlobalStyle.dataPickerDate}>Date:</label>
        <DatePicker
          selected={fromDate}
          onChange={handlestartdatechange}
          dateFormat="dd/MM/yyyy"
          placeholderText="From"
          className={`${GlobalStyle.inputText} w-full sm:w-auto`} 
        />
        <DatePicker
          selected={toDate}
          onChange={handleenddatechange}
          dateFormat="dd/MM/yyyy"
          placeholderText="To"
          className={`${GlobalStyle.inputText} w-full sm:w-auto`}
        />

        <div>
            {["admin", "superadmin", "slt" , "drc_user", "drc_admin"].includes(userRole) && (
              <button
                className={`${GlobalStyle.buttonPrimary}  w-full sm:w-auto`}
                onClick={handleFilterButton}

              >
                {loading ? "Filter" : "Filter"}
              </button>
              )}
            </div>

            <div>
                  {["admin", "superadmin", "slt" , "drc_user", "drc_admin"].includes(userRole) && (
                    <button className={`${GlobalStyle.buttonRemove}  w-full sm:w-auto`}onClick={handleClear}>
                    Clear
                      </button>
                  )}
                </div>
        {/* <button
          className={GlobalStyle.buttonPrimary}
          onClick={handleFilterClick}

        >
          {loading ? "Filter" : "Filter"}
        </button> */}
        </div>
      </div>

      {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}

      <div className="flex flex-col">
        <div className="mb-4 flex justify-start">
          <div className={GlobalStyle.searchBarContainer}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                  setCurrentPage(1); // Reset to page 1 on search
                  setSearchQuery(e.target.value)
                }}
              className={GlobalStyle.inputSearch}
            />
            <FaSearch className={GlobalStyle.searchBarIcon} />
          </div>
        </div>

        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>Case ID</th>
                <th className={GlobalStyle.tableHeader}>Status</th>
                
                <th className={GlobalStyle.tableHeader}>RO Name</th>
                <th className={GlobalStyle.tableHeader}>RTOM</th>
                <th className={GlobalStyle.tableHeader}>Calling Round</th>
                <th className={GlobalStyle.tableHeader}>Date</th>
                <th className={GlobalStyle.tableHeader}>Next Calling Date</th>
                <th className={GlobalStyle.tableHeader}></th>
              </tr>
            </thead>
            <tbody>
              {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
                  filteredDataBySearch.slice(startIndex, endIndex).map((item, index) => (
                <tr
                  key={item.case_id}
                  className={`${index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                    } border-b`}
                >
                  <td className={GlobalStyle.tableData}>{item.case_id}</td>
                  <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
                    <StatusIcon status={item.status} />
                    
                     <Tooltip id={`tooltip-${item.status.replace(/\s+/g, '-')}`} className="tooltip" effect="solid" place="bottom" content={item.status} />
                  </td>

                  

                  
                  <td className={GlobalStyle.tableData}>{item.ro_name}</td>
                  <td className={GlobalStyle.tableData}>{item.area}</td>
                  <td className={GlobalStyle.tableData}>
                    {item.mediation_board_count || 0}
                  </td>
                    <td className={GlobalStyle.tableData}>
                   {item.created_dtm
                      ? new Date(item.created_dtm).toLocaleDateString("en-GB")
                      : ""}
                  </td>

                  <td className={GlobalStyle.tableData}>{item.next_calling_date
                      ? new Date(item.next_calling_date).toLocaleDateString("en-GB")
                      : ""}</td>
                  <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
                    <div>
                      {["admin", "superadmin", "slt" , "drc_user", "drc_admin"].includes(userRole) && (
                        <button>
                        <img
                          src={edit}
                          alt="Edit Case"
                          data-tooltip-id="edit-tooltip"
                          className={`w-6 h-6   ${item.status === "MB_fail_with_pending_non_settlement"
                              ? "opacity-50 cursor-default"
                              : "cursor-pointer"
                            }`} // No cursor-pointer for "MB_fail_with_pending_non_settlement"
                          onClick={() =>
                            item.status !== "MB_fail_with_pending_non_settlement" &&
                            userData?.drc_id &&
                            navigate(`/pages/DRC/Mediation Board Response`, {
                              state: { DRc_id: userData.drc_id, CAse_id: item.case_id },
                            }  )
                          

                          } // Prevent navigation for "MB_fail_with_pending_non_settlement"
                        />
                         <Tooltip id="edit-tooltip" className="tooltip" effect="solid" place="bottom" content="Edit" />
                        </button>
                      )}
                    </div>
                    {/* <button>
                    <img
                      src={edit}
                      alt="Edit Case"
                      className={`w-6 h-6 ${row.status === "MB_fail_with_pending_non_settlement"
                          ? "opacity-50 cursor-default"
                          : "cursor-pointer"
                        }`} // No cursor-pointer for "MB_fail_with_pending_non_settlement"
                      onClick={() =>
                        row.status !== "MB_fail_with_pending_non_settlement" &&
                        navigate(`/pages/DRC/Mediation Board Response`, {
                          state: { DRc_id: userData.drc_id, CAse_id: row.case_id },
                        }  )
                      

                      } // Prevent navigation for "MB_fail_with_pending_non_settlement"
                    />
                    </button> */}
                  </td>
                </tr>
              ))): (
                  <tr>
                    <td colSpan={9} className={`${GlobalStyle.tableData} text-center`}>No cases available</td>
                  </tr>
                )}
              {/* // {paginatedData.length === 0 && (
                <tr>
                <td colSpan="8" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                    No cases found.
                  </td>
              </tr>
              )} */}
            </tbody>
          </table>
        </div>
      </div>

       {/* Pagination Section */}
          { filteredDataBySearch.length > 0 && (<div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={() => handlePrevNext("prev")}
              disabled={currentPage <= 1}
              className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
            >
              <FaArrowLeft />
            </button>
            <span className={`${GlobalStyle.pageIndicator} mx-4`}>
              Page {currentPage}
            </span>
            <button
              onClick={() => handlePrevNext("next")}
              disabled={
                searchQuery
                  ? currentPage >= Math.ceil(filteredDataBySearch.length / rowsPerPage)
                  : !isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / rowsPerPage
                  )}
              className={`${GlobalStyle.navButton} ${(searchQuery
                ? currentPage >= Math.ceil(filteredDataBySearch.length / rowsPerPage)
                : !isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / rowsPerPage))
                ? "cursor-not-allowed"
                : ""
                }`}
            >
              <FaArrowRight />
            </button>
          </div>)}
    </div>
  );
};

export default MediationBoardCaselist;