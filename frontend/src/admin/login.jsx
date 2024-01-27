import React, { useEffect } from "react";
import API_URL, { cl } from "../api/base";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const Login = () => {
  const [cookies, setCookie] = useCookies(["cookie-token"]);
  async function login() {
    await axios
      .post(API_URL + "login/", { username: "nesh", password: 1234 })
      .then((r) => {
        cl(0, r.data.token);
        setCookie("token", r.data.token);
      })
      .catch((e) => {
        cl(e);
      });
  }
  useEffect(() => {
    if (!cookies.token) {
      login();
    }
  }, [cookies.token]);
  return (
    <div>
      <Link to="admin/">Admin</Link>
    </div>
  );
};

export default Login;
