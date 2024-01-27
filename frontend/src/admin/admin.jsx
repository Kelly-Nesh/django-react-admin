import React from "react";
import { useGetModels } from "../hooks/useGetModel";
import { MDBSpinner } from "mdb-react-ui-kit";
import { useCookies } from "react-cookie";
import { cl } from "../api/base";

const Admin = () => {
  const [cookies, setCookie] = useCookies(["cookie-token"]);
  cl(1, cookies.token);
  const { data, isLoading, error } = useGetModels(cookies.token);
  if (error) return error.message;
  if (isLoading) return <MDBSpinner />;
  console.log(data);
  return <div>data</div>;
};

export default Admin;
