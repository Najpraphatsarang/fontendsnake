import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const ClassifierResult = ({
  selectedImage,
  classificationResult,
  snakeName,
  confidence,
  is_venomous,
  databaseImage,
  firstAid
}) => {
  const venomousBool = Boolean(is_venomous);
  const displayConfidence =
    typeof confidence === 'number' ? `${confidence.toFixed(2)}%` : confidence;
  const venomStatus = venomousBool ? 'มีพิษ' : 'ไม่มีพิษ';

  return (
    <Grid item xs={12}>
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 5,
          backgroundColor: venomousBool ? '#ffebee' : '#e8f5e9',
          border: `2px solid ${venomousBool ? '#f44336' : '#4caf50'}`,
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              fontWeight={600}
              sx={{ color: venomousBool ? 'error.main' : 'success.main' }}
            >
              🐍 ผลการทำนาย
            </Typography>

            {selectedImage && databaseImage && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  เปรียบเทียบรูปภาพ:
                </Typography>
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', md: 'row' }}
                  justifyContent="center"
                  alignItems="center"
                  gap={4}
                  sx={{ mb: 3 }}
                >
                  <Box textAlign="center">
                    <Box
                      component="img"
                      src={selectedImage}
                      alt="Uploaded snake"
                      sx={{
                        height: 250,
                        width: 'auto',
                        borderRadius: '20px',
                        boxShadow: 4,
                        border: '2px solid #ccc',
                      }}
                    />
                    <Typography variant="caption" display="block" mt={1}>
                      รูปภาพที่อัปโหลด
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Box
                      component="img"
                      src={databaseImage}
                      alt="Snake from database"
                      sx={{
                        height: 250,
                        width: 'auto',
                        borderRadius: '20px',
                        boxShadow: 4,
                        border: '2px solid #ccc',
                      }}
                    />
                    <Typography variant="caption" display="block" mt={1}>
                      รูปภาพจากฐานข้อมูล
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            {!databaseImage && selectedImage && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  รูปภาพที่ส่งไปทำนาย:
                </Typography>
                <Box
                  component="img"
                  src={selectedImage}
                  alt="Uploaded snake"
                  sx={{
                    height: 250,
                    width: 'auto',
                    borderRadius: '20px',
                    boxShadow: 4,
                    mb: 3,
                    border: '2px solid #ccc',
                  }}
                />
              </>
            )}

            <Divider sx={{ width: '100%', mb: 2 }} />

            <Typography variant="h6" align="center" gutterBottom>
              <strong>ชื่อทางวิทยาศาสตร์:</strong> {classificationResult}
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
              <strong>ชื่อภาษาไทย:</strong> {snakeName}
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
              <strong>ความมั่นใจ:</strong> {displayConfidence}
            </Typography>
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              sx={{
                color: venomousBool ? 'error.main' : 'success.main',
                fontWeight: 'bold',
              }}
            >
              <strong>พิษ:</strong> {venomStatus} {venomousBool ? '⚠️' : '✅'}
            </Typography>

            {Array.isArray(firstAid) && firstAid.length > 0 && (
              <>
                <Divider sx={{ width: '100%', my: 2 }} />
                <Typography variant="h6" align="center" gutterBottom fontWeight={600}>
                  🩺 วิธีปฐมพยาบาลเบื้องต้น
                </Typography>
                <Box component="ul" sx={{ textAlign: 'left', maxWidth: 500, px: 2 }}>
                  {firstAid.map((item, idx) => (
                    <li key={idx}>
                      <Typography variant="body1">{item}</Typography>
                    </li>
                  ))}
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ClassifierResult;
