/* Purpose: This template is used for the 2.15 - Mediation Board case list .
Created Date: 2024-01-08
Created By: Chamath (chamathjayasanka20@gmail.com)
Last Modified Date:2025-01-08
Last Modified Date:2025-02-01
Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
Version: node 20
ui number : 2.15
Dependencies: tailwind css
Related Files: (routes)
Notes:  The following page conatins the code for the Mediation Board case list Screen */

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
// import DatePicker from "react-datepicker";
// import { listAllDRCMediationBoardCases } from "../../services/case/CaseService.js";
// import { getRTOMsByDRCID } from "../../services/rtom/RtomService"; 
// import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

// export default function MediationBoardCaselist() {
//   const { drc_id } = useParams();
//   const navigate = useNavigate();
  
//   const [fromDate, setFromDate] = useState(null);
//   const [rtoms, setRtoms] = useState([]);
//   const [toDate, setToDate] = useState(null);
//   const [error, setError] = useState("");
//    const [selectedRTOM, setSelectedRTOM] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [cases, setCases] = useState([]);
//   const [filters, setFilters] = useState({
//     rtom: "",
//     action_type: "",
//     status: ""
//   });

//   const rowsPerPage = 7;

//   const handleFromDateChange = (date) => {
//     if (toDate && date > toDate) {
//       setError("The 'From' date cannot be later than the 'To' date.");
//     } else {
//       setError("");
//       setFromDate(date);
//     }
//   };

//   const handleToDateChange = (date) => {
//     if (fromDate && date < fromDate) {
//       setError("The 'To' date cannot be earlier than the 'From' date.");
//     } else {
//       setError("");
//       setToDate(date);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const fetchCases = async () => {
//     try {
//       setLoading(true);
//       const payload = {
//         drc_id,
//         ...(filters.rtom && { rtom: filters.rtom }),
//         ...(filters.action_type && { action_type: filters.action_type }),
//         ...(filters.status && { case_current_status: filters.status }),
//         ...(fromDate && { from_date: fromDate.toISOString() }),
//         ...(toDate && { to_date: toDate.toISOString() })
//       };

//       const data = await listAllDRCMediationBoardCases(payload);
//       setCases(data);
//       setCurrentPage(0);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterClick = () => {
//     if (!drc_id) {
//       setError("DRC ID is required");
//       return;
//     }
//     fetchCases();
//   };

//   const filteredData = cases.filter((row) =>
//     Object.values(row)
//       .join(" ")
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   const pages = Math.ceil(filteredData.length / rowsPerPage);
//   const paginatedData = filteredData.slice(
//     currentPage * rowsPerPage,
//     (currentPage + 1) * rowsPerPage
//   );

//   const handlePrevPage = () => {
//     setCurrentPage(prev => Math.max(0, prev - 1));
//   };

//   const handleNextPage = () => {
//     setCurrentPage(prev => Math.min(pages - 1, prev + 1));
//   };

//   useEffect(() => {
//     if (drc_id) {
//       fetchCases();
//     }
//   }, [drc_id]);
  

//   return (
//     <div className={GlobalStyle.fontPoppins}>
//       <h1 className={GlobalStyle.headingLarge}>Mediation Board Case List</h1>

//       <div className="flex flex-col items-end my-4 gap-2">
//         <div className="flex items-center gap-2">
//           <select 
//             name="rtom"
//             value={filters.rtom}
//             onChange={handleFilterChange}
//             className={GlobalStyle.selectBox}
//           >
//             <option value="">Rtom</option>
//             <option value="AM">AM</option>
//             <option value="AG">AG</option>
//             <option value="AD">AD</option>
//             <option value="AP">AP</option>
//             <option value="AW">AW</option>
//             <option value="BD">BD</option>
//             <option value="BC">BC</option>
//             <option value="BW">BW</option>
//             <option value="CE">CE</option>
//             <option value="DB">DB</option>
//             <option value="CW">CW</option>
//             <option value="GA">GA</option>
//             <option value="GP">GP</option>
//             <option value="GL">GL</option>
//             <option value="GQ">GQ</option>
//             <option value="HK">HK</option>
//             <option value="HB">HB</option>
//             <option value="HO">HO</option>
//             <option value="HR">HR</option>
//             <option value="HT">HT</option>
//             <option value="JA">JA</option>
//             <option value="JK">JK</option>
//           </select>

