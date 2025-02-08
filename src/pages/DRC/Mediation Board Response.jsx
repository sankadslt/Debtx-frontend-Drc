// /*Purpose: This template is used for the 2.16- Mediation board response
// Created Date: 2025-01-07
// Created By: Sanjaya (sanjayaperera80@gmail.com)
// Last Modified Date: 2025-01-08
// Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
// Last Modified Date: 2025-02-07
// Version: node 20
// ui number : 2.16
// Dependencies: tailwind css
// Related Files: (routes)
// Notes: The following page conatins the code for the Mediation board response */

// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import { useState } from "react";
// import DatePicker from "react-datepicker";
// import { useNavigate } from "react-router-dom";

// export default function Mediation_board_response() {
//   const [caseDetails, setCaseDetails] = useState({
//     caseId: "",
//     customerRef: "",
//     accountNo: "",
//     arrearsAmount: "",
//     lastPaymentDate: "",
//   });

//   const navigate = useNavigate();
//   const [textareaValue, setTextareaValue] = useState("");
//   const [selectedOption, setSelectedOption] = useState("");
//   const [settleOption, setSettleOption] = useState("");
//   const [showSettleOptions, setShowSettleOptions] = useState(false);
//   const [showNameInput, setShowNameInput] = useState(false);
//   const [nameInput, setNameInput] = useState("");
//   const [fromDate, setFromDate] = useState(null);
//   const [error, setError] = useState("");
//   const [requestFurtherInfo, setRequestFurtherInfo] = useState(false); // State for checkbox

//   const handleCustomerRepresentedChange = (event) => {
//     setSelectedOption(event.target.value);
//     setShowSettleOptions(event.target.value === "Yes");
//   };

//   const handleSettleChange = (event) => {
//     setSettleOption(event.target.value);
//   };

//   const handleFromDateChange = (date) => {
//     setFromDate(date);
//     setError("");
//   };

//   const handleSubmit = () => {
//     alert("Submit button clicked");
//   };

//   const handleRequestFurtherInfoChange = () => {
//     setRequestFurtherInfo(!requestFurtherInfo);
//   };

//   return (
//     <div className={GlobalStyle.fontPoppins}>
//       <div className="mb-6">
//         <h1 className={GlobalStyle.headingLarge}>Mediation Board Response</h1>
//       </div>

//       {/* Card Box */}
//       <div className={`${GlobalStyle.cardContainer}`}>
//         <table className="w-full">
//           <tbody>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Case ID</td>
//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.caseId}</td>
//             </tr>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Customer Ref</td>
//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.customerRef}</td>
//             </tr>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Account no</td>
//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.accountNo}</td>
//             </tr>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Arrears Amount</td>
//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.arrearsAmount}</td>
//             </tr>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Last Payment Date</td>
//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.lastPaymentDate}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       {/* Request Dropdown */}
//       <div className="mb-6">
//         <div className="mb-mb-6 flex items-center space-x-6">
//           <label className={GlobalStyle.remarkTopic}>Request : </label>
//           <select className={`${GlobalStyle.selectBox} w-72`}>
//             <option value="" disabled selected className="text-gray-400">
//               Task is with SLT
//             </option>
//             <option value="Request Settlement Plan">
//               Request Settlement Plan
//             </option>
//             <option value="Request Period Extend">Request Period Extend</option>
//             <option value="Request Customer Further Information">
//               Request Customer Further Information
//             </option>
//             <option value="Customer Request Service">
//               Customer Request Service
//             </option>
//           </select>
//         </div>
//       </div>

//       {/* Customer Represented Option (Yes/No) */}
//       <div className="mb-6 flex gap-4">
//         <h1 className={`${GlobalStyle.fontPoppins} flex gap-4`}>
//           <div className={GlobalStyle.remarkTopic}>Customer Represented :</div>
//           <label>
//             <input
//               type="radio"
//               name="yesNo"
//               value="Yes"
//               checked={selectedOption === "Yes"}
//               onChange={handleCustomerRepresentedChange}
//             />
//             Yes
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="yesNo"
//               value="No"
//               checked={selectedOption === "No"}
//               onChange={handleCustomerRepresentedChange}
//             />
//             No
//           </label>
//         </h1>
//       </div>

