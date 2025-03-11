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

import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";




const Cus_Nego_Customer_Negotiation = () => {
  
  const [activeTab, setActiveTab] = useState("negotiation");
  const [showResponseHistory, setShowResponseHistory] = useState(false);
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);
  const [lastRequests, setLastRoRequests] = useState([]);
  const [lastNagotiation, setLastRONagotiation] = useState([]);
  const [lastPayment, setLastROPayment] = useState([]);
  const [activeNegotiations, setActiveNegotiations] = useState([]); // State for active negotiations
  const [activeRORequests, setActiveRORequests] = useState([]);
  const [caseDetails, setCaseDetails] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const rowsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  //pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = Array.isArray(lastNagotiation)
    ? lastNagotiation.slice(indexOfFirstRow, indexOfLastRow)
    : [];
  const totalPages = Math.ceil((lastNagotiation?.length || 0) / rowsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const payload = {
    case_id :8,
    drc_id:200,
    ro_id:1
  };
  //form initialization
  const initialFormData = {
    caseId: payload.case_id,
    customerRef: "",
    accountNo: "",
    arrearsAmount: "",
    lastPaymentDate: "",
    request_description: "",
    createdDtm: "",
    fieldReason: "",
    remark: "",
    ini_amount: "",
    month: 3,
    from: "",
    to: "",
    settle_remark: "",
    drcId: payload.drc_id,
    roId: payload.ro_id ? payload.ro_id : null,
    requestId: "",
    request: "",
    request_remark: "",
    intractionId: "",
    todo: "",
    completed: "",
    reasonId: "",
    reason: "",
    nego_remark: "",
    ref_products: [] // Initialize ref_products as an empty array
  };
  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    const getcasedetails = async () => {
      try {
        const caseDetails = await drcCaseDetails(payload);
        setCaseDetails(caseDetails.data);
        // console.log("case detaoils", caseDetails.data);
      } catch (error) {
        console.error("Error fetching case details:", error.message);
      }
    } 
    const fetchRORequests = async () => {
      try {
        const RO_Requests = await getActiveRORequestsforNegotiationandMediation("Negotiation");
        console.log("RO requests:", RO_Requests);
        setActiveRORequests(RO_Requests);
      } catch (error) {
        console.error("Error fetching active requests:", error.message);
      }
    };
    const fetchFieldRequest = async () => {
      try {
        const field_request = await fetchActiveNegotiations();
        // console.log("Field Reason :", field_request);
        setActiveNegotiations(field_request);
      } catch (error) {
        console.error("Error fetching field reason:", error.message);
      }
    };
    fetchFieldRequest();
    getcasedetails();
    fetchRORequests();
  }, []);
  
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
    if (!formData.caseId) newErrors.caseId = "Case ID is required.";
    if (!formData.reason) newErrors.reason = "Reason is required.";
    if (!formData.nego_remark) newErrors.nego_remark = "Remark is required." ;
    if (!formData.request) newErrors.request = "Request is required.";
    if (!formData.request_remark) newErrors.request_remark = "Request remark is required.";
    if (Object.keys(newErrors).length > 0) {
      console.log("this is the errors" , newErrors, "this is the data", formData);
      setErrors(newErrors); 
      return; 
    };
    
    try {

      // Find the selected request details
      const selectedRequest = activeRORequests.find(
          (request) => request.ro_request_id === parseInt(formData.requestId)
      );
      formData.request_description = selectedRequest.request_description;
      formData.intractionId = selectedRequest.intraction_id;
      console.log("this is the selected requiest ",formData.request_description);
      // Ensure selected request exists before submission
      if (!selectedRequest) {
          alert("Invalid request selected.");
          return;
      }

      const subpayload = 
      {...formData,
      };
      console.log(subpayload);
      await addNegotiationCase(subpayload);
      console.log("Form data submitted successfully:", formData);
      alert("Submitted successfully!");
      setFormData(initialFormData);
      setIsSubmitted(true);
      setErrors({});
    } catch (error) {
      console.error("Error submitting form data:", error.message);
    }
  };

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
            field_reason: ro_nago.field_reason,
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
  const [showEditForm, setShowEditForm] = useState(false);  // For edit form visibility
  const navigate = useNavigate(); // Initialize navigate function

  

  const handleIconClick = (actionType, product) => {
    if (actionType === "view") {
      setSelectedProduct(product);  // Set the selected product for detailed view
      setShowDetailedView(true);    // Show the detailed view
      setShowEditForm(false);       // Ensure edit form is hidden
    } else if (actionType === "edit") {
      setSelectedProduct(product);  // Set the selected product for edit form
      setShowEditForm(true);        // Show the edit form
      setShowDetailedView(false);   // Ensure detailed view is hidden
  
      // Include caseId, customerRef, and Service_address when navigating to edit page
      navigate("/drc/customer-negotiation-editcpe", {
        state: {
          product: product,
          caseId: payload.case_id,
          drcId: formData.drcId,  // Pass drcId here
         customerRef: formData.customerRef,
           accountNo: formData.accountNo ,  // Assuming product object has caseId, customerRef, Service_address
          serviceAddress: product.Service_address,
           // Ensure other relevant details are passed
        }
      });
    }
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

        <div className="flex flex-col space-y-4 w-3/4">
          {/* Reason Selection */}
          <div className="flex items-center gap-4 w-full">
            <label className={`${GlobalStyle.remarkTopic} w-1/4`}>
              Field Reason
            </label>
            <label className={`${GlobalStyle.remarkTopic} w-1/4`}>:</label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className={`${GlobalStyle.selectBox} w-3/4`}
            >
              <option value="">Select Reason</option>
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
            <label className={`${GlobalStyle.remarkTopic} w-1/4`}>
              Reason Remark
            </label>
            <label className={`${GlobalStyle.remarkTopic} w-1/4`}>:</label>
            <textarea
              name="nego_remark"
              value={formData.nego_remark}
              onChange={handleInputChange}
              className={`${GlobalStyle.remark} w-3/4`}
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
            <label className={`${GlobalStyle.remarkTopic} w-1/4`}>
              Request
            </label>
            <label className={`${GlobalStyle.remarkTopic} w-1/4`}>:</label>
            <select
              name="request"
              value={formData.request}
              onChange={handleInputChange}
              className={`${GlobalStyle.selectBox} w-3/4`}
            >
              <option value="">Select Request</option>
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
            <label className={`${GlobalStyle.remarkTopic} w-1/4`}>
              Request Remark
            </label>
            <label className={`${GlobalStyle.remarkTopic} w-1/4`}>:</label>
            <textarea
              name="request_remark"
              value={formData.request_remark}
              onChange={handleInputChange}
              className={`${GlobalStyle.remark} w-3/4`}
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

        {/* settlement plan */}
        {formData.reason === "Agreed To Settle" && (
          <div className="space-y-4 mb-6 w-3/4">
            <div>
              <h1 className="font-bold text-xl underline">
                Settlement Creation Plan{" "}
              </h1>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <label className={`${GlobalStyle.remarkTopic} w-32`}>
                  Initial Amount
                </label>
                <label className={`${GlobalStyle.remarkTopic} w-32`}>:</label>
                <input
                  type="text"
                  name="ini_amount"
                  value={formData.ini_amount}
                  onChange={handleInputChange}
                  className={`${GlobalStyle.inputText} flex-1`}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className={`${GlobalStyle.remarkTopic} w-32`}>
                  Calendar Month
                </label>
                <label className={`${GlobalStyle.remarkTopic} w-32`}>:</label>
                <input
                  type="number"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className={`${GlobalStyle.inputText} flex-1`}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className={`${GlobalStyle.remarkTopic} w-32`}>
                  Duration
                </label>
                <label className={`${GlobalStyle.remarkTopic} w-32`}>:</label>
                <div className="flex items-center gap-4 flex-1">
                  <label className={GlobalStyle.remarkTopic}>From:</label>
                  <input
                    type="date"
                    name="from"
                    id="fromDate"
                    value={formData.from}
                    onChange={handleInputChange}
                    className={`${GlobalStyle.inputText} flex-1`}
                    disabled
                  />
                  <label className={GlobalStyle.remarkTopic}>To:</label>
                  <input
                    type="date"
                    name="to"
                    id="toDate"
                    value={formData.to}
                    onChange={handleInputChange}
                    className={`${GlobalStyle.inputText} flex-1`}
                    disabled
                  />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <label className={`${GlobalStyle.remarkTopic} w-32`}>
                  Remark
                </label>
                <label className={`${GlobalStyle.remarkTopic} w-32`}>:</label>
                <textarea
                  name="settle_remark"
                  value={formData.settle_remark}
                  onChange={handleInputChange}
                  className={`${GlobalStyle.remark} flex-1`}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end mb-8 mt-3 w-3/4">
          <button
            onClick={handleNegotiationSubmit}
            className={GlobalStyle.buttonPrimary}
          >
            Submit
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-start gap-4 mb-8">
          <button
            onClick={handleResponseHistoryClick}
            className={GlobalStyle.buttonPrimary}
          >
            Response History
          </button>
        </div>
        {/* Load after clicking response history button */}
        {showResponseHistory && (
          <div className="mb-8">
            <h3 className={`${GlobalStyle.headingMedium} mb-4`}>
              Last Negotiation Details
            </h3>
            <div className={GlobalStyle.tableContainer}>
              <table className={GlobalStyle.table}>
                <thead>
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
                          {new Date(nago.createdDtm).toLocaleDateString()}
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
                      <td colSpan="3" className={GlobalStyle.tableData}>
                        No Last negotiations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className={GlobalStyle.navButtonContainer}>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={GlobalStyle.navButton}
                >
                  <FaArrowLeft />
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={GlobalStyle.navButton}
                >
                  <FaArrowRight />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderCPEView = () => {
    return (
      <div>
        {/* Case Details Section */}
        <div className="p-6 rounded-lg ml-8">
          <div className={`${GlobalStyle.cardContainer}`}>
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
                      <td className={GlobalStyle.tableData}>{product.accountNo || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{product.service || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>
                        {product.product_ownership || "N/A"}
                      </td>
                      <td className={GlobalStyle.tableData}>{product.rtom || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{status}</td>
                      <td className={GlobalStyle.tableData}>
                        <img
                          src={icon}
                          width="20"
                          height="20"
                          alt={actionType}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleIconClick(actionType, product)}
                        />
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
          <td className={style.tdStyle}>{selectedProduct.Service_address}</td>
        </tr>

        <h1 className={`${style.thStyle} underline mt-6 mb-4`}>CPE Details</h1>


        <tr>
          <th className={style.thStyle}>Telephone No</th>
          <td className={style.tdStyle}>:</td>
          <td className={style.tdStyle}>{selectedProduct.product_label}</td>
        </tr>
        <tr>
        <th className={style.thStyle}>Account No</th>
        <td className={style.tdStyle}>:</td>
        <td className={style.tdStyle}>{formData.accountNo}</td>
      </tr>
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

      </div>


      <div className={`${GlobalStyle.cardContainer}`}>
      <h1 className={`${style.thStyle} underline mt-4 mb-4`}>RCMP Details</h1>
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
      </div>
      


      {/* Back Button */}
      <button
        className="px-6 py-2 mb-8 mt-8 mr-auto rounded-md"
        onClick={() => {
          setActiveTab("cpe"); // Switch back to CPE view
          setShowDetailedView(false); // Hide detailed view
        }}
      >
        <img src={Backbtn} alt="Back" className="w-7 h-7" />
  
      </button>
      
      
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
          onClick={() => setActiveTab("cpe")}
        >
          CPE Collect
        </button>
      </div>
  
      {/* Conditional Rendering */}
      {showDetailedView ? renderDetailedView() : activeTab === "negotiation" ? renderNegotiationView() : renderCPEView()}
    </div>
  );
      
};

export default Cus_Nego_Customer_Negotiation;
