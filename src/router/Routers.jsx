import { Routes, Route } from "react-router-dom";

import Login from "../components/Login";
import Register from "../components/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import Unauthorized from "../components/Unauthorized";

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

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized/>} />

      {/* Prototype Routes */}
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={['superadmin']} />} />
      <Route path="/prototypeA" element={<ProtectedRoute element={<PrototypeA />} allowedRoles={['superadmin']} />} />
      <Route path="/prototypeB" element={<ProtectedRoute element={<PrototypeB />} allowedRoles={['superadmin']} />} />
      <Route path="/prototypeC" element={<ProtectedRoute element={<PrototypeC />} allowedRoles={['superadmin']} />} />

      <Route path="/additional_request_log" element={<ProtectedRoute element={<RecoveryOfficerRequests />} allowedRoles={['superadmin']} />} />

      <Route path="/drc/mediation-board" element={<ProtectedRoute element={<ForwardMediationBoard />} allowedRoles={['superadmin']} />} />
      <Route path="/drc/period-extension" element={<ProtectedRoute element = {<ValidityPeriodExtension/>} allowedRoles={['superadmin']} />} />
      <Route path="/drs/logs/reuest-response-logs" element={<ProtectedRoute element = {<RequestResponseLog/>} allowedRoles={['superadmin']} />}/>

      {/* incient team4 */}
      <Route path="/incident" element={<ProtectedRoute element={<PageButton />} allowedRoles={['superadmin']} />} />
      <Route path="/Incident/Case_List" element={<ProtectedRoute element={<Case_List />} allowedRoles={['superadmin']} />} />
      <Route path="/Incident/Incident_List" element={<ProtectedRoute element={<Incident_List />} allowedRoles={['superadmin']} />} />
      <Route path="/Incident/Case_Details" element={<ProtectedRoute element={<CaseDetails />} allowedRoles={['superadmin']} />} />
      <Route path="/incident/register" element={<ProtectedRoute element={<Incident_Register_Individual />} allowedRoles={['superadmin']} />} />
      <Route path="/incident/upload-log" element={<ProtectedRoute element={<SupBulkUploadLog />} allowedRoles={['superadmin']} />} />
      <Route path="/incident/register-bulk" element={<ProtectedRoute element={<Incident_Register_Bulk_Upload />} allowedRoles={['superadmin']} />} />
      <Route path="/incident/file-download" element={<ProtectedRoute element={<Incident_File_Download />} allowedRoles={['superadmin']} />} />

     {/* Distribute Routes */}
     <Route path="/pages/Distribute/AssignDRC" element={<ProtectedRoute element={<AssignDRC/>} allowedRoles={['superadmin']} />} />
     <Route path="/pages/Distribute/AssignDRCForCollectCPE" element={<ProtectedRoute element={<AssignDRCForCollectCPE/>} allowedRoles={['superadmin']} />} />
     <Route path="/pages/Distribute/AssignDRCsLOG" element={<ProtectedRoute element={<AssignDRCsLOG />} allowedRoles={['superadmin']} />} />
     <Route path="/pages/Distribute/AssignedDRCSummary" element={<ProtectedRoute element={<AssignedDRCSummary />} allowedRoles={['superadmin']} />} />
     <Route path="/pages/Distribute/AssignedDRCSummaryCollectCPE" element={<ProtectedRoute element={<AssignedDRCSummaryCollectCPE/>} allowedRoles={['superadmin']} />} />
     <Route path="/pages/Distribute/DistributionPreparationBulkUpload" element={<ProtectedRoute element={<DistributionPreparationBulkUpload />} allowedRoles={['superadmin']} />} />
     <Route path="/pages/Distribute/DistributionPreparationOnlyCPECollect" element={<ProtectedRoute element={<DistributionPreparationOnlyCPECollect />} allowedRoles={['superadmin']} />} />
     <Route path="/pages/Distribute/DRCAssignManagerApproval" element={<ProtectedRoute element={<DRCAssignManagerApproval />} allowedRoles={['superadmin']} />} />
     <Route path="/pages/Distribute/IncidentFilter" element={<ProtectedRoute element={<IncidentFilter />} allowedRoles={['superadmin']} />} />
     <Route path="/pages/Distribute/DistributeDummy" element={<ProtectedRoute element={<DistributeDummy />} allowedRoles={['superadmin']} />} />
     <Route path="/pages/Distribute/ReAssignDRC" element={<ProtectedRoute element={<ReAssignDRC />} allowedRoles={['superadmin']} />} />
     <Route path="/pages/Distribute/DistributeTORO" element={<ProtectedRoute element={<DistributeTORO />} allowedRoles={['superadmin']} />} />

      {/* DRC Routes */}
      <Route path="/dummy" element={<ProtectedRoute element={<Dummy />} allowedRoles={['superadmin']} />} />
      <Route path="/drc/assigned-case-list-for-drc" element={<ProtectedRoute element={<AssignedCaseListforDRC />} allowedRoles={['superadmin']} />} />
      <Route path="/drc/ro-monitoring-arrears" element={<ProtectedRoute element={<RO_Monitoring />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/DRC/Re-AssignRo" element={<ProtectedRoute element={<Re_AssignRo />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/DRC/Mediation Board Response" element={<ProtectedRoute element={<Mediation_board_response />} allowedRoles={['superadmin']} />} />
      <Route path="/drc/ro-s-assigned-case-log" element={<ProtectedRoute element={<ROsAssignedcaseLog />} allowedRoles={['superadmin']} />} />
      <Route path="/drc/mediation-board-case-list" element={<ProtectedRoute element={<MediationBoardcaselist />} allowedRoles={['superadmin']} />} />
      <Route path="/drc/assigned-ro-case-log" element={<ProtectedRoute element={<AssignedROcaselog />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/DRC/EditCustomerProfile" element={<ProtectedRoute element={<EditCustomerProfile />} allowedRoles={['superadmin']} />} />
      <Route path="/drc/customer-negotiation" element={<ProtectedRoute element={<CustomerNegotiation />} allowedRoles={['superadmin']} />} />

    </Routes>
  );
};

export default Routers;
