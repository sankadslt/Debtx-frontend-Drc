/* Purpose: This template is used for the 1.A.11 - Distribution Preparation (Bulk Upload) page.
Created Date: 2025-01-07
Created By: Geeth (eshaneperera@gmail.com)
Last Modified Date : 2025 - 01 - 07
Modified By: Geeth(eshaneperera@gmail.com)
Version: node 20
ui number : 1.A.11
Dependencies: tailwind css
Related Files: (routes)
Notes:  This page includes Total and Reject count and a table*/

import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

const DistributionPreparationBulkUpload = () => {
  const navigate = useNavigate();
  const services = [
    { type: "PEO TV", count: 4500 },
    { type: "LTE", count: 4500 },
    { type: "Fiber", count: 4500 },
    { type: "Copper", count: 4500 },
    { type: "Service A", count: 4500 },
    { type: "Service B", count: 4500 },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const recordsPerPage = 4;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  //Search Filter logic
  const filteredData = services.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const currentServices = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  //Navigation
  const handleIconClick = (service) => {
    navigate("/pages/Distribute/AssignDRC", {
      state: { serviceType: service.type, count: service.count },
    });
  };

  //main
  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex flex-col flex-1">
        <main className="p-6">
          <div>
            <h1 className={GlobalStyle.headingLarge}>Open Pending Cases</h1>
          </div>

                  {/* Mini Case Count Bar */}
              <div className="flex items-center justify-center mt-10 mb-5">
                  {/* Summary Cards Container */}
             <div className={GlobalStyle.miniCountBarSubTopicContainer}>
                  {/* Total Count */}
             <div className={GlobalStyle.miniCountBarMainBox}>
                    <span>Total:</span>
                    <p className={GlobalStyle.miniCountBarMainTopic}>1259</p>
             </div>
                 {/* Rejects Count */}
            <div className={GlobalStyle.miniCountBarMainBox}>
                   <span>No Of Rejects:</span>
                  <p className={GlobalStyle.miniCountBarMainTopic}>0</p>
                </div>
               </div>
              </div>

          {/* Search Bar */}
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

          {/* Table Section */}
          <div className={GlobalStyle.tableContainer}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Service Type
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    No of Count
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}></th>
                </tr>
              </thead>
              <tbody>
                {currentServices.map((service, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? GlobalStyle.tableRowEven
                        : GlobalStyle.tableRowOdd
                    }
                  >
                    <td
                      className={`${GlobalStyle.tableData} ${GlobalStyle.paragraph}`}
                    >
                      {service.type}
                    </td>
                    <td
                      className={`${GlobalStyle.tableData} ${GlobalStyle.paragraph}`}
                    >
                      {service.count}
                    </td>
                    <td className={GlobalStyle.tableData}>
                      <button
                        onClick={() => handleIconClick(service)}
                        className={`${GlobalStyle.bold} text-2xl text-blue-500`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20} // Using global style for size
                          height={15} // Using global style for size
                          fill="none"
                        >
                          <path
                            fill="#001120"
                            d="M3.57 24a2.99 2.99 0 0 1-2.167-.88C.802 22.531.5 21.825.5 21V3c0-.825.3-1.531.903-2.118A2.998 2.998 0 0 1 3.57 0h9.21l3.069 3h12.279c.844 0 1.567.294 2.169.882.601.588.902 1.294.9 2.118H3.57v15L7.253 9H33.5l-3.952 12.863a2.933 2.933 0 0 1-1.131 1.556 3.082 3.082 0 0 1-1.824.581H3.57Z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {currentServices.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-4 text-center">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={GlobalStyle.navButtonContainer}>
           <button
               onClick={() => handlePrevNext("prev")}
               disabled={currentPage === 1}
               className={`${GlobalStyle.navButton} ${
               currentPage === 1 ? "cursor-not-allowed" : ""
            }`}
             >
          <FaArrowLeft />
          </button>
          <span className={`${GlobalStyle.pageIndicator} mx-4`}>
            Page {currentPage} of {totalPages}
          </span>
          <button
           onClick={() => handlePrevNext("next")}
           disabled={currentPage === totalPages}
           className={`${GlobalStyle.navButton} ${
           currentPage === totalPages ? "cursor-not-allowed" : ""
           }`}
           >
        <FaArrowRight />
         </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DistributionPreparationBulkUpload;