//       {/* Comment Box */}
//       <div className="mb-6">
//         <div className="mb-mb-6 flex items-center space-x-6">
//           <label className={GlobalStyle.remarkTopic}>Comment : </label>
//           <textarea
//             value={textareaValue}
//             onChange={(e) => setTextareaValue(e.target.value)}
//             className={`${GlobalStyle.remark}`}
//             rows="5"
//           ></textarea>
//         </div>
//       </div>

//       {/* Settle Option (Yes/No) - Visible only if Customer Represented is Yes */}
//       {showSettleOptions && (
//         <div className="mb-6 flex gap-4">
//           <div className={GlobalStyle.remarkTopic}>Settle :</div>
//           <label>
//             <input
//               type="radio"
//               name="settleOption"
//               value="Yes"
//               checked={settleOption === "Yes"}
//               onChange={handleSettleChange}
//             />
//             Yes
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="settleOption"
//               value="No"
//               checked={settleOption === "No"}
//               onChange={handleSettleChange}
//             />
//             No
//           </label>
//         </div>
//       )}

//       {/* Submit Button */}
//       <div className="flex justify-end items-center w-full mt-6">
//         <button
//           className={`${GlobalStyle.buttonPrimary} ml-4`}
//           onClick={handleSubmit}
//         >
//           Submit
//         </button>
//       </div>

//       {/* Response History Button */}
//       <div className="mb-6">
//         <button
//           className={`${GlobalStyle.buttonPrimary}`}
//           onClick={() => alert("Response History clicked")}
//         >
//           Response History
//         </button>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from 'react';
// import GlobalStyle from "../../assets/prototype/GlobalStyle";

// const MediationBoardResponse = () => {
//   const [caseDetails, setCaseDetails] = useState({
//     caseId: "",
//     customerRef: "",
//     accountNo: "",
//     arrearsAmount: "",
//     lastPaymentDate: "",
//   });

//   const [formData, setFormData] = useState({
//     request: "Task With SLT",
//     customerRepresented: "",
//     comment: "",
//     settle: "",
//     phase: "",
//     settlementCount: "",
//     settlementPlan: "Plan 1",
//     initialAmount: "",
//     calendarMonth: "0",
//     durationFrom: "",
//     durationTo: "",
//     remark: ""
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//   // Check if additional fields should be shown
//   const showAdditionalFields = formData.customerRepresented === "Yes" && formData.settle === "Yes";

//   return (
//     <div className={GlobalStyle.fontPoppins}>
//       <div className="mb-6">
//         <h1 className={GlobalStyle.headingLarge}>Mediation Board Response</h1>
//       </div>

//       {/* Case Details Card */}
//       <div className={`${GlobalStyle.cardContainer} mb-6 bg-blue-50 p-6 rounded-lg`}>
//         <table className="w-full">
//           <tbody>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Case ID</td>
//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.caseId}</td>
//             </tr>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Customer Ref</td>
//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.customerRef}</td>
//             </tr>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Account no</td>
//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.accountNo}</td>
//             </tr>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Arrears Amount</td>
//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.arrearsAmount}</td>
//             </tr>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Last Payment Date</td>
//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.lastPaymentDate}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Request Dropdown */}
//         <div className="flex items-center space-x-4">
//           <label className="w-48 font-semibold">Request :</label>
//           <select
//             name="request"
//             value={formData.request}
//             onChange={handleInputChange}
//             className="w-72 p-2 border rounded-md"
//           >
//             <option value="Task With SLT">Task With SLT</option>
//             <option value="Request Settlement Plan">Request Settlement Plan</option>
//             <option value="Request Period Extend">Request Period Extend</option>
//             <option value="Request Customer Further Information">Request Customer Further Information</option>
//             <option value="Customer Request Service">Customer Request Service</option>
//           </select>
//         </div>

//         {/* Customer Represented */}
//         <div className="flex items-center space-x-4">
//           <label className="w-48 font-semibold">Customer Represented:</label>
//           <div className="flex gap-4">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="customerRepresented"
//                 value="Yes"
//                 checked={formData.customerRepresented === "Yes"}
//                 onChange={handleInputChange}
//                 className="mr-2"
//               />
//               Yes
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="customerRepresented"
//                 value="No"
//                 checked={formData.customerRepresented === "No"}
//                 onChange={handleInputChange}
//                 className="mr-2"
//               />
//               No
//             </label>
//           </div>
//         </div>

