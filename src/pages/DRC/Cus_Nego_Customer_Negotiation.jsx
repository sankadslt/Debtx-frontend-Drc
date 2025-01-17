/*
This template is used for the 2.7.2-customer negotiation and 2.7.3-CPE collect for DRC
Created Date: 2025-01-09
Created By: sakumini (sakuminic@gmail.com)
Last Modified Date: 2025-01-09
Version: node 20
ui number : 2.7.2,2.7.3
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for the assigned customer negotiation and cpe collect for DRC  */

import React, { useState } from 'react';
import GlobalStyle from '../../assets/prototype/GlobalStyle';

const CustomerNegotiation = () => {
  const [activeTab, setActiveTab] = useState('negotiation');
  const [selectedReason, setSelectedReason] = useState('');
  const [customerAgreed, setCustomerAgreed] = useState('');
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);
  
  const [formData, setFormData] = useState({
    caseId: '',
    customerRef: '',
    accountNo: '',
    arrearsAmount: '',
    lastPaymentDate: '',
    telephoneNo: '',
    serviceType: '',
    serviceAddress: '',
    serviceStatus: '',
    fieldReason: '',
    failReason: '',
    request: '',
    remark: '',
    model: '',
    serialNo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleReasonChange = (type) => {
    if (activeTab === 'negotiation') {
      setSelectedReason(type);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!formData.caseId || !formData.customerRef || !formData.accountNo) {
    //   alert('Please fill in all required fields');
    //   return;
    // }
    if (activeTab === 'cpe' && customerAgreed === 'yes') {
      if (!formData.model || !formData.serialNo) {
        alert('Please fill in Model and Serial No fields');
        return;
      }
    }
    setShowSubmitMessage(true);
    setTimeout(() => {
      setShowSubmitMessage(false);
    }, 3000);
    console.log('Submitting form data:', formData);
    alert('Submit button clicked');
  };

  const handleCreateSettlementPlan = () => {
      alert(' settlement plan button clicked');
  };

  const renderNegotiationView = () => (
  <div className=" p-6 rounded-lg">
    {/* Customer Details Card */}
    <div className={`${GlobalStyle.cardContainer}`}>
     
  <p className="mb-2">
          <strong>Case ID:</strong>{' '}
          <span>{formData.caseId}</span>
        </p>
        <p className="mb-2">
          <strong>Customer Ref:</strong>{' '}
          <span>{formData.customerRef}</span>
        </p>
        <p className="mb-2">
          <strong>Account no:</strong>{' '}
          <span>{formData.accountNo}</span>
        </p>
        <p className="mb-2">
          <strong>Arrears Amount:</strong>{' '}
          <span>{formData.arrearsAmount}</span>
        </p>
        <p className="mb-2">
          <strong>Last Payment Date:</strong>{' '}
          <span>{formData.lastPaymentDate}</span>
        </p>
      </div>
   
      {/* Reason Selection */}
      <div className="flex gap-6 mb-6">
        <label className={`flex items-center gap-2 ${selectedReason ? 'cursor-pointer' : 'opacity-50'}`}>
          <div className="relative">
            <input
              type="radio"
              checked={selectedReason === 'field'}
              onChange={() => handleReasonChange('field')}
              className="w-5 h-5 opacity-0 absolute"
            />
            <div className={`w-5 h-5 border-2 rounded-full ${
              selectedReason === 'field' 
                ? 'border-[#00256A] bg-[#00256A]' 
                : 'border-gray-400'
            }`}>
              {selectedReason === 'field' && (
                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          </div>
          <span className="text-[#00256A] font-medium">Field Reason</span>
        </label>
        <label className={`flex items-center gap-2 ${selectedReason ? 'cursor-pointer' : 'opacity-50'}`}>
          <div className="relative">
            <input
              type="radio"
              checked={selectedReason === 'fail'}
              onChange={() => handleReasonChange('fail')}
              className="w-5 h-5 opacity-0 absolute"
            />
            <div className={`w-5 h-5 border-2 rounded-full ${
              selectedReason === 'fail' 
                ? 'border-[#00256A] bg-[#00256A]' 
                : 'border-gray-400'
            }`}>
              {selectedReason === 'fail' && (
                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          </div>
          <span className="text-[#00256A] font-medium">Fail Reason</span>
        </label>
      </div>

      {selectedReason === 'field' && (
        <div className="mb-6">
          <select
            name="fieldReason"
            value={formData.fieldReason}
            onChange={handleInputChange}
            className={GlobalStyle.selectBox}
          >
            <option value="">Field Reason</option>
            <option value="reason1">Agree to Settle</option>
            <option value="reason2">Customer Available</option>
            <option value="reason1">Message</option>
            <option value="reason1">Fully Paid</option>
            <option value="reason1">Already paid</option>
            <option value="reason1">Debt </option>
          </select>
        </div>
      )}

      {selectedReason === 'fail' && (
        <div className="mb-6">
          <select
            name="failReason"
            value={formData.failReason}
            onChange={handleInputChange}
            className={GlobalStyle.selectBox}
          >
            <option value="">Fail Reason</option>
            <option value="fail1">Customer Avaliable Not Agree to settle</option>
            <option value="fail2">Customer Gone abroad</option>
            <option value="fail2">No information of customer</option>
            <option value="fail2">Customer Dead</option>
            <option value="fail2">Installment Default</option>
            <option value="fail2">Rental only</option>
            <option value="fail2">CallingFailed</option>
          </select>
        </div>
      )}

      {/* Request and Remark */}
      <div className="space-y-4 mb-6">
      <div>
        <label className={GlobalStyle.remarkTopic}>Request:</label>
        <select
          name="request"
          value={formData.request}
          onChange={handleInputChange}
          className={GlobalStyle.selectBox}
        >
          <option value="task_with_slt">Task With SLT</option>
          <option value="mediation_request">Mediation board forward request letter</option>
          <option value="settlement_plan">Settlement plan</option>
          <option value="extend_period">Request period extend</option>
          <option value="customer_info">Request customer further information</option>
          <option value="non_settlement">Handed over Non-Settlement</option>
        </select>
      </div>

        <div>
          <label className={GlobalStyle.remarkTopic}>Remark:</label>
          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleInputChange}
            className={GlobalStyle.remark}
            rows={4}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mb-8">
        <button 
          onClick={handleSubmit}
          className={GlobalStyle.buttonPrimary}
        >
          Submit
        </button>
        {selectedReason === 'field' && (
          <button 
            onClick={handleCreateSettlementPlan}
            className={GlobalStyle.buttonPrimary}
          >
            Create Settlement Plan
          </button>
        )}
      </div>

      {/* Tables */}
      {['Last Negotiation Detail', 'Settlement Details', 'Payment Details', 'Requested Additional Details'].map((title) => (
        <div key={title} className="mb-8">
          <h3 className={`${GlobalStyle.headingMedium} mb-4`}>{title}</h3>
          <div className={GlobalStyle.tableContainer}>
            <table className={GlobalStyle.table}>
              <thead>
                <tr>
                  <th className={GlobalStyle.tableHeader}>Date</th>
                  <th className={GlobalStyle.tableHeader}>Negotiation</th>
                  <th className={GlobalStyle.tableHeader}>Remark</th>
                </tr>
              </thead>
              <tbody>
                <tr className={GlobalStyle.tableRowEven}>
                  <td className={GlobalStyle.tableData}>2024.11.04</td>
                  <td className={GlobalStyle.tableData}>...................</td>
                  <td className={GlobalStyle.tableData}>.............</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCPEView = () => (
    <div className="p-6 rounded-lg">
        <div className={`${GlobalStyle.cardContainer}`}>

      <p className="mb-2 flex">
        <strong className="min-w-[140px]">Case ID:</strong>
        <span>{formData.caseId}</span>
      </p>
      <p className="mb-2 flex">
        <strong className="min-w-[140px]">Customer Ref:</strong>
        <span>{formData.customerRef}</span>
      </p>
      <p className="mb-2 flex">
        <strong className="min-w-[140px]">Account no:</strong>
        <span>{formData.accountNo}</span>
      </p>
      <p className="mb-2 flex">
        <strong className="min-w-[140px]">Telephone No:</strong>
        <span>{formData.telephoneNo}</span>
      </p>
      <p className="mb-2 flex">
        <strong className="min-w-[140px]">Service Type:</strong>
        <span>{formData.serviceType}</span>
      </p>
      <p className="mb-2 flex">
        <strong className="min-w-[140px]">Service Address:</strong>
        <span>{formData.serviceAddress}</span>
      </p>
      <p className="mb-2 flex">
        <strong className="min-w-[140px]">Service Status:</strong>
        <span>{formData.serviceStatus}</span>
      </p>
    </div>
    
      {/* Customer Agreed Section */}
      <div className="mb-6">
        <label className={GlobalStyle.remarkTopic}>Customer Agreed:</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="customerAgreed"
              value="yes"
              checked={customerAgreed === 'yes'}
              onChange={(e) => setCustomerAgreed(e.target.value)}
              className="w-4 h-4"
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="customerAgreed"
              value="no"
              checked={customerAgreed === 'no'}
              onChange={(e) => setCustomerAgreed(e.target.value)}
              className="w-4 h-4"
            />
            <span>No</span>
          </label>
        </div>
      </div>

      {/* Model and Serial No fields appear when Yes is selected */}
      {customerAgreed === 'yes' && (
        <div className="space-y-4 mb-6">
          <div>
            <label className={GlobalStyle.remarkTopic}>Model:</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className={GlobalStyle.inputText}
            />
          </div>
          <div>
            <label className={GlobalStyle.remarkTopic}>Serial No:</label>
            <input
              type="text"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleInputChange}
              className={GlobalStyle.inputText}
            />
          </div>
        </div>
      )}

      {customerAgreed === 'no' && (
        <div>
        <label className={GlobalStyle.remarkTopic}>Remark:</label>
        <textarea
          name="remark"
          value={formData.remark}
          onChange={handleInputChange}
          className={GlobalStyle.remark}
          rows={4}
        />
      </div>
        
      )}


      {/* Submit Button */}
      <div className="flex justify-end mb-6">
        <button 
          onClick={handleSubmit}
          className={GlobalStyle.buttonPrimary}
        >
          Submit
        </button>
      </div>

      {/* Submit Message */}
      {showSubmitMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
           submitted successfully!
        </div>
      )}
       
      {/* Last Negotiation Detail */}
      <div className="mb-8">
        <h3 className={`${GlobalStyle.headingMedium} mb-4`}>Last Negotiation Detail</h3>
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead>
              <tr>
                <th className={GlobalStyle.tableHeader}>Date</th>
                <th className={GlobalStyle.tableHeader}>Negotiation</th>
                <th className={GlobalStyle.tableHeader}>Remark</th>
              </tr>
            </thead>
            <tbody>
              <tr className={GlobalStyle.tableRowEven}>
                <td className={GlobalStyle.tableData}>2024.11.04</td>
                <td className={GlobalStyle.tableData}>...................</td>
                <td className={GlobalStyle.tableData}>.............</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 min-h-screen">
      <h1 className={`${GlobalStyle.headingLarge} mb-6`}>
      {activeTab === 'negotiation' ? 'Customer Negotiation' : 'CPE Collect'}
      </h1>
      
      {/* Tab Navigation */}
      <div className="flex">
        <button
          className={`px-8 py-3 rounded-t-lg font-medium ${
            activeTab === 'negotiation' 
               ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab('negotiation')}
        >
          Customer Negotiation
        </button>
        <button
          className={`px-8 py-3 rounded-t-lg font-medium ${
            activeTab === 'cpe' 
           ? "border-b-2 border-blue-500 font-bold"
           : "text-gray-500"
          }`}
          onClick={() => setActiveTab('cpe')}
        >
          CPE Collect
        </button>
      </div>

      {activeTab === 'negotiation' ? renderNegotiationView() : renderCPEView()}
    </div>
  );
};

export default CustomerNegotiation;

// import React, { useState } from 'react';
// import GlobalStyle from '../../assets/prototype/GlobalStyle';

// const CustomerNegotiation = () => {
//   const [activeTab, setActiveTab] = useState('negotiation');
//   const [selectedReason, setSelectedReason] = useState('field');
  
//   const [formData, setFormData] = useState({
//     caseId: '',
//     customerRef: '',
//     accountNo: '',
//     arrearsAmount: '',
//     lastPaymentDate: '',
//     fieldReason: '',
//     failReason: '',
//     request: '',
//     remark: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleReasonChange = (type) => {
//     setSelectedReason(type);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.caseId || !formData.customerRef || !formData.accountNo) {
//       alert('Please fill in all required fields');
//       return;
//     }
//     console.log('Submitting form data:', formData);
//   };

//   const handleCreateSettlementPlan = () => {
//     if (!formData.arrearsAmount) {
//       alert('Please enter arrears amount to create settlement plan');
//       return;
//     }
//     console.log('Creating settlement plan for:', formData);
//   };

//   return (
//     <div className="p-4 min-h-screen">
//       <h1 className={`${GlobalStyle.headingLarge} mb-6`}>Customer Negotiation</h1>
      
//       {/* Tab Navigation */}
//       <div className="flex ">
//         <button
//           className={`px-8 py-3 rounded-t-lg font-medium ${
//             activeTab === 'negotiation' 
//               ? 'bg-[#F1F5FF] text-[#00256A] border-t-2 border-x-2 border-[#00256A]' 
//               : 'bg-gray-100 text-gray-500'
//           }`}
//           onClick={() => setActiveTab('negotiation')}
//         >
//           Customer Negotiation
//         </button>
//         <button
//           className={`px-8 py-3 rounded-t-lg font-medium ${
//             activeTab === 'cpe' 
//               ? 'bg-[#F1F5FF] text-[#00256A] border-t-2 border-x-2 border-[#00256A]' 
//               : 'bg-gray-100 text-gray-500'
//           }`}
//           onClick={() => setActiveTab('cpe')}
//         >
//           CPE Collect
//         </button>
//       </div>

//       <div className="bg-[#F1F5FF] p-6 rounded-lg">
//         {/* Customer Details Card */}
//         <div className="bg-white rounded-lg p-6 shadow-md mb-6">
//           <div>
//             <label className={GlobalStyle.remarkTopic}>Case ID:</label>
//             <input
//               type="text"
//               name="caseId"
//               value={formData.caseId}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div>
//             <label className={GlobalStyle.remarkTopic}>Customer Ref:</label>
//             <input
//               type="text"
//               name="customerRef"
//               value={formData.customerRef}
//               onChange={handleInputChange}  
//             />
//           </div>
//           <div>
//             <label className={GlobalStyle.remarkTopic}>Account no:</label>
//             <input
//               type="text"
//               name="accountNo"
//               value={formData.accountNo}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div>
//             <label className={GlobalStyle.remarkTopic}>Arrears Amount:</label>
//             <input
//               type="text"
//               name="arrearsAmount"
//               value={formData.arrearsAmount}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div>
//             <label className={GlobalStyle.remarkTopic}>Last Payment Date:</label>
//             <input
//               type="text"
//               name="lastPaymentDate"
//               value={formData.lastPaymentDate}
//               onChange={handleInputChange}
//             />
//           </div>
//         </div>

//         {/* Reason Selection */}
//         <div className="flex gap-6 mb-6">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <div className="relative">
//               <input
//                 type="radio"
//                 checked={selectedReason === 'field'}
//                 onChange={() => handleReasonChange('field')}
//                 className="w-5 h-5 opacity-0 absolute"
//               />
//               <div className={`w-5 h-5 border-2 rounded-full ${
//                 selectedReason === 'field' 
//                   ? 'border-[#00256A] bg-[#00256A]' 
//                   : 'border-gray-400'
//               }`}>
//                 {selectedReason === 'field' && (
//                   <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//                 )}
//               </div>
//             </div>
//             <span className="text-[#00256A] font-medium">Field Reason</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <div className="relative">
//               <input
//                 type="radio"
//                 checked={selectedReason === 'fail'}
//                 onChange={() => handleReasonChange('fail')}
//                 className="w-5 h-5 opacity-0 absolute"
//               />
//               <div className={`w-5 h-5 border-2 rounded-full ${
//                 selectedReason === 'fail' 
//                   ? 'border-[#00256A] bg-[#00256A]' 
//                   : 'border-gray-400'
//               }`}>
//                 {selectedReason === 'fail' && (
//                   <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//                 )}
//               </div>
//             </div>
//             <span className="text-[#00256A] font-medium">Fail Reason</span>
//           </label>
//         </div>

//         {/* Field Reason Dropdown */}
//         {selectedReason === 'field' && (
//           <div className="mb-6">
//             <select
//               name="fieldReason"
//               value={formData.fieldReason}
//               onChange={handleInputChange}
//               className={GlobalStyle.selectBox}
//             >
//               <option value="">Field Reason</option>
//               <option value="reason1">Field Reason 1</option>
//               <option value="reason2">Field Reason 2</option>
//             </select>
//           </div>
//         )}

//         {/* Fail Reason Dropdown */}
//         {selectedReason === 'fail' && (
//           <div className="mb-6">
//             <select
//               name="failReason"
//               value={formData.failReason}
//               onChange={handleInputChange}
//               className={GlobalStyle.selectBox}
//             >
//               <option value="">Fail Reason</option>
//               <option value="fail1">Fail Reason 1</option>
//               <option value="fail2">Fail Reason 2</option>
//             </select>
//           </div>
//         )}

//         {/* Request and Remark */}
//         <div className="space-y-4 mb-6">
//           <div>
//             <label className={GlobalStyle.remarkTopic}>Request:</label>
//             <select
//               name="request"
//               value={formData.request}
//               onChange={handleInputChange}
//               className={GlobalStyle.selectBox}
//             >
//               <option value="">Task With SLT</option>
//             </select>
//           </div>
//           <div>
//             <label className={GlobalStyle.remarkTopic}>Remark:</label>
//             <textarea
//               name="remark"
//               value={formData.remark}
//               onChange={handleInputChange}
//               className={GlobalStyle.remark}
//               rows={4}
//             />
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-4 mb-8">
//           <button 
//             onClick={handleSubmit}
//             className={GlobalStyle.buttonPrimary}
//           >
//             Submit
//           </button>
//           {selectedReason === 'field' && (
//             <button 
//               onClick={handleCreateSettlementPlan}
//               className={GlobalStyle.buttonPrimary}
//             >
//               Create Settlement Plan
//             </button>
//           )}
//         </div>

//         {/* Details Tables */}
//         {['Last Negotiation Detail', 'Settlement Details', 'Payment Details', 'Requested Additional Details'].map((title) => (
//           <div key={title} className="mb-8">
//             <h3 className={`${GlobalStyle.headingMedium} mb-4`}>{title}</h3>
//             <div className={GlobalStyle.tableContainer}>
//               <table className={GlobalStyle.table}>
//                 <thead>
//                   <tr>
//                     <th className={GlobalStyle.tableHeader}>Date</th>
//                     <th className={GlobalStyle.tableHeader}>Negotiation</th>
//                     <th className={GlobalStyle.tableHeader}>Remark</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr className={GlobalStyle.tableRowEven}>
//                     <td className={GlobalStyle.tableData}>2024.11.04</td>
//                     <td className={GlobalStyle.tableData}>...................</td>
//                     <td className={GlobalStyle.tableData}>.............</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CustomerNegotiation;