import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress"; // ใช้ LinearProgress
import AOS from "aos";
import "aos/dist/aos.css";


export default function TitlebarBelowMasonryImageList() {
  const [snakes, setSnakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://backendsnake.onrender.com/snakes", { withCredentials: true });
        console.log("API Response:", response.data);
        if (response.data && response.data.snakes) {
          setSnakes(response.data.snakes);
        } else {
          setError("No snakes data available.");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const handleClick = (snake) => {
    const species = encodeURIComponent(snake.binomial); // ใช้ encodeURIComponent เพียงครั้งเดียว
    console.log("Navigating to:", `/snake_info/${species}`);
    router.push(`/snake_info/${species}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        overflowY: "auto",
        marginTop: "80px",
        minHeight: "calc(100vh - 100px)",
        paddingBottom: "100px",
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh", // ตั้งความสูงเพื่อให้แสดงตรงกลางหน้าจอ
          }}
        >
          <LinearProgress sx={{ width: "80%" }} /> {/* กำหนดความกว้างของเส้นโปรเกรส */}
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            กำลังโหลด...
          </Typography>
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <ImageList variant="masonry" cols={3} gap={8}>
          {snakes.map((snake, index) => (
            <ImageListItem
              key={snake._id || index} // ใช้ index เป็น key ในกรณีที่ _id ไม่มีค่า
              data-aos="fade-up"
              data-aos-delay={index * 200}
              onClick={() => handleClick(snake)}
              sx={{ cursor: "pointer" }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  "&:hover .overlay": { transform: "translate3d(0, 0, 0)" },
                  "&:hover img": { transform: "scale(1.1)" },
                }}
              >
                <img
                  src={`${snake.imageUrl}?w=248&fit=crop&auto=format`}
                  alt={snake.binomial}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: "translate3d(0, 100%, 0)",
                    transition: "transform 300ms ease",
                  }}
                >
                  <Typography variant="h6">
                    {snake.binomial} - {snake.thai_name}
                  </Typography>
                </Box>
              </Box>
              <ImageListItemBar
                position="below"
                title={`${snake.binomial} - ${snake.thai_name}`}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
}
