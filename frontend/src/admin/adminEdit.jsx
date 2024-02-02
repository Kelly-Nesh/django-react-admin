import React, { createContext } from "react";
import { Link, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { LAYOUT, cl } from "./api/base";
import ProductForm from "./modelForms/productform";
import ServiceForm from "./modelForms/serviceform";

export const DataDisplayContext = createContext();

const { Container } = LAYOUT;
export const modelForm = {
  product: <ProductForm />,
  service: <ServiceForm />,
  client: <ClientForm />,
  image: <ImageForm />,
};

const AdminEdit = () => {
  const { model } = useParams();
  // const item = useCookies("item")[0].item;
  const token = useCookies("token")[0].token;

  if (!token) return <Link to="/">Sorry. Login again.</Link>;

  return (
    <Container fluid>
      <DataDisplayContext.Provider value={[token, model]}>
        {modelForm[model]}
      </DataDisplayContext.Provider>
    </Container>
  );
};

export default AdminEdit;

function ClientForm(props) {}
function ImageForm(props) {}
