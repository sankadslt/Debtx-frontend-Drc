
/*Purpose: 
Created Date: 2025-01-09
Created By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Version: React v18
ui number : 0.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Case_List = () => {

    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const rowsPerPage = 7;



    const [status1, setStatus1] = useState("");
    const [status2, setStatus2] = useState("");
    const [status3, setStatus3] = useState("");
    const [status4, setStatus4] = useState("");
    const [status5, setStatus5] = useState("");
    const [status6, setStatus6] = useState("");
    const [status7, setStatus7] = useState("");
    const [status8, setStatus8] = useState("");

    const data = [
        {
            caseID: "001",
            status: "FTL",
            accountNo: "1234567890",
            serviceType: "PEO TV",
            amount: "20000",
            agent: "CMS",
            rtom: "AD",
            createdDate: "2025-01-01",
            lastPaidDate: "2025-01-05",
        },
        {
            caseID: "002",
            status: "Write Off",
            accountNo: "9876543210",
            serviceType: "LTE",
            amount: "-",
            agent: "Prompt",
            rtom: "GM",
            createdDate: "2025-01-02",
            lastPaidDate: "2025-01-06",
        },
        {
            caseID: "003",
            status: "Being Settle",
            accountNo: "1122334455",
            serviceType: "Fiber",
            amount: "30000",
            agent: "ACCIVA",
            rtom: "KU",
            createdDate: "2025-01-03",
            lastPaidDate: "2025-01-07",
        },
        {
            caseID: "004",
            status: "FTL",
            accountNo: "1234567890",
            serviceType: "PEO TV",
            amount: "20000",
            agent: "CMS",
            rtom: "AD",
            createdDate: "2025-01-01",
            lastPaidDate: "2025-01-05",
        },
        {
            caseID: "005",
            status: "Write Off",
            accountNo: "9876543210",
            serviceType: "LTE",
            amount: "-",
            agent: "Prompt",
            rtom: "GM",
            createdDate: "2025-01-02",
            lastPaidDate: "2025-01-06",
        },
        {
            caseID: "006",
            status: "Being Settle",
            accountNo: "1122334455",
            serviceType: "Fiber",
            amount: "30000",
            agent: "ACCIVA",
            rtom: "KU",
            createdDate: "2025-01-03",
            lastPaidDate: "2025-01-07",
        },
        {
            caseID: "007",
            status: "Being Settle",
            accountNo: "1122334455",
            serviceType: "Fiber",
            amount: "30000",
            agent: "ACCIVA",
            rtom: "KU",
            createdDate: "2025-01-03",
            lastPaidDate: "2025-01-07",
        },
        {
            caseID: "008",
            status: "Being Settle",
            accountNo: "1122334455",
            serviceType: "Fiber",
            amount: "30000",
            agent: "ACCIVA",
            rtom: "KU",
            createdDate: "2025-01-03",
            lastPaidDate: "2025-01-07",
        },
        {
            caseID: "009",
            status: "Being Settle",
            accountNo: "1122334455",
            serviceType: "Fiber",
            amount: "30000",
            agent: "ACCIVA",
            rtom: "KU",
            createdDate: "2025-01-03",
            lastPaidDate: "2025-01-07",
        }

    ];


    const filteredData = data.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );


    const pages = Math.ceil(filteredData.length / rowsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < pages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);


    const handleCreateTask = () => {
       
        console.log("Create task button clicked");
    };

    const handleFilter = () => {
   
        console.log("Filter button clicked", {
            status1,
            status2,
            status3,
            status4,
            status5,
            status6,
            status7,
            status8
        });
    };

    return (
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>Case List</h2>

            <div className="w-full mb-8 mt-8">
                {/* Dropdowns Section */}
                <div className="grid grid-cols-4 gap-6 w-full">

                    <select
                        value={status1}
                        onChange={(e) => setStatus1(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Select</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                    </select>


                    <select
                        value={status2}
                        onChange={(e) => setStatus2(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value=""></option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                    </select>


                    <select
                        value={status3}
                        onChange={(e) => setStatus3(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">RTOM</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                    </select>


                    <select
                        value={status4}
                        onChange={(e) => setStatus4(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">DRC</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                    </select>


                    <select
                        value={status5}
                        onChange={(e) => setStatus5(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Arrears Band</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                    </select>


                    <select
                        value={status6}
                        onChange={(e) => setStatus6(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Status</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                    </select>


                    <select
                        value={status7}
                        onChange={(e) => setStatus7(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Service Type</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                    </select>


                    <select
                        value={status8}
                        onChange={(e) => setStatus8(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Date - From: To:</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>


                <div className="flex justify-end mt-6">
                    <button 
                        onClick={handleFilter} 
                        className={GlobalStyle.buttonPrimary}
                    >
                        Filter
                    </button>
                </div>

            </div>



            <div className="flex flex-col">


                <div className="mb-4 flex justify-start">
                    <div className={GlobalStyle.searchBarContainer}>
                        <input
                            type="text"
                            placeholder=""
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={GlobalStyle.inputSearch}
                        />
                        <FaSearch className={GlobalStyle.searchBarIcon} />
                    </div>
                </div>


                <div className={GlobalStyle.tableContainer}>

                    <table className={GlobalStyle.table}>
                        <thead className={GlobalStyle.thead}>
                            <tr>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    ID
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Status
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Account No.
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Service Type
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Amount
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Agent
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    RTOM
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Created Date
                                </th>
                                <th scope="col" className={GlobalStyle.tableHeader}>
                                    Last Paid Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td className={GlobalStyle.tableData}>{log.caseID}</td>
                                    <td className={GlobalStyle.tableData}>{log.status}</td>
                                    <td className={GlobalStyle.tableData}>{log.accountNo}</td>
                                    <td className={GlobalStyle.tableData}>{log.serviceType}</td>
                                    <td className={GlobalStyle.tableData}>{log.amount}</td>
                                    <td className={GlobalStyle.tableData}>{log.agent}</td>
                                    <td className={GlobalStyle.tableData}>{log.rtom}</td>
                                    <td className={GlobalStyle.tableData}>{log.createdDate}</td>
                                    <td className={GlobalStyle.tableData}>{log.lastPaidDate}</td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">
                                        No logs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Navigation Buttons */}
            {filteredData.length > rowsPerPage && (
                <div className={GlobalStyle.navButtonContainer}>
                    <button
                        className={GlobalStyle.navButton}
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                    >
                        <FaArrowLeft />
                    </button>
                    <span>
                        Page {currentPage + 1} of {pages}
                    </span>
                    <button
                        className={GlobalStyle.navButton}
                        onClick={handleNextPage}
                        disabled={currentPage === pages - 1}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            )}

            {/* Create task button */}
            <div className="flex justify-end mt-6">
                <button 
                    onClick={handleCreateTask}
                    className={GlobalStyle.buttonPrimary}
                >
                    Create task and let me know
                </button>
            </div>

        </div>
    );
};

export default Case_List;
