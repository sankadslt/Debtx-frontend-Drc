/* Purpose: This template is used for the 2.6 - RO's Assigned case log .
Created Date: 2024-01-08
Created By: Chamath (chamathjayasanka20@gmail.com)
Modified By; Sasindu Srinayka (sasindusrinayaka@gmail.com)
Last Modified Date:2025-03-04
Version: node 20
ui number : 2.6
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the RO's Assigned case log Screen */


import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { getActiveRTOMsByDRCID } from "../../services/rtom/RtomService.js";
import { listDRCAllCases } from "../../services/case/CaseService";
import { getLoggedUserId } from "../../services/auth/authService.js";
import edit from "../../assets/images/mediationBoard/edit.png";
import Swal from 'sweetalert2';

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import { Tooltip } from "react-tooltip";


// Import status icons with correct file extensions
import RO_Negotiation_FMB_pending from "../../assets/images/negotiation/RO_Negotiation_FMB_pending.png";
import RO_Negotiation_Extneded from "../../assets/images/negotiation/RO_Negotiation_Extneded.png";
import RO_Negotiation_Extension_Pending from "../../assets/images/negotiation/RO_Negotiation_Extension_Pending.png";
import Negotiation_Settle_Active from "../../assets/images/negotiation/Negotiation_Settle_Active.png";
import Negotiation_Settle_Open_Pending from "../../assets/images/negotiation/Negotiation_Settle_Open-Pending.png";
import Negotiation_Settle_Pending from "../../assets/images/negotiation/Negotiation_Settle_Pending.png";
import RO_Negotiation from "../../assets/images/negotiation/RO_Negotiation.png";

// Status icon mapping
const STATUS_ICONS = {
  "RO Negotiation FMB Pending": {
    icon: RO_Negotiation_FMB_pending,
    tooltip: "RO Negotiation FMB Pending"
  },
  "RO Negotiation Extended": {
    icon: RO_Negotiation_Extneded,
    tooltip: "RO Negotiation Extended"
  },
  "RO Negotiation Extension Pending": {
    icon: RO_Negotiation_Extension_Pending,
    tooltip: "RO Negotiation Extension Pending"
  },
  "Negotiation Settle Active": {
    icon: Negotiation_Settle_Active,
    tooltip: "Negotiation Settle Active"
  },
  "Negotiation Settle Open-Pending": {
    icon: Negotiation_Settle_Open_Pending,
    tooltip: "Negotiation Settle Open-Pending"
  },
  "Negotiation Settle Pending": {
    icon: Negotiation_Settle_Pending,
    tooltip: "Negotiation Settle Pending"
  },
  "RO Negotiation": {
    icon: RO_Negotiation,
    tooltip: " Ro Negotiation"
  },
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
        className="w-6 h-6 "
        data-tooltip-id={tooltipId}
        data-tooltip-content={statusInfo.tooltip}
        data-tooltip-place="bottom"

      />
      {/* <Tooltip id={tooltipId} className="tooltip"  effect="solid" /> */}
      {/* <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded px-2 py-1 left-1/2 transform -translate-x-1/2 bottom-full mb-1 whitespace-nowrap z-10"> */}
      
        {/* <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-gray-800 rotate-45"></div> */}
      {/* </div> */}
    </div>
  );
};


