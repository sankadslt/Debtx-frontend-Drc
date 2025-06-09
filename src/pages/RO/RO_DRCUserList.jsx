import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { List_All_RO_and_DRCuser_Details_to_DRC } from "../../services/Ro/RO.js";
import Swal from 'sweetalert2';

//Status Icons

import viewIcon from "../../assets/images/view.png";

export default function RO_DRCUserList() {
    // State for RO Tab
    const [roData, setRoData] = useState([]);
    const [roStatus, setRoStatus] = useState("");
    const [roCurrentPage, setRoCurrentPage] = useState(1);
    const [roMaxPage, setRoMaxPage] = useState(0);
    const [roTotalPages, setRoTotalPages] = useState(1);
    const [roTotalAPIPages, setRoTotalAPIPages] = useState(1);
    const [isRoFilterApplied, setIsRoFilterApplied] = useState(false);


    // State for DRC User Tab
    const [drcData, setDrcData] = useState([]);
    const [drcUserStatus, setDrcUserStatus] = useState("");
    const [drcCurrentPage, setDrcCurrentPage] = useState(1);
    const [drcMaxPage, setDrcMaxPage] = useState(0);
    const [drcTotalPages, setDrcTotalPages] = useState(1);
    const [drcTotalAPIPages, setDrcTotalAPIPages] = useState(1);
    const [isDrcFilterApplied, setIsDrcFilterApplied] = useState(false);





    const [activeTab, setActiveTab] = useState("RO");




    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    // Pagination state


    const rowsPerPage = 10; // Number of rows per page
    const roStartIndex = (roCurrentPage - 1) * rowsPerPage;
    const roEndIndex = roStartIndex + rowsPerPage;
    const roPaginatedData = roData.slice(roStartIndex, roEndIndex);

    const drcStartIndex = (drcCurrentPage - 1) * rowsPerPage;
    const drcEndIndex = drcStartIndex + rowsPerPage;
    const drcPaginatedData = drcData.slice(drcStartIndex, drcEndIndex);


    const currentStatus = activeTab === "RO" ? roStatus : drcUserStatus;

    const navigate = useNavigate();

    const handleStatusChange = (e) => {
        const value = e.target.value;
        if (activeTab === "RO") {
            setRoStatus(value);
        } else if (activeTab === "drcUser") {
            setDrcUserStatus(value);
        }
    };

    // Handle api calling only when the currentPage incriment more that before
    const handlePageChange = () => {
        // console.log("Page changed to:", currentPage);

        if (activeTab === "RO") {
            if (roCurrentPage > roMaxPage && roCurrentPage <= roTotalAPIPages) {
                setRoMaxPage(roCurrentPage);
                handleFilter(); // Call the filter function only after the page incrimet 
            }
        } else {
            if (drcCurrentPage > drcMaxPage && drcCurrentPage <= drcTotalAPIPages) {
                setDrcMaxPage(drcCurrentPage);
                handleFilter(); // Call the filter function only after the page incrimet 
            }
        }
    };

    useEffect(() => {

        if (isRoFilterApplied) {
            handlePageChange(); // Call the function whenever currentPage changes
        }
    }, [roCurrentPage]);

    useEffect(() => {

        if (isDrcFilterApplied) {
            handlePageChange(); // Call the function whenever currentPage changes
        }
    }, [drcCurrentPage]);



    // Search Section
    const roFilteredDataBySearch = roPaginatedData.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const drcFilteredDataBySearch = drcPaginatedData.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );



    const getUserStatus = () => {
        if (activeTab === "RO") {
            return roStatus;
        } else if (activeTab === "drcUser") {
            return drcUserStatus;
        } else {
            return tabState[activeTab]?.status || "";
        }
    };

    const getCurrentPage = () => {
        if (activeTab === "RO") {
            return roCurrentPage;
        } else (activeTab === "DRSUser"); {
            return drcCurrentPage;
        }
    };

    const handleFilter = async () => {
        try {

            const payload = {
                drc_id: 1,
                drcUser_type: activeTab,
                drcUser_status: getUserStatus(),
                pages: getCurrentPage(),

            };

            console.log("Payload sent to API: ", payload);
            setIsLoading(true);

            const response = await List_All_RO_and_DRCuser_Details_to_DRC(payload).catch((error) => {
                if (error.response && error.response.status === 404) {
                    Swal.fire({
                        title: "No Results",
                        text: "No matching data found for the selected filters.",
                        icon: "warning",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                    if (activeTab === "RO") {
                        setRoData([]);

                    } else {
                        setDrcData([]);

                    }

                    return null;
                } else {
                    throw error;
                }
            });
            console.log("Response from API:", response);
            setIsLoading(false); // Set loading state to false

            // Updated response handling
            if (response && response.data) {
                const list = response.data;
                console.log("Valid data received:", list);


                if (activeTab === "RO") {
                    setRoData((prev) => [...prev, ...list]);
                    setRoTotalPages(Math.ceil(response.total_records / rowsPerPage));
                    setRoTotalAPIPages(response.total_records);
                    //setRoMaxPage(currentPage);
                } else {
                    setDrcData((prev) => [...prev, ...list]);
                    setDrcTotalPages(Math.ceil(response.total_records / rowsPerPage));
                    setDrcTotalAPIPages(response.total_records);
                    //setDrcMaxPage(currentPage);
                }


            } else {
                console.error("No valid List of All_RO_and_DRCuser_Details_to_DRC found in response:", response);
                setFilteredData([]);
            }

        } catch (error) {
            console.error("Error filtering cases:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to fetch filtered data. Please try again.",
                icon: "error"
            });
        }

    };

    const handleFilterButton = () => {
        if (activeTab === "RO") {
            setRoData([]);
            setRoMaxPage(0);
            setRoTotalPages(1);
            if (roCurrentPage === 1) {
                handleFilter();
            } else {
                setRoCurrentPage(1);
            }
            setIsRoFilterApplied(true);
        } else {
            setDrcData([]);
            setDrcMaxPage(0);
            setDrcTotalPages(1);
            if (drcCurrentPage === 1) {
                handleFilter();
            } else {
                setDrcCurrentPage(1);
            }
            setIsDrcFilterApplied(true);
        }
    }

    const handleClear = () => {
        if (activeTab === "RO") {
            setRoData([]);
            setRoCurrentPage(1);
            setRoMaxPage(0);
            setRoTotalPages(1);
            setRoTotalAPIPages(1);
            setRoStatus("");
        } else {
            setDrcData([]);
            setDrcCurrentPage(1);
            setDrcMaxPage(0);
            setDrcTotalPages(1);
            setDrcTotalAPIPages(1);
            setDrcUserStatus("");
        }
    };

    const handlePrevNext = (direction) => {
        if (activeTab === "RO") {
            if (direction === "prev" && roCurrentPage > 1) {
                setRoCurrentPage(roCurrentPage - 1);
            } else if (direction === "next" && roCurrentPage < roTotalPages) {
                setRoCurrentPage(roCurrentPage + 1);
            }
        }
        else {
            if (direction === "prev" && drcCurrentPage > 1) {
                setDrcCurrentPage(drcCurrentPage - 1);
            } else if (direction === "next" && drcCurrentPage < drcTotalPages) {
                setDrcCurrentPage(drcCurrentPage + 1);
            }
        }
    };

    // display loading animation when data is loading
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    console.log("this is the ro data :", roData);
    console.log("this is the drcUser data :", drcData);



    return (
        <div className={GlobalStyle.fontPoppins}>

            {activeTab === "RO" && (
                <div>
                    <h2 className={GlobalStyle.headingLarge}>RO List</h2>

                    <div className="flex justify-end mt-6">
                        <button className={GlobalStyle.buttonPrimary} /* onClick={HandleAddDRC} */>
                            Add RO
                        </button>
                    </div>

                </div>
            )}


            {activeTab === "drcUser" && (
                <div>
                    <h2 className={GlobalStyle.headingLarge}>DRC User List</h2>
                    <div className="flex justify-end mt-6">
                        <button className={GlobalStyle.buttonPrimary} /* onClick={HandleAddDRC} */>
                            Add DRC User
                        </button>
                    </div>
                </div>
            )}

            <div className={`${GlobalStyle.cardContainer} w-full mb-8 mt-8`}>
                <div className="flex gap-4 justify-end">

                    {/* Status Select Dropdown */}
                    <select
                        name="status"
                        value={currentStatus}
                        onChange={handleStatusChange}
                        className={`${GlobalStyle.selectBox} w-32 md:w-40`}
                    >
                        <option value="" disabled>Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Terminate">Terminate</option>
                    </select>

                    <button
                        onClick={handleFilterButton}
                        className={`${GlobalStyle.buttonPrimary}`}
                    >
                        Filter
                    </button>
                    <button onClick={handleClear} className={GlobalStyle.buttonRemove} >
                        Clear
                    </button>


                </div>




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

            {/* Tabs */}
            <div className="flex border-b mb-4">
                {["RO", "drcUser"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 ${activeTab === tab
                            ? "border-b-2 border-blue-500 font-bold"
                            : "text-gray-500"
                            }`}
                    >
                        {tab} List
                    </button>
                ))}
            </div>

            {/* Table section rendering */}


            <div>
                {activeTab === "RO" && (
                    <div>
                        <div className={GlobalStyle.tableContainer}>
                            <table className={GlobalStyle.table}>
                                <thead className={GlobalStyle.thead}>
                                    <tr >
                                        <th className={GlobalStyle.tableHeader}>RO ID</th>
                                        <th className={GlobalStyle.tableHeader}>Status</th>
                                        <th className={GlobalStyle.tableHeader}>NIC</th>
                                        <th className={GlobalStyle.tableHeader}>RO Name</th>
                                        <th className={GlobalStyle.tableHeader}>Contact No.</th>
                                        <th className={GlobalStyle.tableHeader}>RTOM Area count</th>
                                        <th className={GlobalStyle.tableHeader}></th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {roFilteredDataBySearch && roFilteredDataBySearch.length > 0 ? (
                                        roFilteredDataBySearch.map((item, index) => (
                                            <tr
                                                key={item.ro_id || index}
                                                className={
                                                    index % 2 === 0
                                                        ? GlobalStyle.tableRowEven
                                                        : GlobalStyle.tableRowOdd
                                                }
                                            >
                                                <td
                                                    className={`${GlobalStyle.tableData} text-black hover:underline cursor-pointer`}
                                                >
                                                    {item.ro_id || "N/A"}
                                                </td>

                                                <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
                                                    {item.drcUser_status || "N/A"}
                                                </td>

                                                <td className={`${GlobalStyle.tableData} `}>
                                                    {item.nic || "N/A"}
                                                </td>
                                                <td className={`${GlobalStyle.tableData} `}>
                                                    {item.ro_name || "N/A"}
                                                </td>
                                                <td className={`${GlobalStyle.tableData} `}>
                                                    {item.login_contact_no || "N/A"}
                                                </td>
                                                <td className={`${GlobalStyle.tableData} `}>
                                                    {item.rtom_area_count || "N/A"}
                                                </td>
                                                <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
                                                    <img
                                                        src={viewIcon}
                                                        alt="view info"
                                                        title="view info"
                                                        className="w-6 h-6 cursor-pointer"
                                                        onClick={() =>
                                                            navigate("/ro/ro-drc-user-info", {
                                                                state: { itemType: activeTab, itemData: item }, // send your data here
                                                            })
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center">No cases available</td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                        {/* Pagination Section */}
                        <div className={GlobalStyle.navButtonContainer}>
                            <button
                                onClick={() => handlePrevNext("prev")}
                                disabled={roCurrentPage === 1}
                                className={`${GlobalStyle.navButton} ${roCurrentPage === 1 ? "cursor-not-allowed" : ""
                                    }`}
                            >
                                <FaArrowLeft />
                            </button>
                            <span>
                                Page {roCurrentPage} of {roTotalPages}
                            </span>
                            <button
                                onClick={() => handlePrevNext("next")}
                                disabled={roCurrentPage === roTotalPages}
                                className={`${GlobalStyle.navButton} ${roCurrentPage === roTotalPages ? "cursor-not-allowed" : ""
                                    }`}
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "drcUser" && (
                    <div>
                        <div>
                            <div className={GlobalStyle.tableContainer}>
                                <table className={GlobalStyle.table}>
                                    <thead className={GlobalStyle.thead}>
                                        <tr >
                                            <th className={GlobalStyle.tableHeader}>DRC ID</th>
                                            <th className={GlobalStyle.tableHeader}>status</th>
                                            <th className={GlobalStyle.tableHeader}>NIC</th>
                                            <th className={GlobalStyle.tableHeader}>DRC User Name</th>
                                            <th className={GlobalStyle.tableHeader}>Contact No.</th>
                                            <th className={GlobalStyle.tableHeader}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {drcFilteredDataBySearch && drcFilteredDataBySearch.length > 0 ? (
                                            drcFilteredDataBySearch.map((item, index) => (
                                                <tr
                                                    key={item.drc_id || index}
                                                    className={
                                                        index % 2 === 0
                                                            ? GlobalStyle.tableRowEven
                                                            : GlobalStyle.tableRowOdd
                                                    }
                                                >
                                                    <td
                                                        className={`${GlobalStyle.tableData} text-black hover:underline cursor-pointer`}
                                                    >
                                                        {item.drcUser_id || "N/A"}
                                                    </td>

                                                    <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
                                                        {item.drcUser_status || "N/A"}
                                                    </td>

                                                    <td className={`${GlobalStyle.tableData} `}>
                                                        {item.nic || "N/A"}
                                                    </td>
                                                    <td className={`${GlobalStyle.tableData} `}>
                                                        {item.ro_name || "N/A"}
                                                    </td>
                                                    <td className={`${GlobalStyle.tableData} `}>
                                                        {item.login_contact_no || "N/A"}
                                                    </td>
                                                    <td className={`${GlobalStyle.tableData} flex justify-center items-center `}>
                                                    <img
                                                        src={viewIcon}
                                                        alt="view info"
                                                        title="view info"
                                                        className="w-6 h-6 cursor-pointer"
                                                        onClick={() =>
                                                            navigate("/ro/ro-drc-user-info", {
                                                                state: { itemType: activeTab, itemData: item }, // send your data here
                                                            })
                                                        }
                                                    />
                                                </td>


                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center">No cases available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Pagination Section */}
                        <div className={GlobalStyle.navButtonContainer}>
                            <button
                                onClick={() => handlePrevNext("prev")}
                                disabled={drcCurrentPage === 1}
                                className={`${GlobalStyle.navButton} ${drcCurrentPage === 1 ? "cursor-not-allowed" : ""
                                    }`}
                            >
                                <FaArrowLeft />
                            </button>
                            <span>
                                Page {drcCurrentPage} of {drcTotalPages}
                            </span>
                            <button
                                onClick={() => handlePrevNext("next")}
                                disabled={drcCurrentPage === drcTotalPages}
                                className={`${GlobalStyle.navButton} ${drcCurrentPage === drcTotalPages ? "cursor-not-allowed" : ""
                                    }`}
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate(-1)}

                className={`${GlobalStyle.buttonPrimary} `}
            >
                <FaArrowLeft />
            </button>

        </div>
    );
}
