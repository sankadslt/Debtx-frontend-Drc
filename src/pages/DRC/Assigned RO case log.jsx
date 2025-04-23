/* Purpose: This template is used for the 2.3 - Assigned RO case log .
Created Date: 2024-01-08
Created By: Chamath (chamathjayasanka20@gmail.com)
Last Modified Date:2025-02-18
Modified by: Nimesh Perera(nimeshmathew999@gmail.com)
Version: node 20
ui number : 2.3
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for the Assigned RO case log Screen */

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch, FaEdit } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import DatePicker from "react-datepicker";
import { fetchAllArrearsBands, listHandlingCasesByDRC } from "../../services/case/CaseService";
import { getActiveRTOMsByDRCID } from "../../services/rtom/RtomService";
import { useNavigate } from "react-router-dom";
import { getLoggedUserId } from "../../services/auth/authService.js";
import Swal from 'sweetalert2';


//Status Icons
import Open_No_Agent from "../../assets/images/status/Open_No_Agent.png";
import Open_With_Agent from "../../assets/images/status/Open_With_Agent.png";
import Negotiation_Settle_Pending from "../../assets/images/status/Negotiation_Settle_Pending.png";
import Negotiation_Settle_Open_Pending from "../../assets/images/status/Negotiation_Settle_Open_Pending.png";
import Negotiation_Settle_Active from "../../assets/images/status/Negotiation_Settle_Active.png";
import FMB from "../../assets/images/status/Forward_to_Mediation_Board.png";
import FMB_Settle_Pending from "../../assets/images/status/MB_Settle_pending.png";
import FMB_Settle_Open_Pending from "../../assets/images/status/MB_Settle_open_pending.png";
import FMB_Settle_Active from "../../assets/images/status/MB_Settle_Active.png";


