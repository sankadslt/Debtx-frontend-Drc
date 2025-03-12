import React from "react";
import { Link } from "react-router-dom";

const Logs = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="mb-8 text-4xl text-center font-poppins"> DRC Logs</h2>

      {/* DRC Labels */}
      <div className="flex flex-col items-center space-y-4">
        <Link to="/drc/assigned-case-list-for-drc">
          <label className="text-lg font-medium cursor-pointer hover:text-blue-500">
            Assigned case list for DRC
          </label>
        </Link>
        <Link to="/drc/ro-monitoring-arrears">
          <label className="text-lg font-medium cursor-pointer hover:text-blue-500">
            RO Monitoring (Arrears) and RO Monitoring (CPE)
          </label>
        </Link>
        <Link to="/pages/DRC/Re-AssignRo">
          <label className="text-lg font-medium cursor-pointer hover:text-blue-500">
            Re_AssignRo
          </label>
        </Link>
        <Link to="/pages/DRC/Mediation Board Response">
          <label className="text-lg font-medium cursor-pointer hover:text-blue-500">
            Mediation Board Response
          </label>
        </Link>

        <Link to="/drc/ro-s-assigned-case-log">
          <label className="text-lg font-medium cursor-pointer hover:text-blue-500">
            RO's Assigned case log
          </label>
        </Link>

        <Link to="/drc/mediation-board-case-list">
          <label className="text-lg font-medium cursor-pointer hover:text-blue-500">
            Mediation Board case List
          </label>
        </Link>

        <Link to="/drc/assigned-ro-case-log">
          <label className="text-lg font-medium cursor-pointer hover:text-blue-500">
            Assigned RO case log
          </label>
        </Link>
        <Link to="/pages/DRC/EditCustomerProfile">
          <label className="text-lg font-medium cursor-pointer hover:text-blue-500">
            Edit customer profile
          </label>
        </Link>
        <Link to="/drc/customer-negotiation">
          <label className="text-lg font-medium cursor-pointer hover:text-blue-500">
          Customer Negotiation
          </label>
        </Link> 
      </div>
    </div>
  );
};

export default Logs;
