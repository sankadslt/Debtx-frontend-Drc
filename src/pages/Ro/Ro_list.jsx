
// export default ROList;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import activeIcon from "../../assets/images/RO_Active.svg";
import deactiveIcon from "../../assets/images/RO_Inactive.svg";
import roterminate from "../../assets/images/RO_Terminate.svg";
import moreIcon from "../../assets/images/more.svg";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { listROAllCases } from "../../services/Ro/Ro_services";
import { getLoggedUserId } from "../../services/auth/authService.js";

const ROList = () => {
  // State Variables
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [roData, setRoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [userData, setUserData] = useState(null);
  const [initialRoData, setInitialRoData] = useState([]);
  
  // Pagination state variables integrated from Monitor_settlement
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  
  const rowsPerPage = 10;

  // Calculate pagination indices - this will work correctly with accumulated data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = roData.slice(startIndex, endIndex);

  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    console.log("User data:", user);
  };

  useEffect(() => {
    loadUser();
  }, []);
  
  // Fetch data from API using the service - Modified to match Monitor_settlement pattern
  const fetchRoData = async () => {
    if (!userData?.drc_id) {
      console.log("No drc_id available, skipping fetch");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching RO data with params:", { status, page: currentPage, drc_id: userData.drc_id });
      
      const response = await listROAllCases(status, currentPage, userData.drc_id);
      console.log("API Response:", response);
      
     if (response && response.status === "success") {
      // Process the data
      const formattedData = response.data.roDetails.map(ro => ({
        ro_id: ro.ro_id,
        ro_status: ro.status,
        nic: ro.ro_nic,
        ro_name: ro.ro_name,
        ro_contact_no: ro.ro_contact_no,
        rtoms_for_ro: ro.rtom_counts || { active: 0, total: 0 },
        drc_id: ro.drc_id,
        createdAt: ro.created_at
      }));
        
        // Set data based on page - replace for first page, append for subsequent pages
         if (currentPage === 1) {
        setRoData(formattedData); // Replace data for first page
        // Store initial data only when loading first page without filters
        if (!status && currentPage === 1) {
          setInitialRoData(formattedData);
        }
      } else {
        setRoData((prevData) => [...prevData, ...formattedData]); // Append for subsequent pages
      }
        
        // Handle pagination logic similar to Monitor_settlement
        if (formattedData.length === 0) {
          setIsMoreDataAvailable(false);
          if (currentPage === 1) {
            // Show no data message if first page has no results
            console.log("No data found");
          }
        } else {
          const maxData = currentPage === 1 ? 10 : 30;
          if (formattedData.length < maxData) {
            setIsMoreDataAvailable(false);
          }
        }
        
      } else {
        setError(response?.message || "Failed to fetch data");
        setRoData([]);
      }
    } catch (err) {
      console.error("Error fetching RO data:", err);
      setError(err.message || "Error fetching data");
      setRoData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle pagination - integrated from Monitor_settlement
  useEffect(() => {
    if (isFilterApplied && isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage);
      fetchRoData();
    }
  }, [currentPage, userData?.drc_id, isFilterApplied]);

  // Initial data load when userData becomes available
  useEffect(() => {
    if (userData?.drc_id && !isFilterApplied) {
      handleFilterButton();
    }
  }, [userData?.drc_id]);
  
  // Handle pagination navigation - integrated from Monitor_settlement
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      if (isMoreDataAvailable) {
        setCurrentPage(currentPage + 1);
      } else {
        const totalPages = Math.ceil(roData.length / rowsPerPage);
        setTotalPages(totalPages);
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      }
    }
  };
  
  // Filter data based on search query
  const filteredDataBySearch = paginatedData.filter((row) => {
    return Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });
  
  // Filter button handler - integrated from Monitor_settlement
  const handleFilterButton = () => {
    setRoData([]); // Clear previous results
    setIsMoreDataAvailable(true); // Reset more data available state
    setMaxCurrentPage(0); // Reset max current page
    if (currentPage === 1) {
      fetchRoData();
    } else {
      setCurrentPage(1);
    }
    setIsFilterApplied(true); // Set filter applied state to true
  };
  

