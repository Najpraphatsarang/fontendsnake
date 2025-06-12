import { useState, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import {
  Box, Button, Card, CardContent, Container,
  Grid, LinearProgress
} from '@mui/material';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';

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
  const [imagePreview, setImagePreview] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFiles([file]);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles([file]);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const classifyAnother = () => {
    setImage(null);
    setFiles([]);
    setImagePreview(null);
  };

  const sendData = async () => {
    if (files.length === 0) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', files[0], files[0].name);

    try {
      const response = await axios.post(
        'https://backendsnake.onrender.com/predict',
        formData,
        {
          headers: {
            accept: 'application/json',
            'content-type': 'multipart/form-data',
          },
        }
      );

      const data = response.data;
      if (data?.predicted_class && data?.confidence) {
        setImage({
          predictedClass: data.predicted_class,
          confidence: data.confidence,
          snakeInfo: data.snake_info,
          uploaded_image: data.uploaded_image,
        });
      }
    } catch (error) {
      console.error('❌ API Error:', error);
    } finally {
      setIsLoading(false);
      setFiles([]);
    }
  };

  const handleRemove = () => {
    setFiles([]);
    setImagePreview(null);
  };

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' } },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.warn('📷 Fallback to default camera');
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = fallbackStream;
      } catch (fallbackError) {
        console.error('❌ Camera error:', fallbackError);
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
        setImagePreview(URL.createObjectURL(file));
        setCameraActive(false);
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Image Classifier | Snake Identifier</title>
      </Head>
      <Box bgcolor={theme.palette.background.default} minHeight="100%" py={15}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Header + Progress Bar */}
            <Grid item xs={12}>
              <ClassifierHeader />
              {isLoading && (
                <Box my={2}>
                  <LinearProgress color="success" />
                </Box>
              )}
            </Grid>

            {/* Upload Card */}
            {!image && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      {/* Image Preview or Camera Feed */}
                      {!cameraActive ? (
                        imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ maxWidth: '100%', borderRadius: '8px' }}
                          />
                        ) : (
                          <ImageDropzone
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            onDrop={handleDrop}
                          />
                        )
                      ) : (
                        <>
                          <video ref={videoRef} autoPlay playsInline width="100%" />
                          <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
                        </>
                      )}

                      {/* Action Buttons */}
                      <Box display="flex" gap={2} mt={2}>
                        <Button variant="contained" onClick={() => fileInputRef.current.click()}>
                          เลือกรูปภาพ
                        </Button>
                        {!cameraActive ? (
                          <Button variant="contained" color="secondary" onClick={startCamera}>
                            เปิดกล้อง
                          </Button>
                        ) : (
                          <Button variant="contained" color="success" onClick={captureImage}>
                            ถ่ายรูป
                          </Button>
                        )}
                      </Box>

                      {/* Hidden Input */}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />

                      {/* File Name */}
                      {files.length > 0 && !isLoading && (
                        <Box mt={2}>
                          โหลดรูป: <strong>{files[0].name}</strong>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Result */}
            {image && (
              <>
                <ClassifierResult
                  selectedImage={imagePreview}
                  classificationResult={capitalizeFirstLetter(replaceUnderscore(image.predictedClass))}
                  snakeName={image.snakeInfo?.thai_name}
                  confidence={image.confidence}
                  databaseImage={image.snakeInfo?.imageUrl}
                  is_venomous={image.snakeInfo?.is_venomous}
                  firstAid={image.snakeInfo?.first_aid}
                />
                <ClassifyAgain submitOnClick={classifyAnother} />
              </>
            )}

            {/* Classify / Reset Buttons */}
            {files.length > 0 && !isLoading && (
              <Grid item xs={12}>
                <ClassifierButtons submitOnClick={sendData} resetOnClick={handleRemove} />
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
      <Spacer sx={{ paddingTop: 6 }} />
    </ThemeProvider>
  );
};

export default ImageClassifierPage;
