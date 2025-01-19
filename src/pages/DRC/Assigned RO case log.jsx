/* Purpose: This template is used for the 2.3 - Assigned RO case log .
Created Date: 2024-01-08
Created By: Chamath (chamathjayasanka20@gmail.com)
Last Modified Date:2025-01-08
Version: node 20
ui number : 2.3
Dependencies: tailwind css
Related Files: (routes)
Notes:  The following page conatins the code for the Assigned RO case log Screen */

import { useState,useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import DatePicker from "react-datepicker";
import { useParams } from "react-router-dom"; // Import useParams

import { getRTOMsByDRCID } from "../../services/rtom/RtomService"; 

export default function AssignedROcaselog() {
    //dummy data for table
    const data = [
        {
            assignedDate: "05/16/2024",
            status: "open",
            caseId: "C001",
            amount: "50,000",
            rtomArea: "colombo",
            action: "Arrears Collect",
            assignedRO: "Nimal Perera",
            endDate: "05/20/2024",
        },
        {
            assignedDate: "05/17/2024",
            status: "closed",
            caseId: "C002",
            amount: "75,000",
            rtomArea: "kegalle",
            action: "Payment Follow-Up",
            assignedRO: "Saman Kumara",
            endDate: "05/25/2024",
        },
        {
            assignedDate: "05/18/2024",
            status: "open",
            caseId: "C003",
            amount: "30,000",
            rtomArea: "kegalle",
            action: "Address Verification",
            assignedRO: "Kamal Fernando",
            endDate: "05/23/2024",
        },
        {
            assignedDate: "05/19/2024",
            status: "pending",
            caseId: "C004",
            amount: "45,000",
            rtomArea: "colombo",
            action: "Legal Notice",
            assignedRO: "Sunil De Silva",
            endDate: "05/26/2024",
        },
        {
            assignedDate: "05/20/2024",
            status: "closed",
            caseId: "C005",
            amount: "60,000",
            rtomArea: "colombo",
            action: "Dispute Resolution",
            assignedRO: "Ruwan Ekanayake",
            endDate: "05/27/2024",
        },
        {
            assignedDate: "05/21/2024",
            status: "open",
            caseId: "C006",
            amount: "40,000",
            rtomArea: "kegalle",
            action: "Payment Follow-Up",
            assignedRO: "Saman Priyadarshana",
            endDate: "05/29/2024",
        },
        {
            assignedDate: "05/22/2024",
            status: "closed",
            caseId: "C007",
            amount: "25,000",
            rtomArea: "colombo",
            action: "Address Verification",
            assignedRO: "Anura Kumara",
            endDate: "05/30/2024",
        },
        {
            assignedDate: "05/23/2024",
            status: "open",
            caseId: "C008",
            amount: "55,000",
            rtomArea: "kegalle",
            action: "Arrears Collect",
            assignedRO: "Kasun Wijesinghe",
            endDate: "06/01/2024",
        },
        {
            assignedDate: "05/24/2024",
            status: "pending",
            caseId: "C009",
            amount: "35,000",
            rtomArea: "colombo",
            action: "Legal Notice",
            assignedRO: "Mahesh Senanayake",
            endDate: "06/02/2024",
        },
        {
            assignedDate: "05/25/2024",
            status: "closed",
            caseId: "C010",
            amount: "70,000",
            rtomArea: "colombo",
            action: "Dispute Resolution",
            assignedRO: "Nirosha Abeysinghe",
            endDate: "06/03/2024",
        },
    ];
    const [rtoms, setRtoms] = useState([]);
    const [selectedRTOM, setSelectedRTOM] = useState("");

    // State for search query and filtered data
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [filteredData, setFilteredData] = useState(data);
    const [filterType, setFilterType] = useState(""); // This will hold the filter type (Account No or Case ID)
    const [filterValue, setFilterValue] = useState(""); // This holds the filter value based on selected filter type

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
    
    const [filterCaseId, setFilterCaseId] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);



    // Use useParams hook to get the drc_id from the URL
    const { drc_id } = useParams();

    useEffect(() => {

        console.log("Route parameter drc_id :", drc_id );
        const fetchData = async () => {
            try {
                if (drc_id) {
                    const payload = parseInt(drc_id, 10); // Convert drc_id to number

                    // Fetch RTOMs by DRC ID
                    const rtomsList = await getRTOMsByDRCID(payload);
                    setRtoms(rtomsList); // Set RTOMs to state

                    const response = await listHandlingCasesByDRC(payload);

                    if (response && Array.isArray(response.data)) {
                        setData(response.data);
                        setFilteredData(response.data);
                    } else {
                        setError("No data found.");
                    }
                } else {
                    setError("DRC ID not found in URL.(try http://localhost:5173/pages/Distribute/DistributeTORO/200 )");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        
        fetchData();
       
    }, [drc_id]); // Including drc_id to the Dependency array









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
                const itemDate = new Date(item.date); // Assuming date field exists
                return itemDate >= fromDate;
            });
        }

        if (toDate) {
            tempData = tempData.filter((item) => {
                const itemDate = new Date(item.date); // Assuming date field exists
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
                const itemDate = new Date(item.date); // Assuming date field exists
                return itemDate <= toDate;
            });
        }

        setFilteredData(tempData);
        setCurrentPage(1); // Reset pagination when filter changes
    };

    // Search Section
    const filteredDataBySearch = currentData.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Title */}

            <h1 className={GlobalStyle.headingLarge}>Assigned RO case log</h1>

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
                    className={`${GlobalStyle.selectBox} h-[43px]`}
                >
                    <option value="" disabled >Arrears band</option>
                    <option value="5-10">5,000 - 10,000</option>
                    <option value="10-25">10,000 - 25,000</option>
                    <option value="25-50">25,000 - 50,000</option>
                    <option value="50-100">50,000 - 100,000</option>
                    <option value="100+"> Above 100,000</option>
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
                    onClick={filterData}
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

                        </tr>
                    </thead>
                    <tbody>
                        {filteredDataBySearch.map((item, index) => (
                            <tr
                                key={index}
                                className={`${index % 2 === 0
                                    ? "bg-white bg-opacity-75"
                                    : "bg-gray-50 bg-opacity-50"
                                    } border-b`}
                            >


                                <td className={GlobalStyle.tableData}>
                                    <a href={`#${item.caseId}`} className="hover:underline">
                                        {item.caseId}
                                    </a>
                                </td>
                                <td className={GlobalStyle.tableData}>{item.status}</td>
                                <td className={GlobalStyle.tableData}>{item.amount}</td>
                                <td className={GlobalStyle.tableData}>{item.rtomArea}</td>
                                <td className={GlobalStyle.tableData}>{item.action}</td>
                                <td className={GlobalStyle.tableData}>{item.assignedRO}</td>
                                <td className={GlobalStyle.tableData}>{item.assignedDate}</td>
                                <td className={GlobalStyle.tableData}>{item.endDate}</td>

                            </tr>
                        ))}
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