import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function NewDashboard() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  return (
    <div>
      <h1 className="text-center text-4xl">Welcome to your dashboard</h1>
    </div>
  );
}

export default NewDashboard;
