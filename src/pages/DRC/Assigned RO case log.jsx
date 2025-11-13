/* Purpose: This template is used for the 2.3 - Assigned RO case log .
Created Date: 2024-01-08
Created By: Chamath (chamathjayasanka20@gmail.com)
Last Modified Date:2025-02-18
Modified by: Nimesh Perera(nimeshmathew999@gmail.com)
Modified By: Janani Kumarasiri (jkktg001@gmail.com)
Version: node 20
ui number : 2.3
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the code for the Assigned RO case log Screen */

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch, FaEdit } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import DatePicker from "react-datepicker";
import {
  fetchAllArrearsBands,
  listHandlingCasesByDRC,
  List_Handling_Cases_By_DRC_With_RO
} from "../../services/case/CaseService";
import { getActiveRTOMsByDRCID } from "../../services/rtom/RtomService";
import { useNavigate } from "react-router-dom";
import { getLoggedUserId } from "../../services/auth/authService.js";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";

//Status Icons
// import Open_No_Agent from "../../assets/images/status/Open_No_Agent.png";
// import Open_With_Agent from "../../assets/images/status/Open_With_Agent.png";
// import Negotiation_Settle_Pending from "../../assets/images/status/Negotiation_Settle_Pending.png";
// import Negotiation_Settle_Open_Pending from "../../assets/images/status/Negotiation_Settle_Open_Pending.png";
// import Negotiation_Settle_Active from "../../assets/images/status/Negotiation_Settle_Active.png";
// import FMB from "../../assets/images/status/Forward_to_Mediation_Board.png";
// import FMB_Settle_Pending from "../../assets/images/status/MB_Settle_pending.pngfilteredData";
// import FMB_Settle_Open_Pending from "../../assets/images/status/MB_Settle_open_pending.png";
// import FMB_Settle_Active from "../../assets/images/status/MB_Settle_Active.png";
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

