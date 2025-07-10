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
  // Editable fields
  const [contactNo, setContactNo] = useState('');
  const [contactNoError, setContactNoError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [remark, setRemark] = useState('');
  const [drcUserStatus, setDrcUserStatus] = useState('Inactive');
  const [rtomAreas, setRtomAreas] = useState([]);
  const [selectedRtomArea, setSelectedRtomArea] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rtomAreaOptions, setRtomAreaOptions] = useState([]);
  // Track initial values for change detection
  const [initialContactNo, setInitialContactNo] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [initialDrcUserStatus, setInitialDrcUserStatus] = useState('Inactive');
  const [initialRtomAreas, setInitialRtomAreas] = useState([]);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!itemType || !itemData || (!itemData.ro_id && !itemData.drcUser_id)) {
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
        const payload = itemData.ro_id ? { ro_id: itemData.ro_id } : { drcUser_id: itemData.drcUser_id };
        setIsLoading(true);
        const response = await List_RO_Info_Own_By_RO_Id(payload);
        setIsLoading(false);

        console.log('API Response:', {
          itemType,
          ro_id: itemData.ro_id,
          drcUser_id: itemData.drcUser_id,
          drcUser_status: response.data?.drcUser_status,
          data: response.data,
        });

        if (response && response.data) {
          setFetchedData(response.data);
          setContactNo(response.data.contact_no || '');
          setInitialContactNo(response.data.contact_no || '');
          setEmail(response.data.email || '');
          setInitialEmail(response.data.email || '');
          setRemark(response.data.remark || '');
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

    // Validate email
    if (!email) {
      setEmailError('Please enter an email address.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    // Validate contact number
    if (!contactNo || !/^\+?\d{9,10}$/.test(contactNo)) {
      setContactNoError('Please enter a valid contact number (e.g., +94771234567).');
      isValid = false;
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
    }

    // Check for changes
    const hasChanges =
      contactNo !== initialContactNo ||
      email !== initialEmail ||
      drcUserStatus !== initialDrcUserStatus ||
      (itemType === 'RO' &&
        (rtomAreas.length !== initialRtomAreas.length ||
         rtomAreas.some((area, index) => 
           index >= initialRtomAreas.length || // New area added
           area.name !== initialRtomAreas[index]?.name || 
           area.status !== initialRtomAreas[index]?.status
         )));

    if (!hasChanges && remark.trim()) {
      Swal.fire({
        title: 'No Changes Detected',
        text: 'You must make at least one change to the form before adding a remark.',
        icon: 'warning',
        confirmButtonColor: "#f1c40f",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      isValid = false;
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

    if (!isValid) {
      Swal.fire({
        title: 'Required Field',
        text: 'You must make at least one change to the form and enter a remark.',
        icon: 'error',
        confirmButtonColor: "#d33",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }

    return isValid;
  };

  const handleSave = async () => {
    try {
      if (!validateInputs()) return;

      const roId = itemData?.ro_id;
      const drcUserId = itemData?.drcUser_id;
      const drcId = fetchedData?.drc_id || 1;

      if (itemType === 'RO' && !roId) {
        throw new Error('Missing ro_id for Recovery Officer.');
      }
      if (itemType === 'drcUser' && !drcUserId) {
        throw new Error('Missing drcUser_id for DRC User.');
      }

      const userPayload = await getLoggedUserId();
      const create_by = userPayload?.user_id;

      const basePayload = {
        ...(itemType === 'RO' ? { ro_id: roId } : { drcUser_id: drcUserId }),
        drc_id: drcId,
        ro_name: fetchedData?.drcUser_name || fetchedData?.recovery_officer_name || 'N/A',
        login_email: email,
        login_contact_no: contactNo,
        drcUser_status: drcUserStatus,
        create_by: create_by,
        remark: remark || 'Updated user details',
      };

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

      console.log('Sending payload:', payload);

      const response = await updateROorDRCUserDetails(payload);

      if (response.success) {
        Swal.fire({
          title: 'Success',
          text: 'User details updated successfully!',
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
        title: ' For any assistance, please contact support at support@x.ai.',
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

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h2 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}>
        {itemType === "drcUser" ? "Edit DRC User" : "Edit Recovery Officer"}
      </h2>
      <h2 className={`${GlobalStyle.headingMedium} pl-4 sm:pl-6 md:pl-10 text-lg sm:text-xl`}>
        DRC Name: {fetchedData.drc_name || 'N/A'}
      </h2>

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
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">
                  {itemType === "drcUser" ? "DRC User Name" : "Recovery Officer Name"}
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">
                  {fetchedData.drcUser_name || fetchedData.recovery_officer_name || 'N/A'}
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">NIC</div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">{fetchedData.nic || 'N/A'}</div>
              </div>
              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-bold text-sm sm:text-base">Login Method</div>
                <div className="table-cell px-1 sm:px-4 py-2"></div>
                <div className="table-cell px-2 sm:px-4 py-2"></div>
              </div>
              <div className="table-row">
                <div className="table-cell px-4 sm:px-8 py-2 font-semibold text-sm sm:text-base">
                  Contact Number 
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2">
                  <input
                    type="text"
                    value={contactNo}
                    onChange={(e) => handleContactNoChange(e.target.value)}
                    className={`${GlobalStyle.inputText} w-full sm:w-[150px] md:w-[200px] ${contactNoError ? 'border-red-500' : ''}`}
                  />
                  {contactNoError && (
                    <p className="text-red-500 text-xs mt-1">{contactNoError}</p>
                  )}
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell px-4 sm:px-8 py-2 font-semibold text-sm sm:text-base">
                  Email 
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={`${GlobalStyle.inputText} w-full sm:w-[200px] md:w-[250px] ${emailError ? 'border-red-500' : ''}`}
                  />
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
                  <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">RTOM Areas</div>
                  <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                  <div className="table-cell px-2 sm:px-4 py-2" />
                </div>
              </div>
              <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                <table className={`${GlobalStyle.table} table-auto w-full min-w-[300px]`} style={{ fontSize: '0.875rem' }}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th className={`${GlobalStyle.tableHeader} min-w-[120px]`}>RTOM Area</th>
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
                  <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">Add RTOM Area</div>
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
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end p-2 sm:p-4">
            <button className={GlobalStyle.buttonPrimary} onClick={handleSave}>
              Save
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