import { useEffect, useState, useRef } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { getLoggedUserId } from "../../services/auth/authService";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPhone } from "react-icons/fa";
import { Create_Pre_Negotiation } from "../../services/Drc/Drc";

List_Pre_Negotiation_By_Case_Id;

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
  console.log("Caseid :", case_id);

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
    case_id: case_id,
    fromDate: null,
    toDate: null,
  });

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

      // console.log(currentPage);

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
        // console.log("Valid data received:", response.data);

        setFilteredData((prevData) => [...prevData, ...response.data]);

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
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max current page
      // callAPI(); // Call the function whenever currentPage changes
      callAPI({
        ...committedFilters,
        currentPage: currentPage,
      });
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
    if (!selectedSubmission || !remark) {
      Swal.fire(
        "Error",
        "Please enter both Customer Response and Remark",
        "error"
      );
      return;
    }
    const userData = await getLoggedUserId();

    const payload = {
      case_id: case_id,
      call_inquiry_remark: remark,
      call_topic: selectedSubmission,
      case_phase: "Pre Negotiaition",
      created_by: userData?.user_id,
      drc_id: userData?.drc_id,
    };
    console.log("Payload sent by submit: ", { payload });

    try {
      const response = await Create_Pre_Negotiation(payload);
      // console.log(response)
      if (response === "success") {
        Swal.fire(
          response,
          `Customer Response created successfully!`,
          "success"
        );
        setSelectedSubmission("");
        setRemark("");
        callAPI({});
      }
      //   await updateDRCSubmission(payload);
      // navigate("/pages/DRC/DRC_Case_Details", { state: { case_id: case_id } });
    } catch (err) {
      console.error("Error submitting DRC response:", err);
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
      <div className={GlobalStyle.cardContainer}>
        {/* Card */}
        <div className="flex flex-col w-full items-center justify-center">
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
        </div>
      </div>

      {/* Drop down */}
      <div className="flex gap-4 items-center justify-start mb-4 w-full">
        <label className="w-56">Call Negotiation</label>
        <select
          className={`${GlobalStyle.selectBox}`}
          value={selectedSubmission}
          onChange={(e) => setSelectedSubmission(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Legal Accepted">Legal Accepted</option>
          <option value="Legal Rejected">Legal Rejected</option>
        </select>
      </div>

      {/* Remark */}
      <div className="flex flex-col gap-2 justify-start mb-4">
        <label>Remark : </label>
        <textarea
          className={`${GlobalStyle.inputText} h-40`}
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

      {/* Table */}
      <div className={`${GlobalStyle.tableContainer} mt-10 overflow-x-auto`}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>Call Inquiry Sequence</th>
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
                    {new Date(item.created_date).toLocaleDateString("en-GB") ||
                      "N/A"}
                    ,{" "}
                    {new Date(item.created_dtm)
                      .toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                      .toUpperCase()}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <div className="px-8 flex items-center gap-2">
                      <FaPhone
                        onClick={() => handleonvisiable(item.case_id)}
                        style={{ cursor: "pointer", marginRight: "8px" }}
                      />
                    </div>
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

      {filteredDataBySearch.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            className={`${GlobalStyle.navButton} ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaArrowLeft />
          </button>

          <span>Page {currentPage}</span>

          <button
            className={`${GlobalStyle.navButton} ${
              !hasMoreData &&
              currentPage >= Math.ceil(filteredData.length / rowsPerPage)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleNextPage}
            disabled={
              !hasMoreData &&
              currentPage >= Math.ceil(filteredData.length / rowsPerPage)
            }
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pre_Negotiation;
