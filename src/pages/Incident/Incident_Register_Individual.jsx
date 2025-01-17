/*Purpose: 
Created Date: 2025-01-09
Created By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Version: React v18
ui number : 1.1.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */


import { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Incident_Register_Individual = () => {
    const [accountNo, setAccountNo] = useState("");
    const [actionType, setActionType] = useState("");
    const [calendarMonth, setCalendarMonth] = useState(0);
    const [closingDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate] = useState(null);
    const [errors, setErrors] = useState({});

    const validateDates = (from, to) => {
        const newErrors = {};
        if (from && to && from > to) {
            newErrors.fromDate = "From date cannot be later than To date";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFromDateChange = (date) => {
        setFromDate(date);
        validateDates(date, toDate);
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateDates(fromDate, toDate)) {
            console.log("Form submitted with data:", {
                accountNo,
                actionType,
                calendarMonth,
                closingDate,
                fromDate,
                toDate,
            });
        }
    };

    const handleMonthChange = (increment) => {
        setCalendarMonth((prev) => {
            const newValue = Math.max(0, prev + (increment ? 1 : -1));
            console.log(`Calendar month ${increment ? 'increased' : 'decreased'} to:`, newValue);
            return newValue;
        });
    };

    return (
        <div className={`p-6 ${GlobalStyle.fontPoppins}`}>
            <h1 className={GlobalStyle.headingLarge} >Incident Register</h1>
            <div className="flex justify-center">
                <div className={`${GlobalStyle.cardContainer} mt-4`}>
                    <h2 className={`${GlobalStyle.headingMedium} mb-6 `}>Incident Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex gap-4">
                            <label htmlFor="accountNo" className="w-[150px]">Account No</label>
                            <input
                                id="accountNo"
                                type="text"
                                value={accountNo}
                                onChange={(e) => setAccountNo(e.target.value)}
                                className={GlobalStyle.inputText}
                            />
                        </div>
                        <div className="flex gap-4">
                            <label htmlFor="actionType" className="w-[150px]">Action</label>
                            <select
                                id="actionType"
                                value={actionType}
                                onChange={(e) => setActionType(e.target.value)}
                                className={GlobalStyle.selectBox}
                            >
                                <option value="">Action Type</option>
                                <option value="option1">Action Type 1</option>
                                <option value="option2">Action Type 2</option>
                                <option value="option3">Action Type 3</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <label className="whitespace-nowrap w-[150px]">Calendar Month</label>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleMonthChange(false)}
                                    className={GlobalStyle.buttonPrimary}
                                >
                                    -
                                </button>
                                <span className="w-8 text-center">{calendarMonth}</span>
                                <button
                                    type="button"
                                    onClick={() => handleMonthChange(true)}
                                    className={GlobalStyle.buttonPrimary}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <label htmlFor="fromDate" className="whitespace-nowrap w-[150px]">
                                Closing Date
                            </label>
                            <DatePicker
                                id="fromDate"
                                selected={fromDate}
                                onChange={handleFromDateChange}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/MM/yyyy"
                                className={GlobalStyle.inputText}
                            />
                            {errors.fromDate && (
                                <span className={GlobalStyle.errorText}>{errors.fromDate}</span>
                            )}
                        </div>
                        <div className="pt-4">
                            <button type="submit" className={GlobalStyle.buttonPrimary}>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Incident_Register_Individual;
