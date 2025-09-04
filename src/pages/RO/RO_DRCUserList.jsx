// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
// import { List_All_RO_and_DRCuser_Details_to_DRC } from "../../services/Ro/RO.js";
// import Swal from 'sweetalert2';
// import { getLoggedUserId } from "/src/services/auth/authService.js";


// //Status Icons

// /* import DRC_Active from "../../assets/images/status/RO_DRC_Status_Icons/DRC_Active.svg";
// import DRC_Inactive from "../../assets/images/status/RO_DRC_Status_Icons/DRC_Inactive.svg";
// import DRC_Terminate from "../../assets/images/status/RO_DRC_Status_Icons/DRC_Terminate.svg"; */
// import RO_Active from "../../assets/images/status/RO_DRC_Status_Icons/RO_Active.svg";
// import RO_Inactive from "../../assets/images/status/RO_DRC_Status_Icons/RO_Inactive.svg";
// import RO_Terminate from "../../assets/images/status/RO_DRC_Status_Icons/RO_Terminate.svg";

// //button Icons
// import moreInfoIcon from "../../assets/images/more-info.svg";

// export default function RO_DRCUserList() {
//     const [userData, setUserData] = useState(null);

//     // State for RO Tab
//     const [roData, setRoData] = useState([]);
//     const [roStatus, setRoStatus] = useState("");
//     const [roCurrentPage, setRoCurrentPage] = useState(1);
//     const [roMaxPage, setRoMaxPage] = useState(0);
//     const [roTotalPages, setRoTotalPages] = useState(1);
//     const [roTotalAPIPages, setRoTotalAPIPages] = useState(1);
//     const [isRoFilterApplied, setIsRoFilterApplied] = useState(false);


//     // State for DRC User Tab
//     const [drcData, setDrcData] = useState([]);
//     const [drcUserStatus, setDrcUserStatus] = useState("");
//     const [drcCurrentPage, setDrcCurrentPage] = useState(1);
//     const [drcMaxPage, setDrcMaxPage] = useState(0);
//     const [drcTotalPages, setDrcTotalPages] = useState(1);
//     const [drcTotalAPIPages, setDrcTotalAPIPages] = useState(1);
//     const [isDrcFilterApplied, setIsDrcFilterApplied] = useState(false);

//     const [activeTab, setActiveTab] = useState("RO");


//     const [isLoading, setIsLoading] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     // Pagination state


//     const rowsPerPage = 10; // Number of rows per page
//     const roStartIndex = (roCurrentPage - 1) * rowsPerPage;
//     const roEndIndex = roStartIndex + rowsPerPage;
//     const roPaginatedData = roData.slice(roStartIndex, roEndIndex);

//     const drcStartIndex = (drcCurrentPage - 1) * rowsPerPage;
//     const drcEndIndex = drcStartIndex + rowsPerPage;
//     const drcPaginatedData = drcData.slice(drcStartIndex, drcEndIndex);


//     const currentStatus = activeTab === "RO" ? roStatus : drcUserStatus;

//     const navigate = useNavigate();

//     const loadUser = async () => {
//         const user = await getLoggedUserId();
//         setUserData(user);
//         console.log("User data:", user);
//     };

//     useEffect(() => {
//         loadUser();
//     }, []);


//     const handleStatusChange = (e) => {
//         const value = e.target.value;
//         if (activeTab === "RO") {
//             setRoStatus(value);
//         } else if (activeTab === "drcUser") {
//             setDrcUserStatus(value);
//         }
//     };


//     const handlePageChange = () => {
//         // console.log("Page changed to:", currentPage);

//         if (activeTab === "RO") {
//             if (roCurrentPage > roMaxPage && roCurrentPage <= roTotalAPIPages) {
//                 setRoMaxPage(roCurrentPage);
//                 handleFilter();
//             }
//         } else {
//             if (drcCurrentPage > drcMaxPage && drcCurrentPage <= drcTotalAPIPages) {
//                 setDrcMaxPage(drcCurrentPage);
//                 handleFilter();
//             }
//         }
//     };

//     useEffect(() => {

//         if (isRoFilterApplied) {
//             handlePageChange();
//         }
//     }, [roCurrentPage]);

//     useEffect(() => {

//         if (isDrcFilterApplied) {
//             handlePageChange();
//         }
//     }, [drcCurrentPage]);



//     // Search Section
//     const roFilteredDataBySearch = roPaginatedData.filter((row) =>
//         Object.values(row)
//             .join(" ")
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase())
//     );

//     const drcFilteredDataBySearch = drcPaginatedData.filter((row) =>
//         Object.values(row)
//             .join(" ")
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase())
//     );



//     const getUserStatus = () => {
//         if (activeTab === "RO") {
//             return roStatus;
//         } else if (activeTab === "drcUser") {
//             return drcUserStatus;
//         } else {
//             return tabState[activeTab]?.status || "";
//         }
//     };

//     //for testing commit

//     const getCurrentPage = () => {
//         if (activeTab === "RO") {
//             return roCurrentPage;
//         } else (activeTab === "DRSUser"); {
//             return drcCurrentPage;
//         }
//     };

//     const handleFilter = async () => {
//         try {
//             if (!userData) return;

//             const payload = {
//                 drc_id: userData.drc_id,
//                 drcUser_type: activeTab,
//                 drcUser_status: getUserStatus(),
//                 pages: getCurrentPage(),
//             };

//             console.log("Payload sent to API: ", payload);
//             setIsLoading(true);

//             const response = await List_All_RO_and_DRCuser_Details_to_DRC(payload).catch((error) => {
//                 if (error.response && error.response.status === 404) {

