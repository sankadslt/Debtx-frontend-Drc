// /*Purpose: This template is used for the 2.16- Mediation board response
// Created Date: 2025-02-07
// Created By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
// Last Modified Date: 2025-02-12
// Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
// Version: node 20
// ui number : 2.16
// Dependencies: tailwind css
// Related Files: (routes)
// Notes: The following page conatins the code for the Mediation board response */



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

// import React, { useState } from "react";
// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import { ChevronDown } from "lucide-react";

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
//     remark: "",
//   });

//   const [showResponseHistory, setShowResponseHistory] = useState(false);
//   const [isSettlementExpanded, setIsSettlementExpanded] = useState(false);

//   // Sample response history data
//   const responseHistoryData = [
//     {
//       callingDate: "2024.11.04",
//       customerRepresented: "Yes",
//       agreeToSettle: "Yes",
//       remark: "Customer agreed to settlement plan",
//     },
//     {
//       callingDate: "2024.11.03",
//       customerRepresented: "No",
//       agreeToSettle: "No",
//       remark: "Customer not available",
//     },
//     {
//       callingDate: "2024.11.02",
//       customerRepresented: "Yes",
//       agreeToSettle: "No",
//       remark: "Customer requested more time",
//     },
//   ];

//   // Sample settlement data
//   const settlementData = [
//     { seqNo: 1, amount: 30000, date: "mm/dd/yyyy", paidAmount: 25000 },
//     { seqNo: 2, amount: 10000, date: "mm/dd/yyyy", paidAmount: "-" },
//     { seqNo: 3, amount: 10000, date: "mm/dd/yyyy", paidAmount: "-" },
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//   };

//   // Check if additional fields should be shown
//   const showAdditionalFields =
//     formData.customerRepresented === "Yes" && formData.settle === "Yes";

//   // Check if fail reason fields should be shown
//   const showFailReasonFields =
//     formData.customerRepresented === "Yes" && formData.settle === "No";

//   return (
//     <div className={GlobalStyle.fontPoppins}>
//       <div className="mb-6">
//         <h1 className={GlobalStyle.headingLarge}>Mediation Board Response</h1>
//       </div>

//       {/* Case Details Card */}
//       <div
//         className={`${GlobalStyle.cardContainer} mb-6 bg-blue-50 p-6 rounded-lg`}
//       >
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

//       {/* Case Details Card */}
//       <div
//         className={`${GlobalStyle.cardContainer} mb-6 bg-blue-50 p-6 rounded-lg`}
//       >
//         <table className="w-full">
//           <tbody>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Calling Round</td>

//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.caseId}</td>
//             </tr>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Handover Non-Settlement</td>
//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.customerRef}</td>
//             </tr>
//             <tr className="flex items-start py-1">
//               <td className="font-bold w-48">Next Calling Date</td>
//               <td className="px-2 font-bold">:</td>
//               <td className="text-gray-700">{caseDetails.accountNo}</td>
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

//         {/* Show Fail Reason and Next Calling Date when Customer Represented is Yes and Settle is No */}
//       {showFailReasonFields && (
//         <>
//           <div className="flex items-center space-x-4">
//             <label className="w-48 font-semibold">Fail Reason :</label>
//             <select
//               name="failReason"
//               value={formData.failReason}
//               onChange={handleInputChange}
//               className="w-72 p-2 border rounded-md"
//             >
//               <option value="">Select Response</option>
//               <option value="reason1">Reason 1</option>
//               <option value="reason2">Reason 2</option>
//               <option value="reason3">Reason 3</option>
//             </select>
//           </div>

//           <div className="flex items-center space-x-4">
//             <label className="w-48 font-semibold">Next Calling Date :</label>
//             <input
//               type="date"
//               name="nextCallingDate"
//               value={formData.nextCallingDate}
//               onChange={handleInputChange}
//               className="w-72 p-2 border rounded-md"
//             />
//           </div>
//         </>
//       )}

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
//           <button type="submit" className={`${GlobalStyle.buttonPrimary}`}>
//             Submit
//           </button>
//         </div>
//       </form>

