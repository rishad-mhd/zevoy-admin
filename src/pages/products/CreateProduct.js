import { Box, Button, Container, Grid, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { API_URL } from '../../constant/defaultValues';

function CreateProduct() {
  const [category, setCategory] = useState([]);
  // const [colors, setColors] = useState([]);
  const navigate = useNavigate();
  const CreateProductSchema = Yup.object().shape({
    name: Yup.string().required(),
    price: Yup.number().required(),
    offer: Yup.number().required(),
    description: Yup.string().required(),
    image: Yup.array().min(1).required(),
    // colors: Yup.array().min(1).required(),
    rating: Yup.string().required(),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      description: '',
      image: [],
      size: [10],
      offer: '',
      rating: '',
      category: '',
      deliveryFee: '',
      details: { ram: '', processor: '', frontCam: '', rearCam: '', display: '', battery: '' },
    },
    validationSchema: CreateProductSchema,
    onSubmit: (values) => {
      const formdata = new FormData();
      Object.keys(values).forEach((value) => {
        if (value === 'image') {
          values.image.forEach((image) => {
            console.log(image);
            formdata.append(`images`, image);
          });
          return;
        }
        if (value === 'details') {
          Object.keys(values.details).forEach((key) => {
            formdata.append(`details[${key}]`, values.details[key]);
          });
          return;
        }
        formdata.append(value, values[value]);
      });
      axios
        .post(`${API_URL}/api/v1/products`, formdata, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        })
        .then((res) => {
          navigate('/dashboard/products');
        });
    },
  });
  const { getFieldProps, errors, touched, handleSubmit, values, setFieldValue } = formik;
  const handleFileUpload = useCallback(
    (files) => {
      if (files) {
        setFieldValue('image', Array.from(files));
      }
    },
    [setFieldValue]
  );
  useEffect(() => {
    axios
      .get(`${API_URL}/api/v1/category`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      })
      .then((res) => {
        setCategory(res.data);
      });
  }, []);
  // useEffect(() => {
  //   setFieldValue('colors', colors);
  // }, [colors]);
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Product | Minimal UI </title>
      </Helmet>
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Create Products
        </Typography>
        <FormikProvider value={formik}>
          <Form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item md={6}>
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    label="Price"
                    {...getFieldProps('price')}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                  />
                  <TextField
                    label="Description"
                    multiline
                    minRows={2}
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                  <TextField
                    label="Offer %"
                    {...getFieldProps('offer')}
                    error={Boolean(touched.offer && errors.offer)}
                    helperText={touched.offer && errors.offer}
                  />
                  <TextField
                    label="Rating"
                    {...getFieldProps('rating')}
                    error={Boolean(touched.rating && errors.rating)}
                    helperText={touched.rating && errors.rating}
                  />
                  <TextField
                    label="Delivery fee"
                    {...getFieldProps('deliveryFee')}
                    error={Boolean(touched.deliveryFee && errors.deliveryFee)}
                    helperText={touched.deliveryFee && errors.deliveryFee}
                  />
                  <Select
                    label="Category"
                    {...getFieldProps('category')}
                    error={Boolean(touched.category && errors.category)}
                    helperText={touched.rating && errors.rating}
                  >
                    {category.map((obj) => (
                      <MenuItem value={obj._id}>{obj.name}</MenuItem>
                    ))}
                  </Select>
                  <Typography variant="subtitle1">Other details</Typography>
                  <TextField
                    label="Ram"
                    {...getFieldProps('details.ram')}
                    // error={Boolean(touched.details?.ram && errors.details?.ram)}
                    // helperText={touched.details?.ram && errors.details?.ram}
                  />
                  <TextField
                    label="Processor"
                    {...getFieldProps('details.processor')}
                    // error={Boolean(touched.details.processor && errors.details.processor)}
                    // helperText={touched.details.processor && errors.details.processor}
                  />
                  <TextField
                    label="Front Cam"
                    {...getFieldProps('details.frontCam')}
                    // error={Boolean(touched.details.frontCam && errors.details.frontCam)}
                    // helperText={touched.details.frontCam && errors.details.frontCam}
                  />
                  <TextField
                    label="Rear Cam"
                    {...getFieldProps('details.rearCam')}
                    // error={Boolean(touched.details.rearCam && errors.details.rearCam)}
                    // helperText={touched.details.rearCam && errors.details.rearCam}
                  />
                  <TextField
                    label="Display"
                    {...getFieldProps('details.display')}
                    // error={Boolean(touched.details.display && errors.details.display)}
                    // helperText={touched.details.display && errors.details.display}
                  />
                  <TextField
                    label="Battery"
                    {...getFieldProps('details.battery')}
                    // error={Boolean(touched.details.battery && errors.details.battery)}
                    // helperText={touched.details.battery && errors.details.battery}
                  />
                  {/* <Stack direction={'row'} spacing={1}>
                      {colors.map((color) => (
                        <Box height={30} width={30} sx={{ bgcolor: color }} />
                      ))}
                    </Stack>
                    <label htmlFor="raised-button-color">
                      <Stack direction={'row'} alignItems="center" spacing={2}>
                        <input
                          className={'raised-button-color'}
                          id="raised-button-color"
                          type="color"
                          onBlur={(e) => setColors((ps) => [...ps, e.target.value])}
                        />
                        <Button variant="contained" component="span">
                          Color
                        </Button>
                      </Stack>
                    </label> */}
                  <Stack direction={'row'}>
                    {values.image.map((obj, i) => (
                      <Box
                        key={i}
                        width={50}
                        height={50}
                        component={'img'}
                        src={URL.createObjectURL(obj)}
                        alt="image"
                      />
                    ))}
                  </Stack>
                  <label htmlFor="raised-button-file">
                    <Stack direction={'row'} alignItems="center" spacing={2}>
                      <input
                        accept="image/*"
                        className={'raised-button-file'}
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        multiple
                        type="file"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                      <Button variant="contained" component="span">
                        Images
                      </Button>
                      {touched.image && errors.image ? (
                        <Typography variant="caption" color="error">
                          {errors.image}
                        </Typography>
                      ) : (
                        <></>
                      )}
                    </Stack>
                  </label>
                  <Button variant="contained" type="submit">
                    Submit
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Container>
    </>
  );
}

export default CreateProduct;
