"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = [
  { text: "Map", link: "https://nycmesh.net/map" },
  { text: "FAQ", link: "https://nycmesh.net/faq" },
  { text: "Docs", link: "https://nycmesh.net/docs" },
  { text: "Blog", link: "https://nycmesh.net/blog" },
  { text: "Get Support", link: "https://nycmesh.net/support" },
  { text: "Donate", link: "https://nycmesh.net/donate" },
  { text: "Get Connected", link: "https://nycmesh.net/join" },
];

export function Header(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Mesh Forms
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <Button component={Link} key={item.text} href={item.link}>
                {item.text}
              </Button>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const styles = {
    a: {
      color: 'inherit', // Makes the link color the same as the surrounding text
      textDecoration: 'none', // Removes underline from links
      backgroundColor: 'transparent', // Removes any background color
      fontSize: 'inherit', // Makes the link text size the same as surrounding text
      fontFamily: 'inherit', // Ensures the link font family is the same as surrounding text
      fontWeight: 'inherit', // Ensures the link font weight is the same as surrounding text
      lineHeight: 'inherit', // Ensures the link line height is the same as surrounding text
      // Add any other properties you want to reset
      display:"flex"
    }
  };
  

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        elevation={0}
        sx={{ backgroundColor: "#f4f4f4", color: "black", padding:"none"}}
        position="sticky"
      >
        <Container maxWidth="lg" disableGutters id="container">
          <Toolbar sx={{height: "4rem", display:"flex", justifyContent:"space-between"}}>
            <a href="/" style={styles.a}><img src="/logo.svg" style={{ width: "2rem" }} alt="" />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, marginLeft:"1rem", display: { xs: "none", sm: "block" } }}
            >
              <span style={{fontWeight:600}}>NYC Mesh</span>  <span style={{fontWeight:400}}>| Forms</span>
            </Typography></a>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              {navItems.map((item) => (
                <Button component={Link} key={item.text} href={item.link}>
                  {item.text}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" }, flex:1, justifyContent: 'flex-end' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              // sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