//       {/* Response History Button */}
//       <div className="mt-6">
//       <button
//           type="button"
//           className={`${GlobalStyle.buttonPrimary}`}
//           onClick={() => setShowResponseHistory(!showResponseHistory)}
//         >
//           Response History
//         </button>

//         {/* Response History Table */}
//         {showResponseHistory && (
//           <div className="mt-4">
//             <h2 className="text-xl font-semibold mb-4">
//               Mediation Board Response History
//             </h2>
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="p-3 border text-left">Calling Date</th>
//                     <th className="p-3 border text-left">Customer Represented</th>
//                     <th className="p-3 border text-left">Agree to Settle</th>
//                     <th className="p-3 border text-left">Remark</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {responseHistoryData.map((item, index) => (
//                     <tr key={index}>
//                       <td className="p-3 border">{item.callingDate}</td>
//                       <td className="p-3 border">{item.customerRepresented}</td>
//                       <td className="p-3 border">{item.agreeToSettle}</td>
//                       <td className="p-3 border">{item.remark}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Settlement Table Section - Now with conditional rendering */}
//       {showAdditionalFields && (
//         <div className="mt-6">
//           <button
//             type="button"
//             onClick={() => setIsSettlementExpanded(!isSettlementExpanded)}
//             className="w-full flex items-center justify-between p-4 bg-gray-700 text-white rounded-t-lg"
//           >
//             <span>Settlement 1</span>
//             <ChevronDown
//               className={`transform transition-transform ${
//                 isSettlementExpanded ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {isSettlementExpanded && (
//             <div className="border rounded-b-lg overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="p-3 border text-left">Seq No</th>
//                     <th className="p-3 border text-left">
//                       Installment Settle Amount
//                     </th>
//                     <th className="p-3 border text-left">Plan Date</th>
//                     <th className="p-3 border text-left">
//                       Installment Paid Amount
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {settlementData.map((item, index) => (
//                     <tr key={index}>
//                       <td className="p-3 border">{item.seqNo}</td>
//                       <td className="p-3 border">{item.amount}</td>
//                       <td className="p-3 border">{item.date}</td>
//                       <td className="p-3 border">{item.paidAmount}</td>
//                     </tr>
//                   ))}
//                   <tr>
//                     <td colSpan="3" className="p-3 border text-right font-bold">
//                       Total =
//                     </td>
//                     <td className="p-3 border">25,000</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MediationBoardResponse;



import React, { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { X } from "lucide-react"; // Importing the close icon

const MediationBoardResponse = () => {
  const [caseDetails, setCaseDetails] = useState({
    caseId: "",
    customerRef: "",
    accountNo: "",
    arrearsAmount: "",
    lastPaymentDate: "",
  });

  const [callingRound, setCallingRound] = useState(3); // Example value, should be set based on actual data
  const [handoverNonSettlement, setHandoverNonSettlement] = useState("");
  const [nextCallingDate, setNextCallingDate] = useState("");

  const [formData, setFormData] = useState({
    request: "Task With SLT",
    customerRepresented: "",
    comment: "",
    settle: "",
    failReason: "",
    nextCallingDate: "",
    phase: "",
    settlementCount: "",
    initialAmount: "",
    calendarMonth: "0",
    durationFrom: "",
    durationTo: "",
    remark: "",
  });

  const [showResponseHistory, setShowResponseHistory] = useState(false);
  const [isSettlementExpanded, setIsSettlementExpanded] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHandoverChange = (e) => {
    setHandoverNonSettlement(e.target.value);
    // Reset next calling date if handover is set to Yes
    if (e.target.value === "Yes") {
      setNextCallingDate("");
    }
  };

  const handleNextCallingDateChange = (e) => {
    setNextCallingDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  // Show additional fields when customer is represented and agrees to settle
  const showSettlementFields =
    formData.customerRepresented === "Yes" && formData.settle === "Yes";

  // Show fail reason fields when customer is represented but doesn't agree to settle
  const showFailReasonFields =
    formData.customerRepresented === "Yes" && formData.settle === "No";

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="mb-8">
        <h1 className={GlobalStyle.headingLarge}>Mediation Board Response</h1>
      </div>

      {/* Case Details Card */}
      {/* <div className={`${GlobalStyle.cardContainer}`}>
        <div className="space-y-2">
          <div className="flex">
            <span className="w-48 font-semibold">Case ID:</span>
            <span className="text-gray-700">{caseDetails.caseId}</span>
          </div>
          <div className="flex">
            <span className="w-48 font-semibold">Customer Ref:</span>
            <span className="text-gray-700">{caseDetails.customerRef}</span>
          </div>
          <div className="flex">
            <span className="w-48 font-semibold">Account no:</span>
            <span className="text-gray-700">{caseDetails.accountNo}</span>
          </div>
          <div className="flex">
            <span className="w-48 font-semibold">Arrears Amount:</span>
            <span className="text-gray-700">{caseDetails.arrearsAmount}</span>
          </div>
          <div className="flex">
            <span className="w-48 font-semibold">Last Payment Date:</span>
            <span className="text-gray-700">{caseDetails.lastPaymentDate}</span>
          </div>
        </div>
      </div> */}

      {/* Case Details Card */}
      <div
        className={`${GlobalStyle.cardContainer}`}
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

      {/* Calling Details Card */}
      {/* <div className={`${GlobalStyle.cardContainer}`}>
        <div className="space-y-2">
          <div className="flex">
            <span className=" font-semibold">Calling Round :</span>
            <span className="text-gray-700">{callingRound}</span>
          </div>

          {callingRound === 3 && (
            <div className="flex items-center">
              <span className=" font-semibold">Handover Non-Settlement :</span>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="handoverNonSettlement"
                    value="Yes"
                    checked={handoverNonSettlement === "Yes"}
                    onChange={handleHandoverChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="handoverNonSettlement"
                    value="No"
                    checked={handoverNonSettlement === "No"}
                    onChange={handleHandoverChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
          )}

          {(callingRound < 3 ||
            (callingRound === 3 && handoverNonSettlement === "No")) && (
            <div className="flex items-center">
              <span className="w-48 font-semibold">Next Calling Date:</span>
              <input
                type="date"
                value={nextCallingDate}
                onChange={handleNextCallingDateChange}
                className="p-2 border rounded-md w-72"
                disabled={callingRound === 3 && handoverNonSettlement === "Yes"}
              />
            </div>
          )}
        </div>
      </div> */}

      <div className={`${GlobalStyle.cardContainer}`}>
        <table className="w-full">
          <tbody>
            <tr className="flex items-start py-1">
              <td className="font-semibold w-48">Calling Round</td>
              <td className="px-4 font-semibold">:</td>
              <td className="text-gray-700">{callingRound}</td>
            </tr>

            {callingRound === 3 && (
              <tr className="flex items-start py-1">
                <td className="font-semibold w-48">Handover Non-Settlement</td>
                <td className="px-4 font-semibold">:</td>
                <td>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="handoverNonSettlement"
                        value="Yes"
                        checked={handoverNonSettlement === "Yes"}
                        onChange={handleHandoverChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="handoverNonSettlement"
                        value="No"
                        checked={handoverNonSettlement === "No"}
                        onChange={handleHandoverChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </td>
              </tr>
            )}

            {(callingRound < 3 ||
              (callingRound === 3 && handoverNonSettlement === "No")) && (
              <tr className="flex items-start py-1">
                <td className="font-semibold w-48">Next Calling Date</td>
                <td className="px-4 font-semibold">:</td>
                <td>
                  <input
                    type="date"
                    value={nextCallingDate}
                    onChange={handleNextCallingDateChange}
                    className="p-2 border rounded-md w-72"
                    disabled={
                      callingRound === 3 && handoverNonSettlement === "Yes"
                    }
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center">
          <span className="w-48 font-semibold">Request:</span>
          <select
            name="request"
            value={formData.request}
            onChange={handleInputChange}
            className={GlobalStyle.selectBox}
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

        <div className="flex items-center">
          <span className=" font-semibold">Customer Represented:</span>
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

        <div className="flex">
          <span className="w-48 font-semibold">Comment:</span>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            className={GlobalStyle.remark}
            rows="5"
          />
        </div>

        {formData.customerRepresented === "Yes" && (
          <div className="flex items-center">
            <span className="w-48 font-semibold">Settle:</span>
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

        {showFailReasonFields && (
          <div className="flex items-center">
            <span className="w-48 font-semibold">Fail Reason:</span>
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
        )}

        {showSettlementFields && (
          <>
            <div className="flex items-center">
              <span className="w-48 font-semibold">Settlement Count:</span>
              <input
                type="text"
                name="settlementCount"
                value={formData.settlementCount}
                onChange={handleInputChange}
                className="w-72 p-2 border rounded-md"
              />
            </div>

            <div className="flex items-center">
              <span className="w-48 font-semibold">Initial Amount:</span>
              <input
                type="text"
                name="initialAmount"
                value={formData.initialAmount}
                onChange={handleInputChange}
                className="w-72 p-2 border rounded-md"
              />
            </div>

            <div className="flex items-center">
              <span className="w-48 font-semibold">Calendar Month:</span>
              <input
                type="number"
                name="calendarMonth"
                value={formData.calendarMonth}
                onChange={handleInputChange}
                className="w-20 p-2 border rounded-md"
                min="0"
              />
            </div>

            <div className="flex items-center">
              <span className="w-48 font-semibold">Duration:</span>
              <div className="flex items-center space-x-4">
                <span>From:</span>
                <input
                  type="text"
                  name="durationFrom"
                  value={formData.durationFrom}
                  onChange={handleInputChange}
                  className="w-32 p-2 border rounded-md"
                />
                <span>To:</span>
                <input
                  type="text"
                  name="durationTo"
                  value={formData.durationTo}
                  onChange={handleInputChange}
                  className="w-32 p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="flex">
              <span className="w-48 font-semibold">Remark:</span>
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

        <div className="flex justify-end mt-6">
          <button type="submit" className={`${GlobalStyle.buttonPrimary}`}>
            Submit
          </button>
        </div>
      </form>

      {/* <form onSubmit={handleSubmit}>
        <table className="w-full">
          <tbody className="space-y-6">
            <tr className="flex items-start py-1">
              <td className="font-semibold w-48">Request</td>
              <td className="px-2 font-semibold">:</td>
              <td>
                <select
                  name="request"
                  value={formData.request}
                  onChange={handleInputChange}
                  className={GlobalStyle.selectBox}
                >
                  <option value="Task With SLT">Task With SLT</option>
                  <option value="Request Settlement Plan">
                    Request Settlement Plan
                  </option>
                  <option value="Request Period Extend">
                    Request Period Extend
                  </option>
                  <option value="Request Customer Further Information">
                    Request Customer Further Information
                  </option>
                  <option value="Customer Request Service">
                    Customer Request Service
                  </option>
                </select>
              </td>
            </tr>

            <tr className="flex items-start py-1">
              <td className="font-semibold w-48">Customer Represented</td>
              <td className="px-2 font-semibold">:</td>
              <td>
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
              </td>
            </tr>

            <tr className="flex items-start py-1">
              <td className="font-semibold w-48">Comment</td>
              <td className="px-2 font-semibold">:</td>
              <td>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  className={GlobalStyle.remark}
                  rows="5"
                />
              </td>
            </tr>

            {formData.customerRepresented === "Yes" && (
              <tr className="flex items-start py-1">
                <td className="font-semibold w-48">Settle</td>
                <td className="px-2 font-semibold">:</td>
                <td>
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
                </td>
              </tr>
            )}

            {showFailReasonFields && (
              <tr className="flex items-start py-1">
                <td className="font-semibold w-48">Fail Reason</td>
                <td className="px-2 font-semibold">:</td>
                <td>
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
                </td>
              </tr>
            )}

            {showSettlementFields && (
              <>
                <tr className="flex items-start py-1">
                  <td className="font-semibold w-48">Settlement Count</td>
                  <td className="px-2 font-semibold">:</td>
                  <td>
                    <input
                      type="text"
                      name="settlementCount"
                      value={formData.settlementCount}
                      onChange={handleInputChange}
                      className="w-72 p-2 border rounded-md"
                    />
                  </td>
                </tr>

                <tr className="flex items-start py-1">
                  <td className="font-semibold w-48">Initial Amount</td>
                  <td className="px-2 font-semibold">:</td>
                  <td>
                    <input
                      type="text"
                      name="initialAmount"
                      value={formData.initialAmount}
                      onChange={handleInputChange}
                      className="w-72 p-2 border rounded-md"
                    />
                  </td>
                </tr>

                <tr className="flex items-start py-1">
                  <td className="font-semibold w-48">Calendar Month</td>
                  <td className="px-2 font-semibold">:</td>
                  <td>
                    <input
                      type="number"
                      name="calendarMonth"
                      value={formData.calendarMonth}
                      onChange={handleInputChange}
                      className="w-20 p-2 border rounded-md"
                      min="0"
                    />
                  </td>
                </tr>

                <tr className="flex items-start py-1">
                  <td className="font-semibold w-48">Duration</td>
                  <td className="px-2 font-semibold">:</td>
                  <td>
                    <div className="flex items-center space-x-4">
                      <span>From:</span>
                      <input
                        type="text"
                        name="durationFrom"
                        value={formData.durationFrom}
                        onChange={handleInputChange}
                        className="w-32 p-2 border rounded-md"
                      />
                      <span>To:</span>
                      <input
                        type="text"
                        name="durationTo"
                        value={formData.durationTo}
                        onChange={handleInputChange}
                        className="w-32 p-2 border rounded-md"
                      />
                    </div>
                  </td>
                </tr>

                <tr className="flex items-start py-1">
                  <td className="font-semibold w-48">Remark</td>
                  <td className="px-2 font-semibold">:</td>
                  <td>
                    <textarea
                      name="remark"
                      value={formData.remark}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      rows="4"
                    />
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <button type="submit" className={`${GlobalStyle.buttonPrimary}`}>
            Submit
          </button>
        </div>
      </form> */}

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowResponseHistory(!showResponseHistory)}
          className={`${GlobalStyle.buttonPrimary}`}
        >
          Response History
        </button>
      </div>

      {/* Response History Popup */}
      {showResponseHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-2/3 relative">
            {/* Close Button with X Icon */}
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
              onClick={() => setShowResponseHistory(false)}
            >
              <X size={24} />
            </button>

            {/* Mediation Board Response History Table */}
            <h2 className="text-2xl font-semibold mb-2 font-poppins">
              Mediation Board Response History
            </h2>
            <div className={GlobalStyle.tableContainer}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Calling Date
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Customer Represented
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Agree to Settle
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      callingDate: "2024-02-10",
                      customerRepresented: "Yes/No",
                      agreeToSettle: "Yes/No",
                      remark: "....",
                    },
                  ].map((entry, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-white bg-opacity-75"
                          : "bg-gray-50 bg-opacity-50"
                      } border-b`}
                    >
                      <td className={GlobalStyle.tableData}>
                        {entry.callingDate}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {entry.customerRepresented}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {entry.agreeToSettle}
                      </td>
                      <td className={GlobalStyle.tableData}>{entry.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Details Table */}
            <h2 className="text-2xl font-semibold mb-2 font-poppins mt-6">
              Payment Details
            </h2>
            <div className={GlobalStyle.tableContainer}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Date
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Paid Amount
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Settled Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      date: "2024-02-10",
                      paidAmount: "3000",
                      settledBalance: "....",
                    },
                  ].map((entry, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-white bg-opacity-75"
                          : "bg-gray-50 bg-opacity-50"
                      } border-b`}
                    >
                      <td className={GlobalStyle.tableData}>{entry.date}</td>
                      <td className={GlobalStyle.tableData}>
                        {entry.paidAmount}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {entry.settledBalance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Requested Additional Details Table */}
            <h2 className="text-2xl font-semibold mb-2 font-poppins mt-6">
              Requested Additional Details
            </h2>
            <div className={GlobalStyle.tableContainer}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Date
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Request
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      date: "2024-02-10",
                      request: "....",
                      remark: "....",
                    },
                  ].map((entry, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-white bg-opacity-75"
                          : "bg-gray-50 bg-opacity-50"
                      } border-b`}
                    >
                      <td className={GlobalStyle.tableData}>{entry.date}</td>
                      <td className={GlobalStyle.tableData}>{entry.request}</td>
                      <td className={GlobalStyle.tableData}>{entry.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediationBoardResponse;

