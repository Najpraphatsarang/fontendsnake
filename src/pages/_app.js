"use client"; // เพิ่มคำสั่งนี้ที่ด้านบนสุดของไฟล์

import { useEffect } from "react";
import PropTypes from 'prop-types';
import AOS from 'aos';
import Head from 'next/head';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";

import 'aos/dist/aos.css';

import theme from "../theme/theme";
import Layout from '../layout/Layout'

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    //ตัวอย่างการใช้งาน AOS หรือการตั้งค่าอื่นๆ ที่คุณต้องการ
    AOS.init({
        once: true,
        delay: 0,
        offset: 0,
        easing: 'ease-in-out',
    });
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          content="minimum-scale=1, initial-scale=1, width=device-width"
          name="viewport"
        />
        <meta name="description" content="Image Classification" />
        <meta name="keywords" content="image, classification, machine learning" />
        <title>Image Classification</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
};

export default App;
