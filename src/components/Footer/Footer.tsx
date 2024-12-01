import { Container, Box, Grid, Typography, Link } from "@mui/material";

export function Footer() {
  const links = [
    [
      {
        text: "Community",
        link: "",
      },
      {
        text: "Slack",
        link: "https://slack.nycmesh.net",
      },
      {
        text: "Meetup",
        link: "https://meetup.com/nycmesh",
      },
      {
        text: "Volunteer",
        link: "https://www.nycmesh.net/volunteer",
      },
      {
        text: "Newsletter",
        link: "https://us9.campaign-archive.com/home/?u=cf667149616fd293afa115f5a&amp;id=ebe72854f3",
      },
      {
        text: "Blog",
        link: "https://www.nycmesh.net/blog",
      },
      {
        text: "Code of Conduct",
        link: "https://www.nycmesh.net/coc",
      },
    ],
    [
      {
        text: "Network",
        link: "",
      },
      {
        text: "Stats",
        link: "https://stats.nycmesh.net",
      },
      {
        text: "Peering",
        link: "https://docs.nycmesh.net/networking/peering/",
      },
      {
        text: "Sponsors",
        link: "https://www.nycmesh.net/sponsors",
      },
    ],
    [
      {
        text: "Resources",
        link: "",
      },
      {
        text: "FAQ",
        link: "https://www.nycmesh.net/faq",
      },
      {
        text: "Docs",
        link: "https://docs.nycmesh.net",
      },
      {
        text: "Line of Sight",
        link: "https://los.nycmesh.net",
      },
      {
        text: "Presentations",
        link: "https://www.nycmesh.net/presentations",
      },
      {
        text: "Outreach",
        link: "https://docs.nycmesh.net/organization/outreach/",
      },
      {
        text: "Install Payment",
        link: "https://www.nycmesh.net/pay",
      },
      {
        text: "GitHub",
        link: "https://github.com/WillNilges/cursed-status-page",
      },
    ],
    [
      {
        text: "Social",
        link: "",
      },
      {
        text: "Mastodon",
        link: "https://mastodon.nycmesh.net/@mesh",
      },
      {
        text: "Bluesky",
        link: "https://bsky.app/profile/nycmesh.bsky.social",
      },
      {
        text: "Threads",
        link: "https://www.threads.net/@nycmesh",
      },
      {
        text: "YouTube",
        link: "https://www.youtube.com/@nycmesh",
      },
      {
        text: "Facebook",
        link: "https://www.facebook.com/nycmesh",
      },
      {
        text: "Instagram",
        link: "https://www.instagram.com/nycmesh",
      },
    ],
  ];

  return (
    <>
      <footer>
        <Box
          sx={{
            backgroundColor: "secondary.main",
            color: "black",
            padding: "none",
            width: "100%",
            display: "flex",
          }}
          id="full-width-box"
        >
          <Container maxWidth="lg" id="container" sx={{}}>
            <Grid
              container
              sx={{ py: "2rem", flex: 1, justifyContent: "space-between" }}
            >
              <Grid
                item
                container
                md={2}
                sx={{ flex: 1, pb: "1rem", justifyContent: "center" }}
                id="logo-column"
              >
                <img
                  src="/logo.svg"
                  style={{ width: "2rem", height: "2rem", display: "flex" }}
                  alt=""
                />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ marginLeft: "1rem", display: "flex" }}
                >
                  <span style={{ fontWeight: 600 }}>NYC Mesh</span>{" "}
                  <span style={{ fontWeight: 400 }}></span>
                </Typography>
              </Grid>
              <Grid item container md={9} lg={7}>
                {links.map((category, index) => (
                  <Grid
                    item
                    sx={{ textAlign: { sm: "left", xs: "center" }, pb: "1rem" }}
                    xs={12}
                    sm={3}
                    key={index}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, pb: ".5rem" }}
                    >
                      {category[0].text}
                    </Typography>
                    {category.slice(1).map((link, index) => (
                      <Grid item key={index} sx={{ pb: ".3rem" }}>
                        <Link
                          href={link.link}
                          target="_"
                          sx={{ textDecoration: "none" }}
                        >
                          {link.text}
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </footer>
    </>
  );
}
