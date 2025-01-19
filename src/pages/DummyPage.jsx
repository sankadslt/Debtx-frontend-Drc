import GlobalStyle from "../assets/prototype/GlobalStyle";
import { Link } from "react-router-dom";

const Dummy = () => {
  return (
    <div className={`${GlobalStyle.fontPoppins}`}>
      <div className="flex justify-start gap-4 mt-10">
        
        <Link className={`${GlobalStyle.buttonPrimary}`} to="/pages/Distribute/DistributeTORO">
          2.2 Distribute To RO
        </Link>
       
        <Link className={`${GlobalStyle.buttonPrimary}`} to="/drc/assigned-ro-case-log">
          2.3 Assigned RO case log
        </Link>
      </div>
    </div>
  );
};

export default Dummy;
