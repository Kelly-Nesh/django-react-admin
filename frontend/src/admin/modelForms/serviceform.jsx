import { createContext, useContext, useEffect, useState } from "react";
import { object, string, number } from "yup";
import useUpdateModel from "../hooks/useUpdateModel";
import useCreateModel from "../hooks/useCreateModel";
import { useNavigate, useParams } from "react-router-dom";
import { cl, LAYOUT, LoadingScreen } from "../api/base";
import { DataDisplayContext } from "../adminEdit";
import { DisplayImages, postImages } from "./productform";
import { useRetrieveItem } from "../hooks/useGetModel";

const ServiceImageContext = createContext();
const { Alert, Row, Col, Form, Button } = LAYOUT;

export default function ServiceForm() {
  const [token, model] = useContext(DataDisplayContext);
  const { slug } = useParams();
  const navigate = useNavigate();

  // Post to db
  const { mutateAsync: modelUpdate } = useUpdateModel();
  const { mutateAsync: modelCreate } = useCreateModel();
  const createOrUpdate = slug ? modelUpdate : modelCreate;

  // User uploaded images
  const [newImages, setNewImages] = useState();
  const [removedimages, setRemovedImages] = useState([]);

  // Disable submit button
  const [disabled, setDisabled] = useState(true);

  // Alert message
  const [warning, setWarning] = useState("");

  const [formState, setFormState] = useState({});

  const { data, isLoading, error } = useRetrieveItem(model, slug, token);

  useEffect(() => {
    if (data) {
      setFormState(data.data);
    }
  });

  if (isLoading) return <LoadingScreen />;
  if (error) return "Error occured: " + error.message;

  const serviceSchema = object({
    name: string().max(200).required(),
    price: number(),
    product: string().required(),
  });

  function handleChange(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    setDisabled(true);

    const res = await serviceSchema
      .validate(formState)
      .then(() => {})
      .catch((e) => {
        setWarning(e.message);
        return "error";
      });
    if (res === "error") return;

    const formData = new FormData();
    for (const d in formState) {
      // if not changed
      if (data?.data && data.data[d] === formState[d]) continue;
      formData.append(d, formState[d]);
    }

    /* Setting the removed images */
    removedimages &&
      removedimages.forEach((image) => {
        formData.append("images", image);
      });

    if (newImages) {
      let uploadedImages = await postImages(newImages, token, setWarning);
      uploadedImages &&
        uploadedImages.forEach((i) => formData.append("newimages", i));
    }
    try {
      // cl([...formData.entries()]);
      await createOrUpdate({
        token,
        data: formData,
        slug: formState?.slug,
        model,
      }).then(() => {
        navigate(-1);
      });
    } catch (e) {
      setWarning(e.response?.message || "error occured");
      cl(e.response.message, e.message);
      // Array(7) [ "stack", "message", "name", "code", "config", "request", "response" ]
    }
  }


  return (
    <Form
      onSubmit={handleSubmit}
      className="p-3 mx-auto"
      style={{ maxWidth: "1350px" }}
    >
      {warning && (
        <Alert
          className="text-center fixed-top d-block mx-auto text-capitalize"
          variant="danger"
          style={{ width: "max-content" }}
        >
          {warning}
        </Alert>
      )}
      <Row className="mb-3">
        <Col sm={3} className="m-auto">
          <Form.Label>Name: </Form.Label>
        </Col>
        <Col>
          <Form.Control
            onChange={(e) => {
              handleChange(e);
            }}
            id="id_name"
            name="name"
            type="text"
            required
            maxLength="250"
            value={formState.name || ""}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={3} className="m-auto">
          <Form.Label>Price: </Form.Label>
        </Col>
        <Col>
          <Form.Control
            onChange={(e) => {
              handleChange(e);
            }}
            id="id_price"
            name="price"
            type="text"
            maxLength="50"
            value={formState.price || ""}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={3} className="m-auto">
          <Form.Label>Product: </Form.Label>
        </Col>
        <Col>
          <Form.Select
            value={product[0]?.name}
            onChange={(e) => {
              disabled && setDisabled(false);
              setProduct(e.target.value);
            }}
          >
            <option value="">{product[0]?.name}</option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <ServiceImageContext.Provider
          value={{
            newImages,
            setNewImages,
            setFormState,
            formState,
            setDisabled,
            setRemovedImages,
          }}
        >
          <DisplayImages contextName={ServiceImageContext} />
        </ServiceImageContext.Provider>
      </Row>
      <Button type="submit" disabled={disabled}>
        Submit
      </Button>
    </Form>
  );
}
