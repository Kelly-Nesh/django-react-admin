import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGetModels } from "./hooks/useGetModel";
import "./admin.css";
import { BASE_URL, LoadingScreen, cl, LAYOUT } from "./api/base";
import { useCookies } from "react-cookie";

const { Container, Row, Col, Card } = LAYOUT;

const Admin = () => {
  const cookies = useCookies(["cookie-token"])[0];
  const { data, isLoading, error } = useGetModels(cookies.token);
  if (error) return error.message;
  if (isLoading) return <LoadingScreen />;

  return <DataDisplay models={data.data} />;
};

export default Admin;

function DataDisplay({ models }) {
  const keys = Object.keys(models);
  const [selectedModel, setselectedModel] = useState(
    sessionStorage.getItem("model") || keys[0]
  );

  return (
    <Container fluid>
      <Row>
        <Col xs={4}>
          {keys.map((k) => (
            <h3
              key={k}
              onClick={() => {
                sessionStorage.setItem("model", k);
                setselectedModel(k);
              }}
              role="button"
            >
              {k}
            </h3>
          ))}
        </Col>
        <Col xs={12} sm={8}>
          <Row>
            <Col xs className="d-flex justify-content-end">
              <Link
                to={`${selectedModel.toLowerCase()}/add`}
                role="button"
                className="btn btn-info btn-rounded text-decoration-none"
              >
                Add a {selectedModel}
              </Link>
            </Col>
          </Row>
          <Row className="gy-3">
            <DataCards data={models[selectedModel]} model={selectedModel} />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

function DataCards({ data, model }) {
  const navigate = useNavigate();

  return data.map((d) => {
    return (
      <Col xs={6} md={3} key={d.name}>
        <Card
          className="h-100 w-100 model-card"
          role="button"
          onClick={() => {
            navigate(model.toLowerCase() + "/" + d.slug);
          }}
        >
          {d.images[0] && (
            <Card.Img
              src={BASE_URL + d.images[0].image}
              className="w-100 h-75"
            />
          )}
          {d.name && <Card.Title className="text-white">{d.name}</Card.Title>}
          {d.image && (
            <Card.Img src={BASE_URL + d.image} className="w-100 h-100" />
          )}
        </Card>
      </Col>
    );
  });
}