// Clear filters and restore initial data - Fixed version
const handleClear = () => {
  setStatus("");
  setSearchQuery("");
  setCurrentPage(1);
  
  // Restore the initial data that was loaded when component first mounted
  setRoData(initialRoData);
  
  // Reset pagination states to initial values
  setIsFilterApplied(false);
  setTotalPages(0);
  setIsMoreDataAvailable(true);
  setMaxCurrentPage(0);
};
  
  const handleStatusChange = (e) => {
    setStatus(e.target.value || "");
  };
  
  // Tooltip handlers
  const showTooltip = (id) => {
    setTooltipVisible(id);
  };
  
  const hideTooltip = () => {
    setTooltipVisible(null);
  };

  const naviPreview = (roId) => {
    // Navigate to RO info or preview
    console.log("Navigate to RO:", roId);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={GlobalStyle.headingLarge}>RO List</h1>
         <Link to="/pages/RO/Add_ro">
          <button className={GlobalStyle.buttonPrimary}>
            Add RO
          </button>
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={GlobalStyle.inputSearch}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
        
        <div className={`flex justify-end w-[25vw] ${GlobalStyle.cardContainer}`}>
          <div className="flex gap-6 items-center">
            <div>
              <select
                value={status}
                onChange={handleStatusChange}
                className={GlobalStyle.selectBox}
                style={{ color: status === "" ? "gray" : "black" }}
              >
                <option value="" hidden>Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Terminate">Terminate</option>
              </select>
            </div>
            
            <button
              onClick={handleFilterButton}
              className={GlobalStyle.buttonPrimary}
            >
              Filter
            </button>
            <button
              onClick={handleClear}
              className={GlobalStyle.buttonRemove}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th scope="col" className={GlobalStyle.tableHeader}>RO ID</th>
              <th scope="col" className={GlobalStyle.tableHeader}>Status</th>
              <th scope="col" className={GlobalStyle.tableHeader}>NIC</th>
              <th scope="col" className={GlobalStyle.tableHeader}>RO Name</th>
              <th scope="col" className={GlobalStyle.tableHeader}>Contact No.</th>
              <th scope="col" className={GlobalStyle.tableHeader}>RTOM Area count</th>
              <th scope="col" className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.length > 0 ? (
              filteredDataBySearch.map((ro, index) => (
                <tr 
                  key={ro.ro_id} 
                  className={`${
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }`}
                >
                  <td className={GlobalStyle.tableData}>{ro.ro_id}</td>
                  <td className={GlobalStyle.tableData}>
                    <div className="relative flex items-center justify-center">
                      {ro.ro_status === "Active" ? (
                        <div className="relative">
                          <img 
                            src={activeIcon} 
                            alt="Active" 
                            className="h-6 w-6"
                            onMouseEnter={() => showTooltip(`status-${ro.ro_id}`)}
                            onMouseLeave={hideTooltip}
                          />
                          {tooltipVisible === `status-${ro.ro_id}` && (
                            <div className="absolute left-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transform -translate-x-1/2">
                              Active Status
                            </div>
                          )}
                        </div>
                      ) : ro.ro_status === "Inactive" ? (
                        <div className="relative">
                          <img 
                            src={deactiveIcon} 
                            alt="Inactive" 
                            className="h-6 w-6"
                            onMouseEnter={() => showTooltip(`status-${ro.ro_id}`)}
                            onMouseLeave={hideTooltip}
                          />
                          {tooltipVisible === `status-${ro.ro_id}` && (
                            <div className="absolute left-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transform -translate-x-1/2">
                              Inactive Status
                            </div>
                          )}
                        </div>
                      ) : ro.ro_status === "Terminate" ? (
                        <div className="relative">
                          <img 
                            src={roterminate} 
                            alt="Terminate" 
                            className="h-6 w-6"
                            onMouseEnter={() => showTooltip(`status-${ro.ro_id}`)}
                            onMouseLeave={hideTooltip}
                          />
                          {tooltipVisible === `status-${ro.ro_id}` && (
                            <div className="absolute left-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transform -translate-x-1/2">
                              Terminate Status
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative"></div>
                      )}
                    </div>
                  </td>
                  <td className={GlobalStyle.tableData}>{ro.nic}</td>
                  <td className={GlobalStyle.tableData}>{ro.ro_name}</td>
                  <td className={GlobalStyle.tableData}>{ro.ro_contact_no}</td>
                  <td className={GlobalStyle.tableData}>{ro.rtoms_for_ro?.total || 0}</td>
                  <td className={GlobalStyle.tableData}>
                    <div className="flex justify-center">
                     <Link to="/pages/RO/Ro's_info" state={{ roId: ro.ro_id }}>
                       <img src={moreIcon} alt="More Info" className="h-6 w-6" />
                     </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination - integrated from Monitor_settlement */}
      <div className={GlobalStyle.navButtonContainer}>
        <button
          onClick={() => handlePrevNext("prev")}
          disabled={currentPage <= 1}
          className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
        >
          <FaArrowLeft />
        </button>
        <span className={`${GlobalStyle.pageIndicator} mx-4`}>
          Page {currentPage}
        </span>
        <button
          onClick={() => handlePrevNext("next")}
          disabled={currentPage === totalPages}
          className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ROList;
