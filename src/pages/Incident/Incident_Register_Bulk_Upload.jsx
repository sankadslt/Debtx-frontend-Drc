/*Purpose: 
Created Date: 2025-01-08
Created By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Version: React v18
ui number : 1.2.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";

const Incident_Register_Bulk_Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [actionType] = useState("");


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };


    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectedFile || !actionType) {
            alert("Please select both an action type and a file");
            return;
        }

        
        console.log("Submitting file upload:", {
            file: selectedFile,
            actionType: actionType
        });
    };

    return (
        <div className={`h-screen ${GlobalStyle.fontPoppins}`}>
            <h1 className={`${GlobalStyle.headingLarge} `}>File Upload</h1>
            <div className="h-[calc(100%-220px)] flex items-center justify-center">
                <div className={`${GlobalStyle.cardContainer} w-full max-w-2xl mx-6`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Action Type Dropdown */}
                        <div className="flex gap-4 justify-center">
                            <select className={GlobalStyle.selectBox}>
                                <option value="option1">Action Type</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                            </select>
                        </div>


                        {/* File Upload Section */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className={`${GlobalStyle.inputText} w-full file:mr-4 file:py-2 file:px-4 
                file:rounded-full file:border-0 file:text-sm file:font-semibold
                file:bg-[#00256A] file:text-white hover:file:bg-blue-900`}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className={GlobalStyle.buttonPrimary}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Incident_Register_Bulk_Upload; 