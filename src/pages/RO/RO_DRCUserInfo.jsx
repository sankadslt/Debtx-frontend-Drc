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

  //console.log("item Data:",itemData.drcUser_id)
  //console.log("item type:", itemType)

  const [roData, setRoData] = useState([]);
  const [drcData, setDrcData] = useState([]);



  useEffect(() => {
    if (itemType) {
      setActiveUserType(itemType);
    }
  }, [itemType]);


  useEffect(() => {
    const fetchData = async () => {
      if (itemData) {
        try {
          let payload = {}; // define here to avoid scope issues

          if (activeUserType === "RO") {
            payload = {
              ro_id: itemData.ro_id,
            };
          } else if (activeUserType === "drcUserId") {
            payload = {
              drcUser_id: itemData.drcUser_id,
            };
          }

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

              if (activeTab === "RO") {
                setRoData([]);
              } else {
                setDrcData([]);
              }

              return null;
            } else {
              throw error;
            }
          });

          console.log("Response from API:", response);
          setIsLoading(false);

          if (response && response.data) {
            const list = response.data;
            console.log("Valid data received:", list);
            // TODO: Set this list to state as needed
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

    fetchData();
  }, [itemData]); // Ensure dependencies are correct










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
              <div className="table-cell px-4 py-2"></div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">{activeUserType === "drcUser" ? "DRC User Name" : "Recovery Officer Name"}</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2"></div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">NIC</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2"></div>
            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 ">Login Method</div>

            </div>
            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Contact No</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2">

              </div>
            </div>



            <div className="table-row">
              <div className="table-cell px-4 py-2 font-bold">Email</div>
              <div className="table-cell px-4 py-2 font-bold">:</div>
              <div className="table-cell px-4 py-2">

              </div>
            </div>



          </div>



          {activeUserType !== "drcUser" && (

            <div>

              <div className="table-row">
                <div className="table-cell px-4 py-2 font-bold">RTOM Areas</div>
                <div className="table-cell px-4 py-2 font-bold">:</div>
                <div className="table-cell px-4 py-2">

                </div>
              </div>


              <div className={GlobalStyle.tableContainer}>
                <table className={GlobalStyle.table}>
                  <thead className={GlobalStyle.thead}>
                    <tr >
                      <th className={GlobalStyle.tableHeader}>RTOM Area</th>

                      <th className={GlobalStyle.tableHeader}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {drcFilteredDataBySearch && drcFilteredDataBySearch.length > 0 ? (
                  drcFilteredDataBySearch.map((item, index) => ( */}
                    <tr
                    /*  key={item.drc_id || index}
                     className={
                       index % 2 === 0
                         ? GlobalStyle.tableRowEven
                         : GlobalStyle.tableRowOdd
                     } */
                    >
                      <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
                        AD
                      </td>
                      <td className={`${GlobalStyle.tableData} `}>

                      </td>

                    </tr>

                    <tr>

                      <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
                        GM
                      </td>
                      <td className={`${GlobalStyle.tableData} `}>

                      </td>

                    </tr>

                    <tr>

                      <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>
                        KU
                      </td>
                      <td className={`${GlobalStyle.tableData} `}>

                      </td>

                    </tr>


                    {/* ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">No cases available</td>
                  </tr>
                )} */}
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

      <div className='pt-10 pb-10'>
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr >
                <th className={GlobalStyle.tableHeader}>Edited On</th>
                <th className={GlobalStyle.tableHeader}>Action</th>
                <th className={GlobalStyle.tableHeader}>Edited By</th>
              </tr>
            </thead>
            <tbody>
              {/* {drcFilteredDataBySearch && drcFilteredDataBySearch.length > 0 ? (
                  drcFilteredDataBySearch.map((item, index) => ( */}
              <tr
              /*  key={item.drc_id || index}
               className={
                 index % 2 === 0
                   ? GlobalStyle.tableRowEven
                   : GlobalStyle.tableRowOdd
               } */
              >

                <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>

                </td>
                <td className={`${GlobalStyle.tableData} `}>

                </td>
              </tr>

              <tr>

                <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>

                </td>
                <td className={`${GlobalStyle.tableData} `}>

                </td>

              </tr>

              <tr>

                <td className={`${GlobalStyle.tableData} flex justify-center items-center pt-6`}>

                </td>
                <td className={`${GlobalStyle.tableData} `}>

                </td>

              </tr>


              {/* ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">No cases available</td>
                  </tr>
                )} */}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <button
          onClick={() => navigate(-1)}
          className={`${GlobalStyle.buttonPrimary} `}
        >
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
}
