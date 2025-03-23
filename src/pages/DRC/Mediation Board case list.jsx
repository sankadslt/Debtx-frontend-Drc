/* Purpose: This template is used for the 2.15 - Mediation Board case list .
Created Date: 2024-01-08
Created By: Chamath (chamathjayasanka20@gmail.com)
Last Modified Date:2025-01-08
Last Modified Date:2025-02-01
Last Modified Date:2025-02-17
Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
Modified By: Chathundi Sakumini (sakuminic@gmail.com)
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

// Status icon mapping
const STATUS_ICONS = {
  "Forward_to_Mediation_Board": {
    icon: Forward_to_Mediation_Board,
    tooltip: "Forward to Mediation Board"
  },
  "MB_fail_with_pending_non_settlement": {
    icon: MB_fail_with_pending_non_settlement,
    tooltip: "MB fail with pending non settlement"
  },
  "MB_Handed_Customer_Info": {
    icon: MB_Handed_Customer_Info,
    tooltip: "MB Handed Customer Info"
  },
  "MB_Negotiation": {
    icon: MB_Negotiation,
    tooltip: "MB Negotiation"
  },
  "MB_Request_Customer_Info": {
    icon: MB_Request_Customer_Info,
    tooltip: "MB Request Customer Info"
  },
  "MB_Settle_Active": {
    icon: MB_Settle_Active,
    tooltip: "MB Settle Active"
  },
  "MB_Settle_open_pending": {
    icon: MB_Settle_open_pending,
    tooltip: "MB Settle open pending"
  },
  "MB_Settle_pending": {
    icon: MB_Settle_pending,
    tooltip: "MB Settle pending"
  }
};

// Status Icon component with tooltip
const StatusIcon = ({ status }) => {
  const statusInfo = STATUS_ICONS[status];

  if (!statusInfo) return <span>{status}</span>;

  return (
    <div className="relative group">
      <img
        src={statusInfo.icon}
        alt={status}
        className="w-6 h-6 cursor-help"
      />
      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded px-2 py-1 left-1/2 transform -translate-x-1/2 bottom-full mb-1 whitespace-nowrap z-10">
        {statusInfo.tooltip}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
};


export default function MediationBoardCaselist() {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState(null);
  const [rtoms, setRtoms] = useState([]);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [userData, setUserData] = useState(null);
  const [filters, setFilters] = useState({
    rtom: "",
    action_type: "",
    status: "",
  });
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  const rowsPerPage = 7;

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const userData = await getUserData();
  //       console.log("User Data: ", userData);
  //       setUser(userData);
  //       console.log("DRC ID: ", user?.drc_id);          
  //     } catch (err) {
  //       console.log("Eror in retrieving DRC ID: ", err);       
  //     } 
  //   };

  //   fetchUserData();
  // }, [user?.drc_id, user?.ro_id]); // Including drc_id to the Dependency array


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

  // Then update your useEffect that fetches RTOMs
  useEffect(() => {
    const fetchRTOMs = async () => {
      try {
        if (userData?.drc_id) {
          // Fetch RTOMs by DRC ID
          const rtomsList = await getActiveRTOMsByDRCID(userData?.drc_id);
          console.log("RTOM list retrieved:", rtomsList);
          setRtoms(rtomsList);
        }
      } catch (error) {
        console.error("Error fetching RTOMs:", error);
      }
    };

    fetchRTOMs();
  }, [userData?.drc_id, userData?.ro_id]); // Only depend on userData

  /* // Date handlers
  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      setError("The 'From' date cannot be later than the 'To' date.");
      Swal.fire("Warning", "To date should be greater than or equal to From date", "warning");
    } else {
      setError("");
      setFromDate(date);
    }
  };

  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      
      Swal.fire("Warning", "To date should be greater than or equal to From date", "warning");
    } else {
      setError("");
      setToDate(date);
    }
  }; */


  const handlefromdatechange = (date) => {
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
  const handletodatechange = (date) => {
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

  // Filter handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // Fetch cases data
  const fetchCases = async () => {
    try {
      /* // Check if required filters are set
      const hasActiveFilters =
        filters.rtom ||
        filters.action_type ||
        filters.status ||
        fromDate ||
        toDate;
  
      if (!hasActiveFilters) {
        setError("Please set at least one filter before searching.");
        return;
      } */


      setCases([]); // Clear previous results

      /*  // Format the date to 'YYYY-MM-DD' format
       const formatDate = (date) => {
         if (!date) return null;
         const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
         return offsetDate.toISOString().split('T')[0];
       }; */

      if (!filters.rtom && !filters.action_type && !filters.status && !fromDate && !toDate) {
        Swal.fire({
          title: "Warning",
          text: "No filter data is selected. Please, select data.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setToDate(null);
        setFromDate(null);
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











      // Check if userData is available
      if (!userData) {
        setError("User data is not available. Please refresh the page or log in again.");
        return;
      }

      setLoading(true);
      setError("");

      const payload = {
        // Use Number() to ensure these are numbers and not strings
        drc_id: Number(userData.drc_id),
        ro_id: Number(userData.ro_id), // Fixed: was using drc_id instead of ro_id
        ...(filters.rtom && { rtom: filters.rtom }),
        ...(filters.action_type && { action_type: filters.action_type }),
        ...(filters.status && { case_current_status: filters.status }),
        ...(fromDate && { from_date: fromDate.toISOString() }),
        ...(toDate && { to_date: toDate.toISOString() }),
      };

      console.log("Sending payload to fetch cases:", payload);

      const data = await ListALLMediationCasesownnedbyDRCRO(payload);
      console.log("Cases data received:", data);

      setCases(Array.isArray(data) ? data : []);
      setCurrentPage(0);
      setHasInitialFetch(true);
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error"
      });
      setError(error.message || "Failed to fetch cases. Please try again.");
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = () => {
    if (!userData) {
      setError("User data is not available. Please refresh the page or log in again.");
      return;
    }

    if (!userData.drc_id && !userData.ro_id) {
      setError("DRC ID or RO ID is required");
      return;
    }

    fetchCases();

    
  };
  // Data filtering and pagination
  const filteredData = cases.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const pages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  // Pagination handlers
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(pages - 1, prev + 1));
  };

  

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Mediation Board Case List</h1>

      <div className="flex flex-wrap md:flex-nowrap items-center justify-end my-6 gap-1 mb-8">
        <select
          name="rtom"
          value={filters.rtom}
          onChange={handleFilterChange}
          className={`${GlobalStyle.selectBox} w-32 md:w-40`}
        >
          <option value="">Rtom</option>
          {rtoms.map((rtom) => (
            <option key={rtom.area_name} value={rtom.area_name}>
              {rtom.area_name}
            </option>
          ))}
        </select>

        <select
          name="action_type"
          value={filters.action_type}
          onChange={handleFilterChange}
          className={`${GlobalStyle.selectBox} w-32 md:w-40`}
        >
          <option value="">Action Type</option>
          <option value="Arrears Collect">Arrears Collect</option>
          <option value="Arrears and CPE Collect">
            Arrears and CPE Collect
          </option>
          <option value="CPE Collect">CPE Collect</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className={`${GlobalStyle.selectBox} w-32 md:w-40`}
        >
          <option value="">Status</option>
          <option value="Forward_to_Mediation_Board">Forward to Mediation Board</option>
          <option value="MB_fail_with_pending_non_settlement">MB Fail with Pending non Settlement</option>
          <option value="MB_Handed_Customer_Info">MB Handed Customer Info</option>
          <option value="MB_Negotiation">MB Negotiation</option>
          <option value="MB_Request_Customer_Info">MB Request Customer Info</option>
          <option value="MB_Settle_Active">MB Settle Active</option>
          <option value="MB_Settle_open_pending">MB Settle Open Pending</option>
          <option value="MB_Settle_pending">MB Settle Pending</option>
        </select>

        <label className={GlobalStyle.dataPickerDate}>Date</label>
        <DatePicker
          selected={fromDate}
          onChange={handlefromdatechange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/MM/yyyy"
          className={`${GlobalStyle.inputText} w-32 md:w-40`}
        />
        <DatePicker
          selected={toDate}
          onChange={handletodatechange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/MM/yyyy"
          className={`${GlobalStyle.inputText} w-32 md:w-40`}
        />

        <button
          className={GlobalStyle.buttonPrimary}
          onClick={handleFilterClick}

        >
          {loading ? "Filter" : "Filter"}
        </button>
      </div>

      {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}

      <div className="flex flex-col">
        <div className="mb-4 flex justify-start">
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

        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>Case ID</th>
                <th className={GlobalStyle.tableHeader}>Status</th>
                <th className={GlobalStyle.tableHeader}>Date</th>
                <th className={GlobalStyle.tableHeader}>RO Name</th>
                <th className={GlobalStyle.tableHeader}>RTOM</th>
                <th className={GlobalStyle.tableHeader}>Calling Round</th>
                <th className={GlobalStyle.tableHeader}>Next Calling Date</th>
                <th className={GlobalStyle.tableHeader}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr
                  key={row.case_id}
                  className={`${index % 2 === 0
                      ? "bg-white bg-opacity-75"
                      : "bg-gray-50 bg-opacity-50"
                    } border-b`}
                >
                  <td className={GlobalStyle.tableData}>{row.case_id}</td>
                  <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
                    <StatusIcon status={row.status} />
                  </td>

                  

                  <td className={GlobalStyle.tableData}>
                   {row.created_dtm
                      ? new Date(row.created_dtm).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td className={GlobalStyle.tableData}>{row.ro_name}</td>
                  <td className={GlobalStyle.tableData}>{row.area}</td>
                  <td className={GlobalStyle.tableData}>
                    {row.mediation_board_count || 0}
                  </td>


                  <td className={GlobalStyle.tableData}>{row.created_dtm
                      ? new Date(row.next_calling_date).toLocaleDateString("en-GB")
                      : "N/A"}</td>
                  <td className={GlobalStyle.tableData}>
                    <img
                      src={edit}
                      alt="Edit Case"
                      className={`w-6 h-6 ${row.status === "MB_fail_with_pending_non_settlement"
                          ? "opacity-50 cursor-default"
                          : "cursor-pointer"
                        }`} // No cursor-pointer for "MB_fail_with_pending_non_settlement"
                      onClick={() =>
                        row.status !== "MB_fail_with_pending_non_settlement" &&
                        navigate(`/pages/DRC/Mediation Board Response/${row.drc_id}/${row.case_id}`)
                      } // Prevent navigation for "MB_fail_with_pending_non_settlement"
                    />
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    {loading ? "Loading..." : "No results found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredData.length > rowsPerPage && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            className={GlobalStyle.navButton}
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            <FaArrowLeft />
          </button>
          <span>
            Page {currentPage + 1} of {pages}
          </span>
          <button
            className={GlobalStyle.navButton}
            onClick={handleNextPage}
            disabled={currentPage === pages - 1}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}