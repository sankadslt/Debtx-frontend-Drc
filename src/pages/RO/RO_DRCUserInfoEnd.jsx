// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import gmailIcon from "../../assets/images/google.png";
// import editIcon from "../../assets/images/edit-info.svg";
// import { FaSearch, FaArrowLeft } from "react-icons/fa";
// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import Swal from 'sweetalert2';
// import { terminateRO, GetRODetailsByID } from '../../services/Ro/RO';
// import { getLoggedUserId } from "../../services/auth/authService.js";

// export default function RecoveryOfficerEndPage() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { userData, activeUserType } = location.state || {};

//     const [endDate, setEndDate] = useState('');
//     const [remark, setRemark] = useState('');
//     const [showPopup, setShowPopup] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [userId, setUserId] = useState(null); // Stores ro_id or drcUser_id

//     const today = new Date().toISOString().split('T')[0];

//     // Fetch user ID if not in userData
//     useEffect(() => {
//         const fetchId = async () => {
//             if (!userData?.ro_id && !userData?.drcUser_id) {
//                 if (activeUserType !== "drcUser" && userData?.recovery_officer_name) {
//                     try {
//                         const details = await GetRODetailsByID({ ro_id: userData.recovery_officer_name }); // Adjust if name-based query is unsupported
//                         if (details.status === 'success' && details.data?.ro_id) {
//                             setUserId(details.data.ro_id);
//                         } else {
//                             Swal.fire({
//                                 title: "Error",
//                                 text: "Could not fetch Recovery Officer ID.",
//                                 icon: "error",
//                                 allowOutsideClick: false,
//                                 allowEscapeKey: false,
//                             });
//                         }
//                     } catch (error) {
//                         console.error("Error fetching RO ID:", error.message);
//                         Swal.fire({
//                             title: "Error",
//                             text: "Failed to fetch Recovery Officer ID.",
//                             icon: "error",
//                             allowOutsideClick: false,
//                             allowEscapeKey: false,
//                         });
//                     }
//                 } else if (activeUserType === "drcUser" && userData?.drcUser_name) {
//                     // Placeholder; adjust to fetch drcUser_id if needed
//                     Swal.fire({
//                         title: "Warning",
//                         text: "drcUser_id fetching not implemented. Please pass drcUser_id.",
//                         icon: "warning",
//                         allowOutsideClick: false,
//                         allowEscapeKey: false,
//                     });
//                 }
//             } else {
//                 setUserId(userData.ro_id || userData.drcUser_id);
//             }
//         };
//         fetchId();
//     }, [userData, activeUserType]);

//     const handleSave = async () => {
//         // Validate inputs
//         if (!endDate) {
//             Swal.fire({
//                 title: "Invalid Input",
//                 text: "End Date is required.",
//                 icon: "error",
//                 allowOutsideClick: false,
//                 allowEscapeKey: false,
//             });
//             return;
//         }
//         if (!remark) {
//             Swal.fire({
//                 title: "Invalid Input",
//                 text: "Remark is required.",
//                 icon: "error",
//                 allowOutsideClick: false,
//                 allowEscapeKey: false,
//             });
//             return;
//         }

//         const selectedDate = new Date(endDate);
//         const currentDate = new Date();
//         currentDate.setHours(0, 0, 0, 0);

//         if (selectedDate < currentDate) {
//             Swal.fire({
//                 title: "Invalid Date",
//                 text: "End Date cannot be in the past. Please select today or a future date.",
//                 icon: "error",
//                 allowOutsideClick: false,
//                 allowEscapeKey: false,
//             });
//             return;
//         }

//         if (!userId) {
//             Swal.fire({
//                 title: "Invalid Data",
//                 text: "No user ID found. Please ensure the correct user data is passed.",
//                 icon: "error",
//                 allowOutsideClick: false,
//                 allowEscapeKey: false,
//             });
//             return;
//         }

//         try {
//             // Fetch the logged-in user's data and extract user_id or email
//             const userPayload = await getLoggedUserId();
//             const end_by = userPayload?.user_id || userPayload?.email || "Unknown"; // Use user_id or email as string