export default function AssignedROcaselog() {

    const navigate = useNavigate(); // Initialize the navigate function

    const [rtoms, setRtoms] = useState([]);
    const [selectedRTOM, setSelectedRTOM] = useState("");
    const [filteredlogData, setFilteredlogData] = useState([]); // State for filtered data
    // State for search query and filtered data
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [filterType, setFilterType] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [filterAccountNo, setFilterAccountNo] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    // const indexOfLastRecord = currentPage * recordsPerPage;
    // const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    // const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    // Filter state for Amount, Case ID, Status, and Date
    const [arrearsAmounts, setArrearsAmounts] = useState([]);
    const [selectedArrearsBand, setSelectedArrearsBand] = useState("");
    const [filterCaseId, setFilterCaseId] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [userData, setUserData] = useState(null);

    // const loadUser = async () => {
    //     let token = localStorage.getItem("accessToken");
    //     if (!token) {
    //       setUserData(null);
    //       return;
    //     }

    //     try {
    //       let decoded = jwtDecode(token);
    //       const currentTime = Date.now() / 1000;
    //       if (decoded.exp < currentTime) {
    //         token = await refreshAccessToken();
    //         if (!token) return;
    //         decoded = jwtDecode(token);
    //       }

    //       setUserData({
    //         id: decoded.user_id,
    //         role: decoded.role,
    //         drc_id: decoded.drc_id,
    //         ro_id: decoded.ro_id,
    //       });
    //     } catch (error) {
    //       console.error("Invalid token:", error);
    //     }
    //   };

    //   useEffect(() => {
    //     loadUser();
    //   }, [localStorage.getItem("accessToken")]);

    const loadUser = async () => {
        const user = await getLoggedUserId();
        setUserData(user);
        console.log("User data:", user);
    };

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {

        console.log("fromDatea:", fromDate);
        console.log("toDate:", toDate);
        const fetchRTOMs = async () => {
            try {
                if (userData?.drc_id) {
                    // Make sure to convert to number if needed
                    const arrearsAmounts = await fetchAllArrearsBands();
                    setArrearsAmounts(arrearsAmounts);
                    // Fetch RTOMs by DRC ID
                    const rtomsList = await getActiveRTOMsByDRCID(userData?.drc_id);
                    console.log("RTOM list retrieved:", rtomsList);
                    setRtoms(rtomsList);
                }
            } catch (error) {
                console.error("Error fetching RTOMs:", error);
            }
        };

        fetchRTOMs();
    }, [userData?.drc_id]); // Only depend on userData

    const handleonvisiable = (case_id) => {
        navigate("/drc/ro-monitoring-arrears", { state: { CaseID: case_id } });
        console.log("Case ID being passed: ", case_id);
    }

    const handleonreassign = (case_id) => {
        navigate("/pages/DRC/Re-AssignRo", { state: { CaseID: case_id } });
        console.log("Case ID being passed: ", case_id);
    }



    const handlestartdatechange = (date) => {
        if (date === null) {
            setFromDate(null);
            return;
        }

        if (toDate) {

            if (date > toDate) {

                Swal.fire({
                    title: "Warning",
                    text: "The 'From' date cannot be later than the 'To' date.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return;
            } else {
                checkdatediffrence(date, toDate);
                setFromDate(date);
            }

        } else {

            setFromDate(date);

        }


    };
    const handleenddatechange = (date) => {
        if (date === null) {
            setToDate(null);
            return;
        }

        if (fromDate) {
            if (date < fromDate) {
                Swal.fire({
                    title: "Warning",
                    text: "The 'To' date cannot be before the 'From' date.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return;
            } else {
                checkdatediffrence(fromDate, date);
                setToDate(date);
            }
        } else {
            setToDate(date);
        }
    };


    const checkdatediffrence = (startDate, endDate) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const diffInMs = end - start;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        const diffInMonths = diffInDays / 30;

        if (diffInMonths > 1) {
            Swal.fire({
                title: "Date Range Exceeded",
                text: "The selected dates have more than a 1-month gap.",
                icon: "warning",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    setToDate(null);
                    console.log("Dates cleared");
                }
            }
            );
        };
    };



    const handleFilter = async () => {
        try {
            setFilteredData([]); // Clear previous results

            // Format the date to 'YYYY-MM-DD' format
            const formatDate = (date) => {
                if (!date) return null;
                const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                return offsetDate.toISOString().split('T')[0];
            };

            if (!selectedArrearsBand && !selectedRTOM && !fromDate && !toDate) {
                Swal.fire({
                    title: "Warning",
                    text: "No filter data is selected. Please, select data.",
                    icon: "warning",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                setToDate(null);
                setFromDate(null);
                return;
            };

            if ((fromDate && !toDate) || (!fromDate && toDate)) {
                Swal.fire({
                    title: "Warning",
                    text: "Both From Date and To Date must be selected.",
                    icon: "warning",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                setToDate(null);
                setFromDate(null);
                return;
            }

            if (new Date(fromDate) > new Date(toDate)) {
                Swal.fire({
                    title: "Warning",
                    text: "To date should be greater than or equal to From date",
                    icon: "warning",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                setToDate(null);
                setFromDate(null);
                return;
            };

            const payload = {
                drc_id: Number(userData?.drc_id), // Convert drc_id to number
                rtom: selectedRTOM,
                arrears_band: selectedArrearsBand,
                from_date: formatDate(fromDate),
                to_date: formatDate(toDate),
            };
            console.log('Sending filter payload:', payload); // Log the payload before sending for debugging
            // Fetch filtered data from the API using the payload
            const AssignedRoCaseLogs = await listHandlingCasesByDRC(payload);


            if (Array.isArray(AssignedRoCaseLogs)) {
                setFilteredlogData(AssignedRoCaseLogs.data);
            } else {
                console.error("No valid cases data found in response.");
            }


            // Log the response
            console.log('Response from API:', AssignedRoCaseLogs); //for debugging

            // Set the filtered data (assuming setFilteredData updates the state or UI)
            setFilteredlogData(AssignedRoCaseLogs);


            console.log("Filtered data updated:", filteredlogData); //for debugging

            const endDate = AssignedROcaselog.expire_dtm;
            const currentDate = new Date();
            const isPastDate = endDate < currentDate;
        } catch (error) {
            console.error("Error filtering cases:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to fetch filtered data. Please try again.",
                icon: "error"
            });
        }
    };

    // Handle pagination
    const handlePrevNext = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Filtering the data based on filter values
    const filterData = () => {
        let tempData = data;
        if (filterType && filterValue) {
            if (filterType === "Account No") {
                tempData = tempData.filter((item) =>
                    item.accountNo.includes(filterValue)
                );
            } else if (filterType === "Case ID") {
                tempData = tempData.filter((item) => item.caseId.includes(filterValue));
            }
        }

        if (fromDate) {
            tempData = tempData.filter((item) => {
                const itemDate = new Date(item.date);
                return itemDate >= toDate;
            });
        }

        if (toDate) {
            tempData = tempData.filter((item) => {
                const itemDate = new Date(item.date);
                return itemDate <= toDate;
            });
        }
        // Apply filters
        if (filterAccountNo) {
            tempData = tempData.filter((item) =>
                item.accountNo.includes(filterAccountNo)
            );
        }
        if (filterCaseId) {
            tempData = tempData.filter((item) => item.caseId.includes(filterCaseId));
        }
        if (filterStatus) {
            tempData = tempData.filter((item) => item.status.includes(filterStatus));
        }
        if (selectedArrearsBand) {
            tempData = tempData.filter((item) => {
                const amount = parseInt(item.amount.replace(/,/g, "")); // Remove commas and parse as integer
                if (selectedArrearsBand === "5-10") {
                    return amount >= 5000 && amount <= 10000;
                } else if (selectedArrearsBand === "10-25") {
                    return amount >= 10000 && amount <= 25000;
                } else if (selectedArrearsBand === "25-50") {
                    return amount >= 25000 && amount <= 50000;
                } else if (selectedArrearsBand === "50-100") {
                    return amount >= 50000 && amount <= 100000;
                } else if (selectedArrearsBand === "100+") {
                    return amount > 100000;
                }
                return true; // Return true if no filter is applied
            });
        }
        setFilteredData(tempData);
        setCurrentPage(1); // Reset pagination when filter changes
    };

    // Search Section
    const filteredDataBySearch = filteredlogData.filter((row) =>
        Object.values(row)
            .join(" ") // Join all values in a row to form a single string
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) // Match with the search query
    );

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case "open no agent":
                return <img src={Open_No_Agent} alt="Open No Agent" title="Open No Agent" className="w-5 h-5" />;
            case "open with agent":
                return <img src={Open_With_Agent} alt="Open With Agent" title="Open With Agent" className="w-5 h-5" />;
            case "negotiation settle pending":
                return <img src={Negotiation_Settle_Pending} alt="Negotiation Settle Pending" title="Negotiation Settle Pending" className="w-5 h-5" />;
            case "negotiation settle open pending":
                return <img src={Negotiation_Settle_Open_Pending} alt="Negotiation Settle Open Pending" title="Negotiation Settle Open Pending" className="w-5 h-5" />;
            case "negotiation settle active":
                return <img src={Negotiation_Settle_Active} alt="Negotiation Settle Active" title="Negotiation Settle Active" className="w-5 h-5" />;
            case "fmb":
                return <img src={FMB} alt="FMB" title="FMB" className="w-5 h-5" />;
            case "fmb settle pending":
                return <img src={FMB_Settle_Pending} alt="FMB Settle Pending" title="FMB Settle Pending" className="w-5 h-5" />;
            case "fmb settle open pending":
                return <img src={FMB_Settle_Open_Pending} alt="FMB Settle Open Pending" title="FMB Settle Open Pending" className="w-5 h-5" />;
            case "fmb settle active":
                return <img src={FMB_Settle_Active} alt="FMB Settle Active" title="FMB Settle Active" className="w-5 h-5" />;
            default:
                return <span className="text-gray-500">N/A</span>;
        }
    };

    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Title */}
            <h1 className={GlobalStyle.headingLarge}>Assigned RO case List</h1>

            <div className="flex items-center justify-end gap-4 mt-20 mb-4">

                {/* RTOM Select Dropdown */}
                <select
                    className={GlobalStyle.selectBox}
                    value={selectedRTOM}
                    onChange={(e) => setSelectedRTOM(e.target.value)}
                >
                    <option value="">RTOM</option>
                    {rtoms.length > 0 ? (
                        rtoms.map((rtom) => (
                            <option key={rtom.rtom_id} value={rtom.area_name}>
                                {rtom.area_name} {/* Ensure this is the correct name for the RTOM area */}
                            </option>
                        ))
                    ) : (
                        <option disabled>No RTOMs found</option>
                    )}
                </select>
                <select
                    className={GlobalStyle.selectBox}
                    value={selectedArrearsBand}
                    onChange={(e) => setSelectedArrearsBand(e.target.value)}
                >
                    <option value="" >
                        Arrears band
                    </option>
                    {Array.isArray(arrearsAmounts) && arrearsAmounts.length > 0 ? (
                        arrearsAmounts.map(({ key, value }) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))
                    ) : (
                        <option disabled>No arrears bands available</option>
                    )}

                </select>

                <div className={GlobalStyle.datePickerContainer}>
                    <label className={GlobalStyle.dataPickerDate}>Date</label>
                    <DatePicker
                        selected={fromDate}
                        onChange={handlestartdatechange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/MM/yyyy"
                        className={GlobalStyle.inputText}
                    />
                    <DatePicker
                        selected={toDate}
                        onChange={handleenddatechange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/MM/yyyy"
                        className={GlobalStyle.inputText}
                    />
                </div>

                <button
                    onClick={handleFilter}
                    className={`${GlobalStyle.buttonPrimary}`}
                >
                    Filter
                </button>

            </div>

            {/* Search Section */}
            <div className="flex justify-start mt-10 mb-4">
                <div className={GlobalStyle.searchBarContainer}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={GlobalStyle.inputSearch}
                    />
                    <FaSearch className={GlobalStyle.searchBarIcon} />
                </div>
            </div>

            {/* Table Section */}
            <div className={GlobalStyle.tableContainer}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr >
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Case ID
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Status
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Amount
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                RTOM Area
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Action
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Assigned RO
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Assigned Date
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                End Date
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDataBySearch.length > 0 ? (
                            filteredDataBySearch.map((item, index) => {
                                // Convert expire_dtm to a JavaScript Date object
                                const expireDate = new Date(item.expire_dtm);
                                const today = new Date();

                                // Check if the expire date is in the past
                                const isPastDate = expireDate < today;

                                return (
                                    <tr
                                        key={index}
                                        className={`${index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"
                                            } border-b`}
                                    >
                                        <td className={GlobalStyle.tableData}>
                                            <a href={`#${item.case_id}`} className="hover:underline">
                                                {item.case_id}
                                            </a>
                                        </td>
                                        <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
                                            {getStatusIcon(item.status || "N/A")}
                                        </td>
                                        <td className={GlobalStyle.tableData}>{item.current_arrears_amount || "N/A"}</td>
                                        <td className={GlobalStyle.tableData}>{item.area || "N/A"}</td>
                                        <td className={GlobalStyle.tableData}>{item.remark || "N/A"}</td>
                                        <td className={GlobalStyle.tableData}>{item.ro_name || "N/A"}</td>
                                        <td className={GlobalStyle.tableData}>{item.assigned_date
                                            ? new Date(item.assigned_date).toLocaleDateString("en-GB")
                                            : "N/A"}</td>
                                        <td className={GlobalStyle.tableData}> {item.expire_dtm
                                            ? new Date(item.expire_dtm).toLocaleDateString("en-GB")
                                            : "N/A"} </td>
                                        <td className={GlobalStyle.tableData}>
                                            <div className="px-8 flex items-center gap-2">
                                                <AiFillEye
                                                    onClick={() => handleonvisiable(item.case_id)}
                                                    style={{ cursor: "pointer", marginRight: "8px" }}
                                                />

                                                {/* Show Edit button only if the expire date is in the future */}
                                                <FaEdit
                                                    onClick={() => {
                                                        if (!isPastDate) console.log("Edit clicked");
                                                    }}
                                                    style={{
                                                        cursor: isPastDate ? "not-allowed" : "pointer",
                                                        color: isPastDate ? "#d3d3d3" : "#000",
                                                        opacity: isPastDate ? 0.6 : 1,
                                                    }}
                                                />

                                                <button
                                                    className={`${GlobalStyle.buttonPrimary} mx-auto`}
                                                    style={{ whiteSpace: "nowrap" }}
                                                    onClick={() => handleonreassign(item.case_id)}
                                                >
                                                    Re-Assign
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" className={GlobalStyle.tableData}>
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Section */}
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

            <button
                onClick={() => navigate(-1)}
                className={`${GlobalStyle.navButton} `}
            >
                <FaArrowLeft />Go Back
            </button>
        </div>
    );
}