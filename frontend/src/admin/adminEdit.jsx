import React, { createContext } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { LAYOUT } from '../api/base';
import ProductForm from './modelForms/productform';

export const DataDisplayContext = createContext();

const { Container } = LAYOUT;
export const modelForm = {
  product: <ProductForm />,
  service: <ServiceForm />,
  client: <ClientForm />,
  image: <ImageForm />
};

const AdminEdit = () => {
  const { model } = useParams();
  const item = useCookies('item')[0].item;
  const token = useCookies('token')[0].token;

  if (!token) return <p>Sorry. Login again.</p>;

  return (
    <Container fluid>
      <DataDisplayContext.Provider value={[item, token, model]}>
        {modelForm[model]}
      </DataDisplayContext.Provider>
    </Container>
  );
};

export default AdminEdit;

function ServiceForm (props) {}
function ClientForm (props) {}
function ImageForm (props) {}
