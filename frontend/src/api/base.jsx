import { MDBSpinner } from "mdb-react-ui-kit";

export const BASE_URL = "http://192.168.126.153:8000";
const API_URL = BASE_URL + "/api/admin/";
export default API_URL;
export const HEADERS = { headers: { Authorization: "Token" } };

export const cl = console.log;

export function LoadingScreen() {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <MDBSpinner color="info" />
    </div>
  );
}