//             const terminationDetails = {
//                 [activeUserType === "drcUser" ? "drcUser_id" : "ro_id"]: Number(userId),
//                 end_by: end_by,
//                 end_dtm: new Date(endDate).toISOString(),
//                 remark: remark.trim() // Ensure remark is a string
//             };

//             console.log("Sending termination request:", terminationDetails);

//             const response = await terminateRO(terminationDetails);
//             Swal.fire({
//                 title: "Success",
//                 text: response.message || `${activeUserType === "drcUser" ? "DRC User" : "Recovery Officer"} terminated successfully`,
//                 icon: "success",
//                 confirmButtonText: "OK",
//                 allowOutsideClick: false,
//                 allowEscapeKey: false,
//             }).then(() => {
//                 navigate(-1);
//             });
//         } catch (error) {
//             console.error("Termination error:", error.message);
//             Swal.fire({
//                 title: "Error",
//                 text: error.message || "Failed to terminate user. Please check the input data.",
//                 icon: "error",
//                 allowOutsideClick: false,
//                 allowEscapeKey: false,
//             });
//         }
//     };

//     return (
//         <div className={GlobalStyle.fontPoppins}>
//             {/* Page Title */}
//             <h2 className={GlobalStyle.headingLarge}>
//                 End {activeUserType === "drcUser" ? "DRC User" : "Recovery Officer"}
//             </h2>
//             <h2 className={`${GlobalStyle.headingMedium} pl-10`}>
//                 DRC Name: {userData?.drc_name || 'null'}
//             </h2>

//             {/* Details Card */}
//             <div className="flex gap-4 mt-4 justify-center">
//                 <div className={`${GlobalStyle.cardContainer} relative`}>
//                     <img
//                         src={editIcon}
//                         alt="Edit"
//                         title="Edit"
//                         className="w-6 h-6 absolute top-2 right-2 cursor-pointer hover:scale-110 transition-transform"
//                     />

//                     <div className="table">
//                         {/* Table Rows */}
//                         <div className="table-row">
//                             <div className="table-cell px-4 py-2 font-semibold">Added Date</div>
//                             <div className="table-cell px-4 py-2 font-semibold">:</div>
//                             <div className="table-cell px-4 py-2">{userData?.added_date || 'null'}</div>
//                         </div>

//                         <div className="table-row">
//                             <div className="table-cell px-4 py-2 font-semibold">
//                                 {activeUserType === "drcUser" ? "DRC User Name" : "Recovery Officer Name"}
//                             </div>
//                             <div className="table-cell px-4 py-2 font-semibold">:</div>
//                             <div className="table-cell px-4 py-2">
//                                 {userData?.drcUser_name || userData?.recovery_officer_name || 'null'}
//                             </div>
//                         </div>

//                         <div className="table-row">
//                             <div className="table-cell px-4 py-2 font-semibold">NIC</div>
//                             <div className="table-cell px-4 py-2 font-semibold">:</div>
//                             <div className="table-cell px-4 py-2">{userData?.nic || 'null'}</div>
//                         </div>

//                         <div className="table-row">
//                             <div className="table-cell px-4 py-2 font-bold">Login Method</div>
//                             <div className="table-cell px-4 py-2"></div>
//                             <div className="table-cell px-4 py-2"></div>
//                         </div>

//                         <div className="table-row">
//                             <div className="table-cell px-4 py-2 pl-8 font-semibold">Contact No</div>
//                             <div className="table-cell px-4 py-2 font-semibold">:</div>
//                             <div className="table-cell px-4 py-2">{userData?.contact_no || 'null'}</div>
//                         </div>

//                         <div className="table-row">
//                             <div className="table-cell px-4 py-2 pl-12 font-semibold">
//                                 <img
//                                     src={gmailIcon}
//                                     alt="Email"
//                                     className="w-5 h-5 inline-block mr-2 align-middle"
//                                 />
//                             </div>
//                             <div className="table-cell px-4 py-2 font-semibold">:</div>
//                             <div className="table-cell px-4 py-2">{userData?.email || 'null'}</div>
//                         </div>
//                     </div>

