// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import gmailIcon from "../../assets/images/google.png";
// import { getAllActiveRTOMs } from "../../services/rtom/RtomService.js";
// import { createNewDRCUserOrRO } from "../../services/Ro/RO.js";
// import Swal from 'sweetalert2';
// import { getLoggedUserId } from "/src/services/auth/authService.js";
// import { List_DRC_Details_By_DRC_ID } from "../../services/Drc/Drc.js";

// export default function RO_ADDro() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { itemType: initialItemType, itemData } = location.state || {};

//   const [userType, setUserType] = useState(initialItemType || "RO");
//   const [contactNo, setContactNo] = useState(itemData?.contact_no || "");
//   const [email, setEmail] = useState(itemData?.email || "");
//   const [remark, setRemark] = useState(itemData?.remark || "");
//   const [status, setStatus] = useState(itemData?.status ?? true);
//   const [rtomAreas, setRtomAreas] = useState(itemData?.rtom_areas || []);
//   const [selectedRtomArea, setSelectedRtomArea] = useState("");
//   const [userDetail, setUserDetail] = useState(null);
//   const [rtomAreaOptions, setRtomAreaOptions] = useState([]);
//   const [name, setName] = useState('');
//   const [nic, setNic] = useState('');
//   const [drcName, setDrcName] = useState("");

//   const loadUser = async () => {
//     try {
//       const userDetail = await getLoggedUserId();
//       setUserDetail(userDetail);
//       console.log("User detail:", userDetail);
//     } catch (error) {
//       console.error("Error loading user:", error);
//       Swal.fire({
//         title: 'Error',
//         text: 'Failed to load user details. Please try again.',
//         icon: 'error',
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//       });
//     }
//   };

//   useEffect(() => {
//     loadUser();
//   }, []);

//   useEffect(() => {
//     if (initialItemType && itemData) {
//       setUserType(initialItemType);
//       setContactNo(itemData.contact_no || "");
//       setEmail(itemData.email || "");
//       setRemark(itemData.remark || "");
//       setStatus(itemData.status ?? true);
//       if (initialItemType === "RO") {
//         setRtomAreas(itemData.rtom_areas || []);
//       }
//     }
//   }, [initialItemType, itemData]);

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

//   const getDrcNameById = async () => {
//     try {
//       if (!userDetail?.drc_id) return;

//       const payload = { drc_id: userDetail.drc_id };
//       const response = await List_DRC_Details_By_DRC_ID(payload);

//       if (response.status === 'success') {
//         const drcNameFromApi = response.data.drc_name;
//         setDrcName(drcNameFromApi);
//         console.log("DRC Name:", drcNameFromApi);
//       } else {
//         console.error("Failed to fetch DRC name:", response.message);
//       }
//     } catch (error) {
//       console.error("Error calling DRC API:", error.message);
//     }
//   };

//   useEffect(() => {
//     if (userDetail?.drc_id) {
//       getDrcNameById();
//     }
//   }, [userDetail]);

//   const validateInputs = () => {
//     if (!name) {
//       Swal.fire({
//         title: 'Invalid Input',
//         text: 'Please enter a name.',
//         icon: 'error',
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//       });
//       return false;
//     }
//     if (!nic) {
//       Swal.fire({
//         title: 'Invalid Input',
//         text: 'Please enter a NIC.',
//         icon: 'error',
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//       });
//       return false;
//     }
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
//     if (userType === "RO" && rtomAreas.length === 0) {
//       Swal.fire({
//         title: 'Invalid Input',
//         text: 'Please add at least one RTOM area for Recovery Officer.',
//         icon: 'error',
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//       });
//       return false;
//     }
//     if (rtomAreas.length > 0) {
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

//   const handleAddRO = async () => {
//     try {
//       if (!validateInputs()) return;

//       const payload = {
//         drcUser_type: userType,
//         drc_id: userDetail?.drc_id,
//         ro_name: name,
//         nic: nic,
//         login_email: email,
//         login_contact_no: contactNo,
//         create_by: userDetail?.user_id,
//         rtoms: userType === "RO" ? rtomAreas.map((area, index) => {
//           const option = rtomAreaOptions.find(opt => opt.area_name === area.rtom_name || opt.area_name === area.name);
//           return {
//             rtom_id: option?.rtom_id || area.rtom_id,
//             rtom_name: area.rtom_name || area.name,
//             billing_center_code: area.billing_center_code || option?.billing_center_code || 'N/A',
//             rtom_status: area.status ? "Active" : "Inactive",
//             handling_type: area.handling_type || (index === 0 ? "Primary" : "Secondary")
//           };
//         }) : []
//       };

//       console.log("Sending payload:", payload);

//       const result = await createNewDRCUserOrRO(payload);

