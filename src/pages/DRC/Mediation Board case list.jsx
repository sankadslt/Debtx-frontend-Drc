/* Purpose: This template is used for the 2.15 - Mediation Board case list .
Created Date: 2024-01-08
Created By: Chamath (chamathjayasanka20@gmail.com)
Last Modified Date:2025-01-08
Last Modified Date:2025-02-01
Last Modified Date:2025-02-17
Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
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
import { getActiveRTOMsByDRCID } from "../../services/rtom/RtomService";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import edit from "../../assets/images/mediationBoard/edit.png";
import {  getUserData } from "../../services/auth/authService.js";

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

  // State management
  const [fromDate, setFromDate] = useState(null);
  const [rtoms, setRtoms] = useState([]);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    rtom: "",
    action_type: "",
    status: "",
  });
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  const rowsPerPage = 7;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        console.log("User Data: ", userData);
        setUser(userData);
        console.log("DRC ID: ", user?.drc_id);          
      } catch (err) {
        console.log("Eror in retrieving DRC ID: ", err);       
      } 
    };

    fetchUserData();
  }, [user?.drc_id]);

  useEffect(() => {
    const fetchRTOMs = async () => {
      try {
        if (user?.drc_id) {
          const payload = parseInt(user?.drc_id);

          const rtomsList = await getActiveRTOMsByDRCID(payload);
          setRtoms(rtomsList);
        }
      } catch (error) {
        console.error("Error fetching RTOMs:", error);
        setError("Failed to fetch RTOMs. Please try again later.");
      }
    };

    fetchRTOMs();
  }, [user?.drc_id]);

  // Date handlers
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
      const hasActiveFilters =
        filters.rtom ||
        filters.action_type ||
        filters.status ||
        fromDate ||
        toDate;

      if (!hasActiveFilters) {
        setError("Please set at least one filter before searching.");
        return;
      }

      setLoading(true);
      setError("");

      const payload = {
        drc_id: Number(user?.drc_id),
        ...(filters.rtom && { rtom: filters.rtom }),
        ...(filters.action_type && { action_type: filters.action_type }),
        ...(filters.status && { case_current_status: filters.status }),
        ...(fromDate && { from_date: fromDate.toISOString() }),
        ...(toDate && { to_date: toDate.toISOString() }),
      };

      const data = await ListALLMediationCasesownnedbyDRCRO(payload);
      setCases(data);
      setCurrentPage(0);
      setHasInitialFetch(true);
    } catch (err) {
      setError(err.message || "Failed to fetch cases. Please try again.");
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = () => {
    if (!user?.drc_id) {
      setError("DRC ID is required");
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
          <option value="Forward_to_Mediation_Board">Forward_to_Mediation_Board</option>
          <option value="MB_fail_with_pending_non_settlement">MB_fail_with_pending_non_settlement</option>
          <option value="MB_Handed_Customer_Info">MB_Handed_Customer_Info</option>
          <option value="MB_Negotiation">MB_Negotiation</option>
          <option value="MB_Request_Customer_Info">MB_Request_Customer_Info</option>
          <option value="MB_Settle_Active">MB_Settle_Active</option>
          <option value="MB_Settle_open_pending">MB_Settle_open_pending</option>
          <option value="MB_Settle_pending">MB_Settle_pending</option>
        </select>

        <label className={GlobalStyle.dataPickerDate}>Date</label>
        <DatePicker
          selected={fromDate}
          onChange={handleFromDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/MM/yyyy"
          className={`${GlobalStyle.inputText} w-32 md:w-40`}
        />
        <DatePicker
          selected={toDate}
          onChange={handleToDateChange}
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

      {error && <div className="text-red-500 mb-4">{error}</div>}

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
                  className={`${
                    index % 2 === 0
                      ? "bg-white bg-opacity-75"
                      : "bg-gray-50 bg-opacity-50"
                  } border-b`}
                >
                  <td className={GlobalStyle.tableData}>{row.case_id}</td>
                  <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
              <StatusIcon status={row.status} />
            </td>
                  <td className={GlobalStyle.tableData}>
                    {new Date(row.created_dtm).toLocaleDateString()}
                  </td>
                  <td className={GlobalStyle.tableData}>{row.ro_name}</td>
                  <td className={GlobalStyle.tableData}>{row.area}</td>
                  <td className={GlobalStyle.tableData}>
                    {row.mediation_board_count || 0}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.mediation_details?.next_calling_dtm
                      ? new Date(
                          row.mediation_details.next_calling_dtm
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <img
                      src={edit}
                      alt="Edit Case"
                      className={`w-7 h-7 ${
                        row.status === "MB_fail_with_pending_non_settlement"
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


