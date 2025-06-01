import  { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import add from "../../assets/images/add.svg";
import remove from "../../assets/images/remove.svg";
import google from "../../assets/images/google.png";
import Swal from "sweetalert2";
import { createRecoveryOfficer } from "../../services/Ro/Ro_services";
import { getDebtCompanyDetailsByDRCID } from "../../services/Ro/Ro_services";
import { getLoggedUserId } from "../../services/auth/authService";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { getActiveRTOMsByDRCID } from "../../services/rtom/RtomService";

const RecoveryOfficerForm = () => {
  const navigate = useNavigate();
  const [recoveryOfficerName, setRecoveryOfficerName] = useState("");
  const [roNic, setRoNic] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRtom, setSelectedRtom] = useState("");
  const [tableData, setTableData] = useState([]);
  const [drcDetails, setDrcDetails] = useState(null);
  const [activeRtoms, setActiveRtoms] = useState([]);

  const [userData, setUserData] = useState(null);
  
  // get looged drc id
  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    console.log("User data:", user);
  };

  const goBack = () => {
    navigate(-1); 
  };

  useEffect(() => {
    loadUser();
  }, []);

  const drc_id = userData?.drc_id;

  useEffect(() => {
    console.log(drc_id);
    
    if (!drc_id) return;

    //Fetch DRC details
    const fetchDrcDetails = async () => {
      try {
        const data = await getDebtCompanyDetailsByDRCID(userData);
        setDrcDetails(data.data);

        // // Filter and set active RTOMs
        // const filteredRtoms = data.data.rtom.filter(
        //   (rtom) => rtom.rtom_status === "Active"
        // );
        // setActiveRtoms(filteredRtoms);
      } catch (error) {
        console.error("Error fetching DRC details:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch DRC details. Please try again later.",
        });
      }
    };

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

    fetchDrcDetails();
    fetchRtoms();

  }, [drc_id]);

  // Add selected RTOM to the table
  const addRtomArea = () => {
    if (
      selectedRtom &&
      !tableData.some((item) => item.rtomArea === selectedRtom)
    ) {
      setTableData([...tableData, { rtomArea: selectedRtom }]);
      setSelectedRtom(""); // Reset the dropdown
    }
  };

  // Remove RTOM from the table
  const handleRemove = (index) => {
    setTableData(tableData.filter((_, i) => i !== index));
  };

  // Validate email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number
  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^07\d{8}$/;
    return phoneRegex.test(phone);
  };

  // Submit the form
  const handleSubmit = async () => {
    if (!recoveryOfficerName || !roNic || !contactNumber) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields.",
      });
      return;
    }

    // Validate email only if entered
    if (email && !isValidEmail(email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    // Validate phone number
    if (!isValidPhoneNumber(contactNumber)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Contact Number",
        text: "Please enter a valid contact number.",
      });
      return;
    }

    const recoveryOfficerData = {
      drc_id: userData?.drc_id,
      ro_name: recoveryOfficerName,
      ro_nic: roNic,
      ro_login_contact_no: contactNumber,
      ro_login_email: email || null,
      ro_create_by: drcDetails.drc_name,
      rtoms_for_ro: tableData.map((item) => {
        const rtom = activeRtoms.find(
          (rtom) => rtom.area_name === item.rtomArea
        );

        return {
          rtom_id: rtom?.rtom_id,
          rtom_name: rtom?.area_name,
          rtom_status: "Active",
          rtom_create_dtm: new Date().toISOString(),
          rtom_create_by: userData.user_id,
        };
      }),
    };

    console.log("Recovery Officer Data:", recoveryOfficerData);

    try {
      const response = await createRecoveryOfficer(recoveryOfficerData);
      console.log("Recovery Officer created successfully:", response);

      // Reset the form
      setRecoveryOfficerName("");
      setRoNic("");
      setContactNumber("");
      setEmail("");
      setTableData([]);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Recovery Officer added successfully!",
      });
    } catch (error) {
      console.error("Error creating Recovery Officer:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add Recovery Officer. Please try again.",
      });
    }
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className={`${GlobalStyle.headingLarge} mb-8`}>
        <span>Register New Recovery Officer</span>
      </div>
      <div className={`${GlobalStyle.headingMedium} mb-8`}>
        <span>DRC Name : </span>
        <span className="font-bold">{drcDetails?.drc_name}</span>
      </div>
       
      <div className="flex justify-center">
        <div className={`${GlobalStyle.cardContainer} p-4`}>
          <div className="flex justify-center mb-6">
            <span
              className={`${GlobalStyle.headingMedium} text-[24px] font-bold text-center`}
            >
              Recovery Officer Data Entry
            </span>
          </div>

          <table className="mb-8 w-full border-spacing-y-3 border-separate">
            <tbody>
              <tr>
                <td>
                  <label className={`${GlobalStyle.headingMedium}`}>
                    Recovery Officer Name
                  </label>
                </td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className={`${GlobalStyle.inputText}`}
                    value={recoveryOfficerName}
                    onChange={(e) => setRecoveryOfficerName(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label className={`${GlobalStyle.headingMedium}`}>
                    RO NIC
                  </label>
                </td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className={`${GlobalStyle.inputText}`}
                    value={roNic}
                    onChange={(e) => setRoNic(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label className={`${GlobalStyle.headingMedium} font-medium`}>
                    Login Method
                  </label>
                </td>
              </tr>
              <tr>
                <td className="pl-8">
                  <label className={`${GlobalStyle.headingMedium}`}>
                    Contact Number
                  </label>
                </td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className={`${GlobalStyle.inputText}`}
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="pl-8">
                  <img src={google} alt="Google" className="w-6 h-6" />
                </td>
                <td>:</td>
                <td>
                  <input
                    type="text"
                    className={`${GlobalStyle.inputText}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label className={`${GlobalStyle.headingMedium}`}>
                    RTOM Area
                  </label>
                </td>
                <td>:</td>
                <td>
                  <select
                    className={`${GlobalStyle.selectBox}`}
                    value={selectedRtom}
                    onChange={(e) => {
                      console.log("Selected RTOM:", e.target.value);
                      setSelectedRtom(e.target.value);
                    }}
                  >
                    <option value="">Select RTOM Area</option>
                    {activeRtoms.map((rtom, index) => (
                      <option key={index} value={rtom.area_name}>
                        {rtom.area_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="bg-white rounded-full p-1 border border-gray-300"
                    onClick={addRtomArea}
                  >
                    <img src={add} alt="Add" className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {tableData.length > 0 && (
            <div className={`${GlobalStyle.tableContainer} mb-5`}>
              <table className={`${GlobalStyle.table} w-full`}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th className={`${GlobalStyle.tableHeader} text-left`}>
                      RTOM Area
                    </th>
                    <th className={`${GlobalStyle.tableHeader}`}></th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className={`${GlobalStyle.tableData} p-3`}>
                        {item.rtomArea}
                      </td>
                      <td
                        className={`${GlobalStyle.tableData} flex justify-center`}
                      >
                        <button onClick={() => handleRemove(index)}>
                          <img
                            src={remove}
                            title="Remove"
                            className="w-6 h-6"
                            alt="Remove"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end">
            <button
              className={`${GlobalStyle.buttonPrimary}`}
              onClick={handleSubmit}
            >
              Add RO
            </button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '12px' }}>
        <button className={GlobalStyle.navButton} onClick={goBack}>
          <FaArrowLeft />  Back
        </button>
      </div>
    </div>
  );
};

export default RecoveryOfficerForm;
