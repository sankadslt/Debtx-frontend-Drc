/*Purpose: This template is used for the 2.5- Re-Assign RO
Created Date: 2025-01-07
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-02-19
Modified by: Nimesh Perera(nimeshmathew999@gmail.com), Sasindu srinayaka(sasindusrinayaka@gmail.com)
Version: node 20
ui number : 2.5
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for the Re-Assign RO  */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { assignROToCase, fetchBehaviorsOfCaseDuringDRC, updateLastRoDetails } from "../../services/case/CaseService";
import { getActiveRODetailsByDrcID } from "../../services/Ro/RO";
import { getLoggedUserId } from "../../services/auth/authService";
import Swal from 'sweetalert2';
import { FaArrowLeft } from "react-icons/fa";

export default function Re_AssignRo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRO, setSelectedRO] = useState("");
  const [recoveryOfficers, setRecoveryOfficers] = useState([]);

  // State to manage case details
  const [caseDetails, setCaseDetails] = useState({
    caseId: "",
    customerRef: "",
    accountNo: "",
    arrearsAmount: "",
    lastPaymentDate: "",
  });

  const [lastNegotiationDetails, setLastNegotiationDetails] = useState([]);
  const [settlementDetails, setSettlementDetails] = useState([]);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // State for managing the remark text area value
  const [textareaValue, setTextareaValue] = useState("");
  const case_id = location.state?.CaseID;
  console.log("caseid", case_id);

  // const loadUser = async () => {
  //   let token = localStorage.getItem("accessToken");
  //   if (!token) {
  //     setUserData(null);
  //     return;
  //   }

  //   try {
  //     let decoded = jwtDecode(token);
  //     const currentTime = Date.now() / 1000;
  //     if (decoded.exp < currentTime) {
  //       token = await refreshAccessToken();
  //       if (!token) return;
  //       decoded = jwtDecode(token);
  //     }

  //     setUserData({
  //       id: decoded.user_id,
  //       role: decoded.role,
  //       drc_id: decoded.drc_id,
  //       ro_id: decoded.ro_id,
  //     });
  //   } catch (error) {
  //     console.error("Invalid token:", error);
  //   }
  // };

  // useEffect(() => {
  //   loadUser();
  // }, [localStorage.getItem("accessToken")]);

  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    console.log("User data:", user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData?.drc_id) { // Changed from !userData?.drc_id to userData?.drc_id
          const payload = {
            drc_id: parseInt(userData.drc_id),
            case_id: Number(case_id),
          };

          const data = await fetchBehaviorsOfCaseDuringDRC(payload);

          console.log("Data:", data);

          if (data && data.status !== "error") {
            const caseDetailsData = data.data.formattedCaseDetails;

            // Extract the date portion (YYYY-MM-DD)
            const last_payment_date = caseDetailsData.last_payment_date
              ? new Date(caseDetailsData.last_payment_date).toISOString().split('T')[0]
              : "";

            setCaseDetails({
              caseId: caseDetailsData.case_id || "",
              customerRef: caseDetailsData.customer_ref || "",
              accountNo: caseDetailsData.account_no || "",
              arrearsAmount: caseDetailsData.current_arrears_amount || "",
              lastPaymentDate: last_payment_date || "",
            });

            const negotiations = caseDetailsData.ro_negotiation || [];

            setLastNegotiationDetails(
              negotiations.map((negotiation) => ({
                date: negotiation.created_dtm.split("T")[0], // Keep only the date
                negotiation: negotiation.feild_reason,
                remark: negotiation.remark,
              }))
            );

            const settlementDetailsData = data.data.settlementData;

            if (settlementDetailsData) {
              setSettlementDetails([
                {
                  date: settlementDetailsData.created_dtm
                    ? settlementDetailsData.created_dtm.split("T")[0]
                    : "",
                  status: settlementDetailsData.settlement_status || "",
                  expiresOn: settlementDetailsData.expire_date
                    ? settlementDetailsData.expire_date.split("T")[0]
                    : "",
                },
              ]);
            } else {
              setSettlementDetails([]);
            }
          } else {
            console.error("Error in API response:", data?.message || "Unknown error");
          }
        }
      } catch (error) {
        console.error("Error fetching case details:", error);
      }
    };

    const fetchRecoveryOfficers = async () => {
      try {
        if (userData?.drc_id) {
          const numericDrcId = Number(userData?.drc_id);
          const officers = await getActiveRODetailsByDrcID(numericDrcId);
    
          if (Array.isArray(officers)) {
            // Map recovery officers with ro_id and other details
            const formattedOfficers = officers.map((officer) => ({
              ro_id: officer.ro_id,
              ro_name: officer.ro_name,
              rtoms_for_ro: officer.rtoms_for_ro || [], // Ensure rtoms_for_ro is never undefined
            }));
    
            setRecoveryOfficers(formattedOfficers);
            console.log("Recovery Officers:", formattedOfficers);
          } else {
            console.error("Invalid response format:", officers);
            setRecoveryOfficers([]);
            setError("Failed to fetch recovery officers. Invalid response format.");
          }
        } else {
          setError("DRC ID not found in URL.");
        }
      } catch (error) {
        console.error("Error fetching recovery officers:", error);
        setError("Failed to fetch recovery officers.");
        setRecoveryOfficers([]); // Set empty array to prevent further errors
      }
    };

    if (userData?.drc_id) {
      fetchData();
      fetchRecoveryOfficers();
    }
  }, [userData, case_id]);

  const handleTextarea = async (remark) => {
    try {
      console.log("Data: ", case_id, userData?.drc_id, remark);
      await updateLastRoDetails(case_id, userData?.drc_id, remark);
    } catch (error) {
      console.error("Error in handleTextArea: ", error);
      throw new Error("Failed to update Last RO details");
    }
  }

  //Handle submit button
  const handleSubmit = async () => {
    try {
      // Ensure selectedRO is available (the value from the dropdown)
      const selectedRtom = selectedRO; // The selected RO name from the dropdown
      if (!selectedRtom) {
        Swal.fire("Error", "No Recovery Officer selected!", "error");
        return;
      }

      // Find the corresponding Recovery Officer object from recoveryOfficers
      const selectedOfficer = recoveryOfficers.find((officer) => officer.ro_name === selectedRtom);
      if (!selectedOfficer) {
        Swal.fire("Error", "Selected Recovery Officer not found!", "error");
        return;
      }

      // Get the ro_id of the selected officer
      const ro_id = selectedOfficer.ro_id;
      if (!ro_id) {
        Swal.fire("Error", "Recovery Officer ID is missing.", "error");
        return;
      }

      if (!textareaValue.trim()) {
        Swal.fire("Error", "Last RO details are required!", "error");
        return;
      }

      try {
        await handleTextarea(textareaValue);
      } catch (error) {
        console.error("Error in updating last ro details: ", error);
        Swal.fire("Error", "Failed to update Last Ro details.", "error");
        return;
      }

      const userId = await getLoggedUserId();

      // Ensure case_id is wrapped in an array
      const caseIdsArray = Array.isArray(case_id) ? case_id : [case_id];

      // Prepare the assignment payload
      const assignmentPayload = {
        caseIds: caseIdsArray,
        drcId: userData?.drc_id,
        roId: ro_id,
        assigned_by: userId, // Include assigned_by in the payload
      };

      // Call the API to assign the cases with separate parameters (caseIds and roId)
      const response = await assignROToCase(assignmentPayload);
      console.log("response: ", response);

      // Check if there are any failed cases
      if (response.details?.failed_cases?.length > 0) {
        Swal.fire("Error", "The RTOM area does not match any RTOM area assigned to Recovery Officer", "error");
        return;
      }

      if (response.status === 'success') {
        Swal.fire("Success", "Cases assigned successfully!", "success");
        navigate(`/drc/assigned-ro-case-log`);
      } else {
        Swal.fire("Error", response.message, "error");
      }

    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Swal.fire("Error", "An error occurred while assigning cases.", "error");
    }
  };

  return (
    <div className={`${GlobalStyle.fontPoppins}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={GlobalStyle.headingLarge}>Re-Assign RO</h1>
      </div>

      <div className={`${GlobalStyle.cardContainer || ""}`}>
        {[
          { label: "Case ID", value: caseDetails?.caseId },
          { label: "Customer Ref", value: caseDetails?.customerRef },
          { label: "Account No", value: caseDetails?.accountNo },
          { label: "Arrears Amount", value: caseDetails?.arrearsAmount },
          {
            label: "Last Payment Date",
            value: caseDetails?.lastPaymentDate
              ? new Date(caseDetails.lastPaymentDate).toLocaleDateString("en-CA")
              : "N/A"
          },
        ].map((item, index) => (
          <p key={index} className="mb-2 flex items-center">
            <strong className="w-40 text-left">{item.label}</strong>
            <span className="w-6 text-center">:</span>
            <span className="flex-1">{item.value || "N/A"}</span>
          </p>
        ))}
      </div>

      {/* remark box */}
      <div className="mb-6 flex items-center space-x-6">
        <label className={GlobalStyle.remarkTopic}>Last RO details</label>
        <textarea
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          className={`${GlobalStyle.remark}`}
          rows="5"
        ></textarea>
      </div>

      {/* Heading  */}
      <h2 className={`${GlobalStyle.remarkTopic} mb-4 `}>
        Last Negotiation Detail :
      </h2>

      {/* Table  */}
      <div className="mb-6 ">
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
              {lastNegotiationDetails.length > 0 ? (
                lastNegotiationDetails
                  .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort latest first
                  .map((item, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      }
                    >
                      <td className={GlobalStyle.tableData}>{item.date}</td>
                      <td className={GlobalStyle.tableData}>{item.negotiation}</td>
                      <td className={GlobalStyle.tableData}>{item.remark}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="3" className={GlobalStyle.tableData}>
                    No negotiation details available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlement details section */}
      <h2 className={`${GlobalStyle.remarkTopic} mb-4 `}>
        Settlement details :
      </h2>

      {/* Table  */}
      <div className="mb-6 ">
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>Date</th>
                <th className={GlobalStyle.tableHeader}>Status</th>
                <th className={GlobalStyle.tableHeader}>Expires on</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(settlementDetails) && settlementDetails.length > 0 ? (
                settlementDetails.map((item, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? GlobalStyle.tableRowEven
                        : GlobalStyle.tableRowOdd
                    }
                  >
                    <td className={GlobalStyle.tableData}>{item.date}</td>
                    <td className={GlobalStyle.tableData}>{item.status}</td>
                    <td className={GlobalStyle.tableData}>{item.expiresOn}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className={GlobalStyle.tableData}>
                    No settlement details available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* dropdown */}
      <div className="flex gap-10">
        <h1 className={GlobalStyle.remarkTopic}>Assign RO</h1>
        <select
          id="ro-select"
          className={`${GlobalStyle.selectBox}`}
          style={{ width: "600px" }}
          value={selectedRO || ""}
          onChange={(e) => {
            const selectedName = e.target.value;
            if (selectedName) {
              setSelectedRO(selectedName);
            }
          }}
        >
          <option value="" disabled>
            Select RO
          </option>
          {recoveryOfficers && recoveryOfficers.length > 0 ? (
            recoveryOfficers.map((officer, index) => {
              const rtomsNames = officer.rtoms_for_ro.map((rtom) => rtom.name).join(", ");
              const displayName = `${officer.ro_name} - ${rtomsNames}`;

              return (
                <option key={`ro-${index}`} value={officer.ro_name}>
                  {displayName}
                </option>
              );
            })
          ) : (
            <option value="" disabled>
              No officers available
            </option>
          )}
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end items-center w-full mt-6">
        <button className={`${GlobalStyle.buttonPrimary} ml-4`} onClick={handleSubmit}>Submit</button>
      </div>
      <button
        onClick={() => navigate(-1)}
        className={`${GlobalStyle.navButton} `}
      >
        <FaArrowLeft />Go Back
      </button>
    </div>
  );
}