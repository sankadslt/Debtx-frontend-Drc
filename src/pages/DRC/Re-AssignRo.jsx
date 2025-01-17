/*Purpose: This template is used for the 2.5- Re-Assign RO
Created Date: 2025-01-07
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-01-08
Version: node 20
ui number : 2.5
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for the Re-Assign RO  */

import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useState } from "react";
import{useNavigate} from "react-router-dom";

export default function Re_AssignRo() {
  //Sample data
  const data = [
    {
      date: "2025.01.01",
      negotiation: "Negotiation",
    },
    {
      date: "2025.01.20",
      negotiation: "Negotiation",
    },
    {
      date: "2025.01.31",
      negotiation: "Negotiation",
    },
  ];
  const navigate = useNavigate();

  // State to manage case details
  const [caseDetails, setCaseDetails] = useState({
    caseId: "",
    customerRef: "",
    accountNo: "",
    arrearsAmount: "",
    lastPaymentDate: "",
  });
  // State for managing the remark text area value
  const [textareaValue, setTextareaValue] = useState("");

  const handleSubmit = () => {
    alert("Submit button clicked");
  }

  return (
    <div className={`${GlobalStyle.fontPoppins}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={GlobalStyle.headingLarge}>Re-Assign RO</h1>
      </div>
      {/* card box*/}
      
        <div className={`${GlobalStyle.cardContainer}`}>
          <p className="mb-2">
            <strong>Case ID:{caseDetails.caseId}</strong>
          </p>
          <p className="mb-2">
            <strong>Customer Ref:{caseDetails.customerRef}</strong>{" "}
          </p>
          <p className="mb-2">
            <strong>Account no:{caseDetails.accountNo}</strong>{" "}
          </p>
          <p className="mb-2">
            <strong>Arrears Amount:{caseDetails.arrearsAmount}</strong>{" "}
          </p>
          <p className="mb-2">
            <strong>Last Payment Date:{caseDetails.lastPaymentDate}</strong>{" "}
          </p>
        </div>
      

      {/* remark box */}

      <div className="mb-6 flex items-center  space-x-6">
        <label className={GlobalStyle.remarkTopic}>Last RO details</label>
        <textarea
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          className={`${GlobalStyle.remark}`}
          rows="5"
        ></textarea>
      </div>

      {/* Heading  */}
      <h2 className={`${GlobalStyle.remarkTopic} mb-4 `}>
        Last Negotiation Detail
      </h2>

      {/* Table  */}
      <div className="mb-6 ">
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>Date</th>
                <th className={GlobalStyle.tableHeader}>Negotiation</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={item.date}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td className={GlobalStyle.tableData}>{item.date}</td>
                  <td className={GlobalStyle.tableData}>{item.negotiation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlement details section */}
      <div className="flex mb-6">
        <h1 className={GlobalStyle.remarkTopic}>Settlement Details :</h1>
        <h1></h1>
      </div>

      {/* dropdown */}
      <div className="flex   gap-10">
        <h1 className={GlobalStyle.remarkTopic}>Assign RO</h1>
        <select
          className={`${GlobalStyle.selectBox}`}
          style={{ width: "600px" }}
        >
          <option value="option1"></option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end items-center w-full mt-6">
        <button className={`${GlobalStyle.buttonPrimary} ml-4`} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
