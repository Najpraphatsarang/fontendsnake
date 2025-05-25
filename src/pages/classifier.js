import { useState, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme, ThemeProvider, createTheme } from '@mui/material';

import ImageDropzone from '../components/ImageDropzone.js';
import ClassifierButtons from '../components/ClassifierButtons.js';
import ClassifierHeader from '../components/ClassifierHeader.js';
import ClassifierResult from '../components/ClassifierResult.js';
import ClassifyAgain from '../components/ClassifyAgain.js';
import Spacer from '../components/Spacer.js';
import replaceUnderscore from '../utils/replaceUnderscore.js';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter.js';

const theme = createTheme();

const ImageClassifierPage = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFiles([file]);
    setImagePreview(URL.createObjectURL(file)); // Preview image
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      setFiles([file]);
      setImagePreview(URL.createObjectURL(file)); // Preview image
    }
  };

  const classifyAnother = () => {
    setImage(null);
    setFiles([]);
    setImagePreview(null); // Reset preview
  };

  const sendData = () => {
    setFiles([]);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', files[0], files[0].name);

    axios
      .post('https://backendsnake.onrender.com/predict', formData, {
        headers: {
          accept: 'application/json',
          'content-type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Response from API:', response.data);
        if (response.data && response.data.predicted_class && response.data.confidence) {
          setImage({
            predictedClass: response.data.predicted_class,
            confidence: response.data.confidence,
            snakeInfo: response.data.snake_info,
            uploaded_image: response.data.uploaded_image
          });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const handleRemove = () => {
    setFiles([]);
    setImagePreview(null); // Reset preview
  };

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: 'environment' }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.warn('Trying default camera as fallback.');
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      } catch (fallbackError) {
        console.error('Camera access failed:', fallbackError);
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], 'captured_image.png', { type: 'image/png' });
        setFiles([file]);
        setImagePreview(URL.createObjectURL(file)); // Preview captured image
        setCameraActive(false);
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Image Classifier | Image Classification</title>
      </Head>
      <Box
        backgroundColor={theme.palette.background.default}
        minHeight='100%'
        paddingTop={15}
        paddingBottom={15}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item container alignItems='center' justifyContent='space-between' marginTop='-30px' spacing={3} xs={12}>
              <ClassifierHeader />
              <Grid item xs={12}>
                {isLoading && (
                  <Box marginBottom={3} marginTop={2}>
                    <LinearProgress color='success' />
                  </Box>
                )}
              </Grid>
            </Grid>

            {!image && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box display='flex' flexDirection='column' alignItems='center'>
                      {!cameraActive ? (
                        imagePreview ? (
                          <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                        ) : (
                          <ImageDropzone accept='image/jpeg,image/jpg,image/png,image/gif' onDrop={handleDrop} />
                        )
                      ) : (
                        <Box>
                          <video ref={videoRef} autoPlay playsInline width='100%' />
                          <canvas ref={canvasRef} width='640' height='480' style={{ display: 'none' }} />
                        </Box>
                      )}

                      <Box display="flex" gap={2} marginTop={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => fileInputRef.current.click()}
                        >
                          เลือกรูปภาพจากอุปกรณ์
                        </Button>
                        {!cameraActive ? (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={startCamera}
                          >
                            เปิดกล้อง
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={captureImage}
                          >
                            ถ่ายรูป
                          </Button>
                        )}
                      </Box>

                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />

                      {files.length > 0 && !isLoading && (
                        <Box marginTop={2} color={theme.palette.text.secondary}>
                          Loaded image: <Button>{files[0].name}</Button>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

{image && (
  <>
    {console.log("🎯 Backend response:", image)}
    <ClassifierResult
      selectedImage={imagePreview} // รูปที่ user อัปโหลดขึ้น
      classificationResult={capitalizeFirstLetter(replaceUnderscore(image.predictedClass))}
      snakeName={image.snakeInfo.thai_name}
      confidence={(image.confidence * 100).toFixed(2)}
      poisonous={image.snakeInfo.poisonous === "1" ? "พิษ" : "ไม่พิษ"}
      databaseImage={image.snakeInfo.imageUrl}
    />
    <ClassifyAgain submitOnClick={classifyAnother} />
  </>
)}


            <Grid item xs={12}>
              {files.length > 0 && !isLoading && (
                <ClassifierButtons submitOnClick={sendData} resetOnClick={handleRemove} />
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Spacer sx={{ paddingTop: 6 }} />
    </ThemeProvider>
  );
};

export default ImageClassifierPage;
