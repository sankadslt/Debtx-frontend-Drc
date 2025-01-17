/*Purpose: 
Created Date: 2025-01-09
Created By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Version: React v18
ui number : 1.3
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState } from "react";
import PropTypes from 'prop-types';
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";


const Incident_File_Download = () => {

    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const rowsPerPage = 7;




    const data = [
        {
            TaskID: "Task001",
            GroupID: "0001",
            CreatedDTM: "2025-01-01",
            ExpireDTM: "1 pm",
            CreatedBy: "2025-01-01",
        },
        {
            TaskID: "Task002",
            GroupID: "0002",
            CreatedDTM: "2025-01-01",
            ExpireDTM: "1 pm",
            CreatedBy: "2025-01-01",
        },
        {
            TaskID: "Task003",
            GroupID: "0003",
            CreatedDTM: "2025-01-01",
            ExpireDTM: "1 pm",
            CreatedBy: "2025-01-01",
        },
        {
            TaskID: "Task004",
            GroupID: "0001",
            CreatedDTM: "2025-01-01",
            ExpireDTM: "1 pm",
            CreatedBy: "2025-01-01",
        },
        {
            TaskID: "Task005",
            GroupID: "0002",
            CreatedDTM: "2025-01-01",
            ExpireDTM: "1 pm",
            CreatedBy: "2025-01-01",
        },
        {
            TaskID: "Task006",
            GroupID: "0003",
            CreatedDTM: "2025-01-01",
            ExpireDTM: "1 pm",
            CreatedBy: "2025-01-01",
        },
        {
            TaskID: "Task007",
            GroupID: "0001",
            CreatedDTM: "2025-01-01",
            ExpireDTM: "1 pm",
            CreatedBy: "2025-01-01",
        },
        {
            TaskID: "Task008",
            GroupID: "0002",
            CreatedDTM: "2025-01-01",
            ExpireDTM: "1 pm",
            CreatedBy: "2025-01-01",
        },
        {
            TaskID: "Task009",
            GroupID: "0003",
            CreatedDTM: "2025-01-01",
            ExpireDTM: "1 pm",
            CreatedBy: "2025-01-01",
        },
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


    const handleDownload = (taskId) => {
        try {

            console.log(`Downloading file for task: ${taskId}`);
        } catch (error) {
            console.error('Download failed:', error);

        }
    };

    return (
        <div className={GlobalStyle.fontPoppins}>

            <h2 className={GlobalStyle.headingLarge}>File Download - Incident / Cases</h2>



            {/* Updated Search Bar Section */}
            <div className="mb-8 flex justify-start mt-8">
                <div className={GlobalStyle.searchBarContainer}>
                    <input
                        type="text"
                        placeholder="Search by Task ID, Group ID..."
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
                                Task ID
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Group ID
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Created DTM
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Expire DTM
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Created By
                            </th>
                            <th scope="col" className={GlobalStyle.tableHeader}>
                                Download
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((log, index) => (
                            <tr
                                key={log.TaskID}
                                className={`${index % 2 === 0
                                    ? "bg-white bg-opacity-75"
                                    : "bg-gray-50 bg-opacity-50"
                                    } border-b`}
                            >
                                <td className={GlobalStyle.tableData}>{log.TaskID}</td>
                                <td className={GlobalStyle.tableData}>{log.GroupID}</td>
                                <td className={GlobalStyle.tableData}>{log.CreatedDTM}</td>
                                <td className={GlobalStyle.tableData}>{log.ExpireDTM}</td>
                                <td className={GlobalStyle.tableData}>{log.CreatedBy}</td>
                                <td className={GlobalStyle.tableData}>
                                    <button
                                        onClick={() => handleDownload(log.TaskID)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Download file"
                                    >
                                        <FaDownload />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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


        </div>
    );
};

// Add PropTypes validation
Incident_File_Download.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            TaskID: PropTypes.string.isRequired,
            GroupID: PropTypes.string.isRequired,
            CreatedDTM: PropTypes.string.isRequired,
            ExpireDTM: PropTypes.string.isRequired,
            CreatedBy: PropTypes.string.isRequired,
        })
    ),
};

export default Incident_File_Download;