export default function AssignedROcaselog() {
  const navigate = useNavigate(); // Initialize the navigate function

  const [rtoms, setRtoms] = useState([]);
  const [selectedRTOM, setSelectedRTOM] = useState("");
  const [filteredlogData, setFilteredlogData] = useState([]); // State for filtered data
  // State for search query and filtered data
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [drcId, setdrcId] = useState("");
  const [filterAccountNo, setFilterAccountNo] = useState("");
  //   const [searchBy, setSearchBy] = useState("case_id"); // Default search by case ID

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  // const [totalAPIPages, setTotalAPIPages] = useState(1);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true); // State to track if more data is available
  const rowsPerPage = 10; // Number of rows per page
  const recordsPerPage = 10;
  // const indexOfLastRecord = currentPage * recordsPerPage;
  // const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  //   const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const [isLoading, setIsLoading] = useState(true);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const [committedFilters, setCommittedFilters] = useState({
    // drcId: "",
    drcId,
    selectedRTOM: "",
    selectedArrearsBand: "",
    fromDate: null,
    toDate: null,
  });

  // Filter state for Amount, Case ID, Status, and Date
  const [arrearsAmounts, setArrearsAmounts] = useState([]);
  const [selectedArrearsBand, setSelectedArrearsBand] = useState("");
  const [filterCaseId, setFilterCaseId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getLoggedUserId();
        console.log("User data:", user);
        setUserData(user);
        const newDrcId = user?.drc_id ? Number(user.drc_id) : "";
        setdrcId(newDrcId);
        console.log("Set drcId:", newDrcId);
        // Add this to update committedFilters
        if (newDrcId && !isNaN(newDrcId)) {
          setCommittedFilters((prev) => {
            const updatedFilters = {
              ...prev,
              drcId: newDrcId,
            };
            // Trigger initial API call
            callAPI({ ...updatedFilters, page: 1 });
            return updatedFilters;
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch user data. Please try again.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "OK",
          confirmButtonColor: "#d33",
        });
      }
    };
    loadUser();
  }, []);

  // Fetch RTOMs and arrears bands when drcId is available
  useEffect(() => {
    const fetchRTOMs = async () => {
      if (!drcId || isNaN(drcId)) {
        // console.warn("No valid drcId available, skipping fetchRTOMs");
        // setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [arrearsAmounts, rtomsList] = await Promise.all([
          fetchAllArrearsBands(),
          getActiveRTOMsByDRCID(drcId),
        ]);
        setArrearsAmounts(arrearsAmounts);
        setRtoms(rtomsList);
        console.log("RTOM list retrieved:", rtomsList); // Debug RTOMs
        console.log("Arrears bands retrieved:", arrearsAmounts); // Debug arrears bands
      } catch (error) {
        console.error("Error fetching RTOMs or arrears bands:", error);
        Swal.fire({
          title: "Error",
          text: "Error fetching data",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Yes",
          confirmButtonColor: "#d33",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRTOMs();
  }, [drcId]);

  const handleonvisiable = (case_id) => {
    navigate("/drc/ro-monitoring-arrears", { state: { CaseID: case_id } });
    // console.log("Case ID being passed: ", case_id);
  };

  const handleonreassign = (case_id) => {
    navigate("/pages/DRC/Re-AssignRo", { state: { CaseID: case_id } });
    // console.log("Case ID being passed: ", case_id);
  };

  const handlestartdatechange = (date) => {
    setFromDate(null);
  };
  const handleenddatechange = (date) => {
    // if (date === null) {
    setToDate(null);
    // return;
    // }

    // if (fromDate) {
    //   if (date < fromDate) {
    //     Swal.fire({
    //       title: "Warning",
    //       text: "The 'To' date cannot be before the 'From' date.",
    //       icon: "warning",
    //       confirmButtonText: "OK",
    //       confirmButtonColor: "#f1c40f",
    //     });
    //     return;
    //   } else {
    //     // checkdatediffrence(fromDate, date);
    //     setToDate(date);
    //   }
    // } else {
    //   setToDate(date);
    // }
  };

  // Check if toDate is greater than fromDate
  useEffect(() => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      Swal.fire({
        title: "Warning",
        text: "To date should be greater than or equal to From date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f",
      });
      setToDate(null);
      setFromDate(null);
      return;
    }
  }, [fromDate, toDate]);

  // Search Section
  const filteredDataBySearch = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // const checkdatediffrence = (startDate, endDate) => {
  //     const start = new Date(startDate).getTime();
  //     const end = new Date(endDate).getTime();
  //     const diffInMs = end - start;
  //     const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  //     const diffInMonths = diffInDays / 30;

  //     if (diffInMonths > 1) {
  //         Swal.fire({
  //             title: "Date Range Exceeded",
  //             text: "The selected dates have more than a 1-month gap.",
  //             icon: "warning",
  //             confirmButtonText: "OK",
  //             confirmButtonColor: "#f1c40f",
  //         }).then((result) => {
  //             if (result.isConfirmed) {
  //                 setToDate(null);
  //                 // console.log("Dates cleared");
  //             }
  //         }
  //         );
  //     };
  // };

  const callAPI = async (filters) => {
    try {
      console.log(" filters:", filters.drcId);
      if (!filters.drcId || isNaN(filters.drcId)) {
        console.error("Invalid drcId in filters:", filters.drcId);
        Swal.fire({
          title: "Error",
          text: "Invalid DRC ID. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        return;
      }
      // setCurrentPage(1); // Reset pagination to the first page
      // setFilteredData([]); // Clear previous results

      // Format the date to 'YYYY-MM-DD' format
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        return offsetDate.toISOString().split("T")[0];
      };
      console.log(currentPage);

      // if (!selectedArrearsBand && !selectedRTOM && !fromDate && !toDate) {
      //   Swal.fire({
      //     title: "Warning",
      //     text: "No filter data is selected. Please, select data.",
      //     icon: "warning",
      //     allowOutsideClick: false,
      //     allowEscapeKey: false,
      //     confirmButtonText: "OK",
      //     confirmButtonColor: "#f1c40f",
      //   });
      //   setToDate(null);
      //   setFromDate(null);
      //   return;
      // }

      // if ((fromDate && !toDate) || (!fromDate && toDate)) {
      //   Swal.fire({
      //     title: "Warning",
      //     text: "Both From Date and To Date must be selected.",
      //     icon: "warning",
      //     allowOutsideClick: false,
      //     allowEscapeKey: false,
      //     confirmButtonText: "OK",
      //     confirmButtonColor: "#f1c40f",
      //   });
      //   setToDate(null);
      //   setFromDate(null);
      //   return;
      // }

      // if (new Date(fromDate) > new Date(toDate)) {
      //   Swal.fire({
      //     title: "Warning",
      //     text: "To date should be greater than or equal to From date",
      //     icon: "warning",
      //     allowOutsideClick: false,
      //     allowEscapeKey: false,
      //     confirmButtonText: "OK",
      //     confirmButtonColor: "#f1c40f",
      //   });
      //   setToDate(null);
      //   setFromDate(null);
      //   return;
      // }

      const payload = {
        drc_id: Number(filters.drcId), // Convert drc_id to number
        rtom: filters.selectedRTOM,
        arrears_band: filters.selectedArrearsBand,
        from_date: formatDate(filters.fromDate),
        to_date: formatDate(filters.toDate),
        pages: filters.page,
      };
      console.log("Sending filter payload:", payload); // Log the payload before sending for debugging
      // Fetch filtered data from the API using the payload

      setIsLoading(true);
      const AssignedRoCaseLogs = await List_Handling_Cases_By_DRC_With_RO(payload);
      setIsLoading(false);

      // Log the response
      console.log("Response from API:", AssignedRoCaseLogs); //for debugging

      // Set the filtered data (assuming setFilteredData updates the state or UI)

      // Updated response handling
      if (AssignedRoCaseLogs) {
        // console.log("Valid data received:", response.data);
        if (currentPage === 1) {
          setFilteredData(AssignedRoCaseLogs);
          console.log(" data received:", filteredData);
        } else {
          setFilteredData((prevData) => [...prevData, ...AssignedRoCaseLogs]);
        }

        if (AssignedRoCaseLogs.length === 0) {
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
            setCurrentPage(1); // Reset to page 1 if no data found on page 2
          }
        } else {
          const maxData = currentPage === 1 ? 10 : 30;
          if (AssignedRoCaseLogs.length < maxData) {
            setIsMoreDataAvailable(false); // More data available
          }
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid Settlement data found in response.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        setFilteredData([]);
      }

      // setFilteredData(AssignedRoCaseLogs);

      // console.log("Filtered data updated:", filteredData); //for debugging

      // const endDate = AssignedROcaselog.expire_dtm;
      // const currentDate = new Date();
      // const isPastDate = endDate < currentDate;
    } catch (error) {
      // console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (drcId && isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max current page
      // callAPI(); // Call the function whenever currentPage changes
      callAPI({
        ...committedFilters,
        page: currentPage,
      });
    }
  }, [currentPage, drcId]);

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // console.log("Current Page:", currentPage);
    } else if (direction === "next") {
      if (isMoreDataAvailable) {
        setCurrentPage(currentPage + 1);
      } else {
        if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
          setCurrentPage(currentPage + 1);
        }
      }
      // console.log("Current Page:", currentPage);
    }
  };

  // Handle Filter Button click
  const handleFilterButton = () => {
    setIsMoreDataAvailable(true); // Reset more data available state
    setTotalPages(0); // Reset total pages
    setMaxCurrentPage(0); // Reset max current page
    const isValid = filterValidations(); // Validate filters before applying
    if (!isValid) {
      return; // If validation fails, do not proceed
    } else {
      setCommittedFilters({
        drcId, // Convert drc_id to number
        selectedRTOM,
        selectedArrearsBand,
        fromDate,
        toDate,
      });
      setFilteredData([]); // Clear previous results
      if (currentPage === 1) {
        // callAPI();
        callAPI({
          drcId, // Convert drc_id to number
          selectedRTOM,
          selectedArrearsBand,
          fromDate,
          toDate,
          page: 1,
        });
      } else {
        setCurrentPage(1);
      }
    }
  };

  const handleClear = () => {
    setSelectedRTOM("");
    setSelectedArrearsBand("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setTotalPages(0); // Reset total pages
    // setFilteredData([]);
    setMaxCurrentPage(0);
    setIsMoreDataAvailable(true); // Reset more data available state
    // Clear committed filters
    setCommittedFilters({
      drcId,
      selectedRTOM: "",
      selectedArrearsBand: "",
      fromDate: null,
      toDate: null,
    });
    if (currentPage != 1) {
      setCurrentPage(1); // Reset to page 1
    } else {
      setCurrentPage(0); // Temp set to 0
      setTimeout(() => setCurrentPage(1), 0); // Reset to 1 after
    }
  };

  // Validate filters before calling the API
  const filterValidations = () => {
    if (
      !drcId
      // !selectedArrearsBand &&
      // !fromDate &&
      // !toDate &&
      // !selectedArrearsBand
    ) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please, select a filter.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f",
      });
      setToDate(null);
      setFromDate(null);
      return false;
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Warning",
        text: "Both From Date and To Date must be selected.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f",
      });
      setToDate(null);
      setFromDate(null);
      return false;
    }

    return true; // All validations passed
  };

  // // Handle pagination
  // const handlePrevNext = (direction) => {
  //     if (direction === "prev" && currentPage > 1) {
  //         setCurrentPage(currentPage - 1);
  //     } else if (direction === "next" && currentPage < totalPages) {
  //         setCurrentPage(currentPage + 1);
  //     }
  // };

  // Filtering the data based on filter values
  // const filterData = () => {
  //     let tempData = data;
  //     if (filterType && filterValue) {
  //         if (filterType === "Account No") {
  //             tempData = tempData.filter((item) =>
  //                 item.accountNo.includes(filterValue)
  //             );
  //         } else if (filterType === "Case ID") {
  //             tempData = tempData.filter((item) => item.caseId.includes(filterValue));
  //         }
  //     }

  //     if (fromDate) {
  //         tempData = tempData.filter((item) => {
  //             const itemDate = new Date(item.date);
  //             return itemDate >= toDate;
  //         });
  //     }

  //     if (toDate) {
  //         tempData = tempData.filter((item) => {
  //             const itemDate = new Date(item.date);
  //             return itemDate <= toDate;
  //         });
  //     }
  //     // Apply filters
  //     if (filterAccountNo) {
  //         tempData = tempData.filter((item) =>
  //             item.accountNo.includes(filterAccountNo)
  //         );
  //     }
  //     if (filterCaseId) {
  //         tempData = tempData.filter((item) => item.caseId.includes(filterCaseId));
  //     }
  //     if (filterStatus) {
  //         tempData = tempData.filter((item) => item.status.includes(filterStatus));
  //     }
  //     if (selectedArrearsBand) {
  //         tempData = tempData.filter((item) => {
  //             const amount = parseInt(item.amount.replace(/,/g, "")); // Remove commas and parse as integer
  //             if (selectedArrearsBand === "5-10") {
  //                 return amount >= 5000 && amount <= 10000;
  //             } else if (selectedArrearsBand === "10-25") {
  //                 return amount >= 10000 && amount <= 25000;
  //             } else if (selectedArrearsBand === "25-50") {
  //                 return amount >= 25000 && amount <= 50000;
  //             } else if (selectedArrearsBand === "50-100") {
  //                 return amount >= 50000 && amount <= 100000;
  //             } else if (selectedArrearsBand === "100+") {
  //                 return amount > 100000;
  //             }
  //             return true; // Return true if no filter is applied
  //         });
  //     }
  //     setFilteredData(tempData);
  //     setCurrentPage(1); // Reset pagination when filter changes
  // };

  // Search Section
  // const filteredDataBySearch = currentData.filter(
  //   (row) =>
  //     Object.values(row)
  //       .join(" ") // Join all values in a row to form a single string
  //       .toLowerCase()
  //       .includes(searchQuery.toLowerCase()) // Match with the search query
  // );

  // const getStatusIcon = (status) => {
  //     switch (status.toLowerCase()) {
  //         case "open no agent":
  //             return <img src={Open_No_Agent} alt="Open No Agent" title="Open No Agent" className="w-5 h-5" />;
  //         case "open with agent":
  //             return <img src={Open_With_Agent} alt="Open With Agent" title="Open With Agent" className="w-5 h-5" />;
  //         case "negotiation settle pending":
  //             return <img src={Negotiation_Settle_Pending} alt="Negotiation Settle Pending" title="Negotiation Settle Pending" className="w-5 h-5" />;
  //         case "negotiation settle open pending":
  //             return <img src={Negotiation_Settle_Open_Pending} alt="Negotiation Settle Open Pending" title="Negotiation Settle Open Pending" className="w-5 h-5" />;
  //         case "negotiation settle active":
  //             return <img src={Negotiation_Settle_Active} alt="Negotiation Settle Active" title="Negotiation Settle Active" className="w-5 h-5" />;
  //         case "fmb":
  //             return <img src={FMB} alt="FMB" title="FMB" className="w-5 h-5" />;
  //         case "fmb settle pending":
  //             return <img src={FMB_Settle_Pending} alt="FMB Settle Pending" title="FMB Settle Pending" className="w-5 h-5" />;
  //         case "fmb settle open pending":
  //             return <img src={FMB_Settle_Open_Pending} alt="FMB Settle Open Pending" title="FMB Settle Open Pending" className="w-5 h-5" />;
  //         case "fmb settle active":
  //             return <img src={FMB_Settle_Active} alt="FMB Settle Active" title="FMB Settle Active" className="w-5 h-5" />;
  //         default:
  //             return <span className="text-gray-500">N/A</span>;
  //     }
  // };

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
  const renderStatusIcon = (status, index) => {
    const iconPath = getStatusIcon(status);

    const tooltipId = `status-tooltip-${index}`;

    if (!iconPath) {
      return <span>{status}</span>;
    }

    return (
      <div>
        <div className="flex items-center gap-2">
          <img src={iconPath} alt={status} className="w-6 h-6" data-tooltip-id={tooltipId} />
        </div>
        <Tooltip id={tooltipId} className="tooltip" effect="solid" place="bottom" content={status} />
      </div>
    );
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Assigned RO case List</h1>

      <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
        <div className="flex flex-wrap  xl:flex-nowrap items-center justify-end w-full space-x-3 gap-3">
          {/* RTOM Select Dropdown */}
          <select
            className={GlobalStyle.selectBox}
            value={selectedRTOM}
            onChange={(e) => setSelectedRTOM(e.target.value)}
            style={{ color: selectedRTOM === "" ? "gray" : "black" }}
          >
            <option value="" hidden>
              Billing Center
            </option>
            {rtoms.length > 0 ? (
              rtoms.map((rtom) => (
                <option key={rtom.rtom_id} value={rtom.area_name} style={{ color: "black" }}>
                  {rtom.area_name}{" "}
                  {/* Ensure this is the correct name for the RTOM area */}
                </option>
              ))
            ) : (
              <option disabled>No Billing Center found</option>
            )}
          </select>
          <select
            className={GlobalStyle.selectBox}
            value={selectedArrearsBand}
            onChange={(e) => setSelectedArrearsBand(e.target.value)}
            style={{ color: selectedArrearsBand === "" ? "gray" : "black" }}
          >
            <option value="" hidden>
              Arrears band
            </option>
            {Array.isArray(arrearsAmounts) && arrearsAmounts.length > 0 ? (
              arrearsAmounts.map(({ key, value }) => (
                <option key={key} value={key} style={{ color: "black" }}>
                  {value}
                </option>
              ))
            ) : (
              <option disabled>No arrears bands available</option>
            )}
          </select>

          <label className={GlobalStyle.dataPickerDate}>Date</label>
          <DatePicker
            selected={fromDate}
            onChange={handlestartdatechange}
            dateFormat="dd/MM/yyyy"
            placeholderText="From"
            className={`${GlobalStyle.inputText} w-full sm:w-auto`}
          />
          <DatePicker
            selected={toDate}
            onChange={handleenddatechange}
            dateFormat="dd/MM/yyyy"
            placeholderText="To"
            className={`${GlobalStyle.inputText} w-full sm:w-auto`}
          />

          <button
            onClick={handleFilterButton}
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
            onChange={(e) => {
              setCurrentPage(1); // Reset to page 1 on search
              setSearchQuery(e.target.value);
            }}
            className={GlobalStyle.inputSearch}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

      {/* Table Section */}
      <div className={`${GlobalStyle.tableContainer} mt-8 overflow-x-auto`}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Case ID
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Status
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Amount
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Billing Center
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Action
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Assigned RO
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Assigned Date
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                End Date
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
              filteredDataBySearch
                .slice(startIndex, endIndex)
                .map((item, index) => {
                  // Convert expire_dtm to a JavaScript Date object
                  const expireDate = new Date(item.expire_dtm);
                  const today = new Date();

                  // Check if the expire date is in the past
                  const isPastDate = expireDate < today;

                  return (
                    <tr
                      key={index}
                      className={`${index % 2 === 0
                        ? "bg-white bg-opacity-75"
                        : "bg-gray-50 bg-opacity-50"
                        } border-b`}
                    >
                      <td className={GlobalStyle.tableData}>
                        <a
                          href={`#${item.case_id}`}
                          className="hover:underline"
                        >
                          {item.case_id}
                        </a>
                      </td>
                      <td
                        className={`${GlobalStyle.tableData} flex justify-center items-center`}
                      >
                        {renderStatusIcon(item.status || "", index)}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {item.current_arrears_amount || ""}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {item.area || ""}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {item.action_type || ""}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {item.ro_name || ""}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {item.assigned_date
                          ? new Date(item.assigned_date).toLocaleDateString(
                            "en-GB"
                          )
                          : ""}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {" "}
                        {item.expire_dtm
                          ? new Date(item.expire_dtm).toLocaleDateString(
                            "en-GB"
                          )
                          : ""}{" "}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        <div className="px-8 flex items-center gap-2">
                          <AiFillEye
                            onClick={() => handleonvisiable(item.case_id)}
                            style={{ cursor: "pointer", marginRight: "8px" }}
                            data-tooltip-id="view-tooltip"
                          />
                          <Tooltip id="view-tooltip" className="tooltip" effect="solid" place="bottom" content="View" />

                          {/* Show Edit button only if the expire date is in the future */}
                          <FaEdit
                            onClick={() => {
                              if (!isPastDate) {
                                navigate("/drc/customer-negotiation", {
                                  state: {
                                    CaseID: item.case_id,
                                    ActionType: item.action_type,
                                    Page: "Type1"
                                  },
                                });
                              }
                            }}
                            style={{
                              cursor: isPastDate ? "not-allowed" : "pointer",
                              color: isPastDate ? "#d3d3d3" : "#000",
                              opacity: isPastDate ? 0.6 : 1,
                            }}
                            data-tooltip-id="edit-tooltip"
                          />
                          <Tooltip id="edit-tooltip" className="tooltip" effect="solid" place="bottom" content="Edit" />

                          <button
                            className={`${GlobalStyle.buttonPrimary} mx-auto`}
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => handleonreassign(item.case_id)}
                          >
                            Re-Assign
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className={GlobalStyle.tableData}
                  style={{ textAlign: "center" }}
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {/* <div className={GlobalStyle.navButtonContainer}>
        <button
          onClick={() => handlePrevNext("prev")}
          disabled={currentPage === 1}
          className={`${GlobalStyle.navButton} ${
            currentPage === 1 ? "cursor-not-allowed" : ""
          }`}
        >
          <FaArrowLeft />
        </button>
        <span>
          Page {currentPage} of {totalPages}
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
      </div> */}
      {/* Pagination Section */}
      {filteredDataBySearch.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            onClick={() => handlePrevNext("prev")}
            disabled={currentPage <= 1}
            className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
          >
            <FaArrowLeft />
          </button>
          <span className={`${GlobalStyle.pageIndicator} mx-4`}>
            Page {currentPage}
          </span>
          <button
            onClick={() => handlePrevNext("next")}
            disabled={
              searchQuery
                ? currentPage >=
                Math.ceil(filteredDataBySearch.length / rowsPerPage)
                : !isMoreDataAvailable &&
                currentPage >= Math.ceil(filteredData.length / rowsPerPage)
            }
            className={`${GlobalStyle.navButton} ${(
              searchQuery
                ? currentPage >=
                Math.ceil(filteredDataBySearch.length / rowsPerPage)
                : !isMoreDataAvailable &&
                currentPage >= Math.ceil(filteredData.length / rowsPerPage)
            )
              ? "cursor-not-allowed opacity-50"
              : ""
              }`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className={`${GlobalStyle.buttonPrimary} `}
      >
        <FaArrowLeft className="mr-2" />
      </button>
    </div>
  );
}
