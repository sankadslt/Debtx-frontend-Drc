/* Purpose: This template is used for the 2.6 - RO's Assigned case log .
Created Date: 2024-01-08
Created By: Chamath (chamathjayasanka20@gmail.com)
Last Modified Date:2025-01-08
Version: node 20
ui number : 2.6
Dependencies: tailwind css
Related Files: (routes)
Notes:  The following page conatins the code for the RO's Assigned case log Screen */


import React, { useState } from 'react';
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';



export default function ROsAssignedcaselog() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);  // For managing the current page
  const rowsPerPage = 8;  // Number of rows per page

  

  //dummy data for table
  const data = [
    {
      date: "05/16/2024",
      status: "open",
      caseId: "C001",
      name: "Silva Perera",
      contactNo: "0112345678",
      rtom: "RTOM 01",
      action: "Arrears Collect",
    },
    {
      date: "05/17/2024",
      status: "closed",
      caseId: "C002",
      name: "Kamal Fernando",
      contactNo: "0112233445",
      rtom: "RTOM 02",
      action: "Payment Follow-Up",
    },
    {
      date: "05/18/2024",
      status: "open",
      caseId: "C003",
      name: "Nimal Jayasuriya",
      contactNo: "0113344556",
      rtom: "RTOM 03",
      action: "Address Verification",
    },
    {
      date: "05/19/2024",
      status: "pending",
      caseId: "C004",
      name: "Sunil De Silva",
      contactNo: "0114455667",
      rtom: "RTOM 04",
      action: "Legal Notice",
    },
    {
      date: "05/20/2024",
      status: "closed",
      caseId: "C005",
      name: "Ruwan Ekanayake",
      contactNo: "0115566778",
      rtom: "RTOM 01",
      action: "Dispute Resolution",
    },
    {
      date: "05/21/2024",
      status: "open",
      caseId: "C006",
      name: "Saman Priyadarshana",
      contactNo: "0116677889",
      rtom: "RTOM 02",
      action: "Payment Follow-Up",
    },
    {
      date: "05/22/2024",
      status: "closed",
      caseId: "C007",
      name: "Anura Kumara",
      contactNo: "0117788990",
      rtom: "RTOM 03",
      action: "Address Verification",
    },
    {
      date: "05/23/2024",
      status: "open",
      caseId: "C008",
      name: "Kasun Wijesinghe",
      contactNo: "0118899001",
      rtom: "RTOM 04",
      action: "Arrears Collect",
    },
    {
      date: "05/24/2024",
      status: "pending",
      caseId: "C009",
      name: "Mahesh Senanayake",
      contactNo: "0119900112",
      rtom: "RTOM 01",
      action: "Legal Notice",
    },
    {
      date: "05/25/2024",
      status: "closed",
      caseId: "C010",
      name: "Nirosha Abeysinghe",
      contactNo: "0111011123",
      rtom: "RTOM 02",
      action: "Dispute Resolution",
    },
    {
      date: "05/26/2024",
      status: "open",
      caseId: "C011",
      name: "Kavindu Pathirana",
      contactNo: "0111122334",
      rtom: "RTOM 03",
      action: "Payment Follow-Up",
    },
    {
      date: "05/27/2024",
      status: "pending",
      caseId: "C012",
      name: "Dilshan Perera",
      contactNo: "0112233445",
      rtom: "RTOM 04",
      action: "Address Verification",
    },
    {
      date: "05/28/2024",
      status: "closed",
      caseId: "C013",
      name: "Chamika Bandara",
      contactNo: "0113344556",
      rtom: "RTOM 01",
      action: "Arrears Collect",
    },
    {
      date: "05/29/2024",
      status: "open",
      caseId: "C014",
      name: "Harsha Silva",
      contactNo: "0114455667",
      rtom: "RTOM 02",
      action: "Payment Follow-Up",
    },
    {
      date: "05/30/2024",
      status: "closed",
      caseId: "C015",
      name: "Lasith Malinga",
      contactNo: "0115566778",
      rtom: "RTOM 03",
      action: "Dispute Resolution",
    },
  ];

  const handleEdit = () => {
    alert("Edit button clicked");
  };
  const handleNegotiation = () => {
    alert("Negotiation button clicked");
  };

  const pages = Math.ceil(data.length / rowsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pages - 1) setCurrentPage(currentPage + 1);
  };

  const startIndex = currentPage * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Case List</h1>

      <div className="flex flex-col items-end justify-end gap-4 mt-8"></div>
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr >
              <th scope="col" className={GlobalStyle.tableHeader}>
                Date
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Status
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Case ID
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Name
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Contact No
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                RTOM
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Action
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>

              </th>
            </tr>
          </thead>

          <tbody>
            
          {paginatedData.map((item, index) => (
              <tr
              key={index}
              className={`${
                index % 2 === 0
                  ? "bg-white bg-opacity-75"
                  : "bg-gray-50 bg-opacity-50"
              } border-b`}
            >
                <td className={GlobalStyle.tableData}>{item.date}</td>
                <td className={GlobalStyle.tableData}>{item.status}</td>
                <td className={GlobalStyle.tableData}>
                  <a href={`#${item.caseId}`} className="hover:underline">
                    {item.caseId}
                  </a>
                </td>
                <td className={GlobalStyle.tableData}>{item.name}</td>
                <td className={GlobalStyle.tableData}>{item.contactNo}</td>
                <td className={GlobalStyle.tableData}>{item.rtom}</td>
                <td className={GlobalStyle.tableData}>{item.action}</td>
                <td className={GlobalStyle.tableData}>
                  <button className={`${GlobalStyle.button} ${GlobalStyle.buttonPrimary}`} style={{ marginRight: '10px' }} onClick={handleEdit}>
                    Edit
                  </button>
                  <button className={`${GlobalStyle.button} ${GlobalStyle.buttonPrimary}`} onClick={handleNegotiation}>
                    Negotiation
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className={GlobalStyle.navButtonContainer}>
        <button 
          onClick={handlePrevPage} 
          className={GlobalStyle.navButton}
          disabled={currentPage === 0}>
          <FaArrowLeft /> 
        </button>

        <span>
            Page {currentPage + 1} of {pages}
          </span>
        <button 
          onClick={handleNextPage} 
          className={GlobalStyle.navButton}
          disabled={currentPage === pages - 1}>
           <FaArrowRight />
        </button>
      </div>

    </div>
  );
}
