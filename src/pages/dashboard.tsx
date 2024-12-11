import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Card,
  CardMedia,
  Stack,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface FormValues {
  carModel: string;
  price: number | '';
  phone: string;
  city: string;
  photos: File[];
  maxPhotos: number;
}

// Validation Schema
const validationSchema = Yup.object({
  carModel: Yup.string().required('Car model is required.'),
  price: Yup.number()
    .required('Price is required.')
    .min(1, 'Price must be greater than zero.'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits.')
    .required('Phone number is required.'),
  city: Yup.string().required('City is required.'),
  photos: Yup.array()
    .of(Yup.mixed())
    .min(1, 'At least one photo is required.')
    .max(Yup.ref('maxPhotos'), 'You cannot upload more than the selected number of photos.'),
  maxPhotos: Yup.number()
    .required('Please select the maximum number of photos allowed.')
    .min(1, 'You must allow at least one photo.'),
});

const Dashboard: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append('carModel', values.carModel);
      formData.append('price', values.price.toString());
      formData.append('phone', values.phone);
      formData.append('city', values.city);
      images.forEach((image) => {
        formData.append('photos', image);
      });

      const response = await axios.post('http://localhost:5000/api/cars', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Car added successfully!');
      }
    } catch (error) {
      console.error('Error submitting car details:', error);
      alert('Failed to add car. Please try again.');
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      carModel: '',
      price: '',
      phone: '',
      city: 'Lahore',
      photos: [],
      maxPhotos: 3,
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const updatedPhotos = [...images, ...files];
    if (updatedPhotos.length > formik.values.maxPhotos) {
      setError(`You can upload up to ${formik.values.maxPhotos} photos only.`);
      return;
    }
    setImages(updatedPhotos);
    setError('');
    formik.setFieldValue('photos', updatedPhotos);
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    formik.setFieldValue('photos', updatedImages);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Add Car Details
      </Typography>
      <Stack
        component="form"
        onSubmit={formik.handleSubmit}
        spacing={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper',
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Car Model"
          fullWidth
          variant="outlined"
          name="carModel"
          value={formik.values.carModel}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.carModel && Boolean(formik.errors.carModel)}
          helperText={formik.touched.carModel && formik.errors.carModel}
        />
        <TextField
          label="Price"
          type="number"
          fullWidth
          variant="outlined"
          name="price"
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.price && Boolean(formik.errors.price)}
          helperText={formik.touched.price && formik.errors.price}
        />
        <TextField
          label="Phone"
          type="tel"
          fullWidth
          variant="outlined"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
        />
        <Typography variant="subtitle1" gutterBottom>
          City:
        </Typography>
        <RadioGroup
          row
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
        >
          <FormControlLabel value="Lahore" control={<Radio />} label="Lahore" />
          <FormControlLabel value="Karachi" control={<Radio />} label="Karachi" />
        </RadioGroup>
        <FormControl fullWidth>
          <InputLabel id="max-photos-label">Max Photos</InputLabel>
          <Select
            labelId="max-photos-label"
            name="maxPhotos"
            value={formik.values.maxPhotos}
            onChange={(e) => {
              formik.handleChange(e);
              formik.setFieldValue('photos', []); // Reset photos if max changes
              setImages([]); // Clear images
            }}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box>
          <Button
            variant="contained"
            component="label"
            startIcon={<AddPhotoAlternateIcon />}
            fullWidth
          >
            Add Pictures
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
              onChange={handleImageUpload}
            />
          </Button>
          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}
          {formik.touched.photos && formik.errors.photos && (
            <Typography color="error" variant="body2" mt={1}>
              {formik.errors.photos}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
          {images.map((image, index) => (
            <Card key={index} sx={{ maxWidth: 120, position: 'relative' }}>
              <CardMedia
                component="img"
                height="120"
                image={URL.createObjectURL(image)}
                alt={`uploaded-${index}`}
                sx={{ borderRadius: 1 }}
              />
              <IconButton
                onClick={() => handleDeleteImage(index)}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Card>
          ))}
        </Stack>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
        >
          Add Car
        </Button>
      </Stack>
    </Box>
  );
};

export default Dashboard;
