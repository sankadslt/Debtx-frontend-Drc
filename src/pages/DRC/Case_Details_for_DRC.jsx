import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import { listCaseDetailsForDRC } from "../../services/case/CaseService";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

export default function CaseDetailsForDRC() {
  const location = useLocation();
  const navigate = useNavigate();
  const { caseId, drc_id, ro_id } = location.state || {};

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Toggle section states - start collapsed so sections only show after click
  const [showContactSection, setShowContactSection] = useState(false);
  const [showRefProducts, setShowRefProducts] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    if (caseId && drc_id) {
      const fetchData = async () => {
        try {
          const payload = { caseId, drc_id, ro_id };
          const response = await listCaseDetailsForDRC(payload);
          console.log("Response from API:", response);

          if (
            response?.success &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            setCaseData(response.data[0]);
          } else {
            setCaseData(null);
          }
        } catch (error) {
          console.error("Error fetching case details:", error);
          setCaseData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [caseId, drc_id, ro_id]);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("en-GB") : "";

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-blue-600 font-semibold">Loading case details...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 font-semibold">No case details found</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className={GlobalStyle.headingLarge}>Case Details</h1>

        {/* === Case Summary Card === */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 text-gray-700">
            <Field label="Case ID" value={caseData.case_id} />
            <Field label="Account Number" value={caseData.account_no} />
            <Field label="Service Status" value={caseData.Service_Type} />
            <Field label="Customer Type Name" value={caseData.customer_type} />
            <Field label="Customer Segment" value={caseData.customer_segment} />
            <Field label="Account Manager" value={caseData.account_manager} />
            <Field
              label="Last Payment Date"
              value={formatDate(caseData.last_payment_date)}
            />
            <Field label="Area" value={caseData.area} />
            <Field label="Action Type" value={caseData.action_type} />
            <Field
              label="Current Arrears"
              value={caseData.current_arrears_amount}
            />
            <Field label="Source" value={caseData.event_source} />
          </div>
        </div>

        {/* === Contact Information Section === */}
        <div className="mt-6 border rounded-2xl shadow-sm">
          <button
            onClick={() => setShowContactSection(!showContactSection)}
            className="w-full flex justify-between items-center bg-[#0c1b5f] text-white px-4 py-3 rounded-t-2xl"
          >
            <span className="font-semibold text-lg">Contact Information</span>
            {showContactSection ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showContactSection && (
            <div className="p-5 bg-white grid md:grid-cols-2 gap-x-10 gap-y-4 text-gray-700">
              <Field
                label="Customer NIC"
                value={
                  caseData.current_customer_identification
                    ?.filter((id) => id.Identification_type === "NIC")
                    .map((id) => id.contact)
                    .join(", ") || "-"
                }
              />
              <Field
                label="Customer Mobile"
                value={
                  caseData.current_contact_details
                    ?.filter((c) => c.contact_type === "Mobile")
                    .map((c) => c.contact)
                    .join(", ") || "-"
                }
              />
              <Field
                label="Service Address"
                value={caseData.contact?.[0]?.address || "-"}
              />
            </div>
          )}
        </div>


{/* === Reference Products Section === */}
{(caseData.ref_products || []).length > 0 && (
  <div className="mt-6 border rounded-2xl shadow-sm">
    <button
      onClick={() => {
        setShowRefProducts(!showRefProducts);
        setCurrentProductIndex(0); // Reset to first product when toggling
      }}
      className="w-full flex justify-between items-center bg-[#0c1b5f] text-white px-4 py-3 rounded-t-2xl"
    >
      <span className="font-semibold text-lg">Reference Products</span>
      {showRefProducts ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>

    {showRefProducts && (
      <div className="p-6 bg-white">
        {/* Progress counter (dots removed) */}
        <div className="flex justify-end items-center mb-6">
          <p className="text-sm text-gray-600 font-medium">
            {currentProductIndex + 1} of {caseData.ref_products.length}
          </p>
        </div>

        {/* Current Product */}
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {caseData.ref_products[currentProductIndex].Product_Label || 
               caseData.ref_products[currentProductIndex].Product_Name || 
               `Product ${currentProductIndex + 1}`}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 text-gray-700">
            <Field 
              label="Product Label" 
              value={caseData.ref_products[currentProductIndex].Product_Label} 
            />
            <Field 
              label="Customer Ref" 
              value={caseData.ref_products[currentProductIndex].Customer_Ref} 
            />
            <Field 
              label="Product Seq" 
              value={caseData.ref_products[currentProductIndex].Product_Seq} 
            />
            <Field 
              label="Order Id" 
              value={caseData.ref_products[currentProductIndex].Order_Id} 
            />
            <Field 
              label="Equipment Ownership" 
              value={caseData.ref_products[currentProductIndex].Equipment_Ownership} 
            />
            <Field 
              label="Product Id" 
              value={caseData.ref_products[currentProductIndex].Product_Id} 
            />
            <Field 
              label="Integration Id" 
              value={caseData.ref_products[currentProductIndex].Integration_Id} 
            />
            <Field 
              label="Product Name" 
              value={caseData.ref_products[currentProductIndex].Product_Name} 
            />
            <Field 
              label="Product Status" 
              value={caseData.ref_products[currentProductIndex].Product_Status} 
            />
            <Field 
              label="Effective Dtm" 
              value={caseData.ref_products[currentProductIndex].Effective_Dtm} 
            />
            <Field 
              label="Service Type" 
              value={caseData.ref_products[currentProductIndex].Service_Type} 
            />
            <Field 
              label="Medium" 
              value={caseData.ref_products[currentProductIndex].Medium} 
            />
            <Field 
              label="City" 
              value={caseData.ref_products[currentProductIndex].City} 
            />
            <Field 
              label="District" 
              value={caseData.ref_products[currentProductIndex].District} 
            />
            <Field 
              label="Province" 
              value={caseData.ref_products[currentProductIndex].Province} 
            />
            <Field 
              label="Region" 
              value={caseData.ref_products[currentProductIndex].Region} 
            />
            <div className="md:col-span-2">
              <Field 
                label="Service Address" 
                value={caseData.ref_products[currentProductIndex].Service_Address} 
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">

            <button
              onClick={() => setCurrentProductIndex(currentProductIndex - 1)}
              className={`flex items-center space-x-3 px-5 py-3 bg-white border rounded-lg shadow-sm text-gray-700 transition ${
                currentProductIndex === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
              disabled={currentProductIndex === 0}
            >
              <ChevronLeft size={18} />
              <span className="font-medium">Previous</span>
            </button>

            <button
              onClick={() => setCurrentProductIndex(currentProductIndex + 1)}
              className={`flex items-center space-x-3 px-5 py-3 bg-white border rounded-lg shadow-sm text-gray-700 transition ${
                currentProductIndex === caseData.ref_products.length - 1 ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
              disabled={currentProductIndex === caseData.ref_products.length - 1}
            >
              <span className="font-medium">Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}


        {/* === Back Button === */}
        <div className="flex justify-start mt-8">
          <button
            onClick={handleBackClick}
            className={`${GlobalStyle.buttonPrimary} flex items-center space-x-2 px-4 py-2`}
          >
            <ArrowLeft size={18} />

          </button>
        </div>
      </div>
    </>
  );
}

/* ✅ Reusable Field Component */
const Field = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-gray-600">{label}</p>
    <p className="text-gray-800 bg-gray-50 border rounded-lg px-3 py-2 mt-1">
      {value || "-"}
    </p>
  </div>
);