//                     if (activeTab === "RO") {
//                         setRoData([]);
//                     } else {
//                         setDrcData([]);
//                     }

//                     Swal.fire({
//                         title: "No Results",
//                         text: "No matching data found for the selected filter.",
//                         icon: "warning",
//                         confirmButtonText: "OK",
//                         confirmButtonColor: "#f1c40f"
//                     });

//                     return null;
//                 } else {
//                     throw error;
//                 }
//             });

//             console.log("Response from API:", response);
//             setIsLoading(false);

//             if (response && response.data) {
//                 const list = response.data;
//                 console.log("Valid data received:", list);

//                 if (activeTab === "RO") {
//                     setRoData((prev) => [...prev, ...list]);
//                     setRoTotalPages(Math.ceil(response.total_records / rowsPerPage));
//                     setRoTotalAPIPages(response.total_records);
//                 } else {
//                     setDrcData((prev) => [...prev, ...list]);
//                     setDrcTotalPages(Math.ceil(response.total_records / rowsPerPage));
//                     setDrcTotalAPIPages(response.total_records);
//                 }
//             }
//         } catch (error) {
//             console.error("Error filtering cases:", error);
//             Swal.fire({
//                 title: "Error",
//                 text: "Failed to fetch filtered data. Please try again.",
//                 icon: "error"
//             });
//         }
//     };


//     const handleFilterButton = () => {
//         if (activeTab === "RO") {
//             setRoData([]);
//             setRoMaxPage(0);
//             setRoTotalPages(1);
//             if (roCurrentPage === 1) {
//                 handleFilter();
//             } else {
//                 setRoCurrentPage(1);
//             }
//             setIsRoFilterApplied(true);
//         } else {
//             setDrcData([]);
//             setDrcMaxPage(0);
//             setDrcTotalPages(1);
//             if (drcCurrentPage === 1) {
//                 handleFilter();
//             } else {
//                 setDrcCurrentPage(1);
//             }
//             setIsDrcFilterApplied(true);
//         }
//     }

//     const handleClear = () => {
//         if (activeTab === "RO") {
//             setRoData([]);
//             setRoCurrentPage(1);
//             setRoMaxPage(0);
//             setRoTotalPages(1);
//             setRoTotalAPIPages(1);
//             setRoStatus("");

//         } else {
//             setDrcData([]);
//             setDrcCurrentPage(1);
//             setDrcMaxPage(0);
//             setDrcTotalPages(1);
//             setDrcTotalAPIPages(1);
//             setDrcUserStatus("");
//         }
//     };

//     useEffect(() => {
//         if (userData) {
//             if (
//                 activeTab === "RO" &&
//                 roData.length === 0 &&
//                 (roStatus === "" || isRoFilterApplied)
//             ) {
//                 handleFilterButton();
//             }

//             if (
//                 activeTab === "drcUser" &&
//                 drcData.length === 0 &&
//                 (drcUserStatus === "" || isDrcFilterApplied)
//             ) {
//                 handleFilterButton();
//             }
//         }
//     }, [activeTab, userData, roStatus, drcUserStatus]);


//     const handlePrevNext = (direction) => {
//         if (activeTab === "RO") {
//             if (direction === "prev" && roCurrentPage > 1) {
//                 setRoCurrentPage(roCurrentPage - 1);
//             } else if (direction === "next" && roCurrentPage < roTotalPages) {
//                 setRoCurrentPage(roCurrentPage + 1);
//             }
//         }
//         else {
//             if (direction === "prev" && drcCurrentPage > 1) {
//                 setDrcCurrentPage(drcCurrentPage - 1);
//             } else if (direction === "next" && drcCurrentPage < drcTotalPages) {
//                 setDrcCurrentPage(drcCurrentPage + 1);
//             }
//         }
//     };

//     const getStatusIcon = (status, item) => {


//         switch (status) {
//             case "Active":
//                 return (
//                     <img
//                         src={RO_Active}
//                         alt="RO Active"
//                         title="RO Active"
//                         className="w-6 h-6 cursor-pointer"

//                     />
//                 );
//             case "Inactive":
//                 return (
//                     <img
//                         src={RO_Inactive}
//                         alt="RO Inactive"
//                         title="RO Inactive"
//                         className="w-6 h-6 cursor-pointer"

//                     />
//                 );
//             case "Terminate":
//                 return (
//                     <img
//                         src={RO_Terminate}
//                         alt="RO Terminate"
//                         title="RO Terminate"
//                         className="w-6 h-6 cursor-pointer"

//                     />
//                 );
//             default:
//                 return null;
//         }



//     };


//     // display loading animation when data is loading
//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     console.log("this is the ro data :", roData);
//     console.log("this is the drcUser data :", drcData);



//     return (
//         <div className={GlobalStyle.fontPoppins}>

//             {activeTab === "RO" && (
//                 <div>
//                     <h2 className={GlobalStyle.headingLarge}>RO List</h2>

//                     <div className="flex justify-end mt-6">
//                         <button className={GlobalStyle.buttonPrimary}
//                             onClick={() =>
//                                 navigate("/ro/ro-add-ro")
//                             }>
//                             Add RO
//                         </button>
//                     </div>

//                 </div>
//             )}


//             {activeTab === "drcUser" && (
//                 <div>
//                     <h2 className={GlobalStyle.headingLarge}>DRC User List</h2>
//                     <div className="flex justify-end mt-6">
//                         <button className={GlobalStyle.buttonPrimary} onClick={() =>
//                             navigate("/ro/ro-add-ro")
//                         }>
//                             Add DRC User
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Filters Section */}
//             <div className="w-full mb-2 mt-4">
//                 <div className="flex justify-between items-center w-full mb-2">

