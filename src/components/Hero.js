import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme, useMediaQuery } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import HeroButtons from '../components/HeroButtons';

const Hero = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <Box
      maxWidth={{ sm: 720, md: 1236 }}
      width={1}
      margin="0 auto"
      paddingTop={10}
      backgroundColor={theme.palette.background.default}
    >
      <Grid container spacing={4} marginTop="20px">
        <Grid item xs={12} md={6}>
          <Box data-aos={isMd ? 'fade-right' : 'fade-up'}>
            <Box marginBottom={2}>
              <Typography
                align="center"
                color={theme.palette.text.primary}
                variant="h1"
                marginTop="30px"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                เลือกภาพสำหรับการจำแนก
              </Typography>
            </Box>
            <Box marginBottom={3}>
              <Typography
                align="center"
                color={theme.palette.text.secondary}
                variant="h4"
                paddingTop={3}
                paddingBottom={3}
                marginBottom="15px"
                sx={{
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' },
                }}
              >
                แอปจะบอกคุณว่าภาพงูที่คุณเลือกคือสายพันธุ์อะไร
              </Typography>
            </Box>
            <HeroButtons />
          </Box>
        </Grid>
        <Grid
          item
          container
          alignItems="center"
          justifyContent="center"
          xs={12}
          md={6}
        >
          <Box
            sx={{
              height: { xs: 300, md: 400 },
              width: { xs: '100%', md: '100%' },
              borderRadius: 2,
              overflow: 'hidden',
              '& img': {
                objectFit: 'cover',
              },
            }}
          >
            <LazyLoadImage
              src="/image.png"   // path ต้องขึ้นต้นด้วย '/' และไฟล์ต้องอยู่ public folder
              alt="Hero"
              effect="blur"
              style={{ width: '100%', height: '100%', borderRadius: '16px' }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
