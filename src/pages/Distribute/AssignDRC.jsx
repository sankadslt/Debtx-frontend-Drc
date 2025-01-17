/* Purpose: This template is used for the 1.A.12 - Assign DRC page.
Created Date: 2025-01-07
Created By: Geeth (eshaneperera@gmail.com)
Last Modified Date: 2025-01-07
Modified By: Geeth(eshaneperera@gmail.com)
Version: node 20
ui number : 1.A.12
Dependencies: tailwind css
Related Files: (routes)
Notes: This page includes a case count bar, filter , table and a pie chart  */

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import { FaSearch } from "react-icons/fa";

// Register necessary components for Chart.js pie chart
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const PieChart = () => {
  // Data for Pie Chart
  const pieChartData = {
    labels: ["CMS", "TCM", "RE", "CO LAN", "ACCIVA", "VISONCOM", "PROMPT"],
    datasets: [
      {
        data: [3000, 2000, 1500, 2500, 1200, 900, 2000],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF99FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF99FF",
        ],
      },
    ],
  };

  return (
    <div className="w-1/3 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-[0px] text-center">
        Last 3 Months DRC Success
      </h2>
      <div className="chart-container mt-[-10px]">
        <Pie data={pieChartData} />
      </div>
    </div>
  );
};

const AssignDRC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [drcData, setDrcData] = useState([
    { id: 1, name: "CMS", amount: 1000 },
    { id: 2, name: "TCM", amount: 1200 },
    { id: 3, name: "RE", amount: 900 },
    { id: 4, name: "CO LAN", amount: 1400 },
  ]);
  const [newEntry, setNewEntry] = useState({
    arrearsBand: "",
    drc: "",
    casesAmount: "",
  });

  //search fuction 
  const filteredSearchData = drcData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const location = useLocation();
  const navigate = useNavigate();

  const { serviceType } = location.state || {};

  const handleEdit = (id) => {
    setEditMode(id);
  };

  const handleSave = (id) => {
    setEditMode(null);
  };

  const handleChange = (e, field, id) => {
    const updatedData = drcData.map((drc) =>
      drc.id === id ? { ...drc, [field]: e.target.value } : drc
    );
    setDrcData(updatedData);
  };

  const handleProceed = () => {
    navigate("/pages/Distribute/AssignedDRCSummary");
  };

  const handleAdd = () => {
    const { arrearsBand, drc, casesAmount } = newEntry;
    if (arrearsBand && drc && casesAmount) {
      setDrcData([
        ...drcData,
        { id: drcData.length + 1, name: drc, amount: parseFloat(casesAmount) },
      ]);
      setNewEntry({ arrearsBand: "", drc: "", casesAmount: "" }); // Clear inputs
    }
  };

  const totalDistributedAmount = drcData.reduce(
    (total, drc) => total + parseFloat(drc.amount),
    0
  );

  return (
    <div className={`${GlobalStyle.fontPoppins} flex flex-col h-screen`}>
      {/* Main Content */}
      <div className="flex-1 p-10">
        {/* Assign DRC Heading */}
        <h1 className={`${GlobalStyle.headingLarge}`}>Assign DRC</h1>

        <h3 className={`${GlobalStyle.headingMedium} mb-5`}>
          Service Type: {serviceType || "PEO-TV"}
        </h3>

        {/* Pending Cases */}
        <div className={`${GlobalStyle.caseCountBar}`}>
          <div className="flex">
            <span className={GlobalStyle.countBarTopic}>Pending Cases</span>
          </div>
          <div className={GlobalStyle.countBarSubTopicContainer}>
            <div className={GlobalStyle.countBarMainBox}>
              <span>Total:</span>
              <p className={GlobalStyle.countBarMainTopic}>1259</p>
            </div>
            <div className={GlobalStyle.countBarSubBox}>
              <span>5,000 - 10,000</span>
              <p className={GlobalStyle.countBarSubTopic}>100</p>
            </div>
            <div className={GlobalStyle.countBarSubBox}>
              <span>10,000 - 25,000</span>
              <p className={GlobalStyle.countBarSubTopic}>250</p>
            </div>
            <div className={GlobalStyle.countBarSubBox}>
              <span>25,000 - 50,000</span>
              <p className={GlobalStyle.countBarSubTopic}>800</p>
            </div>
            <div className={GlobalStyle.countBarSubBox}>
              <span>50,000 - 100,000</span>
              <p className={GlobalStyle.countBarSubTopic}>61</p>
            </div>
            <div className={GlobalStyle.countBarSubBox}>
              <span>&gt; 100,000</span>
              <p className={GlobalStyle.countBarSubTopic}>98</p>
            </div>
          </div>
        </div>

        {/* Service Type and Table */}
        <div className="relative">
          <div className="flex items-center my-10 space-x-4">
            {/* Arrears Band Dropdown */}
            <select
              className={`${GlobalStyle.selectBox}`}
              value={newEntry.arrearsBand}
              onChange={(e) =>
                setNewEntry({ ...newEntry, arrearsBand: e.target.value })
              }
            >
              <option value="" disabled>
                Arrears Band
              </option>
              <option>5,000 - 10,000</option>
              <option>10,000 - 25,000</option>
              <option>25,000 - 50,000</option>
              <option>50,000 - 100,000</option>
              <option>&gt;100,000</option>
            </select>

            {/* DRC Dropdown */}
            <select
              className={`${GlobalStyle.selectBox}`}
              value={newEntry.drc}
              onChange={(e) =>
                setNewEntry({ ...newEntry, drc: e.target.value })
              }
            >
              <option value="" disabled>
                DRC
              </option>
              <option>CMS</option>
              <option>TCM</option>
              <option>RE</option>
              <option>CO LAN</option>
              <option>ACCIVA</option>
              <option>VISONCOM</option>
              <option>PROMPT</option>
            </select>

            {/* Input for "+ cases" */}
            <input
              type="number"
              placeholder="+ cases"
              className="py-1 px-4 w-32 border-2 border-[#0056A2] rounded-lg bg-[#057DE8] bg-opacity-10"
              min="0"
              value={newEntry.casesAmount}
              onChange={(e) =>
                setNewEntry({ ...newEntry, casesAmount: e.target.value })
              }
            />

            {/* Add Button */}
            <button
              className={`${GlobalStyle.buttonPrimary} w-[135px]`}
              onClick={handleAdd}
            >
              Add
            </button>
            <div className="flex-grow text-right">
            <div className="flex justify-end">
            <div
            className={`${GlobalStyle.countBarMainBox}`}
            style={{ width: "160px", textAlign: "center" }}
            >
                  Count: {totalDistributedAmount}
               </div>
             </div>
            </div>
           </div>

           <div className="flex">
            {/* Table */}
             <div className="flex flex-col w-2/3">
              <div className="flex justify-start mb-4">
                <div className={GlobalStyle.searchBarContainer}>
                  <input
                    type="text"
                    placeholder=""
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={GlobalStyle.inputSearch}
                  />
                  <FaSearch className={GlobalStyle.searchBarIcon} />
                </div>
              </div>{" "}
              <div className={`${GlobalStyle.tableContainer} `}>
                <table
                  className={`${GlobalStyle.table}`}
                  aria-labelledby="drc-table"
                >
                  <thead className={`${GlobalStyle.thead}`}>
                    <tr>
                      <th
                        scope="col"
                        className={`${GlobalStyle.tableHeader}`}
                        aria-label="DRC Name"
                      >
                        DRC Name
                      </th>
                      <th
                        scope="col"
                        className={`${GlobalStyle.tableHeader}`}
                        aria-label="Distributed Amount (LKR)"
                      >
                        Distributed Amount
                      </th>
                      <th
                        scope="col"
                        className={`${GlobalStyle.tableHeader} text-center`}
                        aria-label="Action"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSearchData.length > 0 ? (
                      filteredSearchData.map((drc, index) => (
                        <tr
                          key={drc.id}
                          className={
                            index % 2 === 0
                              ? GlobalStyle.tableRowEven
                              : GlobalStyle.tableRowOdd
                          }
                          aria-rowindex={drc.id}
                        >
                          <td className={GlobalStyle.tableData}>
                            {editMode === drc.id ? (
                              <select
                                value={drc.name}
                                onChange={(e) =>
                                  handleChange(e, "name", drc.id)
                                }
                                className={`${GlobalStyle.selectBox}`}
                                aria-label="Select DRC Name"
                              >
                                <option>CMS</option>
                                <option>TCM</option>
                                <option>RE</option>
                                <option>CO LAN</option>
                                <option>ACCIVA</option>
                                <option>VISONCOM</option>
                                <option>PROMPT</option>
                              </select>
                            ) : (
                              drc.name
                            )}
                          </td>
                          <td className={GlobalStyle.tableData}>
                            {editMode === drc.id ? (
                              <input
                                type="number"
                                className={`${GlobalStyle.inputText}`}
                                value={drc.amount}
                                onChange={(e) =>
                                  handleChange(e, "amount", drc.id)
                                }
                                aria-label="Enter Distributed Amount"
                              />
                            ) : (
                              drc.amount
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {editMode === drc.id ? (
                              <button
                                className={`${GlobalStyle.buttonPrimary}`}
                                onClick={() => handleSave(drc.id)}
                                aria-label="Save Changes"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                className={`${GlobalStyle.buttonPrimary}`}
                                onClick={() => handleEdit(drc.id)}
                                aria-label="Edit Row"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-6 text-center">
                          No data available.
                        </td>
                      </tr>
                    )}
                    <tr className="bg-[#F7F8FC]">
                      <td
                        colSpan="3"
                        className={"text-center font-semibold py-6"}
                      >
                        Total Count: {totalDistributedAmount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pie Chart */}
            <PieChart />
          </div>

          {/* Proceed Button */}
          <div className="text-right">
            <button
              onClick={handleProceed}
              className={`${GlobalStyle.buttonPrimary}`}        
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDRC;
