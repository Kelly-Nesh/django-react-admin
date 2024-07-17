import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import TopNavbar, { LeftMenu } from "./components/navbar/navbar";
import { Container, Row, Col } from "react-bootstrap";
import Login from "./components/auth/login";

const Home = () => {
  return (
    <Container fluid>
      <Row>
        <TopNavbar />
      </Row>
      <Row className="main">
        <Col xs={4} sm={3} className="bg-primary mh-100 menu overflow-y-scroll">
          <LeftMenu />
        </Col>
        <Col>
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
    element: <Home />,
    children: [],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