//                     {/* Search Bar */}
//                     <div className="flex justify-start mt-10 mb-4">
//                         <div className={GlobalStyle.searchBarContainer}>
//                             <input
//                                 type="text"
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className={GlobalStyle.inputSearch}

//                             />
//                             <FaSearch className={GlobalStyle.searchBarIcon} />
//                         </div>
//                     </div>

//                     {/* Status Filter & Buttons */}
//                     <div className={`${GlobalStyle.cardContainer} w-auto`}>
//                         <div className="flex justify-end items-center space-x-4">
//                             <select
//                                 name="status"
//                                 value={currentStatus}
//                                 onChange={handleStatusChange}
//                                 className={`${GlobalStyle.selectBox} w-32 md:w-40`}
//                             >
//                                 <option value="" disabled>Select Status</option>
//                                 <option value="Active">Active</option>
//                                 <option value="Inactive">Inactive</option>
//                                 <option value="Terminate">Terminate</option>
//                             </select>

//                             <button
//                                 onClick={handleFilterButton}
//                                 className={GlobalStyle.buttonPrimary}
//                             >
//                                 Filter
//                             </button>

//                             <button
//                                 onClick={handleClear}
//                                 className={`${GlobalStyle.buttonRemove} ${!currentStatus}`}
//                                 disabled={!currentStatus}
//                             >
//                                 Clear
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>


//             {/* Tabs */}
//             <div className="flex border-b mb-4">
//                 {["RO", "drcUser"].map((tab) => (
//                     <button
//                         key={tab}
//                         onClick={() => setActiveTab(tab)}
//                         className={`px-4 py-2 ${activeTab === tab
//                             ? "border-b-2 border-blue-500 font-bold"
//                             : "text-gray-500"
//                             }`}
//                     >
//                         {tab} List
//                     </button>
//                 ))}
//             </div>

//             {/* Table section rendering */}


//             <div>
//                 {activeTab === "RO" && (
//                     <div>
//                         <div className={GlobalStyle.tableContainer}>
//                             <table className={GlobalStyle.table}>
//                                 <thead className={GlobalStyle.thead}>
//                                     <tr >
//                                         <th className={GlobalStyle.tableHeader}>RO ID</th>
//                                         <th className={GlobalStyle.tableHeader}>Status</th>
//                                         <th className={GlobalStyle.tableHeader}>NIC</th>
//                                         <th className={GlobalStyle.tableHeader}>RO Name</th>
//                                         <th className={GlobalStyle.tableHeader}>Contact No.</th>
//                                         <th className={GlobalStyle.tableHeader}>RTOM Area count</th>
//                                         <th className={GlobalStyle.tableHeader}></th>

//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {roFilteredDataBySearch && roFilteredDataBySearch.length > 0 ? (
//                                         roFilteredDataBySearch.map((item, index) => (
//                                             <tr
//                                                 key={item.ro_id || index}
//                                                 className={
//                                                     index % 2 === 0
//                                                         ? GlobalStyle.tableRowEven
//                                                         : GlobalStyle.tableRowOdd
//                                                 }
//                                             >
//                                                 <td
//                                                     className={`${GlobalStyle.tableData} text-black`}
//                                                 >
//                                                     {item.ro_id || "N/A"}
//                                                 </td>

//                                                 <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
//                                                     {getStatusIcon(item.drcUser_status) || "N/A"}

//                                                 </td>

//                                                 <td className={`${GlobalStyle.tableData} `}>
//                                                     {item.nic || "N/A"}
//                                                 </td>
//                                                 <td className={`${GlobalStyle.tableData} `}>
//                                                     {item.ro_name || "N/A"}
//                                                 </td>
//                                                 <td className={`${GlobalStyle.tableData} `}>
//                                                     {item.login_contact_no || "N/A"}
//                                                 </td>
//                                                 <td className={`${GlobalStyle.tableData} `}>
//                                                     {item.rtom_area_count || "N/A"}
//                                                 </td>
//                                                 <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
//                                                     <img
//                                                         src={moreInfoIcon}
//                                                         alt="more-info"
//                                                         title="more-info"
//                                                         className="w-6 h-6 cursor-pointer"
//                                                         onClick={() =>
//                                                             navigate("/ro/ro-drc-user-info", {
//                                                                 state: { itemType: activeTab, itemData: item },
//                                                             })
//                                                         }
//                                                     />
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan={6} className="text-center">No cases available</td>
//                                         </tr>
//                                     )}
//                                 </tbody>

