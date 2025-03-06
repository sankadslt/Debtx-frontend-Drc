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

import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assignROToCase, List_Behaviors_Of_Case_During_DRC, updateLastRoDetails } from "../../services/case/CaseService";
import { getActiveRODetailsByDrcID } from "../../services/Ro/RO";
import { getLoggedUserId, getUserData } from "../../services/auth/authService";
import Swal from 'sweetalert2';
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";

export default function Re_AssignRo() {
  const navigate = useNavigate();
  const { case_id } = useParams();
  const [user, setUser] = useState(null);
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
  const [settlementDetails, setSettlementDetails] = useState({});

  // State for managing the remark text area value
  const [textareaValue, setTextareaValue] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setUser(userData);
        console.log("DRC ID: ", user?.drc_id);
      } catch (err) {
        console.log("Eror in retrieving DRC ID: ", err);
      }
    };

    fetchUserData();
  }, [user?.drc_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.drc_id && case_id) {

          const data = await List_Behaviors_Of_Case_During_DRC(user?.drc_id, case_id);

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

            const negotiations = data.data.formattedCaseDetails.ro_negotiation || [];

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
            }


          } else {
            console.error("Error in API response:", data?.message || "Unknown error");
          }


          console.log(settlementDetails);



        }
      } catch (error) {
        console.error("Error fetching case details:", error);
      }
    };

    const fetchRecoveryOfficers = async () => {
      try {
        if (user?.drc_id) {
          const numericDrcId = Number(user?.drc_id);
          const response = await getActiveRODetailsByDrcID(numericDrcId);

          // Map recovery officers with ro_id and other details
          const officers = response.data.map((officer) => ({
            ro_id: officer.ro_id, // Include ro_id
            ro_name: officer.ro_name,
            rtoms_for_ro: officer.rtoms_for_ro,
          }));
          setRecoveryOfficers(officers);
        } else {
          setError("DRC ID not found in URL.");
        }
      } catch (error) {
        console.error("Error fetching recovery officers:", error);
        setError("Failed to fetch recovery officers.");
      }
    };

    fetchData();
    fetchRecoveryOfficers();

  }, [user?.drc_id, case_id]);

  const handleTextarea = async (remark) => {
    try {
      console.log("Data: ", case_id, user?.drc_id, remark);
      await updateLastRoDetails(case_id, user?.drc_id, remark);
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
        return
      }

      const userId = await getLoggedUserId();

      // Ensure case_id is wrapped in an array
      const caseIdsArray = Array.isArray(case_id) ? case_id : [case_id];

      // Prepare the assignment payload
      const assignmentPayload = {
        caseIds: caseIdsArray,
        drcId: user?.drc_id,
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
      {/* card box*/}

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


      {/* <div className={`${GlobalStyle.cardContainer}`}>
        <p className="mb-2">
          <strong>Case ID: {caseDetails.caseId}</strong>
        </p>
        <p className="mb-2">
          <strong>Customer Ref: {caseDetails.customerRef}</strong>{" "}
        </p>
        <p className="mb-2">
          <strong>Account no: {caseDetails.accountNo}</strong>{" "}
        </p>
        <p className="mb-2">
          <strong>Arrears Amount: {caseDetails.arrearsAmount}</strong>{" "}
        </p>
        <p className="mb-2">
          <strong>Last Payment Date: {caseDetails.lastPaymentDate}</strong>{" "}
        </p>
      </div> */}


      {/* remark box */}
      <div className="mb-6 flex items-center  space-x-6">
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
      {<div className="mb-6 ">
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
              {lastNegotiationDetails
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
                ))}
            </tbody>
          </table>
        </div>
      </div>}

      {/* Settlement details section */}
      <h2 className={`${GlobalStyle.remarkTopic} mb-4 `}>
        Settlement details :
      </h2>

      {/* Table  */}
      {<div className="mb-6 ">
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>date</th>
                <th className={GlobalStyle.tableHeader}>status</th>
                <th className={GlobalStyle.tableHeader}>expires on</th>
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
      </div>}



      {/* dropdown */}
      <div className="flex   gap-10">
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
