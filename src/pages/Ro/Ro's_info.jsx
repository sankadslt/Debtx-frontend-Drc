import { useEffect, useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import edit from "../../assets/images/edit-info.svg";
import google from "../../assets/images/google.png";
import add from "../../assets/images/add.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { fetchROInfoByROId, Update_RO_Details_With_RTOM } from "../../services/Ro/Ro_services";
import { getLoggedUserId } from "../../services/auth/authService";
import { getActiveRTOMsByDRCID } from "../../services/rtom/RtomService";
import Swal from "sweetalert2";


const RoInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ro_id = location.state?.roId;

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 15;

  const [accountDetails, setAccountDetails] = useState("");
  const [loginMethod, setLoginMethod] = useState("");
  const [selectedRtom, setSelectedRtom] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [remark, setRemark] = useState("");
  const [editRemark, setEditRemark] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [showEndSection, setShowEndSection] = useState(false);
  const [showLogHistory, setShowLogHistory] = useState(false);

  const [formData, setFormData] = useState({
    addedDate: "",
    officerName: "",
    nic: "",
    contactNo: "",
    email: "",
    rtomAreas: [],
  });
  
  // CHANGED: Added state for log history data
  const [logHistoryData, setLogHistoryData] = useState([]);

  const [userData, setUserData] = useState(null);
  const [activeRtoms, setActiveRtoms] = useState([]);

  // get looged drc id
  const loadUser = async () => {
    try {
      const user = await getLoggedUserId();
      setUserData(user);
      console.log("User data:", user);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const goBack = () => {
    navigate(-1); 
  };

  useEffect(() => {
    loadUser();
  }, []);

  const drc_id = userData?.drc_id;

  useEffect(() => {
    if (!drc_id) return;

    const fetchRtoms =async () => {
      try {
        const data =await getActiveRTOMsByDRCID(drc_id);
        console.log("Active RTOms: ", data);

        setActiveRtoms(data);
      } catch (error) {
        console.error("Error fetching Active RTOMs:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch Active RTOMs. Please try again later.",
        });
      }
      
    }

    fetchRtoms();
  }, [drc_id])
  

  useEffect(() => {
    const getROInfo = async () => {
      try {
        const data = await fetchROInfoByROId(ro_id);
        console.log("recovery office info: ", data);
        
        setFormData({
          addedDate: data?.added_date || "",
          officerName: data?.recovery_officer_name || "",
          nic: data?.nic || "",
          contactNo: data?.contact_no || "",
          email: data?.email || "",
          rtomAreas: data?.rtom_areas || [],
          remark: data?.remark || "",
          remark_by: data?.remark_by || "",
          remark_date: data?.remark_date || "",
        });

        // CHANGED: Set log history data from API response
        if (data?.remark && Array.isArray(data.remark)) {
          const formattedLogHistory = data.remark.map(remarkItem => ({
            editedOn: remarkItem.edited_on? new Date(remarkItem.edited_on).toLocaleDateString('en-GB') : "N/A",
            action: remarkItem.action || "No action specified",
            editedBy: remarkItem.edited_by || "Unknown"
          }));
          setLogHistoryData(formattedLogHistory);
        }

      } catch (err) {
        console.error("Error fetching Recovery Officer info:", err);
      }
    };

    getROInfo();
  }, [ro_id]);


  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle input changes for edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login method change
  const handleMethodChange = (method) => {
    setLoginMethod(method);
    setAccountDetails("");
  };

  // // Handle save
  // const handleSave = () => {
  //   toggleEdit();
  // };

  // const handleSave = async () => {
  //   try {
  //     if (!editRemark.trim()) {
  //       alert("Please provide a remark for the changes made.");
  //       return;
  //     }
  
  //     console.log("Edit mode RTOM areas before save:", editModeRtomAreas);
  
  //     // FIXED: Ensure rtom_name is properly included in the request
  //     const updateData = {
  //       ro_id: ro_id,
  //       ro_login_contact_no: formData.contactNo,
  //       ro_login_email: formData.email,
  //       rtom_areas: editModeRtomAreas.map(area => ({
  //         rtom_id: area.rtom_id,
  //         rtom_name: area.rtom_name, // FIXED: Ensure rtom_name is included
  //         status: area.active,
  //         name: area.rtom_name // Include both for compatibility
  //       })),
  //       remark: editRemark.trim(),
  //       edited_by: userData?.name || userData?.username || "Unknown User",
  //       edited_on: new Date().toISOString(),
  //       recovery_officer_name: formData.officerName
  //     };
  
  //     console.log("Sending update data:", updateData);
  //     console.log("RTOM Areas being sent:", updateData.rtom_areas);
  
  //     const response = await Update_RO_Details_With_RTOM(updateData);
  //     console.log("Update response:", response);
      
  //     // FIXED: Update form data immediately with the data we just sent
  //     const updatedRtomAreas = editModeRtomAreas.map(area => ({
  //       rtom_name: area.rtom_name, // FIXED: Preserve rtom_name
  //       status: area.active,
  //       rtom_id: area.rtom_id,
  //       rtom_status: area.active ? 'Active' : 'Inactive'
  //     }));
      
  //     setFormData(prev => ({
  //       ...prev,
  //       rtomAreas: updatedRtomAreas
  //     }));
  
  //     const newLogEntry = {
  //       editedOn: new Date().toLocaleDateString('en-GB'),
  //       action: editRemark.trim(),
  //       editedBy: userData?.name || userData?.username || formData.officerName
  //     };
      
  //     setLogHistoryData(prev => [newLogEntry, ...prev]);
  
  //     setIsEditing(false);
  //     setEditRemark("");
      
  //     alert("Recovery Officer details updated successfully!");
      
  //     // FIXED: Refresh data after a longer delay and with better error handling
  //     setTimeout(async () => {
  //       try {
  //         console.log("Refreshing data after save...");
  //         const refreshedData = await fetchROInfoByROId(ro_id);
  //         console.log("Refreshed data:", refreshedData);
          
  //         let refreshedRtomAreas = [];
  //         if (refreshedData?.rtom && Array.isArray(refreshedData.rtom)) {
  //           refreshedRtomAreas = refreshedData.rtom.map(area => {
  //             console.log("Refreshed area:", area);
  //             return {
  //               rtom_name: area.rtom_name || area.area_name || area.name || `Area_${area.rtom_id}` || 'Unknown Area',
  //               rtom_status: area.rtom_status || (area.status === true ? 'Active' : 'Inactive'),
  //               status: area.rtom_status === 'Active' || area.status === true,
  //               rtom_id: area.rtom_id || area.key || null
  //             };
  //           });
  //         }
          
  //         console.log("Final refreshed RTOM areas:", refreshedRtomAreas);
          
  //         setFormData(prev => ({
  //           ...prev,
  //           rtomAreas: refreshedRtomAreas
  //         }));
          
  //       } catch (error) {
  //         console.error("Error refreshing data after save:", error);
  //         // If refresh fails, keep the data we already set
  //         console.log("Using locally updated data due to refresh error");
  //       }
  //     }, 3000); // FIXED: Increased to 3 seconds for better DB consistency
      
  //   } catch (error) {
  //     console.error("Error updating RO details:", error);
  //     alert("Error updating Recovery Officer details. Please try again.");
  //   }
  // };

  const handleSave = async () => {
    // Basic validation
    if (!ro_id || !formData.officerName || !formData.contactNo) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields.",
      });
      return;
    }

    if (!editRemark) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Remark is required.",
      });
      return;
    }

    // // Optional email validation
    // if (formData.email && !isValidEmail(formData.email)) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Invalid Email",
    //     text: "Please enter a valid email address.",
    //   });
    //   return;
    // }

    // // Phone number validation
    // if (!isValidPhoneNumber(formData.contact_no)) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Invalid Contact Number",
    //     text: "Please enter a valid contact number.",
    //   });
    //   return;
    // }

    // addedDate: data?.added_date || "",
    // officerName: data?.recovery_officer_name || "",
    // nic: data?.nic || "",
    // contactNo: data?.contact_no || "",
    // email: data?.email || "",
    // rtomAreas: data?.rtom_areas || [],
    // remark: data?.remark || "",
    // remark_by: data?.remark_by || "",
    // remark_date: data?.remark_date || "",

    const updatePayload = {
      ro_id: ro_id,
      recovery_officer_name: formData.officerName,
      ro_login_email: formData.email || null,
      ro_login_contact_no: formData.contactNo,
      edited_by: userData.user_id,
      edited_on: new Date().toISOString(),
      remark: editRemark.trim(),
      rtom_areas: formData.rtomAreas || [], // Expecting array of { id, name, status }
    };

    try {
      console.log("Sent Payload: ", updatePayload);
      const response = await Update_RO_Details_With_RTOM(updatePayload);
      
      const newLogEntry = {
        editedOn: new Date().toLocaleDateString('en-GB'),
        action: editRemark.trim(),
        editedBy: userData?.user_id
      };

      setLogHistoryData(prev => [newLogEntry, ...prev]);

      setIsEditing(false);
      setEditRemark("");

      console.log("Update Success:", response);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Recovery Officer details updated successfully!",
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.message || "Something went wrong. Please try again.",
      });
    }
  };


  // // Add selected RTOM to the table
  // const addRtomArea = () => {
  //   if (selectedRtom && !activeRtoms.some((item) => item.RTOMArea === selectedRtom)) {
  //     setActiveRtoms([...activeRtoms, { RTOMArea: selectedRtom, active: false }]);
  //     setSelectedRtom(""); // Reset dropdown
  //   }
  // };

  // const addRtomArea = () => {
  //   // Check if a selection was made and it's not already in the list
  //   if (
  //     selectedRtom &&
  //     !formData.rtomAreas.some((item) => item.name === selectedRtom)
  //   ) {
  //     const updatedRTOMs = [
  //       ...formData.rtomAreas,
  //       { name: selectedRtom, status: true },
  //     ];

  //     setFormData((prev) => ({
  //       ...prev,
  //       rtomAreas: updatedRTOMs,
  //     }));

  //     setSelectedRtom(""); // Reset dropdown
  //   }
  // };

  const addRtomArea = () => {
    const selected = activeRtoms.find((rtom) => rtom.rtom_id == selectedRtom); // use == in case types differ

    if (
      selected &&
      !formData.rtomAreas.some((item) => item.id == selected.rtom_id)
    ) {
      const updatedRTOMs = [
        ...formData.rtomAreas,
        {
          id: selected.rtom_id,
          name: selected.area_name,
          status: true,
        },
      ];

      setFormData((prev) => ({
        ...prev,
        rtomAreas: updatedRTOMs,
      }));

      setSelectedRtom("");
    }
  };



  // Paginate data
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = formData.rtomAreas.slice(startIndex, endIndex);

  // Toggle the active state for a specific row
  const toggleService = (index) => {
    const updatedAreas = [...formData.rtomAreas];
    updatedAreas[index].status = !updatedAreas[index].status;

    setFormData((prev) => ({
      ...prev,
      rtomAreas: updatedAreas,
    }));
    console.log("Updated Form Data:", formData);
    
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className={`${GlobalStyle.headingLarge} mb-8`}>
        <span>Recovery Officer</span>
      </div>

      {/* Card box */}
      <div className="flex justify-center">
        <div className={`${GlobalStyle.cardContainer} p-4`}>
          {/* Edit Mode UI */}
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-end items-center mb-4">
                <div className="flex items-center">
                  {/* Active or Inactive RO */}
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isActive}
                      onChange={() => setIsActive(!isActive)}
                    />
                    <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>

              {/* Edit Table */}
              <table className="mb-8 w-full ">
                <tbody>
                  <tr>
                    <td>
                      <label className={`${GlobalStyle.headingMedium} `}>
                        Added Date
                      </label>
                    </td>
                    <td className="text-center align-middle">:</td>
                    <td>
                      <label className={`${GlobalStyle.headingSmall}`}>
                        {formData.addedDate}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className={`${GlobalStyle.headingMedium}`}>
                        Recovery Officer Name
                      </label>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={`${GlobalStyle.headingSmall}`}>
                        {formData.officerName}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className={`${GlobalStyle.headingMedium}`}>
                        NIC
                      </label>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={`${GlobalStyle.headingSmall}`}>
                        {formData.nic}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className={`${GlobalStyle.headingMedium}`}>
                        Login Method
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className={`${GlobalStyle.headingMedium}`}>
                        Contact No
                      </label>
                    </td>
                    <td>:</td>
                    <td>
                      <input
                        type="text"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleInputChange}
                        placeholder="Enter contact number"
                        className={`${GlobalStyle.inputText} `}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className={`${GlobalStyle.headingMedium}`}>
                        <img src={google} alt="Google" className="w-6 h-6" />
                      </label>
                    </td>
                    <td>:</td>
                    <td>
                      <input
                        type="text"
                        name="email"

                        value={formData.email}

                        onChange={handleInputChange}
                        placeholder="Enter email"
                        className={`${GlobalStyle.inputText} `}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className={`${GlobalStyle.headingMedium}`}>
                        RTOM Areas
                      </label>
                    </td>
                    <td>:</td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <div className="mt-4">
                        {/* Active or Inactive RTOM Areas */}
                        <table className={GlobalStyle.table}>
                          <thead className={GlobalStyle.thead}>
                            <tr>
                              <th
                                scope="col"
                                className={GlobalStyle.tableHeader}
                              >
                                RTOM Area
                              </th>
                              <th
                                scope="col"
                                className={GlobalStyle.tableHeader}
                              ></th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedData.map((row, index) => (
                              <tr
                                key={index}
                                className={`${
                                  index % 2 === 0
                                    ? "bg-white bg-opacity-75"
                                    : "bg-gray-50 bg-opacity-50"
                                } border-b`}
                              >
                                <td
                                  className={`${GlobalStyle.tableData} flex justify-center items-center`}
                                >
                                  <a
                                    href={`#${row.name}`}
                                    className="hover:underline"
                                  >
                                    {row.name}
                                  </a>
                                </td>
                                <td className={GlobalStyle.tableData}>
                                  <div className="flex justify-center items-center">
                                    <label className="inline-flex relative items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={row.status}
                                        onChange={() => toggleService(index)}
                                      />
                                      <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr className="h-4"></tr>

                  {/* RTOM Area Dropdown */}
                  <tr>
                    <td>
                      <label className={`${GlobalStyle.headingMedium}`}>
                        RTOM Area
                      </label>
                    </td>
                    <td>:</td>
                    <td className="flex items-center space-x-2">
                      <select
                        className={`${GlobalStyle.selectBox} `}
                        value={selectedRtom}
                        onChange={(e) => setSelectedRtom(e.target.value)}
                      >
                        <option value="">Select RTOM Area</option>
                        {activeRtoms.map((rtom, index) => (
                          <option key={index} value={rtom.rtom_id}>
                            {rtom.area_name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="bg-white rounded-full p-1 border border-gray-300"
                        onClick={addRtomArea}
                        title="Add RTOM Area"
                        disabled={!selectedRtom}
                      >
                        <img src={add} alt="Add" className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                  
                  <tr className="h-4"></tr>
                  <tr>
                    <td>
                      <label className={`${GlobalStyle.headingMedium}`}>
                        Remark <span className="text-red-500">*</span>
                      </label>
                    </td>
                    <td>:</td>
                    <td>
                      <textarea
                        value={editRemark}
                        onChange={(e) => setEditRemark(e.target.value)}
                        placeholder="Enter remark describing the changes made "
                        className={`${GlobalStyle.inputText} h-20 resize-none`}
                        required
                      />
                    </td>
                  </tr>

                </tbody>
              </table>

              {/* Save button in edit mode */}
              <div className="flex justify-end mt-auto">
                <button
                  onClick={handleSave}
                  className={GlobalStyle.buttonPrimary}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* View Mode UI */}
              {/* Edit icon */}
              <div className="flex justify-end">
                <img
                  src={edit}
                  alt="Edit"
                  className="w-8 h-8 mb-4 cursor-pointer"
                  onClick={toggleEdit}
                  title="Edit"
                />
              </div>

              {/* card box*/}
              <table className="mb-8 w-full ">
                <tbody>
                  <tr>
                    <td>
                      <p className="mb-2">Added Date</p>
                    </td>
                    <td className="text-center align-middle">:</td>
                    <td>
                      <label className={`${GlobalStyle.headingSmall}`}>
                        {formData.addedDate}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="mb-2">Recovery Officer Name</p>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={`${GlobalStyle.headingSmall}`}>
                        {formData.officerName}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="mb-2">NIC</p>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={`${GlobalStyle.headingSmall}`}>
                        {formData.nic}
                      </label>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <label
                        className={`${GlobalStyle.headingMedium} font-medium`}
                      >
                        Login Method
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td className="pl-8">
                      <p className="mb-2">Contact Number</p>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={`${GlobalStyle.headingSmall}`}>
                        {formData.contactNo}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td className="pl-8">
                      <p className="mb-2">
                        <img src={google} alt="Google" className="w-6 h-6" />
                      </p>
                    </td>
                    <td>:</td>
                    <td>
                      <label className={`${GlobalStyle.headingSmall}`}>
                        {formData.email}
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="mb-2">
                        <strong>RTOM Areas</strong>
                      </p>
                    </td>
                    <td>:</td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <div className="mt-4">
                        {/* RTOM Area Table */}
                        <table className={GlobalStyle.table}>
                          <thead className={GlobalStyle.thead}>
                            <tr>
                              <th
                                scope="col"
                                className={GlobalStyle.tableHeader}
                              >
                                RTOM Area
                              </th>
                              <th
                                scope="col"
                                className={GlobalStyle.tableHeader}
                              ></th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.rtomAreas.length > 0 ? (
                              formData.rtomAreas.map((area, index) => (
                                <tr
                                  key={index}
                                  className={`${
                                    index % 2 === 0
                                      ? "bg-white bg-opacity-75"
                                      : "bg-gray-50 bg-opacity-50"
                                  } border-b`}
                                >
                                  <td
                                    className={`${GlobalStyle.tableData} flex justify-center items-center`}
                                  >
                                    {/* Change from row.RTOMArea to area.name */}
                                    <span>{area.name}</span>
                                  </td>
                                  <td className={GlobalStyle.tableData}>
                                    <div className="flex justify-center items-center">
                                      <label className="inline-flex relative items-center cursor-pointer">
                                        {/* Change from row.active to area.status */}
                                        <input
                                          type="checkbox"
                                          className="sr-only peer"
                                          checked={area.status}
                                          readOnly
                                          disabled
                                        />
                                        <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              // Adjust colSpan from 6 to 2 because you only have 2 columns here
                              <tr>
                                <td colSpan="2" className="text-center py-4">
                                  No results found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* button */}
      <div className="flex justify-end pr-40 mt-4">
        {!isEditing && !showEndSection && (
          <button
            className={GlobalStyle.buttonPrimary}
            onClick={() => setShowEndSection(true)}
          >
            End
          </button>
        )}
      </div>

      {/* End Date and Remark Section */}
      {showEndSection && (
        <div className="flex justify-center mt-4">
          <div className={`${GlobalStyle.cardContainer}  p-4 w-full max-w-2xl`}>
            <div className="space-y-4">
              <div className="flex items-start">
                <label className={`${GlobalStyle.headingMedium} `}>
                  End date
                </label>
                <span className="mx-2">:</span>

                <div className={GlobalStyle.datePickerContainer}>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/MM/yyyy"
                    className={GlobalStyle.inputText}
                  />
                </div>
              </div>

              <div className="flex items-start">
                <label className={`${GlobalStyle.headingMedium} `}>
                  Remark
                </label>
                <span className="mx-2">:</span>
                <textarea
                  className={`${GlobalStyle.inputText} flex-1 h-40`}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => {
                    setShowEndSection(false);
                  }}
                  className={GlobalStyle.buttonPrimary}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log History button */}
      <div className="flex gap-4 pl-20">
        <button
          className={GlobalStyle.buttonPrimary}
          onClick={() => setShowLogHistory(!showLogHistory)}
        >
          Log History
        </button>
      </div>
      <div style={{ marginTop: '12px' }}>
              <button className={GlobalStyle.navButton} onClick={goBack}>
                <FaArrowLeft />  Back
              </button>
           
      </div>

      {/* Log History Section */}
      {showLogHistory && (
        <div className="flex justify-center mt-4">
          <div className={`${GlobalStyle.cardContainer} p-4 w-full max-w-4xl`}>
            <table className={`${GlobalStyle.table}`}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Edited On
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Action
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Edited By
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* CHANGED: Using logHistoryData state instead of hardcoded data */}
                {logHistoryData.length > 0 ? (
                  logHistoryData.map((log, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-white bg-opacity-75"
                          : "bg-gray-50 bg-opacity-50"
                      } border-b`}
                    >
                      <td className={GlobalStyle.tableData}>{log.editedOn}</td>
                      <td className={GlobalStyle.tableData}>{log.action}</td>
                      <td className={GlobalStyle.tableData}>{log.editedBy}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No log history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
          </div>
          
        </div>
        
      )}
      
    </div>
    
  );
};

export default RoInfo;