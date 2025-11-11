import { useState, useEffect, useRef } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
//import more from "../../assets/images/imagefor1.a.13(one).png";
import { listAllSettlementCasesForDRC } from "../../services/settlement/SettlementServices.js";
import Swal from 'sweetalert2';
import { Tooltip } from "react-tooltip";
//import { Create_Task_For_Downloard_Settlement_List } from "../../services/settlement/SettlementServices";
import { getLoggedUserId } from "../../services/auth/authService";
//import { Discard_Settlement_Plan } from "../../services/settlement/SettlementServices";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import Open from "/src/assets/images/settlement_status/Open .png";
import Open_Pending  from "/src/assets/images/settlement_status/Open_Pending .png";
import Compleate from "/src/assets/images/settlement_status/Compleate .png";
import Active from "/src/assets/images/settlement_status/Active .png";
import Abandaned from "/src/assets/images/settlement_status/Abandaned .png";
import Withdraw from "/src/assets/images/settlement_status/Withdraw.png";

const Monitor_Settlement_For_DRC = () => {
  // State Variables
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [caseId, setCaseId] = useState("");
  const [status, setStatus] = useState("");
  const [phase, setPhase] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [searchBy, setSearchBy] = useState("case_id"); // Default search by case ID
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false); // State to track task creation status
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
  const hasMounted = useRef(false);
  const [committedFilters, setCommittedFilters] = useState({
    caseId: "",
    accountNo: "",
    phase: "",
    status: "",
    fromDate: null,
    toDate: null
  });

  // Role-Based Buttons
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

  // return Icon based on settlement status and settlement phase
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return Open;
      case "open_pending":
        return Open_Pending;
      case "active":
        return Active;
      case "withdraw":
        return Withdraw;
      case "completed":
        return Compleate;
      case "abondant":
        return Abandaned;
      default:
        return null;
    }
  };

    // helper to determine if discard button should be shown
    const isDiscardableStatus = (status) => {
      if (!status) return false;
      const s = status.toLowerCase();
      return s === 'active' || s === 'open' || s === 'aactive';
    };

  // render status icon with tooltip
  const renderStatusIcon = (status, index) => {
    const iconPath = getStatusIcon(status);

    if (!iconPath) {
      return <span>{status}</span>;
    }

    const tooltipId = `tooltip-${index}`;

    return (
      <div className="flex items-center gap-2">
        <img
          src={iconPath}
          alt={status}
          className="w-7 h-7"
          data-tooltip-id={tooltipId} // Add tooltip ID to image
        />
        {/* Tooltip component */}
        <Tooltip id={tooltipId} place="bottom" effect="solid">
          {`${status}`} {/* Tooltip text is the phase and status */}
        </Tooltip>
      </div>
    );
  };

  const navigate = useNavigate();

  const handlestartdatechange = (date) => {
    setFromDate(date);
    // if (toDate) checkdatediffrence(date, toDate);
  };

  const handleenddatechange = (date) => {
    setToDate(date);
    // if (fromDate) checkdatediffrence(fromDate, date);
  };

  // Check the difference between two dates
  // If the difference is more than 1 month, show a warning
  // const checkdatediffrence = (startDate, endDate) => {
  //   const start = new Date(startDate).getTime();
  //   const end = new Date(endDate).getTime();
  //   const diffInMs = end - start;
  //   const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  //   const diffInMonths = diffInDays / 30;

  //   if (diffInMonths > 1) {
  //     Swal.fire({
  //       title: "Date Range Exceeded",
  //       text: "The selected dates shouldn't have more than a 1-month gap.",
  //       icon: "warning",
  //       confirmButtonColor: "#f1c40f"
  //     })
  //     setToDate(null);
  //     setFromDate(null);
  //     return;
  //   }
  // };

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

  // Validate case ID input preventing non-numeric characters
  const validateCaseId = () => {
    if (searchBy === "case_id" && !/^\d*$/.test(caseId)) {
      Swal.fire({
        title: "Warning",
        text: "Invalid input. Only numbers are allowed for Case ID.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      setCaseId(""); // Clear the invalid input
      return;
    }
  }

  useEffect(() => {
    validateCaseId(); // Validate case ID input
  }, [caseId]);

  // Validate filters before calling the API
  const filterValidations = () => {
    if (!caseId && !phase && !status && !fromDate && !toDate && !accountNo) {
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

      console.log(currentPage);

      let drc_id = null;
let ro_id = null;
try {
  const user = await getLoggedUserId();
  drc_id = user?.drc_id;
  ro_id = user?.ro_id ?? null;
} catch (e) {
  console.warn("Could not read logged user for drc_id:", e);
}

// ✅ Require drc_id
if (!drc_id) {
  Swal.fire({
    title: "Error",
    text: "Missing DRC ID. Please log in again or select a valid DRC.",
    icon: "error",
    confirmButtonColor: "#d33"
  });
  setIsLoading(false);
  return;
}


      // const payload = {
      //   case_id: caseId,
      //   account_no: accountNo,
      //   settlement_phase: phase,
      //   settlement_status: status,
      //   from_date: formatDate(fromDate),
      //   to_date: formatDate(toDate),
      //   pages: currentPage,
      // };
      const payload = {
        drc_id,
        ro_id,
        case_id: filters.caseId,
        account_no: filters.accountNo,
        settlement_phase: filters.phase,
        settlement_status: filters.status,
        from_date: filters.fromDate,
        to_date: filters.toDate,
        pages: filters.page,
      };
      console.log("Payload sent to API: ", payload);

      setIsLoading(true); // Set loading state to true
      const response = await listAllSettlementCasesForDRC(payload);
      setIsLoading(false); // Set loading state to false

      // Updated response handling
      if (response) {
        // console.log("Valid data received:", response.data);
        if (response.status === 200 && response.data && response.data.data && response.data.data.length > 0) {
          if (currentPage === 1) {
            setFilteredData(response.data.data)
          } else {
            setFilteredData((prevData) => [...prevData, ...response.data.data]);
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
          if (response.data.data.length < maxData) {
            setIsMoreDataAvailable(false); // More data available
          }
        }

      } else {
        Swal.fire({
          title: "Error",
          text: "No valid Settlement data found in response.",
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

  useEffect(() => {
    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max current page
      // callAPI(); // Call the function whenever currentPage changes
      callAPI({
        ...committedFilters,
        page: currentPage
      });
    }
  }, [currentPage]);

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

  // Handle Filter Button click
  const handleFilterButton = () => {
    setIsMoreDataAvailable(true); // Reset more data available state
    setTotalPages(0); // Reset total pages
    setMaxCurrentPage(0); // Reset max current page
    const isValid = filterValidations(); // Validate filters before applying
    if (!isValid) {
      return; // If validation fails, do not proceed
    } else {
      setCommittedFilters({
        caseId,
        accountNo,
        phase,
        status,
        fromDate,
        toDate
      });
      setFilteredData([]); // Clear previous results
      if (currentPage === 1) {
        // callAPI();
        callAPI({
          caseId,
          accountNo,
          phase,
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

  // Handle Clear Button click
  const handleClear = () => {
    setCaseId("");
    setAccountNo("");
    setPhase("");
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
      caseId: "",
      accountNo: "",
      phase: "",
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

  // Function to navigate to the settlement details page
  const naviPreview = (caseId, settlementID) => {
    navigate("/lod/ftl-log/preview", { state: { caseId, settlementID } });
  };

  // Function to navigate to the case ID page
  const naviCaseID = async (caseId, roId = null) => {
    try {
      const user = await getLoggedUserId();
      const drc_id = user?.drc_id;
      if (!drc_id) {
        Swal.fire({
          title: "Error",
          text: "Unable to determine DRC ID. Please login again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        return;
      }

      navigate("/drc/case-details", { state: { caseId, drc_id, ro_id: roId || null } });
    } catch (err) {
      console.error("Failed to navigate to case details:", err);
      Swal.fire({ title: "Error", text: "Failed to open case details.", icon: "error" });
    }
  };

  // Function to handle the creation of tasks for downloading settlement list
  const HandleCreateTaskDownloadSettlementList = async () => {

    const userData = await getLoggedUserId(); // Assign user ID

    if (!fromDate || !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please select From Date and To Date.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    setIsCreatingTask(true);
    
    try {
      const response = await Create_Task_For_Downloard_Settlement_List(userData, phase, status, fromDate, toDate, caseId, accountNo);
      if (response.status === 200) {
        Swal.fire({
          title: "Task created successfully!",
          text: "Task ID: " + response.data.data.data.Task_Id,
          icon: "success",
          confirmButtonColor: "#28a745"
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to create task.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    } finally {
      setIsCreatingTask(false);
    }
  };

  
  const handleDiscard = (caseId, settlementId) => {
    console.log("Discard clicked for:", settlementId);

    // Confirm with user and collect a reason
    Swal.fire({
      title: 'Confirm Discard',
      input: 'text',
      inputLabel: 'Reason (optional)',
      inputPlaceholder: 'Enter reason for discard',
      inputAttributes: {
        'aria-label': 'Reason for discard'
      },
      text: `Are you sure you want to discard settlement ${settlementId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, discard it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const reason = result.value || 'No reason provided';
        try {
          const userId = await getLoggedUserId();
          // Call the API with the provided caseId and settlementId
          const resp = await Discard_Settlement_Plan(parseInt(caseId || 0), userId || 'system', reason, );
          // If successful, remove the settlement from the list
          setFilteredData((prev) => prev.filter((s) => s.settlement_id !== settlementId));
          Swal.fire('Discarded!', `Settlement ${settlementId} discarded.`, 'success');
        } catch (error) {
          console.error('Error discarding settlement:', error);
          // Determine message from different possible error shapes
          let message = 'Failed to discard settlement.';

          // If service threw a plain object with status_reason
          if (error?.status_reason) {
            message = Array.isArray(error.status_reason)
              ? error.status_reason.join(', ')
              : String(error.status_reason);
          } else if (error?.response?.data?.status_reason) {
            // If axios error with response data
            const sr = error.response.data.status_reason;
            message = Array.isArray(sr) ? sr.join(', ') : String(sr);
          } else if (error?.message) {
            message = error.message;
          }

          Swal.fire({
            title: 'Error',
            text: message,
            icon: 'error',
            confirmButtonColor: '#d33'
          });
          
        }
      }
    });
  };

  useEffect(() => {
    setAccountNo("");
    setCaseId("");
  }, [searchBy]);


  // display loading animation when data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <div className="flex flex-col flex-1">
        <main className="p-6">
          <h1 className={GlobalStyle.headingLarge}>Settlement List</h1>

          {/* Filters Section */}
          <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
            <div className="flex flex-wrap items-center justify-end w-full gap-3">

              <div className="flex items-center">
                <select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: searchBy === "" ? "gray" : "black" }}
                >
                  <option value="" hidden >Select</option>
                  <option value="account_no" style={{ color: "black" }}>Account Number</option>
                  <option value="case_id" style={{ color: "black" }}>Case ID</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="text"
                  value={searchBy === "case_id" ? caseId : accountNo}
                  onChange={(e) =>
                    searchBy === "case_id"
                      ? setCaseId(e.target.value)
                      : setAccountNo(e.target.value)
                  }
                  className={`${GlobalStyle.inputText}  w-40`}
                  placeholder={searchBy === "case_id" ? "Case ID" : "Account Number"}
                />
              </div>

              <div className="flex items-center">
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: phase === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>Phase</option>
                  <option value="Negotiation" style={{ color: "black" }}>Negotiation</option>
                  <option value="Mediation Board" style={{ color: "black" }}>Mediation Board</option>
                  <option value="Litigation" style={{ color: "black" }}>Litigation</option>
                  <option value="LOD" style={{ color: "black" }}>LOD</option>
                  <option value="WRIT" style={{ color: "black" }}>WRIT</option>
                  <option value="Dispute" style={{ color: "black" }}>Dispute</option>
                </select>
              </div>

              <div className="flex items-center">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: status === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>Status</option>
                  <option value="Open" style={{ color: "black" }}>Open</option>
                  <option value="Open_Pending" style={{ color: "black" }}>Open Pending</option>
                  <option value="Active" style={{ color: "black" }}>Active</option>
                  <option value="WithDraw" style={{ color: "black" }}>WithDraw</option>
                  <option value="Completed" style={{ color: "black" }}>Completed</option>
                  <option value="Abandant" style={{ color: "black" }}>Abandant</option>
                </select>
              </div>

              <label className={GlobalStyle.dataPickerDate}>Date</label>
              {/* <div className={GlobalStyle.datePickerContainer}> */}
              {/* <div className="flex items-center space-x-2"> */}
              {/* <div className="flex items-center"> */}
              <DatePicker
                selected={fromDate}
                onChange={handlestartdatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              />
              {/* </div> */}

              {/* <div className="flex items-center"> */}
              <DatePicker
                selected={toDate}
                onChange={handleenddatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              />
              {/* </div> */}
              {/* </div> */}

              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button
                  className={`${GlobalStyle.buttonPrimary}  w-full sm:w-auto`}
                  onClick={handleFilterButton}
                >
                  Filter
                </button>
              )}
              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button
                  className={`${GlobalStyle.buttonRemove}  w-full sm:w-auto`}
                  onClick={handleClear}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 flex justify-start mt-10">
            <div className={GlobalStyle.searchBarContainer}>
              <input
                type="text"
                className={GlobalStyle.inputSearch}
                value={searchQuery}
                onChange={(e) => {
                  setCurrentPage(1); // Reset to page 1 on search
                  setSearchQuery(e.target.value)
                }}
              />
              <FaSearch className={GlobalStyle.searchBarIcon} />
            </div>
          </div>

          {/* Table */}
          <div className={`${GlobalStyle.tableContainer} mt-10 overflow-x-auto`}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th className={GlobalStyle.tableHeader}>Case ID</th>
                  <th className={GlobalStyle.tableHeader}>Settlement Status</th>
                  <th className={GlobalStyle.tableHeader}>Settlement ID</th>
                  <th className={GlobalStyle.tableHeader}>Case Phase</th>
                  <th className={GlobalStyle.tableHeader}>Created DTM</th>
                  {/* <th className={GlobalStyle.tableHeader}></th> */}
                  
                </tr>
              </thead>

              <tbody>
                {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
                  filteredDataBySearch.slice(startIndex, endIndex).map((item, index) => (
                    <tr
                      key={item.settlement_id || index}
                      className={
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      }
                    >
                      <td
                        className={`${GlobalStyle.tableData}  text-black hover:underline cursor-pointer`}
                        onClick={() => naviCaseID(item.case_id, item.ro_id)}
                      >
                        {item.case_id || "N/A"}
                      </td>
                      <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
                        {renderStatusIcon(item.settlement_status, index)}
                        {/* {item.settlement_status} */}
                      </td>
                      <td className={GlobalStyle.tableData}>{item.settlement_id || ""}</td>
                      <td className={GlobalStyle.tableData}> {item.settlement_phase || ""} </td>
                      <td className={GlobalStyle.tableData}>{item.created_dtm ? new Date(item.created_dtm).toLocaleDateString("en-GB") : ""}</td>
{/* action column (More Details / Discard) removed per request */}
                    </tr>
                  ))
                ) : (
                    <tr>
                    <td colSpan={5} className={`${GlobalStyle.tableData} text-center`}>No cases available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          {filteredDataBySearch.length > 0 && (<div className={GlobalStyle.navButtonContainer}>
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

          {["admin", "superadmin", "slt"].includes(userRole) && filteredDataBySearch.length > 0 && (
            <button
              onClick={HandleCreateTaskDownloadSettlementList}
              className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
              disabled={isCreatingTask}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
              {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
            </button>
          )}
        </main>
      </div>
    </div>
  );
};

export default Monitor_Settlement_For_DRC;