//                     {activeUserType !== "drcUser" && userData?.rtom_areas && (
//                         <div className="mt-6">
//                             <h3 className="font-semibold mb-2 px-4">RTOM Areas</h3>
//                             <div className={GlobalStyle.tableContainer}>
//                                 <table className={GlobalStyle.table}>
//                                     <thead className={GlobalStyle.thead}>
//                                         <tr>
//                                             <th className={GlobalStyle.tableHeader}>RTOM Area</th>
//                                             <th className={GlobalStyle.tableHeader}>Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {userData.rtom_areas.length > 0 ? (
//                                             userData.rtom_areas.map((area, index) => (
//                                                 <tr
//                                                     key={index}
//                                                     className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
//                                                 >
//                                                     <td className={`${GlobalStyle.tableData} text-center pt-6`}>
//                                                         {area.name}
//                                                     </td>
//                                                     <td className={`${GlobalStyle.tableData} text-center`}>
//                                                         <div className="flex items-center justify-center gap-2">
//                                                             <div
//                                                                 className={`inline-block w-11 h-6 rounded-full transition-colors ${area.status ? "bg-green-500" : "bg-gray-400"} relative`}
//                                                             >
//                                                                 <div
//                                                                     className={`w-5 h-5 rounded-full bg-white absolute top-[2px] transition-all ${area.status ? "left-[26px]" : "left-[2px]"}`}
//                                                                 />
//                                                             </div>
//                                                             <span className={`text-sm font-semibold ${area.status ? "text-green-600" : "text-gray-500"}`}>
//                                                                 {area.status ? "Active" : "Inactive"}
//                                                             </span>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan={2} className="text-center py-4">
//                                                     No RTOM areas available
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* End Date & Remark Section - Centered */}
//             <div className="flex justify-center mt-8">
//                 <div className="flex flex-col w-full max-w-[600px]">
//                     <div className="flex items-center mb-4">
//                         <label className="font-semibold mr-4 min-w-[90px]">End date:</label>
//                         <input
//                             type="date"
//                             value={endDate}
//                             onChange={(e) => setEndDate(e.target.value)}
//                             className={`${GlobalStyle.inputText} w-[250px] h-10`}
//                             min={today}
//                         />
//                     </div>

//                     <label className="font-semibold mb-2">Remark:</label>
//                     <textarea
//                         value={remark}
//                         onChange={(e) => setRemark(e.target.value)}
//                         className={`${GlobalStyle.inputText} w-full h-32`}
//                     />

//                     <div className="flex justify-end mt-6">
//                         <button className={GlobalStyle.buttonPrimary} onClick={handleSave}>
//                             Save
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Log History Button */}
//             <div className="flex justify-start mt-6 mb-6">
//                 <button className={GlobalStyle.buttonPrimary} onClick={() => setShowPopup(true)}>
//                     Log History
//                 </button>
//             </div>

//             {/* Log History Popup */}
//             {showPopup && (
//                 <div className={GlobalStyle.popupBoxContainer}>
//                     <div className={GlobalStyle.popupBoxBody}>
//                         <div className={GlobalStyle.popupBox}>
//                             <h2 className={GlobalStyle.popupBoxTitle}>Log History</h2>
//                             <button
//                                 className={GlobalStyle.popupBoxCloseButton}
//                                 onClick={() => setShowPopup(false)}
//                             >
//                                 ×
//                             </button>
//                         </div>

//                         <div className="flex justify-start mb-4">
//                             <div className={GlobalStyle.searchBarContainer}>
//                                 <input
//                                     type="text"
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     className={GlobalStyle.inputSearch}
//                                 />
//                                 <FaSearch className={GlobalStyle.searchBarIcon} />
//                             </div>
//                         </div>

//                                     <div className={`${GlobalStyle.tableContainer} max-h-[300px] overflow-y-auto`}>

