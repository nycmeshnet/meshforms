import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

import { Box, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const Landing = () => {
  const t = useTranslations("Landing");
  const buttons = [
    { text: "Join Form", link: "/join" },
    { text: "NN Assign Form", link: "/nn-assign" },
    { text: "Query Form", link: "/query" },
    { text: "Pano", link: "/pano/view/" },
    {
      text: "MeshDB Admin",
      link: process.env.MESHDB_URL + "/admin/",
    },
  ];

  return (
    <>
      <Box sx={{ textAlign: "center", py: { md: "7vw", sm: 0 } }}>
        <Typography variant="h2" sx={{ pb: 3 }}>
          {t("welcome")}
        </Typography>
        <Typography variant="h5" sx={{ pb: 5 }}>
          This website contains a handful of tools to help our volunteers
          operate and get new members connected.
        </Typography>
        <Typography variant="h5" sx={{ pb: "2rem" }}>
          To get started, pick a form or tool to fill out below:
        </Typography>
        <Grid container justifyContent="center">
          {buttons.map((button) => (
            <Button
              key={button.text}
              component={Link}
              variant="contained"
              size="large"
              href={button.link}
              sx={{ width: "12rem", fontSize: "1rem", m: "1rem" }}
            >
              {button.text}
            </Button>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Landing;
