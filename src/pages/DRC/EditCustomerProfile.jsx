/*Purpose: This template is used for the 2.7.1-Cus.Nego - Edit Customer details
Created Date: 2025-01-08
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-01-08
Version: node 20
ui number : 2.7.1
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for Edit Customer details  */

import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditCustomerProfile() {
  // State to manage case details
  const [caseDetails, setCaseDetails] = useState({
    caseId: "",
    customerRef: "",
    accountNo: "",
    arrearsAmount: "",
    lastPaymentDate: "",
    phone: "0712345678",
    email: "james2@gmail.com",
    address: "No.742/7, Lotus Road",

    remark: "",
    identityNumber: "012345678912",
  });
  const navigate = useNavigate();

  // Separate state for dropdowns
  const [phoneType, setPhoneType] = useState("Mobile");
  const [identityType, setIdentityType] = useState("NIC");
  const [contactName, setContactName] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [address, setAddress] = useState("");

  const [email, setEmail] = useState(''); // Email state
  const [phone, setPhone] = useState(''); // Phone state
  const [emailError, setEmailError] = useState(''); // Error state for email
  const [phoneError, setPhoneError] = useState(''); // Error state for phone
  
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(''); // Clear email error when the user starts typing
  };
  
  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    setPhoneError(''); // Clear phone error when the user starts typing
  };
  
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[com]{2,}$/;
    return regex.test(email);
  };
  
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };
  
  const handleSubmit = () => {
    let isValid = true;
  
    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError(''); // Clear email error if valid
    }
  
    // Validate phone number
    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid phone number');
      isValid = false;
    } else {
      setPhoneError(''); // Clear phone error if valid
    }
  
    if (isValid) {
      alert("Submit button clicked");
    }
  };
  const handlePhoneTypeChange = (event) => {
    setPhoneType(event.target.value);
  };

  const handleContactNameChange = (event) => {
    setContactName(event.target.value);
  };
  const handleIdentityTypeChange = (event) => {
    setIdentityType(event.target.value);
  };
  const handleIdentityNumberChange = (event) => {
    setIdentityNumber(event.target.value);
  };
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
 

  const handleInputChange = (event, field) => {
    setCaseDetails({
      ...caseDetails,
      [field]: event.target.value,
    });
  };
  

  return (
    <>
      <div className={GlobalStyle.fontPoppins}>
        <div className="flex justify-between items-center mb-8">
          <h1 className={GlobalStyle.headingLarge}>Edit Customer Profile</h1>
        </div>
        {/* Card box */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className={`${GlobalStyle.cardContainer}`}>
            <p className="mb-2">
              <strong>Case ID: {caseDetails.caseId}</strong>
            </p>
            <p className="mb-2">
              <strong>Customer Ref: {caseDetails.customerRef}</strong>
            </p>
            <p className="mb-2">
              <strong>Account No: {caseDetails.accountNo}</strong>
            </p>
            <p className="mb-2">
              <strong>Arrears Amount: {caseDetails.arrearsAmount}</strong>
            </p>
            <p className="mb-2">
              <strong>Last Payment Date: {caseDetails.lastPaymentDate}</strong>
            </p>
          </div>
        </div>

        {/* Phone Number Section */}

        <h1
          className={`${GlobalStyle.remarkTopic}`}
          style={{ marginLeft: "180px" }}
        >
          Contact Number
        </h1>
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="flex gap-4 mb-6">
            <div className="flex flex-col space-y-5">
              <h1>Mobile</h1>
              <select
                className={GlobalStyle.selectBox}
                onChange={handlePhoneTypeChange}
                value={phoneType}
              >
                <option value=""></option>
                <option value="Mobile">Mobile</option>
                <option value="Landline">Landline</option>
              </select>
            </div>
            <div className="flex flex-col space-y-3">
              <h1 className={GlobalStyle.remarkTopic}>{caseDetails.phone}</h1>
              <input
                type="text"
                placeholder=""
                value={phone}
                onChange={handlePhoneChange}
                className={GlobalStyle.inputText}
              />
              {phoneError && <p style={{ color: 'red', fontSize: '12px' }}>{phoneError}</p>}

            </div>
            <div className="flex flex-col items-center space-y-2">
            <button className={GlobalStyle.buttonPrimary}style={{ position: "relative", top: "-5px" , left: "-85px"}}>+</button>
            <input
              type="text"
              placeholder="Contact Name"
              value={contactName}
              onChange={handleContactNameChange}
              className={GlobalStyle.inputText}
            />
          </div>
          </div>
        </div>
        {/* Identity Section */}
        <h1
          className={`${GlobalStyle.remarkTopic}`}
          style={{ marginLeft: "180px" }}
        >
          NIC/PP/Driving License
        </h1>
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="flex gap-4 mb-6">
            <div className="flex flex-col space-y-4">
              <h1 className={GlobalStyle.remarkTopic}>{identityType}</h1>
              <select
                className={GlobalStyle.selectBox}
                onChange={handleIdentityTypeChange}
                value={identityType}
              >
                <option value="NIC">NIC</option>
                <option value="PP">PP</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>
            <div className="flex flex-col space-y-4">
              <h1 className={GlobalStyle.remarkTopic}>
                {caseDetails.identityNumber}
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
        </div>

        {/* Email Section */}
        <div className="flex gap-20 mb-6">
          <h1
            className={`${GlobalStyle.remarkTopic}`}
            style={{ marginLeft: "180px" }}
          >
            Email
          </h1>
          <div
            className="flex flex-col space-y-4"
            style={{ marginLeft: "120px" }}
          >
            <div className="flex space-x-4   ">
              <h1 className={GlobalStyle.remarkTopic}>{caseDetails.email}</h1>
              <button className={GlobalStyle.buttonPrimary} style={{ position: "relative", top: "-5px" }}>+</button>
            </div>
            <input
              type="text"
              placeholder=""
              value={email}
              onChange={handleEmailChange}
              className={`${GlobalStyle.inputText} `}
              style={{ width: "450px" }}
            />
            {emailError && <p style={{ color: 'red', fontSize: '12px' }}>{emailError}</p>}
          </div>
        </div>

        {/* Address Section */}
        <div className="flex gap-20 mb-6">
          <h1
            className={`${GlobalStyle.remarkTopic}`}
            style={{ marginLeft: "180px" }}
          >
            Address
          </h1>
          <div
            className="flex flex-col space-y-4"
            style={{ marginLeft: "100px" }}
          >
            <div className="flex space-x-4">
              <h1 className={GlobalStyle.remarkTopic}>{caseDetails.address}</h1>
              <button className={GlobalStyle.buttonPrimary} style={{ position: "relative", top: "-5px" }}>+</button>
            </div>
            <input
              type="text"
              placeholder=""
              value={address}
              onChange={handleAddressChange}
              className={`${GlobalStyle.inputText} `}
              style={{ width: "450px" }}
            />
          </div>
        </div>

        {/* Remark Section */}
        <div className="flex gap-20 mb-6">
          <h1
            className={`${GlobalStyle.remarkTopic}`}
            style={{ marginLeft: "180px" }}
          >
            Remark
          </h1>
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
          <button className={`${GlobalStyle.buttonPrimary} ml-4`} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
