import { useNavigate } from 'react-router-dom';
import GlobalStyle from "../../assets/prototype/GlobalStyle";

const PageButton = () => {
    const navigate = useNavigate();

    const buttons = [
        {
            title: "Case List",
            path: "/Incident/Case_List",
            description: "View and manage all cases"
        },
        {
            title: "Incident List",
            path: "/Incident/Incident_List",
            description: "View and manage all incidents"
        },
        {
            title: "Case Details",
            path: "/Incident/Case_Details",
            description: "View detailed case information"
        },
        {
            title: "Individual Register",
            path: "/incident/register",
            description: "Register individual incidents"
        },
        {
            title: "Upload Log",
            path: "/incident/upload-log",
            description: "View upload history and logs"
        },
        {
            title: "Bulk Upload",
            path: "/incident/register-bulk",
            description: "Upload multiple incidents"
        },
        {
            title: "File Download",
            path: "/incident/file-download",
            description: "Download incident files"
        }
    ];

    return (
        <div className={`p-6 ${GlobalStyle.fontPoppins}`}>
            <h1 className={GlobalStyle.headingLarge}>Incident Management System</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {buttons.map((button, index) => (
                    <div 
                        key={index}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                    >
                        <button
                            onClick={() => navigate(button.path)}
                            className="w-full h-full p-6 text-left"
                        >
                            <h2 className="text-xl font-semibold text-[#00256A] mb-2">
                                {button.title}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {button.description}
                            </p>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PageButton;
