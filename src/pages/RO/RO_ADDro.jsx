import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import gmailIcon from "../../assets/images/google.png";
import { getAllActiveRTOMs } from "../../services/rtom/RtomService.js";
import Swal from 'sweetalert2';
import { getLoggedUserId } from "../../services/auth/authService.js";

export default function RO_ADDro() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemType: initialItemType, itemData } = location.state || {};

  const [userType, setUserType] = useState(initialItemType || "RO");
  const [contactNo, setContactNo] = useState(itemData?.contact_no || "");
  const [email, setEmail] = useState(itemData?.email || "");
  const [remark, setRemark] = useState(itemData?.remark || "");
  const [status, setStatus] = useState(itemData?.status ?? true);
  const [rtomAreas, setRtomAreas] = useState(itemData?.rtom_areas || []);
  const [selectedRtomArea, setSelectedRtomArea] = useState("");
  const [userData, setUserData] = useState(null);
  const [rtomAreaOptions, setRtomAreaOptions] = useState([]);
  const [name, setName] = useState('');
  const [nic, setNic] = useState('');
  const [userDetail, setUserDetail] = useState(null);


    const loadUser = async () => {
          const user = await getLoggedUserId();
          setUserDetail(user);
          console.log("User detail:", userDetail);
      };
  
      useEffect(() => {
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
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    };

    fetchRTOMs();
  }, []);

  const validateInputs = () => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Swal.fire({
          title: 'Invalid Input',
          text: 'Please enter a valid email address.',
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        return false;
      }
      if (!contactNo || !/^\+?\d{9,12}$/.test(contactNo)) {
        Swal.fire({
          title: 'Invalid Input',
          text: 'Please enter a valid contact number (e.g., +94771234567).',
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        return false;
      }
      
      if (rtomAreas.length > 0) {
        const invalidRtom = rtomAreas.find(area => !rtomAreaOptions.some(opt => opt.area_name === area.name));
        if (invalidRtom) {
          Swal.fire({
            title: 'Invalid RTOM',
            text: `RTOM area "${invalidRtom.name}" is not valid.`,
            icon: 'error',
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          return false;
        }
      }
      return true;
    };


const handleAddRO = async () => {
  try {
    if (!validateInputs()) return;

    const drcId = 1;

    const payload = {
      drcUser_type: userType,
      drc_id: drcId,
      ro_name: userType || 'N/A',
      nic: nic || '',
      login_email: email,
      login_contact_no: contactNo,
      create_by: "admin_user",
      rtoms: rtomAreas.map((area, index) => {
        const option = rtomAreaOptions.find(opt => opt.area_name === area.rtom_name || opt.area_name === area.name);
        return {
          rtom_id: option?.rtom_id || area.rtom_id,
          rtom_name: area.rtom_name || area.name,
          billing_center_code: area.billing_center_code || option?.billing_center_code || 'N/A',
          rtom_status: area.status ? "Active" : "Inactive",
          handling_type: area.handling_type || (index === 0 ? "Primary" : "Secondary")
        };
      })
    };

    console.log("Sending payload:", payload);

    const response = await fetch("http://localhost:5000/api/recovery_officer/Create_New_DRCUser_or_RO", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      Swal.fire({
        title: "Success",
        text: "Recovery Officer added successfully!",
        icon: "success"
      });
      navigate(-1);
    } else {
      throw new Error(result.message || "Failed to add Recovery Officer.");
    }

  } catch (error) {
    console.error("Error adding RO:", error);
    Swal.fire({
      title: "Error",
      text: error.message || "Something went wrong. Please try again.",
      icon: "error"
    });
  }
};


  /*  const handleSave = () => {
     const updatedData = {
       ...itemData,
       contact_no: contactNo,
       email: email,
       remark: remark,
       status: status,
       ...(userType === "RO" && { rtom_areas: rtomAreas }),
     };
     console.log("Saved Data:", updatedData);
     // API call to save data here
     navigate(-1);
   }; */

  const toggleStatus = () => {
    setDrcUserStatus(prev => prev === 'Active' ? 'Inactive' : 'Active');
  };

  const handleAddRtomArea = () => {
    if (selectedRtomArea && !rtomAreas.some(area => area.name === selectedRtomArea)) {
      const selectedOption = rtomAreaOptions.find(opt => opt.area_name === selectedRtomArea);
      setRtomAreas([...rtomAreas, {
        rtom_id: selectedOption.rtom_id,
        name: selectedRtomArea,
        status: true,
        isNew: true,
        billing_center_code: selectedOption?.billing_center_code || 'N/A',
        handling_type: rtomAreas.length === 0 ? 'Primary' : 'Secondary', // First = Primary
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

  const toggleRtomAreaStatus = (index) => {
    const newRtomAreas = [...rtomAreas];
    newRtomAreas[index].status = !newRtomAreas[index].status;
    setRtomAreas(newRtomAreas);
  };


  console.log("selected rtoms are: ", rtomAreas)

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h2 className={GlobalStyle.headingLarge}>
        {userType === "RO" ? "Register Recovery Officer" : "Register DRC User"}
      </h2>
      <h2 className={`${GlobalStyle.headingMedium} pl-10`}>
        DRC Name : {itemData?.drc_name || "ABC company"}
      </h2>

      <div className="flex gap-4 mt-4 justify-center">
        <div className={`${GlobalStyle.cardContainer} relative`}>
          <div className="table">
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-semibold">
                User Type
              </div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">
                <select
                  className={GlobalStyle.selectBox}
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="RO">RO</option>
                  <option value="drcUser">DRC User</option>
                </select>
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell px-4 py-2 font-semibold">
                {userType === "drcUser"
                  ? "DRC User Name"
                  : "Recovery Officer Name"}
              </div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">
                <input
                  type="text"
                  className={`${GlobalStyle.inputText} w-[150px]`}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell px-4 py-2 font-semibold">
                {userType === "drcUser" ? "DRC Coordinator NIC" : "RO NIC"}
              </div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">
                <input
                  type="text"
                  className={`${GlobalStyle.inputText} w-[150px]`}
                  onChange={(e) => setNic(e.target.value)}
                />
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Login method</div>
            </div>

            <div className="table-row">
              <div className="table-cell px-4 py-2 pl-8 font-semibold">
                Contact Number
              </div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">
                <input
                  type="text"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  className={`${GlobalStyle.inputText} w-[150px]`}
                  placeholder="+94771234567"
                />
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 pl-12 font-semibold">
                <img
                  src={gmailIcon}
                  alt="Email"
                  className="w-5 h-5 inline-block mr-2 align-middle"
                  title="Email"
                />
              </div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${GlobalStyle.inputText} w-[200px]`}
                  placeholder="example@domain.com"
                />
              </div>
            </div>
          </div>

          {userType === "RO" && (
            <>
              <br />

              <div className="table-row">
                <div className="table-cell px-4 py-2 font-semibold">
                  RTOM Area
                </div>
                <div className="table-cell px-4 py-2 font-semibold">:</div>
                <div className="table-cell px-4 py-2">
                  <div className="flex items-center">
                    <select
                      value={selectedRtomArea}
                      onChange={(e) => setSelectedRtomArea(e.target.value)}
                      className={`${GlobalStyle.inputText} w-[150px] mr-2`}
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
                      className={GlobalStyle.buttonPrimary}
                      disabled={!selectedRtomArea}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className={GlobalStyle.tableContainer}>
                <table className={`${GlobalStyle.table} w-[360px]`}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th className={GlobalStyle.tableHeader}>RTOM Area</th>
                      <th className={GlobalStyle.tableHeader}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rtomAreas.length > 0 ? (
                      rtomAreas.map((area, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                        >
                          <td className={`${GlobalStyle.tableData} text-center pt-6`}>{area.name}</td>
                          <td className={`${GlobalStyle.tableData} text-center`}>
                            <div className="flex items-center justify-center gap-2">
                              <div
                                className={`inline-block w-11 h-6 rounded-full transition-colors ${area.status ? 'bg-green-500' : 'bg-gray-400'} relative cursor-pointer`}
                                onClick={() => toggleRtomAreaStatus(index)}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full bg-white absolute top-[2px] transition-all ${area.status ? 'left-[26px]' : 'left-[2px]'}`}
                                />
                              </div>
                              <span className={`text-sm font-semibold ${area.status ? 'text-green-600' : 'text-gray-500'}`}>
                                {area.status ? 'Active' : 'Inactive'}
                              </span>
                              {area.isNew && (
                                <button
                                  onClick={() => handleRemoveRtomArea(index)}
                                  className={`${GlobalStyle.buttonPrimary} w-10 h-8 flex items-center justify-center`}
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
                      <tr className="bg-white">
                        <td colSpan={2} className="text-center py-4">
                          No RTOM areas available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="flex justify-end p-4">
            <button className={GlobalStyle.buttonPrimary} onClick={handleAddRO} >
              {userType === "RO" ? "Add RO" : "Add "}
              
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