//         {/* Comment */}
//         <div className="flex space-x-4">
//           <label className="w-48 font-semibold">Comment:</label>
//           <textarea
//             name="comment"
//             value={formData.comment}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded-md"
//             rows="4"
//           />
//         </div>

//         {/* Show Settle option only if Customer Represented is Yes */}
//         {formData.customerRepresented === "Yes" && (
//           <div className="flex items-center space-x-4">
//             <label className="w-48 font-semibold">Settle :</label>
//             <div className="flex gap-4">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="settle"
//                   value="Yes"
//                   checked={formData.settle === "Yes"}
//                   onChange={handleInputChange}
//                   className="mr-2"
//                 />
//                 Yes
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="settle"
//                   value="No"
//                   checked={formData.settle === "No"}
//                   onChange={handleInputChange}
//                   className="mr-2"
//                 />
//                 No
//               </label>
//             </div>
//           </div>
//         )}

//         {/* Show additional fields only if both Customer Represented and Settle are Yes */}
//         {showAdditionalFields && (
//           <>
//             {/* Phase */}
//             <div className="flex items-center space-x-4">
//               <label className="w-48 font-semibold">Phase :</label>
//               <input
//                 type="text"
//                 name="phase"
//                 value={formData.phase}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>

//             {/* Settlement Count */}
//             <div className="flex items-center space-x-4">
//               <label className="w-48 font-semibold">Settlement Count :</label>
//               <input
//                 type="text"
//                 name="settlementCount"
//                 value={formData.settlementCount}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>

//             {/* Settlement Plan */}
//             <div className="flex items-center space-x-4">
//               <label className="w-48 font-semibold">Settlement Plan :</label>
//               <input
//                 type="text"
//                 name="settlementPlan"
//                 value={formData.settlementPlan}
//                 onChange={handleInputChange}
//                 className="w-72 p-2 border rounded-md bg-gray-100"
//                 readOnly
//               />
//             </div>

//             {/* Initial Amount */}
//             <div className="flex items-center space-x-4">
//               <label className="w-48 font-semibold">Initial Amount :</label>
//               <input
//                 type="text"
//                 name="initialAmount"
//                 value={formData.initialAmount}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>

//             {/* Calendar Month */}
//             <div className="flex items-center space-x-4">
//               <label className="w-48 font-semibold">Calendar Month :</label>
//               <input
//                 type="number"
//                 name="calendarMonth"
//                 value={formData.calendarMonth}
//                 onChange={handleInputChange}
//                 className="w-20 p-2 border rounded-md"
//                 min="0"
//               />
//             </div>

//             {/* Duration */}
//             <div className="flex items-center space-x-4">
//               <label className="w-48 font-semibold">Duration :</label>
//               <div className="flex items-center space-x-2">
//                 <span>From :</span>
//                 <input
//                   type="text"
//                   name="durationFrom"
//                   value={formData.durationFrom}
//                   onChange={handleInputChange}
//                   className="w-32 p-2 border rounded-md"
//                 />
//                 <span>To :</span>
//                 <input
//                   type="text"
//                   name="durationTo"
//                   value={formData.durationTo}
//                   onChange={handleInputChange}
//                   className="w-32 p-2 border rounded-md"
//                 />
//               </div>
//             </div>

//             {/* Remark */}
//             <div className="flex space-x-4">
//               <label className="w-48 font-semibold">Remark :</label>
//               <textarea
//                 name="remark"
//                 value={formData.remark}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md"
//                 rows="4"
//               />
//             </div>
//           </>
//         )}

//         {/* Submit Button */}
//         <div className="flex justify-end mt-6">
//           <button
//             type="submit"
//             className={`${GlobalStyle.buttonPrimary}`}
//           >
//             Submit
//           </button>
//         </div>
//       </form>

//       {/* Response History Button */}
//       <div className="mt-6">
//         <button
//           type="button"
//           className={`${GlobalStyle.buttonPrimary}`}
//           onClick={() => console.log('Response History clicked')}
//         >
//           Response History
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MediationBoardResponse;



