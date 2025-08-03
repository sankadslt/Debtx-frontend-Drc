/* Purpose: This template is used for the 2.2 - Distribute TO RO.
Created Date: 2025-01-08
Created By: Geeth (eshaneperera@gmail.com)
Last Modified Date: 2025-01-08
Modified Date: 2025-02-23
Modified By: Geeth(eshaneperera@gmail.com), Nimesh Perera(nimeshmathew999@gmail.com), Sasindu Srinayaka(sasindusrinayaka@gmail.com)
Modified By: Janani Kumarasiri (jkktg001@gmail.com)
Version: node 20
ui number : 2.2
Dependencies: tailwind css
Related Files: (routes)
Notes: This page includes a filter and a table */


import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { listHandlingCasesByDRC, List_Handling_Cases_By_DRC_Without_RO } from "../../services/case/CaseService";
import { getActiveRODetailsByDrcID } from "../../services/Ro/RO";
import { getActiveRTOMsByDRCID } from "../../services/rtom/RtomService";
import { assignROToCase } from "../../services/case/CaseService";
import { fetchAllArrearsBands } from "../../services/case/CaseService";
import { getLoggedUserId } from "../../services/auth/authService.js";
import Swal from 'sweetalert2';
import { Tooltip } from "react-tooltip";

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


