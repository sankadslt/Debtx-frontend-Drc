import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import gmailIcon from "../../assets/images/google.png";

// Sample RTOM Areas options for the dropdown
const rtomAreaOptions = ['GM', 'KU', 'SL', 'WM'];

export default function RO_DRCUserInfoEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemType, itemData } = location.state || {};
  const [contactNo, setContactNo] = useState(itemData?.contact_no || '');
  const [email, setEmail] = useState(itemData?.email || '');
  const [remark, setRemark] = useState(itemData?.remark || '');
  const [status, setStatus] = useState(itemData?.status || true);
  const [rtomAreas, setRtomAreas] = useState(itemData?.rtom_areas || []);
  const [selectedRtomArea, setSelectedRtomArea] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (itemType && itemData) {
      setContactNo(itemData.contact_no || '');
      setEmail(itemData.email || '');
      setRemark(itemData.remark || '');
      setStatus(itemData.status || true);
      if (itemType === 'RO') {
        setRtomAreas(itemData.rtom_areas || []);
      }
    }
  }, [itemType, itemData]);

  const handleSave = () => {
    const updatedData = {
      ...itemData,
      contact_no: contactNo,
      email: email,
      remark: remark,
      status: status,
      ...(itemType === 'RO' && { rtom_areas: rtomAreas }),
    };
    console.log('Saved Data:', updatedData);
    // Add API call here to update the user info
    navigate(-1);
  };

  const toggleStatus = () => {
    setStatus(prev => !prev);
  };

  const handleAddRtomArea = () => {
    if (selectedRtomArea && !rtomAreas.some(area => area.name === selectedRtomArea)) {
      setRtomAreas([...rtomAreas, { name: selectedRtomArea, status: true }]);
      setSelectedRtomArea('');
    }
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h2 className={GlobalStyle.headingLarge}>
        {itemType === 'drcUser' ? 'Edit DRC User' : 'Edit Recovery Officer'}
      </h2>
      <h2 className={`${GlobalStyle.headingMedium} pl-10`}>
        DRC Name : {itemData?.drc_name || 'ABC company'}
      </h2>

      {/* Case Details */}
      <div className="flex gap-4 mt-4 justify-center">
        <div className={`${GlobalStyle.cardContainer} relative`}>
          <div className="absolute top-4 right-4">
            <div
              className={`w-11 h-6 rounded-full transition-colors ${status ? 'bg-green-500' : 'bg-gray-400'} relative cursor-pointer`}
              onClick={toggleStatus}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-[2px] transition-all ${status ? 'left-[26px]' : 'left-[2px]'}`}
              />
            </div>
          </div>

          <div className="table">
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-semibold">Added date</div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">{itemData?.added_date || 'mm/dd/yyyy'}</div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-semibold">
                {itemType === 'drcUser' ? 'DRC User Name' : 'Recovery Officer Name'}
              </div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">{itemData?.drcUser_name || itemData?.recovery_officer_name || 'Mr. Sunil Perera'}</div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-semibold">NIC</div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">{itemData?.nic || '1999678190V'}</div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Login method</div>
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
                />
              </div>
            </div>
            <br></br>
            </div>
            {itemType === 'RO' && (
              <>
                <div className="table-row">
                  <div className="table-cell px-4 py-2 font-semibold">RTOM Areas :</div>
                  <div className="table-cell px-4 py-2" />
                  <div className="table-cell px-4 py-2" />
                </div>
                <div className={GlobalStyle.tableContainer} >
                  <table className={`${GlobalStyle.table} w-[320px]`}>
                    <thead className={GlobalStyle.thead}>
                    <tr>
                      <th className={GlobalStyle.tableHeader}>RTOM Area</th>
                      <th className={GlobalStyle.tableHeader}>Status</th>
                    </tr>
                  </thead>
                    <tbody>
                      {rtomAreas.map((area, index) => (
                        <tr key={index}>
                          <td className={`${GlobalStyle.tableData} text-center`}>{area.name}</td>
                          <td className={`${GlobalStyle.tableData} text-center`}>
                            
                            <div
                              className={`inline-block w-11 h-6 rounded-full transition-colors ${area.status ? 'bg-green-500' : 'bg-gray-400'} relative`}
                              onClick={() => {
                                const newRtomAreas = [...rtomAreas];
                                newRtomAreas[index].status = !newRtomAreas[index].status;
                                setRtomAreas(newRtomAreas);
                              }}
                            >
                              <div
                                className={`w-5 h-5 rounded-full bg-white absolute top-[2px] transition-all ${area.status ? 'left-[26px]' : 'left-[2px]'}`}
                              />
                            </div>
                            
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <br></br>
                <div className="table-row">
  {/* Label Cell */}
  <div className="table-cell px-4 py-2 font-semibold">
    RTOM Area
  </div>

  {/* Colon Cell */}
  <div className="table-cell px-4 py-2 font-semibold">:</div>

  {/* Dropdown and Button Cell */}
  <div className="table-cell px-4 py-2">
    <div className="flex items-center">
      <select
        value={selectedRtomArea}
        onChange={(e) => setSelectedRtomArea(e.target.value)}
        className={`${GlobalStyle.inputText} w-[150px] mr-2`}
      >
        <option value="">RTOM</option>
        {rtomAreaOptions
          .filter(option => !rtomAreas.some(area => area.name === option))
          .map(option => (
            <option key={option} value={option}>
              {option}
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
  {/* Remark Input Section */}
  <div className="flex flex-col">
    <div className="flex items-center mb-2">
      <label className="font-semibold mr-2">Remark</label>
      
    </div>
    <textarea
      value={remark}
      onChange={(e) => setRemark(e.target.value)}
      className={`${GlobalStyle.inputText} w-[500px] h-20 ml-4`} // Increased width and left margin
    />
  </div>

 
</div>





           <div className="flex justify-end p-4">
  <button className={GlobalStyle.buttonPrimary} onClick={handleSave}>
    Save
  </button>
  </div>
        </div>
      </div>

      {/* Log History Button */}
      <div className="flex justify-start mt-6 mb-6">
        <button className={GlobalStyle.buttonPrimary} onClick={() => setShowPopup(true)}>
          Log History
        </button>
      </div>

      {/* Log History Popup */}
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
            <div className={GlobalStyle.tableContainer}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th className={GlobalStyle.tableHeader}>Edited On</th>
                    <th className={GlobalStyle.tableHeader}>Action</th>
                    <th className={GlobalStyle.tableHeader}>Edited By</th>
                  </tr>
                </thead>
                <tbody>
                  {itemData?.log_history && itemData.log_history.length > 0 ? (
                    itemData.log_history
                      .filter(
                        (log) =>
                          log.edited_on?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.edited_by?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((log, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                        >
                          <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
                            {log.edited_on || '06/18/2025'}
                          </td>
                          <td className={GlobalStyle.tableData}>{log.action}</td>
                          <td className={GlobalStyle.tableData}>{log.edited_by}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
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

      {/* Back Button */}
      <div>
        <button onClick={() => navigate(-1)} className={GlobalStyle.buttonPrimary}>
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
}