import { useEffect, useState, useRef } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { getLoggedUserId } from "../../services/auth/authService";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import moreImg from "../../assets/images/more-info.svg";
import { Tooltip } from "react-tooltip";
import { FaPhone } from "react-icons/fa";
import { Create_Pre_Negotiation } from "../../services/Drc/Drc";

// List_Pre_Negotiation_By_Case_Id;

// import {
//   listDRCPhaseCaseDetails,
//   updateDRCSubmission,
// } from "../../services/drc/drcService";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { List_Pre_Negotiation_By_Case_Id } from "../../services/Drc/Drc";

export const Pre_Negotiation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const case_id = location.state?.CaseID || "";
  const account_no = location.state?.Account_no || "10";
  const [selectedRowData, setSelectedRowData] = useState(null); // New state for selected row
  // console.log("Caseid :", case_id);
  // console.log("account_no :", account_no);
  const [activeWithdrawPopupLODID, setActiveWithdrawPopupLODID] =
    useState(null);

  const [userId, setUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [caseDetails, setCaseDetails] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState("");
  const [remark, setRemark] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [filteredData, setFilteredData] = useState([]);
  // const [filteredDataBySearch, setFilteredDataBySearch] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true); // State to track if more data is available
  const rowsPerPage = 10; // Number of rows per page

  // variables need for table
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const hasMounted = useRef(false);
  const [committedFilters, setCommittedFilters] = useState({
    // case_id: case_id,
    fromDate: null,
    toDate: null,
  });

  // Role-Based Buttons
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        refreshAccessToken().then((newToken) => {
          if (!newToken) return;
          const newDecoded = jwtDecode(newToken);
          setUserRole(newDecoded.role);
        });
      } else {
        setUserRole(decoded.role);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  // handle search
  const filteredDataBySearch = paginatedData.filter(
    (row) => Object.values(row).join(" ").toLowerCase()
    // .includes(searchQuery.toLowerCase())
  );

  // useEffect(() => {
  //   const fetchCaseDetails = async () => {
  //     setLoading(true);
  //     try {
  //       const response = "";
  //       // const response = await listDRCPhaseCaseDetails(case_id);

  //       if (response.success) {
  //         setCaseDetails(response.data);
  //         console.log(response.data);
  //       } else {
  //         console.error(response.message);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching case details:", err);
  //     }
  //     setLoading(false);
  //   };

  //   fetchCaseDetails();
  // }, [case_id]);

  const callAPI = async (filters) => {
    try {
      // // Format the date to 'YYYY-MM-DD' format
      // const formatDate = (date) => {
      //   if (!date) return null;
      //   const offsetDate = new Date(
      //     date.getTime() - date.getTimezoneOffset() * 60000
      //   );
      //   return offsetDate.toISOString().split("T")[0];
      // };

      console.log(currentPage);

      // Fetch user ID
      const userId = await getLoggedUserId();
      if (!userId) {
        Swal.fire("Error", "User not authenticated. Please log in.", "error");
        return;
      }

      const payload = {
        case_id: filters.case_id,
        // logged_in_user: userId,
        // from_date: formatDate(filters.fromDate),
        // to_date: formatDate(filters.toDate),
        pages: filters.currentPage,
      };
      console.log("Payload sent to API: ", payload);

      setIsLoading(true); // Set loading state to true
      const response = await List_Pre_Negotiation_By_Case_Id(payload);
      setIsLoading(false); // Set loading state to false

      // Updated response handling
      if (response && response.data) {
        console.log("Valid data received:", response.data);

        if (currentPage === 1) {
          setFilteredData(response.data); // Set initial data for page 1
        } else {
          // setFilteredData(response.data);

          setFilteredData((prevData) => [...prevData, ...response.data]);
        }

        // setFilteredData((prevData) => [...prevData, ...response.data]);

        if (response.data.length === 0) {
          setIsMoreDataAvailable(false); // No more data available
          if (currentPage === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found for the selected filters.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor: "#f1c40f",
            });
          } else if (currentPage === 2) {
            setCurrentPage(1);
          }
        } else {
          const maxData = currentPage === 1 ? 10 : 30;
          if (response.data.length < maxData) {
            setIsMoreDataAvailable(false); // More data available
          }
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid taskslist data found in response.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    // if (!hasMounted.current) {
    //   hasMounted.current = true;
    //   return;
    // }

    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max current page
      // callAPI(); // Call the function whenever currentPage changes
      callAPI({
        ...committedFilters,
        currentPage: currentPage,
      });
      // callAPI({
      //   case_id,
      //   currentPage,
      // });
    }
  }, [currentPage]);

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // console.log("Current Page:", currentPage);
    } else if (direction === "next") {
      if (isMoreDataAvailable) {
        setCurrentPage(currentPage + 1);
      } else {
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        setTotalPages(totalPages);
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      }
      // console.log("Current Page:", currentPage);
    }
  };

  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const user = await getLoggedUserId();
  //       setUserId(user);
  //       console.log("User: ", user);
  //     } catch (err) {
  //       console.error("Error loading user:", err);
  //     }
  //   };

  //   loadUser();
  // }, []);

  const handleSubmit = async () => {
    try {
      if (!selectedSubmission || !remark) {
        Swal.fire(
          "Error",
          "Please enter both Customer Response and Remark",
          "error"
        );
        return;
      }
      const userData = await getLoggedUserId();
      if (!userData) {
        Swal.fire("Error", "User not authenticated. Please log in.", "error");
        return;
      }

      const payload = {
        case_id: case_id,
        call_inquiry_remark: remark,
        call_topic: selectedSubmission,
        case_phase: "Negotiaition",
        created_by: userData?.user_id,
        drc_id: userData?.drc_id,
      };
      console.log("Payload sent by submit: ", { payload });

      setIsLoading(true);
      const response = await Create_Pre_Negotiation(payload);
      setIsLoading(false);
      // console.log(response)
      if (response === "success") {
        Swal.fire({
          title: "Success",
          text: "Case withdrawal request added successfully!", // Change to "withdrawal" if intended
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            // setFilteredData([]); // Clear previous data when LODType changes
            setMaxCurrentPage(0); // Reset the current page
            console.log(currentPage);

            console.log("data: ", filteredDataBySearch);
            if (currentPage === 1) {
              callAPI({
                case_id,
                currentPage: 1,
              });
            } else {
              // callAPI({
              //   case_id,
              //   currentPage,
              // });
              setCurrentPage(1); // Reset to the first page if LODType changes
            }
          }
        });
        setSelectedSubmission("");
        setRemark("");
        // isLoading(true);
      } else {
        Swal.fire(
          "Error",
          `Failed to submit withdrawal request: ${response.message}`,
          "error"
        );
      }
    } catch (err) {
      console.error("Error submitting DRC response:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleWithdrawPopup = (seq) => {
    const rowData = filteredDataBySearch.find((item) => item.seq === seq);
    setSelectedRowData(rowData);
    setActiveWithdrawPopupLODID(seq);
    // setWithdrawRemark("");
  };

  const closeWithdrawPopup = () => {
    setActiveWithdrawPopupLODID(null);
    setSelectedRowData(null);
  };

  const handleBackButton = () => {
    navigate("/drc/assigned-case-list-for-drc");
  };

  // display loading animation when data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Your component JSX goes here */}
      {/* Card */}
      {/* <div className="flex flex-col w-full items-center justify-center">
        <div className={`${GlobalStyle.cardContainer} w-full`}>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            [
              { label: "Case ID", value: case_id },
              { label: "Account No", value: caseDetails?.account_no },
              {
                label: "Contact Details",
                value: caseDetails?.contact_details,
              },
            ].map((item, index) => (
              <p key={index} className="mb-2 flex items-center">
                <strong className="w-40 text-left">{item.label}</strong>
                <span className="w-6 text-center">:</span>
                <span className="flex-1">{item.value || "N/A"}</span>
              </p>
            ))
          )}
        </div>
      </div> */}

      {/* Title */}
      <h2 className={GlobalStyle.headingLarge}>Pre Negotiation</h2>

      {/* </div> */}
      <div className="flex flex-col md:flex-row gap-4 w-full items-start">
        {/* Account Details Card */}
        <div className="flex-1 mb-4 w-full">
          <div
            className={`${GlobalStyle.cardContainer} flex-1 min-h-[330px] w-full`}
          >
            <div className="flex flex-col w-full">
              <div className="flex flex-col sm:flex-row sm:items-center px-4 py-2">
                <div className="font-bold w-full sm:w-40">Case ID</div>
                <div className="px-4 py-2 sm:w-10">:</div>
                <div className="px-4 py-2 flex-1">{case_id}</div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center px-4 py-2">
                <div className="font-bold w-full sm:w-40">Account Number</div>
                <div className="px-4 py-2 sm:w-10">:</div>
                <div className="px-4 py-2 flex-1">{account_no}</div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center px-4 py-2">
                <div className="font-bold w-full sm:w-40">Contact Number</div>
                <div className="px-4 py-2 sm:w-10">:</div>
                <div className="px-4 py-2 flex-1"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Form Card */}
        <div
          className={`${GlobalStyle.cardContainer} flex-1 min-h-[300px] w-full`}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-start mb-4 w-full">
            <label className="w-full sm:w-56">Call Negotiation</label>
            <select
              className={`${GlobalStyle.selectBox} w-full sm:w-auto`}
              value={selectedSubmission}
              onChange={(e) => setSelectedSubmission(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Legal Accepted">Legal Accepted</option>
              <option value="Legal Rejected">Legal Rejected</option>
            </select>
          </div>
          {/* Remark */}
          <div className="flex flex-col gap-2 justify-start mb-4 w-full">
            <label>Remark:</label>
            <textarea
              className={`${GlobalStyle.inputText} h-40 w-full`}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
          {/* Submit */}
          <div className="flex w-full justify-end">
            <button
              className={GlobalStyle.buttonPrimary}
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit
            </button>
          </div>
          {error && (
            <div className="mt-2 text-end">
              <span className="text-red-500 text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1">
        <div
          className={`${GlobalStyle.tableContainer} mt-0 overflow-x-auto flex-1`}
        >
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>
                  Call Inquiry Sequence
                </th>
                <th className={GlobalStyle.tableHeader}>Remark</th>
                <th className={GlobalStyle.tableHeader}>Call Topic</th>

                <th className={GlobalStyle.tableHeader}>Created Date</th>
                <th className={GlobalStyle.tableHeader}></th>
              </tr>
            </thead>

            <tbody>
              {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
                filteredDataBySearch.map((item, index) => (
                  <tr
                    key={item.settlement_id || index}
                    className={
                      index % 2 === 0
                        ? GlobalStyle.tableRowEven
                        : GlobalStyle.tableRowOdd
                    }
                  >
                    {/* <td
                    className={`${GlobalStyle.tableData}  text-black hover:underline cursor-pointer`}
                    onClick={() => naviCaseID(item.case_id)}
                  >
                    {item.task_id || "N/A"}
                  </td> */}

                    <td className={GlobalStyle.tableData}>
                      {" "}
                      {item.seq || "N/A"}{" "}
                    </td>
                    <td className={GlobalStyle.tableData}>
                      {" "}
                      {item.call_inquiry_remark || "N/A"}{" "}
                    </td>
                    <td className={GlobalStyle.tableData}>
                      {" "}
                      {item.call_topic || "N/A"}{" "}
                    </td>
                    {/* <td className={GlobalStyle.tableData}>
                    {" "}
                    {item.Created_By || "N/A"}{" "}
                  </td> */}
                    <td className={GlobalStyle.tableData}>
                      {new Date(item.created_date).toLocaleDateString(
                        "en-GB"
                      ) || "N/A"}
                      ,{" "}
                      {new Date(item.created_date)
                        .toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })
                        .toUpperCase()}
                    </td>
                    <td className={GlobalStyle.tableData}>
                      {/* <div className="px-8 flex items-center gap-2">
                          <FaPhone
                            onClick={() => handleWithdrawPopup(item.case_id)}
                            style={{ cursor: "pointer", marginRight: "8px" }}
                          />
                        </div> */}
                      <button
                        onClick={() => handleWithdrawPopup(item.seq)}
                        className="p-2 hover:bg-gray-100 rounded flex items-center justify-center"
                        //title="More Info"
                      >
                        <img
                          src={moreImg}
                          alt="More Info"
                          className="h-auto w-5 max-w-[24px]"
                          data-tooltip-id="more-info-tooltip"
                        />
                        <Tooltip
                          id="more-info-tooltip"
                          place="bottom"
                          content="More Info"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className={`${GlobalStyle.tableData} text-center`}
                  >
                    No cases available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Section */}
        {filteredDataBySearch.length > 0 && (
          <div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={() => handlePrevNext("prev")}
              disabled={currentPage <= 1}
              className={`${GlobalStyle.navButton} ${
                currentPage <= 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <FaArrowLeft />
            </button>
            <span className={`${GlobalStyle.pageIndicator} mx-4`}>
              Page {currentPage}
            </span>
            <button
              onClick={() => handlePrevNext("next")}
              disabled={currentPage === totalPages}
              className={`${GlobalStyle.navButton} ${
                currentPage === totalPages ? "cursor-not-allowed" : ""
              }`}
            >
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>

      {activeWithdrawPopupLODID && selectedRowData && (
        <div className={GlobalStyle.popupBoxContainer}>
          <div className={GlobalStyle.popupBoxBody}>
            <div className={GlobalStyle.popupBox}>
              <h2 className={GlobalStyle.popupBoxTitle}>More Information</h2>
              <button
                className={GlobalStyle.popupBoxCloseButton}
                onClick={() => closeWithdrawPopup()}
              >
                ×
              </button>
            </div>
            <div>
              {/* Company Details Section */}
              <h2
                className={`${GlobalStyle.headingMedium} mb-4 sm:mb-6 mt-6 sm:mt-8 underline text-left font-semibold`}
              >
                Pre Negotiation Details
              </h2>
              <table className={`${GlobalStyle.table} w-full text-left`}>
                <tbody className="space-y-2 sm:space-y-0">
                  {[
                    {
                      label: "Call Topic",
                      value: selectedRowData.call_topic || "Not specified",
                    },
                    {
                      label: "Case Phase",
                      value: selectedRowData.phase || "Not specified",
                    },
                    {
                      label: "Created By",
                      value: selectedRowData.created_by || "Not specified",
                    },
                    {
                      label: "DRC ID",
                      value: selectedRowData.drc_id || "Not specified",
                    },
                    {
                      label: "Remark",
                      value:
                        selectedRowData.call_inquiry_remark || "Not specified",
                    },
                    {
                      label: "Created Date",
                      value: selectedRowData.created_date
                        ? new Date(
                            selectedRowData.created_date
                          ).toLocaleDateString()
                        : selectedRowData.created_date
                        ? new Date(
                            selectedRowData.created_date
                          ).toLocaleDateString()
                        : "Not specified",
                    },
                    {
                      label: "Sequence No",
                      value: selectedRowData.seq || "Not specified",
                    },

                    // filteredDataBySearch.status === "Terminate" && {
                    //   label: "Terminate Date",
                    //   value: filteredDataBySearch.drc_terminate_dtm
                    //     ? new Date(
                    //         filteredDataBySearch.drc_terminate_dtm
                    //       ).toLocaleDateString()
                    //     : "Not specified",
                    // },
                  ]
                    .filter(Boolean) // Ensure `false` values like from conditional item don’t appear
                    .map((item, index) => (
                      <tr key={index} className="block sm:table-row">
                        <td
                          className={`${GlobalStyle.tableData} font-medium block sm:hidden`}
                        >
                          {item.label}:
                        </td>
                        <td
                          className={`${GlobalStyle.tableData} text-gray-500 block sm:hidden pl-4`}
                        >
                          {item.value}
                        </td>

                        <td
                          className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}
                        >
                          {item.label}
                        </td>
                        <td className="w-4 text-left hidden sm:table-cell">
                          :
                        </td>
                        <td
                          className={`${GlobalStyle.tableData} text-gray-500 hidden sm:table-cell`}
                        >
                          {item.value}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div>
        <button className={GlobalStyle.navButton} onClick={handleBackButton}>
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
};

export default Pre_Negotiation;