//       Swal.fire({
//         title: "Success",
//         text: `${userType} added successfully and sent for approval!`,
//         icon: "success",
//         timer: 1500,
//         showConfirmButton: false,
//       });
//       navigate(-1);
//     } catch (error) {
//       console.error("Error adding RO:", error);
//       Swal.fire({
//         title: "Error",
//         text: error.message || "Something went wrong. Please try again.",
//         icon: "error",
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//       });
//     }
//   };

//   const handleAddRtomArea = () => {
//     if (selectedRtomArea && !rtomAreas.some(area => area.name === selectedRtomArea)) {
//       const selectedOption = rtomAreaOptions.find(opt => opt.area_name === selectedRtomArea);
//       setRtomAreas([...rtomAreas, {
//         rtom_id: selectedOption.rtom_id,
//         name: selectedRtomArea,
//         status: true,
//         isNew: true,
//         billing_center_code: selectedOption?.billing_center_code || 'N/A',
//         handling_type: rtomAreas.length === 0 ? 'Primary' : 'Secondary',
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

//   console.log("selected rtoms are: ", rtomAreas);

//   return (
//     <div className={GlobalStyle.fontPoppins}>
//       <h2 className={GlobalStyle.headingLarge}>
//         {userType === "RO" ? "Register Recovery Officer" : "Register DRC User"}
//       </h2>
//       <h2 className={`${GlobalStyle.headingMedium} pl-10`}>
//         DRC Name: {drcName || 'N/A'}
//       </h2>

//       <div className="flex gap-4 mt-4 justify-center">
//         <div className={`${GlobalStyle.cardContainer} relative`}>
//           <div className="table">
//             <div className="table-row">
//               <div className="table-cell px-4 py-2 font-semibold">
//                 User Type
//               </div>
//               <div className="table-cell px-4 py-2 font-semibold">:</div>
//               <div className="table-cell px-4 py-2">
//                 <select
//                   className={GlobalStyle.selectBox}
//                   value={userType}
//                   onChange={(e) => setUserType(e.target.value)}
//                 >
//                   <option value="RO">RO</option>
//                   <option value="drcUser">DRC User</option>
//                 </select>
//               </div>
//             </div>

//             <div className="table-row">
//               <div className="table-cell px-4 py-2 font-semibold">
//                 {userType === "drcUser"
//                   ? "DRC User Name"
//                   : "Recovery Officer Name"}
//               </div>
//               <div className="table-cell px-4 py-2 font-semibold">:</div>
//               <div className="table-cell px-4 py-2">
//                 <input
//                   type="text"
//                   className={`${GlobalStyle.inputText} w-[150px]`}
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="table-row">
//               <div className="table-cell px-4 py-2 font-semibold">
//                 {userType === "drcUser" ? "DRC Coordinator NIC" : "RO NIC"}
//               </div>
//               <div className="table-cell px-4 py-2 font-semibold">:</div>
//               <div className="table-cell px-4 py-2">
//                 <input
//                   type="text"
//                   className={`${GlobalStyle.inputText} w-[150px]`}
//                   value={nic}
//                   onChange={(e) => setNic(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="table-row">
//               <div className="table-cell px-4 py-2 font-bold">Login method</div>
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

//           {userType === "RO" && (
//             <>
//               <br />
//               <div className="table-row">
//                 <div className="table-cell px-4 py-2 font-semibold">
//                   RTOM Area
//                 </div>
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
//             </>
//           )}

//           <div className="flex justify-end p-4">
//             <button className={GlobalStyle.buttonPrimary} onClick={handleAddRO}>
//               {userType === "RO" ? "Add RO" : "Add DRC User"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// After Responsive
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft } from "react-icons/fa";
import { getAllActiveRTOMs } from "../../services/rtom/RtomService.js";
import { createNewDRCUserOrRO } from "../../services/Ro/RO.js";
import Swal from 'sweetalert2';
import { getLoggedUserId } from "/src/services/auth/authService.js";
import { List_DRC_Details_By_DRC_ID } from "../../services/Drc/Drc.js";

