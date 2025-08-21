// LinkedInSuccess.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LinkedInSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const linkedin_id = params.get("linkedin_id");
  const firstName = params.get("firstName");
  const lastName = params.get("lastName");

  useEffect(() => {
    console.log("LinkedIn ID:", linkedin_id);
    console.log("Name:", firstName, lastName);
    // Save to state or localStorage if needed
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Welcome, {firstName}!</h2>
      <p>Your LinkedIn ID: {linkedin_id}</p>
    </div>
  );
};

export default LinkedInSuccess;
