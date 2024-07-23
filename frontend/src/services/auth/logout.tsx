import { Navigate } from "react-router-dom";

const logout = () => {
  sessionStorage.removeItem("access");
  sessionStorage.removeItem("refresh");
  window.location.href = "/login";
};
export default logout;