//                             </table>
//                         </div>
//                         {/* Pagination Section */}
//                         {roTotalPages > 1 && (
//                             <div className={GlobalStyle.navButtonContainer}>
//                                 <button
//                                     onClick={() => handlePrevNext("prev")}
//                                     disabled={roCurrentPage === 1}
//                                     className={`${GlobalStyle.navButton} ${roCurrentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
//                                         }`}
//                                 >
//                                     <FaArrowLeft />
//                                 </button>
//                                 <span>Page {roCurrentPage}</span>
//                                 <button
//                                     onClick={() => handlePrevNext("next")}
//                                     disabled={roCurrentPage === roTotalPages}
//                                     className={`${GlobalStyle.navButton} ${roCurrentPage === roTotalPages ? "opacity-50 cursor-not-allowed" : ""
//                                         }`}
//                                 >
//                                     <FaArrowRight />
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {activeTab === "drcUser" && (
//                     <div>
//                         <div>
//                             <div className={GlobalStyle.tableContainer}>
//                                 <table className={GlobalStyle.table}>
//                                     <thead className={GlobalStyle.thead}>
//                                         <tr >
//                                             <th className={GlobalStyle.tableHeader}>DRC ID</th>
//                                             <th className={GlobalStyle.tableHeader}>status</th>
//                                             <th className={GlobalStyle.tableHeader}>NIC</th>
//                                             <th className={GlobalStyle.tableHeader}>DRC User Name</th>
//                                             <th className={GlobalStyle.tableHeader}>Contact No.</th>
//                                             <th className={GlobalStyle.tableHeader}></th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {drcFilteredDataBySearch && drcFilteredDataBySearch.length > 0 ? (
//                                             drcFilteredDataBySearch.map((item, index) => (
//                                                 <tr
//                                                     key={item.drc_id || index}
//                                                     className={
//                                                         index % 2 === 0
//                                                             ? GlobalStyle.tableRowEven
//                                                             : GlobalStyle.tableRowOdd
//                                                     }
//                                                 >
//                                                     <td
//                                                         className={`${GlobalStyle.tableData} text-black`}
//                                                     >
//                                                         {item.drc_officer_id || "N/A"}
//                                                     </td>

//                                                     <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
//                                                         {getStatusIcon(item.drcUser_status) || "N/A"}

//                                                     </td>

//                                                     <td className={`${GlobalStyle.tableData} `}>
//                                                         {item.nic || "N/A"}
//                                                     </td>
//                                                     <td className={`${GlobalStyle.tableData} `}>
//                                                         {item.ro_name || "N/A"}
//                                                     </td>
//                                                     <td className={`${GlobalStyle.tableData} `}>
//                                                         {item.login_contact_no || "N/A"}
//                                                     </td>
//                                                     <td className={`${GlobalStyle.tableData} flex justify-center items-center `}>
//                                                         <img
//                                                             src={moreInfoIcon}
//                                                             alt="view info"
//                                                             title="view info"
//                                                             className="w-6 h-6 cursor-pointer"
//                                                             onClick={() =>
//                                                                 navigate("/ro/ro-drc-user-info", {
//                                                                     state: { itemType: activeTab, itemData: item }, // send your data here
//                                                                 })
//                                                             }
//                                                         />
//                                                     </td>


//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan={6} className="text-center">No cases available</td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                         {/* Pagination Section */}
                        


//                         {drcTotalPages > 1 && (
//                             <div className={GlobalStyle.navButtonContainer}>
//                                 <button
//                                     onClick={() => handlePrevNext("prev")}
//                                     disabled={drcCurrentPage === 1}
//                                     className={`${GlobalStyle.navButton} ${drcCurrentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
//                                         }`}
//                                 >
//                                     <FaArrowLeft />
//                                 </button>
//                                 <span>Page {drcCurrentPage}</span>
//                                 <button
//                                     onClick={() => handlePrevNext("next")}
//                                     disabled={drcCurrentPage === drcTotalPages}
//                                     className={`${GlobalStyle.navButton} ${drcCurrentPage === drcTotalPages ? "opacity-50 cursor-not-allowed" : ""
//                                         }`}
//                                 >
//                                     <FaArrowRight />
//                                 </button>
//                             </div>
//                         )}

//                     </div>
//                 )}
//             </div>


//         </div>
//     );
// }


// After Responsive

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { List_All_RO_and_DRCuser_Details_to_DRC } from "../../services/Ro/RO.js";
import Swal from 'sweetalert2';
import { getLoggedUserId } from "/src/services/auth/authService.js";

// Status Icons
import RO_Active from "../../assets/images/status/RO_DRC_Status_Icons/RO_Active.svg";
import RO_Inactive from "../../assets/images/status/RO_DRC_Status_Icons/RO_Inactive.svg";
import RO_Terminate from "../../assets/images/status/RO_DRC_Status_Icons/RO_Terminate.svg";
import RO_Pending_Approval from "../../assets/images/status/RO_DRC_Status_Icons/RO_Pending_Approval.png";

// Button Icons
import moreInfoIcon from "../../assets/images/more-info.svg";

import { Tooltip } from "react-tooltip";

export default function RO_DRCUserList() {
    const [userData, setUserData] = useState(null);

    // State for RO Tab
    const [roData, setRoData] = useState([]);
    const [roStatus, setRoStatus] = useState("");
    const [roCurrentPage, setRoCurrentPage] = useState(1);
    const [roMaxPage, setRoMaxPage] = useState(0);
    const [roTotalPages, setRoTotalPages] = useState(1);
    const [roTotalAPIPages, setRoTotalAPIPages] = useState(1);
    const [isRoFilterApplied, setIsRoFilterApplied] = useState(false);

    // State for DRC User Tab
    const [drcData, setDrcData] = useState([]);
    const [drcUserStatus, setDrcUserStatus] = useState("");
    const [drcCurrentPage, setDrcCurrentPage] = useState(1);
    const [drcMaxPage, setDrcMaxPage] = useState(0);
    const [drcTotalPages, setDrcTotalPages] = useState(1);
    const [drcTotalAPIPages, setDrcTotalAPIPages] = useState(1);
    const [isDrcFilterApplied, setIsDrcFilterApplied] = useState(false);

    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("activeTab") || "RO";
    });
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const rowsPerPage = 10;
    const roStartIndex = (roCurrentPage - 1) * rowsPerPage;
    const roEndIndex = roStartIndex + rowsPerPage;
    const roPaginatedData = roData.slice(roStartIndex, roEndIndex);

    const drcStartIndex = (drcCurrentPage - 1) * rowsPerPage;
    const drcEndIndex = drcStartIndex + rowsPerPage;
    const drcPaginatedData = drcData.slice(drcStartIndex, drcEndIndex);

    const currentStatus = activeTab === "RO" ? roStatus : drcUserStatus;
    const navigate = useNavigate();

    const TABS = ["RO", "drcCoordinator", "drcCallCenter", "drcStaff"];

    const TAB_LABELS = {
    RO: "RO",
    drcCoordinator: "DRC Coordinator",
    drcCallCenter: "DRC Call Center",
    drcStaff: "DRC Staff",
    };

    const TAB_TO_API = {
        RO: { type: "ro", role: undefined },
        drcCoordinator: { type: "drc_officer", role: "drc coordinator" },
        drcCallCenter: { type: "drc_officer", role: "call center" },
        drcStaff: { type: "drc_officer", role: "drc staff" },
    };

    const loadUser = async () => {
        const user = await getLoggedUserId();
        setUserData(user);
        console.log("User data:", user);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const handleStatusChange = (e) => {
        const value = e.target.value;
        if (activeTab === "RO") {
            setRoStatus(value);
        } else {
            setDrcUserStatus(value);
        }
    };

    const handlePageChange = () => {
    if (activeTab === "RO") {
      if (roCurrentPage > roMaxPage && roCurrentPage <= roTotalPages) {
        setRoMaxPage(roCurrentPage);
        handleFilter();
      }
    } else {
      if (drcCurrentPage > drcMaxPage && drcCurrentPage <= drcTotalPages) {
        setDrcMaxPage(drcCurrentPage);
        handleFilter();
      }
    }
  };

    useEffect(() => {
        if (isRoFilterApplied) {
            handlePageChange();
        }
    }, [roCurrentPage]);

    useEffect(() => {
        if (isDrcFilterApplied) {
            handlePageChange();
        }
    }, [drcCurrentPage]);

    const roFilteredDataBySearch = roPaginatedData.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const drcFilteredDataBySearch = drcPaginatedData.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    // const getUserStatus = () => {
    //     if (activeTab === "RO") {
    //         return roStatus;
    //     } else if (activeTab === "drcUser") {
    //         return drcUserStatus;
    //     } else {
    //         return "";
    //     }
    // };

    const getUserStatus = () => (
        activeTab === "RO" ? roStatus : drcUserStatus
    );


    const getCurrentPage = () => {
        if (activeTab === "RO") {
            return roCurrentPage;
        } else {
            return drcCurrentPage;
        }
    };

    const handleFilter = async () => {
        try {
            if (!userData) return;

            // const payload = {
            //     drc_id: userData.drc_id,
            //     drcUser_type: activeTab,
            //     drcUser_status: getUserStatus(),
            //     pages: getCurrentPage(),
            // };

            // const { type, role } = TAB_TO_API[activeTab];
            //     const payload = {
            //         drc_id: userData.drc_id,
            //         drcUser_type: type,                 // 'ro' or 'drc_officer'
            //         user_role: role,                    // required for drc_officer tabs
            //         drcUser_status: getUserStatus(),
            //         pages: getCurrentPage(),
            // };

            // console.log("Payload sent to API: ", payload);
            // setIsLoading(true);

            const tabConfig = TAB_TO_API[activeTab];
            if (!tabConfig) {
                console.error("Unknown tab:", activeTab);
                Swal.fire({
                    title: "Error",
                    text: "Unknown tab selected. Please refresh.",
                    icon: "error",
                });
                  return;
                }
            
                const { type, role } = tabConfig;

                const payload = {
                  drc_id: userData.drc_id,
                  drcUser_type: type,      // 'ro' or 'drc_officer'
                  user_role: role,         // role only for 'drc_officer'
                  drcUser_status: getUserStatus(),
                  pages: getCurrentPage(),
                };
            
            setIsLoading(true);
            const response = await List_All_RO_and_DRCuser_Details_to_DRC(payload).catch((error) => {
                if (error.response && error.response.status === 404) {
                    if (activeTab === "RO") {
                        setRoData([]);
                    } else {
                        setDrcData([]);
                    }

                    Swal.fire({
                        title: "No Results",
                        text: `No ${getUserStatus() ? getUserStatus().replace('_', ' ') + ' ' : ''}${activeTab} found.`,
                        icon: "warning",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#f1c40f"
                    });

                    return null;
                } else {
                    throw error;
                }
            });

            console.log("Response from API:", response);

            setIsLoading(false);

            if (response && response.data) {
                const list = response.data;
                console.log("Valid data received:", list);

                if (activeTab === "RO") {
                    setRoData((prev) => [...prev, ...list]);
                    setRoTotalPages(Math.ceil(response.total_records / rowsPerPage));
                    setRoTotalAPIPages(response.total_records);
                } else {
                    setDrcData((prev) => [...prev, ...list]);
                    setDrcTotalPages(Math.ceil(response.total_records / rowsPerPage));
                    setDrcTotalAPIPages(response.total_records);
                }
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

    const handleFilterButton = () => {
        if (activeTab === "RO") {
            setRoData([]);
            setRoMaxPage(0);
            setRoTotalPages(1);
            if (roCurrentPage === 1) {
                handleFilter();
            } else {
                setRoCurrentPage(1);
            }
            setIsRoFilterApplied(true);
        } else {
            setDrcData([]);
            setDrcMaxPage(0);
            setDrcTotalPages(1);
            if (drcCurrentPage === 1) {
                handleFilter();
            } else {
                setDrcCurrentPage(1);
            }
            setIsDrcFilterApplied(true);
        }
    };

    const handleClear = () => {
        // if (activeTab === "RO") {
        //     setRoData([]);
        //     setRoCurrentPage(1);
        //     setRoMaxPage(0);
        //     setRoTotalPages(1);
        //     setRoTotalAPIPages(1);
        //     setRoStatus("");
        // } else {
        //     setDrcData([]);
        //     setDrcCurrentPage(1);
        //     setDrcMaxPage(0);
        //     setDrcTotalPages(1);
        //     setDrcTotalAPIPages(1);
        //     setDrcUserStatus("");
        // }

        // Store the current tab in localStorage
        localStorage.setItem("activeTab", activeTab);

        // Refresh the page
        window.location.reload();
    };

    // useEffect(() => {
    //     if (userData) {
    //         if (
    //             activeTab === "RO" &&
    //             roData.length === 0 &&
    //             (roStatus === "" || isRoFilterApplied)
    //         ) {
    //             handleFilterButton();
    //         }

    //         // Any DRC tab loads (Coordinator / Call Center / Staff)
    //         if (["drcCoordinator", "drcCallCenter", "drcStaff"].includes(activeTab) &&
    //             drcData.length === 0 &&
    //             (drcUserStatus === "" || isDrcFilterApplied)) {
    //             handleFilterButton();
    //         }
    //     }
    // }, [activeTab, userData, roStatus, drcUserStatus]);

    // NEW – always reset & fetch when switching tabs
    useEffect(() => {
        if (!userData) return;
        handleFilterButton();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, userData]);


    const handlePrevNext = (direction) => {
        if (activeTab === "RO") {
            if (direction === "prev" && roCurrentPage > 1) {
                setRoCurrentPage(roCurrentPage - 1);
            } else if (direction === "next" && roCurrentPage < roTotalPages) {
                setRoCurrentPage(roCurrentPage + 1);
            }
        } else {
            if (direction === "prev" && drcCurrentPage > 1) {
                setDrcCurrentPage(drcCurrentPage - 1);
            } else if (direction === "next" && drcCurrentPage < drcTotalPages) {
                setDrcCurrentPage(drcCurrentPage + 1);
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Active":
                return (
                    <img
                        src={RO_Active}
                        alt="RO Active"
                        title="RO Active"
                        className="w-6 h-6 cursor-pointer"
                    />
                );
            case "Inactive":
                return (
                    <img
                        src={RO_Inactive}
                        alt="RO Inactive"
                        title="RO Inactive"
                        className="w-6 h-6 cursor-pointer"
                    />
                );
            case "Terminate":
                return (
                    <img
                        src={RO_Terminate}
                        alt="RO Terminate"
                        title="RO Terminate"
                        className="w-6 h-6 cursor-pointer"
                    />
                );
            case "Pending_approval":
                return (
                    <img
                        src={RO_Pending_Approval}
                        alt="RO Pending Approval"
                        title="RO Pending Approval"
                        className="w-6 h-6 cursor-pointer"
                    />
                );
            default:
                return (
                    <img
                        src={RO_Pending_Approval}
                        alt="RO Pending Approval"
                        title="RO Pending Approval"
                        className="w-6 h-6 cursor-pointer"
                    />
                );
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    console.log("this is the ro data :", roData);
    console.log("this is the drcUser data :", drcData);

    return (
        <div className={GlobalStyle.fontPoppins}>
            {activeTab === "RO" && (
                <div>
                    <h2 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}>RO List</h2>
                    <div className="flex justify-end mt-6">
                        <button
                            className={GlobalStyle.buttonPrimary}
                            onClick={() =>
                                navigate("/ro/ro-add-ro", { state: { from: "RO" } })
                            }
                        >
                            Add RO
                        </button>
                    </div>
                </div>
            )}

            {activeTab === "drcCoordinator" && (
                <div>
                    <h2 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}>DRC Coordinator</h2>
                    <div className="flex justify-end mt-6">
                        <button
                            className={GlobalStyle.buttonPrimary}
                            onClick={() =>
                                navigate("/ro/ro-add-ro", { state: { from: "drcCoordination" } })
                            }
                        >
                            Add DRC - Coordinator
                        </button>
                    </div>
                </div>
            )}

            {activeTab === "drcCallCenter" && (
                <div>
                    <h2 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}>DRC Call Center</h2>
                    <div className="flex justify-end mt-6">
                        <button
                            className={GlobalStyle.buttonPrimary}
                            onClick={() => navigate("/ro/ro-add-ro", { state: { from: "drcCallCenter" } })}
                            >
                            Add DRC - Call Center
                            </button>
                    </div>
                </div>
            )}

            {activeTab === "drcStaff" && (
                <div>
                    <h2 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}>DRC Staff</h2>
                    <div className="flex justify-end mt-6">
                        <button
                            className={GlobalStyle.buttonPrimary}
                            onClick={() =>
                                navigate("/ro/ro-add-ro", { state: { from: "drcStaff" } })
                            }
                        >
                            Add DRC - Saff
                        </button>
                    </div>
                </div>
            )}

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-8 w-full">
                <div className="mt-4 sm:mt-0 w-fit sm:max-w-md">
                    <div className={GlobalStyle.searchBarContainer}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={GlobalStyle.inputSearch}
                            
                            aria-label="Search RO or DRC User details"
                        />
                        <FaSearch className={GlobalStyle.searchBarIcon} />
                    </div>
                </div>

                <div
                    className={`${GlobalStyle.cardContainer} flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-end items-stretch`}
                >
                    <select
                        name="status"
                        value={currentStatus}
                        onChange={handleStatusChange}
                        className={`${GlobalStyle.selectBox} w-full sm:w-32 md:w-40`}
                        style={{ color: currentStatus === "" ? "gray" : "black" }}
                        aria-label="Select status filter"
                    >
                        <option value="" hidden>All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Terminate">Terminate</option>
                        <option value="Pending_approval">Pending Approval</option>
                    </select>

                    <button
                        onClick={handleFilterButton}
                        className={GlobalStyle.buttonPrimary}
                    >
                        Filter
                    </button>
                    <button
                        onClick={handleClear}
                        className={GlobalStyle.buttonRemove}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-4 mt-4 overflow-x-auto">
                {TABS.map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 whitespace-nowrap ${
                        activeTab === tab ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"
                    }`}
                    >
                    {TAB_LABELS[tab]} List
                    </button>
                ))}
            </div>

            {/* Table section rendering */}
            <div>
                {activeTab === "RO" && (
                    <div>
                        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                            <table
                                className={`${GlobalStyle.table} table-auto w-full`}
                                style={{ fontSize: "0.875rem" }}
                                aria-label="RO List Table"
                            >
                                <thead className={GlobalStyle.thead}>
                                    <tr>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[80px]`} scope="col">
                                            Status
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            NIC
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[150px]`} scope="col">
                                            RO Name
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            Contact No. 1
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            Contact No. 2
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            Billing Center Area count
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[60px]`} scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roFilteredDataBySearch && roFilteredDataBySearch.length > 0 ? (
                                        roFilteredDataBySearch.map((item, index) => (
                                            <tr
                                                key={item.ro_id || index}
                                                className={`${
                                                    index % 2 === 0
                                                        ? "bg-white bg-opacity-75"
                                                        : "bg-gray-50 bg-opacity-50"
                                                } border-b`}
                                            >
                                                <td
                                                    className={`${GlobalStyle.tableData} flex justify-center items-center`}
                                                >
                                                    {getStatusIcon(item.drcUser_status) || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.nic || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.name || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.login_contact_no || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.login_contact_no_two || ""}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.rtom_area_count || "0"}
                                                </td>
                                                <td className={`${GlobalStyle.tableData} flex justify-center`}>
                                                    <img
                                                        src={moreInfoIcon}
                                                        alt="more-info"
                                                        title="more-info"
                                                        className="w-6 h-6 cursor-pointer"
                                                        onClick={() =>
                                                            navigate("/ro/ro-drc-user-info", {
                                                                state: {
                                                                itemType: activeTab === "RO" ? "RO" : "drcUser", // treat DRC tabs as drcUser
                                                                itemData:
                                                                activeTab === "RO"
                                                                    ? { ro_id: item.ro_id }
                                                                    : { drc_officer_id: item.drc_officer_id ?? item.drc_officer_id ?? item._id, },
                                                                },
                                                            })
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">
                                                No cases available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Section */}
                        {roTotalPages > 1 && (
                            <div className={GlobalStyle.navButtonContainer}>
                                <button
                                    onClick={() => handlePrevNext("prev")}
                                    disabled={roCurrentPage === 1}
                                    className={`${GlobalStyle.navButton} ${
                                        roCurrentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    aria-label="Previous page"
                                >
                                    <FaArrowLeft />
                                </button>
                                <span>Page {roCurrentPage}</span>
                                <button
                                    onClick={() => handlePrevNext("next")}
                                    disabled={roCurrentPage === roTotalPages}
                                    className={`${GlobalStyle.navButton} ${
                                        roCurrentPage === roTotalPages ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    aria-label="Next page"
                                >
                                    <FaArrowRight />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "drcCoordinator" && (
                    <div>
                        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                            <table
                                className={`${GlobalStyle.table} table-auto w-full`}
                                style={{ fontSize: "0.875rem" }}
                                aria-label="DRC User List Table"
                            >
                                <thead className={GlobalStyle.thead}>
                                    <tr>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[80px]`} scope="col">
                                            Status
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            NIC
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[150px]`} scope="col">
                                            RO Name
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            Contact No. 1
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            Contact No. 2
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[60px]`} scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {drcFilteredDataBySearch && drcFilteredDataBySearch.length > 0 ? (
                                        drcFilteredDataBySearch.map((item, index) => (
                                            <tr
                                                key={item.drc_officer_id || index}
                                                className={`${
                                                    index % 2 === 0
                                                        ? "bg-white bg-opacity-75"
                                                        : "bg-gray-50 bg-opacity-50"
                                                } border-b`}
                                            >
                                                <td
                                                    className={`${GlobalStyle.tableData} flex justify-center items-center`}
                                                >
                                                    {getStatusIcon(item.drcUser_status) || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.nic || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.name || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.login_contact_no || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.login_contact_no_two || ""}
                                                </td>
                                                <td className={`${GlobalStyle.tableData} flex justify-center`}>
                                                    <img
                                                        src={moreInfoIcon}
                                                        alt="view info"
                                                        title="view info"
                                                        className="w-6 h-6 cursor-pointer"
                                                        onClick={() =>
                                                            navigate("/ro/ro-drc-user-info", {
                                                                state: {
                                                                itemType: activeTab === "RO" ? "RO" : "drcUser", // treat DRC tabs as drcUser
                                                                itemData:
                                                                activeTab === "RO"
                                                                    ? { ro_id: item.ro_id }
                                                                    : { drc_officer_id: item.drc_officer_id ?? item.drc_officer_id ?? item._id },
                                                                },
                                                            })
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">
                                                No cases available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Section */}
                        {drcTotalPages > 1 && (
                            <div className={GlobalStyle.navButtonContainer}>
                                <button
                                    onClick={() => handlePrevNext("prev")}
                                    disabled={drcCurrentPage === 1}
                                    className={`${GlobalStyle.navButton} ${
                                        drcCurrentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    aria-label="Previous page"
                                >
                                    <FaArrowLeft />
                                </button>
                                <span>Page {drcCurrentPage}</span>
                                <button
                                    onClick={() => handlePrevNext("next")}
                                    disabled={drcCurrentPage === drcTotalPages}
                                    className={`${GlobalStyle.navButton} ${
                                        drcCurrentPage === drcTotalPages ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    aria-label="Next page"
                                >
                                    <FaArrowRight />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "drcCallCenter" && (
                    <div>
                        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                            <table
                                className={`${GlobalStyle.table} table-auto w-full`}
                                style={{ fontSize: "0.875rem" }}
                                aria-label="DRC User List Table"
                            >
                                <thead className={GlobalStyle.thead}>
                                    <tr>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[80px]`} scope="col">
                                            Status
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            NIC
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[150px]`} scope="col">
                                            RO Name
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            Contact No. 1
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            Contact No. 2
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[60px]`} scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {drcFilteredDataBySearch && drcFilteredDataBySearch.length > 0 ? (
                                        drcFilteredDataBySearch.map((item, index) => (
                                            <tr
                                                key={item.drc_officer_id || index}
                                                className={`${
                                                    index % 2 === 0
                                                        ? "bg-white bg-opacity-75"
                                                        : "bg-gray-50 bg-opacity-50"
                                                } border-b`}
                                            >
                                                <td
                                                    className={`${GlobalStyle.tableData} flex justify-center items-center`}
                                                >
                                                    {getStatusIcon(item.drcUser_status) || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.nic || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.name || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.login_contact_no || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.login_contact_no_two || ""}
                                                </td>
                                                <td className={`${GlobalStyle.tableData} flex justify-center`}>
                                                    <img
                                                        src={moreInfoIcon}
                                                        alt="view info"
                                                        title="view info"
                                                        className="w-6 h-6 cursor-pointer"
                                                        onClick={() =>
                                                            navigate("/ro/ro-drc-user-info", {
                                                                state: {
                                                                itemType: activeTab === "RO" ? "RO" : "drcUser", // treat DRC tabs as drcUser
                                                                itemData:
                                                                activeTab === "RO"
                                                                    ? { ro_id: item.ro_id }
                                                                    : { drc_officer_id: item.drc_officer_id ?? item.drc_officer_id ?? item._id },
                                                                },
                                                            })
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">
                                                No cases available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Section */}
                        {drcTotalPages > 1 && (
                            <div className={GlobalStyle.navButtonContainer}>
                                <button
                                    onClick={() => handlePrevNext("prev")}
                                    disabled={drcCurrentPage === 1}
                                    className={`${GlobalStyle.navButton} ${
                                        drcCurrentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    aria-label="Previous page"
                                >
                                    <FaArrowLeft />
                                </button>
                                <span>Page {drcCurrentPage}</span>
                                <button
                                    onClick={() => handlePrevNext("next")}
                                    disabled={drcCurrentPage === drcTotalPages}
                                    className={`${GlobalStyle.navButton} ${
                                        drcCurrentPage === drcTotalPages ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    aria-label="Next page"
                                >
                                    <FaArrowRight />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "drcStaff" && (
                    <div>
                        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                            <table
                                className={`${GlobalStyle.table} table-auto w-full`}
                                style={{ fontSize: "0.875rem" }}
                                aria-label="DRC User List Table"
                            >
                                <thead className={GlobalStyle.thead}>
                                    <tr>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[80px]`} scope="col">
                                            Status
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            NIC
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[150px]`} scope="col">
                                            RO Name
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            Contact No. 1
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`} scope="col">
                                            Contact No. 2
                                        </th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[60px]`} scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {drcFilteredDataBySearch && drcFilteredDataBySearch.length > 0 ? (
                                        drcFilteredDataBySearch.map((item, index) => (
                                            <tr
                                                key={item.drc_officer_id || index}
                                                className={`${
                                                    index % 2 === 0
                                                        ? "bg-white bg-opacity-75"
                                                        : "bg-gray-50 bg-opacity-50"
                                                } border-b`}
                                            >
                                                <td
                                                    className={`${GlobalStyle.tableData} flex justify-center items-center`}
                                                >
                                                    {getStatusIcon(item.drcUser_status) || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.nic || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.name || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.login_contact_no || "N/A"}
                                                </td>
                                                <td className={GlobalStyle.tableData}>
                                                    {item.login_contact_no_two || ""}
                                                </td>
                                                <td className={`${GlobalStyle.tableData} flex justify-center`}>
                                                    <img
                                                        src={moreInfoIcon}
                                                        alt="view info"
                                                        title="view info"
                                                        className="w-6 h-6 cursor-pointer"
                                                        onClick={() =>
                                                            navigate("/ro/ro-drc-user-info", {
                                                                state: {
                                                                itemType: activeTab === "RO" ? "RO" : "drcUser", // treat DRC tabs as drcUser
                                                                itemData:
                                                                activeTab === "RO"
                                                                    ? { ro_id: item.ro_id }
                                                                    : { drc_officer_id: item.drc_officer_id ?? item.drc_officer_id ?? item._id },
                                                                },
                                                            })
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">
                                                No cases available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Section */}
                        {drcTotalPages > 1 && (
                            <div className={GlobalStyle.navButtonContainer}>
                                <button
                                    onClick={() => handlePrevNext("prev")}
                                    disabled={drcCurrentPage === 1}
                                    className={`${GlobalStyle.navButton} ${
                                        drcCurrentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    aria-label="Previous page"
                                >
                                    <FaArrowLeft />
                                </button>
                                <span>Page {drcCurrentPage}</span>
                                <button
                                    onClick={() => handlePrevNext("next")}
                                    disabled={drcCurrentPage === drcTotalPages}
                                    className={`${GlobalStyle.navButton} ${
                                        drcCurrentPage === drcTotalPages ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    aria-label="Next page"
                                >
                                    <FaArrowRight />
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}