import { createContext, useContext, useEffect, useState } from 'react';
import { object, string, number } from 'yup';
import useUpdateModel from '../../hooks/useUpdateModel';
import useCreateModel from '../../hooks/useCreateModel';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, cl, LAYOUT } from '../../api/base';
import { DataDisplayContext } from '../adminEdit';
const ImageContext = createContext();
const { Alert, Row, Col, Form, Button } = LAYOUT;

export default function ProductForm () {
  const [item, token, model] = useContext(DataDisplayContext);
  const navigate = useNavigate();

  const productSchema = object({
    name: string().max(250).required(),
    price: number(),
    category: string().required(),
    product_type: string(),
    color: string().max(70),
    description: string(),
    comment: string()
  });

  // Item values
  const [name, setName] = useState(item?.name || '');
  const [price, setPrice] = useState(item?.price || '');
  const [color, setColor] = useState(item?.color || '');
  const [type, setType] = useState(item?.type || '');
  const [category, setCategory] = useState(item?.category || '');
  const [images, setImages] = useState(item?.images || []);

  // cl(category, type);
  // User uploaded images
  const [newImages, setNewImages] = useState();

  // Reset to props images
  const [reset, setReset] = useState(false);

  // Disable submit button
  const [disabled, setDisabled] = useState(true);

  // Alert message
  const [warning, setWarning] = useState('');

  // Post to db
  const { mutateAsync: modelUpdate } = useUpdateModel();
  const { mutateAsync: modelCreate } = useCreateModel();
  const createOrUpdate = item ? modelUpdate : modelCreate;

  useEffect(() => {
    warning && setTimeout(() => setWarning(), 5000);
    disabled && setTimeout(() => setDisabled(false), 5000);
  }, [warning]);

  async function handleSubmit (e) {
    e.preventDefault();
    setDisabled(true);
    const data = {
      name,
      price,
      color,
      slug: item?.slug,
      type,
      category
    };

    const res = await productSchema
      .validate(data)
      .then(() => {})
      .catch((e) => {
        setWarning(e.message);
        setDisabled(false);
        return 'error';
      });
    if (res === 'error') return;

    const formData = new FormData();
    for (const d in data) {
      // if not changed
      if (item && item[d] === data[d]) continue;
      formData.append(d, data[d]);
    }

    /* Getting the removed images */
    if (item && item.images !== images) {
      const imgArr = images?.map(({ image }) => image);
      item.images.forEach(({ image }) => {
        if (!imgArr.includes(image)) formData.append('images', image);
      });
    }

    let uploadedImages;

    if (newImages) {
      const form = new FormData();
      newImages.forEach((f) => form.append('image', f));
      const addData = {
        data: form,
        model: 'image',
        token
      };
      // upload new images first
      try {
        const { data: responseImages } = await modelCreate(addData);
        uploadedImages = responseImages.map(({ image }) => {
          return image;
        });
      } catch (e) {
        cl(e.response.message);
        setWarning(e.response?.message);
        setDisabled(false);
      }
    }
    try {
      uploadedImages &&
        uploadedImages.forEach((i) => formData.append('newimages', i));
      await createOrUpdate({
        token,
        data: formData,
        slug: item?.slug,
        model
      }).then(() => {
        navigate(-1);
      });
    } catch (e) {
      setDisabled(false);
      setWarning(e.response?.message);
      cl(e.response.message);
      // Array(7) [ "stack", "message", "name", "code", "config", "request", "response" ]
    }
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className='p-3 mx-auto'
      style={{ maxWidth: '1350px' }}
    >
      {warning && (
        <Alert
          className='text-center text-capitalize'
          variant='danger'
          style={{ width: 'max-content' }}
        >
          {warning}
        </Alert>
      )}
      <Row className='mb-3'>
        <Col sm={3} className='m-auto'>
          <Form.Label>Name: </Form.Label>
        </Col>
        <Col>
          <Form.Control
            onChange={(e) => {
              setDisabled(false);
              setName(e.target.value);
            }}
            id='id_name'
            name='name'
            type='text'
            required
            maxLength='250'
            value={name}
          />
        </Col>
      </Row>
      <Row className='mb-3'>
        <Col sm={3} className='m-auto'>
          <Form.Label>Price: </Form.Label>
        </Col>
        <Col>
          <Form.Control
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            id='id_price'
            name='price'
            type='text'
            maxLength='50'
            value={price}
          />
        </Col>
      </Row>
      <Row className='mb-3'>
        <Col sm={3} className='m-auto'>
          <Form.Label>Category: </Form.Label>
        </Col>
        <Col>
          <Form.Select
            value={category}
            onChange={(e) => {
              setDisabled(false);
              setCategory(e.target.value);
              category === '' && setType('');
            }}
          >
            <option value=''>---------</option>
            <option value='hair'>Hair</option>
            <option value='hair-products'>Hair products</option>
            <option value='jewelry'>Jewelry</option>
            <option value='cosmetics'>Cosmetics</option>
          </Form.Select>
        </Col>
      </Row>
      {category === 'hair' && (
        <Row className='mb-3'>
          <Col sm={3} className='m-auto'>
            <Form.Label>Type: </Form.Label>
          </Col>
          <Col>
            <Form.Select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <option value=''>---------</option>
              {[
                ['braids', 'Braids'],
                ['crotchets', 'Crotchets'],
                ['extensions', 'Extensions'],
                ['locs', 'Locs'],
                ['weaves', 'Weaves']
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

      <Row className='mb-3'>
        <Col sm={3} className='m-auto'>
          <Form.Label>Color(s): </Form.Label>
        </Col>
        <Col>
          <Form.Control
            onChange={(e) => {
              setColor(e.target.value);
            }}
            id='id_color'
            name='color'
            type='text'
            required
            maxLength='250'
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
            item
          }}
        >
          <DisplayImages />
        </ImageContext.Provider>
      </Row>
      <Button type='submit' disabled={disabled}>
        Submit
      </Button>
    </Form>
  );
}

function DisplayImages () {
  const { images, setImages, reset, setReset, newImages, setNewImages, item } =
    useContext(ImageContext);
  return (
    <>
      {images?.map(({ image }, idx) => {
        return (
          <Col xs={6} md={4} lg={3} key={image + idx}>
            <Form.Check
              label='image'
              name='checkbox-image'
              type='checkbox'
              id={'image-checkbox-' + { idx }}
              checked
              value={image}
              onChange={(e) => {
                e.target.checked = false;
                if (!e.target.checked) {
                  setImages(images?.filter((i) => i.image !== image));
                  item?.images && setReset(true);
                }
              }}
            />
            <Form.Label style={{ height: '15rem' }}>
              <img src={BASE_URL + image} alt='image' className='w-100 h-100' />
            </Form.Label>
          </Col>
        );
      })}

      <Col xs={12} className='mt-3'>
        {reset && (
          <Button
            onClick={() => {
              setImages(item?.images);
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
              className='m-1 mb-5 d-inline-block'
              style={{ maxHeight: '16rem', maxWidth: '11rem' }}
            >
              <Form.Check
                className='w-100 pb-1'
                id={'new-image-' + idx}
                checked
                onChange={(e) => setNewImages(newImages.filter((n) => n !== i))}
              />
              <img
                src={URL.createObjectURL(i)}
                alt={i.name}
                key={idx}
                className='img-thumbnail w-100'
                style={{ height: '15rem' }}
              />
            </div>
          ))}
      </Col>
      <Col>
        <Form.Label>Add images: </Form.Label>
        <Form.Control
          className='my-3 mx-1'
          type='file'
          multiple
          accept='image/png, image/jpeg, image/jpg'
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
