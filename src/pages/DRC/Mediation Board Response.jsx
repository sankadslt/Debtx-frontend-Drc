// /*Purpose: This template is used for the 2.16- Mediation board response
// Created Date: 2025-02-07
// Created By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
// Last Modified Date: 2025-02-12
// Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
//                U.H.Nandali Linara (nadalilinara5@gmail.com)
// Version: node 20
// ui number : 2.16
// Dependencies: tailwind css
// Related Files: (routes)
// Notes: The following page conatins the code for the Mediation board response */

// Related Files: (routes)
// Notes: The following page conatins the code for the Mediation board response */


import React, { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { X } from "lucide-react"; // Importing the close icon
import {
  getCaseDetailsbyMediationBoard,
  ListActiveMediationResponse,
  ListActiveRORequestsMediation,
  Mediation_Board
} from "../../services/case/CaseService";
import { useParams } from "react-router-dom";
import { format } from "date-fns"; // Suggested: add date-fns for consistent date handling
import {getLoggedUserId} from "/src/services/auth/authService.js";
import Swal from "sweetalert2";

const MediationBoardResponse = () => {
  const { caseId, drcId } = useParams(); // Get parameters from URL
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createdBy, setcreatedBy] = useState(null);
  const [roId, setRoId] = useState(null);

  // Consolidated case details
  const [caseDetails, setCaseDetails] = useState({
    caseId: "",
    customerRef: "",
    accountNo: "",
    arrearsAmount: "",
    lastPaymentDate: "",
    callingRound: 0,
  });
  const [failReasons, setFailReasons] = useState([]);
  const [handoverNonSettlement, setHandoverNonSettlement] = useState("");
  const [nextCallingDate, setNextCallingDate] = useState("");
  const [roRequests, setRoRequests] = useState([]);
  

  // Form state
  const [formData, setFormData] = useState({
    request: "",
    requestId: "",
    interactionId: "",
    customerRepresented: "",
    comment: "",
    requestcomment: "",
    failComment: "",
    settle: "",
    failReason: "",
    nextCallingDate: "",
    phase: "",
    settlementCount: "",
    initialAmount: "",
    calendarMonth: "0",
    durationFrom: "",
    durationTo : "",
    remark: "",
  });

  // Settlement table state
  const [settlements, setSettlements] = useState([
    { id: 1, seqNo: 1, installmentSettleAmount: "", planDate: "", installmentPaidAmount: "" },
  ]);
  const [showSettlementTable, setShowSettlementTable] = useState(false);

  const [showResponseHistory, setShowResponseHistory] = useState(false);
  const [isSettlementExpanded, setIsSettlementExpanded] = useState(false);
  const [isSettlementTableVisible, setIsSettlementTableVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
 
  

  // Derived state for showing settlement toggle
  const showSettlementToggle =
    handoverNonSettlement === "No" &&
    formData.customerRepresented === "Yes" &&
    formData.settle === "Yes";

  // Fetch case details when component mounts
  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!caseId || !drcId) {
        setError("Case ID and DRC ID are required");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch all data in parallel
        const [data, failReasonsList, roRequestsList] = await Promise.all([
          getCaseDetailsbyMediationBoard(caseId, drcId),
          ListActiveMediationResponse(),
          ListActiveRORequestsMediation(), // This now fetches only mediation mode requests
        ]);

        setCaseDetails({
          caseId: data.case_id || "",
          customerRef: data.customer_ref || "",
          accountNo: data.account_no || "",
          arrearsAmount: data.current_arrears_amount || "",
          lastPaymentDate: data.last_payment_date
            ? format(new Date(data.last_payment_date), "yyyy-MM-dd")
            : "",
          callingRound: data.calling_round || 0,
        });
        setFailReasons(failReasonsList || []);
        setRoRequests(roRequestsList || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching case details:", error);
        setError(error.message || "Failed to fetch case details");
        setIsLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseId, drcId]);

  // Update settlement table when settlement count changes
  useEffect(() => {
    if (
      formData.settlementCount &&
      !isNaN(parseInt(formData.settlementCount))
    ) {
      const count = parseInt(formData.settlementCount);
      const newSettlements = [];

      for (let i = 1; i <= count; i++) {
        newSettlements.push({
          id: i,
          seqNo: i,
          month: `Month ${i}`,
          dueDate: "",
          amount: "",
          status: "Pending",
          installmentSettleAmount: "",
          planDate: "",
          installmentPaidAmount: ""
        });
      }

      setSettlements(newSettlements);

      if (count > 0) {
        setShowSettlementTable(true);
      } else {
        setShowSettlementTable(false);
      }
    }
  }, [formData.settlementCount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "request") {
    const selectedIndex = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedIndex];
    const requestId = selectedOption.getAttribute("data-id");
    const interactionId = selectedOption.getAttribute("interaction_id");

    setFormData({
      ...formData,
      [name]: value, // Store the selected request description
      requestId: requestId, // Store the associated request ID
      interactionId: interactionId, // Store the associated interaction ID
    });
  } 
  if (name === "calendarMonth") {
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Temporarily allow full input
      }));
    }
  }
  else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "calendarMonth") {
      let numValue = Number(value);
      if (numValue < 1) numValue = 1;
      if (numValue > 12) numValue = 12;
  
       // Get today's date (DD/MM/YYYY format)
    const today = new Date();
    const durationFrom = today.toLocaleDateString("en-GB"); 

    // Calculate durationTo
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1); // Skip current month, go to next month
    const durationToDate = new Date(nextMonth.setMonth(nextMonth.getMonth() + (numValue - 1))); // Add selected months
    const durationTo = durationToDate.toLocaleDateString("en-GB"); 

    setFormData((prev) => ({
      ...prev,
      [name]: numValue.toString(), // Store as string
      durationFrom,
      durationTo,
    }));
    }
  };

  const handleHandoverChange = (e) => {
    setHandoverNonSettlement(e.target.value);
    if (e.target.value === "Yes") {
      setNextCallingDate("");
    }
  };

  const handleNextCallingDateChange = (e) => {
    setNextCallingDate(e.target.value);
  };

  const handleSettlementChange = (id, field, value) => {
    setSettlements(
      settlements.map((settlement) =>
        settlement.id === id ? { ...settlement, [field]: value } : settlement
      )
    );
  };

  // Add the missing handleConfirmedSubmit function
  const handleConfirmedSubmit = async () => {
    try {
      // Here you would typically call an API to save the form data
      console.log("Form submitted:", {
        ...formData,
        handoverNonSettlement,
        nextCallingDate,
        settlements: showSettlementTable ? settlements : [],
        caseId,
        drcId,
      });

      // Close the confirmation popup
      setShowConfirmation(false);

      // Simulate successful submission
      alert("Form submitted successfully!");

      // Optional: Reset form or redirect
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
      setShowConfirmation(false);
    }
  };

  useEffect(() => {
      const getuserdetails = async () => {
        try {
          const userData = await getLoggedUserId();
  
          if (userData) {
            setcreatedBy(userData.user_id);
            setRoId(userData.ro_id);
            console.log("user id", userData.user_id);
            console.log("user ro id", userData.ro_id);
  
          }
        } catch (error) {
          console.error("Error fetching user details:", error.message);
        }
      };
      getuserdetails();
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Adjust validation based on handover status
    if (caseDetails.callingRound === 3 && handoverNonSettlement === "Yes") {
      // For handover cases, only validate comment
      if (!formData.comment.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please enter a comment",
          confirmButtonColor: "#d33",
          });
        return;
      }

      setShowConfirmation(true);
      return;
    } else {
      // Regular validation for non-handover cases
      if (formData.customerRepresented === "") {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please select whether customer is represented",
          confirmButtonColor: "#d33",
          });
        return;
      }

      if (formData.customerRepresented === "Yes" && formData.settle === "") {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please select whether customer agrees to settle",
          confirmButtonColor: "#d33",
          });
        return;
      }

      if (showFailReasonFields && !formData.failReason) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please select a fail reason",
          confirmButtonColor: "#d33",
          });
        return;
      }

      // Validate settlement table if settlements are shown
      if (showSettlementTable) {
        let isValid = true;

        settlements.forEach((settlement) => {
          if (!settlement.dueDate || !settlement.amount) {
            isValid = false;
          }
        });

        if (!isValid) {
          Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "Please fill in all settlement details",
            confirmButtonColor: "#d33",
            });
          return;
        }
      }
    }

    try {

      const payload = {
        case_id : caseId,
        drc_id : drcId,
        ro_id : roId,
        customer_available : formData.customerRepresented.toLocaleLowerCase(), 
        next_calling_date: nextCallingDate,
        request_id : formData.requestId,
        request_type : formData.request,
        request_comment : formData.requestcomment,
        handed_over_non_settlement: handoverNonSettlement,
        intraction_id : formData.interactionId,
        comment : formData.comment,
        settle : formData.settle,
        settlement_count : formData.settlementCount,
        initial_amount : formData.initialAmount,
        calendar_month : formData.calendarMonth,
        duration: formData.calendarMonth,
        remark : formData.remark,
        fail_reason : formData.failReason,
        created_by : createdBy,
        //settlements: showSettlementTable ? settlements : [],
      };

      console.log("Form submitted:", payload);

      const response = await Mediation_Board(payload);
      console.log("Response:", response);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data sent successfully.",
        confirmButtonColor: "#28a745",
        });
      
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error?.response?.data?.message || 
                                    error?.message || 
                                    "An error occurred. Please try again.";
     Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
                confirmButtonColor: "#d33",
                });
                    }
  };

  // Add this function to toggle settlement table visibility
  const toggleSettlementTable = () => {
    setIsSettlementTableVisible(!isSettlementTableVisible);
  };

  // Show additional fields when customer is represented and agrees to settle
  const showSettlementFields =
    formData.customerRepresented === "Yes" && formData.settle === "Yes";

  // Show fail reason fields when customer is represented but doesn't agree to settle
  const showFailReasonFields =
    formData.customerRepresented === "Yes" && formData.settle === "No";

  // Determine if form should be simplified based on handover selection
  const isSimplifiedForm =
    caseDetails.callingRound >= 3 && handoverNonSettlement === "Yes";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading case details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-md bg-red-50 border border-red-300">
        <h2 className="text-lg font-bold mb-2">Error</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="mb-8">
        <h1 className={GlobalStyle.headingLarge}>Mediation Board Response</h1>
      </div>

      {/* Case Details Card - Always visible */}
      <div className="p-4 rounded-lg shadow-xl mb-6 bg-white bg-opacity-15 border-2 border-zinc-300 max-w-4xl">
        <table className="w-full">
          <tbody>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Case ID</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.caseId}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Customer Ref</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.customerRef}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Account No</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.accountNo}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Arrears Amount</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.arrearsAmount}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Last Payment Date</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.lastPaymentDate}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Calling Round Card - Always visible */}
      <div className="p-4 rounded-lg shadow-xl mb-6 bg-white bg-opacity-15 border-2 border-zinc-300 max-w-4xl">
        <table className="w-full">
          <tbody>
            <tr className="flex items-start py-1">
              <td className="font-semibold w-48">Calling Round</td>
              <td className="px-4 font-semibold">:</td>
              <td className="text-gray-700">{caseDetails.callingRound}</td>
            </tr>

            {caseDetails.callingRound >= 3 && (
              <tr className="flex items-start py-1">
                <td className="font-semibold w-48">Handover Non-Settlement</td>
                <td className="px-4 font-semibold">:</td>
                <td>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="handoverNonSettlement"
                        value="Yes"
                        checked={handoverNonSettlement === "Yes"}
                        onChange={handleHandoverChange}
                        className="mr-2"
                        aria-label="Yes for handover non-settlement"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="handoverNonSettlement"
                        value="No"
                        checked={handoverNonSettlement === "No"}
                        onChange={handleHandoverChange}
                        className="mr-2"
                        aria-label="No for handover non-settlement"
                      />
                      No
                    </label>
                  </div>
                </td>
              </tr>
            )}

            {/* Only show Next Calling Date when needed */}
            {(caseDetails.callingRound < 3 ||
              (caseDetails.callingRound >= 3 &&
                handoverNonSettlement === "No")) && (
                <tr className="flex items-start py-1">
                  <td className="font-semibold w-48">Next Calling Date</td>
                  <td className="px-4 font-semibold">:</td>
                  <td>
                    <input
                      type="date"
                      value={nextCallingDate}
                      onChange={handleNextCallingDateChange}
                      className="p-2 border rounded-md w-72"
                      disabled={
                        caseDetails.callingRound >= 3 &&
                        handoverNonSettlement === "Yes"
                      }
                      aria-label="Next calling date"
                    />
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Only show these fields when NOT in simplified mode */}
        {!isSimplifiedForm && (
          <>
            <div className="flex items-center">
              <span className="w-48 font-semibold">Request : </span>
              <select
                name="request"
                value={formData.request}
                onChange={handleInputChange}
                className={GlobalStyle.selectBox}
                aria-label="Request type"
              >
                <option value="" hidden>Select Request</option>
                {roRequests && roRequests.map((request) => (
                  <option key={request._id} value={request.request_description } data-id={request.ro_request_id} interaction_id={request.intraction_id}>
                    {request.request_description || "Unnamed Request"}
                  </option>
                ))}
              </select>
            </div>

            {formData.request && (
              <div className="flex">
                <span className="w-48 font-semibold">Request Remark:</span>
                <textarea
                  name="requestcomment"
                  value={formData.requestcomment}
                  onChange={handleInputChange}
                  className={GlobalStyle.remark}
                  rows="5"
                  aria-label="Comment"
                />
              </div>
            )}

            <div className="flex items-center">
              <span className="font-semibold">Customer Represented : </span>
              <div className="ml-4 flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="customerRepresented"
                    value="Yes"
                    checked={formData.customerRepresented === "Yes"}
                    onChange={handleInputChange}
                    className="mr-2"
                    aria-label="Yes for customer represented"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="customerRepresented"
                    value="No"
                    checked={formData.customerRepresented === "No"}
                    onChange={handleInputChange}
                    className="mr-2"
                    aria-label="No for customer represented"
                  />
                  No
                </label>



              </div>
            </div>


            {/* Comment section - Moved directly below customer represented */}

            {formData.customerRepresented === "Yes" && (
              <div className="flex items-center">
                <span className="w-48 font-semibold">Settle : </span>
                <div className="ml-4 flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="settle"
                      value="Yes"
                      checked={formData.settle === "Yes"}
                      onChange={handleInputChange}
                      className="mr-2"
                      aria-label="Yes for settle"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="settle"
                      value="No"
                      checked={formData.settle === "No"}
                      onChange={handleInputChange}
                      className="mr-2"
                      aria-label="No for settle"
                    />
                    No
                  </label>
                </div>
              </div>
            )}

            {/* Comment section - Only shown when customer is not represented */}
            {formData.customerRepresented === "No" && (
              <div className="flex">
                <span className="w-48 font-semibold">Comment:</span>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  className={GlobalStyle.remark}
                  rows="5"
                  aria-label="Comment"
                />
              </div>
            )}

            {showFailReasonFields && (
              <div>
                <div className="flex items-center">
                  <span className="w-48 font-semibold">Fail Reason:</span>
                  <select
                    name="failReason"
                    value={formData.failReason}
                    onChange={handleInputChange}
                    className="w-72 p-2 border rounded-md"
                    aria-label="Fail reason"
                  >
                    <option value="" hidden>Select Response</option>
                    {failReasons && failReasons.map((failReason, index) => (
                      <option key={index} value={failReason.mediation_description || ""}>
                        {failReason.mediation_description || "Unnamed Reason"}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.failReason && (
                  <div className="flex mt-2">
                    <span className="w-48 font-semibold">Comment:</span>
                    <textarea
                      name="failComment"
                      value={formData.failComment}
                      onChange={handleInputChange}
                      className={GlobalStyle.remark}
                      rows="4"
                      aria-label="Fail reason comment"
                    />
                  </div>
                )}
              </div>
            )}

            {showSettlementFields && (
              <>
                <div className="flex items-center">
                  <span className="w-48 font-semibold">Settlement Count:</span>
                  <input
                    type="number"
                    name="settlementCount"
                    value={formData.settlementCount}
                    onChange={handleInputChange}
                    className="w-72 p-2 border rounded-md"
                    aria-label="Settlement count"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-48 font-semibold">Initial Amount:</span>
                  <input
                    type="number"
                    name="initialAmount"
                    value={formData.initialAmount}
                    onChange={handleInputChange}
                    className="w-72 p-2 border rounded-md"
                    aria-label="Initial amount"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-48 font-semibold">Calendar Month:</span>
                  <input
                    type="number"
                    name="calendarMonth"
                    value={formData.calendarMonth}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-20 p-2 border rounded-md"
                    min="0"
                    max="12"
                    aria-label="Calendar month"
                  />
                </div>

                <div className="flex items-center">
                  <span className="w-48 font-semibold">Duration:</span>
                  <div className="flex items-center space-x-4">
                    <span>From:</span>
                    <input
                      type="text"
                      name="durationFrom"
                      value={formData.durationFrom}
                      onChange={handleInputChange}
                      className="w-32 p-2 border rounded-md"
                      aria-label="Duration from"
                      readOnly
                    />
                    <span>To:</span>
                    <input
                      type="text"
                      name="durationTo"
                      value={formData.durationTo}
                      onChange={handleInputChange}
                      className="w-32 p-2 border rounded-md"
                      aria-label="Duration to"
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex">
                  <span className="w-48 font-semibold">Remark:</span>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    rows="4"
                    aria-label="Remark"
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* Comment section for simplified form only */}
        {isSimplifiedForm && (
          <div className="flex">
            <span className="w-48 font-semibold">Comment:</span>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              className={GlobalStyle.remark}
              rows="5"
              aria-label="Comment"
            />
          </div>
        )}

        {/* Submit and Response History buttons - Always visible */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className={GlobalStyle.buttonPrimary}
            aria-label="Submit form"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Settlement 1 toggle - Only shown when conditions are met */}
      {showSettlementToggle && (
        <div className="mt-6">
          <button
            type="button"
            onClick={toggleSettlementTable}
            className={`${GlobalStyle.buttonSecondary} bg-[rgb(56,75,92)] text-white p-2 flex items-center justify-between w-full`}
            aria-label="Toggle settlement 1 details"
          >
            <span>Settlement 1</span>
            <span>{isSettlementTableVisible ? "▲" : "▼"}</span>
          </button>

          {isSettlementTableVisible && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
              <div className={GlobalStyle.tableContainer}>
                <table className={GlobalStyle.table}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Seq.No
                      </th>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Installment Settle Amount
                      </th>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Plan Date
                      </th>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Installment Paid Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlements && settlements.map((settlement) => (
                      <tr key={settlement.id} className="bg-white bg-opacity-75 border-b">
                        <td className={GlobalStyle.tableData}>{settlement.seqNo}</td>
                        <td className={GlobalStyle.tableData}>{settlement.installmentSettleAmount}</td>
                        <td className={GlobalStyle.tableData}>{settlement.planDate}</td>
                        <td className={GlobalStyle.tableData}>{settlement.installmentPaidAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowResponseHistory(!showResponseHistory)}
          className={GlobalStyle.buttonPrimary}
          aria-label="Toggle response history"
        >
          Response History
        </button>
      </div>

      {/* Response History Popup */}
      {showResponseHistory && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white p-6 rounded-lg w-2/3 max-h-[90vh] overflow-auto relative">
            {/* Close Button with X Icon */}
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
              onClick={() => setShowResponseHistory(false)}
              aria-label="Close response history"
            >
              <X size={24} />
            </button>

            {/* Mediation Board Response History Table */}
            <h2 className="text-2xl font-semibold mb-2 font-poppins">
              Mediation Board Response History
            </h2>
            <div className={GlobalStyle.tableContainer}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Calling Date
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Customer Represented
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Agree to Settle
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      callingDate: "2024-02-10",
                      customerRepresented: "Yes/No",
                      agreeToSettle: "Yes/No",
                      remark: "....",
                    },
                  ].map((entry, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0
                        ? "bg-white bg-opacity-75"
                        : "bg-gray-50 bg-opacity-50"
                        } border-b`}
                    >
                      <td className={GlobalStyle.tableData}>
                        {entry.callingDate}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {entry.customerRepresented}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {entry.agreeToSettle}
                      </td>
                      <td className={GlobalStyle.tableData}>{entry.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Details Table */}
            <h2 className="text-2xl font-semibold mb-2 font-poppins mt-6">
              Payment Details
            </h2>
            <div className={GlobalStyle.tableContainer}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Date
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Paid Amount
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Settled Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      date: "2024-02-10",
                      paidAmount: "3000",
                      settledBalance: "....",
                    },
                  ].map((entry, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0
                        ? "bg-white bg-opacity-75"
                        : "bg-gray-50 bg-opacity-50"
                        } border-b`}
                    >
                      <td className={GlobalStyle.tableData}>{entry.date}</td>
                      <td className={GlobalStyle.tableData}>
                        {entry.paidAmount}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {entry.settledBalance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Requested Additional Details Table */}
            <h2 className="text-2xl font-semibold mb-2 font-poppins mt-6">
              Requested Additional Details
            </h2>
            <div className={GlobalStyle.tableContainer}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Date
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Request
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      date: "2024-02-10",
                      request: "....",
                      remark: "....",
                    },
                  ].map((entry, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0
                        ? "bg-white bg-opacity-75"
                        : "bg-gray-50 bg-opacity-50"
                        } border-b`}
                    >
                      <td className={GlobalStyle.tableData}>{entry.date}</td>
                      <td className={GlobalStyle.tableData}>{entry.request}</td>
                      <td className={GlobalStyle.tableData}>{entry.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white p-6 rounded-lg w-1/3 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
            <p className="mb-6">
              Are you agree to submit the Non-Settlement letter?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={handleConfirmedSubmit}
                className={GlobalStyle.buttonPrimary}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediationBoardResponse;