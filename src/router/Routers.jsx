import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import PrototypeA from "../assets/prototype/prototypeA";
import PrototypeB from "../assets/prototype/prototypeB";
import PrototypeC from "../assets/prototype/prototypeC";


import RecoveryOfficerRequests from "../pages/Request/additiional_request_log";


import ForwardMediationBoard from "../pages/Request/ForwardMediationBoard";
import ValidityPeriodExtension from "../pages/Request/ValidityPeriodExtension";
import RequestResponseLog from "../pages/Request/RequestResponseLog";




import Case_List from "../pages/Incident/Case_List";
import Incident_List from "../pages/Incident/Incident_List";
import CaseDetails from "../pages/Incident/Case_Details";
import Incident_Register_Individual from "../pages/Incident/Incident_Register_Individual";
import SupBulkUploadLog from "../pages/Incident/sup_bulk_upload_LOG";
import Incident_Register_Bulk_Upload from "../pages/Incident/Incident_Register_Bulk_Upload";
import Incident_File_Download from "../pages/Incident/Incident_File_Download";
import PageButton from "../pages/Incident/page_button";



 {/* Distribute Imports */}
 import AssignDRC from "../pages/Distribute/AssignDRC";
 import AssignDRCForCollectCPE from "../pages/Distribute/AssignDRCForCollectCPE";
 import AssignDRCsLOG from "../pages/Distribute/AssignDRCsLOG";
 import AssignedDRCSummary from "../pages/Distribute/AssignedDRCSummary";
 import AssignedDRCSummaryCollectCPE from "../pages/Distribute/AssignedDRCSummaryCollectCPE";
 import DistributionPreparationBulkUpload from "../pages/Distribute/DistributionPreparationBulkUpload";
 import DistributionPreparationOnlyCPECollect from "../pages/Distribute/DistributionPreparationOnlyCPECollect";
 import DRCAssignManagerApproval from "../pages/Distribute/DRCAssignManagerApproval";
 import IncidentFilter from "../pages/Distribute/IncidentFilter";
 import ReAssignDRC from "../pages/Distribute/ReAssignDRC";
 import DistributeDummy from "../pages/Distribute/DistributeDummy";
 import DistributeTORO from "../pages/Distribute/DistributeTORO";


import Dummy from "../pages/DRC/Dummy";
import AssignedCaseListforDRC from "../pages/DRC/Assigned case list for DRC";
import RO_Monitoring from "../pages/DRC/RO Monitoring (Arrears) and (CPE)";
import Re_AssignRo from "../pages/DRC/Re-AssignRo";
import Mediation_board_response from "../pages/DRC/Mediation Board Response";
import ROsAssignedcaseLog from "../pages/DRC/RO's Assigned case log";
import MediationBoardcaselist from "../pages/DRC/Mediation Board case list";
import AssignedROcaselog from "../pages/DRC/Assigned RO case log";
import EditCustomerProfile from "../pages/DRC/EditCustomerProfile";
import CustomerNegotiation from "../pages/DRC/Cus_Nego_Customer_Negotiation";



const Routers = () => {
  return (
    <Routes>
      {/* Prototype Routes */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/prototypeA" element={<PrototypeA />} />
      <Route path="/prototypeB" element={<PrototypeB />} />
      <Route path="/prototypeC" element={<PrototypeC />} />


      <Route path="/additional_request_log" element={<RecoveryOfficerRequests />} />


      <Route path="/drc/mediation-board" element={<ForwardMediationBoard />} />
      <Route path="/drc/period-extension" element = {<ValidityPeriodExtension/>}/>
      <Route path="/drs/logs/reuest-response-logs" element = {<RequestResponseLog/>}/>


{/* incient team4 */}
      <Route path="/incident" element={<PageButton />} />
      <Route path="/Incident/Case_List" element={<Case_List />} />
      <Route path="/Incident/Incident_List" element={<Incident_List />} />
      <Route path="/Incident/Case_Details" element={<CaseDetails />} />
      <Route path="/incident/register" element={<Incident_Register_Individual />} />
      <Route path="/incident/upload-log" element={<SupBulkUploadLog />} />
      <Route path="/incident/register-bulk" element={<Incident_Register_Bulk_Upload />} />
      <Route path="/incident/file-download" element={<Incident_File_Download />} />



      
     {/* Distribute Routes */}
     <Route path="/pages/Distribute/AssignDRC" element={<AssignDRC/>} />
     <Route path="/pages/Distribute/AssignDRCForCollectCPE" element={<AssignDRCForCollectCPE/>} />
     <Route path="/pages/Distribute/AssignDRCsLOG" element={<AssignDRCsLOG />} />
     <Route path="/pages/Distribute/AssignedDRCSummary" element={<AssignedDRCSummary />} />
     <Route path="/pages/Distribute/AssignedDRCSummaryCollectCPE" element={<AssignedDRCSummaryCollectCPE/>} />
     <Route path="/pages/Distribute/DistributionPreparationBulkUpload" element={<DistributionPreparationBulkUpload />} />
     <Route path="/pages/Distribute/DistributionPreparationOnlyCPECollect" element={<DistributionPreparationOnlyCPECollect />} />
     <Route path="/pages/Distribute/DRCAssignManagerApproval" element={<DRCAssignManagerApproval />} />
     <Route path="/pages/Distribute/IncidentFilter" element={<IncidentFilter />} />
     <Route path="/pages/Distribute/DistributeDummy" element={<DistributeDummy />} />
     <Route path="/pages/Distribute/ReAssignDRC" element={<ReAssignDRC />} />
     <Route path="/pages/Distribute/DistributeTORO" element={<DistributeTORO />} />


      {/* DRC Routes */}
      <Route path="/dummy" element={<Dummy />} />
      <Route
        path="/drc/assigned-case-list-for-drc"
        element={<AssignedCaseListforDRC />}
      />
      <Route path="/drc/ro-monitoring-arrears" element={<RO_Monitoring />} />
      <Route path="/pages/DRC/Re-AssignRo" element={<Re_AssignRo />} />
      <Route
        path="/pages/DRC/Mediation Board Response"
        element={<Mediation_board_response />}
      />
      <Route
        path="/drc/ro-s-assigned-case-log"
        element={<ROsAssignedcaseLog />}
      />
      <Route
        path="/drc/mediation-board-case-list"
        element={<MediationBoardcaselist />}
      />
      <Route path="/drc/assigned-ro-case-log" element={<AssignedROcaselog />} />
      <Route
        path="/pages/DRC/EditCustomerProfile"
        element={<EditCustomerProfile />}
      />
      <Route
        path="/drc/customer-negotiation"
        element={<CustomerNegotiation />}
      />



    </Routes>
  );
};

export default Routers;
