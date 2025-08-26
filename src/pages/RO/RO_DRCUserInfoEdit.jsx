// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FaArrowLeft, FaSearch } from "react-icons/fa";
// import Swal from 'sweetalert2';
// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import gmailIcon from "../../assets/images/google.png";
// import { List_RO_Info_Own_By_RO_Id, updateROorDRCUserDetails } from "../../services/Ro/RO.js";
// import { getAllActiveRTOMs } from "../../services/rtom/RtomService.js";

// export default function RO_DRCUserDetailsEdit() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { itemType, itemData } = location.state?.dataToPass || {};

//   // State for fetched data
//   const [fetchedData, setFetchedData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   // Editable fields
//   const [contactNo, setContactNo] = useState('');
//   const [email, setEmail] = useState('');
//   const [remark, setRemark] = useState('');
//   const [drcUserStatus, setDrcUserStatus] = useState('Inactive'); // Default to 'Inactive'
//   const [rtomAreas, setRtomAreas] = useState([]);
//   const [selectedRtomArea, setSelectedRtomArea] = useState('');
//   const [showPopup, setShowPopup] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [rtomAreaOptions, setRtomAreaOptions] = useState([]);

//   // Fetch user data on mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!itemType || !itemData || (!itemData.ro_id && !itemData.drcUser_id)) {
//         Swal.fire({
//           title: 'Error',
//           text: 'Missing user type or ID. Please try again.',
//           icon: 'error',
//           allowOutsideClick: false,
//           allowEscapeKey: false,
//         });
//         navigate(-1);
//         return;
//       }

//       try {
//         const payload = itemData.ro_id ? { ro_id: itemData.ro_id } : { drcUser_id: itemData.drcUser_id };
//         setIsLoading(true);
//         const response = await List_RO_Info_Own_By_RO_Id(payload);
//         setIsLoading(false);

//         console.log('API Response:', {
//           itemType,
//           ro_id: itemData.ro_id,
//           drcUser_id: itemData.drcUser_id,
//           drcUser_status: response.data?.drcUser_status,
//           data: response.data,
//         });

//         if (response && response.data) {
//           setFetchedData(response.data);
//           setContactNo(response.data.contact_no || '');
//           setEmail(response.data.email || '');
//           setRemark(response.data.remark || '');
//           // Normalize drcUser_status (boolean or string)
//           let normalizedStatus;
//           if (typeof response.data.drcUser_status === 'boolean') {
//             normalizedStatus = response.data.drcUser_status ? 'Active' : 'Inactive';
//           } else {
//             const apiStatus = response.data.drcUser_status?.toLowerCase();
//             normalizedStatus =
//               apiStatus === 'active' ? 'Active' :
//               apiStatus === 'inactive' ? 'Inactive' :
//               apiStatus && ['active', 'inactive'].includes(apiStatus) ?
//                 apiStatus.charAt(0).toUpperCase() + apiStatus.slice(1).toLowerCase() :
//                 'Inactive'; // Default to 'Inactive' for safety
//           }

//           if (response.data.drcUser_status == null) {
//             console.warn('drcUser_status missing in API response, defaulting to Inactive:', payload);
//           } else if (typeof response.data.drcUser_status !== 'boolean' && !['active', 'inactive'].includes(response.data.drcUser_status?.toLowerCase())) {
//             console.warn('Invalid drcUser_status value, defaulting to Inactive:', {
//               drcUser_status: response.data.drcUser_status,
//               payload,
//             });
//           }

//           console.log('Normalized Status:', normalizedStatus);
//           setDrcUserStatus(normalizedStatus);

//           if (itemType === 'RO') {
//             setRtomAreas(
//               (response.data.rtom_areas || []).map(area => ({
//                 ...area,
//                 isNew: false,
//               }))
//             );
//           }
//         } else {
//           Swal.fire({
//             title: 'No Results',
//             text: 'No matching data found.',
//             icon: 'warning',
//             allowOutsideClick: false,
//             allowEscapeKey: false,
//           });
//           navigate(-1);
//         }
//       } catch (error) {
//         setIsLoading(false);
//         console.error('Error fetching user data:', error);
//         Swal.fire({
//           title: 'Error',
//           text: error.message || 'Failed to fetch data. Please try again.',
//           icon: 'error',
//           allowOutsideClick: false,
//           allowEscapeKey: false,
//         });
//         navigate(-1);
//       }
//     };

//     fetchUserData();
//   }, [itemType, itemData, navigate]);

//   // Fetch all active RTOMs
//   useEffect(() => {
//     const fetchRTOMs = async () => {
//       try {
//         const fetchedRTOMs = await getAllActiveRTOMs();
//         setRtomAreaOptions(fetchedRTOMs);
//       } catch (error) {
//         console.error('Error fetching RTOMs:', error);
//         Swal.fire({
//           title: 'Error',
//           text: 'Failed to fetch RTOM areas. Please try again later.',
//           icon: 'error',
//           allowOutsideClick: false,
//           allowEscapeKey: false,
//         });
//       }
//     };

//     fetchRTOMs();
//   }, []);

