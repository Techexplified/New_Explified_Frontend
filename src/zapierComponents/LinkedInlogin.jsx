// LinkedInLoginButton.jsx
const LinkedInLoginButton = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/linkedin";
  };

  return (
    <button onClick={handleLogin}>
      Login with LinkedIn
    </button>
  );
};

export default LinkedInLoginButton;
