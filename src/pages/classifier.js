import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import {
  Box, Button, Card, CardContent, Container, Grid, LinearProgress,
  ThemeProvider, createTheme, useTheme
} from '@mui/material';

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

  useEffect(() => {
    return () => {
      // Cleanup camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFiles([file]);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles([file]);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setFiles([]);
    setImagePreview(null);
  };

  const classifyAnother = () => {
    setImage(null);
    setFiles([]);
    setImagePreview(null);
  };

  const sendData = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', files[0], files[0].name);

    axios.post('https://backendsnake.onrender.com/predict', formData)
      .then(res => {
        const data = res.data;
        if (data.predicted_class && data.confidence) {
          setImage({
            predictedClass: data.predicted_class,
            confidence: data.confidence,
            snakeInfo: data.snake_info,
            uploaded_image: data.uploaded_image
          });
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' } }
      });
      videoRef.current.srcObject = stream;
    } catch {
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = fallbackStream;
      } catch (err) {
        console.error('Cannot access camera', err);
      }
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured_image.png', { type: 'image/png' });
        setFiles([file]);
        setImagePreview(URL.createObjectURL(file));
        setCameraActive(false);

        // Stop camera
        if (video.srcObject) {
          video.srcObject.getTracks().forEach(track => track.stop());
        }
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Image Classifier | Snake Classifier</title>
      </Head>

      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100%', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ClassifierHeader />
              {isLoading && (
                <Box mt={2} mb={3}><LinearProgress color="success" /></Box>
              )}
            </Grid>

            {!image && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      {cameraActive ? (
                        <Box>
                          <video ref={videoRef} autoPlay playsInline width="100%" />
                          <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
                        </Box>
                      ) : (
                        imagePreview ? (
                          <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                        ) : (
                          <ImageDropzone accept="image/*" onDrop={handleDrop} />
                        )
                      )}

                      <Box display="flex" gap={2} mt={2}>
                        <Button variant="contained" color="primary" onClick={() => fileInputRef.current.click()}>
                          เลือกรูปภาพจากอุปกรณ์
                        </Button>
                        <Button
                          variant="contained"
                          color={cameraActive ? 'success' : 'secondary'}
                          onClick={cameraActive ? captureImage : startCamera}
                        >
                          {cameraActive ? 'ถ่ายรูป' : 'เปิดกล้อง'}
                        </Button>
                      </Box>

                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />

                      {files.length > 0 && !isLoading && (
                        <Box mt={2} color="text.secondary">
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
                <ClassifierResult
                  selectedImage={imagePreview}
                  classificationResult={capitalizeFirstLetter(replaceUnderscore(image.predictedClass))}
                  snakeName={image.snakeInfo.thai_name}
                  confidence={image.confidence}
                  databaseImage={image.snakeInfo.imageUrl}
                  is_venomous={image.snakeInfo.is_venomous}
                  firstAid={image.snakeInfo.first_aid}
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
