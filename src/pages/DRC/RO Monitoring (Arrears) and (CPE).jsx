/*Purpose: This template is used for the 2.4.1- RO Monitoring (Arrears) and 2.4.2- RO Monitoring (CPE)
Created Date: 2025-01-07
Created By: Chamithu (chamithujayathilaka2003@gmail.com)
Last Modified Date: 2025-02-18
Modified by: Nimesh Perera(nimeshmathew999@gmail.com)
Version: node 20
ui number : 2.4.1 and  2.4.2
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for both the UI's */


import { useEffect, useState } from "react";
import { FaChevronDown, FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { fetchBehaviorsOfCaseDuringDRC } from "../../services/case/CaseService.js";
import { getLoggedUserId } from "../../services/auth/authService.js";

export default function RO_Monitoring_CPE() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Customer Negotiation");
    const [userData, setUserData] = useState(null);
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(null);
    const [cusNegotiationData, setCusNegotiationData] = useState({
        caseDetails: {},
        settlementData: {},
        paymentData: {},
        additionalData: { ro_negotiation: [], ro_requests: [] }
    });
    const case_id = location.state?.CaseID;
    console.log("caseid", case_id);

    // Tab click handler
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Accordion handler
    const handleAccordion = (index) => {
        setIsOpen(isOpen === index ? null : index);
    }

    // const loadUser = async () => {
    //     let token = localStorage.getItem("accessToken");
    //     if (!token) {
    //         setUserData(null);
    //         return;
    //     }

    //     try {
    //         let decoded = jwtDecode(token);
    //         const currentTime = Date.now() / 1000;
    //         if (decoded.exp < currentTime) {
    //             token = await refreshAccessToken();
    //             if (!token) return;
    //             decoded = jwtDecode(token);
    //         }

    //         setUserData({
    //             id: decoded.user_id,
    //             role: decoded.role,
    //             drc_id: decoded.drc_id,
    //             ro_id: decoded.ro_id,
    //         });
    //     } catch (error) {
    //         console.error("Invalid token:", error);
    //     }
    // };

    // useEffect(() => {
    //     loadUser();
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
                if (!userData?.drc_id) {
                    console.log("Missing DRC Id.", userData?.drc_id);
                    return;
                }
                const payload = {
                    drc_id: userData.drc_id,
                    case_id: Number(case_id),
                };
                const response = await fetchBehaviorsOfCaseDuringDRC(payload);
                
                if (response && response.data) {
                    const { formattedCaseDetails, settlementData, paymentData } = response.data;
                    
                    setCusNegotiationData({
                        caseDetails: formattedCaseDetails || {},
                        settlementData: settlementData || {},
                        paymentData: paymentData || {},
                        additionalData: {
                            ro_negotiation: formattedCaseDetails?.ro_negotiation || [],
                            ro_requests: formattedCaseDetails?.ro_requests || []
                        }
                    });
                } else {
                    console.log("No data returned or unexpected response format:", response);
                }
            } catch (error) {
                console.log("Error fetching data: ", error);
            }
        };

        if (userData?.drc_id) {
            fetchData();
        }
    }, [userData?.drc_id, case_id]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-CA");
        } catch (error) {
            return "Invalid Date";
        }
    };

     return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className={GlobalStyle.headingLarge}>Case Updates</h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-4">
                {["Customer Negotiation", "CPE Collect"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`px-4 py-2 ${activeTab === tab
                            ? "border-b-2 border-blue-500 font-bold"
                            : "text-gray-500"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content for each tab */}
            <div className="flex flex-col">
                {/* Content for "CPE Collect" */}
                {activeTab === "CPE Collect" && (
                    <>
                        {/* Card Section */}
                        <div className="flex flex-col items-center justify-center mb-4">
                            <div className={`${GlobalStyle.cardContainer}`}>
                                {[
                                    { label: "Case ID", value: cusNegotiationData?.caseDetails?.case_id },
                                    { label: "Customer Ref", value: cusNegotiationData?.caseDetails?.customer_ref },
                                    { label: "Account No", value: cusNegotiationData?.caseDetails?.account_no },
                                ].map((item, index) => (
                                    <p key={index} className="mb-2 flex items-center">
                                        <strong className="w-40 text-left">{item.label}</strong>
                                        <span className="w-6 text-center">:</span>
                                        <span className="flex-1">{item.value || "N/A"}</span>
                                    </p>
                                ))}
                            </div>
                        </div>

                        {(cusNegotiationData?.caseDetails?.ref_products || []).map((product, index) => (
                            <div key={index} className="overflow-hidden">
                                <button
                                    className="flex justify-between items-center w-full p-2 bg-[#384B5C] text-white mb-4 rounded-r-lg"
                                    onClick={() => handleAccordion(index)}
                                >
                                    <span>{`Equipment ${index + 1}`}</span>
                                    <span className="flex items-center justify-center pr-2">
                                        <FaChevronDown className={`w-4 h-4 transition-transform ${isOpen === index ? "rotate-180" : "rotate-0"}`} />
                                    </span>
                                </button>
                                <div className={`transition-[max-height] duration-300 overflow-hidden ${isOpen === index ? "max-h-fit" : "max-h-0"}`}>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className={`${GlobalStyle.cardContainer}`}>
                                            {[
                                                { label: "Product Label", value: product.product_label },
                                                { label: "Service Type", value: product.service },
                                                { label: "Service Address", value: product.service_address },
                                                { label: "Service Status", value: product.product_status },
                                                { label: "Ownership", value: product.product_ownership },
                                            ].map((item, idx) => (
                                                <p key={idx} className="mb-2 flex items-center">
                                                    <strong className="w-40 text-left">{item.label}</strong>
                                                    <span className="w-6 text-center">:</span>
                                                    <span className="flex-1">{item.value || "N/A"}</span>
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Table for Last Negotiation Details */}
                                    <h2 className={`${GlobalStyle.headingMedium} mb-4`}>Last Negotiation Detail</h2>
                                    <div className={`${GlobalStyle.tableContainer} mb-4`}>
                                        <table className={GlobalStyle.table}>
                                            <thead className={GlobalStyle.thead}>
                                                <tr>
                                                    <th className={GlobalStyle.tableHeader}>Date</th>
                                                    <th className={GlobalStyle.tableHeader}>Negotiation</th>
                                                    <th className={GlobalStyle.tableHeader}>Remark</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...(cusNegotiationData?.additionalData?.ro_negotiation || [])]
                                                    .sort((a, b) => new Date(b.created_dtm) - new Date(a.created_dtm))
                                                    .map((item, idx) => (
                                                        <tr
                                                            key={item._id || idx}
                                                            className={idx % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                                                        >
                                                            <td className={GlobalStyle.tableData}>
                                                                {formatDate(item.created_dtm)}
                                                            </td>
                                                            <td className={GlobalStyle.tableData}>{item.feild_reason || "N/A"}</td>
                                                            <td className={GlobalStyle.tableData}>{item.remark || "N/A"}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <div>
                            <button
                                onClick={() => navigate(-1)}
                                className={GlobalStyle.navButton}
                            >
                                <FaArrowLeft />Go Back
                            </button>
                        </div>
                    </>
                )}

                {/* Content for "Customer Negotiation" */}
                {activeTab === "Customer Negotiation" && (
                    <>
                        <div className={`${GlobalStyle.cardContainer}`}>
                            {[
                                { label: "Case ID", value: cusNegotiationData?.caseDetails?.case_id },
                                { label: "Customer Ref", value: cusNegotiationData?.caseDetails?.customer_ref },
                                { label: "Account No", value: cusNegotiationData?.caseDetails?.account_no },
                                { label: "Arrears Amount", value: cusNegotiationData?.caseDetails?.current_arrears_amount },
                                { label: "Last Payment Date", value: formatDate(cusNegotiationData?.caseDetails?.last_payment_date) },
                            ].map((item, index) => (
                                <p key={index} className="mb-2 flex items-center">
                                    <strong className="w-40 text-left">{item.label}</strong>
                                    <span className="w-6 text-center">:</span>
                                    <span className="flex-1">{item.value || "N/A"}</span>
                                </p>
                            ))}
                        </div>

                        {/* Content for the Last Negotiation Detail Section */}
                        <h2 className={`${GlobalStyle.headingMedium} mb-4`}>Last Negotiation Detail</h2>
                        {/* Table Section */}
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
                                    {(cusNegotiationData?.additionalData?.ro_negotiation || []).map((item, index) => (
                                        <tr
                                            key={item._id || index}
                                            className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                                        >
                                            <td className={GlobalStyle.tableData}>{formatDate(item.created_dtm)}</td>
                                            <td className={GlobalStyle.tableData}>{item.feild_reason || "N/A"}</td>
                                            <td className={GlobalStyle.tableData}>{item.remark || "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Content for the Settlement Details Section */}
                        <h2 className={`${GlobalStyle.headingMedium} mb-4 mt-4`}>Settlement Details</h2>
                        {/* Table Section */}
                        <div className={GlobalStyle.tableContainer}>
                            <table className={GlobalStyle.table}>
                                <thead className={GlobalStyle.thead}>
                                    <tr>
                                        <th className={GlobalStyle.tableHeader}>Created Date</th>
                                        <th className={GlobalStyle.tableHeader}>Status</th>
                                        <th className={GlobalStyle.tableHeader}>Expired On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className={GlobalStyle.tableRowEven}>
                                        <td className={GlobalStyle.tableData}>
                                            {formatDate(cusNegotiationData?.settlementData?.created_dtm)}
                                        </td>
                                        <td className={GlobalStyle.tableData}>
                                            {cusNegotiationData?.settlementData?.settlement_status || "N/A"}
                                        </td>
                                        <td className={GlobalStyle.tableData}>
                                            {formatDate(cusNegotiationData?.settlementData?.expire_date)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Content for the Payment Details Section */}
                        <h2 className={`${GlobalStyle.headingMedium} mb-4 mt-4`}>Payment Details</h2>
                        {/* Table Section */}
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
                                    <tr className={GlobalStyle.tableRowEven}>
                                        <td className={GlobalStyle.tableData}>
                                            {formatDate(cusNegotiationData?.paymentData?.created_dtm)}
                                        </td>
                                        <td className={GlobalStyle.tableData}>
                                            {cusNegotiationData?.paymentData?.bill_paid_amount || "N/A"}
                                        </td>
                                        <td className={GlobalStyle.tableData}>
                                            {cusNegotiationData?.paymentData?.settled_balance || "N/A"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Content for the Requests Details Section */}
                        <h2 className={`${GlobalStyle.headingMedium} mb-4 mt-4`}>Requested Additional Details</h2>
                        {/* Table Section */}
                        <div className={`${GlobalStyle.tableContainer} mb-4`}>
                            <table className={GlobalStyle.table}>
                                <thead className={GlobalStyle.thead}>
                                    <tr>
                                        <th className={GlobalStyle.tableHeader}>Date</th>
                                        <th className={GlobalStyle.tableHeader}>Request</th>
                                        <th className={GlobalStyle.tableHeader}>Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(cusNegotiationData?.additionalData?.ro_requests || []).map((item, index) => (
                                        <tr
                                            key={item._id || index}
                                            className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                                        >
                                            <td className={GlobalStyle.tableData}>{formatDate(item.created_dtm)}</td>
                                            <td className={GlobalStyle.tableData}>{item.ro_request || "N/A"}</td>
                                            <td className={GlobalStyle.tableData}>{item.remark || "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <button
                                onClick={() => navigate(-1)}
                                className={GlobalStyle.navButton}
                            >
                                <FaArrowLeft />Go Back
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}