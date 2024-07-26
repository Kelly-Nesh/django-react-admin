import { intervalId } from "./login";

const logout = () => {
  sessionStorage.removeItem("access");
  sessionStorage.removeItem("refresh");
  if (intervalId != undefined) clearInterval(intervalId);
  window.location.href = "/login";
};
export default logout;
