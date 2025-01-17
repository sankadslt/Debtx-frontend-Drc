
/*Purpose: 
Created Date: 2025-01-09
Created By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Version: React v18
ui number : 0.2
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft } from "react-icons/fa";


const CaseDetails = () => {
   
    const handleBackClick = () => {
      
        console.log("Back button clicked");
    };

    const handleDownloadClick = () => {
       
        console.log("Download button clicked");
    };

    return (
        <div className={GlobalStyle.fontPoppins}>


            <div className="w-full mb-8 mt-4 flex items-center justify-between">

                <h2 className={GlobalStyle.headingLarge}>Case Details</h2>


                <div className={`${GlobalStyle.cardContainer} w-2/4`}>
                    <p className="mb-2">
                        <strong>Case ID:</strong>
                    </p>
                    <p className="mb-2">
                        <strong>Created DTM:</strong>{" "}
                    </p>
                    <p className="mb-2">
                        <strong>Days Count:</strong>{" "}
                    </p>
                </div>
            </div>

            <div className="flex justify-between w-full">

                <div className="flex flex-col gap-4 w-7/12 ">
                    <div className="flex gap-4">
                        <h1 className="w-[200px]">Account No</h1>
                        <input
                            type="text"
                            className={`${GlobalStyle.inputText} w-[400px]`}
                        />
                    </div>
                    <div className="flex gap-4">
                        <h1 className="w-[200px]">Customer Ref</h1>
                        <input
                            type="text"
                            className={`${GlobalStyle.inputText} w-[400px]`}
                        />
                    </div>


                    <div className="flex gap-4">
                        <div className="flex gap-4">
                            <h1>Area</h1>
                            <input
                                type="text"
                                className={GlobalStyle.inputText}
                            />
                        </div>
                        <div className="flex gap-4">
                            <h1>RTOM</h1>
                            <input
                                type="text"
                                className={GlobalStyle.inputText}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <h1 className="w-[200px]">Arrears Amount</h1>
                        <input
                            type="text"
                            className={`${GlobalStyle.inputText} w-[400px]`}
                        />
                    </div>
                    <div className="flex gap-4">
                        <h1 className="w-[200px]">Action Type</h1>
                        <input
                            type="text"
                            className={`${GlobalStyle.inputText} w-[400px]`}
                        />
                    </div>
                    <div className="flex gap-4">
                        <h1 className="w-[200px]">Remark</h1>
                        <input
                            type="text"
                            className={`${GlobalStyle.inputText} w-[400px]`}
                        />
                    </div>
                </div>


                <div className="flex flex-col gap-4 w-5/12">
                    <div className="flex gap-4 ">
                        <h1 className="w-[200px]">Current Status</h1>
                        <input
                            type="text"
                            className={`${GlobalStyle.inputText} w-[400px]`}
                        />
                    </div>
                    <div className="flex gap-4 ">
                        <h1 className="w-[200px]">Last Payment Date</h1>
                        <input
                            type="text"
                            className={`${GlobalStyle.inputText} w-[400px]`}
                        />
                    </div>
                    <div className="flex gap-4 ">
                        <h1 className="w-[200px]">Last BSS Reading Date</h1>
                        <input
                            type="text"
                            className={`${GlobalStyle.inputText} w-[400px]`}
                        />
                    </div>
                </div>
            </div>




            {/* dropdown Section */}
            <div >
                <div className="flex gap-4 mt-8 ">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">Reference Data</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-8">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">DRC</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-8">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">RO - Negative | Arrears</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-8">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">RO - Negative | CPE</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-8">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">RO - Customer Updated Data</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-8">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">Mediation Board</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-8">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">Settlement</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-8">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">Payment</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-8">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">Commision | Arrears Collection</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-8">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">Commision | CPE Collection</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-8">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">LOD</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-8">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">Dispute</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-8">

                    <select className={`${GlobalStyle.selectBox} w-full`}>
                        <option value="option1">Write OFF</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-between w-full">
                {/* Left Arrow Button */}
                <div className={`${GlobalStyle.navButtonContainer} flex justify-start`}>
                    <button 
                        className={GlobalStyle.navButton}
                        onClick={handleBackClick}
                    >
                        <FaArrowLeft />
                    </button>
                </div>

                {/* Download Button */}
                <div className="flex justify-end mt-6">
                    <button 
                        className={GlobalStyle.buttonPrimary}
                        onClick={handleDownloadClick}
                    >
                        Download
                    </button>
                </div>
            </div>



        </div>











    );
};

export default CaseDetails;
