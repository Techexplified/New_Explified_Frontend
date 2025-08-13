import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeTool } from "../../utils/tool_slice/ToolSlice";

function NewDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(removeTool());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-center text-4xl">Welcome to your dashboard</h1>
    </div>
  );
}

export default NewDashboard;
