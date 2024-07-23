import "./login.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import login from "../../services/auth/login";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [details, setDetails] = useState({ username: "", password: "" });

  const [error, setError] = useState("");
  const nav = useNavigate();
  return (
    <Row className="vh-100 align-items-center justify-content-center">
      <Col xs={8} sm={5} md={4} className="form-wrap rounded-3 py-5 px-4">
        <h4 className="text-center">Re-Admin Login</h4>
        {error && <p className="text-danger">{error}</p>}
        <Form>
          <Form.Control
            type="text"
            placeholder="Username"
            className="my-3"
            onChange={(i) => {
              setDetails({ ...details, username: i.target.value });
            }}
          />
          <Form.Control
            type="password"
            placeholder="Password"
            className="my-3"
            onChange={(e) => {
              setDetails({ ...details, password: e.target.value });
            }}
          ></Form.Control>
          <Button
            variant="primary"
            type="submit"
            className="d-block mx-auto"
            onClick={async (e) => {
              e.preventDefault();
              const login_status = await login(details);
              if (login_status === 200) {
                nav("/");
              } else {
                alert(login_status);
                setError("Invalid credentials");
              }
            }}
          >
            Login
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