import React, { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { ChevronDown } from "lucide-react";

const MediationBoardResponse = () => {
  const [caseDetails, setCaseDetails] = useState({
    caseId: "",
    customerRef: "",
    accountNo: "",
    arrearsAmount: "",
    lastPaymentDate: "",
  });

  const [formData, setFormData] = useState({
    request: "Task With SLT",
    customerRepresented: "",
    comment: "",
    settle: "",
    phase: "",
    settlementCount: "",
    settlementPlan: "Plan 1",
    initialAmount: "",
    calendarMonth: "0",
    durationFrom: "",
    durationTo: "",
    remark: "",
  });

  const [showResponseHistory, setShowResponseHistory] = useState(false);
  const [isSettlementExpanded, setIsSettlementExpanded] = useState(false);

  // Sample response history data
  const responseHistoryData = [
    {
      callingDate: "2024.11.04",
      customerRepresented: "Yes",
      agreeToSettle: "Yes",
      remark: "Customer agreed to settlement plan",
    },
    {
      callingDate: "2024.11.03",
      customerRepresented: "No",
      agreeToSettle: "No",
      remark: "Customer not available",
    },
    {
      callingDate: "2024.11.02",
      customerRepresented: "Yes",
      agreeToSettle: "No",
      remark: "Customer requested more time",
    },
  ];

  // Sample settlement data
  const settlementData = [
    { seqNo: 1, amount: 30000, date: "mm/dd/yyyy", paidAmount: 25000 },
    { seqNo: 2, amount: 10000, date: "mm/dd/yyyy", paidAmount: "-" },
    { seqNo: 3, amount: 10000, date: "mm/dd/yyyy", paidAmount: "-" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  // Check if additional fields should be shown
  const showAdditionalFields =
    formData.customerRepresented === "Yes" && formData.settle === "Yes";

  // Check if fail reason fields should be shown
  const showFailReasonFields =
    formData.customerRepresented === "Yes" && formData.settle === "No";

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="mb-6">
        <h1 className={GlobalStyle.headingLarge}>Mediation Board Response</h1>
      </div>

      {/* Case Details Card */}
      <div
        className={`${GlobalStyle.cardContainer} mb-6 bg-blue-50 p-6 rounded-lg`}
      >
        <table className="w-full">
          <tbody>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Case ID</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.caseId}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Customer Ref</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.customerRef}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Account no</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.accountNo}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Arrears Amount</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.arrearsAmount}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Last Payment Date</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.lastPaymentDate}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Request Dropdown */}
        <div className="flex items-center space-x-4">
          <label className="w-48 font-semibold">Request :</label>
          <select
            name="request"
            value={formData.request}
            onChange={handleInputChange}
            className="w-72 p-2 border rounded-md"
          >
            <option value="Task With SLT">Task With SLT</option>
            <option value="Request Settlement Plan">
              Request Settlement Plan
            </option>
            <option value="Request Period Extend">Request Period Extend</option>
            <option value="Request Customer Further Information">
              Request Customer Further Information
            </option>
            <option value="Customer Request Service">
              Customer Request Service
            </option>
          </select>
        </div>

        {/* Customer Represented */}
        <div className="flex items-center space-x-4">
          <label className="w-48 font-semibold">Customer Represented:</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="customerRepresented"
                value="Yes"
                checked={formData.customerRepresented === "Yes"}
                onChange={handleInputChange}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="customerRepresented"
                value="No"
                checked={formData.customerRepresented === "No"}
                onChange={handleInputChange}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        {/* Comment */}
        <div className="flex space-x-4">
          <label className="w-48 font-semibold">Comment:</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            rows="4"
          />
        </div>

        {/* Show Settle option only if Customer Represented is Yes */}
        {formData.customerRepresented === "Yes" && (
          <div className="flex items-center space-x-4">
            <label className="w-48 font-semibold">Settle :</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="settle"
                  value="Yes"
                  checked={formData.settle === "Yes"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="settle"
                  value="No"
                  checked={formData.settle === "No"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
        )}

        {/* Show Fail Reason and Next Calling Date when Customer Represented is Yes and Settle is No */}
      {showFailReasonFields && (
        <>
          <div className="flex items-center space-x-4">
            <label className="w-48 font-semibold">Fail Reason :</label>
            <select
              name="failReason"
              value={formData.failReason}
              onChange={handleInputChange}
              className="w-72 p-2 border rounded-md"
            >
              <option value="">Select Response</option>
              <option value="reason1">Reason 1</option>
              <option value="reason2">Reason 2</option>
              <option value="reason3">Reason 3</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-48 font-semibold">Next Calling Date :</label>
            <input
              type="date"
              name="nextCallingDate"
              value={formData.nextCallingDate}
              onChange={handleInputChange}
              className="w-72 p-2 border rounded-md"
            />
          </div>
        </>
      )}

        {/* Show additional fields only if both Customer Represented and Settle are Yes */}
        {showAdditionalFields && (
          <>
            {/* Phase */}
            <div className="flex items-center space-x-4">
              <label className="w-48 font-semibold">Phase :</label>
              <input
                type="text"
                name="phase"
                value={formData.phase}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Settlement Count */}
            <div className="flex items-center space-x-4">
              <label className="w-48 font-semibold">Settlement Count :</label>
              <input
                type="text"
                name="settlementCount"
                value={formData.settlementCount}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Settlement Plan */}
            <div className="flex items-center space-x-4">
              <label className="w-48 font-semibold">Settlement Plan :</label>
              <input
                type="text"
                name="settlementPlan"
                value={formData.settlementPlan}
                onChange={handleInputChange}
                className="w-72 p-2 border rounded-md bg-gray-100"
                readOnly
              />
            </div>

            {/* Initial Amount */}
            <div className="flex items-center space-x-4">
              <label className="w-48 font-semibold">Initial Amount :</label>
              <input
                type="text"
                name="initialAmount"
                value={formData.initialAmount}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Calendar Month */}
            <div className="flex items-center space-x-4">
              <label className="w-48 font-semibold">Calendar Month :</label>
              <input
                type="number"
                name="calendarMonth"
                value={formData.calendarMonth}
                onChange={handleInputChange}
                className="w-20 p-2 border rounded-md"
                min="0"
              />
            </div>

            {/* Duration */}
            <div className="flex items-center space-x-4">
              <label className="w-48 font-semibold">Duration :</label>
              <div className="flex items-center space-x-2">
                <span>From :</span>
                <input
                  type="text"
                  name="durationFrom"
                  value={formData.durationFrom}
                  onChange={handleInputChange}
                  className="w-32 p-2 border rounded-md"
                />
                <span>To :</span>
                <input
                  type="text"
                  name="durationTo"
                  value={formData.durationTo}
                  onChange={handleInputChange}
                  className="w-32 p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Remark */}
            <div className="flex space-x-4">
              <label className="w-48 font-semibold">Remark :</label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows="4"
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button type="submit" className={`${GlobalStyle.buttonPrimary}`}>
            Submit
          </button>
        </div>
      </form>

      {/* Response History Button */}
      <div className="mt-6">
      <button
          type="button"
          className={`${GlobalStyle.buttonPrimary}`}
          onClick={() => setShowResponseHistory(!showResponseHistory)}
        >
          Response History
        </button>

        {/* Response History Table */}
        {showResponseHistory && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">
              Mediation Board Response History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 border text-left">Calling Date</th>
                    <th className="p-3 border text-left">Customer Represented</th>
                    <th className="p-3 border text-left">Agree to Settle</th>
                    <th className="p-3 border text-left">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {responseHistoryData.map((item, index) => (
                    <tr key={index}>
                      <td className="p-3 border">{item.callingDate}</td>
                      <td className="p-3 border">{item.customerRepresented}</td>
                      <td className="p-3 border">{item.agreeToSettle}</td>
                      <td className="p-3 border">{item.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Settlement Table Section - Now with conditional rendering */}
      {showAdditionalFields && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setIsSettlementExpanded(!isSettlementExpanded)}
            className="w-full flex items-center justify-between p-4 bg-gray-700 text-white rounded-t-lg"
          >
            <span>Settlement 1</span>
            <ChevronDown
              className={`transform transition-transform ${
                isSettlementExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSettlementExpanded && (
            <div className="border rounded-b-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 border text-left">Seq No</th>
                    <th className="p-3 border text-left">
                      Installment Settle Amount
                    </th>
                    <th className="p-3 border text-left">Plan Date</th>
                    <th className="p-3 border text-left">
                      Installment Paid Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {settlementData.map((item, index) => (
                    <tr key={index}>
                      <td className="p-3 border">{item.seqNo}</td>
                      <td className="p-3 border">{item.amount}</td>
                      <td className="p-3 border">{item.date}</td>
                      <td className="p-3 border">{item.paidAmount}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="p-3 border text-right font-bold">
                      Total =
                    </td>
                    <td className="p-3 border">25,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediationBoardResponse;
