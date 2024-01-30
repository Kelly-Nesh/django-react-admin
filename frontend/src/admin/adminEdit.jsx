import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { BASE_URL, cl, LAYOUT } from "../api/base";
import { object, string, number } from "yup";
import useUpdateModel from "../hooks/useUpdateModel";
import useCreateModel from "../hooks/useCreateModel";

const ImageContext = createContext();
const DataDisplayContext = createContext();

const { Alert, Container, Row, Col, Form, Button } = LAYOUT;

const AdminEdit = () => {
  const { model } = useParams();
  const item = useCookies("item")[0].item;
  const token = useCookies("token")[0].token;

  if (!item || !token) return <>Sorry. Something went wrong.</>;
  const modelForm = {
    product: <ProductForm />,
    service: <ServiceForm />,
    client: <ClientForm />,
    image: <ImageForm />,
  };

  return (
    <Container fluid>
      <DataDisplayContext.Provider value={[item, token, model]}>
        {modelForm[model]}
      </DataDisplayContext.Provider>
    </Container>
  );
};

export default AdminEdit;

function ProductForm() {
  const [item, token, model] = useContext(DataDisplayContext);
  const navigate = useNavigate();

  const productSchema = object({
    name: string().required(),
    price: number(),
    category: string().required(),
    product_type: string(),
    color: string(),
    description: string(),
    comment: string(),
  });

  // Item values
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [color, setColor] = useState(item.color);
  const [type, setType] = useState(item.type);
  const [category, setCategory] = useState(item.category);
  const [images, setImages] = useState(item.images);

  // cl(category, type);
  // User uploaded images
  const [newImages, setNewImages] = useState();

  // Reset to props images
  const [reset, setReset] = useState(false);

  // Disable submit button
  const [disabled, setDisabled] = useState(false);

  // Alert message
  const [warning, setWarning] = useState("");

  // Post to db
  const { mutateAsync: modelUpdate } = useUpdateModel();
  const { mutateAsync: modelCreate } = useCreateModel();

  useEffect(() => {
    warning && setTimeout(() => setWarning(), 5000);
    disabled && setTimeout(() => setDisabled(false), 5000);
  }, [warning, disabled]);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name: name,
      price: price,
      color: color,
      slug: item.slug,
      type: type,
      category: category,
      images: images,
    };

    let res = await productSchema
      .validate(data)
      .then((r) => {})
      .catch((e) => {
        setDisabled(true);
        setWarning(e.message);
        return "error";
      });
    if (res === "error") return;

    const form_data = new FormData();
    for (let d in data) {
      // if not changed
      if (item[d] === data[d]) continue;
      form_data.append(d, data[d]);
    }

    let uploadedImages;
    if (newImages) {
      const form = new FormData();
      newImages.forEach((f) => form.append("image", f));
      const addData = {
        image: form,
        model: model.toLowerCase(),
        token: token,
      };
      // upload new images first
      try {
        const { data: responseImages } = await modelCreate(addData);
        uploadedImages = responseImages.map(({ image }) => {
          return image;
        });
        cl(uploadedImages);
      } catch (e) {
        cl(e.response.message);
        setWarning(e.message);
        return;
      }
    }
    try {
      uploadedImages &&
        uploadedImages.forEach((i) => form_data.append("newimages", i));
      const { isSuccess } = await modelUpdate({
        token: token,
        data: form_data,
        slug: item.slug,
        model: model,
      });
      isSuccess && navigate(-1);
    } catch (e) {
      setWarning(e.message);
      cl(e.response.message);
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
          className="text-center text-capitalize"
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
              setName(e.target.value);
            }}
            id="id_name"
            name="name"
            type="text"
            required
            maxLength="250"
            value={name}
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
              setPrice(e.target.value);
            }}
            id="id_price"
            name="price"
            type="text"
            maxLength="50"
            value={price}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={3} className="m-auto">
          <Form.Label>Category: </Form.Label>
        </Col>
        <Col>
          <Form.Select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              category === "" && setType("");
            }}
          >
            <option value="">---------</option>
            <option value="hair">Hair</option>
            <option value="hair-products">Hair products</option>
            <option value="jewelry">Jewelry</option>
            <option value="cosmetics">Cosmetics</option>
          </Form.Select>
        </Col>
      </Row>
      {category === "hair" && (
        <Row className="mb-3">
          <Col sm={3} className="m-auto">
            <Form.Label>Type: </Form.Label>
          </Col>
          <Col>
            <Form.Select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <option value="">---------</option>
              {[
                ["braids", "Braids"],
                ["crotchets", "Crotchets"],
                ["extensions", "Extensions"],
                ["locs", "Locs"],
                ["weaves", "Weaves"],
              ].map(([v, d]) => {
                return (
                  <option value={v} key={v}>
                    {d}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
        </Row>
      )}

      <Row className="mb-3">
        <Col sm={3} className="m-auto">
          <Form.Label>Color(s): </Form.Label>
        </Col>
        <Col>
          <Form.Control
            onChange={(e) => {
              setColor(e.target.value);
            }}
            id="id_color"
            name="color"
            type="text"
            required
            maxLength="250"
            value={color}
          />
        </Col>
      </Row>
      <Row>
        <ImageContext.Provider
          value={{
            images,
            setImages,
            reset,
            setReset,
            newImages,
            setNewImages,
            item,
          }}
        >
          <DisplayImages />
        </ImageContext.Provider>
      </Row>
      <Button type="submit" disabled={disabled}>
        Submit
      </Button>
    </Form>
  );
}

function DisplayImages() {
  const { images, setImages, reset, setReset, newImages, setNewImages, item } =
    useContext(ImageContext);
  return (
    <>
      {images.map(({ image }, idx) => {
        return (
          <Col xs={6} md={4} lg={3} key={image + idx}>
            <Form.Check
              label="image"
              name="checkbox-image"
              type="checkbox"
              id={"image-checkbox-" + { idx }}
              checked={true}
              value={image}
              onChange={(e) => {
                e.target.checked = false;
                if (!e.target.checked) {
                  setImages(images.filter((i) => i.image !== image));
                  item.images && setReset(true);
                }
              }}
            />
            <Form.Label style={{ height: "15rem" }}>
              <img src={BASE_URL + image} alt="image" className="w-100 h-100" />
            </Form.Label>
          </Col>
        );
      })}

      <Col xs={12} className="mt-3">
        {reset && (
          <Button
            onClick={() => {
              setImages(item.images);
              setReset(false);
            }}
          >
            Reset
          </Button>
        )}
      </Col>

      <br />
      <Col sm={12}>
        {newImages &&
          newImages.map((i, idx) => (
            <div
              key={idx + i}
              className="m-1 mb-5 d-inline-block"
              style={{ maxHeight: "16rem", maxWidth: "11rem" }}
            >
              <Form.Check
                className="w-100 pb-1"
                id={"new-image-" + idx}
                checked={true}
                onChange={(e) => setNewImages(newImages.filter((n) => n !== i))}
              />
              <img
                src={URL.createObjectURL(i)}
                alt={i.name}
                key={idx}
                className="img-thumbnail w-100"
                style={{ height: "15rem" }}
              />
            </div>
          ))}
      </Col>
      <Col>
        <Form.Label>Add images: </Form.Label>
        <Form.Control
          className="my-3 mx-1"
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => {
            const fileList = e.target.files;
            if (fileList) {
              const files = [...fileList];
              setNewImages((prev) =>
                prev ? prev.concat(files) : (prev = files)
              );
            }
          }}
        />
      </Col>
    </>
  );
}
function ServiceForm(props) {}
function ClientForm(props) {}
function ImageForm(props) {}
