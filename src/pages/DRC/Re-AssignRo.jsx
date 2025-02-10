/*Purpose: This template is used for the 2.5- Re-Assign RO
Created Date: 2025-01-07
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-01-08
Version: node 20
ui number : 2.5
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for the Re-Assign RO  */

import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { List_Behaviors_Of_Case_During_DRC } from "../../services/case/CaseService";
import { getActiveRODetailsByDrcID  } from "../../services/Ro/RO";

export default function Re_AssignRo() {


  const { drc_id, case_id } = useParams();
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
    const fetchData = async () => {
      try {
        if (drc_id && case_id) {

          const data = await List_Behaviors_Of_Case_During_DRC(drc_id, case_id);

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
            if (drc_id) {
              const numericDrcId = Number(drc_id);
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
    











    
  }, [drc_id, case_id]);


  const handleSubmit = () => {
    alert("Submit button clicked");
  }

  return (
    <div className={`${GlobalStyle.fontPoppins}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={GlobalStyle.headingLarge}>Re-Assign RO</h1>
      </div>
      {/* card box*/}

      <div className={`${GlobalStyle.cardContainer}`}>
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
      </div>


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
    </div>
  );
}
