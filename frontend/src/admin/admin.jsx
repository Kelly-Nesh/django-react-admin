import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetModels } from "../hooks/useGetModel";
import "./admin.css";
import { BASE_URL } from "../api/base";
import {
  MDBCard,
  MDBCardImage,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import { useCookies } from "react-cookie";
import { LoadingScreen, cl } from "../api/base";

const Admin = () => {
  const [cookies, setCookie] = useCookies(["cookie-token"]);
  cl(1, cookies.token);
  const { data, isLoading, error } = useGetModels(cookies.token);
  if (error) return error.message;
  if (isLoading) return <LoadingScreen />;
  // cl(data.data);
  return <DataDisplay models={data.data} />;
};

export default Admin;

function DataDisplay({ models }) {
  const keys = Object.keys(models);
  const [selected_data, setSelectedData] = useState(keys[0]);
  // cl(models[selected_data], models, selected_data);
  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol size={4}>
          {keys.map((k) => (
            <h3
              key={k}
              onClick={() => {
                setSelectedData(k);
              }}
              role="button"
            >
              {k}
            </h3>
          ))}
        </MDBCol>
        <MDBCol size={12} sm={8}>
          <MDBRow className="gy-3">
            <DataCards data={models[selected_data]} model={selected_data} />
          </MDBRow>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

function DataCards({ data, model }) {
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies("item");
  // cl(data);
  function itemEdit(slug) {
    const item = data.find((d) => {
      d.slug === slug;
    });
    cl(item);
    setCookie("item", item);
    navigate(model + "/" + slug);
  }
  return data.map((d) => {
    return (
      <MDBCol size={4} md={3} key={d.name}>
        <MDBCard
          className="h-100 w-100 model-card"
          role="button"
          onClick={() => {itemEdit(slug)}}
        >
          {d.images && (
            <MDBCardImage
              src={BASE_URL + d.images[0].image}
              className="w-100 h-75"
            />
          )}
          {d.name && <MDBCardTitle>{d.name}</MDBCardTitle>}
          {d.image && (
            <MDBCardImage src={BASE_URL + d.image} className="w-100 h-100" />
          )}
        </MDBCard>
      </MDBCol>
    );
  });
}
