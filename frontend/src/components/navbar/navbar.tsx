import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Accordion from "react-bootstrap/Accordion";
import { useEffect, useState } from "react";
import { homeGet } from "../../services/crud/menu_get";

function TopNavbar() {
  return (
    <Navbar expand="md" className="bg-primary">
      <Container>
        <Navbar.Brand href="#home">Re-Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
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
interface Model {
  key: string;
  value: Array<string>;
}
export const LeftMenu = () => {
  const [models, setModels] = useState<Model[]>({});
  useEffect(() => {
    setModels(homeGet());
  }, []);
  const mapped_models: Array<JSX.Element> = Object.keys(models).map(
    (key: string) => {
      return (
        <Accordion.Item eventKey={key}>
          <Accordion.Header>{key}</Accordion.Header>
          <Accordion.Body>
            {models[key].map((m: any) => (
              <p className="m-0 mb-1">{m}</p>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      );
    }
  );
  return (
    <Container className="left-menu">
      <Row>
        <h3>User</h3>
        <small>Dashboard</small>
      </Row>
      <Row>
        <h3>Apps</h3>
        <Accordion defaultActiveKey="0" flush>
          {mapped_models}
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
