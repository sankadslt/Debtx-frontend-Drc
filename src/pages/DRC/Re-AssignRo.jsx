/*Purpose: This template is used for the 2.5- Re-Assign RO
Created Date: 2025-01-07
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-02-19
Modified by: Nimesh Perera(nimeshmathew999@gmail.com), Sasindu srinayaka(sasindusrinayaka@gmail.com)
Modified By: Janani Kumarasiri (jkktg001@gmail.com)
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
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Re_AssignRo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRO, setSelectedRO] = useState("");
  const [recoveryOfficers, setRecoveryOfficers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    rtom: '',
    ro: '',
    remark: ''
  });
  const [tableRows, setTableRows] = useState([]);

  // State to manage case details
  const [caseDetails, setCaseDetails] = useState({
    caseId: "",
    customerRef: "",
    accountNo: "",
    arrearsAmount: "",
    lastPaymentDate: "",
  });

  const [caseRTOM, setCaseRTOM] = useState("");

  const [lastNegotiationDetails, setLastNegotiationDetails] = useState([]);
  const [selectedRTOM, setSelectedRTOM] = useState("");

  const [settlementDetails, setSettlementDetails] = useState([]);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const rowsPerPage = 5;
  const [currentNegotiationPage, setCurrentNegotiationPage] = useState(0);
  const [currentSettlementPage, setCurrentSettlementPage] = useState(0);

  // State for managing the remark text area value
  const [textareaValue, setTextareaValue] = useState("");
  const case_id = location.state?.CaseID;
  // console.log("caseid", case_id);

  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    // console.log("User data:", user);
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

          setIsLoading(true);
          const data = await fetchBehaviorsOfCaseDuringDRC(payload);

          // console.log("Data:", data);

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

            console.log("Case RTOM: ", caseDetailsData.rtom);
            setCaseRTOM(caseDetailsData.rtom || "");

            const negotiations = caseDetailsData.ro_negotiation_re_assign_ro || [];

            setLastNegotiationDetails(
              (negotiations || []).map((negotiation) => ({
                date: negotiation?.created_dtm
                  ? negotiation.created_dtm.split("T")[0]
                  : "N/A",
                negotiation: negotiation?.field_reason || "N/A",
                remark: negotiation?.remark || "N/A",
              }))
              // negotiations.map((negotiation) => ({
              //   date: negotiation.created_dtm.split("T")[0], // Keep only the date
              //   negotiation: negotiation.feild_reason,
              //   remark: negotiation.remark,
              // }))
            );

            setSettlementDetails(data.data.settlementData_ro_re_assign)

          } else {
            // console.error("Error in API response:", data?.message || "Unknown error");
            Swal.fire({
              title: "Error",
              text: "Error fetching case details.",
              icon: "error",
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: "Ok",
              confirmButtonColor: "#d33",
            })
          }
        }
      } catch (error) {
        // console.error("Error fetching case details:", error);
        Swal.fire({
          title: "Error",
          text: "Error fetching case details.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        })
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRecoveryOfficers = async () => {
      try {
        if (userData?.drc_id && caseRTOM) {
          const numericDrcId = Number(userData?.drc_id);

          console.log("Case Rtom from recovery officer: ", caseRTOM);

          setIsLoading(true);
          const officers = await getActiveRODetailsByDrcID(numericDrcId);

          if (Array.isArray(officers)) {
            // Map recovery officers with ro_id and other details
            const formattedOfficers = officers.map((officer) => ({
              ro_id: officer.ro_id,
              ro_name: officer.ro_name,
              rtoms_for_ro: officer.rtoms_for_ro || [], // Ensure rtoms_for_ro is never undefined
            }))
              .filter((officer) => officer.rtoms_for_ro.some((rtom) => rtom.name?.toLowerCase() === caseRTOM.toLowerCase()));

            setRecoveryOfficers(formattedOfficers);
            // console.log("Recovery Officers:", formattedOfficers);
          } else {
            // console.error("Invalid response format:", officers);

            Swal.fire({
              title: "Error",
              text: "Error fetching recovery officers details.",
              icon: "error",
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: "Ok",
              confirmButtonColor: "#d33",
            })
            setRecoveryOfficers([]);
            setError("Failed to fetch recovery officers. Invalid response format.");
          }
        } else {
          // setError("DRC ID not found in URL.");
        }
      } catch (error) {
        // console.error("Error fetching recovery officers:", error);
        Swal.fire({
          title: "Error",
          text: "Error fetching recovery officers details.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        })
        setError("Failed to fetch recovery officers.");
        setRecoveryOfficers([]); // Set empty array to prevent further errors
      } finally {
        setIsLoading(false);
      }
    };

    if (userData?.drc_id) {
      fetchData();
      fetchRecoveryOfficers();
    }
  }, [userData, case_id, caseRTOM]);

  const handleTextarea = async (remark) => {
    try {
      // console.log("Data: ", case_id, userData?.drc_id, remark);
      await updateLastRoDetails(case_id, userData?.drc_id, remark);
    } catch (error) {
      // console.error("Error in handleTextArea: ", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update Last RO details.",
        icon: "error",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "Ok",
        confirmButtonColor: "#d33",
      })
      throw new Error("Failed to update Last RO details");
    }
  }

  //Handle submit button
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRow = () => {
    if (!formData.rtom || !formData.ro) {
      Swal.fire({
        title: "Error",
        text: "RTOM and RO fields are required",
        icon: "error",
        confirmButtonColor: "#d33"
      });
      return;
    }

    setTableRows(prev => [...prev, { ...formData }]);
    
    // Clear form
    setFormData({
      rtom: '',
      ro: '',
      remark: ''
    });
  };

  const handleRemoveRow = (index) => {
    setTableRows(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      if (tableRows.length === 0) {
        Swal.fire({
          title: "Error",
          text: "Please add at least one RO assignment",
          icon: "error",
          confirmButtonColor: "#d33"
        });
        return;
      }
      // Ensure selectedRO is available (the value from the dropdown)
      const selectedRtom = selectedRO; // The selected RO name from the dropdown
      if (!selectedRtom) {
        // Swal.fire("Error", "No Recovery Officer selected!", "error");
        Swal.fire({
          title: "Error",
          text: "No Recovery Officer selected!",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        })
        return;
      }

      // Find the corresponding Recovery Officer object from recoveryOfficers
      const selectedOfficer = recoveryOfficers.find((officer) => officer.ro_name === selectedRtom);
      if (!selectedOfficer) {
        // Swal.fire("Error", "Selected Recovery Officer not found!", "error");
        Swal.fire({
          title: "Error",
          text: "Selected Recovery Officer not found!",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        })
        return;
      }

      // Get the ro_id of the selected officer
      const ro_id = selectedOfficer.ro_id;
      if (!ro_id) {
        // Swal.fire("Error", "Recovery Officer ID is missing.", "error");
        Swal.fire({
          title: "Error",
          text: "Recovery Officer ID is missing.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        })
        return;
      }

      if (!textareaValue.trim()) {
        // Swal.fire("Error", "Last RO details are required!", "error");
        Swal.fire({
          title: "Error",
          text: "Last RO details are required!",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        })
        return;
      }

      try {
        await handleTextarea(textareaValue);
      } catch (error) {
        // console.error("Error in updating last ro details: ", error);
        // Swal.fire("Error", "Failed to update Last Ro details.", "error");
        Swal.fire({
          title: "Error",
          text: "Failed to update Last RO details.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        })
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
      // console.log("response: ", response);

      // Check if there are any failed cases
      if (response.details?.failed_cases?.length > 0) {
        // Swal.fire("Error", "The RTOM area does not match any RTOM area assigned to Recovery Officer", "error");
        Swal.fire({
          title: "Error",
          text: "The RTOM area does not match any RTOM area assigned to Recovery Officer",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        })
        return;
      }

      if (response.status === 'success') {
        // Swal.fire("Success", "Cases assigned successfully!", "success");
        Swal.fire({
          title: "Success",
          text: "Cases assigned successfully!",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#28a745",
        })
        navigate(`/drc/assigned-ro-case-log`);
      } else {
        // Swal.fire("Error", response.message, "error");
        Swal.fire({
          title: "Error",
          text: "response.message",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        })
      }

    } catch (error) {
      // console.error("Error in handleSubmit:", error);
      // Swal.fire("Error", "An error occurred while assigning cases.", "error");
      Swal.fire({
        title: "Error",
        text: "An error occurred while assigning cases.",
        icon: "error",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "Ok",
        confirmButtonColor: "#d33",
      })
    }
  };

  // const NegotiationDetails = cusNegotiationData?.additionalData?.ro_negotiation || [];
  const pagesNegotiationDetails = Math.ceil(lastNegotiationDetails.length / rowsPerPage);
  const startIndexNegotiationDetails = currentNegotiationPage * rowsPerPage;
  const endIndexNegotiationDetails = startIndexNegotiationDetails + rowsPerPage;
  const dataInPageNegotiationDetails = lastNegotiationDetails.slice(startIndexNegotiationDetails, endIndexNegotiationDetails);

  const handleNegotiationPageChange = (direction) => {
    if (direction === "next") {
      if (currentNegotiationPage < pagesNegotiationDetails - 1) {
        setCurrentNegotiationPage(currentNegotiationPage + 1);
      }
    } else if (direction === "prev") {
      if (currentNegotiationPage > 0) {
        setCurrentNegotiationPage(currentNegotiationPage - 1);
      }
    }
  };

  // const SettlementDetails = cusNegotiationData?.settlementData || [];
  const pagesSettlementDetails = Math.ceil(settlementDetails.length / rowsPerPage);
  const startIndexSettlementDetails = currentSettlementPage * rowsPerPage;
  const endIndexSettlementDetails = startIndexSettlementDetails + rowsPerPage;
  const dataInPageSettlementDetails = settlementDetails.slice(startIndexSettlementDetails, endIndexSettlementDetails);

  const handleSettlementPageChange = (direction) => {
    if (direction === "next") {
      if (currentSettlementPage < pagesSettlementDetails - 1) {
        setCurrentSettlementPage(currentSettlementPage + 1);
      }
    } else if (direction === "prev") {
      if (currentSettlementPage > 0) {
        setCurrentSettlementPage(currentSettlementPage - 1);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`${GlobalStyle.fontPoppins}`}>
       <h1 className={GlobalStyle.headingLarge}>Re-Assign RO</h1>
      <div className="flex flex-row gap-4 w-full items-stretch">
        </div>
        
  

      <div className="flex gap-6 mb-4 w-full">
        {/* Case Data Card */}
        <div className={`${GlobalStyle.cardContainer} flex-1 min-h-[300px]`}>
          <div className="flex flex-col w-full">
          <h2 className="text-lg font-semibold mb-4">Case Data</h2>
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
          
        </div>

        {/* Last RO Details Card */}

        <div className={`${GlobalStyle.cardContainer} flex-1 min-h-[300px] `}>
         <div className="flex flex-col w-full">
    <h2 className="text-lg font-semibold mb-4">Last RO Details</h2>
    <textarea
      value={textareaValue}
      onChange={(e) => setTextareaValue(e.target.value)}
      className={`${GlobalStyle.remark} w-full`}
      rows="5"
    ></textarea>
  </div>
      </div>
        

      </div>
      {/* Form Section */}

      <div className="flex items-center justify-center mb-4 w-full">
        <div className={`${GlobalStyle.cardContainer}`}>
          {/* ADD RO */}
          <h2 className={`${GlobalStyle.headingMedium} mb-4 text-center`}>
            <strong> ADD RO </strong>
          </h2>

          
{/* RTOM & RO in one row */}
<div className="flex gap-6 mb-4 w-full">
          {/* Select RTOM */}
