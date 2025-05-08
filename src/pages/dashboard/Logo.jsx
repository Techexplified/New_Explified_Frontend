import { Link } from "react-router-dom";
import { ExplifiedLogo } from "../../assets";

function Logo() {
  return (
    <Link to="/">
      <div className="flex items-center gap-3">
        <img className="h-10" alt="Logo" src={ExplifiedLogo} />
        <h1 className="text-2xl font-semibold text-white">Explified</h1>
      </div>
    </Link>
  );
}

export default Logo;
