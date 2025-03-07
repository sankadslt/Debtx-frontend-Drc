/*Purpose: This template is used for the 2.7.1-Cus.Nego - Edit Customer details
Created Date: 2025-01-08
Created By: Sanjaya (sanjayaperera80@gmail.com)
Modified by: Susinidu (susinidusachinthana@gmail.com)
Last Modified Date: 2025-02-14
Version: node 20
ui number : 2.7.1
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for Edit Customer details  */

import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  caseDetailsforDRC,
  updateCustomerContacts,
} from "../../services/case/CaseService";
import { jwtDecode } from "jwt-decode";
import back from "../../assets/images/back.png";
import { refreshAccessToken } from "../../services/auth/authService.js";
import Swal from 'sweetalert2';

export default function EditCustomerProfile() {
  // State to manage case details
  const [caseDetails, setCaseDetails] = useState({
    caseId: "",
    customerRef: "",
    accountNo: "",
    arrearsAmount: "",
    lastPaymentDate: "",
    phone: "",
    email: "",
    address: "",
    identityNumber: "",
    remark: "",
    contact_type: "",
    identification_type: "",
    contact_Details: []
  });
  const navigate = useNavigate();

  // Separate state for dropdowns
  const [phoneType, setPhoneType] = useState("");

  // NIC
  const [identification_type, setidentification_type] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  
  
  // Phone
  const [contacts, setContacts] = useState([]);
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // address
  const [address, setAddress] = useState("");
  const [addressInputs, setAddressInputs] = useState([""]);
  const [addressError, setAddressError] = useState("");

  // email
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailInputs, setEmailInputs] = useState([""]);

  // validation masseges
  const [validationMessage, setValidationMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const { case_id } = useParams();
  
  const loadUser = async () => {
    let token = localStorage.getItem("accessToken");
    if (!token) {
      setUserData(null);
      return;
    }
  
    try {
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        token = await refreshAccessToken();
        if (!token) return;
        decoded = jwtDecode(token);
      }
  
      setUserData({
        id: decoded.user_id,
        role: decoded.role,
        drc_id: decoded.drc_id,
        ro_id: decoded.ro_id,
      });
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };
  
  useEffect(() => {
    loadUser();
  }, [localStorage.getItem("accessToken")]);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        if (!userData?.drc_id) {
          console.log("Missing DRC Id.", userData?.drc_id);
          return;
        }
        
        // FIXED: Corrected parameter order to match the function definition
        const caseDetails = await caseDetailsforDRC(Number(case_id), userData.drc_id);

        console.log("Case details:", caseDetails);
        
        setCaseDetails({
          caseId: caseDetails.case_id,
          customerRef: caseDetails.customer_ref,
          accountNo: caseDetails.account_no,
          arrearsAmount: caseDetails.current_arrears_amount,
          lastPaymentDate: caseDetails.last_payment_date,
          fullAddress: caseDetails.full_Address,
          nic: caseDetails.nic,
          remark: "",
          contact_Details: caseDetails.contactDetails || [],
        });
        
        // Ensure contactDetails is an array before setting it
        setContacts(Array.isArray(caseDetails.contactDetails) ? caseDetails.contactDetails : []);
      } catch (error) {
        console.error("Error fetching case details:", error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch case details. Please try again.',
        });
      }
    };
    
    if (userData?.drc_id) {
      fetchCaseDetails();
    }
  }, [userData?.drc_id, case_id]);

  useEffect(() => {
    if (Array.isArray(caseDetails.contact_Details)) {
      setContacts(caseDetails.contact_Details);
    }
  }, [caseDetails.contact_Details]);
  
  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhone(newPhone);

    // Phone number validation (10 digits in this case)
    const phoneRegex = /^0[0-9]{9}$/;

    if (!phoneRegex.test(newPhone) && newPhone !== "") {
      setPhoneError("Invalid phone number. Please enter 10 digits.");
    } else {
      // Clear the error if the phone number is valid
      setPhoneError("");
    }
  };

  // submit function
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    let isValid = true;

    // Validate mobile number if provided
    if (phone && phoneType) {
      const phoneRegex = /^0[0-9]{9}$/;
      if (!phoneRegex.test(phone)) {
        setPhoneError("Please enter a valid Mobile number.");
        isValid = false;
      }
    }

    // Validate email if provided
    if (emailInputs[0]) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInputs[0])) {
        setEmailError("Please enter a valid email address.");
        isValid = false;
      }
    }

    // Validate identity number if provided
    if (identityNumber && identification_type) {
      const message = validateIdentityNumber(identification_type, identityNumber);
      if (message) {
        setValidationMessage(message);
        isValid = false;
      }
    }

    if (isValid) {
      Swal.fire({
        title: 'Confirm Submission',
        text: "Are you sure you want to submit the form details?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Prepare the data object for submission
          const caseData = {
            case_id: caseDetails.caseId,
            mob: phoneType === "Mobile" ? phone : "",
            lan: phoneType === "Landline" ? phone : "",
            email: emailInputs[0],
            nic: identityNumber,
            address: addressInputs[0],
            remark: caseDetails.remark,
            identification_type: identification_type,
          };

          console.log("caseData", caseData);
          try {
            // Submit the data and wait for the response
            const response = await updateCustomerContacts(caseData);
            console.log("response form", response);

            // Check the response status to determine if the submission was successful
            if (response && response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Data submitted successfully!'
              });

              // Clear user input fields here
              setPhone("");
              setPhoneType("");
              setPhoneError("");
              setContactName("");

              setEmail("");
              setEmailInputs([""]);
              setEmailError("");

              setAddress("");
              setAddressInputs([""]);
              setAddressError("");

              setidentification_type("");
              setIdentityNumber("");
              setValidationMessage("");

              // Clear the remark field
              setCaseDetails((prevDetails) => ({
                ...prevDetails,
                remark: "",
              }));
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.error || 'Failed to submit data. Please try again.'
              });
            }
          } catch (error) {
            // Handle duplicate mobile number error
            if (
              error.response &&
              error.response.data &&
              error.response.data.error ===
                "Duplicate data detected: Mobile already exists"
            ) {
              setPhoneError(
                "Mobile number already exists. Please use a different Mobile number."
              );
            }
            // Handle duplicate NIC error
            else if (
              error.response &&
              error.response.data &&
              error.response.data.error ===
                "Duplicate data detected: NIC already exists"
            ) {
              setValidationMessage(
                "NIC/PP/Driving License already exists. Please use a different One."
              );
            }
            // Handle duplicate email error
            else if (
              error.response &&
              error.response.data &&
              error.response.data.error ===
                "Duplicate data detected: Email already exists"
            ) {
              setEmailError("Email already exists. Please use a different email.");
            }
            // Handle duplicate address error
            else if (
              error.response &&
              error.response.data &&
              error.response.data.error ===
                "Duplicate data detected: address already exists"
            ) {
              setAddressError(
                "Address already exists. Please use a different address."
              );
            } else {
              console.error("Error submitting data:", error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to submit data. Please try again.'
              });
            }
          }
        }
      });
    }
  };

  const handlePhoneTypeChange = (event) => {
    setPhoneType(event.target.value);
  };

  const handleContactNameChange = (event) => {
    setContactName(event.target.value);
  };

  const handleInputChange = (event, field) => {
    setCaseDetails({
      ...caseDetails,
      [field]: event.target.value,
    });
  };

  const handleAddressInputChange = (index, value) => {
    const updatedAddresses = [...addressInputs];
    // Update the address at the specific index
    updatedAddresses[index] = value;
    setAddressInputs(updatedAddresses);
  };

  // NIC , PP , Driving license add function
  const handleIdentityTypeChange = (event) => {
    setidentification_type(event.target.value);
  };

  const handleIdentityNumberChange = (e) => {
    // Get the entered value from the input
    const value = e.target.value;
    setIdentityNumber(value);
    // Validate the identity number based on the selected identity type
    if (identification_type && value) {
      const message = validateIdentityNumber(identification_type, value);
      setValidationMessage(message);
    } else {
      setValidationMessage("");
    }
  };

  const handleEmailInputChange = (index, value) => {
    const newEmailInputs = [...emailInputs];
    newEmailInputs[index] = value;
    setEmailInputs(newEmailInputs);

    // Regex to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email is valid, otherwise set the error
    if (!emailRegex.test(value) && value !== "") {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // NIC , PP , Driving license validation function
  const validateIdentityNumber = (type, value) => {
    let regex;
    switch (type) {
      case "NIC":
        // Sri Lankan NIC example formats: 123456789V or 200011200000
        regex = /^([1-2][0-9]{3}[0-9]{8}|[0-9]{9}[VXvx])$/;
        return regex.test(value)
          ? ""
          : "Invalid NIC. Format: 123456789V or 200011200000";
      case "PP":
        // Passport example: alphanumeric, 6-9 characters
        regex = /^[A-Z0-9]{6,9}$/i;
        return regex.test(value)
          ? ""
          : "Invalid Passport. Alphanumeric, 6-9 chars.";
      case "Driving License":
        // Driving License example format: alphanumeric
        regex = /^[A-Z0-9-]{8,15}$/i;
        return regex.test(value)
          ? ""
          : "Invalid Driving License. Alphanumeric, 8-15 chars.";
      default:
        return "Invalid type selected.";
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      <div className={GlobalStyle.fontPoppins}>
        <div className="flex justify-between items-center mb-8">
          <h1 className={GlobalStyle.headingLarge}>Edit Customer Profile</h1>
        </div>

        {/* Card box */}
        <div className={`${GlobalStyle.tableContainer}  bg-white bg-opacity-50 p-8 max-w-4xl mx-auto `}>
          <div className="flex flex-col items-center justify-center mb-4">
            <div
              className={`${GlobalStyle.cardContainer} bg-white shadow-lg rounded-lg p-4`}
              style={{ backgroundColor: "white", width: "600px" }}
            >
              <table className={`${GlobalStyle.table}`}>
                <tbody>
                  <tr>
                    <td className="text-black">
                      <p className="mb-2">
                        <strong>Case ID </strong>
                      </p>
                    </td>
                    <td className="text-black">: {caseDetails.caseId}</td>
                  </tr>

                  <tr>
                    <td className="text-black">
                      <p className="mb-2">
                        <strong>Customer Ref </strong>
                      </p>
                    </td>
                    <td className="text-black">: {caseDetails.customerRef}</td>
                  </tr>

                  <tr>
                    <td className="text-black">
                      <p className="mb-2">
                        <strong>Account No </strong>
                      </p>
                    </td>
                    <td className="text-black">: {caseDetails.accountNo}</td>
                  </tr>

                  <tr>
                    <td className="text-black">
                      <p className="mb-2">
                        <strong>Arrears Amount </strong>
                      </p>
                    </td>
                    <td className="text-black">
                      : {caseDetails.arrearsAmount && typeof caseDetails.arrearsAmount === 'number' 
                          ? caseDetails.arrearsAmount.toLocaleString() 
                          : caseDetails.arrearsAmount}
                    </td>
                  </tr>

                  <tr>
                    <td className="text-black">
                      <p className="mb-2">
                        <strong>Last Payment Date </strong>
                      </p>
                    </td>
                    <td className="text-black">
                      :{" "}
                      {caseDetails.lastPaymentDate
                        ? new Date(caseDetails.lastPaymentDate)
                            .toISOString()
                            .split("T")[0]
                            .replace(/-/g, ".")
                        : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Phone Number Section */}
          <div>
            <h1
              className={`${GlobalStyle.remarkTopic}`}
              style={{ marginLeft: "50px" }}
            >
              Contact Number
            </h1>

            <div className="flex flex-col items-center justify-center mb-4">
              <div>
                {/* Display existing contacts */}
                <div className="flex items-start gap-20">
                  <div className={GlobalStyle.remarkTopic}>
                    {Array.isArray(contacts) &&
                      contacts.length > 0 &&
                      contacts.map((contact, index) => (
                        <div key={index}>
                          {contact.mob && (
                            <div className="grid grid-cols-2 gap-40 mb-2 items-center">
                              <h1>Mobile</h1>
                              <h1>{contact.mob}</h1>
                            </div>
                          )}
                          {contact.lan && (
                            <div className="grid grid-cols-2 gap-40 mb-2 items-center">
                              <h1>Land</h1>
                              <h1>{contact.lan}</h1>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Input Section */}
              <div className="pl-4">
                <div className="flex gap-10 items-center mb-6">
                  {/* Phone Type Dropdown */}
                  <select
                    className={GlobalStyle.selectBox}
                    onChange={handlePhoneTypeChange}
                    value={phoneType}
                  >
                    <option value=""></option>
                    <option value="Mobile">Mobile</option>
                    <option value="Landline">Landline</option>
                  </select>

                  {/* Phone Number Input */}
                  <div>
                    <input
                      type="text"
                      placeholder=""
                      value={phone}
                      onChange={handlePhoneChange}
                      className={`${GlobalStyle.inputText} w-40`}
                    />
                  </div>

                  {/* Contact Name Input */}
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={contactName}
                    onChange={handleContactNameChange}
                    className={`${GlobalStyle.inputText} w-40`}
                  />
                </div>
              </div>
              {phoneError && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      color: "red",
                      fontSize: "12px",
                    }}
                  >
                    {phoneError}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Identity Section */}
          <div>
            <h1
              className={`${GlobalStyle.remarkTopic}`}
              style={{ marginLeft: "50px" }}
            >
              NIC/PP/Driving License
            </h1>

            <div className="flex flex-col items-center justify-center mb-4">
              <div className="flex gap-4 mb-6" style={{ marginLeft: "170px" }}>
                {/* Drop down */}
                <div className="flex flex-col space-y-4">
                  <h1 className={GlobalStyle.remarkTopic}>
                    {contacts && contacts[0] && contacts[0].identification_type}
                  </h1>
                  <select
                    className={GlobalStyle.selectBox}
                    onChange={handleIdentityTypeChange}
                    value={identification_type}
                  >
                    <option value=""></option>
                    <option value="NIC">NIC</option>
                    <option value="PP">PP</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>
                {/* Input section */}
                <div className="flex flex-col space-y-4">
                  <h1 className={GlobalStyle.remarkTopic}>
                    {Array.isArray(contacts) &&
                      contacts.length > 0 &&
                      contacts.map((contact, index) => (
                        <div key={index}>
                          {contact.nic && <h1>{contact.nic}</h1>}
                        </div>
                      ))}
                  </h1>
                  <input
                    type="text"
                    placeholder=""
                    value={identityNumber}
                    onChange={handleIdentityNumberChange}
                    className={GlobalStyle.inputText}
                  />
                </div>
              </div>

              {/* NIC, PP, Driving License validation */}
              <div
                style={{
                  marginLeft: "250px",
                }}
              >
                {validationMessage && (
                  <p className="text-red-500 text-sm">{validationMessage}</p>
                )}
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="flex gap-20 mb-6">
            <h1
              className={`${GlobalStyle.remarkTopic}`}
              style={{ marginLeft: "50px" }}
            >
              Email
            </h1>

            <div
              className="flex flex-col space-y-4"
              style={{ marginLeft: "120px" }}
            >
              <div className="flex space-x-4 ">
                <div>
                  {Array.isArray(contacts) &&
                    contacts.map((contact, index) => {
                      if (contact.email) {
                        return (
                          <span
                            key={index}
                            className={GlobalStyle.remarkTopic}
                            style={{ display: "block" }}
                          >
                            {contact.email}
                          </span>
                        );
                      }
                      return null;
                    })}
                </div>
              </div>

              {emailInputs.map((emailValue, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    placeholder=""
                    value={emailValue}
                    onChange={(e) =>
                      handleEmailInputChange(index, e.target.value)
                    }
                    className={`${GlobalStyle.inputText} `}
                    style={{ width: "450px" }}
                  />
                </div>
              ))}
              {emailError && (
                <p style={{ color: "red", fontSize: "12px" }}>{emailError}</p>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="flex gap-20 mb-6">
            <h1
              className={`${GlobalStyle.remarkTopic}`}
              style={{ marginLeft: "50px" }}
            >
              Address
            </h1>

            <div
              className="flex flex-col space-y-4"
              style={{ marginLeft: "100px" }}
            >
              <div className="flex space-x-4">
                <h1 className={GlobalStyle.remarkTopic}>
                  {Array.isArray(contacts) &&
                    contacts.length > 0 &&
                    contacts.map((contact, index) => (
                      <div key={index}>
                        {contact.address && (
                          <div className={GlobalStyle.remarkTopic}>
                            <h1 className="text-gray-700">{contact.address}</h1>
                          </div>
                        )}
                      </div>
                    ))}
                </h1>
              </div>
              {addressInputs.map((addressValue, index) => (
                // address input
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    placeholder=""
                    value={addressValue}
                    onChange={(e) =>
                      handleAddressInputChange(index, e.target.value)
                    }
                    className={`${GlobalStyle.inputText} `}
                    style={{ width: "450px" }}
                  />
                  {addressError && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      {addressError}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Remark Section */}
          <div className="flex gap-20 mb-6">
            <h1
              className={`${GlobalStyle.remarkTopic}`}
              style={{ marginLeft: "50px" }}
            >
              Remark
            </h1>
            {/* Remark input */}
            <div
              className="flex flex-col space-y-4"
              style={{ marginLeft: "100px" }}
            >
              <input
                type="text"
                value={caseDetails.remark}
                onChange={(e) => handleInputChange(e, "remark")}
                className={`${GlobalStyle.inputText} `}
                style={{ width: "450px" }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end items-center w-full mt-6">
            <button
              className={`${GlobalStyle.buttonPrimary} ml-4`}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Back button */}
        <div onClick={handleBack} style={{ cursor: 'pointer' }}>
          <img
            src={back}
            alt="Back"
            title="Back"
            style={{ width: "50px", height: "auto" }}
          />
        </div>
      </div>
    </>
  );
};