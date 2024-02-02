import { createContext, useContext, useEffect, useState } from "react";
import { object, string, number } from "yup";
import useUpdateModel from "../hooks/useUpdateModel";
import useCreateModel from "../hooks/useCreateModel";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, cl, LAYOUT, LoadingScreen } from "../api/base";
import { DataDisplayContext } from "../adminEdit";
import { useRetrieveItem } from "../hooks/useGetModel";

const ProductImageContext = createContext();
const { Alert, Row, Col, Form, Button } = LAYOUT;

export default function ProductForm() {
  const [token, model] = useContext(DataDisplayContext);
  const { slug } = useParams();

  // Post to db if not slug else patch
  const { mutateAsync: modelUpdate } = useUpdateModel();
  const { mutateAsync: modelCreate } = useCreateModel();
  const createOrUpdate = slug ? modelUpdate : modelCreate;

  const navigate = useNavigate();

  // Alert message
  const [warning, setWarning] = useState("");

  // Disable submit button
  const [disabled, setDisabled] = useState(true);

  // User uploaded images
  const [newImages, setNewImages] = useState();
  // Deleted images
  const [removedimages, setRemovedImages] = useState([]);

  const [formState, setFormState] = useState({});

  const { data, isLoading, error } = useRetrieveItem({
    model,
    slug,
    token,
  });

  useEffect(() => {
    if (data) {
      setFormState(data.data);
    }
  }, [data]);

  if (isLoading) return <LoadingScreen />;
  if (error) return "An Error has occured " + error.message;

  const productSchema = object({
    name: string().max(250).required(),
    price: number(),
    category: string().required(),
    product_type: string(),
    color: string().max(70),
    // description: string(),
    // comment: string(),
  });

  function handleChange(e) {
    setDisabled(false);
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setDisabled(true);

    const res = await productSchema
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
          <Form.Label>Category: </Form.Label>
        </Col>
        <Col>
          <Form.Select
            name="category"
            value={formState.category || ""}
            onChange={(e) => {
              handleChange(e);
              e.target.value !== "hair" &&
                handleChange({ target: { name: "type", value: "" } });
            }}
          >
            <option value="">Choose category</option>
            <option value="hair">Hair</option>
            <option value="hair-products">Hair products</option>
            <option value="jewelry">Jewelry</option>
            <option value="cosmetics">Cosmetics</option>
          </Form.Select>
        </Col>
      </Row>
      {formState.category === "hair" && (
        <Row className="mb-3">
          <Col sm={3} className="m-auto">
            <Form.Label>Type: </Form.Label>
          </Col>
          <Col>
            <Form.Select
              name="type"
              value={formState.type || ""}
              onChange={(e) => {
                handleChange(e);
              }}
            >
              <option value="">Select type</option>
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
              handleChange(e);
            }}
            id="id_color"
            name="color"
            type="text"
            required
            maxLength="250"
            value={formState.color || ""}
          />
        </Col>
      </Row>
      <Row>
        <ProductImageContext.Provider
          value={{
            newImages,
            setNewImages,
            setFormState,
            formState,
            setDisabled,
            setRemovedImages,
          }}
        >
          <DisplayImages contextName={ProductImageContext} />
        </ProductImageContext.Provider>
      </Row>
      <Button type="submit" disabled={disabled}>
        Submit
      </Button>
    </Form>
  );
}

export async function postImages(newImages, token, setWarning, modelCreate) {
  // upload new images
  // cl(newImages, token);
  const form = new FormData();
  newImages.forEach((f) => form.append("image", f));
  const addData = {
    data: form,
    model: "image",
    token,
  };

  try {
    const { data: responseImages } = await modelCreate(addData);
    // cl(responseImages, "pi");
    return responseImages.map(({ image }) => {
      return image;
    });
  } catch (e) {
    cl(e.response?.message);
    setWarning(e.response?.message || "error images");
  }
}

export function DisplayImages({ contextName }) {
  const {
    newImages,
    setNewImages,
    formState,
    setFormState,
    setDisabled,
    setRemovedImages,
  } = useContext(contextName);

  const filterImages = (images, image) => {
    return images.filter((e) => e.image !== image);
  };
  return (
    <>
      {formState?.images?.map(({ image }, idx) => {
        return (
          <Col xs={6} md={4} lg={3} key={image + idx}>
            <Form.Check
              label="image"
              name="checkbox-image"
              type="checkbox"
              id={"image-checkbox-" + { idx }}
              checked={true}
              value={image || ""}
              onChange={(e) => {
                e.target.checked = false;
                if (!e.target.checked) {
                  setRemovedImages((prev) =>
                    prev ? prev.concat(image) : (prev = [image])
                  );
                  setFormState({
                    ...formState,
                    ["images"]: filterImages(formState.images, image),
                  });
                }
              }}
            />
            <Form.Label style={{ height: "15rem" }}>
              <img src={image} alt="image" className="w-100 h-100" />
            </Form.Label>
          </Col>
        );
      })}

      <Col sm={12}>
        {newImages &&
          newImages.map((i, idx) => (
            <div
              key={idx + i}
              className="p-1 mb-5 d-inline-block"
              style={{ maxHeight: "16rem", maxWidth: "11rem" }}
            >
              <Form.Check
                className="w-100 pb-1"
                id={"new-image-" + idx}
                checked
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
            setDisabled(false);
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
