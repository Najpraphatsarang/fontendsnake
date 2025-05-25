import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function SnakeInfo({ snake }) {
  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        {snake.binomial} - {snake.thai_name}
      </Typography>
      <img
        src={snake.imageUrl}
        alt={snake.binomial}
        style={{
          width: "100%",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      />
      <Typography variant="body1" sx={{ marginTop: "10px" }}>
        <strong>ชื่อไทย:</strong> {snake.thai_name}
      </Typography>
      <Typography variant="body1">
        <strong>ชื่อวิทยาศาสตร์:</strong> {snake.binomial}
      </Typography>
      <Typography variant="body1">
        <strong>รายละเอียด:</strong> {snake.description || "ไม่มีข้อมูล"}
      </Typography>
    </Box>
  );
}