export default function ROsAssignedcaselog() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const rowsPerPage = 7;
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [rtoms, setRtoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons
  const [filters, setFilters] = useState({
    rtom: "",
    action_type: "",
    status: "",
  });
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

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

  //   // API Call to fetch assigned cases
  //   useEffect(() => {
  //    const fetchUserData = async () => {
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

  useEffect(() => {
    const loadUser = async () => {
      const user = await getLoggedUserId();
      setUserData(user);
      console.log("User data:", user);
    };

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
  }, [userData?.drc_id]); // Only depend on userData.drc_id

  /* // Date handlers
  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      setError("The 'From' date cannot be later than the 'To' date.");
    } else {
      setError("");
      setFromDate(date);
    }
  };
  
  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      setError("The 'To' date cannot be earlier than the 'From' date.");
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
          confirmButtonColor: "#f1c40f"
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
          confirmButtonColor: "#f1c40f"
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
        confirmButtonColor: "#f1c40f",
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
      /* const hasActiveFilters =
        filters.rtom ||
        filters.action_type ||
        fromDate ||
        toDate; */

      /* if (!hasActiveFilters) {
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

      if (!filters.rtom && !filters.action_type && !fromDate && !toDate  && !filters.status) {
        Swal.fire({
          title: "Warning",
          text: "No filter data is selected. Please, select data.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonColor: "#f1c40f"
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
          allowEscapeKey: false,
          confirmButtonColor: "#f1c40f"
        });
        setToDate(null);
        setFromDate(null);
        return;
      }




      setLoading(true);
      setError("");

      const payload = {
        // Use Number() to ensure these are numbers and not strings
        drc_id: userData.drc_id,
        ro_id: userData.ro_id, // Fixed: was using drc_id instead of ro_id
        ...(filters.status && { status: filters.status }),
        ...(filters.rtom && { rtom: filters.rtom }),
        ...(filters.action_type && { action_type: filters.action_type }),
        ...(fromDate && { from_date: fromDate.toISOString() }),
        ...(toDate && { to_date: toDate.toISOString() }),
      };

      console.log("Sending payload to fetch cases:", payload);

      const data = await listDRCAllCases(payload);
      setCases(data);
      setCurrentPage(0);
      setHasInitialFetch(true);
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
      setError(error.message || "Failed to fetch cases. Please try again.");
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = () => {
    if (!userData.drc_id && !userData.ro_id) {
      setError("DRC ID or RO ID is required");
      return;
    }
    fetchCases();
  };

  const handleclearfilters = () => {
    setFilters({
      rtom: "",
      action_type: "",
      status: "",
    });
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setError("");
    setCases([]); // Clear the cases when filters are cleared
    
  }



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

  const handleonnegotiation = (case_id , action_type) => {
    navigate("/drc/customer-negotiation", { state: { CaseID: case_id , ActionType: action_type } });
    console.log("Case ID being passed: ", case_id);
    console.log("Action Type being passed: ", action_type);
  }

  const handleonedit = (case_id) => {
    navigate("/pages/DRC/EditCustomerProfile", { state: { CaseID: case_id } });
    console.log("Case ID being passed: ", case_id);
  }

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <h1 className={GlobalStyle.headingLarge}>Negotiation Case List</h1>
      {/* {error && <p className="text-red-500">{error}</p>} */}

      <div  className={`${GlobalStyle.cardContainer} w-full gap-4` }>
        <div  className="flex items-center justify-end w-full gap-1" >
            {/* Dropdown for RTOM */}
            <select
              name="rtom"
              value={filters.rtom}
              onChange={handleFilterChange}
              className={`${GlobalStyle.selectBox} w-32 md:w-40`}
              style={{ color: filters.rtom === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Rtom</option>
              {rtoms.map((rtom) => (
                <option key={rtom.area_name} value={rtom.area_name} style={{ color: "black" }}>
                  {rtom.area_name}
                </option>
              ))}
            </select>

            {/* Dropdown for Status  */}
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className={`${GlobalStyle.selectBox} w-32 md:w-40`}
              style={{ color: filters.status === "" ? "gray" : "black" }}
            >
              
              <option value="" hidden>Status</option>
              <option value="RO Negotiation" style={{ color: "black" }}>RO Negotiation</option>
              <option value="Negotiation Settle Pending" style={{ color: "black" }}>Negotiation Settle Pending</option>
              <option value="Negotiation Settle Open-Pending" style={{ color: "black" }}>Negotiation Settle Open-Pending</option>
              <option value="Negotiation Settle Active" style={{ color: "black" }}>Negotiation Settle Active</option>
              <option value="RO Negotiation Extension Pending" style={{ color: "black" }}>RO Negotiation Extension Pending</option>
              <option value="RO Negotiation Extended" style={{ color: "black" }}>RO Negotiation Extended</option>
              <option value="RO Negotiation FMB Pending" style={{ color: "black" }}>RO Negotiation FMB Pending</option>
            </select>
              
            {/* Dropdown for Action Type */}
            <select
              name="action_type"
              value={filters.action_type}
              onChange={handleFilterChange}
              className={`${GlobalStyle.selectBox} w-32 md:w-40`}
              style={{ color: filters.action_type === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Action Type</option>
              <option value="Arrears Collect" style={{ color: "black" }}>Arrears Collect</option>
              <option value="Arrears and CPE Collect" style={{ color: "black" }}>
                Arrears and CPE Collect
              </option>
              <option value="CPE Collect" style={{ color: "black" }}>CPE Collect</option>
            </select>

            <div className={`${GlobalStyle.datePickerContainer} flex`}>
              <label className={GlobalStyle.dataPickerDate}>Date:</label>
              <DatePicker
                selected={fromDate}
                onChange={handlefromdatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                className={GlobalStyle.inputText}
              />
              <DatePicker
                selected={toDate}
                onChange={handletodatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                className={GlobalStyle.inputText}
              />
            </div>

            <div>
            {["admin", "superadmin", "slt" , "drc_user", "drc_admin"].includes(userRole) && (
              <button
                onClick={handleFilterClick}
                className={`${GlobalStyle.buttonPrimary}`}
              >
                Filter
              </button>
              )}
            </div>

              <div>
                  {["admin", "superadmin", "slt" , "drc_user", "drc_admin"].includes(userRole) && (
                    <button className={GlobalStyle.buttonRemove}  onClick={handleclearfilters}>
                    Clear
                      </button>
                  )}
                </div>
          </div>
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
              
              <th className={GlobalStyle.tableHeader}>Name</th>
              <th className={GlobalStyle.tableHeader}>Contact No</th>
              <th className={GlobalStyle.tableHeader}>RTOM</th>
              <th className={GlobalStyle.tableHeader}>Action</th>
              <th className={GlobalStyle.tableHeader}>Date</th>
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
                  <StatusIcon status={row.status}  />
                  <Tooltip id={`tooltip-${row.status.replace(/\s+/g, '-')}`} className="tooltip" effect="solid" place="bottom" />
                </td>
                
                <td className={GlobalStyle.tableData}>{row.ro_name}</td>
                <td className={GlobalStyle.tableData}>
                  {row.contact_no}
                </td>
                <td className={GlobalStyle.tableData}>{row.area}</td>
                <td className={GlobalStyle.tableData}>{row.action_type}</td>
                <td className={GlobalStyle.tableData}>
                  {row.created_dtm
                    ? new Date(row.created_dtm).toLocaleDateString("en-GB")
                    : "N/A"}
                </td>
                <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
                  <div>
                  {["admin", "superadmin", "slt" , "drc_user", "drc_admin"].includes(userRole) && (
                    <button>
                    <img
                      src={edit}
                      alt="Edit Case"
                      data-tooltip-id="edit-tooltip"
                      className={`w-6 h-6 cursor-pointer display: inline-block`}
                      onClick={() => handleonedit(row.case_id)}
                    />
                    <Tooltip id="edit-tooltip" className="tooltip" effect="solid" place="bottom" content="Edit" />
                    </button>
                  )}
                  </div>
                  <div>
                    {["admin", "superadmin", "slt" , "drc_user", "drc_admin"].includes(userRole) && (
                    <button
                      className={`${GlobalStyle.buttonPrimary}  `}
                      style={{ whiteSpace: "nowrap", cursor: "pointer", marginLeft: "2px" }}
                      onClick={() => handleonnegotiation(row.case_id , row.action_type)}
                    >
                      Negotiation
                    </button>
                  )}
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="8" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                    No cases found.
                  </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
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
