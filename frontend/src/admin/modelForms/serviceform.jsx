import { createContext, useContext, useEffect, useState } from "react";
import { object, string, number } from "yup";
import useUpdateModel from "../hooks/useUpdateModel";
import useCreateModel from "../hooks/useCreateModel";
import { useNavigate, useParams, Link } from "react-router-dom";
import { cl, LAYOUT, LoadingScreen } from "../api/base";
import { DataDisplayContext } from "../adminEdit";
import { DisplayImages, postImages } from "./productform";
import { useGetModel, useRetrieveItem } from "../hooks/useGetModel";
import "./service.css";
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
  const [addedProducts, setAddedProducts] = useState([]);
  const [removedProducts, setRemovedProducts] = useState([]);

  const [search, setSearch] = useState();
  // Disable submit button
  const [disabled, setDisabled] = useState(true);

  // Alert message
  const [warning, setWarning] = useState("");

  const [formState, setFormState] = useState({});

  const { data, isLoading, error } = useRetrieveItem({ model, slug, token });
  // cl(model, slug, token);
  const { data: products } = useGetModel({ model: "product", token });
  useEffect(() => {
    if (data) {
      setFormState(data.data);
    }
  }, [data]);

  if (isLoading) return <LoadingScreen />;
  if (error) return "Error occured: " + error.message;

  const serviceSchema = object({
    name: string().max(200).required(),
    price: number(),
    product: string().required(),
  });

  function handleChange(e) {
    // cl(e.target.name, e.target.value);
    setDisabled(false);
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
      let uploadedImages = await postImages(
        newImages,
        token,
        setWarning,
        modelCreate
      );
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
  const handleSearch = (e) => {
    if (!e.target.value) {
      setSearch();
      return;
    }
    const searched = products?.data.filter(({ name }) =>
      name.includes(e.target.value)
    );
    setSearch(searched);
  };
  const handleProducts = (e) => {
    if (e.target.checked) {
      setAddedProducts((prev) => prev.concat(e.target.value));
    } else {
      setAddedProducts(addedProducts.filter((p) => e.target.value !== p));
    }
  };

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
          <Form.Group>
            <Form.Control
              className="d-inline-block"
              style={{ width: "80%" }}
              type="text"
              placeholder="Search"
              onChange={handleSearch}
            ></Form.Control>
            <Link
              to="/admin/product/add"
              role="button"
              className="btn btn-info btn-rounded"
            >
              Add
            </Link>
          </Form.Group>
          {/* Search list */}
          {search && (
            <div className="position-absolute product-search w-50 p-2">
              {search.map(({ name, slug }) => {
                return (
                  <div key={slug}>
                    <input
                      className="me-2"
                      type="checkbox"
                      checked={false}
                      onChange={(e) => {
                        handleProducts(e);
                        cl(e.target.value, addedProducts);
                        e.target.checked = !e.target.checked;
                      }}
                    />
                    {name}
                  </div>
                );
              })}
            </div>
          )}
          {/* Existing products */}
          {formState.product && (
            <div className="service-product">
              {formState.product.map((p) => {
                return (
                  <div key={p.slug}>
                    <input
                      className="me-2"
                      type="checkbox"
                      checked={true}
                      onChange={() => {}}
                    />
                    {p.name}
                  </div>
                );
              })}
            </div>
          )}
          {/* New products */}
          {addedProducts && (
            <div className="service-product">
              {addedProducts.map((p) => {
                return (
                  <div key={p.slug}>
                    <input
                      className="me-2"
                      type="checkbox"
                      checked={true}
                      onChange={handleProducts}
                    />
                    {p.name}
                  </div>
                );
              })}
            </div>
          )}
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