<div className="flex flex-col w-1/2">
  <label className={GlobalStyle.remarkTopic}>Select RTOM</label>
  <select
    id="rtom-select"
    className={`${GlobalStyle.selectBox}`}
    style={{ color: selectedRTOM === "" ? "gray" : "black" }}
    value={selectedRTOM || ""}
    onChange={(e) => {
      const selectedName = e.target.value;
      if (selectedName) {
        setSelectedRTOM(selectedName);
      }
    }}
  >
    <option value="" hidden>
      Select RTOM
    </option>
    {recoveryOfficers && recoveryOfficers.length > 0 ? (
      recoveryOfficers.map((officer, index) => {
        const rtomsNames = officer.rtoms_for_ro.map((rtom) => rtom.name).join(", ");
        const displayName = `${officer.rtom_name} - ${rtomsNames}`;

        return (
          <option key={`ro-${index}`} value={officer.ro_name} style={{ color: "black" }}>
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



          {/* Assign RO */}
<div className="flex flex-col w-1/2">
  <label className={GlobalStyle.remarkTopic}>Assign RO</label>
  <select
    id="ro-select"
    className={`${GlobalStyle.selectBox}`}
    style={{ color: selectedRO === "" ? "gray" : "black" }}
    value={selectedRO || ""}
    onChange={(e) => {
      const selectedName = e.target.value;
      if (selectedName) {
        setSelectedRO(selectedName);
      }
    }}
  >
    <option value="" hidden>
      Select RO
    </option>
    {recoveryOfficers && recoveryOfficers.length > 0 ? (
      recoveryOfficers.map((officer, index) => {
        const rtomsNames = officer.rtoms_for_ro.map((rtom) => rtom.name).join(", ");
        const displayName = `${officer.ro_name} - ${rtomsNames}`;

        return (
          <option key={`ro-${index}`} value={officer.ro_name} style={{ color: "black" }}>
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
</div>

          
          <div className="flex flex-col space-y-4">
            {/* Remark Input */}
            <div className="flex flex-col">
              <label className={GlobalStyle.remarkTopic}>Remark</label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleFormChange}
                className={`${GlobalStyle.remark} w-full`}
                rows="2"
                placeholder="Enter remark"
              />
            </div>
          </div>

          {/* Add Button */}
          <div className="flex justify-end mt-3">
            <button
              className={`${GlobalStyle.buttonPrimary}`}
              onClick={() => {
                if (!selectedRTOM || !selectedRO) {
                  Swal.fire({
                    title: "Error",
                    text: "Please select both RTOM and RO",
                    icon: "error",
                    confirmButtonColor: "#d33"
                  });
                  return;
                }

                setTableRows(prev => [...prev, {
                  rtom: selectedRTOM,
                  ro: selectedRO,
                  remark: formData.remark
                }]);

                // Clear selections and remark
                setSelectedRTOM("");
                setSelectedRO("");
                setFormData(prev => ({
                  ...prev,
                  remark: ""
                }));
              }}
            >
              Add
            </button>
          </div>

    {/* Table Section */}
    <div className={`${GlobalStyle.tableContainer} mb-6 overflow-x-auto`}>
      <table className={GlobalStyle.table}>
        <thead className={GlobalStyle.thead}>
          <tr>
            <th className={GlobalStyle.tableHeader}>RTOM</th>
            <th className={GlobalStyle.tableHeader}>RO</th>
            <th className={GlobalStyle.tableHeader}>Remark</th>
            <th className={GlobalStyle.tableHeader}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}>
              <td className={GlobalStyle.tableData}>{row.rtom}</td>
              <td className={GlobalStyle.tableData}>{row.ro}</td>
              <td className={GlobalStyle.tableData}>{row.remark}</td>
              <td className={GlobalStyle.tableData}>
                <button
                  onClick={() => handleRemoveRow(index)}
                  className={`${GlobalStyle.buttonDanger} px-2 py-1`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>



          {/* Submit Button */}
<div className="flex justify-end items-center w-full mt-6">
  <button className={`${GlobalStyle.buttonPrimary} ml-4`} onClick={handleSubmit}>
    Submit
  </button>
</div>
        </div>
      </div>

      {/* Heading  */}
      <h2 className={`${GlobalStyle.remarkTopic} mb-4 `}>
        Last Negotiation Detail :
      </h2>

      {/* Table  */}
      <div className="mb-6 ">
        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>Date</th>
                <th className={GlobalStyle.tableHeader}>Negotiation</th>
                {/* <th className={GlobalStyle.tableHeader}>Remark</th> */}
              </tr>
            </thead>
            <tbody>
              {dataInPageNegotiationDetails.length > 0 ? (
                dataInPageNegotiationDetails
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
                      <td className={GlobalStyle.tableData}>
                        {
                          new Date(item.date) && new Date(item.date).toLocaleDateString("en-GB")
                        }
                      </td>
                      <td className={GlobalStyle.tableData}>{item.negotiation}</td>
                      {/* <td className={GlobalStyle.tableData}>{item.remark}</td> */}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="3" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                    No negotiation details available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={GlobalStyle.navButtonContainer}>
        <button className={GlobalStyle.navButton} onClick={handleNegotiationPageChange("prev")} disabled={currentNegotiationPage === 0}>
          <FaArrowLeft />
        </button>
        <span className="text-gray-700">
          Page {currentNegotiationPage + 1} of {pagesNegotiationDetails}
        </span>
        <button className={GlobalStyle.navButton} onClick={handleNegotiationPageChange("next")} disabled={currentNegotiationPage === pagesNegotiationDetails - 1}>
          <FaArrowRight />
        </button>
      </div>

      {/* Settlement details section */}
      <h2 className={`${GlobalStyle.remarkTopic} mb-4 `}>
        Settlement details :
      </h2>

      {/* Table  */}
      <div className="mb-6 ">
        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>Created Date</th>
                <th className={GlobalStyle.tableHeader}>Status</th>
                <th className={GlobalStyle.tableHeader}>Expires on</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dataInPageSettlementDetails) && dataInPageSettlementDetails.length > 0 ? (
                dataInPageSettlementDetails
                .sort((a, b) => new Date(b.created_dtm) - new Date(a.created_dtm)) // Sort latest first
                .map((item, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? GlobalStyle.tableRowEven
                        : GlobalStyle.tableRowOdd
                    }
                  >
                    <td className={GlobalStyle.tableData}>
                      {item?.created_dtm &&
                        new Date(item.created_dtm).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                    </td>
                    <td className={GlobalStyle.tableData}>{item.settlement_status}</td>
                    <td className={GlobalStyle.tableData}>
                      {item?.expire_date &&
                        new Date(item.expire_date).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                    No settlement details available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={GlobalStyle.navButtonContainer}>
        <button className={GlobalStyle.navButton} onClick={handleSettlementPageChange("prev")} disabled={currentSettlementPage === 0}>
          <FaArrowLeft />
        </button>
        <span className="text-gray-700">
          Page {currentSettlementPage + 1} of {pagesSettlementDetails}
        </span>
        <button className={GlobalStyle.navButton} onClick={handleSettlementPageChange("next")} disabled={currentSettlementPage === pagesSettlementDetails - 1}>
          <FaArrowRight />
        </button>
      </div>

      {/* dropdown */}
      {/* <div className="flex gap-10">
        <h1 className={GlobalStyle.remarkTopic}>Assign RO</h1>
        <select
          id="ro-select"
          className={`${GlobalStyle.selectBox}`}
          // style={{ width: "600px" }}
          style={{ color: selectedRO === "" ? "gray" : "black" }}
          value={selectedRO || ""}
          onChange={(e) => {
            const selectedName = e.target.value;
            if (selectedName) {
              setSelectedRO(selectedName);
            }
          }}
        >
          <option value="" hidden>
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
      </div> */}

      {/* Submit Button */}
      {/* <div className="flex justify-end items-center w-full mt-6">
        <button className={`${GlobalStyle.buttonPrimary} ml-4`} onClick={handleSubmit}>Submit</button>
      </div> */}
      <button
        onClick={() => navigate("/drc/assigned-ro-case-log")}
        className={`${GlobalStyle.buttonPrimary} `}
      >
        <FaArrowLeft className="mr-2" />
      </button>
    </div>
  );
}