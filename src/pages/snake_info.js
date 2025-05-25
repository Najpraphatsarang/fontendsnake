import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function SnakeDetail() {
  const [snake, setSnake] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { species } = router.query;  // Getting the species from the URL

  useEffect(() => {
    if (species) {
      axios
        .get(`http://localhost:5000/api/snakes/species/${species}`, { withCredentials: true })
        .then((response) => {
          setSnake(response.data);
          setIsLoading(false);
        })
        .catch(() => {
          setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
          setIsLoading(false);
        });
    }
  }, [species]);

  if (isLoading) {
    return <p>⏳ Loading snake details...</p>;
  }

  if (error) {
    return <Typography color="error" align="center">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">{snake.binomial}</Typography>
      <Typography variant="h6">{snake.thai_name}</Typography>
      <img
        src={snake.imageUrl}
        alt={snake.binomial}
        style={{ width: "100%", height: "auto", objectFit: "cover" }}
      />
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        {snake.description}
      </Typography>
    </Box>
  );
}
