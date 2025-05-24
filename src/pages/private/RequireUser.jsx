import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const RequireUser = ({ children }) => {
  const location = useLocation();
  const token = Cookies.get("accessToken");
  const role = Cookies.get("role");

  const allowedRoles = ["user", "organizer", "admin", "superAdmin"];

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireUser;
