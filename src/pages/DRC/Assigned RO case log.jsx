/* Purpose: This template is used for the 2.3 - Assigned RO case log .
Created Date: 2024-01-08
Created By: Chamath (chamathjayasanka20@gmail.com)
Last Modified Date:2025-01-08
Version: node 20
ui number : 2.3
Dependencies: tailwind css
Related Files: (routes)
Notes:  The following page conatins the code for the Assigned RO case log Screen */

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch, FaEdit } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import DatePicker from "react-datepicker";
import { useParams } from "react-router-dom";



import { fetchAllArrearsBands } from "../../services/case/CaseService";

import { getRTOMsByDRCID } from "../../services/rtom/RtomService";
import { useNavigate } from "react-router-dom";
import { listHandlingCasesByDRC } from "../../services/case/CaseService";

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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    // Filter state for Amount, Case ID, Status, and Date
    const [filterRTOM, setFilterRTOM] = useState(""); // RTOM
    const [filterAmount, setFilterAmount] = useState("");
    const [arrearsBands, setArrearsBands] = useState([]);

    const [filterCaseId, setFilterCaseId] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);



    // Use useParams hook to get the drc_id from the URL
    const { drc_id } = useParams();


    useEffect(() => {
        const getArrearsBands = async () => {
            try {
                const bands = await fetchAllArrearsBands();
                console.log("Arrears bands:", bands);
                setArrearsBands(bands);
            } catch (error) {
                console.error("Error fetching arrears bands:", error);
            }
        };

        getArrearsBands();
    }, []);



    useEffect(() => {

        console.log("Route parameter drc_id :", drc_id);
        const fetchData = async () => {
            try {
                if (drc_id) {
                    const payload = parseInt(drc_id, 10); // Convert drc_id to number

                    // Fetch RTOMs by DRC ID
                    const rtomsList = await getRTOMsByDRCID(payload);
                    setRtoms(rtomsList); // Set RTOMs to state

                }

            } catch (error) {
                console.error("Error fetching RTOMs:", error);
            }
        };

        fetchData();

    }, [drc_id]); // Including drc_id to the Dependency array










    // Handle filter function
    const handleFilter = async () => {
        try {
            setFilteredData([]); // Clear previous results

            // Format the date to 'YYYY-MM-DD' format
            const formatDate = (date) => {
                if (!date) return null;
                const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                return offsetDate.toISOString().split('T')[0];
            };

            const payload = {
                drc_id: Number(drc_id), // Convert drc_id to number
                rtom: selectedRTOM,
                arrears_band: filterAmount,
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



        } catch (error) {
            console.error("Error filtering cases:", error);
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
        if (filterAmount) {
            tempData = tempData.filter((item) => {
                const amount = parseInt(item.amount.replace(/,/g, "")); // Remove commas and parse as integer
                if (filterAmount === "5-10") {
                    return amount >= 5000 && amount <= 10000;
                } else if (filterAmount === "10-25") {
                    return amount >= 10000 && amount <= 25000;
                } else if (filterAmount === "25-50") {
                    return amount >= 25000 && amount <= 50000;
                } else if (filterAmount === "50-100") {
                    return amount >= 50000 && amount <= 100000;
                } else if (filterAmount === "100+") {
                    return amount > 100000;
                }
                return true; // Return true if no filter is applied
            });
        }
        if (fromDate) {
            tempData = tempData.filter((item) => {
                const itemDate = new Date(item.date); // Assuming date field exists
                return itemDate >= fromDate;
            });
        }
        if (toDate) {
            tempData = tempData.filter((item) => {
                const itemDate = new Date(item.date);
                return itemDate <= toDate;
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
                    value={filterAmount}
                    onChange={(e) => setFilterAmount(e.target.value)}
                    className={`${GlobalStyle.selectBox} h-[43px] border rounded px-2`}
                >
                    <option value="" disabled>
                        Arrears band
                    </option>
                    {arrearsBands.map(({ key, value }) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>



                <div className={GlobalStyle.datePickerContainer}>
                    <label className={GlobalStyle.dataPickerDate}>Date</label>
                    <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/MM/yyyy"
                        className={GlobalStyle.inputText}
                    />
                    <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
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
                            filteredDataBySearch.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td className={GlobalStyle.tableData}>
                                        <a href={`#${item.case_id}`} className="hover:underline">
                                            {item.case_id}
                                        </a>
                                    </td>
                                    <td className={GlobalStyle.tableData}>{item.status}</td>
                                    <td className={GlobalStyle.tableData}>{item.current_arreas_amount}</td>
                                    <td className={GlobalStyle.tableData}>{item.area}</td>
                                    <td className={GlobalStyle.tableData}>{item.remark}</td>
                                    <td className={GlobalStyle.tableData}>{item.ro_name}</td>
                                    <td className={GlobalStyle.tableData}>{new Date(item.created_dtm).toLocaleDateString()}</td>
                                    <td className={GlobalStyle.tableData}>{new Date(item.expire_dtm).toLocaleDateString()}</td>
                                    <td className={GlobalStyle.tableData}>
                                        <div className="px-8" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <AiFillEye
                                                onClick={() => console.log("View clicked")}
                                                style={{ cursor: "pointer", marginRight: "8px" }}
                                            />
                                            <FaEdit
                                                onClick={() => console.log("Edit clicked")}
                                                style={{ cursor: "pointer", marginRight: "8px" }}
                                            />
                                            <button
                                                className={`${GlobalStyle.buttonPrimary} mx-auto`}
                                                style={{ whiteSpace: "nowrap" }}
                                                onClick={() => navigate(`/pages/DRC/Re-AssignRo/${drc_id}/${item.case_id}`)}
                                            >
                                                Re-Assign
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className={GlobalStyle.tableData}>No data available</td>
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
        </div>
    );
}