export default function RO_ADDro() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemType: initialItemType, itemData, from } = location.state || {};

  const [userType, setUserType] = useState(() => {
    if (initialItemType) return initialItemType;
    if (from === "drcUser") return "drcUser";
    if (from === "RO") return "RO";
    return "drcUser";
  });

  const [contactNo, setContactNo] = useState(itemData?.contact_no || "");
  const [contactError, setContactError] = useState("");
  const [email, setEmail] = useState(itemData?.email || "");
  const [emailError, setEmailError] = useState("");
  const [remark, setRemark] = useState(itemData?.remark || "");
  const [status, setStatus] = useState(itemData?.status ?? true);
  const [rtomAreas, setRtomAreas] = useState(itemData?.rtom_areas || []);
  const [selectedRtomArea, setSelectedRtomArea] = useState("");
  const [userDetail, setUserDetail] = useState(null);
  const [rtomAreaOptions, setRtomAreaOptions] = useState([]);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [nic, setNic] = useState('');
  const [nicError, setNicError] = useState('');
  const [drcName, setDrcName] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userDetail = await getLoggedUserId();
        setUserDetail(userDetail);
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to load user details. Please try again.',
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (initialItemType && itemData) {
      setUserType(initialItemType);
      setContactNo(itemData.contact_no || "");
      setEmail(itemData.email || "");
      setRemark(itemData.remark || "");
      setStatus(itemData.status ?? true);
      if (initialItemType === "RO") {
        setRtomAreas(itemData.rtom_areas || []);
      }
    }
  }, [initialItemType, itemData]);

  useEffect(() => {
    const fetchRTOMs = async () => {
      try {
        const fetchedRTOMs = await getAllActiveRTOMs();
        setRtomAreaOptions(fetchedRTOMs);
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch RTOM areas. Please try again later.',
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    };
    fetchRTOMs();
  }, []);

  useEffect(() => {
    const getDrcNameById = async () => {
      try {
        if (!userDetail?.drc_id) return;
        const response = await List_DRC_Details_By_DRC_ID({ drc_id: userDetail.drc_id });
        if (response.status === 'success') {
          setDrcName(response.data.drc_name);
        }
      } catch (error) {
        console.error("Error getting DRC name:", error);
      }
    };
    if (userDetail?.drc_id) getDrcNameById();
  }, [userDetail]);

  const validateInputs = () => {
    let isValid = true;

    if (!name) {
      setNameError('Please enter a name.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!nic) {
      setNicError('Please enter a NIC.');
      isValid = false;
    } else if (nic.length !== 12) {
      setNicError('NIC must be exactly 12 characters.');
      isValid = false;
    } else {
      setNicError('');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!contactNo) {
      setContactError('Please enter a contact number.');
      isValid = false;
    } else if (contactNo.length !== 10) {
      setContactError('Contact number must be 10 digits.');
      isValid = false;
    } else {
      setContactError('');
    }

    if (userType === "RO" && rtomAreas.length === 0) {
      Swal.fire({
        title: 'Invalid Input',
        text: 'Please add at least one RTOM area for Recovery Officer.',
        icon: 'error',
      });
      isValid = false;
    }

    return isValid;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setNameError(value ? '' : 'Please enter a name.');
  };

  const handleNicChange = (e) => {
    const value = e.target.value;
    if (value.length <= 12) {
      setNic(value);
      setNicError(value ? (value.length !== 12 ? 'NIC must be exactly 12 characters.' : '') : 'Please enter a NIC.');
    } else {
      setNicError('NIC cannot exceed 12 characters.');
    }
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setContactNo(value);
      setContactError(value ? (value.length !== 10 ? 'Contact number must be 10 digits.' : '') : 'Please enter a contact number.');
    } else {
      setContactError('Contact number cannot exceed 10 digits.');
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.');
  };

  const handleAddRO = async () => {
    if (!validateInputs()) return;

    const payload = {
      drcUser_type: userType,
      drc_id: userDetail?.drc_id,
      ro_name: name,
      nic: nic,
      login_email: email,
      login_contact_no: contactNo,
      create_by: userDetail?.user_id,
      rtoms: userType === "RO" ? rtomAreas.map((area, index) => {
        const option = rtomAreaOptions.find(opt => opt.area_name === area.rtom_name || opt.area_name === area.name);
        return {
          rtom_id: option?.rtom_id || area.rtom_id,
          rtom_name: area.rtom_name || area.name,
          billing_center_code: area.billing_center_code || option?.billing_center_code || 'N/A',
          rtom_status: area.status ? "Active" : "Inactive",
          handling_type: area.handling_type || (index === 0 ? "Primary" : "Secondary")
        };
      }) : []
    };

    try {
      await createNewDRCUserOrRO(payload);
      Swal.fire({
        title: "Success",
        text: `${userType === "RO" ? "Recovery Officer" : "DRC User"} added successfully and sent for approval!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate(-1);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong. Please try again.",
        icon: "error",
      });
    }
  };

  // RTOM handlers
  const handleAddRtomArea = () => {
    if (selectedRtomArea && !rtomAreas.some(area => area.name === selectedRtomArea)) {
      const selectedOption = rtomAreaOptions.find(opt => opt.area_name === selectedRtomArea);
      setRtomAreas([...rtomAreas, {
        rtom_id: selectedOption.rtom_id,
        name: selectedRtomArea,
        status: true,
        isNew: true,
        billing_center_code: selectedOption?.billing_center_code || 'N/A',
        handling_type: rtomAreas.length === 0 ? 'Primary' : 'Secondary',
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
        setRtomAreas(newRtomAreas);
        Swal.fire({
          title: 'Removed',
          text: 'RTOM area has been removed successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };
  return (
    <div className={GlobalStyle.fontPoppins}>
      <h2 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}>
        {userType === "RO" ? "Register Recovery Officer" : "Register DRC User"}
      </h2>
      <h2 className={`${GlobalStyle.headingMedium} pl-4 sm:pl-6 md:pl-10 text-lg sm:text-xl`}>
        DRC Name: {drcName || 'N/A'}
      </h2>

      <div className="flex flex-col lg:flex-row gap-4 mt-4 justify-center px-4">
        <div className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl`}>
          <div className="overflow-x-auto">
            <div className="table w-full min-w-[300px]">
              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">
                  User Type
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2">
                  <select
                    className={`${GlobalStyle.selectBox} w-full sm:w-[150px] md:w-[200px]`}
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="drcUser">DRC User</option>
                    <option value="RO">RO</option>
                  </select>
                </div>
              </div>

              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">
                 {userType === "drcUser" ? "DRC User Name" : "Recovery Officer Name"}   <span className="text-red-500">*</span>
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2">
                  <input
                    type="text"
                    className={`${GlobalStyle.inputText} w-full sm:w-[150px] md:w-[200px] ${nameError ? 'border-red-500' : ''}`}
                    value={name}
                    onChange={handleNameChange}
                  />
                  {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                </div>
              </div>

              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">
                 {userType === "drcUser" ? "DRC Coordinator NIC" : "RO NIC"}   <span className="text-red-500">*</span>
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2">
                  <input
                    type="text"
                    className={`${GlobalStyle.inputText} w-full sm:w-[150px] md:w-[200px] ${nicError ? 'border-red-500' : ''}`}
                    value={nic}
                    onChange={handleNicChange}
                    maxLength={12}
                  />
                  {nicError && <p className="text-red-500 text-xs mt-1">{nicError}</p>}
                </div>
              </div>

              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-bold text-sm sm:text-base">Login method</div>
                <div className="table-cell px-1 sm:px-4 py-2"></div>
                <div className="table-cell px-2 sm:px-4 py-2"></div>
              </div>

              <div className="table-row">
                <div className="table-cell px-6 sm:px-12 py-2 font-semibold text-sm sm:text-base">
              Contact Number     <span className="text-red-500">*</span>
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2">
                  <input
                    type="text"
                    className={`${GlobalStyle.inputText} w-full sm:w-[150px] md:w-[200px] ${contactError ? 'border-red-500' : ''}`}
                    value={contactNo}
                    onChange={handleContactChange}
                   
                  />
                  {contactError && <p className="text-red-500 text-xs mt-1">{contactError}</p>}
                </div>
              </div>

              <div className="table-row">
                <div className="table-cell px-6 sm:px-12 py-2 font-semibold text-sm sm:text-base">
                   Email
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2">
                  <input
                    type="email"
                    className={`${GlobalStyle.inputText} w-full sm:w-[200px] md:w-[250px] ${emailError ? 'border-red-500' : ''}`}
                    value={email}
                    onChange={handleEmailChange}
                   
                  />
                  {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>
              </div>
            </div>
          </div>

          {userType === "RO" && (
            <>
              <div className="table w-full mt-4">
                <div className="table-row">
                  <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">
                    RTOM Area
                  </div>
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
                        onClick={handleAddRtomArea}
                        className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
                        disabled={!selectedRtomArea}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${GlobalStyle.tableContainer} overflow-x-auto mt-4`}>
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
                          className={`${index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"} border-b`}
                        >
                          <td className={`${GlobalStyle.tableData} text-center`}>{area.name}</td>
                          <td className={`${GlobalStyle.tableData} text-center`}>
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                             
                              {area.isNew && (
                                <button
                                  onClick={() => handleRemoveRtomArea(index)}
                                  className={`${GlobalStyle.buttonPrimary} bg-red-500 hover:bg-red-600 w-8 h-6 sm:w-10 sm:h-8 flex items-center justify-center text-xs sm:text-sm`}
                                  title="Remove RTOM Area"
                                >
                                  -
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
            </>
          )}

          <div className="flex justify-end p-2 sm:p-4">
            <button className={GlobalStyle.buttonPrimary} onClick={handleAddRO}>
              {userType === "RO" ? "Add RO" : "Add DRC User"}
            </button>
          </div>
        </div>
      </div>
      <div className="px-4">
        <button onClick={() => navigate(-1)} className={GlobalStyle.buttonPrimary}>
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
}
