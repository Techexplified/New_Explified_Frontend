import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ProtectedRoute component to handle authentication-based route protection
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.redirectTo - Path to redirect to if not authenticated (default: "/login")
 * @param {string} props.requiredRole - Required user role for access (optional)
 * @param {function} props.fallback - Custom fallback component if not authenticated
 */
const ProtectedRoute = ({ 
  children, 
  redirectTo = "/login", 
  requiredRole = null,
  fallback = null 
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      // Check if user is logged in
      const userToken = localStorage.getItem("explified");
      
      if (!userToken) {
        if (fallback) {
          return; // Let fallback handle the UI
        }
        // Redirect to login or specified route
        navigate(redirectTo);
        return;
      }

      // If role-based access is required
      if (requiredRole) {
        try {
          const userData = JSON.parse(userToken);
          
          if (!userData.role || userData.role !== requiredRole) {
            alert(`Access denied. ${requiredRole} privileges required.`);
            navigate("/"); // Redirect to home or dashboard
            return;
          }
        } catch (error) {
          // If token is not JSON or corrupted
          console.warn("Invalid token format, treating as simple string token");
          // For backward compatibility, allow access if no role validation possible
        }
      }
    };

    checkAuthentication();
  }, [navigate, redirectTo, requiredRole, fallback]);

  // Check authentication status
  const userToken = localStorage.getItem("explified");
  
  if (!userToken) {
    // Show fallback component or return null (will redirect via useEffect)
    return fallback || null;
  }

  // If role is required, validate it
  if (requiredRole) {
    try {
      const userData = JSON.parse(userToken);
      if (!userData.role || userData.role !== requiredRole) {
        return fallback || null;
      }
    } catch (error) {
      // For backward compatibility, allow access if token is not JSON
      console.warn("Token format validation failed, allowing access for backward compatibility");
    }
  }

  // User is authenticated and authorized, render children
  return children;
};

/**
 * Higher-order component to wrap routes with authentication protection
 * @param {React.Component} Component - Component to protect
 * @param {Object} options - Protection options
 */
export const withProtectedRoute = (Component, options = {}) => {
  return (props) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

/**
 * Hook to check authentication status
 * @returns {Object} Authentication status and user data
 */
export const useAuth = () => {
  const userToken = localStorage.getItem("explified");
  
  if (!userToken) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const userData = JSON.parse(userToken);
    return { isAuthenticated: true, user: userData };
  } catch (error) {
    // For backward compatibility with simple string tokens
    return { isAuthenticated: true, user: { token: userToken } };
  }
};

export default ProtectedRoute;