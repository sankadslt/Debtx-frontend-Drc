/*Purpose: This template is used for the 2.4.1- RO Monitoring (Arrears) and 2.4.2- RO Monitoring (CPE)
Created Date: 2025-01-07
Created By: Chamithu (chamithujayathilaka2003@gmail.com)
Last Modified Date: 2025-02-18
Modified by: Nimesh Perera(nimeshmathew999@gmail.com)
Modified By: Janani Kumarasiri (jkktg001@gmail.com)
Version: node 20
ui number : 2.4.1 and  2.4.2
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for both the UI's */


import { useEffect, useState } from "react";
import { FaChevronDown, FaArrowLeft, FaArrowRight } from "react-icons/fa6";
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
    const [isLoading, setIsLoading] = useState(false);
    const [cusNegotiationData, setCusNegotiationData] = useState({
        caseDetails: {},
        settlementData: [],
        paymentData: [],
        additionalData: { ro_negotiation: [], ro_requests: [] }
    });
    const case_id = location.state?.CaseID;
    // console.log("caseid", case_id);

    const rowsPerPage = 5; // Number of rows per page
    const [currentNegotiationPage, setCurrentNegotiationPage] = useState(0);
    const [currentSettlementPage, setCurrentSettlementPage] = useState(0);
    const [currentPaymentPage, setCurrentPaymentPage] = useState(0);
    const [currentRequestPage, setCurrentRequestPage] = useState(0);

    // Tab click handler
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Accordion handler
    const handleAccordion = (index) => {
        setIsOpen(isOpen === index ? null : index);
    }

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
                if (!userData?.drc_id) {
                    // console.log("Missing DRC Id.", userData?.drc_id);
                    return;
                }
                const payload = {
                    drc_id: userData.drc_id,
                    case_id: Number(case_id),
                };

                setIsLoading(true);
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
                    // console.log("No data returned or unexpected response format:", response);
                    Swal.fire({
                        title: "Error",
                        text: "No data returned or unexpected response format.",
                        icon: "error",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#d33",
                    })
                }
            } catch (error) {
                // console.log("Error fetching data: ", error);
                Swal.fire({
                    title: "Error",
                    text: "Error fetching data.",
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

        if (userData?.drc_id) {
            fetchData();
        }
    }, [userData?.drc_id, case_id]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-GB");
        } catch (error) {
            return "Invalid Date";
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // console.log("cusNegotiationData", cusNegotiationData);

    // const PaymentDetails = Paymentdata.payment_details || [];
    // const pagesPaymentDetails = Math.ceil(PaymentDetails.length / rowsPerPage);
    // const startIndexPaymentDetails = currentPagePaymentDetails * rowsPerPage;
    // const endIndexPaymentDetails = startIndexPaymentDetails + rowsPerPage;
    // const dataInPagePaymentDetails = PaymentDetails.slice(startIndexPaymentDetails, endIndexPaymentDetails);

    const NegotiationDetails = cusNegotiationData?.additionalData?.ro_negotiation || [];
    const pagesNegotiationDetails = Math.ceil(NegotiationDetails.length / rowsPerPage);
    const startIndexNegotiationDetails = currentNegotiationPage * rowsPerPage;
    const endIndexNegotiationDetails = startIndexNegotiationDetails + rowsPerPage;
    const dataInPageNegotiationDetails = NegotiationDetails.slice(startIndexNegotiationDetails, endIndexNegotiationDetails);

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

    const SettlementDetails = cusNegotiationData?.settlementData || [];
    const pagesSettlementDetails = Math.ceil(SettlementDetails.length / rowsPerPage);
    const startIndexSettlementDetails = currentSettlementPage * rowsPerPage;
    const endIndexSettlementDetails = startIndexSettlementDetails + rowsPerPage;
    const dataInPageSettlementDetails = SettlementDetails.slice(startIndexSettlementDetails, endIndexSettlementDetails);

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

    const PaymentDetails = cusNegotiationData?.paymentData || [];
    const pagesPaymentDetails = Math.ceil(PaymentDetails.length / rowsPerPage);
    const startIndexPaymentDetails = currentPaymentPage * rowsPerPage;
    const endIndexPaymentDetails = startIndexPaymentDetails + rowsPerPage;
    const dataInPagePaymentDetails = PaymentDetails.slice(startIndexPaymentDetails, endIndexPaymentDetails);

    const handlePaymentPageChange = (direction) => {
        if (direction === "next") {
            if (currentPaymentPage < pagesPaymentDetails - 1) {
                setCurrentPaymentPage(currentPaymentPage + 1);
            }
        } else if (direction === "prev") {
            if (currentPaymentPage > 0) {
                setCurrentPaymentPage(currentPaymentPage - 1);
            }
        }
    };

    const RequestDetails = cusNegotiationData?.additionalData?.ro_requests || [];
    const pagesRequestDetails = Math.ceil(RequestDetails.length / rowsPerPage);
    const startIndexRequestDetails = currentRequestPage * rowsPerPage;
    const endIndexRequestDetails = startIndexRequestDetails + rowsPerPage;
    const dataInPageRequestDetails = RequestDetails.slice(startIndexRequestDetails, endIndexRequestDetails);
    const handleRequestPageChange = (direction) => {
        if (direction === "next") {
            if (currentRequestPage < pagesRequestDetails - 1) {
                setCurrentRequestPage(currentRequestPage + 1);
            }
        } else if (direction === "prev") {
            if (currentRequestPage > 0) {
                setCurrentRequestPage(currentRequestPage - 1);
            }
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
                                    {/* <span>{`Equipment ${index + 1}`}</span> */}
                                    <span>{`${product.account_no} - ${product.service}`}</span>
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
                                                {product?.negotiation.length > 0 ? (
                                                    product?.negotiation.map((item, idx) => (
                                                            <tr
                                                                key={item._id || idx}
                                                                className={idx % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                                                            >
                                                                <td className={GlobalStyle.tableData}>
                                                                    {formatDate(item.collected_date)}
                                                                </td>
                                                                <td className={GlobalStyle.tableData}></td>
                                                                <td className={GlobalStyle.tableData}>{item.remark || "N/A"}</td>
                                                            </tr>
                                                        ))) : (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-4">
                                                            No negotiation details under This product.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div>
                            <button
                                onClick={() => navigate(-1)}
                                className={GlobalStyle.buttonPrimary}
                            >
                                <FaArrowLeft />
                            </button>
                        </div>
                    </>
                )}

                {/* Content for "Customer Negotiation" */}
                {activeTab === "Customer Negotiation" && (
                    <>
                        <div className="flex items-center justify-center mb-4">
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
                                    {dataInPageNegotiationDetails.length > 0 ? (
                                        dataInPageNegotiationDetails.map((item, index) => (
                                            <tr
                                                key={index}
                                                className={`${index % 2 === 0
                                                    ? GlobalStyle.tableRowEven
                                                    : GlobalStyle.tableRowOdd
                                                    } border-b`}
                                            >
                                                <td className={GlobalStyle.tableData}>{formatDate(item.created_dtm)}</td>
                                                <td className={GlobalStyle.tableData}>{item.field_reason || "N/A"}</td>
                                                <td className={GlobalStyle.tableData}>{item.remark || "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">
                                                No data matching the criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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
                                    {dataInPageSettlementDetails.length > 0 ? (
                                        dataInPageSettlementDetails.map((item, index) => (
                                            <tr
                                                key={index}
                                                className={`${index % 2 === 0
                                                    ? GlobalStyle.tableRowEven
                                                    : GlobalStyle.tableRowOdd
                                                    } border-b`}
                                            >
                                                <td className={GlobalStyle.tableData}>{formatDate(item.created_dtm)}</td>
                                                <td className={GlobalStyle.tableData}>{item.settlement_status || "N/A"}</td>
                                                <td className={GlobalStyle.tableData}>{formatDate(item.expire_date)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">
                                                No data matching the criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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
                                    {dataInPagePaymentDetails.length > 0 ? (
                                        dataInPagePaymentDetails.map((item, index) => (
                                            <tr
                                                key={index}
                                                className={`${index % 2 === 0
                                                    ? GlobalStyle.tableRowEven
                                                    : GlobalStyle.tableRowOdd
                                                    } border-b`}
                                            >
                                                <td className={GlobalStyle.tableData}>{formatDate(item.created_dtm)}</td>
                                                <td className={GlobalStyle.tableCurrency}>
                                                    {item?.money_transaction_amount &&
                                                        item.money_transaction_amount.toLocaleString("en-LK", {
                                                            style: "currency",
                                                            currency: "LKR",
                                                        })
                                                    }
                                                </td>
                                                <td className={GlobalStyle.tableCurrency}>
                                                    {item?.cummulative_settled_balance &&
                                                        item.cummulative_settled_balance.toLocaleString("en-LK", {
                                                            style: "currency",
                                                            currency: "LKR",
                                                        })
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">
                                                No data matching the criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className={GlobalStyle.navButtonContainer}>
                            <button className={GlobalStyle.navButton} onClick={handlePaymentPageChange("prev")} disabled={currentPaymentPage === 0}>
                                <FaArrowLeft />
                            </button>
                            <span className="text-gray-700">
                                Page {currentPaymentPage + 1} of {pagesPaymentDetails}
                            </span>
                            <button className={GlobalStyle.navButton} onClick={handlePaymentPageChange("next")} disabled={currentPaymentPage === pagesPaymentDetails - 1}>
                                <FaArrowRight />
                            </button>
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
                                    {dataInPageRequestDetails.length > 0 ? (
                                        dataInPageRequestDetails.map((item, index) => (
                                            <tr
                                                key={index}
                                                className={`${index % 2 === 0
                                                    ? GlobalStyle.tableRowEven
                                                    : GlobalStyle.tableRowOdd
                                                    } border-b`}
                                            >
                                                <td className={GlobalStyle.tableData}>{formatDate(item.created_dtm)}</td>
                                                <td className={GlobalStyle.tableData}>{item.ro_request || "N/A"}</td>
                                                <td className={GlobalStyle.tableData}>{item.remark || "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">
                                                No data matching the criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className={GlobalStyle.navButtonContainer}>
                            <button className={GlobalStyle.navButton} onClick={handleRequestPageChange("prev")} disabled={currentRequestPage === 0}>
                                <FaArrowLeft />
                            </button>
                            <span className="text-gray-700">
                                Page {currentRequestPage + 1} of {pagesRequestDetails}
                            </span>
                            <button className={GlobalStyle.navButton} onClick={handleRequestPageChange("next")} disabled={currentRequestPage === pagesRequestDetails - 1}>
                                <FaArrowRight />
                            </button>
                        </div>

                        <div>
                            <button
                                onClick={() => navigate("/drc/assigned-ro-case-log")}
                                className={GlobalStyle.buttonPrimary}
                            >
                                <FaArrowLeft className="mr-2" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}