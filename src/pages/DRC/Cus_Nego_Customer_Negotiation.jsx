/*
This template is used for the 2.7.2-customer negotiation and 2.7.3-CPE collect for DRC
Created Date: 2025-01-09
Created By: sakumini (sakuminic@gmail.com)
Modified by: Yevin (ytheenura5@gmail.com)
Last Modified Date: 2025-02-24
Version: node 20
ui number : 2.7.2,2.7.3
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for the assigned customer negotiation and cpe collect for DRC  */

import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  drcCaseDetails,
  addNegotiationCase,
  fetchActiveNegotiations,
  getActiveRORequestsforNegotiationandMediation,
} from "../../services/case/CaseService";
import editIcon from "../../assets/images/edit.png"; 
import viewIcon from "../../assets/images/view.png";
import Backbtn from "../../assets/images/back.png";
import { useNavigate  , useLocation} from "react-router-dom";
import {getLoggedUserId} from "/src/services/auth/authService.js";
import Swal from "sweetalert2";

import { Tooltip } from "react-tooltip";


import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

// import { set } from "react-datepicker/dist/date_utils";

const Cus_Nego_Customer_Negotiation = () => {
  
  const [activeTab, setActiveTab] = useState("negotiation");
  const [showResponseHistory, setShowResponseHistory] = useState(false);
  // const [showSubmitMessage, setShowSubmitMessage] = useState(false);
  const [lastRequests, setLastRoRequests] = useState([]);
  const [lastNagotiation, setLastRONagotiation] = useState([]);
  const [lastPayment, setLastROPayment] = useState([]);
  const [activeNegotiations, setActiveNegotiations] = useState([]); // State for active negotiations
  const [activeRORequests, setActiveRORequests] = useState([]);
  const [caseDetails, setCaseDetails] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const rowsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const location = useLocation();
  const [drcId, setDrcId] = useState(null);
  const [roId, setRoId] = useState(null);
   const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  const caseid = location.state?.CaseID;

  const actiontype = location.state?.ActionType;

  //console.log("Case details passed to the paghe:", caseDetails);
  const [userData, setUserData] = useState(null); 
  //pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = Array.isArray(lastNagotiation)
    ? lastNagotiation.slice(indexOfFirstRow, indexOfLastRow)
    : [];
  const totalPages = Math.ceil((lastNagotiation?.length || 0) / rowsPerPage);

  // Pagination handler
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const itemsPerPage = 4;
  const startIndex1 = (currentPage1 - 1) * itemsPerPage;
  const endIndex1 = startIndex1 + itemsPerPage;
  const currentRows1 = lastPayment.slice(startIndex1, endIndex1);
  const totalPages1 = Math.ceil(lastPayment.length / itemsPerPage);

  // Pagination handler for Payment Details
  const handlePrevNext1 = (direction) => {
    if (direction === "prev" && currentPage1 > 1) {
      setCurrentPage1(currentPage1 - 1);
    }
    if (direction === "next" && currentPage1 < totalPages1) {
      setCurrentPage1(currentPage1 + 1);
    }
  };

  const itemsPerPage2 = 4;
  const startIndex2 = (currentPage2 - 1) * itemsPerPage2;
  const endIndex2 = startIndex2 + itemsPerPage2;
  const currentRows2 = lastRequests.slice(startIndex2, endIndex2);
  const totalPages2 = Math.ceil(lastRequests.length / itemsPerPage2);

  // Role-Based Buttons
   useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        refreshAccessToken().then((newToken) => {
          if (!newToken) return;
          const newDecoded = jwtDecode(newToken);
          setUserRole(newDecoded.role);
        });
      } else {
        setUserRole(decoded.role);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);


  // Pagination handler for Requested Additional Details 
  const handlePrevNext2 = (direction) => {
    if (direction === "prev" && currentPage2 > 1) {
      setCurrentPage2(currentPage2 - 1);
    }
    if (direction === "next" && currentPage2 < totalPages2) {
      setCurrentPage2(currentPage2 + 1);
    }
  };


  const loadUser = async () => {
  const user = await getLoggedUserId();
  setUserData(user);
  setDrcId(user.drc_id);
  setRoId(user.ro_id);
  };

  useEffect(() => {
  loadUser();
  }, []);

  const payload = {
    case_id : caseid || 250 ,
    drc_id: drcId || 200 ,
    ro_id: roId || null,
  };

  //form initialization
  const initialFormData = {
    caseId: caseid,
    customerRef: null,
    accountNo: null,
    arrearsAmount: null,
    lastPaymentDate: null,
    request_description: null,
    createdDtm: null,
    field_reason: null, // Use field_reason instead of reason
    remark: null,
    ini_amount: null,
    month: 3,
    from: null,
    to: null,
    settlement_remark: null,
    drcId: drcId,
    roId: roId || null,
    requestId: null,

    request: null,
    request_remark: null,
    intraction_id: null, // Use intraction_id instead of intractionId
    todo: null,
    completed: null,
    reason_id: "", // Use reason_id instead of reasonId
    ref_products: [],
  };
  const [formData, setFormData] = useState(initialFormData);
  
  useEffect(() => {
    const getcasedetails = async () => {
      try {
        if (drcId) {
          const payload = {
            drc_id : parseInt(drcId),
            case_id : parseInt(caseid),
            ro_id : roId,
          }  

          const caseDetails = await drcCaseDetails(payload);
          console.log("Payload for case details:", payload);
          setCaseDetails(caseDetails.data[0]);
          //console.log("Case Details Passed to the setCaseDetails:", caseDetails);
        }
      } catch (error) {
        console.error("Error fetching case details:", error.message);
      }
    } 
    const fetchRORequests = async () => {
      try {
        const RO_Requests = await getActiveRORequestsforNegotiationandMediation("Negotiation");
        setActiveRORequests(RO_Requests);
      } catch (error) {
        console.error("Error fetching active requests:", error.message);
      }
    };
    const fetchFieldRequest = async () => {
      try {
        const field_request = await fetchActiveNegotiations();
        setActiveNegotiations(field_request);
      } catch (error) {
        console.error("Error fetching field reason:", error.message);
      }
    };
    fetchFieldRequest();
    getcasedetails();
    fetchRORequests();
  }, [drcId, roId]);
  
  //calculate date from /to in settlement plan
  useEffect(() => {
    calculateDates(formData.month);
  }, [formData.month]);

  function calculateDates(month) {
    if (month < 1 || month > 3) {
      console.error("Month should be in the range of 1 to 3");
      return;
    }

    const currentDate = new Date();
    let fromDate = new Date(currentDate);
    if (currentDate.getDate() !== 1) {
      fromDate.setMonth(fromDate.getMonth() + 1);
      fromDate.setDate(1);
    }

    const toDate = new Date(fromDate);
    toDate.setMonth(toDate.getMonth() + month + 1);
    toDate.setDate(0);

    setFormData((prevFormData) => ({
      ...prevFormData,
      from: fromDate.toISOString().split("T")[0],
      to: toDate.toISOString().split("T")[0],
    }));
  }
  const handleNegotiationSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
    if (!formData.case_id) newErrors.case_id = "Case ID is required.";
    if (!formData.field_reason) newErrors.field_reason = "Field reason is required.";
    if (!formData.remark) newErrors.remark = "Remark is required.";
    if (!formData.request) newErrors.request = "Request is required.";
    if (!formData.request_remark) newErrors.request_remark = "Request remark is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); 
      return; 
    };
    
    try {
      // Find the selected request details
      const selectedRequest = activeRORequests.find(
        (request) => request.ro_request_id === parseInt(formData.request_id)
      );
      formData.request_description = selectedRequest.request_description;
      formData.intraction_id = selectedRequest.intraction_id;
  
      if (!selectedRequest) {
        alert("Invalid request selected.");
        return;
      }

      console.log("Form Data:", formData);
      const DRC_ID = initialFormData.drcId;
      console.log("Form data drc id :",  DRC_ID);
      await addNegotiationCase(formData , DRC_ID);
      alert("Submitted successfully!");
      Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data sent successfully.",
          confirmButtonColor: "#28a745",
        });
      setFormData(initialFormData);
      setIsSubmitted(true);
      setErrors({});
    } catch (error) {
      console.error("Error submitting form data:", error.message);
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred. Please try again.";

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#d33",
        });
    }
  };

  useEffect(() => {
    if (drcId && roId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        drc_id: drcId,
        ro_id: roId,
      }));
    }
  }, [drcId, roId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //fetch data for the field reason dropdown
    if (name === "reason") {
      const selectedNegotiation = activeNegotiations.find(
        (negotiation) => negotiation.negotiation_description === value
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        reasonId: selectedNegotiation ? selectedNegotiation.negotiation_id : "", //set the negotiation id
        [name]: value,
      }));
    }
    //fetch data for the request dropdown
    if (name === "request") {
      const selectedRORequests = activeRORequests.find(
        (RO_Requests) => RO_Requests.request_description === value
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        requestId: selectedRORequests ? selectedRORequests.ro_request_id : "", //set the request id
        intractionId: selectedRORequests
          ? selectedRORequests.intraction_id
          : "",
        [name]: value,
      }));
    } else if (name === "month") {
      const monthValue = parseInt(value, 10);
      if (monthValue >= 1 && monthValue <= 3) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: monthValue,
        }));
      } else {
        console.error("Month should be in the range of 1 to 3");
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  //load response history data
  const handleResponseHistoryClick = async () => {
    setShowResponseHistory(!showResponseHistory);
    if (!showResponseHistory) {
      try {
        const lastRequests = caseDetails.ro_requests
          ? caseDetails.ro_requests.map((ro_request) => ({
              createdDtm: ro_request.created_dtm,
              field_reason: ro_request.ro_request,
              remark: ro_request.ro_request_remark ? ro_request.ro_request_remark :  "",
            }))
          : [];
        setLastRoRequests(lastRequests);
        
        const lastNagotiation = caseDetails.ro_negotiation
        ? caseDetails.ro_negotiation.map((ro_nago) => ({
            createdDtm: ro_nago.created_dtm,
            field_reason: ro_nago.feild_reason,
            remark: ro_nago.remark ? ro_nago.remark :  "",
          }))
        : [];
        setLastRONagotiation(lastNagotiation);

        const lastPayment = caseDetails.money_transactions
        ? caseDetails.money_transactions.map((ro_payment) => ({
            createdDtm: ro_payment.payment_Dtm,
            paid_amount: ro_payment.payment,
            settled_balance: ro_payment.settle_balanced ? ro_payment.settle_balanced :  "",
          }))
        : [];
        setLastROPayment(lastPayment);

      } catch (error) {
        console.error("Error fetching negotiation history:", error.message);
      }
    }
  };

  const [showDetailedView, setShowDetailedView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate(); // Initialize navigate function

  const handleIconClickbutton = (actionType, product) => {
    if (actionType === "Not Submit") {
      console.log("this is the form data ", formData);
      setSelectedProduct(product);
      setShowDetailedView(false);  
      navigate("/drc/customer-negotiation-editcpe", {
        state: {
         
          product: product,
          caseId: payload.case_id,
          drcId: formData.drcId,  // Pass drcId here
          customerRef: caseDetails.customer_ref,
          accountNo: formData.accountNo ,  // Assuming product object has caseId, customerRef, Service_address
          serviceAddress: product.Service_address,
        }
      });

    }else{
      setSelectedProduct(product); 
      setShowDetailedView(true); 
    }


  };

  const handleBack = () => {
    navigate ("/drc/ro-s-assigned-case-log") ; // Go back to the previous page
  };


  //common style for card container
  const style = {
    thStyle: "text-left font-bold text-black text-l",
    tdStyle: "text-left text-l text-black px-2",
  };

  const renderNegotiationView = () => (
    <div>
      <div className=" p-6 rounded-lg ">
        {/* Case Details Card */}
        <div className="flex justify-center items-center">
        <div className={`${GlobalStyle.cardContainer}`}>
          <table className={`${GlobalStyle.table} `}>
            <tbody>
              <tr>
                <th className={style.thStyle}>Case ID</th>
                <td className={style.tdStyle}>:</td>
                <td className={style.tdStyle}>{caseDetails.case_id}</td>
              </tr>
              <tr>
                <th className={style.thStyle}>Customer Ref</th>
                <td className={style.tdStyle}>:</td>
                <td className={style.tdStyle}>{caseDetails.customer_ref}</td>
              </tr>
              <tr>
                <th className={style.thStyle}>Account No</th>
                <td className={style.tdStyle}>:</td>
                <td className={style.tdStyle}>{caseDetails.account_no}</td>
              </tr>
              <tr>
                <th className={style.thStyle}>Arrears Amount</th>
                <td className={style.tdStyle}>:</td>
                <td className={style.tdStyle}>{caseDetails.current_arrears_amount}</td>
              </tr>
              <tr>
                <th className={style.thStyle}>Last Payment Date</th>
                <td className={style.tdStyle}>:</td>
                <td className={style.tdStyle}>
                {new Date(caseDetails.last_payment_date).toLocaleDateString('en-GB',
                 {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
        <div
          className={`${GlobalStyle.tableContainer} bg-white bg-opacity-50 p-8 w-[60%] max-w-[1200px] mx-auto`}
        > 
            <div >
            <div className="flex flex-col space-y-4 items-center justify-center">
              {/* Reason Selection */}
              <div className="flex items-center gap-4 w-full">
                <label className={`${GlobalStyle.remarkTopic} `}>
                  Field Reason
                </label>
                <label className={`${GlobalStyle.remarkTopic} ml-5 `}>:</label>
                <select
                  name="reason"
                  value={formData.reason || ""}
                  onChange={handleInputChange}
                  className={`${GlobalStyle.selectBox} ml-2 `}
                >
                  <option value="" hidden>Select Reason</option>
                  {activeNegotiations.map((negotiation) => (
                    <option
                      key={negotiation.negotiation_id}
                      value={negotiation.negotiation_description}
                    >
                      {negotiation.negotiation_description}
                    </option>
                  ))}
                </select>
              </div>
              {errors.reason && (
                <div className="text-red-500 text-sm ml-36 mb-5">
                  {errors.reason}
                </div>
              )}

              {/* reason remark */}
              {formData.reason && (
              <div className="flex items-center gap-4 w-full">
                <label className={`${GlobalStyle.remarkTopic} `}>
                  Reason Remark
                </label>
                <label className={`${GlobalStyle.remarkTopic} `}>:</label>
                <textarea
                  name="nego_remark"
                  value={formData.nego_remark || ""}
                  onChange={handleInputChange}
                  className={`${GlobalStyle.remark} ml-2`}
                  rows={4}
                />
              </div>
              )}
              {errors.nego_remark && (
                <div className="text-red-500 text-sm ml-1/4">
                  {errors.nego_remark}
                </div>
              )}

              {/* request selection */}
              <div className="flex items-center gap-4 w-full">
                <label className={`${GlobalStyle.remarkTopic} mr-3 `}>
                  Request
                </label>
                <label className={`${GlobalStyle.remarkTopic} ml-10`}>:</label>
                <select
                  name="request" 
                  value={formData.request || ""}
                  onChange={handleInputChange}
                  className={`${GlobalStyle.selectBox} ml-3`}
                >
                  <option value="" hidden>Select Request</option>
                  {activeRORequests.map((RO_Requests) => (
                    <option
                      key={RO_Requests.ro_request_id}
                      value={RO_Requests.request_description}
                    >
                      {RO_Requests.request_description}
                    </option>
                  ))}
                </select>
              </div>
              {errors.request && (
                <div className="text-red-500 text-sm ml-36 mb-5">
                  {errors.request}
                </div>
              )}
              {/* request remark */}
              {formData.request && (
              <div className="flex items-center gap-4 w-full">
                <label className={`${GlobalStyle.remarkTopic} `}>
                  Request Remark
                </label>
                <label className={`${GlobalStyle.remarkTopic} mr-2`}>:</label>
                <textarea
                  name="request_remark"
                  value={formData.request_remark || ""}
                  onChange={handleInputChange}
                  className={`${GlobalStyle.remark} `}
                  rows={4}
                />
              </div>
              )}
              {errors.request_remark && (
                <div className="text-red-500 text-sm ml-1/4">
                  {errors.request_remark}
                </div>
              )}
            </div>
            </div>

            {/* settlement plan */}
            {formData.reason === "Agreed To Settle" && (
              <div className="flex justify-center items-center">
              <div className="space-y-4 mb-6 mt-4 ">
                <div>
                   <h1 className={`${GlobalStyle.headingMedium} mt-6 mb-4 text-center underline`}>
                    <strong>Settlement Plan Creation</strong>
                  </h1>
                </div>
                <div className="flex-col space-y-4 items-center justify-center">
                  <div className="flex items-center gap-4">
                    <label className={`${GlobalStyle.remarkTopic} `}>
                      Initial Amount
                    </label>
                    <label className={`${GlobalStyle.remarkTopic} ml-3`}>:</label>
                    <input
                      type="text"
                      name="ini_amount"
                      value={formData.ini_amount}
                      onChange={handleInputChange}
                      className={`${GlobalStyle.inputText} ml-1 `}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className={`${GlobalStyle.remarkTopic} `}>
                      Calendar Month
                    </label>
                    <label className={`${GlobalStyle.remarkTopic} `}>:</label>
                    <input
                      type="number"
                      name="month"
                      value={formData.month}
                      onChange={handleInputChange}
                      className={`${GlobalStyle.inputText} ml-1`}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className={`${GlobalStyle.remarkTopic}`}>
                      Duration
                    </label>
                    <label className={`${GlobalStyle.remarkTopic} `}>:</label>
                    <div className="flex items-center gap-4 ">
                      <label className={GlobalStyle.remarkTopic}>From:</label>
                      <input
                        type="date"
                        name="from"
                        id="fromDate"
                        value={formData.from}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} `}
                        disabled
                      />
                      <label className={GlobalStyle.remarkTopic}>To:</label>
                      <input
                        type="date"
                        name="to"
                        id="toDate"
                        value={formData.to}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} `}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <label className={`${GlobalStyle.remarkTopic} mr-7 `}>
                      Remark
                    </label>
                    <label className={`${GlobalStyle.remarkTopic} ml-8`}>:</label>
                    <textarea
                      name="settle_remark"
                      value={formData.settle_remark || ""}
                      onChange={handleInputChange}
                      className={`${GlobalStyle.remark} `}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              </div>
            )}
            <div className="flex justify-end mb-8 mt-3 ">
              <div>
                {["admin", "superadmin", "slt" , "drc_user", "drc_admin"].includes(userRole) && (
                  <button
                  onClick={handleNegotiationSubmit}
                  className={GlobalStyle.buttonPrimary}
                >
                  Submit
                </button>
                  )}
                </div>
              {/* <button
                onClick={handleNegotiationSubmit}
                className={GlobalStyle.buttonPrimary}
              >
                Submit
              </button> */}
            </div>
            </div>
      </div>

      <div>
        <div className="flex justify-start gap-4 mb-8">
          <div>
            {["admin", "superadmin", "slt" , "drc_user", "drc_admin"].includes(userRole) && (
              <button
                onClick={handleResponseHistoryClick}
                className={GlobalStyle.buttonPrimary}
              >
                Response History
              </button>
              )}
            </div>
          {/* <button
            onClick={handleResponseHistoryClick}
            className={GlobalStyle.buttonPrimary}
          >
            Response History
          </button> */}
        </div>
        {/* Load after clicking response history button */}
        {showResponseHistory && (
          <div className="mb-8">
            <h3 className={`${GlobalStyle.headingMedium} mb-4`}>
              Last Negotiation Details
            </h3>
            <div className={GlobalStyle.tableContainer}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th className={GlobalStyle.tableHeader}>Date</th>
                    <th className={GlobalStyle.tableHeader}>Negotiation</th>
                    <th className={GlobalStyle.tableHeader}>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.length > 0 ? (
                    currentRows.map((nago, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0
                            ? GlobalStyle.tableRowEven
                            : GlobalStyle.tableRowOdd
                        }
                      >
                        <td className={GlobalStyle.tableData}>
                          {new Date(nago.createdDtm).toLocaleDateString("en-GB")}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {nago.field_reason}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {nago.remark}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                        No Last negotiations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
             {/* Pagination for Last Negotiation Details */}
             <div className={GlobalStyle.navButtonContainer}>
              <button
                onClick={() => handlePrevNext("prev")}
                disabled={currentPage === 1}
                className={`${GlobalStyle.navButton} ${
                  currentPage === 1 ? "cursor-not-allowed" : ""
                }`}
              >
                <FaArrowLeft />
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePrevNext("next")}
                disabled={currentPage === totalPages}
                className={`${GlobalStyle.navButton} ${
                  currentPage === totalPages ? "cursor-not-allowed" : ""
                }`}
              >
                <FaArrowRight />
              </button>
            </div>


          {/* Payment Details Table */}
          <h3 className={`${GlobalStyle.headingMedium} mt-8 mb-4`}>
            Payment Details
          </h3>
          <div className={GlobalStyle.tableContainer}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th className={GlobalStyle.tableHeader}>Date</th>
                    <th className={GlobalStyle.tableHeader}>Paid Amount</th>
                    <th className={GlobalStyle.tableHeader}>Settled Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows1.length > 0 ? (
                    currentRows1.map((pay, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0
                            ? GlobalStyle.tableRowEven
                            : GlobalStyle.tableRowOdd
                        }
                      >
                        <td className={GlobalStyle.tableData}>
                          {new Date(pay.createdDtm).toLocaleDateString("en-GB")}
                        </td>
                        <td className={GlobalStyle.tableCurrency}>
                          {pay.paid_amount}
                        </td>
                        <td className={GlobalStyle.tableCurrency}>
                          {pay.settled_balance}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                        No Payment Details found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Payment Details */}
            <div className={GlobalStyle.navButtonContainer}>
              <button
                onClick={() => handlePrevNext1("prev")}
                disabled={currentPage1 === 1}
                className={`${GlobalStyle.navButton} ${
                  currentPage1 === 1 ? "cursor-not-allowed" : ""
                }`}
              >
                <FaArrowLeft />
              </button>
              <span>
                Page {currentPage1} of {totalPages1}
              </span>
              <button
                onClick={() => handlePrevNext1("next")}
                disabled={currentPage1 === totalPages1}
                className={`${GlobalStyle.navButton} ${
                  currentPage1 === totalPages1 ? "cursor-not-allowed" : ""
                }`}
              >
                <FaArrowRight />
              </button>
            </div>

            {/* Requested Additional Details Table */}

            <h3 className={`${GlobalStyle.headingMedium} mt-8 mb-4`}>
              Requested Additional Details
            </h3>

            <div className={GlobalStyle.tableContainer}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th className={GlobalStyle.tableHeader}>Date</th>
                    <th className={GlobalStyle.tableHeader}>Request</th>
                    <th className={GlobalStyle.tableHeader}>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows2.length > 0 ? (
                    currentRows2.map((nago, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0
                            ? GlobalStyle.tableRowEven
                            : GlobalStyle.tableRowOdd
                        }
                      >
                        <td className={GlobalStyle.tableData}>
                          {new Date(nago.createdDtm).toLocaleDateString("en-GB")}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {nago.field_reason}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {nago.remark}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                        No Additional Details Available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Requested Additional Details */}
             <div className={GlobalStyle.navButtonContainer}>
              <button
                onClick={() => handlePrevNext2("prev")}
                disabled={currentPage2 === 1}
                className={`${GlobalStyle.navButton} ${
                  currentPage2 === 1 ? "cursor-not-allowed" : ""
                }`}
              >
                <FaArrowLeft />
              </button>
              <span>
                Page {currentPage2} of {totalPages2}
              </span>
              <button
                onClick={() => handlePrevNext2("next")}
                disabled={currentPage2 === totalPages2}
                className={`${GlobalStyle.navButton} ${
                  currentPage2 === totalPages2 ? "cursor-not-allowed" : ""
                }`}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCPEView = () => {
    return (
      <div>
        {/* Case Details Section */}
        <div className="flex justify-center items-center mt-6 mb-4">
          <div className={`${GlobalStyle.cardContainer} `}>
            <table className={GlobalStyle.table}>
              <tbody>
                <tr>
                  <th className={style.thStyle}>Case ID</th>
                  <td className={style.tdStyle}>:</td>
                  <td className={style.tdStyle}>{caseDetails.case_id}</td>
                </tr>
                <tr>
                  <th className={style.thStyle}>Customer Ref</th>
                  <td className={style.tdStyle}>:</td>
                  <td className={style.tdStyle}>{caseDetails.customer_ref}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Table Section */}
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>Telephone No</th>
                <th className={GlobalStyle.tableHeader}>Account No</th>
                <th className={GlobalStyle.tableHeader}>Service Type</th>
                <th className={GlobalStyle.tableHeader}>Ownership</th>
                <th className={GlobalStyle.tableHeader}>RTOM</th>
                <th className={GlobalStyle.tableHeader}>RCMP Status</th>
                <th className={GlobalStyle.tableHeader}> </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(caseDetails.ref_products) && caseDetails.ref_products.length > 0 ? (
                caseDetails.ref_products.map((product, index) => {
                  const isEvenRow = index % 2 === 0;
                  const rowClass = isEvenRow
                    ? "bg-white bg-opacity-75"
                    : "bg-gray-50 bg-opacity-50";
                  const status = isEvenRow ? "Submitted" : "Not Submitted";
                  const icon = isEvenRow ? viewIcon : editIcon;
                  const actionType = isEvenRow ? "view" : "edit";
  
                  return (
                    <tr key={product.product_id || index} className={`${rowClass} border-b`}>
                      <td className={GlobalStyle.tableData}>
                        {product.product_label || "N/A"}
                      </td>
                      <td className={GlobalStyle.tableData}>{product.product_label || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{product.service || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>
                        {product.product_ownership || "N/A"}
                      </td>
                      <td className={GlobalStyle.tableData}>{product.rtom || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{product.product_status || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>
                        <img 
                          src={product.product_status === "Not Submit" ? editIcon : viewIcon} 
                          alt="Product Icon" 
                          width={24} 
                          height={24} 
                          style={{ cursor: "pointer" }}
                          data-tooltip-id="tooltip"
                          data-tooltip-content={product.product_status === "Not Submit" ? "Edit" : "View"}
                          onClick={() => handleIconClickbutton(product.product_status,product)}
                        />
                        <Tooltip id="tooltip" place="bottom" className="tooltip"  />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className={`${GlobalStyle.tableData} text-center`}>
                    No products available
                  </td> 
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  {/*Deatils View */}
  const renderDetailedView = () => (
    <div className="p-6 rounded-lg ml-32">
      <div className={`${GlobalStyle.cardContainer}`}>
        <table>
          <tbody>
          <tr>
              <th className={style.thStyle}>Case ID</th>
              <td className={style.tdStyle}>:</td>
              <td className={style.tdStyle}>{caseDetails.case_id}</td>
              </tr>
              <tr>
              <th className={style.thStyle}>Customer Ref</th>
              <td className={style.tdStyle}>:</td>
              <td className={style.tdStyle}>{caseDetails.customer_ref}</td>
            </tr>
            <tr>
              <th className={style.thStyle}>Service Address</th>
              <td className={style.tdStyle}>:</td>
              <td className={style.tdStyle}>{selectedProduct.service_address}</td>
            </tr>
          </tbody>
        </table>
            <h1 className={`${style.thStyle} underline mt-6 mb-4`}>CPE Details</h1>
        <table>
          <tbody>
            <tr>
              <th className={style.thStyle}>Telephone No</th>
              <td className={style.tdStyle}>:</td>
              <td className={style.tdStyle}>{selectedProduct.product_label}</td>
            </tr>
              {/* <tr>
              <th className={style.thStyle}>Account No</th>
              <td className={style.tdStyle}>:</td>
              <td className={style.tdStyle}>{formData.accountNo}</td>
            </tr> */}
            <tr>
              <th className={style.thStyle}>Service Type</th>
              <td className={style.tdStyle}>:</td>
              <td className={style.tdStyle}>{selectedProduct.service || "N/A"}</td>
            </tr>
            <tr>
              <th className={style.thStyle}>Ownership</th>
              <td className={style.tdStyle}>:</td>
              <td className={style.tdStyle}>{selectedProduct.product_ownership || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={`${GlobalStyle.cardContainer}`}>
        <h1 className={`${style.thStyle} underline mt-4 mb-4`}>RCMP Details</h1>
        <table>
          <tbody>
          <tr>
              <th className={style.thStyle}> Status</th>
              <td className={style.tdStyle}>:</td>
              <td className={style.tdStyle}>{ }</td>
            </tr>
            <tr>
              <th className={style.thStyle}>Status DTM</th>
              <td className={style.tdStyle}>:</td>
              <td className={style.tdStyle}>{ }</td>
            </tr>
            <tr>
              <th className={style.thStyle}>Submission Date </th>
              <td className={style.tdStyle}>:</td>
              <td className={style.tdStyle}>{ }</td>
            </tr>
            <tr>
              <th className={style.thStyle}>Response Date </th>
              <td className={style.tdStyle}>:</td>
              <td className={style.tdStyle}>{ }</td>
            </tr>
            <tr>
              <th className={style.thStyle}>Response Reason</th>
              <td className={style.tdStyle}>:</td>
              <td className={style.tdStyle}>{ }</td>
            </tr>
          </tbody>
        </table>

      </div>
      {/* Back Button */}
      {/* <button
        className="px-6 py-2 mb-8 mt-8 mr-auto rounded-md"
        onClick={() => {
          setActiveTab("cpe"); // Switch back to CPE view
          setShowDetailedView(false); // Hide detailed view
        }}
      > */}
        <button className={GlobalStyle.buttonPrimary}  
        onClick={() => {
          setActiveTab("cpe"); // Switch back to CPE view
          setShowDetailedView(false); // Hide detailed view
        }}>
         <FaArrowLeft className="mr-2" />
        </button>

      {/* </button>    */}
    </div>
  );
  return (
    <div className="p-4 min-h-screen">
      <h1 className={`${GlobalStyle.headingLarge} mb-6`}>
        {activeTab === "negotiation" ? "Customer Negotiation" : "CPE Collect"}
      </h1>
  
      {/* Tab Navigation */}
      <div className="flex">
        <button
          className={`px-8 py-3 rounded-t-lg font-medium ${
            activeTab === "negotiation"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("negotiation")}
        >
          Customer Negotiation
        </button>
        <button
          className={`px-8 py-3 rounded-t-lg font-medium ${
            activeTab === "cpe"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-500"
          }`}
          onClick={() => {
            if (actiontype === "Arrears Collect"){
              return; // Prevent tab switch
            }
            setActiveTab("cpe");
          }}
        >
          CPE Collect
        </button>
      </div>

      {/* Conditional Rendering */}
      {showDetailedView ? renderDetailedView() : activeTab === "negotiation" ? renderNegotiationView() : renderCPEView()}

      {/* Back Button */}

      <div className="mt-4" style={{ cursor: 'pointer' }}>
          {/* <img
            src={back}
            alt="Back"
            title="Back"
            style={{ width: "50px", height: "auto" }}
          /> */}
           <button className={GlobalStyle.buttonPrimary} onClick={handleBack}>
         <FaArrowLeft className="mr-2" />
        </button>
        </div>

    </div>

    
  );
      
};

export default Cus_Nego_Customer_Negotiation; 