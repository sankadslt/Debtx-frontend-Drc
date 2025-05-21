/*Purpose: This template is used for the 2.1- Assigned case list for DRC
Created Date: 2025-01-07
Created By: Chamithu (chamithujayathilaka2003@gmail.com)
Last Modified Date: 2025-03-04
Modified by: Nimesh Perera(nimeshmathew999@gmail.com), Sasindu Srinayka (sasindusrinayaka@gmail.com)
Modified by: Janani Kumarasiri (jkktg001@gmail.com)
Version: node 20
ui number : 2.1
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for the assigned case list for DRC  */


import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import DatePicker from "react-datepicker";
import { getActiveRODetailsByDrcID } from "../../services/Ro/RO.js";
import { fetchAllArrearsBands, listHandlingCasesByDRC } from "../../services/case/CaseService.js";
import { getLoggedUserId } from "../../services/auth/authService.js";
import Swal from 'sweetalert2';
import { Create_Task_Assigned_Case_for_DRC } from "../../services/task/taskService.js";
// import { Tooltip } from "react-tooltip";

//Status Icons
import Open_With_Agent from "../../assets/images/Distribution/Open_With_Agent.png";
import RO_Negotiation from "../../assets/images/Negotiation_new/RO_Negotiation.png";
import Negotiation_Settle_Pending from "../../assets/images/Negotiation_new/RO_Settle_Pending.png";
import Negotiation_Settle_Open_Pending from "../../assets/images/Negotiation_new/RO_Settle_Open_Pending.png";
import Negotiation_Settle_Active from "../../assets/images/Negotiation_new/RO_Settle_Active.png";
import RO_Negotiation_Extension_Pending from "../../assets/images/Negotiation_new/RO Negotiation extend pending.png";
import RO_Negotiation_Extended from "../../assets/images/Negotiation_new/RO Negotiation extended.png";
import RO_Negotiation_FMB_Pending from "../../assets/images/Negotiation_new/RO_Negotiation_FMB_Pending.png";
import FMB from "../../assets/images/Mediation _Board/Forward_To_Mediation_Board.png";
import MB_Negotiation from "../../assets/images/Mediation _Board/MB_Negotiation.png";
import MB_Request_Customer_Info from "../../assets/images/Mediation _Board/MB Request Customer-Info.png";
import MB_Handover_Customer_Info from "../../assets/images/Mediation _Board/MB Handover Customer-Info.png";
import MB_Settle_Pending from "../../assets/images/Mediation _Board/MB Settle Pending.png";
import MB_Settle_Open_Pending from "../../assets/images/Mediation _Board/MB Settle Open Pending.png";
import MB_Settle_Active from "../../assets/images/Mediation _Board/MB Settle Active.png";
import MB_Fail_with_Pending_Non_Settlement from "../../assets/images/Mediation _Board/MB Fail with Pending Non Settlement.png";


