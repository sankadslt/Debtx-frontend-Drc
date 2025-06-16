import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gmailIcon from "../../assets/images/google.png";
import editIcon from "../../assets/images/edit-info.svg";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";

export default function RecoveryOfficerEndPage() {
    const navigate = useNavigate();

    // Static mock data
    const [userData] = useState({
        drc_name: "John Doe",
        added_date: "2024-05-01",
        recovery_officer_name: "Jane Smith",
        nic: "123456789V",
        contact_no: "0712345678",
        email: "janesmith@example.com",
        rtom_areas: [
            { name: "Colombo", status: true },
            { name: "Gampaha", status: false }
        ],
        log_history: [
            { edited_on: "2024-06-01", action: "Created", edited_by: "Admin" },
            { edited_on: "2024-06-10", action: "Updated Contact No", edited_by: "Editor" }
        ]
    });

    const [endDate, setEndDate] = useState('');
    const [remark, setRemark] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Page Title */}
            <h2 className={GlobalStyle.headingLarge}>End Recovery Officer</h2>
            <h2 className="text-xl font-medium mb-6 pl-10">DRC Name: {userData.drc_name}</h2>

            {/* Details Card */}
            <div className="flex gap-4 justify-center">
                <div className="bg-white rounded-xl shadow-lg p-6 relative w-full max-w-3xl">
                    {/* Edit Icon */}
                    <img
                        src={editIcon}
                        alt="Edit"
                        title="Edit"
                        className="w-6 h-6 absolute top-4 right-4 cursor-pointer hover:scale-110 transition-transform"
                    />

                    {/* User Info */}
                    <div className="grid grid-cols-3 gap-y-4 mb-4">
                        <div className="font-semibold">Added Date</div>
                        <div>:</div>
                        <div>{userData.added_date}</div>

                        <div className="font-semibold">Recovery Officer Name</div>
                        <div>:</div>
                        <div>{userData.recovery_officer_name}</div>

                        <div className="font-semibold">NIC</div>
                        <div>:</div>
                        <div>{userData.nic}</div>

                        <div className="font-bold col-span-3 mt-2">Login Method</div>

                        <div className="font-semibold pl-8">Contact No</div>
                        <div>:</div>
                        <div>{userData.contact_no}</div>

                        <div className="font-semibold pl-8 flex items-center">
                            <img src={gmailIcon} alt="Email" className="w-5 h-5 inline-block mr-2" />
                        </div>
                        <div>:</div>
                        <div>{userData.email}</div>
                    </div>

                    {/* RTOM Areas */}
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">RTOM Areas</h3>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 border">RTOM Area</th>
                                    <th className="p-2 border">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.rtom_areas.map((area, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                        <td className="p-2 text-center border">{area.name}</td>
                                        <td className="p-2 text-center border">
                                            <div className={`inline-block w-11 h-6 rounded-full transition-colors ${area.status ? "bg-green-500" : "bg-gray-400"} relative`}>
                                                <div className={`w-5 h-5 rounded-full bg-white absolute top-[2px] transition-all ${area.status ? "left-[26px]" : "left-[2px]"}`} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* End Date and Remark */}
            <div className="flex flex-col items-start mt-8 max-w-3xl mx-auto">
                <div className="flex items-center mb-4">
                    <label className="font-semibold mr-4">End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={`${GlobalStyle.inputText} w-40 h-10`} // Adjusted to match image width (~150px) and height (~40px)
                    />
                </div>

                <label className="font-semibold mb-2">Remark:</label>
                <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className={`${GlobalStyle.inputText} w-96 h-24`} // Adjusted to match image width (~400px) and height (~100px)
                />

                <div className="flex justify-end mt-6 w-full">
                    <button className={GlobalStyle.buttonPrimary} /* onClick={HandleAddDRC} */>
                        Save
                    </button>
                </div>
            </div>

            <div className="flex justify-start mt-6 mb-6">
                <button className={GlobalStyle.buttonPrimary} onClick={() => setShowPopup(true)}>
                    Log History
                </button>
            </div>

            {/* Log History Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-4xl relative">
                        <h2 className="text-xl  font-semibold mb-4">Log History</h2>

                        <button
                            className="absolute top-4 right-4 text-xl font-bold cursor-pointer"
                            onClick={() => setShowPopup(false)}
                        >
                            ×
                        </button>

                        {/* Search Bar */}
                        <div className="flex justify-start mb-4">
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
                                    <tr>
                                        <th scope="col" className={GlobalStyle.tableHeader}>Edited On</th>
                                        <th scope="col" className={GlobalStyle.tableHeader}>Action</th>
                                        <th scope="col" className={GlobalStyle.tableHeader}>Edited By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData?.log_history && userData.log_history.length > 0 ? (
                                        userData.log_history
                                            .filter(
                                                (log) =>
                                                    log.edited_on?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    log.edited_by?.toLowerCase().includes(searchQuery.toLowerCase())
                                            )
                                            .map((log, index) => (
                                                <tr
                                                    key={index}
                                                    className={index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"}
                                                >
                                                    <td className={GlobalStyle.tableData}>{log.edited_on}</td>
                                                    <td className={GlobalStyle.tableData}>{log.action}</td>
                                                    <td className={GlobalStyle.tableData}>{log.edited_by}</td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                                                No log history available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <button onClick={() => navigate(-1)} className={GlobalStyle.buttonPrimary}>
                    <FaArrowLeft className="mr-2" />
                </button>
            </div>
        </div>
    );
}