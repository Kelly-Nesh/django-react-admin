import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetModels } from '../hooks/useGetModel';
import './admin.css';
import { BASE_URL, LoadingScreen, cl, LAYOUT } from '../api/base';
import { useCookies } from 'react-cookie';

const { Container, Row, Col, Card } = LAYOUT;

const Admin = () => {
  const cookies = useCookies(['cookie-token'])[0];
  const { data, isLoading, error } = useGetModels(cookies.token);
  if (error) return error.message;
  if (isLoading) return <LoadingScreen />;

  return <DataDisplay models={data.data} />;
};

export default Admin;

function DataDisplay ({ models }) {
  const keys = Object.keys(models);
  const [selectedData, setSelectedData] = useState(keys[0]);

  return (
    <Container fluid>
      <Row>
        <Col xs={4}>
          {keys.map((k) => (
            <h3
              key={k}
              onClick={() => {
                setSelectedData(k);
              }}
              role='button'
            >
              {k}
            </h3>
          ))}
        </Col>
        <Col xs={12} sm={8}>
          <Row className='gy-3'>
            <DataCards data={models[selectedData]} model={selectedData} />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

function DataCards ({ data, model }) {
  const navigate = useNavigate();
  const setCookie = useCookies('item')[1];

  useEffect(() => {
    setCookie('item', null);
  }, []);

  function itemEdit (slug) {
    const item = data.find((d) => {
      return d.slug === slug;
    });
    setCookie('item', item);
    navigate(model.toLowerCase() + '/' + slug);
  }

  return data.map((d) => {
    return (
      <Col xs={6} md={3} key={d.name}>
        <Card
          className='h-100 w-100 model-card'
          role='button'
          onClick={() => {
            itemEdit(d.slug);
          }}
        >
          {d.images[0] && (
            <Card.Img
              src={BASE_URL + d.images[0].image}
              className='w-100 h-75'
            />
          )}
          {d.name && <Card.Title className='text-white'>{d.name}</Card.Title>}
          {d.image && (
            <Card.Img src={BASE_URL + d.image} className='w-100 h-100' />
          )}
        </Card>
      </Col>
    );
  });
}
