import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import Swal from 'sweetalert2';
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import gmailIcon from "../../assets/images/google.png";
import { List_RO_Info_Own_By_RO_Id, updateROorDRCUserDetails } from "../../services/Ro/RO.js";
import { getAllActiveRTOMs } from "../../services/rtom/RtomService.js";

export default function RO_DRCUserDetailsEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemType, itemData } = location.state?.dataToPass || {};

  // State for fetched data
  const [fetchedData, setFetchedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Editable fields
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [remark, setRemark] = useState('');
  const [drcUserStatus, setDrcUserStatus] = useState('Inactive'); // Default to 'Inactive'
  const [rtomAreas, setRtomAreas] = useState([]);
  const [selectedRtomArea, setSelectedRtomArea] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rtomAreaOptions, setRtomAreaOptions] = useState([]);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!itemType || !itemData || (!itemData.ro_id && !itemData.drcUser_id)) {
        Swal.fire({
          title: 'Error',
          text: 'Missing user type or ID. Please try again.',
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        navigate(-1);
        return;
      }

      try {
        const payload = itemData.ro_id ? { ro_id: itemData.ro_id } : { drcUser_id: itemData.drcUser_id };
        setIsLoading(true);
        const response = await List_RO_Info_Own_By_RO_Id(payload);
        setIsLoading(false);

        console.log('API Response:', {
          itemType,
          ro_id: itemData.ro_id,
          drcUser_id: itemData.drcUser_id,
          drcUser_status: response.data?.drcUser_status,
          data: response.data,
        });

        if (response && response.data) {
          setFetchedData(response.data);
          setContactNo(response.data.contact_no || '');
          setEmail(response.data.email || '');
          setRemark(response.data.remark || '');
          // Normalize drcUser_status (boolean or string)
          let normalizedStatus;
          if (typeof response.data.drcUser_status === 'boolean') {
            normalizedStatus = response.data.drcUser_status ? 'Active' : 'Inactive';
          } else {
            const apiStatus = response.data.drcUser_status?.toLowerCase();
            normalizedStatus =
              apiStatus === 'active' ? 'Active' :
              apiStatus === 'inactive' ? 'Inactive' :
              apiStatus && ['active', 'inactive'].includes(apiStatus) ?
                apiStatus.charAt(0).toUpperCase() + apiStatus.slice(1).toLowerCase() :
                'Inactive'; // Default to 'Inactive' for safety
          }

          if (response.data.drcUser_status == null) {
            console.warn('drcUser_status missing in API response, defaulting to Inactive:', payload);
          } else if (typeof response.data.drcUser_status !== 'boolean' && !['active', 'inactive'].includes(response.data.drcUser_status?.toLowerCase())) {
            console.warn('Invalid drcUser_status value, defaulting to Inactive:', {
              drcUser_status: response.data.drcUser_status,
              payload,
            });
          }

          console.log('Normalized Status:', normalizedStatus);
          setDrcUserStatus(normalizedStatus);

          if (itemType === 'RO') {
            setRtomAreas(
              (response.data.rtom_areas || []).map(area => ({
                ...area,
                isNew: false,
              }))
            );
          }
        } else {
          Swal.fire({
            title: 'No Results',
            text: 'No matching data found.',
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          navigate(-1);
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching user data:', error);
        Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to fetch data. Please try again.',
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        navigate(-1);
      }
    };

    fetchUserData();
  }, [itemType, itemData, navigate]);

  // Fetch all active RTOMs
  useEffect(() => {
    const fetchRTOMs = async () => {
      try {
        const fetchedRTOMs = await getAllActiveRTOMs();
        setRtomAreaOptions(fetchedRTOMs);
      } catch (error) {
        console.error('Error fetching RTOMs:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch RTOM areas. Please try again later.',
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    };

    fetchRTOMs();
  }, []);

  const validateInputs = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({
        title: 'Invalid Input',
        text: 'Please enter a valid email address.',
        icon: 'error',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return false;
    }
    if (!contactNo || !/^\+?\d{9,12}$/.test(contactNo)) {
      Swal.fire({
        title: 'Invalid Input',
        text: 'Please enter a valid contact number (e.g., +94771234567).',
        icon: 'error',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return false;
    }
    if (!remark.trim()) {
    Swal.fire({
      title: 'Missing Remark',
      text: 'Please enter a remark before saving.',
      icon: 'warning',
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    return false;
  }
    if (itemType === 'RO' && rtomAreas.length > 0) {
      const invalidRtom = rtomAreas.find(area => !rtomAreaOptions.some(opt => opt.area_name === area.name));
      if (invalidRtom) {
        Swal.fire({
          title: 'Invalid RTOM',
          text: `RTOM area "${invalidRtom.name}" is not valid.`,
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    try {
      if (!validateInputs()) return;

      const roId = itemData?.ro_id;
      const drcUserId = itemData?.drcUser_id;
      const drcId = fetchedData?.drc_id || 1;

      if (itemType === 'RO' && !roId) {
        throw new Error('Missing ro_id for Recovery Officer.');
      }
      if (itemType === 'drcUser' && !drcUserId) {
        throw new Error('Missing drcUser_id for DRC User.');
      }

      const basePayload = {
        ...(itemType === 'RO' ? { ro_id: roId } : { drcUser_id: drcUserId }),
        drc_id: drcId,
        ro_name: fetchedData?.drcUser_name || fetchedData?.recovery_officer_name || 'N/A',
        login_email: email,
        login_contact_no: contactNo,
        drcUser_status: drcUserStatus,
        create_by: fetchedData?.create_by || 'admin_user',
        remark: remark || 'Updated user details',
      };

      const payload = itemType === 'RO' ? {
        ...basePayload,
        rtoms: rtomAreas.map(area => {
          const rtomOption = rtomAreaOptions.find(opt => opt.area_name === area.name);
          if (!rtomOption) {
            throw new Error(`Invalid RTOM area: ${area.name}`);
          }
          return {
            rtom_id: rtomOption.rtom_id,
            rtom_status: area.status ? 'Active' : 'Inactive',
            rtom_name: area.name,
            billing_center_code: area.billing_center_code || rtomOption.billing_center_code || 'N/A',
            handling_type: area.handling_type || 'Primary',
          };
        }),
      } : basePayload;

      console.log('Sending payload:', payload);

      const response = await updateROorDRCUserDetails(payload);

      if (response.success) {
        Swal.fire({
          title: 'Success',
          text: 'User details updated successfully!',
          icon: 'success',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        navigate(-1); 
      } else {
        throw new Error(response.message || 'Failed to update user details.');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Internal server error. Please try again later.',
        icon: 'error',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  };

  const toggleStatus = () => {
    setDrcUserStatus(prev => prev === 'Active' ? 'Inactive' : 'Active');
  };

  const handleAddRtomArea = () => {
    if (selectedRtomArea && !rtomAreas.some(area => area.name === selectedRtomArea)) {
      const selectedOption = rtomAreaOptions.find(opt => opt.area_name === selectedRtomArea);
      setRtomAreas([...rtomAreas, {
        name: selectedRtomArea,
        status: true,
        isNew: true,
        billing_center_code: selectedOption?.billing_center_code || 'N/A',
      }]);
      setSelectedRtomArea('');
    }
  };

  const handleRemoveRtomArea = (index) => {
    Swal.fire({
      title: 'Confirm Removal',
      text: `Are you sure you want to remove the RTOM area "${rtomAreas[index].name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const newRtomAreas = rtomAreas.filter((_, i) => i !== index);
        setRtomAreas(newRtomAreas);
        Swal.fire({
          title: 'Removed',
          text: 'RTOM area has been removed successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const toggleRtomAreaStatus = (index) => {
    const newRtomAreas = [...rtomAreas];
    newRtomAreas[index].status = !newRtomAreas[index].status;
    setRtomAreas(newRtomAreas);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!fetchedData) {
    return <div>No user data available.</div>;
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h2 className={GlobalStyle.headingLarge}>
        {itemType === 'drcUser' ? 'Edit DRC User' : 'Edit Recovery Officer'}
      </h2>
      <h2 className={`${GlobalStyle.headingMedium} pl-10`}>
        DRC Name : {fetchedData.drc_name || 'N/A'}
      </h2>

      <div className="flex gap-4 mt-4 justify-center">
        <div className={`${GlobalStyle.cardContainer} relative`}>
          <div className="absolute top-4 right-4">
            <div
              className={`w-11 h-6 rounded-full transition-colors ${drcUserStatus === 'Active' ? 'bg-green-500' : 'bg-gray-400'} relative cursor-pointer`}
              onClick={toggleStatus}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-[2px] transition-all ${drcUserStatus === 'Active' ? 'left-[26px]' : 'left-[2px]'}`}
              />
            </div>
            <span className={`text-sm font-semibold ml-2 ${drcUserStatus === 'Active' ? 'text-green-600' : 'text-gray-500'}`}>
              {drcUserStatus}
            </span>
          </div>

          <div className="table">
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-semibold">Added Date</div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">{fetchedData.added_date || 'N/A'}</div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-semibold">
                {itemType === 'drcUser' ? 'DRC User Name' : 'Recovery Officer Name'}
              </div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">
                {fetchedData.drcUser_name || fetchedData.recovery_officer_name || 'N/A'}
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-semibold">NIC</div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">{fetchedData.nic || 'N/A'}</div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Login Method</div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 pl-8 font-semibold">Contact Number</div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">
                <input
                  type="text"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  className={`${GlobalStyle.inputText} w-[150px]`}
                  placeholder="+94771234567"
                />
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 pl-12 font-semibold">
                <img
                  src={gmailIcon}
                  alt="Email"
                  className="w-5 h-5 inline-block mr-2 align-middle"
                  title="Email"
                />
              </div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${GlobalStyle.inputText} w-[200px]`}
                  placeholder="example@domain.com"
                />
              </div>
            </div>
          </div>

          {itemType === 'RO' && (
            <>
              <div className="table-row">
                <div className="table-cell px-4 py-2 font-semibold">RTOM Areas</div>
                <div className="table-cell px-4 py-2 font-semibold">:</div>
                <div className="table-cell px-4 py-2" />
              </div>
              <div className={GlobalStyle.tableContainer}>
                <table className={`${GlobalStyle.table} w-[360px]`}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th className={GlobalStyle.tableHeader}>RTOM Area</th>
                      <th className={GlobalStyle.tableHeader}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rtomAreas.length > 0 ? (
                      rtomAreas.map((area, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                        >
                          <td className={`${GlobalStyle.tableData} text-center pt-6`}>{area.name}</td>
                          <td className={`${GlobalStyle.tableData} text-center`}>
                            <div className="flex items-center justify-center gap-2">
                              <div
                                className={`inline-block w-11 h-6 rounded-full transition-colors ${area.status ? 'bg-green-500' : 'bg-gray-400'} relative cursor-pointer`}
                                onClick={() => toggleRtomAreaStatus(index)}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full bg-white absolute top-[2px] transition-all ${area.status ? 'left-[26px]' : 'left-[2px]'}`}
                                />
                              </div>
                              <span className={`text-sm font-semibold ${area.status ? 'text-green-600' : 'text-gray-500'}`}>
                                {area.status ? 'Active' : 'Inactive'}
                              </span>
                              {area.isNew && (
                                <button
                                  onClick={() => handleRemoveRtomArea(index)}
                                  className={`${GlobalStyle.buttonPrimary} w-10 h-8 flex items-center justify-center`}
                                  title="Remove RTOM Area"
                                >
                                  -
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-white">
                        <td colSpan={2} className="text-center py-4">
                          No RTOM areas available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="table-row mt-4">
                <div className="table-cell px-4 py-2 font-semibold">Add RTOM Area</div>
                <div className="table-cell px-4 py-2 font-semibold">:</div>
                <div className="table-cell px-4 py-2">
                  <div className="flex items-center">
                    <select
                      value={selectedRtomArea}
                      onChange={(e) => setSelectedRtomArea(e.target.value)}
                      className={`${GlobalStyle.inputText} w-[150px] mr-2`}
                    >
                      <option value="">Select RTOM</option>
                      {rtomAreaOptions
                        .filter(option => !rtomAreas.some(area => area.name === option.area_name))
                        .map(option => (
                          <option key={option.rtom_id} value={option.area_name}>
                            {option.area_name}
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={handleAddRtomArea}
                      className={GlobalStyle.buttonPrimary}
                      disabled={!selectedRtomArea}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <label className="font-semibold mr-2">Remark</label>
              </div>
              <div className="ml-4">
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className={`${GlobalStyle.inputText} w-[500px] h-20`}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end p-4">
            <button className={GlobalStyle.buttonPrimary} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-start mt-6 mb-6">
        <button className={GlobalStyle.buttonPrimary} onClick={() => setShowPopup(true)}>
          Log History
        </button>
      </div>

      {showPopup && (
        <div className={GlobalStyle.popupBoxContainer}>
          <div className={GlobalStyle.popupBoxBody}>
            <div className={GlobalStyle.popupBox}>
              <h2 className={GlobalStyle.popupBoxTitle}>Log History</h2>
              <button className={GlobalStyle.popupBoxCloseButton} onClick={() => setShowPopup(false)}>×</button>
            </div>
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
            <div className={`${GlobalStyle.tableContainer} max-h-[300px] overflow-y-auto`}>
  <table className={GlobalStyle.table}>

                <thead className={GlobalStyle.thead}>
                  <tr>
                    
                    <th className={GlobalStyle.tableHeader}>Edited On</th>
                    <th className={GlobalStyle.tableHeader}>Action</th>
                    <th className={GlobalStyle.tableHeader}>Edited By</th>
                  </tr>
                </thead>
                <tbody>
  {fetchedData.log_history && fetchedData.log_history.length > 0 ? (
    fetchedData.log_history
      .filter(
        (log) =>
          log.edited_on?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          log.action?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          log.edited_by?.toLowerCase()?.includes(searchQuery.toLowerCase())
      )
      .map((log, index) => (
        <tr
          key={index}
          className={`transition-colors duration-300 ${index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}`}
        >
          <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
            {log.edited_on || 'N/A'}
          </td>
          <td className={GlobalStyle.tableData}>{log.action || 'N/A'}</td>
          <td className={GlobalStyle.tableData}>{log.edited_by || 'N/A'}</td>
        </tr>
      ))
  ) : (
    <tr className="bg-white">
      <td colSpan={3} className="text-center py-4">
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
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
}