//                             <table className={GlobalStyle.table}>
//                                 <thead className={GlobalStyle.thead}>
//                                     <tr>
//                                         <th scope="col" className={GlobalStyle.tableHeader}>Edited On</th>
//                                         <th scope="col" className={GlobalStyle.tableHeader}>Action</th>
//                                         <th scope="col" className={GlobalStyle.tableHeader}>Edited By</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {userData?.log_history && userData.log_history.length > 0 ? (
//                                         userData.log_history
//                                             .filter(
//                                                 (log) =>
//                                                     log.edited_on?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                                                     log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                                                     log.edited_by?.toLowerCase().includes(searchQuery.toLowerCase())
//                                             )
//                                             .map((log, index) => (
//                                                 <tr
//                                                     key={index}
//                                                     className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
//                                                 >
//                                                     <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
//                                                         {log.edited_on}
//                                                     </td>
//                                                     <td className={GlobalStyle.tableData}>{log.action}</td>
//                                                     <td className={GlobalStyle.tableData}>{log.edited_by}</td>
//                                                 </tr>
//                                             ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan={3} className="text-center py-4">
//                                                 No log history available.
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Back Button */}
//             <div>
//                 <button onClick={() => navigate(-1)} className={GlobalStyle.buttonPrimary}>
//                     <FaArrowLeft className="mr-2" />
//                 </button>
//             </div>
//         </div>
//     );
// }


// After Responsive


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import Swal from 'sweetalert2';
import { terminateRO, GetRODetailsByID } from '../../services/Ro/RO';
import { getLoggedUserId } from "../../services/auth/authService.js";

