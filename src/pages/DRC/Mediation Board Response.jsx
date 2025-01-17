/*Purpose: This template is used for the 2.16- Mediation board response
Created Date: 2025-01-07
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-01-08
Version: node 20
ui number : 2.16
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for the Mediation board response */

import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";


export default function Mediation_board_response() {
  const [caseDetails, setCaseDetails] = useState({
    caseId: "",
    customerRef: "",
    accountNo: "",
    arrearsAmount: "",
    lastPaymentDate: "",
  });

  const navigate = useNavigate();
  const [textareaValue, setTextareaValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [settleOption, setSettleOption] = useState("");
  const [showSettlementPlan, setShowSettlementPlan] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false); // Add showNameInput state
  const [nameInput, setNameInput] = useState(""); // State for the name input field
  const [fromDate, setFromDate] = useState(null);
  const [error, setError] = useState("");

  const handleCustomerRepresentedChange = (event) => {
    setSelectedOption(event.target.value);

    // Reset settle option and hide name input when changing the customer representation
    if (event.target.value === "Yes") {
      setSettleOption("Yes"); // Automatically check "Yes" for settle
      setShowNameInput(false); // Ensure the name input is hidden
    } else {
      setSettleOption("");
      setShowNameInput(false);
    }
  };

  const handleSettleChange = (event) => {
    setSettleOption(event.target.value);

    // Show or hide the name input field based on the selected settle option
    if (event.target.value === "No") {
      setShowNameInput(true);
    } else {
      setShowNameInput(false);
    }
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
    setError(""); // Clear error when date is selected
  };

  const handleSubmit = () => {
    alert("Submit button clicked");
  }


  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="mb-6">
        <h1 className={GlobalStyle.headingLarge}>Meditation Board Response</h1>
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

      {/* Customer Represented option (Yes/No) */}

      <div className="mb-6 flex gap-4">
        <h1 className={`${GlobalStyle.fontPoppins} flex gap-4`}>
          <div className={GlobalStyle.remarkTopic}>Customer Represented:</div>
          <label>
            <input
              type="radio"
              name="yesNo"
              value="Yes"
              checked={selectedOption === "Yes"}
              onChange={handleCustomerRepresentedChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="yesNo"
              value="No"
              checked={selectedOption === "No"}
              onChange={handleCustomerRepresentedChange}
            />
            No
          </label>
        </h1>
      </div>

      {/* remark box */}
      <div className="mb-6 ">
        <div className="mb-mb-6 flex items-center space-x-6">
          <label className={GlobalStyle.remarkTopic}>Comment: </label>
          <textarea
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            className={`${GlobalStyle.remark}`}
            rows="5"
          ></textarea>
        </div>
      </div>

      {/* Settle option (Yes/No) */}
      {selectedOption === "Yes" && (
        <div className="mb-6 ">
          <div className=" mb-mb-6 flex gap-4">
            <fieldset className={`${GlobalStyle.fontPoppins} flex gap-4`}>
              <h1 className={`${GlobalStyle.remarkTopic} flex gap-4`}>
                Settle:
              </h1>
              <label>
                <input
                  type="radio"
                  name="settle"
                  value="Yes"
                  checked={settleOption === "Yes"}
                  onChange={handleSettleChange}
                />
                Yes
              </label>
              <label className="inline">
                <input
                  type="radio"
                  name="settle"
                  value="No"
                  checked={settleOption === "No"}
                  onChange={handleSettleChange}
                />
                No
              </label>
            </fieldset>
          </div>
        </div>
      )}

      {/* Show name input if "No" settle option is selected */}
      {showNameInput && (
        <div className="mb-6">
          <div className="mb-6 flex items-center space-x-6">
            <label className={GlobalStyle.remarkTopic}>Fail Reason: </label>
            <select className={GlobalStyle.selectBox}>
              <option value="" disabled selected>
                Select Option
              </option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </div>

          {/* Add datepicker */}

          <h1 className={`${GlobalStyle.remarkTopic} mb-6 flex gap-4`}>
            Next calling Date:{" "}
            <div className={`${GlobalStyle.datePickerContainer} flex gap-4`}>
              <DatePicker
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/MM/yyyy"
                className={GlobalStyle.inputText}
              />
            </div>
            {error && <span className={GlobalStyle.errorText}>{error}</span>}
          </h1>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end items-center w-full mt-6">
        <button className={`${GlobalStyle.buttonPrimary} ml-4`} onClick={handleSubmit}>Submit</button>
      </div>

      {settleOption === "Yes" && (
        <div className="flex justify-end items-center w-full mt-6">
          <button className={`${GlobalStyle.buttonPrimary} ml-4`}>
            Create Settlement Plan
          </button>
        </div>
      )}
    </div>
  );
}
