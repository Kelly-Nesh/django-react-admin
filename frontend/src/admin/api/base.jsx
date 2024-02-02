import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

export const BASE_URL = "http://192.168.25.153:8000";
const API_URL = BASE_URL + "/api/admin/";
export default API_URL;
export const HEADERS = { headers: { Authorization: "Token" } };

export const cl = console.log;

export const LAYOUT = {
  Alert,
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
};

export function LoadingScreen() {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="info" />
    </div>
  );
}