export default function RecoveryOfficerEndPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData, activeUserType } = location.state || {};

    const [endDate, setEndDate] = useState('');
    const [endDateError, setEndDateError] = useState('');
    const [remark, setRemark] = useState('');
    const [remarkError, setRemarkError] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userId, setUserId] = useState(null); // Stores ro_id or drcUser_id

    const today = new Date().toISOString().split('T')[0];

    // Fetch user ID if not in userData
    useEffect(() => {
        const fetchId = async () => {
            if (!userData?.ro_id && !userData?.drcUser_id) {
                if (activeUserType !== "drcUser" && userData?.recovery_officer_name) {
                    try {
                        const details = await GetRODetailsByID({ ro_id: userData.recovery_officer_name }); // Adjust if name-based query is unsupported
                        if (details.status === 'success' && details.data?.ro_id) {
                            setUserId(details.data.ro_id);
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: "Could not fetch Recovery Officer ID.",
                                icon: "error",
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                            });
                        }
                    } catch (error) {
                        console.error("Error fetching RO ID:", error.message);
                        Swal.fire({
                            title: "Error",
                            text: "Failed to fetch Recovery Officer ID.",
                            icon: "error",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        });
                    }
                } else if (activeUserType === "drcUser" && userData?.drcUser_name) {
                    // Placeholder; adjust to fetch drcUser_id if needed
                    Swal.fire({
                        title: "Warning",
                        text: "drcUser_id fetching not implemented. Please pass drcUser_id.",
                        icon: "warning",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                }
            } else {
                setUserId(userData.ro_id || userData.drcUser_id);
            }
        };
        fetchId();
    }, [userData, activeUserType]);

    const validateInputs = () => {
        let isValid = true;

        if (!endDate) {
            setEndDateError('Please select an end date.');
            isValid = false;
        } else {
            const selectedDate = new Date(endDate);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            if (selectedDate < currentDate) {
                setEndDateError('End date cannot be in the past. Please select today or a future date.');
                isValid = false;
            } else {
                setEndDateError('');
            }
        }

        if (!remark.trim()) {
            setRemarkError('Please enter a remark.');
            isValid = false;
        } else {
            setRemarkError('');
        }

        if (!userId) {
            Swal.fire({
                title: "Invalid Data",
                text: "No user ID found. Please ensure the correct user data is passed.",
                icon: "error",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            isValid = false;
        }

        if (!isValid) {
            Swal.fire({
                title: "Invalid Input",
                text: "Please correct the errors in the form before saving.",
                icon: "error",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }

        return isValid;
    };

    const handleEndDateChange = (e) => {
        const value = e.target.value;
        setEndDate(value);
        if (!value) {
            setEndDateError('Please select an end date.');
        } else {
            const selectedDate = new Date(value);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            if (selectedDate < currentDate) {
                setEndDateError('End date cannot be in the past. Please select today or a future date.');
            } else {
                setEndDateError('');
            }
        }
    };

    const handleRemarkChange = (e) => {
        const value = e.target.value;
        setRemark(value);
        setRemarkError(value.trim() ? '' : 'Please enter a remark.');
    };

    const handleSave = async () => {
        if (!validateInputs()) return;

        try {
            // Fetch the logged-in user's data and extract user_id
            const userPayload = await getLoggedUserId();
            const end_by = userPayload?.user_id;

            const terminationDetails = {
                [activeUserType === "drcUser" ? "drcUser_id" : "ro_id"]: Number(userId),
                end_by: end_by,
                end_dtm: new Date(endDate).toISOString(),
                remark: remark.trim()
            };

            console.log("Sending termination request:", terminationDetails);

            const response = await terminateRO(terminationDetails);
            Swal.fire({
                title: "Success",
                text: response.message || `${activeUserType === "drcUser" ? "DRC User" : "Recovery Officer"} terminated successfully`,
                icon: "success",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(() => {
                navigate(-1);
            });
        } catch (error) {
            console.error("Termination error:", error.message);
            Swal.fire({
                title: "Error",
                text: error.message || "Failed to terminate user. Please check the input data.",
                icon: "error",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    };

    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Page Title */}
            <h2 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}>
                End {activeUserType === "drcUser" ? "DRC User" : "Recovery Officer"}
            </h2>
            <h2 className={`${GlobalStyle.headingMedium} pl-4 sm:pl-6 md:pl-10 text-lg sm:text-xl`}>
                DRC Name: {userData?.drc_name || 'N/A'}
            </h2>

            {/* Details Card */}
            <div className="flex flex-col lg:flex-row gap-4 mt-4 justify-center px-4">
                <div className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl`}>
                    <div className="overflow-x-auto">
                        <div className="table w-full min-w-[300px]">
                            <div className="table-row">
                                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">Added Date</div>
                                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">{userData?.added_date || 'N/A'}</div>
                            </div>

                            <div className="table-row">
                                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">
                                    {activeUserType === "drcUser" ? "DRC User Name" : "Recovery Officer Name"}
                                </div>
                                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">
                                    {userData?.drcUser_name || userData?.recovery_officer_name || 'N/A'}
                                </div>
                            </div>

                            <div className="table-row">
                                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">NIC</div>
                                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">{userData?.nic || 'N/A'}</div>
                            </div>

                            <div className="table-row">
                                <div className="table-cell px-2 sm:px-4 py-2 font-bold text-sm sm:text-base">Login Method</div>
                                <div className="table-cell px-1 sm:px-4 py-2"></div>
                                <div className="table-cell px-2 sm:px-4 py-2"></div>
                            </div>

                            <div className="table-row">
                                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">Contact No</div>
                                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">{userData?.contact_no || 'N/A'}</div>
                            </div>

                            <div className="table-row">
                                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">Email</div>
                                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base break-all">{userData?.email || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {activeUserType !== "drcUser" && userData?.rtom_areas && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2 px-2 sm:px-4 text-sm sm:text-base">RTOM Areas</h3>
                            <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                                <table className={`${GlobalStyle.table} table-auto w-full`} style={{ fontSize: '0.875rem' }}>
                                    <thead className={GlobalStyle.thead}>
                                        <tr>
                                            <th className={`${GlobalStyle.tableHeader} min-w-[120px]`}>RTOM Area</th>
                                            <th className={`${GlobalStyle.tableHeader} min-w-[100px]`}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userData.rtom_areas.length > 0 ? (
                                            userData.rtom_areas.map((area, index) => (
                                                <tr
                                                    key={index}
                                                    className={`${
                                                        index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"
                                                    } border-b`}
                                                >
                                                    <td className={`${GlobalStyle.tableData} text-center`}>
                                                        {area.name || 'N/A'}
                                                    </td>
                                                    <td className={`${GlobalStyle.tableData} text-center`}>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div
                                                                className={`inline-block w-8 h-4 sm:w-11 sm:h-6 rounded-full transition-colors ${area.status ? "bg-green-500" : "bg-gray-400"} relative`}
                                                            >
                                                                <div
                                                                    className={`w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-white absolute top-[2px] transition-all ${area.status ? "left-[18px] sm:left-[26px]" : "left-[2px]"}`}
                                                                />
                                                            </div>
                                                            
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={2} className="text-center py-4 text-sm">
                                                    No RTOM areas available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* End Date & Remark Section - Responsive */}
            <div className="flex justify-center mt-8 px-4">
                <div className="flex flex-col w-full max-w-[600px]">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-4">
                        <label className="font-semibold text-sm sm:text-base min-w-[90px]">
                            End date <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col w-full sm:w-[250px]">
                            <input
                                type="date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                className={`${GlobalStyle.inputText} w-full h-10 ${endDateError ? 'border-red-500' : ''}`}
                                min={today}
                            />
                            {endDateError && <p className="text-red-500 text-xs mt-1">{endDateError}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-2 text-sm sm:text-base">
                            Remark <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={remark}
                            onChange={handleRemarkChange}
                            className={`${GlobalStyle.inputText} w-full h-32 ${remarkError ? 'border-red-500' : ''}`}
                        />
                        {remarkError && <p className="text-red-500 text-xs mt-1">{remarkError}</p>}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button className={GlobalStyle.buttonPrimary} onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Log History Button */}
            <div className="flex justify-start mt-6 mb-6 px-4">
                <button className={GlobalStyle.buttonPrimary} onClick={() => setShowPopup(true)}>
                    Log History
                </button>
            </div>

            {/* Log History Popup */}
            {showPopup && (
                <div className={`${GlobalStyle.popupBoxContainer} fixed inset-0 z-50`}>
                    <div className={`${GlobalStyle.popupBoxBody} max-w-full max-h-full overflow-auto`}>
                        <div className={`${GlobalStyle.popupBox} mx-4 my-4 sm:mx-8 sm:my-8`}>
                            <h2 className={`${GlobalStyle.popupBoxTitle} text-lg sm:text-xl`}>Log History</h2>
                            <button
                                className={`${GlobalStyle.popupBoxCloseButton} text-xl sm:text-2xl`}
                                onClick={() => setShowPopup(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex justify-start mb-4 px-4">
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

                        <div className={`${GlobalStyle.tableContainer} max-h-[300px] sm:max-h-[400px] overflow-y-auto overflow-x-auto mx-4`}>
                            <table className={`${GlobalStyle.table} table-auto w-full`} style={{ fontSize: '0.875rem' }}>
                                <thead className={GlobalStyle.thead}>
                                    <tr>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`}>Edited On</th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[100px]`}>Action</th>
                                        <th className={`${GlobalStyle.tableHeader} min-w-[120px]`}>Edited By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData?.log_history && userData.log_history.length > 0 ? (
                                        userData.log_history
                                            .filter(
                                                (log) =>
                                                    (log.edited_on?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                                                    (log.action?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                                                    (log.edited_by?.toLowerCase() || '').includes(searchQuery.toLowerCase())
                                            )
                                            .map((log, index) => (
                                                <tr
                                                    key={index}
                                                    className={`${
                                                        index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"
                                                    } border-b`}
                                                >
                                                    <td className={`${GlobalStyle.tableData} text-center`}>
                                                        {log.edited_on || 'N/A'}
                                                    </td>
                                                    <td className={GlobalStyle.tableData}>{log.action || 'N/A'}</td>
                                                    <td className={GlobalStyle.tableData}>{log.edited_by || 'N/A'}</td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="text-center py-4 text-sm">
                                                No log history available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Back Button */}
            <div className="px-4">
                <button onClick={() => navigate(-1)} className={GlobalStyle.buttonPrimary}>
                    <FaArrowLeft className="mr-2" />
                </button>
            </div>
        </div>
    );
}
