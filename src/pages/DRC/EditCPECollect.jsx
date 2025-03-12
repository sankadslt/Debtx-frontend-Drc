/*
  This template is used for the CPE Collection (2.7.3)  for DRC.

  Created Date: March 6, 2025  
  Created By: Dasindu Dinsara (dinsaradasindu@gmail.com)  
  Last Modified Date: March 9, 2025  

  Version: Node.js 20  
  UI Numbers:  2.7.3  
  Dependencies: Tailwind CSS  
  Related Files: (routes)  

  Notes:  
  - This file contains the implementation  CPE Collect edit part .
*/




import React, { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { drcCaseDetails, addCpeNegotiation } from "../../services/case/CaseService";
import Backbtn from "../../assets/images/back.png";
import { useLocation, useNavigate } from "react-router-dom";

const CpeEditPage = ({ setActiveTab, setShowDetailedView, setIsEditMode }) => {
  const [formData, setFormData] = useState({
    caseId: "",
    drcId: "",
    customerRef: "",
    accountNo: "",
    type: "",
    cpemodel: "",
    serialNo: "",
    nego_remark: "",
  });

  const [selectedProduct, setSelectedProduct] = useState({
    Service_address: "",
    product_label: "",
    service: "",
    product_ownership: "",
  });

  const modelOptions = {
    adsl: ["ZTE W300", "ZTE H108L", "Prolink 5004NK", "Tplink TDW8951ND", "Fiberhome HG110", "Prolink PRS 1140", "Prolink PRS  1841", "Fiberhome HG180"],
    ont: ["ONT1", "ONT2"],
    stb: ["Netgem 7700", "Netgem 7800", "HWACOM HC-J3370", "SDMC DV8040"],
    telephone: ["NEC AT45", "Panasonic KX-TS 500MXW", "BeetelB15", "Prolink -HA-51A", "LG Ericsson GS-5140", "SIEMENS EUROSET 802", "ALCATEL T26", "East Line ECG-305"],
    "lte router": ["LTE1", "LTE2"],
    "access point": ["Ruckcs R320", "Ruckcs T610", "Ruckcs R510", "Aruba 303", "Aruba 505", "Aruba 365", "Aruba 575"],
    "pOe Switch": ["HuaweiS5735 8 Port", "HuaweiS5735 24 Port"],
    "poe injector": ["PD-3501G", "PD-9001GR"],
    "android box": ["SEI 300SLT"],
  };

  const location = useLocation();
  const { product, caseId, customerRef, accountNo, drcId } = location.state || {};  // Destructure drcId here

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setSelectedProduct({
        Service_address: product.Service_address || "",
        product_label: product.product_label || "",
        service: product.service || "",
        product_ownership: product.product_ownership || "",
      });
      setFormData((prevData) => ({
        ...prevData,
        caseId: caseId || "",
        customerRef: customerRef || "",
        accountNo: accountNo || "",
        service: product.service || "",
        drcId: drcId || "",  // Set drcId 
      }));
    }

    if (caseId) {
      drcCaseDetails(caseId)
        .then((data) => {
          setFormData((prevData) => ({
            ...prevData,
            caseId: data.case_id,
            customerRef: data.customer_ref,
            accountNo: data.account_no,
          }));
        })
        .catch((error) => {
          console.error("Error fetching case details:", error);
        });
    }

    if (drcId) {
      console.log("drcId:", drcId);
    }
  }, [product, caseId, customerRef, accountNo, drcId]);




  const handleBackClick = () => {
    navigate("/drc/customer-negotiation");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const cpeSubmit = (event) => {
    event.preventDefault();
  
    const caseId = formData.caseId;
    const type = formData.type;
    const cpemodel = formData.cpemodel;
    const serialNo = formData.serialNo.trim();
    const nego_remark = formData.nego_remark.trim();
    const service = formData.service ? formData.service.trim() : "";  
    const drcId = formData.drcId;  

    if (!serialNo || !nego_remark || !service) {
      alert("Serial Number, Remark, and Service cannot be empty.");
      return;
    }
  
    addCpeNegotiation(caseId, type, cpemodel, serialNo, nego_remark, service, drcId)
      .then((data) => {
        alert("CPE details added successfully!");
        setFormData({
          ...formData,
          serialNo: "",
          nego_remark: "",
          type: "",
          service: "",  
          drcId: "",  
        });
      })
      .catch((error) => {
        alert("Failed to add CPE details: " + error.message);
      });
  };


  const style = {
    thStyle: "text-left font-bold text-black text-l",
    tdStyle: "text-left text-l text-black px-2",
  };

  const renderCPEEditForm = () => (
    <div className="p-6 rounded-lg ml-32">
      <div className={`${GlobalStyle.cardContainer}`}>
        <tr>
          <th className={style.thStyle}>Case ID</th>
          <td className={style.tdStyle}>:</td>
          <td className={style.tdStyle}>{formData.caseId}</td>
        </tr>
        <tr>
          <th className={style.thStyle}>Customer Ref</th>
          <td className={style.tdStyle}>:</td>
          <td className={style.tdStyle}>{formData.customerRef}</td>
        </tr>
        <tr>
          <th className={style.thStyle}>Service Address</th>
          <td className={style.tdStyle}>:</td>
          <td className={style.tdStyle}>{selectedProduct.Service_address}</td>
        </tr>
        <h1 className={`${style.thStyle} underline mt-6 mb-4`}>CPE Details</h1>
        <tr>
          <th className={style.thStyle}>Telephone No</th>
          <td className={style.tdStyle}>:</td>
          <td className={style.tdStyle}>{selectedProduct.product_label}</td>
        </tr>
        <tr>
          <th className={style.thStyle}>Account No</th>
          <td className={style.tdStyle}>:</td>
          <td className={style.tdStyle}>{formData.accountNo}</td>
        </tr>
        <tr>
          <th className={style.thStyle}>Service Type</th>
          <td className={style.tdStyle}>:</td>
          <td className={style.tdStyle}>{selectedProduct.service || "N/A"}</td>
        </tr>
        <tr>
          <th className={style.thStyle}>Ownership</th>
          <td className={style.tdStyle}>:</td>
          <td className={style.tdStyle}>{selectedProduct.product_ownership || "N/A"}</td>
        </tr>
      </div>

      <div className={`${GlobalStyle.cardContainer}`} style={{ minWidth: "600px" }}>
        <div className="gap-6 mb-6 justify-start">
          <div className="flex gap-6 mb-5">
            <label className={GlobalStyle.remarkTopic}>CPE Type :</label>
            <select
              name="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className={GlobalStyle.selectBox}
            >
              <option value="">Select CPE Type</option>
              {Object.keys(modelOptions).map((type) => (
                <option key={type} value={type}>{type.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {formData.type && (
            <div className="flex gap-6 mb-5 ml-5">
              <label className={GlobalStyle.remarkTopic}>Model :</label>
              <select
                name="cpemodel"
                value={formData.cpemodel}
                onChange={(e) => setFormData({ ...formData, cpemodel: e.target.value })}
                className={GlobalStyle.selectBox}
              >
                <option value="">Select Model</option>
                {modelOptions[formData.type].map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-6 mb-5 ml-1">
            <label className={GlobalStyle.remarkTopic}>Serial No:</label>
            <input
              type="text"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleInputChange}
              className={GlobalStyle.inputText}
            />
          </div>

          <div className="flex gap-6 mb-5 ml-4">
            <label className={GlobalStyle.remarkTopic}>Remark:</label>
            <textarea
              name="nego_remark"
              value={formData.nego_remark}
              onChange={handleInputChange}
              className={GlobalStyle.remark}
              rows={4}
              style={{ width: "50%", minWidth: "450px" }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-4 ml-[800px] mt-16">
        <button onClick={cpeSubmit} className={GlobalStyle.buttonPrimary}>Submit</button>
      </div>

      <button className="px-6 py-2 mb-8 rounded-md" onClick={handleBackClick}>
        <img src={Backbtn} alt="Back" className="w-7 h-7" />
      </button>

    </div>
  );

  return (
    <div className="p-4 min-h-screen">
      <h1 className={`${GlobalStyle.headingLarge} mb-6`}>CPE Collect</h1>
      {renderCPEEditForm()}
    </div>
  );
};

export default CpeEditPage;
