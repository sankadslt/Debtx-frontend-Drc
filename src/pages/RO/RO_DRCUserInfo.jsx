import React from 'react'
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { List_RO_Info_Own_By_RO_Id } from "../../services/Ro/RO.js";
import Swal from 'sweetalert2';

export default function RO_DRCUserInfo() {

  const location = useLocation();
  const { itemType, itemData } = location.state || {};
  const [activeUserType, setActiveUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* FOR testing*/
  console.log("item Data :", itemData);
  if (itemType === "RO") {

    console.log("item Data ro id:", itemData.ro_id)
  } else if (itemType === "drcUser") {
    console.log("item Data drcuser id:", itemData.drcUser_id)
  }

 

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (itemType) {
      setActiveUserType(itemType);
    }
  }, [itemType]);



  const fetchData = async () => {
    if (itemData) {
      try {
        

        let payload = {};
        if (activeUserType === "RO") {
          payload = { ro_id: itemData.ro_id };
        } else if (activeUserType === "drcUser") {
          payload = { drcUser_id: itemData.drcUser_id };
        }
        console.log("eddfefrg");
        console.log("Payload sent to API: ", payload);
        setIsLoading(true);

        const response = await List_RO_Info_Own_By_RO_Id(payload).catch((error) => {
          if (error.response && error.response.status === 404) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found for the selected filters.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false,
            });

   
            setUserData([]);
            return null;
          } else {
            throw error;
          }
        });

        console.log("Response from API:", response);
        setIsLoading(false);

        if (response && response.data) {
          const list = response.data;
         
          setUserData(list);
        } else {
          console.error("No valid data found in response:", response);
        }
      } catch (error) {
        console.error("Error filtering cases:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch filtered data. Please try again.",
          icon: "error",
        });
      }
    }
  };

  useEffect(() => {
    if (activeUserType && itemData) {
      fetchData();
    }
  }, [activeUserType, itemData]);


 
  console.log("drc ||  RO user DATA:", userData);

  useEffect(() => {
    // Reset states on first mount
    return () => {
      setActiveUserType("");
      setUserData(null);
      
      setIsLoading(false);
    };
  }, []);





  const navigate = useNavigate();

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h2 className={GlobalStyle.headingLarge}>{activeUserType === "drcUser" ? "DRC User" : "Recovery Officer"}</h2>


      {/* Case details card */}
      <div className="flex gap-4 mt-4 justify-center">
        <div className={`${GlobalStyle.cardContainer}`}>
          <div className="table">
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Added Date</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2">{userData?.added_date || 'null'}</div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">{activeUserType === "drcUser" ? "DRC User Name" : "Recovery Officer Name"}</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2">{userData?.drcUser_name || userData?.recovery_officer_name || 'null'}</div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">NIC</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2">{userData?.nic || 'null'}</div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 ">Login Method</div>

            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Contact No</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2">{userData?.contact_no || 'null'}</div>
            </div>



            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Email</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2">{userData?.email || 'null'}</div>
            </div>



          </div>



          {activeUserType !== "drcUser" && userData?.rtom_areas && (
            <div>
              <div className="table-row">
                <div className="table-cell px-4 py-2 font-bold">RTOM Areas</div>
                <div className="table-cell px-4 py-2 font-bold">:</div>
                <div className="table-cell px-4 py-2" />
              </div>

              <div className={GlobalStyle.tableContainer}>
                <table className={GlobalStyle.table}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th className={GlobalStyle.tableHeader}>RTOM Area</th>
                      <th className={GlobalStyle.tableHeader}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.rtom_areas.length > 0 ? (
                      userData.rtom_areas.map((area, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0
                              ? GlobalStyle.tableRowEven
                              : GlobalStyle.tableRowOdd
                          }
                        >
                          <td className={`${GlobalStyle.tableData} text-center pt-6`}>
                            {area.name}
                          </td>
                          <td className={`${GlobalStyle.tableData} text-center`}>
                            <div className="flex items-center justify-center gap-2">
                              {/* Toggle */}
                              <div
                                className={`inline-block w-11 h-6 rounded-full transition-colors ${area.status ? "bg-green-500" : "bg-gray-400"
                                  } relative`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full bg-white absolute top-[2px] transition-all ${area.status ? "left-[26px]" : "left-[2px]"
                                    }`}
                                />
                              </div>

                              {/* Status Label */}
                              <span
                                className={`text-sm font-semibold ${area.status ? "text-green-600" : "text-gray-500"
                                  }`}
                              >
                                {area.status ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="text-center py-4">
                          No RTOM areas available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}


        </div>
      </div>
      <div>
        <div className="flex justify-end mt-6">
          <button className={GlobalStyle.buttonPrimary} /* onClick={HandleAddDRC} */>
            End
          </button>
        </div>

      </div>
      <div>


        <div className="flex justify-start mt-6">
          <button className={GlobalStyle.buttonPrimary} /* onClick={HandleAddDRC} */>
            Log History
          </button>
        </div>

      </div>

      <div className="pt-10 pb-10">
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
              {userData?.log_history && userData.log_history.length > 0 ? (
                userData.log_history.map((log, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? GlobalStyle.tableRowEven
                        : GlobalStyle.tableRowOdd
                    }
                  >
                    <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
                      {log.edited_on}
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
      <div>
        <button onClick={() => navigate(-1)} className={GlobalStyle.buttonPrimary}>
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
}
