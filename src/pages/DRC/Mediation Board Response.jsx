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
  Mediation_Board,
  List_Settlement_Details_Owen_By_SettlementID_and_DRCID
} from "../../services/case/CaseService";
import { data, useParams } from "react-router-dom";
import { format } from "date-fns"; // Suggested: add date-fns for consistent date handling
import { getLoggedUserId } from "/src/services/auth/authService.js";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

const MediationBoardResponse = () => {
  //const { caseId, drcId } = useParams(); // Get parameters from URL
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createdBy, setcreatedBy] = useState(null);
  const [roId, setRoId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const caseId = location.state?.CAse_id; // Get caseId from state if available
  const drcId = location.state?.DRc_id; // Get drcId from state if available
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons
  console.log(" passed caseId", caseId);
  console.log("passed drcId", drcId);
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

  const [historyTables, setHistoryTables] = useState([]);
  const [lastRoRequests, setLastRoRequests] = useState([]);
  const [mediationBoardHistory, setMediationBoardHistory] = useState([]);
  const [lastROPayment, setLastROPayment] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);


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

  //Pagnation for the mediation board history
  const rowsPerPage = 4;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = mediationBoardHistory.slice(startIndex, endIndex);
  const totalPages = Math.ceil(mediationBoardHistory.length / rowsPerPage);


  // Pagination handler for Mediation Board History
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


  // Pagination for Payment Details
  const itemsPerPage = 4;
  const startIndex1 = (currentPage1 - 1) * itemsPerPage;
  const endIndex1 = startIndex1 + itemsPerPage;
  const currentRows1 = lastROPayment.slice(startIndex1, endIndex1);
  const totalPages1 = Math.ceil(lastROPayment.length / itemsPerPage);

  // Pagination handler for Payment Details
  const handlePrevNext1 = (direction) => {
    if (direction === "prev" && currentPage1 > 1) {
      setCurrentPage1(currentPage1 - 1);
    }
    if (direction === "next" && currentPage1 < totalPages1) {
      setCurrentPage1(currentPage1 + 1);
    }
  };


  // Pagination for RO Requests

  const itemsPerPage2 = 4;
  const startIndex2 = (currentPage2 - 1) * itemsPerPage2;
  const endIndex2 = startIndex2 + itemsPerPage2;
  const currentRows2 = lastRoRequests.slice(startIndex2, endIndex2);
  const totalPages2 = Math.ceil(lastRoRequests.length / itemsPerPage2);


  // Pagination handler for RO Requests
  const handlePrevNext2 = (direction) => {
    if (direction === "prev" && currentPage2 > 1) {
      setCurrentPage2(currentPage2 - 1);
    }
    if (direction === "next" && currentPage2 < totalPages2) {
      setCurrentPage2(currentPage2 + 1);
    }
  };


  // Form state
  const [formData, setFormData] = useState({
    request: "",
    requestId: "",
    interactionId: "",
    customerRepresented: "",
    comment: "",
    requestcomment: "",
    failComment: "",
    nonsettlementcomment: "",
    current_arrears_amount: "",
    case_current_status: "",
    settle: "",
    failReason: "",
    nextCallingDate: "",
    phase: "",
    settlementCount: "",
    initialAmount: "",
    calendarMonth: "0",
    durationFrom: "",
    durationTo: "",
    remark: "",
  });

  // Settlement table state
  const [settlements, setSettlements] = useState([
    { id: 1, seqNo: 109, installmentSettleAmount: "", planDate: "", installmentPaidAmount: 100 },
  ]);
  const [showSettlementTable, setShowSettlementTable] = useState(false);
  const [settlementdata, setSettlementdata] = useState([]);
  const [settlementCount, setSettlementCount] = useState(0);
  const [showResponseHistory, setShowResponseHistory] = useState(false);


  const [isSettlementExpanded, setIsSettlementExpanded] = useState(false);
  const [isSettlementTableVisible, setIsSettlementTableVisible] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [visibleTables, setVisibleTables] = useState({}); // state for the settlement tables visibility

  const toggleSettlementTable = (index) => {
    setVisibleTables((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Get the data for the settlement table 
  useEffect(() => {
    const fetchSettlementDetails = async () => {

      const userData2 = await getLoggedUserId();

      console.log("Within the function drc id and ro id", userData2.drc_id, userData2.ro_id);
      if (!caseId || !drcId) { // Check if caseId and drcId are available
        setError("Case ID and DRC ID are required");
        setIsLoading(false);
        return;
      }
      try {
        const response = await List_Settlement_Details_Owen_By_SettlementID_and_DRCID(caseId, userData2.drc_id, userData2.ro_id);

        setSettlementdata(response.data)
        setSettlementCount(response.data.length)
        console.log("Settlement length :", response.data.length);
        console.log("Settlement data fetched:", response.data);

      } catch (error) {
        console.error("Error fetching settlement data:", error);
        setError(error.message || "Failed to fetch settlement data");
        setIsLoading(false);
      }
    };
    fetchSettlementDetails();
  }, [caseId, drcId]);





  // Derived state for showing settlement toggle
  const showSettlementToggle =
    //handoverNonSettlement === "No" &&
    formData.customerRepresented === "Yes" &&
    formData.settle === "Yes";


  useEffect(() => {
    const getuserdetails = async () => {
      try {
        const userData = await getLoggedUserId();

        if (userData) {
          setcreatedBy(userData.user_id);

          setRoId(userData.ro_id);
          console.log("user id", userData.user_id);
          console.log("user drc id", userData.drc_id);
          console.log("user ro id", userData.ro_id);

        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };
    getuserdetails();
  }, []);

  // Fetch case details when component mounts
  useEffect(() => {



    const fetchCaseDetails = async () => {

      const userData1 = await getLoggedUserId();

      console.log("Within the function drc id", userData1.drc_id);

      if (!caseId || !drcId) { // Check if caseId and drcId are available
        setError("Case ID and DRC ID are required");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch all data in parallel
        const [casedetails, failReasonsList, roRequestsList] = await Promise.all([
          getCaseDetailsbyMediationBoard(caseId, drcId, userData1.ro_id),
          ListActiveMediationResponse(),
          ListActiveRORequestsMediation(), // This now fetches only mediation mode requests
        ]);

        const data = casedetails.data;
        const callingRound = casedetails.callingRound;
        console.log("Calling Round:", callingRound);

        console.log("Data fetched here:", data);

        setCaseDetails({
          caseId: data[0].case_id || "",
          customerRef: data[0].customer_ref || "",
          accountNo: data[0].account_no || "",
          arrearsAmount: data[0].current_arrears_amount || "",
          lastPaymentDate: data[0].last_payment_date

            ? format(new Date(data[0].last_payment_date), "yyyy-MM-dd")
            : "",
          callingRound: callingRound || 0,
          case_current_status: data[0].case_current_status || ""
        });
        setHistoryTables(data[0]);
        console.log("History Tables:", historyTables);
        setFailReasons(failReasonsList || []);
        setRoRequests(roRequestsList || []);
        console.log("RO Requests:", roRequestsList);

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
  // useEffect(() => {
  //   if (
  //     formData.settlementCount &&
  //     !isNaN(parseInt(formData.settlementCount))
  //   ) {
  //     const count = parseInt(formData.settlementCount);
  //     const newSettlements = [];

  //     for (let i = 1; i <= count; i++) {
  //       newSettlements.push({
  //         id: i,
  //         seqNo: i,
  //         month: `Month ${i}`,
  //         dueDate: "",
  //         amount: "",
  //         status: "Pending",
  //         installmentSettleAmount: "",
  //         planDate: "",
  //         installmentPaidAmount: ""
  //       });
  //     }

  //     setSettlements(newSettlements);

  //     if (count > 0) {
  //       setShowSettlementTable(true);
  //     } else {
  //       setShowSettlementTable(false);
  //     }
  //   }
  // }, [formData.settlementCount]);

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
        const numValue = Number(value);

        if (numValue >= 1 && numValue <= 12) {

          // Get today's date (DD/MM/YYYY format)
          const today = new Date();
          const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
          const durationFrom = startOfNextMonth.toLocaleDateString("en-GB");

          // Calculate durationTo
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1); // Skip current month, go to next month
          const durationToDate = new Date(nextMonth.setMonth(nextMonth.getMonth() + (numValue - 1))); // Add selected months

          const finalMonth = new Date(today.getFullYear(), today.getMonth() + 1 + (numValue - 1), 1); // first day of final month
          const lastDayOfFinalMonth = new Date(finalMonth.getFullYear(), finalMonth.getMonth() + 1, 0); // last day of final month
          const durationTo = lastDayOfFinalMonth.toLocaleDateString("en-GB");

          setFormData((prev) => ({
            ...prev,
            [name]: numValue.toString(), // Store as string
            durationFrom,
            durationTo,
          }));

        }

        // setFormData((prev) => ({
        //   ...prev,
        //   [name]: value, // Temporarily allow full input
        // }));
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

  // const handleSettlementChange = (id, field, value) => {
  //   setSettlements(
  //     settlements.map((settlement) =>
  //       settlement.id === id ? { ...settlement, [field]: value } : settlement
  //     )
  //   );
  // };

  // Add the missing handleConfirmedSubmit function
  // const handleConfirmedSubmit = async () => {
  //   try {
  //     // Here you would typically call an API to save the form data
  //     console.log("Form submitted:", {
  //       ...formData,
  //       handoverNonSettlement,
  //       nextCallingDate,
  //       settlements: showSettlementTable ? settlements : [],
  //       caseId,
  //       drcId,
  //     });

  //     // Close the confirmation popup
  //     setShowConfirmation(false);

  //     // Simulate successful submission
  //     alert("Form submitted successfully!");

  //     // Optional: Reset form or redirect
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     alert("Failed to submit form. Please try again.");
  //     setShowConfirmation(false);
  //   }
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Adjust validation based on handover status
    if (caseDetails.callingRound >= 0 && handoverNonSettlement === "Yes") {
      // For handover cases, only validate comment
      if (!formData.nonsettlementcomment.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please enter a comment",
          confirmButtonColor: "#f1c40f"
        });
        return;
      }

      // Show confirmation popup
      const result = await Swal.fire({
        title: "Confirmation",
        text: "Are you sure you want to submit the Non-Settlement letter?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, submit",
        cancelButtonText: "No",
      });
      if (!result.isConfirmed) {
        //setShowConfirmation(true);
        return; // User clicked "No", do not submit
      }
      // Proceed with submission
      try {
        const payload = {
          case_id: caseId,
          drc_id: drcId,
          ro_id: roId,
          customer_available: formData.customerRepresented.toLocaleLowerCase(),
          next_calling_date: nextCallingDate,
          request_id: formData.requestId,
          request_type: formData.request,
          request_comment: formData.requestcomment,
          handed_over_non_settlemet: handoverNonSettlement.toLowerCase(),
          non_settlement_comment: formData.nonsettlementcomment,
          fail_reason_comment: formData.failComment,
          intraction_id: formData.interactionId,
          comment: formData.comment,
          settle: formData.settle.toLowerCase(),
          settlement_count: settlementCount,
          initial_amount: formData.initialAmount,
          calendar_month: formData.calendarMonth,
          current_arrears_amount: caseDetails.arrearsAmount,
          case_current_status: caseDetails.case_current_status,
          //duration: formData.calendarMonth,
          remark: formData.remark,
          fail_reason: formData.failReason,
          created_by: createdBy
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
      return;
    }

    else {
      // Regular validation for non-handover cases
      if (formData.customerRepresented === "") {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please select whether customer is represented",
          confirmButtonColor: "#f1c40f",
        });
        return;
      }

      if (formData.customerRepresented === "Yes" && formData.settle === "") {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please select whether customer agrees to settle",
          confirmButtonColor: "#f1c40f",
        });
        return;
      }

      if (showFailReasonFields && !formData.failReason) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please select a fail reason",
          confirmButtonColor: "#f1c40f",
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
            confirmButtonColor: "#f1c40f",
          });
          return;
        }
      }


      //regular api call
      try {

        const payload = {
          case_id: caseId,
          drc_id: drcId,
          ro_id: roId,
          customer_available: formData.customerRepresented.toLocaleLowerCase(),
          next_calling_date: nextCallingDate,
          request_id: formData.requestId,
          request_type: formData.request,
          request_comment: formData.requestcomment,
          handed_over_non_settlemet: handoverNonSettlement.toLowerCase(),
          non_settlement_comment: formData.nonsettlementcomment,
          fail_reason_comment: formData.failComment,
          intraction_id: formData.interactionId,
          comment: formData.comment,
          settle: formData.settle.toLowerCase(),
          settlement_count: settlementCount,
          initial_amount: formData.initialAmount,
          calendar_month: formData.calendarMonth,
          current_arrears_amount: caseDetails.arrearsAmount,
          case_current_status: caseDetails.case_current_status,
         // duration: formData.calendarMonth,
          remark: formData.remark,
          fail_reason: formData.failReason,
          created_by: createdBy,
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
    }
  };


  // // Add this function to toggle settlement table visibility
  // const toggleSettlementTable = () => {
  //   setIsSettlementTableVisible(!isSettlementTableVisible);
  // };

  // Show additional fields when customer is represented and agrees to settle
  const showSettlementFields =
    formData.customerRepresented === "Yes" && formData.settle === "Yes";

  // Show fail reason fields when customer is represented but doesn't agree to settle
  const showFailReasonFields =
    formData.customerRepresented === "Yes" && formData.settle === "No";

  // Determine if form should be simplified based on handover selection
  const isSimplifiedForm =
    caseDetails.callingRound >= 0 && handoverNonSettlement === "Yes";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading case details...</span>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="text-red-500 p-4 rounded-md bg-red-50 border border-red-300">
  //       <h2 className="text-lg font-bold mb-2">Error</h2>
  //       <p>{error}</p>
  //       <button
  //         onClick={() => window.location.reload()}
  //         className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
  //       >
  //         Retry
  //       </button>
  //     </div>
  //   );
  // }

  const handleBack = () => {
    navigate("/drc/mediation-board-case-list"); // Go back to the previous page
  };

  const handleResponseHistoryClick = async () => {
    setShowResponseHistory(!showResponseHistory);
    if (!showResponseHistory) {
      try {
        const lastRequests = historyTables.ro_requests
          ? historyTables.ro_requests.map((ro_request) => ({
            createdDtm: ro_request.created_dtm,
            field_reason: ro_request.ro_request,
            remark: ro_request.request_remark ? ro_request.request_remark : "",
          }))
            .reverse() // Reverse the order to show latest first
          : [];
        setLastRoRequests(lastRequests);

        const mediationbordhistory = historyTables.mediation_board
          ? historyTables.mediation_board.map((media_board) => ({
            callingdate: media_board.mediation_board_calling_dtm || "",
            createdDtm: media_board.created_dtm,
            customerrep: media_board.customer_available,
            agreetosettle: media_board.agree_to_settle || "",
            remark: media_board.comment ? media_board.comment : "",
          }))
            .reverse() // Reverse the order to show latest first
          : [];
        setMediationBoardHistory(mediationbordhistory);

        const lastPayment = historyTables.money_transactions
          ? historyTables.money_transactions.map((ro_payment) => ({
            createdDtm: ro_payment.payment_Dtm,
            paid_amount: ro_payment.payment,
            settled_balance: ro_payment.settle_balanced ? ro_payment.settle_balanced : "",
          }))
          : [];
        setLastROPayment(lastPayment);

      } catch (error) {
        console.error("Error fetching negotiation history:", error.message);
      }
    }
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="mb-8">
        <h1 className={GlobalStyle.headingLarge}>Mediation Board Response</h1>
      </div>

      {/* Case Details Card - Always visible */}
      <div className="flex justify-center items-center">
        <div className={`${GlobalStyle.cardContainer} w-full max-w-2xl`}>
          <table className="w-full  ">
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
      </div>

      {/* Calling Round Card - Always visible */}
      <div className="flex justify-center items-center  ">
        <div
          className={`${GlobalStyle.tableContainer} bg-white bg-opacity-50 p-8 w-[70%] max-w-[1200px] mx-auto`}
        >

          <h2 className={`${GlobalStyle.headingMedium} mb-4 text-center`}>
            <strong>Mediation Board Form </strong>
          </h2>
          <div className="p-4 rounded-lg shadow-xl mb-6 bg-white bg-opacity-15 border-2 border-zinc-300 max-w-4xl">
            <table className="w-full table-auto">
              <tbody>
                <tr>
                  <td className="font-semibold w-48 align-top">Calling Round</td>
                  <td className="px-4 font-semibold align-top">:</td>
                  <td className="text-gray-700">{caseDetails.callingRound}</td>
                </tr>

                {caseDetails.callingRound >= 0 && (
                  <tr>
                    <td className="font-semibold w-48 align-top">Handover Non-Settlement</td>
                    <td className="px-4 font-semibold align-top">:</td>
                    <td>
                      <div className="flex flex-wrap gap-4">
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

                {(caseDetails.callingRound < 3 ||
                  (caseDetails.callingRound >= 3 &&
                    handoverNonSettlement === "No")) && (
                    <tr>
                      <td className="font-semibold w-48 align-top">Next Calling Date</td>
                      <td className="px-4 font-semibold align-top">:</td>
                      <td>
                        <input
                          type="date"
                          value={nextCallingDate}
                          onChange={handleNextCallingDateChange}
                          className="p-2 border rounded-md w-full max-w-xs"
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
                    style={{ color: formData.request === "" ? "gray" : "black" }}
                  >
                    <option value="" hidden>Select Request</option>
                    {roRequests && roRequests.map((request) => (
                      <option key={request._id} value={request.request_description} data-id={request.ro_request_id} interaction_id={request.intraction_id} style={{ color: "black" }}>
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
                    <span className="w-48 font-semibold mb-6">Agree to Settle : </span>
                    <div className="ml-4 flex gap-4">
                      <label className="flex items-center mb-6">
                        <input
                          type="radio"
                          name="settle"
                          value="Yes"
                          checked={formData.settle === "Yes"}
                          onChange={(e) => {
                            if (caseDetails.callingRound >= 3 && (!handoverNonSettlement || handoverNonSettlement === "")) {

                              Swal.fire({
                                icon: "warning",
                                title: "Warning",
                                text: "Handover Non-settlement has not been provided.",
                                confirmButtonColor: "#f1c40f",
                              });
                              e.preventDefault();
                            }
                            else {
                              handleInputChange(e);
                            }
                          }}
                          className="mr-2"
                          aria-label="Yes for settle"
                        // disabled={caseDetails.callingRound >= 3 && handoverNonSettlement === "Yes"}
                        />
                        Yes
                      </label>
                      <label className="flex items-center mb-6">
                        <input
                          type="radio"
                          name="settle"
                          value="No"
                          checked={formData.settle === "No"}

                          onChange={(e) => {
                            if (caseDetails.callingRound >= 3 && (!handoverNonSettlement || handoverNonSettlement === "")) {
                              Swal.fire({
                                icon: "warning",
                                title: "Warning",
                                text: "Handover Non-settlement has not been provided.",
                                confirmButtonColor: "#f1c40f",
                              });
                              e.preventDefault();
                            }
                            else {
                              handleInputChange(e);
                            }
                          }}
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
                        className={GlobalStyle.selectBox}
                        aria-label="Fail reason"
                        style={{ color: formData.failReason === "" ? "gray" : "black" }}
                      >
                        <option value="" hidden>Select Response</option>
                        {failReasons && failReasons.map((failReason, index) => (
                          <option key={index} value={failReason.mediation_description || ""} style={{ color: "black" }}>
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
                    <div >
                      <h2 className={`${GlobalStyle.headingMedium} mt-6 mb-4 text-center underline`}>
                        <strong>Settlement Plan Creation</strong>
                      </h2>
                    </div>
                    <div className="flex items-center">
                      <span className="w-48 font-semibold">Settlement Count:</span>
                      <span
                        className="w-72 p-2 border rounded-md "
                        aria-label="Settlement count"
                      >
                        {settlementCount}
                      </span>

                      {/* <input
                          type="number"
                          name="settlementCount"
                          value={formData.settlementCount}
                          onChange={handleInputChange}
                          className="w-72 p-2 border rounded-md"
                          aria-label="Settlement count"
                        /> */}
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
                        //onBlur={handleBlur}
                        className="w-20 p-2 border rounded-md"
                        min="0"
                        max="12"
                        onKeyDown={(e) => e.preventDefault()} //  Prevent keyboard input
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
                <span className="w-48 font-semibold">Non-settlement comment:</span>
                <textarea
                  name="nonsettlementcomment"
                  value={formData.nonsettlementcomment}
                  onChange={handleInputChange}
                  className={GlobalStyle.remark}
                  rows="5"
                  aria-label="Non-settlement comment"
                />
              </div>
            )}

            {/* Submit and Response History buttons - Always visible */}
            <div className="flex justify-end mt-6">

              <div>
                {["admin", "superadmin", "slt", "drc_user", "drc_admin"].includes(userRole) && (
                  <button
                    type="submit"
                    className={GlobalStyle.buttonPrimary}
                    aria-label="Submit form"
                  >
                    Submit
                  </button>
                )}
              </div>
              {/* <button
                  type="submit"
                  className={GlobalStyle.buttonPrimary}
                  aria-label="Submit form"
                >
                  Submit
                </button> */}
            </div>
          </form>
        </div>
      </div>
      {/* Settlement 1 toggle - Only shown when conditions are met */}
      {showSettlementToggle && (
        <div className="mt-6">
          {settlementdata?.map((settlement, index) => (
            <div key={index} className="mb-4">
              <button
                type="button"
                onClick={() => toggleSettlementTable(index)}
                className={`${GlobalStyle.buttonSecondary} bg-[rgb(56,75,92)] text-white p-2 flex items-center justify-between w-full`}
                aria-label={`Toggle settlement ${index + 1} details`}
              >
                <span>{`Settlement ${index + 1}`}</span>
                <span>{visibleTables[index] ? "▲" : "▼"}</span>
              </button>

              {visibleTables[index] && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                  <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                    <table className={GlobalStyle.table}>
                      <thead className={GlobalStyle.thead}>
                        <tr>
                          <th scope="col" className={GlobalStyle.tableHeader}>
                            Seq. No
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
                        {settlement.settlement_plan?.map((installment, i) => (
                          <tr key={i} className="bg-white bg-opacity-75 border-b">
                            <td className={GlobalStyle.tableData}>{installment.installment_seq}</td>
                            <td className={GlobalStyle.tableCurrency}>{installment.Installment_Settle_Amount}</td>
                            <td className={GlobalStyle.tableData}>{new Date(installment.Plan_Date).toLocaleDateString("en-GB")}</td>
                            <td className={GlobalStyle.tableCurrency}>{installment.Installment_Paid_Amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6  mb-8">
        <div>
          {["admin", "superadmin", "slt", "drc_user", "drc_admin"].includes(userRole) && (
            <button
              type="button"
              // onClick={() => setShowResponseHistory(!showResponseHistory)}
              className={`${GlobalStyle.buttonPrimary} ml-16`}
              onClick={handleResponseHistoryClick}

            >
              Response History
            </button>
          )}
        </div>
        {/* <button
          type="button"
          // onClick={() => setShowResponseHistory(!showResponseHistory)}
           className={`${GlobalStyle.buttonPrimary} ml-16`}
         onClick={handleResponseHistoryClick}
          
        >
          Response History
        </button> */}
      </div>



      {/* Response History Popup */}
      {showResponseHistory && (
        <div className="mb-8">
          {/* <div className="bg-white p-6 rounded-lg w-2/3 max-h-[90vh] overflow-auto relative"> */}
          {/* Close Button with X Icon */}
          {/* <button
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
              onClick={() => setShowResponseHistory(false)}
              aria-label="Close response history"
            >
              <X size={24} />
            </button> */}

          {/* Mediation Board Response History Table */}
          <h3 className={`${GlobalStyle.headingMedium} mt-10 mb-4`}>
            Mediation Board Response History
          </h3>
          <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Next Calling Date
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Created Date
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
                {currentRows.length > 0 ? (
                  currentRows.map((entry, index) => (

                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      }
                    >
                      <td className={GlobalStyle.tableData}>
                        {entry.callingdate
                          ? new Date(entry.callingdate).toLocaleDateString("en-GB")
                          : ""}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {entry.createdDtm
                          ? new Date(entry.createdDtm).toLocaleDateString("en-GB")
                          : ""}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {entry.customerrep}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {entry.agreetosettle}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {entry.remark}
                      </td>

                    </tr>
                  ))

                ) : (
                  <tr>
                    <td colSpan="4" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                      No response history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagnation for the Mediation Borard table  */}
          <div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={() => handlePrevNext("prev")}
              disabled={currentPage === 1}
              className={`${GlobalStyle.navButton} ${currentPage === 1 ? "cursor-not-allowed" : ""
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
              className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""
                }`}
            >
              <FaArrowRight />
            </button>
          </div>


          {/* Payment Details Table */}
          <h3 className={`${GlobalStyle.headingMedium} mt-8 mb-4`}>
            Payment Details
          </h3>
          <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead} >
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
                {currentRows1.length > 0 ? (
                  currentRows1.map((entry, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      }
                    >
                      <td className={GlobalStyle.tableData}>
                       { entry.createdDtm
                          ? new Date(entry.createdDtm).toLocaleDateString("en-GB")
                          : ""}
                      </td>
                      <td className={GlobalStyle.tableCurrency}>
                        {entry.paid_amount}
                      </td>
                      <td className={GlobalStyle.tableCurrency}>
                        {entry.settled_balance}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                      No payment history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagnation for the Payment table  */}

          <div className={GlobalStyle.navButtonContainer}>
            <button

              onClick={() => handlePrevNext1("prev")}
              disabled={currentPage1 === 1}
              className={`${GlobalStyle.navButton} ${currentPage1 === 1 ? "cursor-not-allowed" : ""
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
              className={`${GlobalStyle.navButton} ${currentPage1 === totalPages1 ? "cursor-not-allowed" : ""
                }`}
            >
              <FaArrowRight />
            </button>
          </div>

          {/* Requested Additional Details Table */}
          <h3 className={`${GlobalStyle.headingMedium} mt-8 mb-4`}>
            Requested Additional Details
          </h3>
          <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead} >
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
                {currentRows2.length > 0 ? (
                  currentRows2.map((entry, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      }
                    >
                      <td className={GlobalStyle.tableData}>
                        {entry.createdDtm
                          ? new Date(entry.createdDtm).toLocaleDateString("en-GB")
                          : ""}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {entry.field_reason}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {entry.remark}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                      No requested additional details available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagnation for the Requested Additional Details table  */}
          <div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={() => handlePrevNext2("prev")}
              disabled={currentPage2 === 1}
              className={`${GlobalStyle.navButton} ${currentPage2 === 1 ? "cursor-not-allowed" : ""
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
              className={`${GlobalStyle.navButton} ${currentPage2 === totalPages2 ? "cursor-not-allowed" : ""
                }`}
            >
              <FaArrowRight />
            </button>
          </div>

          {/* </div> */}
        </div>
      )}



      {/* Confirmation Popup */}
      {/* {showConfirmation && (
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
      )} */}

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


export default MediationBoardResponse;