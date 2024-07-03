import React, { useEffect, useState, useContext, createContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGetModel } from "./hooks/useGetModel";
import "./admin.css";
import API_URL, { LoadingScreen, cl, LAYOUT } from "./api/base";
import { useCookies } from "react-cookie";
import axios from "axios";

const { Container, Row, Col, Card } = LAYOUT;
const ModelContext = createContext();

const Admin = () => {
  const cookies = useCookies(["cookie-token"])[0];
  const [model, setModel] = useState();
  const [modelKeys, setModelKeys] = useState();
  const [modelData, setModelData] = useState();

  useEffect(() => {
    // Get models list from api
    axios
      .get(API_URL, {
        headers: { Authorization: "Token " + cookies.token },
      })
      .then((res) => {
        cl(res.data);
        setModelKeys('res');
        cl(model, modelKeys);
        setModel(modelKeys[0]);
      })
      .catch(() => console.log("model keys error"));
  }, []);

  const { data, isLoading, error } = useGetModel({
    token: cookies.token,
    model: 'product',
  });

  useEffect(() => {
    setModelData(data);
    cl(data, '-');
  }, [data]);

  if (error) return error.message;
  if (isLoading || !modelData) return <LoadingScreen />;

  return (
    <ModelContext.Provider
      value={{ modelKeys, model, token: cookies.token, setModel, modelData }}
    >
      <DataDisplay />;
    </ModelContext.Provider>
  );
};

export default Admin;

function DataDisplay() {
  const { modelKeys, model, setModel } = useContext(ModelContext);
  const [selectedModel, setselectedModel] = useState(
    sessionStorage.getItem("model") || model
  );

  return (
    <Container fluid>
      <Row>
        <Col xs={4}>
          {modelKeys.map((k) => (
            <h3
              key={k}
              onClick={() => {
                sessionStorage.setItem("model", k);
                setModel(k.toLowerCase());
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
                to={`${model}/add`}
                role="button"
                className="btn btn-info btn-rounded text-decoration-none"
              >
                Add a {selectedModel}
              </Link>
            </Col>
          </Row>
          <Row className="gy-3">
            <DataCards />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

function DataCards() {
  const { modelData, model } = useContext(ModelContext);
  const navigate = useNavigate();
  cl(modelData);
  alert(model);

  return modelData.map((d) => {
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
            <Card.Img src={d.images[0].image} className="w-100 h-75" />
          )}
          {d.name && <Card.Title className="text-white">{d.name}</Card.Title>}
          {d.image && <Card.Img src={d.image} className="w-100 h-100" />}
        </Card>
      </Col>
    );
  });
}
