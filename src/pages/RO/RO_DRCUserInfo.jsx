import React, { useState, useEffect } from 'react';
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { List_RO_Info_Own_By_RO_Id } from "../../services/Ro/RO.js";
import Swal from 'sweetalert2';
import gmailIcon from "../../assets/images/google.png";
import editIcon from "../../assets/images/edit-info.svg";
import tickIcon from "../../assets/images/Tick.jpeg";
import crossIcon from "../../assets/images/Cross.png";

export default function RO_DRCUserInfo() {
  const location = useLocation();
  const { itemType, itemData = {} } = location.state || {};
  const [activeUserType, setActiveUserType] = useState("");
  const [activeUserRole, setActiveUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  // Check if the user is terminated
  const isTerminated = itemData?.drcUser_status === "Terminate" || itemData?.status === "Terminate";

  useEffect(() => {
    if (itemType) {
      setActiveUserType(itemType);
      // if you already have the role on itemData, initialize it here
      if (itemType === "drcUser" && itemData?.user_role) {
        setActiveUserRole(itemData.user_role);
      }
    }
  }, [itemType]);

  const fetchData = async () => {
    if (!itemData || !activeUserType) {
      Swal.fire({
        title: "Error",
        text: "Missing user data or type. Please try again.",
        icon: "error",
      });
      return;
    }

    try {
      let payload = {};
      if (activeUserType === "RO") {
        if (!itemData.ro_id) throw new Error("Missing ro_id");
        payload = { ro_id: itemData.ro_id };
        } else if (activeUserType === "drcUser") {
          if (!itemData.drcUser_id) throw new Error("Missing drcUser_id");
          payload = { drcUser_id: itemData.drcUser_id };
      }

      setIsLoading(true);
      const response = await List_RO_Info_Own_By_RO_Id(payload);

      setIsLoading(false);

      if (response && response.data) {
        const data = response.data;
        setUserData(data);
        
        // Set the user role from the API response
        if (data.user_role) {
          setActiveUserRole(data.user_role);
        }
      } else {
        Swal.fire({
          title: "No Results",
          text: "No matching data found.",
          icon: "warning",
        });
        setUserData(null);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch data. Please try again.",
        icon: 'error',
      });
      setUserData(null);
    }
  };

  useEffect(() => {
    if (activeUserType && itemData) {
      fetchData();
    }
  }, [activeUserType, itemData]);

  useEffect(() => {
    return () => {
      setActiveUserType('');
      setUserData(null);
      setIsLoading(false);
    };
  }, []);

  const handleEnd = () => {
    if (isTerminated) {
      return; // Prevent action for terminated users
    }
    if (!userData || !activeUserType) {
      Swal.fire({
        title: 'Error!',
        text: 'No user data available to proceed.',
        icon: 'error',
      });
    } else {
      const userDataToPass = {
        ...userData,
        ...(activeUserType === 'RO' ? { ro_id: itemData.ro_id } : { drcUser_id: itemData.drcUser_id }),
      };

      navigate('/ro/ro-drc-user-info-end', { state: { userData: userDataToPass, activeUserType } });
    }
  };

  const handleEdit = () => {
    if (isTerminated) {
      return; // Prevent action for terminated users
    }
    if (!userData || !activeUserType || !itemData) {
      Swal.fire({
        title: 'Error',
        text: 'No user data or type available to edit.',
        icon: 'error',
      });
      return;
    }

    const dataToPass = {
      itemType: activeUserType,
      itemData: {
        ro_id: activeUserType === 'RO' ? itemData.ro_id : undefined,
        drcUser_id: activeUserType === 'drcUser' ? itemData.drcUser_id : undefined,
      },
    };

    console.log('handleEdit - Edit - Sending data:', dataToPass);

    navigate('/ro/ro-drc-user-info-edit', { state: { dataToPass } });
  };

  // Function to get user role display text
  const getUserRoleDisplayText = (role) => {
    const roleMapping = {
      'DRC Coordinator': 'DRC Coordinator',
      'call center': 'Call Center',
      'user staff': 'User Staff'
    };
    return roleMapping[role] || role || 'N/A';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No user data available.
      </div>
    );
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h2 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl mt-8`}>
        {activeUserType === "drcUser" ? "DRC User" : "Recovery Officer"}
      </h2>
      <h2 className={`${GlobalStyle.headingMedium} pl-4 sm:pl-6 md:pl-10 text-lg sm:text-xl`}>
        DRC Name : {userData?.drc_name || 'N/A'}
      </h2>

      <div className="flex flex-col lg:flex-row gap-4 mt-4 justify-center px-4">
        <div className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl`}>
          <img
            src={editIcon}
            alt="Edit"
            title="Edit"
            className={`w-5 h-5 sm:w-6 sm:h-6 absolute top-2 right-2 ${isTerminated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110 transition-transform'}`}
            onClick={handleEdit}
          />

          <div className="overflow-x-auto">
            <div className="table w-full min-w-[300px]">
              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">Added Date</div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">{userData?.added_date || 'N/A'}</div>
              </div>

              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">User Type</div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">{
                activeUserType === "RO" ? "Recovery Officer" : activeUserType === "drcUser" ? "DRC User" : "N/A"
                }</div>
              </div>

              {activeUserType === "drcUser" && (
                <div className="table-row">
                  <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">
                    User Role
                  </div>
                  <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">
                    :
                  </div>
                  <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">
                    {getUserRoleDisplayText(activeUserRole)}
                  </div>
                </div>
              )}

              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">
                  {activeUserType === "drcUser" ? "DRC User Name" : "Recovery Officer Name"}
                </div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">
                  {userData?.drcUser_name || userData?.recovery_officer_name || 'N/A'}
                </div>
              </div>

              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">NIC</div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">{userData?.nic || 'N/A'}</div>
              </div>

              <div className="table-row">
                <div className="table-cell px-2 sm:px-4 py-2 font-bold text-sm sm:text-base">Login Method</div>
              </div>

              <div className="table-row">
                <div className="table-cell px-4 sm:px-8 py-2 font-semibold text-sm sm:text-base">Contact No 1</div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">{userData?.contact_no || 'N/A'}</div>
              </div>

              <div className="table-row">
                <div className="table-cell px-4 sm:px-8 py-2 font-semibold text-sm sm:text-base">Contact No 2</div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base">{userData?.contact_no_two || 'N/A'}</div>
              </div>

              <div className="table-row">
                <div className="table-cell px-4 sm:px-8 py-2 font-semibold text-sm sm:text-base">Email</div>
                <div className="table-cell px-1 sm:px-4 py-2 font-semibold text-sm sm:text-base">:</div>
                <div className="table-cell px-2 sm:px-4 py-2 text-sm sm:text-base break-all">{userData?.email || 'N/A'}</div>
              </div>
            </div>
          </div>

          {activeUserType === "RO" && userData?.rtom_areas && (
            <>
              <div className="table w-full mt-4">
                <div className="table-row">
                  <div className="table-cell px-2 sm:px-4 py-2 font-semibold text-sm sm:text-base">Billing Center Areas :</div>
                  <div className="table-cell px-2 sm:px-4 py-2" />
                </div>
              </div>

              <div className={`${GlobalStyle.tableContainer} overflow-x-auto mt-4`}>
                <table className={`${GlobalStyle.table} table-auto w-full`} style={{ fontSize: '0.875rem' }}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th className={`${GlobalStyle.tableHeader} min-w-[120px]`}>Billing Center Area</th>
                      <th className={`${GlobalStyle.tableHeader} min-w-[100px]`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.rtom_areas.length > 0 ? (
                      userData.rtom_areas.map((area, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"
                          } border-b`}
                        >
                          <td className={`${GlobalStyle.tableData} text-center`}>
                            {area.name}
                          </td>
                          <td className={`${GlobalStyle.tableData} text-center`}>
                            <img
                              src={area.status ? tickIcon : crossIcon}
                              alt={area.status ? "Active" : "Inactive"}
                              className="w-6 h-6 mx-auto"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="text-center py-4 text-sm">
                          No RTOM areas available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 mb-6 px-4">
        <button 
          className={GlobalStyle.buttonPrimary} 
          onClick={() => setShowPopup(true)}
        >
          Log History
        </button>

        <button 
          className={`${GlobalStyle.buttonPrimary} ${isTerminated ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={handleEnd}
          disabled={isTerminated}
        >
          End
        </button>
      </div>

      {showPopup && (
        <div className={`${GlobalStyle.popupBoxContainer} fixed inset-0 z-50`}>
          <div className={`${GlobalStyle.popupBoxBody} max-w-full max-h-full overflow-auto`}>
            <div className={`${GlobalStyle.popupBox} mx-4 my-4 sm:mx-8 sm:my-8`}>
              <h2 className={`${GlobalStyle.popupBoxTitle} text-lg sm:text-xl`}>Log History</h2>
              <button 
                className={`${GlobalStyle.popupBoxCloseButton} text-xl sm:text-2xl`} 
                onClick={() => setShowPopup(false)}
              >
                ×
              </button>
            </div>

            <div className="flex justify-start mb-4 px-4">
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

            <div className={`${GlobalStyle.tableContainer} max-h-[300px] sm:max-h-[400px] overflow-y-auto overflow-x-auto mx-4`}>
              <table className={`${GlobalStyle.table} table-auto w-full`} style={{ fontSize: '0.875rem' }}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th className={`${GlobalStyle.tableHeader} min-w-[120px]`}>Edited On</th>
                    <th className={`${GlobalStyle.tableHeader} min-w-[100px]`}>Action</th>
                    <th className={`${GlobalStyle.tableHeader} min-w-[120px]`}>Edited By</th>
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
                          className={`${
                            index % 2 === 0 ? "bg-white bg-opacity-75" : "bg-gray-50 bg-opacity-50"
                          } border-b`}
                        >
                          <td className={`${GlobalStyle.tableData} text-center`}>
                            {log.edited_on || 'N/A'}
                          </td>
                          <td className={GlobalStyle.tableData}>{log.action || 'N/A'}</td>
                          <td className={GlobalStyle.tableData}>{log.edited_by || 'N/A'}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-sm">
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

      <div className="px-4">
        <button onClick={() => navigate(-1)} className={GlobalStyle.buttonPrimary}>
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
}