//           <select 
//             name="action_type"
//             value={filters.action_type}
//             onChange={handleFilterChange}
//             className={GlobalStyle.selectBox}
//           >
//             <option value="">Action Type</option>
//             <option value="Arrears Collect">Arrears Collect</option>
//             <option value="Arrears and CPE Collect">Arrears and CPE Collect</option>
//             <option value="CPE Collect">CPE Collect</option>
//           </select>

//           <select 
//             name="status"
//             value={filters.status}
//             onChange={handleFilterChange}
//             className={GlobalStyle.selectBox}
//           >
//             <option value="">Status</option>
//             <option value="FMB">FMB</option>
//             <option value="MB_Negotiation">MB_Negotiation</option>
//             <option value="MB_Request_Customer-Info">MB_Request_Customer-Info</option>
//             <option value="MB_Handover_Customer-Info">MB_Handover_Customer-Info</option>
//             <option value="MB_Settle_Pending">MB_Settle_Pending</option>
//             <option value="MB_Settle_Open-Pending">MB_Settle_Open-Pending</option>
//             <option value="IMB_Settle_Active">IMB_Settle_Active</option>
//             <option value="FMB_Failed_with_Non-Settlement">FMB_Failed_with_Non-Settlement</option>
//             <option value="FMB_Failed">FMB_Failed</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <label>Date:</label>
//           <DatePicker
//             selected={fromDate}
//             onChange={handleFromDateChange}
//             dateFormat="dd/MM/yyyy"
//             placeholderText="dd/MM/yyyy"
//             className={GlobalStyle.inputText}
//           />
//           <DatePicker
//             selected={toDate}
//             onChange={handleToDateChange}
//             dateFormat="dd/MM/yyyy"
//             placeholderText="dd/MM/yyyy"
//             className={GlobalStyle.inputText}
//           />
          
//           <button 
//             className={`${GlobalStyle.buttonPrimary} h-[35px]`}
//             onClick={handleFilterClick}
//             disabled={loading}
//           >
//             {loading ? '' : 'Filter'}
//           </button>
//         </div>
//       </div>

//       {error && <div className="text-red-500 mb-4">{error}</div>}

//       <div className="flex flex-col">
//         <div className="mb-4 flex justify-start">
//           <div className={GlobalStyle.searchBarContainer}>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className={GlobalStyle.inputSearch}
//             />
//             <FaSearch className={GlobalStyle.searchBarIcon} />
//           </div>
//         </div>

