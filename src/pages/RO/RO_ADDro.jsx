import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import gmailIcon from "../../assets/images/google.png";

const rtomAreaOptions = ["GM", "KU", "SL", "WM"];

export default function RO_ADDro() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemType: initialItemType, itemData } = location.state || {};

  const [userType, setUserType] = useState(initialItemType || "RO");
  const [contactNo, setContactNo] = useState(itemData?.contact_no || "");
  const [email, setEmail] = useState(itemData?.email || "");
  const [remark, setRemark] = useState(itemData?.remark || "");
  const [status, setStatus] = useState(itemData?.status ?? true);
  const [rtomAreas, setRtomAreas] = useState(itemData?.rtom_areas || []);
  const [selectedRtomArea, setSelectedRtomArea] = useState("");

  useEffect(() => {
    if (initialItemType && itemData) {
      setUserType(initialItemType);
      setContactNo(itemData.contact_no || "");
      setEmail(itemData.email || "");
      setRemark(itemData.remark || "");
      setStatus(itemData.status ?? true);
      if (initialItemType === "RO") {
        setRtomAreas(itemData.rtom_areas || []);
      }
    }
  }, [initialItemType, itemData]);

  const handleSave = () => {
    const updatedData = {
      ...itemData,
      contact_no: contactNo,
      email: email,
      remark: remark,
      status: status,
      ...(userType === "RO" && { rtom_areas: rtomAreas }),
    };
    console.log("Saved Data:", updatedData);
    // API call to save data here
    navigate(-1);
  };

  const toggleStatus = () => {
    setStatus((prev) => !prev);
  };

  const handleAddRtomArea = () => {
    if (
      selectedRtomArea &&
      !rtomAreas.some((area) => area.name === selectedRtomArea)
    ) {
      setRtomAreas([...rtomAreas, { name: selectedRtomArea }]);
      setSelectedRtomArea("");
    }
  };

  const handleRemoveRtomArea = (index) => {
    const newAreas = [...rtomAreas];
    newAreas.splice(index, 1);
    setRtomAreas(newAreas);
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h2 className={GlobalStyle.headingLarge}>
        {userType === "RO" ? "Register Recovery Officer" : "Register DRC User"}
      </h2>
      <h2 className={`${GlobalStyle.headingMedium} pl-10`}>
        DRC Name : {itemData?.drc_name || "ABC company"}
      </h2>

      <div className="flex gap-4 mt-4 justify-center">
        <div className={`${GlobalStyle.cardContainer} relative`}>
          <div className="table">
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-semibold">
                User Type
              </div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">
                <select
                  className={GlobalStyle.selectBox}
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="RO">RO</option>
                  <option value="drcUser">DRC User</option>
                </select>
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell px-4 py-2 font-semibold">
                {userType === "drcUser"
                  ? "DRC User Name"
                  : "Recovery Officer Name"}
              </div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">
                <input
                  type="text"
                  className={`${GlobalStyle.inputText} w-[150px]`}
                />
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell px-4 py-2 font-semibold">
                {userType === "drcUser" ? "DRC Coordinator NIC" : "RO NIC"}
              </div>
              <div className="table-cell px-4 py-2 font-semibold">:</div>
              <div className="table-cell px-4 py-2">
                <input
                  type="text"
                  className={`${GlobalStyle.inputText} w-[150px]`}
                />
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Login method</div>
            </div>

            <div className="table-row">
              <div className="table-cell px-4 py-2 pl-8 font-semibold">
                Contact Number
              </div>
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
          </div>

          {userType === "RO" && (
            <>
              <br />

              <div className="table-row">
                <div className="table-cell px-4 py-2 font-semibold">
                  RTOM Area
                </div>
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
                        .filter(
                          (option) =>
                            !rtomAreas.some((area) => area.name === option)
                        )
                        .map((option) => (
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

              <div className={GlobalStyle.tableContainer}>
                <table className={`${GlobalStyle.table} w-[320px] mt-4`}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th className={GlobalStyle.tableHeader}>RTOM Area</th>
                      <th className={GlobalStyle.tableHeader}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rtomAreas.map((area, index) => (
                      <tr key={index}>
                        <td className={`${GlobalStyle.tableData} text-center`}>
                          {area.name}
                        </td>
                        <td className={`${GlobalStyle.tableData} text-center`}>
                          <button
                            onClick={() => handleRemoveRtomArea(index)}
                            className={`${GlobalStyle.buttonDanger} w-6 h-6 text-center`}
                          >
                            -
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="flex justify-end p-4">
            <button className={GlobalStyle.buttonPrimary} onClick={handleSave}>
              {userType === "RO" ? "Add RO" : "Add "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
