import { useState } from "react";
import PropTypes from 'prop-types';
import { useTheme } from "@mui/material";

import Header from "./Header";
import { Box } from "@mui/system";
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = ({children}) => {
    const theme = useTheme();

    const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

    return (
        <Box
         sx={{
            backgroundColor: theme.palette.background.default,
            height: '100%',
         }}
        >
           <Header onSidebarMobileOpen={() => setIsSidebarMobileOpen(true)}/>
            <Sidebar
             onMobileClose={()=> setIsSidebarMobileOpen(false)}
             openMobile={isSidebarMobileOpen}
            />
            <main>{children}</main>
            <Footer/>
        </Box>
    );
};

Layout.PropTypes = {
    children: PropTypes.node,
};

export default Layout;