import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Accordion from "react-bootstrap/Accordion";
import { useContext, useEffect, useState } from "react";
import { homeGet } from "../../services/crud/menu_get";
import { cl, TokenContext } from "../../App";
import ModelMap from "./map_models";
import logout from "../../services/auth/logout";

function TopNavbar() {
  return (
    <Navbar expand="md" className="bg-primary">
      <Container>
        <Navbar.Brand href="#home">Re-Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
export interface AppsModels {
  models?: Array<string>;
  perms?: Array<string>;
}
export const LeftMenu = () => {
  const [models, setModels] = useState<AppsModels>();
  const { access_token } = useContext<Object>(TokenContext);

  useEffect(() => {
    if (access_token) {
      homeGet(access_token).then((response) => {
        if (response) setModels(response);
      });
    }
  }, [access_token]);
  // cl(models);
  return (
    <Container className="left-menu">
      <Row>
        <h3>User</h3>
        <small>Dashboard</small>
      </Row>
      <Row>
        <h3>Apps</h3>
        <Accordion defaultActiveKey="0" flush>
          <ModelMap {...models} />
        </Accordion>
      </Row>
      <Row>
        <h3>System</h3>
        <div>
          <p>Appearance</p>
          <p>Settings</p>
        </div>
      </Row>
    </Container>
  );
};
