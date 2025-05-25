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
  poisonous,
  databaseImage,
}) => {
  return (
    <Grid item xs={12}>
      <Card sx={{ borderRadius: 4, boxShadow: 5 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
              🐍 ผลการทำนาย
            </Typography>

            {/* เปรียบเทียบรูปภาพ */}
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
                  {/* รูปที่ผู้ใช้อัปโหลด */}
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

                  {/* รูปจากฐานข้อมูล */}
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

            {/* กรณีมีแค่รูปเดียว */}
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

            {/* รายละเอียดผลการทำนาย */}
            <Typography variant="h6" align="center" gutterBottom>
              <strong>ชื่อทางวิทยาศาสตร์:</strong> {classificationResult}
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
              <strong>ชื่อภาษาไทย:</strong> {snakeName}
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
              <strong>ความมั่นใจ:</strong> {confidence}%
            </Typography>
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              sx={{
                color: poisonous === 'พิษ' ? 'error.main' : 'success.main',
                fontWeight: 'bold',
              }}
            >
              <strong>พิษ:</strong> {poisonous}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ClassifierResult;
