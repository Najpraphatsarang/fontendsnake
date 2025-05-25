import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import SendToMobileOutlinedIcon from '@mui/icons-material/SendToMobileOutlined';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';

import DescriptionItem from './DescriptionItem';

const Description = () => {
  const theme = useTheme();

  return (
    <Box
      maxWidth={{ sm: 720, md: 1236 }}
      width={1}
      margin='0 auto'
      paddingTop={2}
      paddingBottom={2}
    >
      <Box
        backgroundColor={theme.palette.background.default}
        paddingTop={4}
        data-aos='fade-up'
      >
        <Container
          maxWidth='lg'
          display='flex'
          sx={{
            alignItems: 'center',
            flexDirection: 'column',
            paddingX: {
              md: '15px !important',
            },
          }}
        >
          <Typography            
            align='center'
            color={theme.palette.text.primary}
            variant='h1'
            marginTop='30px'
            data-aos='fade-up'
          >
            วิธีการใช้งาน
          </Typography>
          <Typography
            align='center'
            color={theme.palette.text.secondary}
            variant='h4'
            paddingTop={3}
            paddingBottom={3}
            marginBottom='15px'
            data-aos='fade-up'
          >
            คู่มือทีละขั้นตอนในการใช้งานแอปพลิเคชัน
          </Typography>
          <Grid container spacing={4} data-aos='fade-up'>
            <DescriptionItem
              icon={<AddAPhotoOutlinedIcon style={{ height: 25, width: 25 }} />}
              title='เลือกภาพ'
              subtitle='เลือกภาพที่ต้องการจำแนกและลากและวางมันลงในพื้นที่ที่กำหนดในเบราว์เซอร์'
            />
            <DescriptionItem
              icon={
                <SendToMobileOutlinedIcon style={{ height: 25, width: 25 }} />
              }
              title='ส่งภาพเพื่อจำแนก'
              subtitle='กดปุ่มส่งภาพเพื่อส่งภาพไปยังโมเดลแมชชีนเลิร์นนิงสำหรับการจำแนก'
            />
            <DescriptionItem
              icon={<GetAppOutlinedIcon style={{ height: 25, width: 25 }} />}
              title='รับผลการจำแนก'
              subtitle='จากนั้นโมเดลแมชชีนเลิร์นนิงจะทำการจำแนกภาพและแสดงผลการจำแนกบนหน้าจอ'
            />
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Description;
