import { Routes, Route } from "react-router-dom";

import Login from "../components/Login";
import Register from "../components/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import Unauthorized from "../components/Unauthorized";
import GoogleRedirect from "../components/GoogleRedirect";
import UserProfile from "../pages/userProfile";
import CreateTask from "../pages/createTasks";
import Dashboard from "../pages/Dashboard";
import PrototypeA from "../assets/prototype/prototypeA";
import PrototypeB from "../assets/prototype/prototypeB";
import PrototypeC from "../assets/prototype/prototypeC";

{
  /* Distribute Imports */
}
import DistributeTORO from "../pages/Distribute/DistributeTORO";

{
  /* DRC Imports */
}
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
import DummyPage from "../pages/DummyPage";
import EditCPECollect from "../pages/DRC/EditCPECollect";

import RODRCUserList from "../pages/RO/RO_DRCUserList";
import RODRCUserInfo from "../pages/RO/RO_DRCUserInfo";
import RODRCUserInfoEnd from "../pages/RO/RO_DRCUserInfoEnd";
import RODRCUserInfoEdit from "../pages/RO/RO_DRCUserInfoEdit";
import RO_ADDro from "../pages/RO/RO_ADDro";
import Pre_Negotiation from "../pages/DRC/Pre_Negotiation";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/create-task" element={<CreateTask />} />
      <Route path="/google-login" element={<GoogleRedirect />} />

      <Route
        path="/dummy-page"
        element={
          <ProtectedRoute
            element={<DummyPage />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* Prototype Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            element={<Dashboard />}
            allowedRoles={["superadmin", "drc_user", "drc_admin"]}
          />
        }
      />
      <Route
        path="/prototypeA"
        element={
          <ProtectedRoute
            element={<PrototypeA />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/prototypeB"
        element={
          <ProtectedRoute
            element={<PrototypeB />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/prototypeC"
        element={
          <ProtectedRoute
            element={<PrototypeC />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* Distribute Routes 2.2 */}

      <Route
        path="/pages/Distribute/DistributeTORO"
        element={
          <ProtectedRoute
            element={<DistributeTORO />}
            allowedRoles={["superadmin", "drc_user", "DRC-Coordinator"]}
          />
        }
      />

      {/* DRC Routes */}
      <Route
        path="/dummy"
        element={
          <ProtectedRoute element={<Dummy />} allowedRoles={["superadmin"]} />
        }
      />

      {/* DRC Routes for 2.1 to 2.5 - Distribute to RO*/}
      <Route
        path="/drc/assigned-case-list-for-drc"
        element={
          <ProtectedRoute
            element={<AssignedCaseListforDRC />}
            allowedRoles={["superadmin", "drc_user", "DRC-Coordinator"]}
          />
        }
      />
      {/* <Route path="/drc/assigned-case-list-for-drc/:drc_id" element={<ProtectedRoute element={<AssignedCaseListforDRC />} allowedRoles={['superadmin']} />} /> */}
      {/* <Route path="/drc/ro-monitoring-arrears" element={<ProtectedRoute element={<RO_Monitoring />} allowedRoles={['superadmin', 'drc_user', 'drc_admin', 'admin']} />} /> */}
      <Route
        path="/drc/ro-monitoring-arrears"
        element={
          <ProtectedRoute
            element={<RO_Monitoring />}
            allowedRoles={["superadmin", "drc_user", "DRC-Coordinator"]}
          />
        }
      />
      <Route
        path="/drc/assigned-ro-case-log"
        element={
          <ProtectedRoute
            element={<AssignedROcaselog />}
            allowedRoles={["superadmin", "drc_user", "DRC-Coordinator"]}
          />
        }
      />
      {/* <Route path="/drc/assigned-ro-case-log/:drc_id" element={<ProtectedRoute element={<AssignedROcaselog />} allowedRoles={['superadmin']} />} /> */}
      {/* <Route path="/pages/DRC/Re-AssignRo" element={<ProtectedRoute element={<Re_AssignRo />} allowedRoles={['superadmin']} />} /> */}
      <Route
        path="/pages/DRC/Re-AssignRo"
        element={
          <ProtectedRoute
            element={<Re_AssignRo />}
            allowedRoles={["superadmin", "drc_user", "DRC-Coordinator"]}
          />
        }
      />

      {/* DRC/RO Routes for 2.15 to 2.16 - Mediation Board*/}
      <Route
        path="/drc/mediation-board-case-list"
        element={
          <ProtectedRoute
            element={<MediationBoardcaselist />}
            allowedRoles={["superadmin", "drc_user", "RO", "DRC-Coordinator"]}
          />
        }
      />
      {/* <Route path="/drc/mediation-board-case-list/:drc_id" element={<ProtectedRoute element={<MediationBoardcaselist />} allowedRoles={['superadmin', 'drc_user', 'drc_admin', 'user']} />} /> */}
      {/* <Route path="/pages/DRC/Mediation Board Response" element={<ProtectedRoute element={<Mediation_board_response />} allowedRoles={['superadmin', 'drc_user', 'drc_admin', 'user']} />} /> */}
      <Route
        path="/pages/DRC/Mediation Board Response"
        element={
          <ProtectedRoute
            element={<Mediation_board_response />}
            allowedRoles={["superadmin", "drc_user", "RO", "DRC-Coordinator"]}
          />
        }
      />

      {/* DRC/RO Routes for 2.6 to 2.7.1 - Negotiation*/}
      <Route
        path="/drc/ro-s-assigned-case-log"
        element={
          <ProtectedRoute
            element={<ROsAssignedcaseLog />}
            allowedRoles={["superadmin", "drc_user", "RO", "DRC-Coordinator"]}
          />
        }
      />
      {/* <Route path="/drc/ro-s-assigned-case-log" element={<ProtectedRoute element={<ROsAssignedcaseLog />} allowedRoles={['superadmin']} />} /> */}
      <Route
        path="/pages/DRC/EditCustomerProfile"
        element={
          <ProtectedRoute
            element={<EditCustomerProfile />}
            allowedRoles={["superadmin", "drc_user", "RO", "DRC-Coordinator"]}
          />
        }
      />
      <Route
        path="/drc/customer-negotiation"
        element={
          <ProtectedRoute
            element={<CustomerNegotiation />}
            allowedRoles={["superadmin", "drc_user", "RO", "DRC-Coordinator"]}
          />
        }
      />
      {/* <Route path="/drc/customer-negotiation-editcpe" element={<ProtectedRoute element={<EditCPECollect />} allowedRoles={['superadmin']} />} /> */}

      <Route
        path="/drc/customer-negotiation-editcpe"
        element={
          <ProtectedRoute
            element={<EditCPECollect />}
            allowedRoles={["superadmin", "drc_user", "RO", "DRC-Coordinator"]}
          />
        }
      />

      <Route
        path="/ro/ro-drc-user-list"
        element={
          <ProtectedRoute
            element={<RODRCUserList />}
            allowedRoles={["drc_user", "DRC-Coordinator"]}
          />
        }
      />
      <Route
        path="/ro/ro-drc-user-info"
        element={
          <ProtectedRoute
            element={<RODRCUserInfo />}
            allowedRoles={["drc_user", "DRC-Coordinator"]}
          />
        }
      />
      <Route
        path="/ro/ro-drc-user-info-end"
        element={
          <ProtectedRoute
            element={<RODRCUserInfoEnd />}
            allowedRoles={["drc_user", "DRC-Coordinator"]}
          />
        }
      />
      <Route
        path="/ro/ro-drc-user-info-edit"
        element={
          <ProtectedRoute
            element={<RODRCUserInfoEdit />}
            allowedRoles={["drc_user", "DRC-Coordinator"]}
          />
        }
      />
      <Route
        path="/ro/ro-add-ro"
        element={
          <ProtectedRoute
            element={<RO_ADDro />}
            allowedRoles={["drc_user", "DRC-Coordinator"]}
          />
        }
      />

      <Route
        path="/drc/Pre_Negotiation"
        element={
          <ProtectedRoute
            element={<Pre_Negotiation />}
            allowedRoles={["superadmin", "drc_user", "RO", "DRC-Coordinator"]}
          />
        }
      />
    </Routes>
  );
};

export default Routers;