//         <div className={GlobalStyle.tableContainer}>
//           <table className={GlobalStyle.table}>
//             <thead className={GlobalStyle.thead}>
//               <tr>
//                 <th className={GlobalStyle.tableHeader}>Case ID</th>
//                 <th className={GlobalStyle.tableHeader}>Status</th>
//                 <th className={GlobalStyle.tableHeader}>Date</th>
//                 <th className={GlobalStyle.tableHeader}>RO Name</th>
//                 <th className={GlobalStyle.tableHeader}>RTOM</th>
//                 <th className={GlobalStyle.tableHeader}>Calling Round</th>
//                 <th className={GlobalStyle.tableHeader}>Next Calling Date</th>
//                 <th className={GlobalStyle.tableHeader}></th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedData.map((row, index) => (
//                 <tr
//                   key={row.case_id}
//                   className={`${
//                     index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"
//                   } border-b`}
//                 >
//                   <td className={GlobalStyle.tableData}>{row.case_id}</td>
//                   <td className={GlobalStyle.tableData}>{row.status}</td>
//                   <td className={GlobalStyle.tableData}>
//                     {new Date(row.created_dtm).toLocaleDateString()}
//                   </td>
//                   <td className={GlobalStyle.tableData}>{row.ro_name}</td>
//                   <td className={GlobalStyle.tableData}>{row.rtom}</td>
//                   <td className={GlobalStyle.tableData}>{}</td>
//                   <td className={GlobalStyle.tableData}>
//                     {/* {new Date(row.expire_dtm).toLocaleDateString()} */}
//                   </td>
//                   <td className={GlobalStyle.tableData}>
//                     <button
//                       className={`${GlobalStyle.button} ${GlobalStyle.buttonPrimary}`}
//                       onClick={() => navigate(`/case/${row.case_id}`)}
//                     >
//                       Open
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {paginatedData.length === 0 && (
//                 <tr>
//                   <td colSpan="8" className="text-center py-4">
//                     {loading ? 'Loading...' : 'No results found'}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {filteredData.length > rowsPerPage && (
//         <div className={GlobalStyle.navButtonContainer}>
//           <button
//             className={GlobalStyle.navButton}
//             onClick={handlePrevPage}
//             disabled={currentPage === 0}
//           >
//             <FaArrowLeft />
//           </button>
//           <span>
//             Page {currentPage + 1} of {pages}
//           </span>
//           <button
//             className={GlobalStyle.navButton}
//             onClick={handleNextPage}
//             disabled={currentPage === pages - 1}
//           >
//             <FaArrowRight />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { listAllDRCMediationBoardCases } from "../../services/case/CaseService.js";
import { getActiveRTOMsByDRCID } from "../../services/rtom/RtomService";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

export default function MediationBoardCaselist() {
  const { drc_id } = useParams();
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
  const [filters, setFilters] = useState({
    rtom: "",
    action_type: "",
    status: ""
  });
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  const rowsPerPage = 7;

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
    setFilters(prev => ({
      ...prev,
      [name]: value
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
        drc_id,
        ...(filters.rtom && { rtom: filters.rtom }),
        ...(filters.action_type && { action_type: filters.action_type }),
        ...(filters.status && { case_current_status: filters.status }),
        ...(fromDate && { from_date: fromDate.toISOString() }),
        ...(toDate && { to_date: toDate.toISOString() })
      };

      const data = await listAllDRCMediationBoardCases(payload);
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
    if (!drc_id) {
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
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(pages - 1, prev + 1));
  };

  useEffect(() => {
    const fetchRTOMs = async () => {
      try {
        if (drc_id) {
          const payload = parseInt(drc_id, 10);
          const rtomsList = await getActiveRTOMsByDRCID(payload);
          setRtoms(rtomsList);
        } else {
          setError("DRC ID not found in URL.");
        }
      } catch (error) {
        console.error("Error fetching RTOMs:", error);
        setError("Failed to fetch RTOMs. Please try again later.");
      }
    };

    fetchRTOMs();
  }, [drc_id]);

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Mediation Board Case List</h1>

      <div className="flex items-center justify-end my-4 gap-2">
        <select 
          name="rtom"
          value={filters.rtom}
          onChange={handleFilterChange}
          className={GlobalStyle.selectBox}
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
          className={GlobalStyle.selectBox}
        >
          <option value="">Action Type</option>
          <option value="Arrears Collect">Arrears Collect</option>
          <option value="Arrears and CPE Collect">Arrears and CPE Collect</option>
          <option value="CPE Collect">CPE Collect</option>
        </select>

        <select 
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className={GlobalStyle.selectBox}
        >
          <option value="">Status</option>
          <option value="FMB">FMB</option>
          <option value="MB_Negotiation">MB_Negotiation</option>
          <option value="MB_Request_Customer-Info">MB_Request_Customer-Info</option>
          <option value="MB_Handover_Customer-Info">MB_Handover_Customer-Info</option>
          <option value="MB_Settle_Pending">MB_Settle_Pending</option>
          <option value="MB_Settle_Open-Pending">MB_Settle_Open-Pending</option>
          <option value="IMB_Settle_Active">IMB_Settle_Active</option>
          <option value="FMB_Failed">FMB_Failed</option>
        </select>

        <label className={GlobalStyle.dataPickerDate}>Date</label>
        <DatePicker
          selected={fromDate}
          onChange={handleFromDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/MM/yyyy"
          className={GlobalStyle.inputText}
        />
        <DatePicker
          selected={toDate}
          onChange={handleToDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/MM/yyyy"
          className={GlobalStyle.inputText}
        />
        
        <button 
          className={GlobalStyle.buttonPrimary}
          onClick={handleFilterClick}
          disabled={loading}
        >
          {loading ? 'Filter' : 'Filter'}
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
                    index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"
                  } border-b`}
                >
                  <td className={GlobalStyle.tableData}>{row.case_id}</td>
                  <td className={GlobalStyle.tableData}>{row.status}</td>
                  <td className={GlobalStyle.tableData}>
                    {new Date(row.created_dtm).toLocaleDateString()}
                  </td>
                  <td className={GlobalStyle.tableData}>{row.ro_name}</td>
                  <td className={GlobalStyle.tableData}>{row.area}</td>
                  <td className={GlobalStyle.tableData}>
                    {row.mediation_board?.length || 1}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.mediation_details?.next_calling_dtm ? 
                      new Date(row.mediation_details.next_calling_dtm).toLocaleDateString()
                      : 'N/A'
                    }
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <button
                      className={`${GlobalStyle.button} ${GlobalStyle.buttonPrimary}`}
                      onClick={() => navigate(`/case/${row.case_id}`)}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    {loading ? 'Loading...' : 'No results found'}
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