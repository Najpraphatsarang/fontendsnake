import Link from 'next/link';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Image from 'next/image'; // For handling images
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

// ... import เหมือนเดิมทั้งหมด

const Header = ({ onSidebarMobileOpen }) => {
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const wrapperRef = useRef(null);

  const handleSearchChange = async (event) => {
    const value = event.target.value;
    setSearchQuery(value);

    if (value.trim() !== '') {
      try {
        const res = await fetch(
          `http://localhost:8000/searchsnake?search=${encodeURIComponent(value.trim())}`
        );
        const data = await res.json();
        setSearchResults(data.snakes?.length > 0 ? data.snakes : []);
      } catch (err) {
        console.error('🔥 Error during search:', err);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResultClick = (binomial) => {
    const encoded = encodeURIComponent(binomial);
    setSearchQuery('');
    setSearchResults([]);
    router.push(`/snake_info/${encoded}`);
  };

  return (
    <AppBar
      elevation={5}
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
      }}
    >
      <Toolbar sx={{ minHeight: 70 }}>
        {/* Hamburger menu button (mobile only) */}
        <IconButton
          color="inherit"
          onClick={onSidebarMobileOpen}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon fontSize="medium" />
        </IconButton>

        {/* Logo */}
        <Link href="/" passHref>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
  <IconButton size="large" disabled>
    <PhotoCameraIcon sx={{ color: theme.palette.common.white, fontSize: 30 }} />
    <Typography
      component="h1"
      variant="h6"
      sx={{
        fontSize: {xs: '1rem', sm: "1.5rem", md: '2rem'},
        flexGrow: 1,
        color: theme.palette.common.white,
        fontWeight: 'bold',
        textDecoration: 'none',
        marginLeft: '10px',
        display: { xs: 'none', sm: 'block' }, // ซ่อนไอคอน text บน xs
      }}
    >
      โปรแกรมจำแนกรูปภาพงู
    </Typography>
  </IconButton>
</Box>
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        {/* Search bar */}
        <Box ref={wrapperRef} sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="ค้นหาสายพันธุ์งู"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              backgroundColor: theme.palette.common.white,
              borderRadius: 1,
              marginRight: 2,
              '& input': {
                paddingLeft: 1,
              },
              width: { xs: 150, sm: 200, md: 250 },
            }}
          />

          {searchResults.length > 0 && (
            <Paper
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 10,
                maxHeight: 250,
                overflowY: 'auto',
                mt: 1,
              }}
            >
              <List>
                {searchResults.map((snake) => (
                  <ListItem key={snake._id} disablePadding>
                    <ListItemButton onClick={() => handleResultClick(snake.binomial)}>
                      <ListItemText
                        primary={snake.thai_name}
                        secondary={snake.binomial}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {/* Navigation Buttons (hidden on small screens) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button
            component="a"
            href="/"
            size="small"
            variant="text"
            sx={{
              color: theme.palette.common.white,
              fontSize: theme.typography.subtitle1,
              fontWeight: 'medium',
              marginRight: 2,
              '& svg': {
                marginRight: 0.5,
              },
            }}
          >
            <HomeOutlinedIcon /> หน้าหลัก
          </Button>

          <Button
            component="a"
            href="/species"
            size="small"
            variant="text"
            sx={{
              color: theme.palette.common.white,
              fontSize: theme.typography.subtitle1,
              fontWeight: 'medium',
              marginRight: 2,
              '& svg': {
                marginRight: 0.5,
              },
            }}
          >
            <SearchIcon style={{ height: 23, width: 23 }} />
            สายพันธุ์งู
          </Button>

          <Button
            component="a"
            href="/classifier"
            size="small"
            variant="text"
            sx={{
              color: theme.palette.common.white,
              fontSize: theme.typography.subtitle1,
              fontWeight: 'medium',
              marginRight: 2,
              '& svg': {
                marginRight: 0.5,
              },
            }}
          >
            <InsertPhotoOutlinedIcon style={{ height: 23, width: 23 }} />
            จำแนกรูปภาพงู
          </Button>
        </Box>
      </Toolbar>
      <Divider />
    </AppBar>
  );
};

export default Header;