//   const validateInputs = () => {
//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       Swal.fire({
//         title: 'Invalid Input',
//         text: 'Please enter a valid email address.',
//         icon: 'error',
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//       });
//       return false;
//     }
//     if (!contactNo || !/^\+?\d{9,12}$/.test(contactNo)) {
//       Swal.fire({
//         title: 'Invalid Input',
//         text: 'Please enter a valid contact number (e.g., +94771234567).',
//         icon: 'error',
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//       });
//       return false;
//     }
//     if (!remark.trim()) {
//     Swal.fire({
//       title: 'Missing Remark',
//       text: 'Please enter a remark before saving.',
//       icon: 'warning',
//       allowOutsideClick: false,
//       allowEscapeKey: false,
//     });
//     return false;
//   }
//     if (itemType === 'RO' && rtomAreas.length > 0) {
//       const invalidRtom = rtomAreas.find(area => !rtomAreaOptions.some(opt => opt.area_name === area.name));
//       if (invalidRtom) {
//         Swal.fire({
//           title: 'Invalid RTOM',
//           text: `RTOM area "${invalidRtom.name}" is not valid.`,
//           icon: 'error',
//           allowOutsideClick: false,
//           allowEscapeKey: false,
//         });
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleSave = async () => {
//     try {
//       if (!validateInputs()) return;

//       const roId = itemData?.ro_id;
//       const drcUserId = itemData?.drcUser_id;
//       const drcId = fetchedData?.drc_id || 1;

//       if (itemType === 'RO' && !roId) {
//         throw new Error('Missing ro_id for Recovery Officer.');
//       }
//       if (itemType === 'drcUser' && !drcUserId) {
//         throw new Error('Missing drcUser_id for DRC User.');
//       }

//       const basePayload = {
//         ...(itemType === 'RO' ? { ro_id: roId } : { drcUser_id: drcUserId }),
//         drc_id: drcId,
//         ro_name: fetchedData?.drcUser_name || fetchedData?.recovery_officer_name || 'N/A',
//         login_email: email,
//         login_contact_no: contactNo,
//         drcUser_status: drcUserStatus,
//         create_by: fetchedData?.create_by || 'admin_user',
//         remark: remark || 'Updated user details',
//       };

//       const payload = itemType === 'RO' ? {
//         ...basePayload,
//         rtoms: rtomAreas.map(area => {
//           const rtomOption = rtomAreaOptions.find(opt => opt.area_name === area.name);
//           if (!rtomOption) {
//             throw new Error(`Invalid RTOM area: ${area.name}`);
//           }
//           return {
//             rtom_id: rtomOption.rtom_id,
//             rtom_status: area.status ? 'Active' : 'Inactive',
//             rtom_name: area.name,
//             billing_center_code: area.billing_center_code || rtomOption.billing_center_code || 'N/A',
//             handling_type: area.handling_type || 'Primary',
//           };
//         }),
//       } : basePayload;

//       console.log('Sending payload:', payload);

//       const response = await updateROorDRCUserDetails(payload);

//       if (response.success) {
//         Swal.fire({
//           title: 'Success',
//           text: 'User details updated successfully!',
//           icon: 'success',
//           allowOutsideClick: false,
//           allowEscapeKey: false,
//         });
//         navigate(-1); 
//       } else {
//         throw new Error(response.message || 'Failed to update user details.');
//       }
//     } catch (error) {
//       console.error('Error updating user details:', error);
//       Swal.fire({
//         title: 'Error',
//         text: error.message || 'Internal server error. Please try again later.',
//         icon: 'error',
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//       });
//     }
//   };

//   const toggleStatus = () => {
//     setDrcUserStatus(prev => prev === 'Active' ? 'Inactive' : 'Active');
//   };

//   const handleAddRtomArea = () => {
//     if (selectedRtomArea && !rtomAreas.some(area => area.name === selectedRtomArea)) {
//       const selectedOption = rtomAreaOptions.find(opt => opt.area_name === selectedRtomArea);
//       setRtomAreas([...rtomAreas, {
//         name: selectedRtomArea,
//         status: true,
//         isNew: true,
//         billing_center_code: selectedOption?.billing_center_code || 'N/A',
//       }]);
//       setSelectedRtomArea('');
//     }
//   };

//   const handleRemoveRtomArea = (index) => {
//     Swal.fire({
//       title: 'Confirm Removal',
//       text: `Are you sure you want to remove the RTOM area "${rtomAreas[index].name}"?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, remove it',
//       cancelButtonText: 'Cancel',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const newRtomAreas = rtomAreas.filter((_, i) => i !== index);
//         setRtomAreas(newRtomAreas);
//         Swal.fire({
//           title: 'Removed',
//           text: 'RTOM area has been removed successfully.',
//           icon: 'success',
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     });
//   };