export default function AssignedCaseListforDRC() {
  const [error, setError] = useState("");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  //State for dropdowns
  const [arrearsAmounts, setArrearsAmounts] = useState([]);
  const [selectedArrearsAmount, setSelectedArrearsAmount] = useState("");
  const [roList, setRoList] = useState([]);
  const [selectedRo, setSelectedRo] = useState("");
  const [userData, setUserData] = useState(null);

  // State for search query and filtered data
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    // console.log("User data:", user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Start loading animation
        // Step 3: Fetch arrears bands and ro list
        const arrearsAmounts = await fetchAllArrearsBands();
        setArrearsAmounts(arrearsAmounts);

        if (userData?.drc_id) {
          const roData = await getActiveRODetailsByDrcID(userData?.drc_id);
          setRoList(roData);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
        Swal.fire({
          title: "Error",
          text: "Error fetching data",
          icon: "error",
          // allowOutsideClick: false,
          // allowEscapeKey: false,
          // showCancelButton: true,
          // confirmButtonText: "Yes",
          // confirmButtonColor: "#28a745",
          // cancelButtonText: "No",
          // cancelButtonColor: "#d33",
        })
      } finally {
        setIsLoading(false); // Stop loading animation
      }
    }
    fetchData();
  }, [userData?.drc_id]);

  const handleCreateTaskForDownload = async ({ arrears_band, ro_id, fromDate, toDate }) => {
    const params = {
      arrears_band: arrears_band || "",
      ro_id: ro_id ? Number(ro_id) : "",
      from_date: fromDate,
      to_date: toDate,
    };

    // console.log("Params sent to API: ", params);

    if (!fromDate && !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please provide a date range before creating a task.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return; // Stop function execution
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Incomplete Date Range",
        text: "Both From Date and To Date must be selected together.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const confirmation = await Swal.fire({
      title: "Confirm Task Creation",
      text: "Are you sure you want to create this task?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) return;

    try {
      const filteredParams = {

        params
      };

      const response = await Create_Task_Assigned_Case_for_DRC(filteredParams);

      if (response.status === 201) {
        Swal.fire({
          title: "Success",
          text: "Task successfully created",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Error creating task",
        icon: "error"
      });
    }
  };


  const handlestartdatechange = (date) => {
    if (toDate && date > toDate) {

      Swal.fire({
        title: "Warning",
        text: "The 'From' date cannot be later than the 'To' date.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      setFromDate(null);
    }
    else {
      setError("");
      setFromDate(date);
    }
  };

  const handleenddatechange = (date) => {
    if (fromDate && date < fromDate) {

      Swal.fire({
        title: "Warning",
        text: "The 'To' date cannot be earlier than the 'From' date.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      setToDate(null);
    } else {
      setError("");
      setToDate(date);
    }
  };

  const handleFilter = async () => {
    try {
      setFilteredData([]);
      setCurrentPage(1);

      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split("T")[0];
      };

      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (!selectedArrearsAmount && !selectedRo && !from && !to) {
        Swal.fire({
          title: "Missing Filters",
          text: "Please select at least one filter.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      if ((from && !to) || (!from && to)) {
        Swal.fire({
          title: "Incomplete Date Range",
          text: "Both From Date and To Date must be selected together.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      if (from && to && from > to) {
        Swal.fire({
          title: "Invalid Date Range",
          text: "To Date should be greater than or equal to From Date.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      if (from && to) {
        const monthDiff = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
        if (monthDiff > 1 || (monthDiff === 1 && to.getDate() > from.getDate())) {
          Swal.fire({
            title: "Long Date Range",
            text: "The selected date range exceeds one month. Consider creating a task instead.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Create Task",
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.isConfirmed) {
              handleCreateTaskForDownload({
                arrears_band: selectedArrearsAmount,
                ro_id: selectedRo,
                fromDate: formatDate(fromDate),
                toDate: formatDate(toDate),
              });
            }
          });
          return;
        }
      }

      const payload = {
        drc_id: Number(userData.drc_id),
        arrears_band: selectedArrearsAmount || "",
        ro_id: selectedRo ? Number(selectedRo) : "",
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
        pages: currentPage,
      };

      console.log("Payload sent to API: ", payload);

      setIsLoading(true);
      const response = await listHandlingCasesByDRC(payload);

      if (Array.isArray(response)) {
        console.log(response);
        setFilteredData(response);

        // setFilteredData((prevData) => [...prevData, ...response]);

        // if (response.length === 0) {
        //   setIsMoreDataAvailable(false); // No more data available
        //   if (currentPage === 1) {
        //     Swal.fire({
        //       title: "No Results",
        //       text: "No matching data found for the selected filters.",
        //       icon: "warning",
        //       allowOutsideClick: false,
        //       allowEscapeKey: false
        //     });
        //   }
        // } else {
        //   const maxData = currentPage === 1 ? 10 : 30;
        //   if (response.data.length < maxData) {
        //     setIsMoreDataAvailable(false); // More data available
        //   }
        // }
      } else {
        // console.error("No valid cases data found in response.");
        Swal.fire({
          title: "Error",
          text: "Failed to fetch filtered data. Please try again.",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error"
      });
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  const handleClear = () => {
    setCurrentPage(1);
    setSelectedArrearsAmount("");
    setSelectedRo("");
    setFromDate(null);
    setToDate(null);
    setFilteredData([]);
    setSearchQuery("");
  };

  // Search Section
  const filteredDataBySearch = currentData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // display loading animation when data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      // case "open no agent":
      //   return <img src={Open_No_Agent} alt="Open No Agent" title="Open No Agent" className="w-5 h-5" />;
      case "open with agent":
        return Open_With_Agent;
      case "ro negotiation":
        return RO_Negotiation;
      case "negotiation settle pending":
        return Negotiation_Settle_Pending;
      case "negotiation settle open pending":
        return Negotiation_Settle_Open_Pending;
      case "negotiation settle active":
        return Negotiation_Settle_Active;
      case "ro negotiation extension pending":
        return RO_Negotiation_Extension_Pending;
      case "ro negotiation extended":
        return RO_Negotiation_Extended;
      case "ro negotiation fmb pending":
        return RO_Negotiation_FMB_Pending;
      case "mb negotiation":
        return MB_Negotiation;
      case "mb request customer-info":
        return MB_Request_Customer_Info;
      case "mb handover customer-info":
        return MB_Handover_Customer_Info;
      case "mb fail with pending non-settlement":
        return MB_Fail_with_Pending_Non_Settlement;
      case "forward to mediation board":
        return FMB;
      case "mb settle pending":
        return MB_Settle_Pending;
      case "mb settle open pending":
        return MB_Settle_Open_Pending;
      case "mb settle active":
        return MB_Settle_Active;
      default:
        return <span className="text-gray-500">N/A</span>;
    }
  };

  // render status icon with tooltip
  const renderStatusIcon = (status) => {
    const iconPath = getStatusIcon(status);

    if (!iconPath) {
      return <span>{status}</span>;
    }

    return (
      <div className="flex items-center gap-2">
        <img
          src={iconPath}
          alt={status}
          title={status}
          className="w-6 h-6"
        />
      </div>
    );
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Case List</h1>

      <div className={`${GlobalStyle.cardContainer} w-full`}>
        <div className="flex items-center justify-end w-full space-x-3">
          {/* Dropdown for Arrears Amount */}
          <select
            className={GlobalStyle.selectBox}
            value={selectedArrearsAmount}
            onChange={(e) => setSelectedArrearsAmount(e.target.value)}
            style={{ color: selectedArrearsAmount === "" ? "gray" : "black" }}
          >
            <option value="" hidden>Arrears Band</option>
            {arrearsAmounts.length > 0 ? (
              arrearsAmounts.map((amount, index) => (
                <option key={index} value={amount.key}>
                  {amount.value}
                </option>
              ))
            ) : (
              <option value="">Loading...</option>
            )}
          </select>

          {/* Dropdown for RO */}
          <select
            className={GlobalStyle.selectBox}
            value={selectedRo}
            onChange={(e) => setSelectedRo(e.target.value)}
            style={{ color: selectedRo === "" ? "gray" : "black" }}
          >
            <option value="">Select RO</option>
            {roList.map((ro) => (
              <option key={ro.ro_id} value={ro.ro_id}>{ro.ro_name}</option>
            ))}
          </select>

          <div className={GlobalStyle.datePickerContainer}>
            <label className={GlobalStyle.dataPickerDate}>Date</label>
            <DatePicker
              selected={fromDate}
              onChange={handlestartdatechange}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className={GlobalStyle.inputText}
            />
            <DatePicker
              selected={toDate}
              onChange={handleenddatechange}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className={GlobalStyle.inputText}
            />
          </div>
          <button
            onClick={handleFilter}
            className={`${GlobalStyle.buttonPrimary}`}
          >
            Filter
          </button>
          <button
            onClick={handleClear}
            className={`${GlobalStyle.buttonRemove}`}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex justify-start mt-10 mb-4">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={GlobalStyle.inputSearch}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Date</th>
              <th className={GlobalStyle.tableHeader}>Amount</th>
              <th className={GlobalStyle.tableHeader}>Action</th>
              <th className={GlobalStyle.tableHeader}>RTOM Area</th>
              <th className={GlobalStyle.tableHeader}>Expire Date</th>
              <th className={GlobalStyle.tableHeader}>RO</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
              filteredDataBySearch.map((item, index) => (
                <tr
                  key={item.case_id || index}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td className={`${GlobalStyle.tableData}  text-black hover:underline cursor-pointer`}>{item.case_id || "N/A"}</td>
                  <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>{renderStatusIcon(item.status)}</td>
                  <td className={GlobalStyle.tableData}>{item.created_dtm
                    ? new Date(item.created_dtm).toLocaleDateString("en-GB")
                    : "N/A"}</td>
                  <td className={GlobalStyle.tableCurrency}>
                    {item?.current_arrears_amount &&
                      item.current_arrears_amount.toLocaleString("en-LK", {
                        style: "currency",
                        currency: "LKR",
                      })
                    }
                  </td>
                  <td className={GlobalStyle.tableData}> {item.action_type || "N/A"} </td>
                  <td className={GlobalStyle.tableData}>{item.area || "N/A"}</td>
                  <td className={GlobalStyle.tableData}>
                    {item.expire_dtm
                      ? new Date(item.expire_dtm).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td className={GlobalStyle.tableData}>{item.ro_name}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center">No cases available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className={GlobalStyle.navButtonContainer}>
        <button
          onClick={() => handlePrevNext("prev")}
          disabled={currentPage === 1}
          className={`${GlobalStyle.navButton} ${currentPage === 1 ? "cursor-not-allowed" : ""
            }`}
        >
          <FaArrowLeft />
        </button>
        <span className={`${GlobalStyle.pageIndicator} mx-4`}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePrevNext("next")}
          disabled={currentPage === totalPages}
          className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""
            }`}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}


