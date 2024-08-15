import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import TopNavbar, { LeftMenu } from "./components/navbar/navbar";
import { Container, Row, Col } from "react-bootstrap";
import Login from "./components/auth/login";
import { createContext, useEffect, useState } from "react";
import ModelView from "./components/models/modelview";
import ModelEdit from "./components/models/modeleditview";

export const TokenContext = createContext({});
export const cl = console.log;

const Protection = () => {
  const [access_token, setAccessToken] = useState<string | null>(
    sessionStorage.getItem("access")
  );
  useEffect(() => {
    if (typeof access_token !== "string") {
      const token = sessionStorage.getItem("access");
      setAccessToken(token);
    }
  }, [access_token]);
  // cl(access_token);
  if (typeof access_token === "string") {
    return (
      <TokenContext.Provider value={{ access_token }}>
        <Outlet />
      </TokenContext.Provider>
    );
  } else {
    return <Navigate to="/login" replace />;
  }
};

const Home = () => {
  return (
    <Container fluid>
      <Row>
        <TopNavbar />
      </Row>
      <Row className="main flex-nowrap mw-100">
        <Col xs={4} sm={3} className="bg-primary mh-100 menu overflow-y-scroll">
          <LeftMenu />
        </Col>
        <Col xs={8} sm={9}>
          <div id="">
            <div className="" id="">
              <h2>Recent actions</h2>
              <h3>My actions</h3>
              <p>None available</p>
            </div>
          </div>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Protection />,
    children: [
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: ":app/:model/",
            children: [
              { path: "", element: <ModelView /> },
              { path: "edit/:id/", element: <ModelEdit /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