const DistributeTORO = () => {
  const [rtoms, setRtoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRTOM, setSelectedRTOM] = useState("");
  const [selectedRO, setSelectedRO] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recoveryOfficers, setRecoveryOfficers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [arrearsAmounts, setArrearsAmounts] = useState([]);
  const [selectedArrearsBand, setSelectedArrearsBand] = useState("");
  const [userData, setUserData] = useState(null);
  const [filteredOfficers, setFilteredOfficers] = useState([]);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [committedFilters, setCommittedFilters] = useState({
    selectedRTOM: "",
    selectedArrearsBand: "",
    selectedRO: "",
    fromDate: null,
    toDate: null,
  });

  const loadUser = async () => {
    const user = await getLoggedUserId();
    setUserData(user);
    // console.log("User data:", user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userData?.drc_id) {
          // setError("DRC ID not found in URL. (try http://localhost:5173/pages/Distribute/DistributeTORO/userData?.drc_id)");
          return;
        }
        // Step 3: Fetch arrears bands and ro list
        setLoading(true);
        const arrearsAmounts = await fetchAllArrearsBands();
        setArrearsAmounts(arrearsAmounts);

      } catch (error) {
        console.error("Error fetching data:", error);
        // Swal.fire({
        //   title: "Error",
        //   text: "Error fetching data",
        //   icon: "error",
        // allowOutsideClick: false,
        // allowEscapeKey: false,
        // showCancelButton: true,
        // confirmButtonText: "Ok",
        // confirmButtonColor: "#d33",
        // cancelButtonText: "No",
        // cancelButtonColor: "#d33",
        // })
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userData?.drc_id]);

  // Fetch data and RTOMs when drc_id changes
  useEffect(() => {

    // console.log("fromDatea:", fromDate);
    // console.log("toDate:", toDate);
    const fetchData = async () => {
      try {
        if (userData?.drc_id) {
          const payload = parseInt(userData?.drc_id);

          setLoading(true);
          // Fetch RTOMs
          const rtomsList = await getActiveRTOMsByDRCID(payload);
          setRtoms(rtomsList);

        } else {
          // setError("DRC ID not found in URL. (try http://localhost:5173/pages/Distribute/DistributeTORO/userData?.drc_id)");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // setError("Failed to fetch data. Please try again later.");
        // Swal.fire({
        //   title: "Error",
        //   text: "Failed to fetch data. Please try again later.",
        //   icon: "error",
        // allowOutsideClick: false,
        // allowEscapeKey: false,
        // showCancelButton: true,
        // confirmButtonText: "Ok",
        // confirmButtonColor: "#d33",
        // cancelButtonText: "No",
        // cancelButtonColor: "#d33",
        // })
      } finally {
        setLoading(false);
      }
    };

    const fetchRecoveryOfficers = async () => {
      try {
        if (userData?.drc_id) {
          const numericDrcId = Number(userData?.drc_id);

          setLoading(true);
          const officers = await getActiveRODetailsByDrcID(numericDrcId);

          if (Array.isArray(officers)) {
            // Map recovery officers with ro_id and other details
            const formattedOfficers = officers.map((officer) => ({
              ro_id: officer.ro_id,
              ro_name: officer.ro_name,
              rtoms_for_ro: officer.rtoms_for_ro || [], // Ensure rtoms_for_ro is never undefined
            }));

            setRecoveryOfficers(formattedOfficers);
            // console.log("Recovery Officers:", formattedOfficers);
          } else {
            console.error("Invalid response format:", officers);
            // Swal.fire({
            //   title: "Error",
            //   text: "Failed to fetch recovery officers. Invalid response format.",
            //   icon: "error",
            // allowOutsideClick: false,
            // allowEscapeKey: false,
            // showCancelButton: true,
            // confirmButtonText: "Ok",
            // confirmButtonColor: "#d33",
            // cancelButtonText: "No",
            // cancelButtonColor: "#d33",
            // })
            setRecoveryOfficers([]);
            // setError("Failed to fetch recovery officers. Invalid response format.");
          }
        } else {
          // setError("DRC ID not found in URL.");
        }
      } catch (error) {
        console.error("Error fetching recovery officers:", error);
        // setError("Failed to fetch recovery officers.");
        // Swal.fire({
        //   title: "Error",
        //   text: "Failed to fetch recovery officers.",
        //   icon: "error",
        // allowOutsideClick: false,
        // allowEscapeKey: false,
        // showCancelButton: true,
        // confirmButtonText: "Ok",
        // confirmButtonColor: "#d33",
        // cancelButtonText: "No",
        // cancelButtonColor: "#d33",
        // })
        setRecoveryOfficers([]); // Set empty array to prevent further errors
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchRecoveryOfficers();

  }, [userData?.drc_id]);



  const handlestartdatechange = (date) => {
    if (date === null) {
      setFromDate(null);
      return;
    }

    if (toDate) {

      if (date > toDate) {

        Swal.fire({
          title: "Warning",
          text: "The 'From' date cannot be later than the 'To' date.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#f1c40f"
        });
        return;
      } else {
        // checkdatediffrence(date, toDate);
        setFromDate(date);
      }

    } else {

      setFromDate(date);

    }


  };
  const handleenddatechange = (date) => {
    if (date === null) {
      setToDate(null);
      return;
    }

    if (fromDate) {
      if (date < fromDate) {
        Swal.fire({
          title: "Warning",
          text: "The 'To' date cannot be before the 'From' date.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#f1c40f"
        });
        return;
      } else {
        // checkdatediffrence(fromDate, date);
        setToDate(date);
      }
    } else {
      setToDate(date);
    }
  };


  // const checkdatediffrence = (startDate, endDate) => {
  //   const start = new Date(startDate).getTime();
  //   const end = new Date(endDate).getTime();
  //   const diffInMs = end - start;
  //   const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  //   const diffInMonths = diffInDays / 30;

  //   if (diffInMonths > 1) {
  //     Swal.fire({
  //       title: "Date Range Exceeded",
  //       text: "The selected dates have more than a 1-month gap.",
  //       icon: "warning",
  //       confirmButtonText: "OK",
  //       confirmButtonColor: "#f1c40f"
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         setToDate(null);
  //         // console.log("Dates cleared");
  //       }
  //     }
  //     );
  //   };
  // };

  const filterValidations = () => {
    if (!selectedArrearsBand && !selectedRTOM && !fromDate && !toDate) {
      Swal.fire({
        title: "Missing Filters",
        text: "Please select at least one filter.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f1c40f"
      });
      return false;
    };


    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Warning",
        text: "Both From Date and To Date must be selected.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "OK",
        confirmButtonColor: "#f1c40f"
      });
      setToDate(null);
      setFromDate(null);
      return false;
    }


    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      Swal.fire({
        title: "Warning",
        text: "To date should be greater than or equal to From date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "OK",
        confirmButtonColor: "#f1c40f"
      });
      setToDate(null);
      setFromDate(null);
      return false;
    };

    return true;
  }

  const callAPI = async (filters) => {
    try {
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };

      const payload = {
        drc_id: Number(userData?.drc_id),
        rtom: filters.selectedRTOM,
        arrears_band: filters.selectedArrearsBand,
        ro_id: filters.selectedRO, // Ensure it's properly assigned
        from_date: formatDate(filters.fromDate),
        to_date: formatDate(filters.toDate),
        pages: filters.currentPage,
      };

      setLoading(true);
      const response = await List_Handling_Cases_By_DRC_Without_RO(payload);

      if (Array.isArray(response)) {
        // setFilteredData(response);
        // setCurrentPage(1); // Reset to first page after filtering
        if (currentPage === 1) {
          setFilteredData(response)
        } else {
          setFilteredData((prevData) => [...prevData, ...response]);
        }

        if (response.length === 0) {
          setIsMoreDataAvailable(false); // No more data available
          if (currentPage === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found.",
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
          if (response.length < maxData) {
            setIsMoreDataAvailable(false); // More data available
          }
        }
      } else {
        // console.error("No valid cases data found in response.");
        Swal.fire({
          title: "Error",
          text: "No valid cases data found in response.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        })
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.drc_id && isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max current page
      // callAPI(); // Call the function whenever currentPage changes
      callAPI({
        ...committedFilters,
        currentPage: currentPage
      });
    }
  }, [currentPage, userData?.drc_id]);

  const handleFilter = () => {
    setSearchQuery(""); // Clear search query on filter
    setIsMoreDataAvailable(true); // Reset to allow fetching more data
    setMaxCurrentPage(0); // Reset max current page
    const IsValid = filterValidations();
    if (!IsValid) {
      return; // Stop if validation fails
    } else {
      setCommittedFilters({
        selectedRTOM: selectedRTOM,
        selectedArrearsBand: selectedArrearsBand,
        selectedRO: selectedRO,
        fromDate: fromDate,
        toDate: toDate,
      });
      setFilteredData([]); // Clear previous data
      if (currentPage === 1) {
        callAPI({
          selectedRTOM: selectedRTOM,
          selectedArrearsBand: selectedArrearsBand,
          selectedRO: selectedRO,
          fromDate: fromDate,
          toDate: toDate,
          currentPage: 1, // Start from page 1
        });
      } else {
        setCurrentPage(1); // Reset to page 1 if filters are applied
      }
    }
  };

  const handleClear = () => {
    setSelectedRTOM("");
    setSelectedArrearsBand("");
    setSelectedRO("");
    setFromDate(null);
    setToDate(null);
    setFilteredData([]);
    setSearchQuery("");
    setSelectAll(false);
    setSelectedRows(new Set());
    setFilteredOfficers(recoveryOfficers); // Reset filtered officers to all officers
    setIsMoreDataAvailable(true); // Reset to allow fetching more data
    setMaxCurrentPage(0); // Reset max current page
    setCommittedFilters({
      selectedRTOM: "",
      selectedArrearsBand: "",
      selectedRO: "",
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

  //Search Logic
  const searchInNestedObject = (obj, query) => {
    if (typeof obj === "string") {
      return obj.toLowerCase().includes(query.toLowerCase());
    }
    if (typeof obj === "number") {
      // Convert number to string and check for the query
      return obj.toString().toLowerCase().includes(query.toLowerCase());
    }
    if (typeof obj === "object" && obj !== null) {
      return Object.values(obj).some((value) => searchInNestedObject(value, query));
    }
    return false;
  };

  const filteredDataBySearch = filteredData.filter((row) =>
    searchInNestedObject(row, searchQuery)
  );


  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredDataBySearch.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredDataBySearch.length / recordsPerPage);

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      if (isMoreDataAvailable) {
        setCurrentPage(currentPage + 1);
      } else {
        if (currentPage < Math.ceil(filteredData.length / recordsPerPage)) {
          setCurrentPage(currentPage + 1);
        }
      }
    }
  };

  // Select All Logic
  const handleSelectAll = () => {
    const isSelectedAll = !selectAll;
    setSelectAll(isSelectedAll);

    if (isSelectedAll) {
      // Add all rows to the selected set
      const allSelected = new Set(currentData.map(item => item.case_id));
      setSelectedRows(allSelected);
    } else {
      // Deselect all rows
      setSelectedRows(new Set());
    }

    // Update filtered officers based on selection
    updateFilteredOfficers(isSelectedAll ? currentData : []);
  };

  //Rows with boxes are checked
  const handleRowSelect = (case_id) => {
    const newSelectedRows = new Set(selectedRows);

    if (newSelectedRows.has(case_id)) {
      newSelectedRows.delete(case_id);
    } else {
      if (newSelectedRows.size >= 5) {
        Swal.fire({
          title: "Limit Reached",
          text: "You can select a maximum of 5 rows at a time.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#f1c40f"
        });
        return;
      }
      newSelectedRows.add(case_id);
    }

    setSelectedRows(newSelectedRows);

    // Update filtered officers based on selected rows
    const selectedItems = currentData.filter(item => newSelectedRows.has(item.case_id));
    updateFilteredOfficers(selectedItems);

    // Update select all checkbox state
    setSelectAll(newSelectedRows.size === currentData.length);
  };

  // Filter Recovery Officers based on selected RTOM Areas
  const updateFilteredOfficers = (selectedItems) => {
    if (selectedItems.length === 0) {
      setFilteredOfficers(recoveryOfficers);
      return;
    }

    // Get RTOM areas of the selected rows
    const selectedAreas = selectedItems.map((item) => item.area);

    // Filter officers who have matching RTOM areas
    const officers = recoveryOfficers.filter((officer) => {
      return officer.rtoms_for_ro && Array.isArray(officer.rtoms_for_ro) &&
        officer.rtoms_for_ro.some(rtom => selectedAreas.some(area => area.toLowerCase() === rtom.name.toLowerCase()));
    });

    setFilteredOfficers(officers);

    // Reset selected RO if it's no longer in the filtered list
    if (selectedRO && !officers.some(officer => officer.ro_id.toString() === selectedRO.toString())) {
      setSelectedRO("");
    }
  };

  // Update filtered officers when selected rows change
  useEffect(() => {
    const selectedItems = filteredData.filter(item => selectedRows.has(item.case_id));
    updateFilteredOfficers(selectedItems);
  }, [selectedRows]);

  // Initialize filtered officers with all officers
  useEffect(() => {
    setFilteredOfficers(recoveryOfficers);
  }, [recoveryOfficers]);

  const handleSubmit = async () => {
    try {
      if (!selectedRO) {
        Swal.fire({
          title: "Error",
          text: "No Recovery Officer selected!",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        });
        return;
      }

      if (!selectedRows || selectedRows.size === 0) {
        Swal.fire({
          title: "Error",
          text: "Please select at least one row before submitting!",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        });
        return;
      }

      // Find the selected recovery officer by ro_id
      const selectedOfficer = recoveryOfficers.find((officer) => officer.ro_id.toString() === selectedRO.toString());

      if (!selectedOfficer) {
        Swal.fire({
          title: "Error",
          text: "Selected Recovery Officer not found!",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        });
        return;
      }

      const ro_id = selectedOfficer.ro_id;

      if (!ro_id) {
        Swal.fire({
          title: "Error",
          text: "Recovery Officer ID is missing.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonColor: "#d33",
        });
        return;
      }

      const selectedCaseIds = Array.from(selectedRows);

      if (selectedCaseIds.length === 0) {
        Swal.fire({
          title: "Error",
          text: "No cases selected!",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonColor: "#d33",
        });
        return;
      }

      const userId = await getLoggedUserId();

      // Create the payload object with all required parameters
      const assignmentPayload = {
        caseIds: selectedCaseIds,
        drcId: userData?.drc_id,
        roId: ro_id,
        assigned_by: userId, // Include assigned_by in the payload
      };

      // Update the API call to pass the complete payload
      const response = await assignROToCase(assignmentPayload);

      if (response.details?.failed_cases?.length > 0) {
        Swal.fire({
          title: "Error",
          text: "The RTOM area does not match any RTOM area assigned to Recovery Officer",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        });
        return;
      }

      if (response.status === 'success') {
        Swal.fire({
          title: "Success",
          text: "Cases assigned successfully!",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#28a745"
        });
        navigate(`/drc/assigned-ro-case-log`);
      } else {
        Swal.fire({
          title: "Error",
          text: response.message || "An error occurred while assigning cases.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Ok",
          confirmButtonColor: "#d33",
        });
      }

    } catch (error) {
      // console.error("Error in handleSubmit:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while assigning cases.",
        icon: "error",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "Ok",
        confirmButtonColor: "#d33",
      });
    }
  };

  // const getStatusIcon = (status) => {
  //   if (!status) return <span className="text-gray-500">N/A</span>;

  //   switch (status.toLowerCase()) {
  //     case "open no agent":
  //       return <img src={Open_No_Agent} alt="Open No Agent" title="Open No Agent" className="w-5 h-5" />;
  //     case "open with agent":
  //       return <img src={Open_With_Agent} alt="Open With Agent" title="Open With Agent" className="w-5 h-5" />;
  //     case "negotiation settle pending":
  //       return <img src={Negotiation_Settle_Pending} alt="Negotiation Settle Pending" title="Negotiation Settle Pending" className="w-5 h-5" />;
  //     case "negotiation settle open pending":
  //       return <img src={Negotiation_Settle_Open_Pending} alt="Negotiation Settle Open Pending" title="Negotiation Settle Open Pending" className="w-5 h-5" />;
  //     case "negotiation settle active":
  //       return <img src={Negotiation_Settle_Active} alt="Negotiation Settle Active" title="Negotiation Settle Active" className="w-5 h-5" />;
  //     case "fmb":
  //       return <img src={FMB} alt="FMB" title="FMB" className="w-5 h-5" />;
  //     case "fmb settle pending":
  //       return <img src={FMB_Settle_Pending} alt="FMB Settle Pending" title="FMB Settle Pending" className="w-5 h-5" />;
  //     case "fmb settle open pending":
  //       return <img src={FMB_Settle_Open_Pending} alt="FMB Settle Open Pending" title="FMB Settle Open Pending" className="w-5 h-5" />;
  //     case "fmb settle active":
  //       return <img src={FMB_Settle_Active} alt="FMB Settle Active" title="FMB Settle Active" className="w-5 h-5" />;
  //     default:
  //       return <span className="text-gray-500">N/A</span>;
  //   }
  // };

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
          <img
            src={iconPath}
            alt={status}
            className="w-6 h-6"
            data-tooltip-id={tooltipId}
          />
        </div>
        <Tooltip id={tooltipId} className="tooltip" effect="solid" place="bottom" content={status} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Distribution</h1>

      <div className={`${GlobalStyle.cardContainer} w-full`}>
        <div className="flex flex-wrap  xl:flex-nowrap items-center justify-end w-full space-x-3 gap-3">

          {/* RTOM Select Dropdown */}
          <select
            className={GlobalStyle.selectBox}
            value={selectedRTOM}
            onChange={(e) => {
              const selectedAreaName = e.target.value;
              setSelectedRTOM(selectedAreaName);
            }}
            style={{ color: selectedRTOM === "" ? "gray" : "black" }}
          >
            <option value="" hidden>Billing Center</option>
            {rtoms.length > 0 ? (
              rtoms.map((rtom) => (
                <option key={rtom.rtom_id} value={rtom.area_name} style={{ color: "black" }}>
                  {rtom.area_name}
                </option>
              ))
            ) : (
              <option disabled>No Billing Centers found</option>
            )}
          </select>


          {/* Arrears Band Select Dropdown */}
          <select
            className={GlobalStyle.selectBox}
            value={selectedArrearsBand}
            onChange={(e) => setSelectedArrearsBand(e.target.value)}
            style={{ color: selectedArrearsBand === "" ? "gray" : "black" }}
          >
            <option value="" hidden>Arrears Band</option>
            {arrearsAmounts.length > 0 ? (
              arrearsAmounts.map((band, index) => (
                <option key={index} value={band.key} style={{ color: "black" }}>
                  {band.value}
                </option>
              ))
            ) : (
              <option value="">Loading...</option>
            )}
          </select>

          {/* Date Picker */}
          <label className={GlobalStyle.dataPickerDate}>Date</label>
          <DatePicker
            selected={fromDate}
            onChange={handlestartdatechange}
            dateFormat="dd/MM/yyyy"
            placeholderText="From"
            className={GlobalStyle.inputText}
          />
          <DatePicker
            selected={toDate}
            onChange={handleenddatechange}
            dateFormat="dd/MM/yyyy"
            placeholderText="To"
            className={GlobalStyle.inputText}
          />

          {/* Filter Button */}
          <button onClick={handleFilter} className={`${GlobalStyle.buttonPrimary}`}>
            Filter
          </button>
          <button onClick={handleClear} className={`${GlobalStyle.buttonRemove}`}>
            Clear
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex justify-start mb-4">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            placeholder=""
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
      <div className={`${GlobalStyle.tableContainer} mt-6 overflow-x-auto`}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>
                {/* <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mx-auto"
                  disabled={currentData.length === 0}
                /> */}
              </th>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>DRC Assigned Date</th>
              <th className={GlobalStyle.tableHeader}>Amount (LKR)</th>
              <th className={GlobalStyle.tableHeader}>Action</th>
              <th className={GlobalStyle.tableHeader}>Billing Center</th>
              {/* <th className={GlobalStyle.tableHeader}>RO</th> */}
              <th className={GlobalStyle.tableHeader}>Expire Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData && currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={item.case_id || index} // Use case_id if available, else fallback to index
                  className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                >
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(item.case_id)}
                      onChange={() => handleRowSelect(item.case_id)}
                      className="mx-auto"
                    />
                  </td>
                  <td className={GlobalStyle.tableData}> {item.case_id || ""} </td>
                  <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>{renderStatusIcon(item.status, index)}</td>
                  <td className={GlobalStyle.tableData}> {item.created_dtm
                    ? new Date(item.created_dtm).toLocaleDateString("en-GB")
                    : ""} </td>
                  <td className={GlobalStyle.tableCurrency}> {item.current_arrears_amount || ""} </td>
                  <td className={GlobalStyle.tableData}> {item.action_type || ""} </td>
                  <td className={GlobalStyle.tableData}> {item.area || ""} </td>
                  {/* <td className={GlobalStyle.tableData}> {item.ro_name || ""} </td> */}
                  <td className={GlobalStyle.tableData}>  {item.expire_dtm
                    ? new Date(item.expire_dtm).toLocaleDateString("en-GB")
                    : ""}  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>No cases available</td>
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
            disabled={currentPage === 1}
            className={`${GlobalStyle.navButton} ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
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
                ? currentPage >= Math.ceil(filteredDataBySearch.length / recordsPerPage)
                : !isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / recordsPerPage
                )}
            className={`${GlobalStyle.navButton} ${(searchQuery
              ? currentPage >= Math.ceil(filteredDataBySearch.length / recordsPerPage)
              : !isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / recordsPerPage))
              ? "cursor-not-allowed opacity-50"
              : ""
              }`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {/* RO Selection and Submit Section */}
      <div className="flex justify-end gap-4 mt-4">
        {/* Recovery Officer (RO) Select Dropdown */}
        <select
          id="ro-select"
          className={GlobalStyle.selectBox}
          value={selectedRO}
          onChange={(e) => setSelectedRO(e.target.value)}
          disabled={selectedRows.size === 0}
          style={{ color: selectedRO === "" ? "gray" : "black" }}
        >
          <option value="" hidden>Select RO</option>
          {filteredOfficers.length > 0 ? filteredOfficers.map((officer) => (
            <option key={officer.ro_id} value={officer.ro_id} style={{ color: "black" }}>
              {/* {officer.ro_name} - {officer.rtoms_for_ro.map(rtom => rtom.name).join(", ")} */}
              {officer.ro_name}
            </option>
          )) : (
            <option value="" disabled>No Recovery Officers available</option>
          )}
        </select>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`${GlobalStyle.buttonPrimary} ${selectedRows.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={selectedRows.size === 0}
        >
          Submit
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`${GlobalStyle.buttonPrimary} mt-4`}
      >
        <FaArrowLeft className="mr-2" />
      </button>
    </div>
  );
};

export default DistributeTORO;