//   const toggleRtomAreaStatus = (index) => {
//     const newRtomAreas = [...rtomAreas];
//     newRtomAreas[index].status = !newRtomAreas[index].status;
//     setRtomAreas(newRtomAreas);
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!fetchedData) {
//     return <div>No user data available.</div>;
//   }

//   return (
//     <div className={GlobalStyle.fontPoppins}>
//       <h2 className={GlobalStyle.headingLarge}>
//         {itemType === "drcUser" ? "Edit DRC User" : "Edit Recovery Officer"}
//       </h2>
//       <h2 className={`${GlobalStyle.headingMedium} pl-10`}>
//         DRC Name : {fetchedData.drc_name || 'N/A'}
//       </h2>

//       <div className="flex gap-4 mt-4 justify-center">
//         <div className={`${GlobalStyle.cardContainer} relative`}>
//           <div className="absolute top-4 right-4">
//             <div
//               className={`w-11 h-6 rounded-full transition-colors ${drcUserStatus === 'Active' ? 'bg-green-500' : 'bg-gray-400'} relative cursor-pointer`}
//               onClick={toggleStatus}
//             >
//               <div
//                 className={`w-5 h-5 rounded-full bg-white absolute top-[2px] transition-all ${drcUserStatus === 'Active' ? 'left-[26px]' : 'left-[2px]'}`}
//               />
//             </div>
//             <span className={`text-sm font-semibold ml-2 ${drcUserStatus === 'Active' ? 'text-green-600' : 'text-gray-500'}`}>
//               {drcUserStatus}
//             </span>
//           </div>

//           <div className="table">
//             <div className="table-row">
//               <div className="table-cell px-4 py-2 font-semibold">Added Date</div>
//               <div className="table-cell px-4 py-2 font-semibold">:</div>
//               <div className="table-cell px-4 py-2">{fetchedData.added_date || 'N/A'}</div>
//             </div>
//             <div className="table-row">
//               <div className="table-cell px-4 py-2 font-semibold">
//                 {itemType === "drcUser"
//                   ? "DRC User Name"
//                   : "Recovery Officer Name"}
//               </div>
//               <div className="table-cell px-4 py-2 font-semibold">:</div>
//               <div className="table-cell px-4 py-2">
//                 {fetchedData.drcUser_name || fetchedData.recovery_officer_name || 'N/A'}
//               </div>
//             </div>
//             <div className="table-row">
//               <div className="table-cell px-4 py-2 font-semibold">NIC</div>
//               <div className="table-cell px-4 py-2 font-semibold">:</div>
//               <div className="table-cell px-4 py-2">{fetchedData.nic || 'N/A'}</div>
//             </div>
//             <div className="table-row">
//               <div className="table-cell px-4 py-2 font-bold">Login Method</div>
//             </div>
//             <div className="table-row">
//               <div className="table-cell px-4 py-2 pl-8 font-semibold">
//                 Contact Number
//               </div>
//               <div className="table-cell px-4 py-2 font-semibold">:</div>
//               <div className="table-cell px-4 py-2">
//                 <input
//                   type="text"
//                   value={contactNo}
//                   onChange={(e) => setContactNo(e.target.value)}
//                   className={`${GlobalStyle.inputText} w-[150px]`}
//                   placeholder="+94771234567"
//                 />
//               </div>
//             </div>
//             <div className="table-row">
//               <div className="table-cell px-4 py-2 pl-12 font-semibold">
//                 <img
//                   src={gmailIcon}
//                   alt="Email"
//                   className="w-5 h-5 inline-block mr-2 align-middle"
//                   title="Email"
//                 />
//               </div>
//               <div className="table-cell px-4 py-2 font-semibold">:</div>
//               <div className="table-cell px-4 py-2">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className={`${GlobalStyle.inputText} w-[200px]`}
//                   placeholder="example@domain.com"
//                 />
//               </div>
//             </div>
//           </div>

//           {itemType === 'RO' && (
//             <>
//               <div className="table-row">
//                 <div className="table-cell px-4 py-2 font-semibold">RTOM Areas</div>
//                 <div className="table-cell px-4 py-2 font-semibold">:</div>
//                 <div className="table-cell px-4 py-2" />
//               </div>
//               <div className={GlobalStyle.tableContainer}>
//                 <table className={`${GlobalStyle.table} w-[360px]`}>
//                   <thead className={GlobalStyle.thead}>
//                     <tr>
//                       <th className={GlobalStyle.tableHeader}>RTOM Area</th>
//                       <th className={GlobalStyle.tableHeader}>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rtomAreas.length > 0 ? (
//                       rtomAreas.map((area, index) => (
//                         <tr
//                           key={index}
//                           className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
//                         >
//                           <td className={`${GlobalStyle.tableData} text-center pt-6`}>{area.name}</td>
//                           <td className={`${GlobalStyle.tableData} text-center`}>
//                             <div className="flex items-center justify-center gap-2">
//                               <div
//                                 className={`inline-block w-11 h-6 rounded-full transition-colors ${area.status ? 'bg-green-500' : 'bg-gray-400'} relative cursor-pointer`}
//                                 onClick={() => toggleRtomAreaStatus(index)}
//                               >
//                                 <div
//                                   className={`w-5 h-5 rounded-full bg-white absolute top-[2px] transition-all ${area.status ? 'left-[26px]' : 'left-[2px]'}`}
//                                 />
//                               </div>
//                               <span className={`text-sm font-semibold ${area.status ? 'text-green-600' : 'text-gray-500'}`}>
//                                 {area.status ? 'Active' : 'Inactive'}
//                               </span>
//                               {area.isNew && (
//                                 <button
//                                   onClick={() => handleRemoveRtomArea(index)}
//                                   className={`${GlobalStyle.buttonPrimary} w-10 h-8 flex items-center justify-center`}
//                                   title="Remove RTOM Area"
//                                 >
//                                   -
//                                 </button>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr className="bg-white">
//                         <td colSpan={2} className="text-center py-4">
//                           No RTOM areas available
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="table-row mt-4">
//                 <div className="table-cell px-4 py-2 font-semibold">Add RTOM Area</div>
//                 <div className="table-cell px-4 py-2 font-semibold">:</div>
//                 <div className="table-cell px-4 py-2">
//                   <div className="flex items-center">
//                     <select
//                       value={selectedRtomArea}
//                       onChange={(e) => setSelectedRtomArea(e.target.value)}
//                       className={`${GlobalStyle.inputText} w-[150px] mr-2`}
//                     >
//                       <option value="">Select RTOM</option>
//                       {rtomAreaOptions
//                         .filter(option => !rtomAreas.some(area => area.name === option.area_name))
//                         .map(option => (
//                           <option key={option.rtom_id} value={option.area_name}>
//                             {option.area_name}
//                           </option>
//                         ))}
//                     </select>
//                     <button
//                       onClick={handleAddRtomArea}
//                       className={GlobalStyle.buttonPrimary}
//                       disabled={!selectedRtomArea}
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           <div className="flex flex-col gap-4 p-4">
//             <div className="flex flex-col">
//               <div className="flex items-center mb-2">
//                 <label className="font-semibold mr-2">Remark</label>
//               </div>
//               <div className="ml-4">
//                 <textarea
//                   value={remark}
//                   onChange={(e) => setRemark(e.target.value)}
//                   className={`${GlobalStyle.inputText} w-[500px] h-20`}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end p-4">
//             <button className={GlobalStyle.buttonPrimary} onClick={handleSave}>
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-start mt-6 mb-6">
//         <button
//           className={GlobalStyle.buttonPrimary}
//           onClick={() => setShowPopup(true)}
//         >
//           Log History
//         </button>
//       </div>

//       {showPopup && (
//         <div className={GlobalStyle.popupBoxContainer}>
//           <div className={GlobalStyle.popupBoxBody}>
//             <div className={GlobalStyle.popupBox}>
//               <h2 className={GlobalStyle.popupBoxTitle}>Log History</h2>
//               <button
//                 className={GlobalStyle.popupBoxCloseButton}
//                 onClick={() => setShowPopup(false)}
//               >
//                 ×
//               </button>
//             </div>
//             <div className="flex justify-start mb-4">
//               <div className={GlobalStyle.searchBarContainer}>
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className={GlobalStyle.inputSearch}
//                 />
//                 <FaSearch className={GlobalStyle.searchBarIcon} />
//               </div>
//             </div>
//             <div className={`${GlobalStyle.tableContainer} max-h-[300px] overflow-y-auto`}>
//   <table className={GlobalStyle.table}>

//                 <thead className={GlobalStyle.thead}>
//                   <tr>
                    
//                     <th className={GlobalStyle.tableHeader}>Edited On</th>
//                     <th className={GlobalStyle.tableHeader}>Action</th>
//                     <th className={GlobalStyle.tableHeader}>Edited By</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//   {fetchedData.log_history && fetchedData.log_history.length > 0 ? (
//     fetchedData.log_history
//       .filter(
//         (log) =>
//           log.edited_on?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
//           log.action?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
//           log.edited_by?.toLowerCase()?.includes(searchQuery.toLowerCase())
//       )
//       .map((log, index) => (
//         <tr
//           key={index}
//           className={`transition-colors duration-300 ${index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}`}
//         >
//           <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
//             {log.edited_on || 'N/A'}
//           </td>
//           <td className={GlobalStyle.tableData}>{log.action || 'N/A'}</td>
//           <td className={GlobalStyle.tableData}>{log.edited_by || 'N/A'}</td>
//         </tr>
//       ))
//   ) : (
//     <tr className="bg-white">
//       <td colSpan={3} className="text-center py-4">
//         No log history available.
//       </td>
//     </tr>
//   )}
// </tbody>

//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       <div>
//         <button
//           onClick={() => navigate(-1)}
//           className={GlobalStyle.buttonPrimary}
//         >
//           <FaArrowLeft />
//         </button>
//       </div>
//     </div>
//   );
// }


// After Responsive
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import Swal from 'sweetalert2';
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import gmailIcon from "../../assets/images/google.png";
import { List_RO_Info_Own_By_RO_Id, updateROorDRCUserDetails } from "../../services/Ro/RO.js";
import { getAllActiveRTOMs } from "../../services/rtom/RtomService.js";
import { getLoggedUserId } from "../../services/auth/authService.js";
import addIcon from "../../assets/images/add.svg";
import iconImg from "../../assets/images/minorc.png";

export default function RO_DRCUserDetailsEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemType, itemData } = location.state?.dataToPass || {};

  // State for fetched data
  const [fetchedData, setFetchedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Top level type vs. DRC subtype
  const [activeUserType, setActiveUserType] = useState(itemType);
  const [activeUserRole, setActiveUserRole] = useState('');
  // Editable fields
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [userNic, setUserNic] = useState('');
  const [userNicError, setUserNicError] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [contactNoError, setContactNoError] = useState('');
  const [contactNoTwo, setContactNoTwo] = useState('');
  const [contactNoErrorTwo, setContactNoErrorTwo] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [remark, setRemark] = useState('');
  const [drcUserStatus, setDrcUserStatus] = useState('Inactive');
  // RTOM areas (only for RO)
  const [rtomAreas, setRtomAreas] = useState([]);
  const [selectedRtomArea, setSelectedRtomArea] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rtomAreaOptions, setRtomAreaOptions] = useState([]);
  
  // Track initial values for change detection
  const [initialUserName, setInitialUserName] = useState('');
  const [initialUserNic, setInitialUserNic] = useState('');
  const [initialContactNo, setInitialContactNo] = useState('');
  const [initialContactNoTwo, setInitialContactNoTwo] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [initialDrcUserStatus, setInitialDrcUserStatus] = useState('Inactive');
  const [initialRtomAreas, setInitialRtomAreas] = useState([]);

  // Enhanced 24-hour restriction states
  const [canEditName, setCanEditName] = useState(true);
  const [canEditNic, setCanEditNic] = useState(true);
  const [userCreatedAt, setUserCreatedAt] = useState(null);
  const [timeRestrictionMessage, setTimeRestrictionMessage] = useState('');
  const [remainingEditTime, setRemainingEditTime] = useState(null);

  // Helper
  const roleLabels = {
    drcCoordinator: "DRC Coordinator",
    drcCallCenter: "DRC Call Center",
    drcStaff: "DRC Staff",
  }

  // Enhanced function to check 24-hour restriction with better error handling
  const check24HourRestriction = (createdAt) => {
    if (!createdAt) {
      console.log('No creation date found, allowing editing for new users');
      return { 
        canEditName: true, 
        canEditNic: true, 
        message: 'No creation date found. Name and NIC editing allowed.',
        remainingTime: null
      };
    }
    
    try {
      // Handle different date formats that might come from the API
      let creationDate;
      if (typeof createdAt === 'string') {
        // Try parsing ISO date string
        creationDate = new Date(createdAt);
      } else if (createdAt instanceof Date) {
        creationDate = createdAt;
      } else {
        throw new Error('Invalid date format');
      }
      
      // Check if the date is valid
      if (isNaN(creationDate.getTime())) {
        console.warn('Invalid creation date format:', createdAt, 'allowing editing');
        return { 
          canEditName: true, 
          canEditNic: true, 
          message: 'Invalid creation date format. Name and NIC editing allowed.',
          remainingTime: null
        };
      }
      
      const currentDate = new Date();
      const hoursSinceCreation = (currentDate.getTime() - creationDate.getTime()) / (1000 * 60 * 60);
      
      // Allow editing if less than 24 hours have passed
      const canEdit = hoursSinceCreation < 24;
      
      let message;
      let remainingTime = null;
      
      if (canEdit) {
        const remainingHours = Math.max(0, 24 - hoursSinceCreation);
        const hours = Math.floor(remainingHours);
        const minutes = Math.floor((remainingHours - hours) * 60);
        remainingTime = { hours, minutes };
        
        if (hours > 0) {
          message = `Name and NIC can be edited for ${hours}h ${minutes}m more.`;
        } else {
          message = `Name and NIC can be edited for ${minutes}m more.`;
        }
      } else {
        const hoursExceeded = Math.floor(hoursSinceCreation - 24);
      }
      
      console.log('24-hour restriction check:', {
        createdAt,
        hoursSinceCreation: hoursSinceCreation.toFixed(2),
        canEdit,
        message
      });
      
      return {
        canEditName: canEdit,
        canEditNic: canEdit,
        message: message,
        remainingTime: remainingTime
      };
    } catch (error) {
      console.error('Error checking 24-hour restriction:', error);
      console.log('Allowing editing due to error in date processing');
      return { 
        canEditName: true, 
        canEditNic: true, 
        message: 'Error checking time restriction. Name and NIC editing allowed.',
        remainingTime: null
      };
    }
  };

  // Real-time countdown timer for remaining edit time
  useEffect(() => {
    let timer;
    if (canEditName && canEditNic && userCreatedAt && remainingEditTime) {
      timer = setInterval(() => {
        const restriction = check24HourRestriction(userCreatedAt);
        setCanEditName(restriction.canEditName);
        setCanEditNic(restriction.canEditNic);
        setTimeRestrictionMessage(restriction.message);
        setRemainingEditTime(restriction.remainingTime);
        
        // If time has expired, clear the timer
        if (!restriction.canEditName) {
          clearInterval(timer);
        }
      }, 60000); // Update every minute
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [canEditName, canEditNic, userCreatedAt, remainingEditTime]);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!itemType || !itemData || (!itemData.ro_id && !itemData.drc_officer_id)) {
        Swal.fire({
          title: 'Error',
          text: 'Missing user type or ID. Please try again.',
          icon: 'error',
          confirmButtonColor: "#d33",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        navigate(-1);
        return;
      }

      try {
        const payload = itemData.ro_id ? { ro_id: itemData.ro_id } : { drc_officer_id: itemData.drc_officer_id };
        setIsLoading(true);
        const response = await List_RO_Info_Own_By_RO_Id(payload);
        setIsLoading(false);

        console.log('API Response:', {
          itemType,
          ro_id: itemData.ro_id,
          drc_officer_id: itemData.drc_officer_id,
          drcUser_status: response.data?.drcUser_status,
          createdAt: response.data?.createdAt || response.data?.created_at,
          data: response.data,
        });

        if (response && response.data) {
          setFetchedData(response.data);
          
          // Set user name
          const fetchedName = response.data.drcUser_name || response.data.recovery_officer_name || '';
          setUserName(fetchedName);
          setInitialUserName(fetchedName);
          
          // Set user NIC
          const fetchedNic = response.data.nic || '';
          setUserNic(fetchedNic);
          setInitialUserNic(fetchedNic);
          
          // Set other fields
          setContactNo(response.data.contact_no || '');
          setContactNoTwo(response.data.contact_no_two || '');
          setInitialContactNo(response.data.contact_no || '');
          setInitialContactNoTwo(response.data.contact_no_two || '');
          setEmail(response.data.email || '');
          setInitialEmail(response.data.email || '');
          setRemark(response.data.remark || '');

          // Enhanced user creation date handling and 24-hour restriction check
          const createdAt = response.data.createdAt || response.data.created_at || response.data.added_date;
          console.log('Raw createdAt from API:', createdAt);
          
          setUserCreatedAt(createdAt);
          
          const restriction = check24HourRestriction(createdAt);
          setCanEditName(restriction.canEditName);
          setCanEditNic(restriction.canEditNic);
          setTimeRestrictionMessage(restriction.message);
          setRemainingEditTime(restriction.remainingTime);

          if (response.data.user_role) {
            const apiRole = response.data.user_role;
            const displayRole = roleLabels[apiRole]
              ? roleLabels[apiRole]
              : apiRole.charAt(0).toUpperCase() + apiRole.slice(1).toLowerCase();
            setActiveUserRole(displayRole);
          }

          // Normalize drcUser_status
          let normalizedStatus;
          if (typeof response.data.drcUser_status === 'boolean') {
            normalizedStatus = response.data.drcUser_status ? 'Active' : 'Inactive';
          } else {
            const apiStatus = response.data.drcUser_status?.toLowerCase();
            normalizedStatus =
              apiStatus === 'active' ? 'Active' :
              apiStatus === 'inactive' ? 'Inactive' :
              apiStatus && ['active', 'inactive'].includes(apiStatus) ?
                apiStatus.charAt(0).toUpperCase() + apiStatus.slice(1).toLowerCase() :
                'Inactive';
          }

          if (response.data.drcUser_status == null) {
            console.warn('drcUser_status missing in API response, defaulting to Inactive:', payload);
          } else if (typeof response.data.drcUser_status !== 'boolean' && !['active', 'inactive'].includes(response.data.drcUser_status?.toLowerCase())) {
            console.warn('Invalid drcUser_status value, defaulting to Inactive:', {
              drcUser_status: response.data.drcUser_status,
              payload,
            });
          }

          console.log('Normalized Status:', normalizedStatus);
          setDrcUserStatus(normalizedStatus);
          setInitialDrcUserStatus(normalizedStatus);

          if (itemType === 'RO') {
            const areas = (response.data.rtom_areas || []).map(area => ({
              ...area,
              isNew: false,
            }));
            setRtomAreas(areas);
            setInitialRtomAreas(JSON.parse(JSON.stringify(areas))); // Deep copy
          }
        } else {
          Swal.fire({
            title: 'No Results',
            text: 'No matching data found.',
            icon: 'warning',
            confirmButtonColor: "#f1c40f",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          navigate(-1);
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching user data:', error);
        Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to fetch data. Please try again.',
          icon: 'error',
          confirmButtonColor: "#d33",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        navigate(-1);
      }
    };

    fetchUserData();
  }, [itemType, itemData, navigate]);

  // Fetch all active RTOMs
  useEffect(() => {
    const fetchRTOMs = async () => {
      try {
        const fetchedRTOMs = await getAllActiveRTOMs();
        setRtomAreaOptions(fetchedRTOMs);
      } catch (error) {
        console.error('Error fetching RTOMs:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch RTOM areas. Please try again later.',
          icon: 'error',
          confirmButtonColor: "#d33",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    };

    fetchRTOMs();
  }, []);

  // Enhanced input handlers with proper restriction enforcement
  const handleUserNameChange = (value) => {
    if (!canEditName) {
      Swal.fire({
        title: 'Editing Restricted',
        text: 'Name can only be edited within 24 hours of user creation. The 24-hour period has expired.',
        icon: 'warning',
        confirmButtonColor: "#f1c40f",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }
    setUserName(value);
    setUserNameError(value.trim() ? '' : 'Name is required.');
  };

  const handleUserNicChange = (value) => {
    if (!canEditNic) {
      Swal.fire({
        title: 'Editing Restricted',
        text: 'NIC can only be edited within 24 hours of user creation. The 24-hour period has expired.',
        icon: 'warning',
        confirmButtonColor: "#f1c40f",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }
    // Basic NIC validation - adjust according to your country's format
    const cleaned = value.replace(/[^0-9Vv]/g, '');
    setUserNic(cleaned);
    
    if (!cleaned) {
      setUserNicError('NIC is required.');
    } else if (cleaned.length < 9 || cleaned.length > 12) {
      setUserNicError('Please enter a valid NIC number.');
    } else {
      setUserNicError('');
    }
  };

  const handleContactNoChange = (value) => {
    const cleaned = value.replace(/[^+\d]/g, '');
    const digitsOnly = cleaned.replace(/\D/g, '');

    if (digitsOnly.length > 10) {
      setContactNoError('Contact number cannot exceed 10 digits.');
    } else {
      setContactNoError(digitsOnly.length > 0 && digitsOnly.length < 9 ? 'Contact number must be 9-10 digits.' : '');
      setContactNo(cleaned);
    }
  };

  const handleContactNoChangeTwo = (value) => {
    const cleaned = value.replace(/[^+\d]/g, '');
    const digitsOnly = cleaned.replace(/\D/g, '');

    if (cleaned === '') {
      // Allow empty value since it's optional
      setContactNoTwo('');
      setContactNoErrorTwo('');
    } else if (digitsOnly.length > 10) {
      setContactNoErrorTwo('Contact number cannot exceed 10 digits.');
    } else {
      setContactNoErrorTwo(digitsOnly.length > 0 && digitsOnly.length < 9 ? 'Contact number must be 9-10 digits.' : '');
      setContactNoTwo(cleaned);
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (!value) {
      setEmailError('Please enter an email address.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const validateInputs = () => {
    let isValid = true;

    // Only validate name if it's editable
    if (canEditName && !userName.trim()) {
      setUserNameError('Name is required.');
      isValid = false;
    } else if (!canEditName) {
      // Clear name error if editing is not allowed
      setUserNameError('');
    }

    // Only validate NIC if it's editable
    if (canEditNic && (!userNic || userNic.length < 9 || userNic.length > 12)) {
      setUserNicError('Please enter a valid NIC number.');
      isValid = false;
    } else if (!canEditNic) {
      // Clear NIC error if editing is not allowed
      setUserNicError('');
    }

    // Validate email (always required)
    if (!email) {
      setEmailError('Please enter an email address.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    // Validate contact number 1 (always required)
    if (!contactNo || !/^\+?\d{9,10}$/.test(contactNo)) {
      setContactNoError('Please enter a valid contact number (e.g., +94771234567).');
      isValid = false;
    }

    // Contact Number 2 is optional - only validate format if provided
    if (contactNoTwo && !/^\+?\d{9,10}$/.test(contactNoTwo)) {
      setContactNoErrorTwo('Please enter a valid contact number (e.g., +94771234567).');
      isValid = false;
    } else if (!contactNoTwo) {
      // Clear error if field is empty (since it's optional)
      setContactNoErrorTwo('');
    }

    // Validate remark
    if (!remark.trim()) {
      Swal.fire({
        title: 'Missing Remark',
        text: 'Please enter a remark before saving.',
        icon: 'warning',
        confirmButtonColor: "#f1c40f",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      isValid = false;
      return isValid; // Return early if remark is missing
    }

    // Enhanced change detection that correctly handles restricted fields
    const hasEditableChanges =
      (canEditName && userName !== initialUserName) ||
      (canEditNic && userNic !== initialUserNic) ||
      contactNo !== initialContactNo ||
      contactNoTwo !== initialContactNoTwo ||
      email !== initialEmail ||
      drcUserStatus !== initialDrcUserStatus ||
      (itemType === 'RO' &&
        (rtomAreas.length !== initialRtomAreas.length ||
         rtomAreas.some((area, index) =>
           index >= initialRtomAreas.length || // New area added
           area.name !== initialRtomAreas[index]?.name ||
           area.status !== initialRtomAreas[index]?.status
         )));

    if (!hasEditableChanges) {
      let availableFields = ['Contact Number 1', 'Contact Number 2', 'Email', 'Status'];
      if (itemType === 'RO') availableFields.push('RTOM Areas');
      if (canEditName) availableFields.unshift('Name');
      if (canEditNic) availableFields.unshift('NIC');
      
      let message = `You must make at least one change to save. Available fields: ${availableFields.join(', ')}.`;
      
      if (!canEditName || !canEditNic) {
        let restrictedFields = [];
        if (!canEditName) restrictedFields.push('Name');
        if (!canEditNic) restrictedFields.push('NIC');
        message += ` Note: ${restrictedFields.join(' and ')} cannot be edited after 24 hours.`;
      }
      
      Swal.fire({
        title: 'No Changes Detected',
        text: message,
        icon: 'warning',
        confirmButtonColor: "#f1c40f",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      isValid = false;
      return isValid;
    }

    // Validate RTOM areas for RO
    if (itemType === 'RO' && rtomAreas.length > 0) {
      const invalidRtom = rtomAreas.find(area => !rtomAreaOptions.some(opt => opt.area_name === area.name));
      if (invalidRtom) {
        Swal.fire({
          title: 'Invalid RTOM',
          text: `RTOM area "${invalidRtom.name}" is not valid.`,
          icon: 'error',
          confirmButtonColor: "#d33",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        isValid = false;
      }

      // Ensure at least one RTOM is active if user status is Active
      if (drcUserStatus === 'Active' && !rtomAreas.some(area => area.status)) {
        Swal.fire({
          title: 'Invalid RTOM Status',
          text: 'At least one RTOM area must be active when the user status is Active.',
          icon: 'error',
          confirmButtonColor: "#d33",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        isValid = false;
      }
    }

    return isValid;
  };

  // Updated handleSave function to always include login_contact_no_two
  const handleSave = async () => {
    try {
      if (!validateInputs()) return;

      const roId = itemData?.ro_id;
      const drcUserId = itemData?.drc_officer_id;
      const drcId = fetchedData?.drc_id || 1;

      if (itemType === 'RO' && !roId) {
        throw new Error('Missing ro_id for Recovery Officer.');
      }
      if (itemType === 'drcUser' && !drcUserId) {
        throw new Error('Missing drc_officer_id for DRC User.');
      }

      const userPayload = await getLoggedUserId();
      const create_by = userPayload?.user_id;

      // Build payload, always including login_contact_no_two
      const basePayload = {
        ...(itemType === 'RO' ? { ro_id: roId } : { drc_officer_id: drcUserId }),
        drc_id: drcId,
        user_role: activeUserRole,
        login_email: email,
        login_contact_no: contactNo,
        login_contact_no_two: contactNoTwo, // Always include, even if empty
        drcUser_status: drcUserStatus,
        create_by: create_by,
        remark: remark || 'Updated user details',
      };

      // Only add name to payload if it can be edited AND has actually changed
      if (canEditName && userName !== initialUserName) {
        basePayload.name = userName;
        console.log('Including name in payload:', userName);
      } else {
        console.log('Excluding name from payload - either restricted or unchanged');
      }

      // Only add NIC to payload if it can be edited AND has actually changed
      if (canEditNic && userNic !== initialUserNic) {
        basePayload.nic = userNic;
        console.log('Including NIC in payload:', userNic);
      } else {
        console.log('Excluding NIC from payload - either restricted or unchanged');
      }

      const payload = itemType === 'RO' ? {
        ...basePayload,
        rtoms: rtomAreas.map(area => {
          const rtomOption = rtomAreaOptions.find(opt => opt.area_name === area.name);
          if (!rtomOption) {
            throw new Error(`Invalid RTOM area: ${area.name}`);
          }
          return {
            rtom_id: rtomOption.rtom_id,
            rtom_status: area.status ? 'Active' : 'Inactive',
            rtom_name: area.name,
            billing_center_code: area.billing_center_code || rtomOption.billing_center_code || 'N/A',
            handling_type: area.handling_type || 'Primary',
          };
        }),
      } : basePayload;

      console.log('Final payload:', payload);

      const response = await updateROorDRCUserDetails(payload);

      if (response.success) {
        let successMessage = 'User details updated successfully!';
        if (!canEditName || !canEditNic) {
          let restrictedFields = [];
          if (!canEditName) restrictedFields.push('Name');
          if (!canEditNic) restrictedFields.push('NIC');
          successMessage += ` (${restrictedFields.join(' and ')} were not updated due to 24-hour restriction)`;
        }
        
        Swal.fire({
          title: 'Success',
          text: successMessage,
          icon: 'success',
          confirmButtonColor: "#28a745",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        navigate(-1);
      } else {
        throw new Error(response.message || 'Failed to update user details.');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      Swal.fire({
        title: 'Unable to Edit Details',
        text: error.message || 'Internal server error. Please try again later.',
        icon: 'error',
        confirmButtonColor: "#d33",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  };

  const toggleStatus = () => {
    setDrcUserStatus(prev => prev === 'Active' ? 'Inactive' : 'Active');
  };

  const handleAddRtomArea = () => {
    if (selectedRtomArea && !rtomAreas.some(area => area.name === selectedRtomArea)) {
      const selectedOption = rtomAreaOptions.find(opt => opt.area_name === selectedRtomArea);
      setRtomAreas([...rtomAreas, {
        name: selectedRtomArea,
        status: true,
        isNew: true,
        billing_center_code: selectedOption?.billing_center_code || 'N/A',
      }]);
      setSelectedRtomArea('');
    }
  };

  const handleRemoveRtomArea = (index) => {
    Swal.fire({
      title: 'Confirm Removal',
      text: `Are you sure you want to remove the RTOM area "${rtomAreas[index].name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const newRtomAreas = rtomAreas.filter((_, i) => i !== index);
        if (drcUserStatus === 'Active' && newRtomAreas.length > 0 && !newRtomAreas.some(area => area.status)) {
          Swal.fire({
            title: 'Cannot Remove RTOM',
            text: 'At least one RTOM area must remain active when the user status is Active.',
            icon: 'error',
            confirmButtonColor: "#d33",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          return;
        }
        setRtomAreas(newRtomAreas);
        Swal.fire({
          title: 'Removed',
          text: 'RTOM area has been removed successfully.',
          icon: 'success',
          confirmButtonColor: "#28a745",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const toggleRtomAreaStatus = (index) => {
    if (drcUserStatus === 'Active' && rtomAreas[index].status) {
      const activeRtomCount = rtomAreas.filter(area => area.status).length;
      if (activeRtomCount <= 1) {
        Swal.fire({
          title: 'Cannot Deactivate RTOM',
          text: 'At least one RTOM area must remain active when the user status is Active.',
          icon: 'error',
          confirmButtonColor: "#d33",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        return;
      }
    }

    const newRtomAreas = [...rtomAreas];
    newRtomAreas[index].status = !newRtomAreas[index].status;
    setRtomAreas(newRtomAreas);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!fetchedData) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No user data available.
      </div>
    );
  }

  const getUserRoleDisplayText = (role) => {
    const roleMapping = {
      'DRC Coordinator': 'DRC Coordinator',
      'call center': 'Call Center',
      'user staff': 'User Staff'
    };
    return roleMapping[role] || role || 'N/A';
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h2 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}>
        {itemType === "drcUser" ? "Edit DRC User" : "Edit Recovery Officer"}
      </h2>
      <h2 className={`${GlobalStyle.headingMedium} pl-4 sm:pl-6 md:pl-10 text-lg sm:text-xl`}>
        DRC Name: {fetchedData.drc_name || 'N/A'}
      </h2>

      {/* Enhanced 24-hour restriction notice */}
      {timeRestrictionMessage && (
        <div className={`mx-4 mt-4 p-4 rounded-lg border-l-4 ${
          canEditName && canEditNic 
            ? 'bg-blue-50 border-blue-400 text-blue-800' 
            : 'bg-red-50 border-red-400 text-red-800'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {canEditName && canEditNic ? (
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8.707-3.293a1 1 0 011.414 0L10 7.414l.293-.707a1 1 0 011.414 1.414L11 8.828l.707.707a1 1 0 01-1.414 1.414L10 10.242l-.707.707a1 1 0 01-1.414-1.414L8.586 9l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{timeRestrictionMessage}</p>
              {!canEditName || !canEditNic ? (
                <p className="text-xs mt-1 opacity-75">
                  Only contact details, email, status, and RTOM areas can be modified.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 mt-4 justify-center px-4">
        <div className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl`}>
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center">
            <div
              className={`w-8 h-4 sm:w-11 sm:h-6 rounded-full transition-colors ${drcUserStatus === 'Active' ? 'bg-green-500' : 'bg-gray-400'} relative cursor-pointer`}
              onClick={toggleStatus}
            >
              <div
                className={`w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-white absolute top-[2px] transition-all ${drcUserStatus === 'Active' ? 'left-[18px] sm:left-[26px]' : 'left-[2px]'}`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="table w-full min-w-[300px]">
              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">Added Date</div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">{fetchedData.added_date || 'N/A'}</div>
              </div>
              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">User Type</div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">
                  {activeUserType === "RO" ? "Recovery Officer" : activeUserType === "drcUser" ? "DRC User" : "N/A"}
                </div>
              </div>

              {activeUserType === "drcUser" && (
                <div className="table-row">
                  <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">User Role</div>
                  <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                  <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">
                    {getUserRoleDisplayText(activeUserRole)}
                  </div>
                </div>
              )}
              
              {/* Enhanced Name field with better visual feedback for 24-hour restriction */}
              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">
                  {itemType === "drcUser" ? "DRC User Name" : "Recovery Officer Name"}
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-center">
                    <span className="text-sm sm:text-base font-medium text-gray-700">{initialUserName || 'N/A'}</span>
                    {canEditName ? (
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => handleUserNameChange(e.target.value)}
                        className={`${GlobalStyle.inputText} w-full sm:w-[200px] md:w-[250px] mt-[-2px] sm:mt-0 
                          ${userNameError ? 'border-red-500' : ''}`}
                        placeholder="Enter name"
                      />
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          value={userName}
                          onClick={() => handleUserNameChange(userName)} // Trigger warning on click
                          readOnly
                          className={`${GlobalStyle.inputText} w-full sm:w-[200px] md:w-[250px] mt-[-2px] sm:mt-0 
                            bg-gray-100 text-gray-500 cursor-not-allowed opacity-60 border-gray-300`}
                          placeholder="Editing disabled after 24 hours"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {userNameError && (
                    <p className="text-red-500 text-xs mt-1">{userNameError}</p>
                  )}
                  {!canEditName && (
                    <p className="text-orange-600 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                      Name editing is disabled after 24 hours of user creation.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Enhanced NIC field with better visual feedback for 24-hour restriction */}
              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">
                  NIC
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-center">
                    <span className="text-sm sm:text-base font-medium text-gray-700">{initialUserNic || 'N/A'}</span>
                    {canEditNic ? (
                      <input
                        type="text"
                        value={userNic}
                        onChange={(e) => handleUserNicChange(e.target.value)}
                        className={`${GlobalStyle.inputText} w-full sm:w-[200px] md:w-[250px] mt-[-2px] sm:mt-0 
                          ${userNicError ? 'border-red-500' : ''}`}
                        placeholder="Enter NIC number"
                      />
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          value={userNic}
                          onClick={() => handleUserNicChange(userNic)} // Trigger warning on click
                          readOnly
                          className={`${GlobalStyle.inputText} w-full sm:w-[200px] md:w-[250px] mt-[-2px] sm:mt-0 
                            bg-gray-100 text-gray-500 cursor-not-allowed opacity-60 border-gray-300`}
                          placeholder="Editing disabled after 24 hours"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {userNicError && (
                    <p className="text-red-500 text-xs mt-1">{userNicError}</p>
                  )}
                  {!canEditNic && (
                    <p className="text-orange-600 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                      NIC editing is disabled after 24 hours of user creation.
                    </p>
                  )}
                </div>
              </div>

              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-bold text-sm sm:text-base">Login Method</div>
                <div className="table-cell px-1 sm:px-4 py-2"></div>
                <div className="table-cell px-2 sm:px-4 py-2"></div>
              </div>
              <div className="table-row">
                <div className="table-cell px-4 sm:px-8 py-2 font-semibold text-sm sm:text-base">
                  Contact Number 1 <span className="text-red-500">*</span>
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-center">
                  <span className="text-sm sm:text-base font-medium text-gray-700">{initialContactNo || 'N/A'}</span>
                  <input
                    type="text"
                    value={contactNo}
                    onChange={(e) => handleContactNoChange(e.target.value)}
                    className={`${GlobalStyle.inputText} w-full sm:w-[150px] md:w-[200px] mt-[-2px] sm:mt-0 ${contactNoError ? 'border-red-500' : ''}`}
                    placeholder="Enter contact number"
                  />
                </div>
                {contactNoError && (
                  <p className="text-red-500 text-xs mt-1">{contactNoError}</p>
                )}
              </div>
              </div>
              
              <div className="table-row">
                <div className="table-cell px-4 sm:px-8 py-2 font-semibold text-sm sm:text-base">
                  Contact Number 2 <span className="text-gray-500 font-normal">(Optional)</span>
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-center">
                  <span className="text-sm sm:text-base font-medium text-gray-700">{initialContactNoTwo || 'Set Number'}</span>
                  <input
                    type="text"
                    value={contactNoTwo}
                    onChange={(e) => handleContactNoChangeTwo(e.target.value)}
                    className={`${GlobalStyle.inputText} w-full sm:w-[150px] md:w-[200px] mt-[-2px] sm:mt-0 ${contactNoErrorTwo ? 'border-red-500' : ''}`}
                    placeholder="Enter contact number (optional)"
                  />
                </div>
                {contactNoErrorTwo && (
                  <p className="text-red-500 text-xs mt-1">{contactNoErrorTwo}</p>
                )}
              </div>
              </div>
              <div className="table-row">
                <div className="table-cell px-4 sm:px-8 py-2 font-semibold text-sm sm:text-base">
                  Email <span className="text-red-500">*</span>
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-center">
                    <span className="text-sm sm:text-base font-medium text-gray-700">{initialEmail || 'N/A'}</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={`${GlobalStyle.inputText} w-full sm:w-[200px] md:w-[250px] mt-[-4px] sm:mt-0 ${emailError ? 'border-red-500' : ''}`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {itemType === 'RO' && (
            <>
              <div className="table w-full mt-4">
                <div className="table-row">
                  <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">Billing Center Areas</div>
                  <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                  <div className="table-cell px-2 sm:px-4 py-2" />
                </div>
              </div>
              <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                <table className={`${GlobalStyle.table} table-auto w-full min-w-[300px]`} style={{ fontSize: '0.875rem' }}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th className={`${GlobalStyle.tableHeader} min-w-[120px]`}>Billing Center Area</th>
                      <th className={`${GlobalStyle.tableHeader} min-w-[120px]`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rtomAreas.length > 0 ? (
                      rtomAreas.map((area, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"
                          } border-b`}
                        >
                          <td className={`${GlobalStyle.tableData} text-center`}>{area.name}</td>
                          <td className={`${GlobalStyle.tableData} text-center`}>
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                              <div
                                className={`inline-block w-8 h-4 sm:w-11 sm:h-6 rounded-full transition-colors ${area.status ? 'bg-green-500' : 'bg-gray-400'} relative cursor-pointer`}
                                onClick={() => toggleRtomAreaStatus(index)}
                              >
                                <div
                                  className={`w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-white absolute top-[2px] transition-all ${area.status ? 'left-[18px] sm:left-[26px]' : 'left-[2px]'}`}
                                />
                              </div>
                              {area.isNew && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRtomArea(index)}
                                  className={`${GlobalStyle.buttonCircle} ml-2`}
                                  title="Remove RTOM Area"
                                >
                                  <img
                                    src={iconImg}
                                    alt="Remove"
                                    style={{ width: 20, height: 20 }}
                                  />
                                </button>
                              )}
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
              <div className="table w-full mt-4">
                <div className="table-row">
                  <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">Add Billing Center Area</div>
                  <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                  <div className="table-cell px-2 sm:px-4 py-2">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <select
                        value={selectedRtomArea}
                        onChange={(e) => setSelectedRtomArea(e.target.value)}
                        className={`${GlobalStyle.inputText} w-full sm:w-[150px] md:w-[200px]`}
                      >
                        <option value="">Select RTOM</option>
                        {rtomAreaOptions
                          .filter(option => !rtomAreas.some(area => area.name === option.area_name))
                          .map(option => (
                            <option key={option.rtom_id} value={option.area_name}>
                              {option.area_name}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddRtomArea}
                        className={`${GlobalStyle.buttonCircle} md:ml-2 self-end md:self-auto`}
                        disabled={!selectedRtomArea}
                      >
                        <img
                          src={addIcon}
                          alt="Add"
                          style={{ width: 20, height: 20 }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-4 p-2 sm:p-4">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <label className="font-semibold mr-2 text-sm sm:text-base">Remark <span className="text-red-500">*</span></label>
              </div>
              <div className="ml-0 sm:ml-4">
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className={`${GlobalStyle.inputText} w-full h-20 sm:h-24`}
                  placeholder="Please enter a remark explaining the changes made..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end p-2 sm:p-4">
            <button className={GlobalStyle.buttonPrimary} onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-start mt-6 mb-6 px-4">
        <button
          className={GlobalStyle.buttonPrimary}
          onClick={() => setShowPopup(true)}
        >
          Log History
        </button>
      </div>

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
                  placeholder="Search log history..."
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
                  {fetchedData.log_history && fetchedData.log_history.length > 0 ? (
                    fetchedData.log_history
                      .filter(
                        (log) =>
                          log.edited_on?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                          log.action?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                          log.edited_by?.toLowerCase()?.includes(searchQuery.toLowerCase())
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

      <div className="px-4">
        <button
          onClick={() => navigate(-1)}
          className={GlobalStyle.buttonPrimary}
        >
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
}