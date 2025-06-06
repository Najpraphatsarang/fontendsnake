import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Container, Typography, Box, CircularProgress, Divider } from "@mui/material";
import { Link } from "react-scroll";

export default function SnakeInfoPage() {
  const [snake, setSnake] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { species } = router.query;

  useEffect(() => {
    if (!species) return;

    const fetchSnakeInfo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const encodedSpecies = encodeURIComponent(species.trim());
        const url = `https://backendsnake.onrender.com/snake_info/${encodedSpecies}`;

        console.log("📌 species:", species);
        console.log("🚀 Fetching from URL:", url);

        const response = await axios.get(url);

        console.log("🔥 API Response:", response.data);

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        setSnake(response.data.snake);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("ไม่พบข้อมูลงูที่คุณต้องการ");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnakeInfo();
  }, [species]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ marginTop: "50px" }}>
        <Typography color="error" align="center" variant="h5">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Container maxWidth="md" sx={{ flexGrow: 1, marginTop: "120px", paddingBottom: "100px" }}>
        <Typography variant="h4" gutterBottom align="center">
          {snake?.thai_name|| "ไม่พบชื่อ"}
        </Typography>

        <Box display="flex" justifyContent="center" sx={{ mb: 4 }}>
          <img
            src={snake?.imageUrl || "/placeholder.jpg"}
            alt={snake?.binomial || "ไม่พบรูปภาพ"}
            style={{ width: "100%", maxWidth: "600px", borderRadius: "10px" }}
          />
        </Box>

        <Box mt={3}>
          <Typography>
            <strong>ชื่อภาษาไทย:</strong> {snake?.thai_name || "ไม่มีข้อมูล"}
          </Typography>
          <Typography>
            <strong>ขนาด:</strong> {snake?.size || "ไม่มีข้อมูล"}
          </Typography>
          <Typography>
            <strong>ระดับอันตราย:</strong> {snake?.danger_level || "ไม่มีข้อมูล"}
          </Typography>
          <Typography>
            <strong>สี:</strong> {Array.isArray(snake?.color) ? snake.color.join(", ") : "ไม่มีข้อมูล"}
          </Typography>
          <Typography>
            <strong>ถิ่นอาศัย:</strong> {Array.isArray(snake?.habitat) ? snake.habitat.join(", ") : "ไม่มีข้อมูล"}
          </Typography>
          <Typography>
            <strong>อาหาร:</strong> {Array.isArray(snake?.diet) ? snake.diet.join(", ") : "ไม่มีข้อมูล"}
          </Typography>
          <Typography>
            <strong>ลวดลาย:</strong> {snake?.pattern || "ไม่มีข้อมูล"}
          </Typography>
          <Typography>
            <strong>พิษ:</strong> {snake?.is_venomous ? "มีพิษ" : "ไม่มีพิษ"}
          </Typography>
          <Typography>
            <strong>ผลของพิษ:</strong> {snake?.venom_effects || "ไม่มีข้อมูล"}
          </Typography>
          <Typography mt={2}>
            <strong>รายละเอียด:</strong> {snake?.description || "ไม่มีข้อมูล"}
          </Typography>

          {/* เพิ่มส่วน first_aid */}
          {Array.isArray(snake?.first_aid) && (
            <Box
              mt={5}
              p={3}
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: "10px",
                boxShadow: 2,
                border: "1px solid #c8e6c9",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#2e7d32", fontWeight: "bold", mb: 2 }}
              >
                🩺 แนวทางปฐมพยาบาลเบื้องต้น
              </Typography>
              <ol style={{ paddingLeft: "20px", margin: 0 }}>
                {snake.first_aid.map((item, index) => (
                  <li key={index} style={{ marginBottom: "10px" }}>
                    <Typography variant="body1" sx={{ color: "#333" }}>
                      {item}
                    </Typography>
                  </li>
                ))}
              </ol>
            </Box>
          )}
        </Box>

        <Divider sx={{ marginTop: 4 }} />

        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          <Typography variant="h6" color="textSecondary">
            ข้อมูลเพิ่มเติมสามารถติดต่อเราได้ที่: contact@snakeinfo.com
          </Typography>
        </Box>

        <Box sx={{ marginTop: "50px", textAlign: "center" }}>
          <Link to="footer" smooth={true} duration={500}>
            <Typography color="primary" variant="body1">
              Scroll to Footer
            </Typography>
          </Link>
        </Box>
      </Container>

      <footer
        id="footer"
        style={{
          backgroundColor: "#333",
          color: "#fff",
          textAlign: "center",
          padding: "20px 0",
          width: "100%",
          marginTop: "auto",
        }}
      >
        <Typography variant="body2">© 2023 SnakeInfo</Typography>
      </footer>
    </Box>
  );
}
