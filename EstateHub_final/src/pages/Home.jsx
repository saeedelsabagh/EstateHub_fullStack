import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Stack,
  Paper,
  IconButton,
  InputAdornment,
  Avatar,
  Divider,
} from "@mui/material";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEstate } from "../ContextRorReducer";

export default function Home() {
  const { state, dispatch } = useEstate();

  const [properties, setProperties] = useState([]);
  const [clientsCount, setClientsCount] = useState(0);
  const [agentsCount, setAgentsCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/property");

        const propertyData = Array.isArray(response.data)
          ? response.data
          : [];

        setProperties(propertyData);
      } catch (error) {
        console.error("Failed to load properties:", error);
      }

      try {
        const response = await api.get("/users");

        const users = Array.isArray(response.data)
          ? response.data
          : [];

        setClientsCount(
          users.filter(
            (user) =>
              String(user.role || "").toUpperCase() === "USER"
          ).length
        );

        setAgentsCount(
          users.filter(
            (user) =>
              String(user.role || "").toUpperCase() === "AGENT"
          ).length
        );
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };

    fetchStats();
  }, []);

  const approvedProperties = properties.filter(
    (property) =>
      String(property.propertyStatus || "").toUpperCase() === "APPROVED"
  );

  
  return (
    <Box sx={{ overflow: "hidden" }}>
      {/* NAVBAR */}
      <AppBar
        position="absolute"
        elevation={0}
        sx={{
          background: "transparent",
          boxShadow: "none",
          pt: { xs: 1, md: 2 },
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1240,
            width: "100%",
            mx: "auto",
            px: { xs: 2, md: 3 },
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "white",
              textDecoration: "none",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
              }}
            >
              <HomeWorkOutlinedIcon />
            </Box>

            <Typography
              variant="h6"
              fontWeight={900}
              sx={{ letterSpacing: "-.5px" }}
            >
              EstateHub
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <IconButton
              sx={{ color: "white" }}
              component={Link}
              to="/favorites"
            >
              <FavoriteIcon />
            </IconButton>
            <Button
              component={Link}
              to="/properties"
              color="inherit"
              sx={{ px: 2 }}
              onClick={() => {
                dispatch({
                  type: "SET_FILTER",
                  payload: {
                    title: "listingType",
                    value: "Buy",
                  },
                });
              }}
            >
              Buy
            </Button>

            <Button
              component={Link}
              to="/properties"
              color="inherit"
              sx={{ px: 2 }}
              onClick={() => {
                dispatch({
                  type: "SET_FILTER",
                  payload: {
                    title: "listingType",
                    value: "Rent",
                  },
                });
              }}
            >
              Rent
            </Button>

            <Button component={Link} to="/login" color="inherit" sx={{ ml: 1 }}>
              Login
            </Button>

            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                ml: 1,
                px: 2.5,
                bgcolor: "white",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "white",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Sign up
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* HERO */}
      <Box
        sx={{
          minHeight: { xs: 680, md: 720 },
          position: "relative",
          display: "flex",
          alignItems: "center",
          color: "white",
          backgroundImage:
            "linear-gradient(90deg, rgba(8,20,38,.82) 0%, rgba(8,20,38,.60) 48%, rgba(8,20,38,.25) 100%), url(https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=90)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 6 } }}>
          <Box sx={{ maxWidth: 960 }}>
            <Chip
              icon={<VerifiedOutlinedIcon />}
              label="Trusted real estate marketplace"
              sx={{
                mb: 3,
                color: "white",
                borderColor: "rgba(255,255,255,.35)",
                bgcolor: "rgba(255,255,255,.10)",
                backdropFilter: "blur(8px)",
              }}
              variant="outlined"
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.8rem", sm: "4rem", md: "5.2rem" },
                lineHeight: 1.02,
                letterSpacing: "-2.5px",
                mb: 2.5,
                maxWidth: 720,
              }}
            >
              Find a place
              <br />
              you&apos;ll love to{" "}
              <Box component="span" sx={{ color: "secondary.main" }}>
                live.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.2rem" },
                lineHeight: 1.7,
                color: "rgba(255,255,255,.82)",
                maxWidth: 620,
                mb: 4,
              }}
            >
              Discover hand-picked homes, apartments and villas in the best
              locations — all in one place.
            </Typography>
          </Box>
        </Container>

        {/* STATS */}
        <Box
          sx={{
            position: "absolute",
            bottom: 28,
            left: 0,
            right: 0,
            display: { xs: "none", md: "block" },
          }}
        >
          <Container maxWidth="lg">
            <Stack direction="row" spacing={3}>
              <Box
                sx={{
                  px: 6,
                  py: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.12)",
                  minWidth: 170,
                }}
              >
                {/* Properties */}
                <Typography variant="h4" fontWeight={900}>
                  {approvedProperties.length}+
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,.65)" }}>
                  Properties
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 6,
                  py: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.12)",
                  minWidth: 170,
                }}
              >
                {/* Happy Clients */}
                <Typography variant="h4" fontWeight={900}>
                  {clientsCount}+
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,.65)" }}>
                  Happy Clients
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 6,
                  py: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.12)",
                  minWidth: 170,
                }}
              >
                {/* Trusted Agents */}
                <Typography variant="h4" fontWeight={900}>
                  {agentsCount}+
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,.65)" }}>
                  Trusted Agents
                </Typography>
              </Box>
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* FEATURED PROPERTIES */}
      <Box sx={{ bgcolor: "#eef3f8", py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Button
            component={Link}
            to="/properties"
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: { xs: 2, sm: 0 },
              display: "flex",
              alignContent: "center",
              padding: 10,
              fontSize: 30,
            }}
          >
            Explore all
          </Button>
        </Container>
      </Box>

      {/* WHY ESTATEHUB */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <Box
          sx={{
            textAlign: "center",
            maxWidth: 700,
            mx: "auto",
            mb: 6,
          }}
        >
          <Typography color="primary" fontWeight={800} sx={{ mb: 1 }}>
            WHY ESTATEHUB
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "2rem", md: "2.7rem" },
              letterSpacing: "-1px",
              mb: 2,
            }}
          >
            Real estate made simple
          </Typography>

          <Typography color="text.secondary" lineHeight={1.8}>
            Everything you need to find, compare and connect with the right
            property — without the usual hassle.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              icon: <VerifiedOutlinedIcon fontSize="large" />,
              title: "Verified Properties",
              text: "Browse listings reviewed to help you make confident decisions.",
            },
            {
              icon: <SecurityOutlinedIcon fontSize="large" />,
              title: "Safe & Secure",
              text: "Your account and inquiries are designed with privacy in mind.",
            },
            {
              icon: <SupportAgentOutlinedIcon fontSize="large" />,
              title: "Expert Support",
              text: "Connect with trusted agents whenever you need assistance.",
            },
          ].map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.title}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  textAlign: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "rgba(23,105,224,.10)",
                    color: "primary.main",
                  }}
                >
                  {item.icon}
                </Avatar>

                <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                  {item.title}
                </Typography>

                <Typography color="text.secondary" lineHeight={1.7}>
                  {item.text}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ pb: { xs: 7, md: 10 } }}>
        <Box
          sx={{
            borderRadius: 4,
            p: { xs: 4, md: 7 },
            color: "white",
            background:
              "linear-gradient(120deg, #0d47a1 0%, #1769e0 65%, #2b83f6 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,.08)",
              right: -100,
              top: -120,
            }}
          />

          <Box sx={{ position: "relative", maxWidth: 650 }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "2rem", md: "2.8rem" },
                mb: 2,
              }}
            >
              Have a property to sell or rent?
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,.78)",
                mb: 3,
              }}
            >
              Join EstateHub and reach people who are actively looking for their
              next home.
            </Typography>

            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 3 }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Container>

      {/* FOOTER */}
      <Box
        sx={{
          bgcolor: "#0f172a",
          color: "white",
          pt: 6,
          pb: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "primary.main",
                  }}
                >
                  <HomeWorkOutlinedIcon />
                </Box>

                <Typography variant="h6" fontWeight={900}>
                  EstateHub
                </Typography>
              </Stack>

              <Typography
                sx={{
                  mt: 2,
                  maxWidth: 430,
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,.6)",
                }}
              >
                A modern real estate platform designed to make finding your next
                home easier, faster and smarter.
              </Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <Typography fontWeight={800} sx={{ mb: 2 }}>
                Explore
              </Typography>

              <Stack spacing={1}>
                <Button
                  component={Link}
                  to="/properties"
                  sx={{
                    color: "rgba(255,255,255,.6)",
                    justifyContent: "flex-start",
                    p: 0,
                  }}
                >
                  Properties
                </Button>

                <Button
                  onClick={() =>
                    dispatch({
                      type: "SET_FILTER",
                      payload: {
                        title: "listingType",
                        value: "Buy",
                      },
                    })
                  }
                  sx={{
                    color: "rgba(255,255,255,.6)",
                    justifyContent: "flex-start",
                    p: 0,
                  }}
                >
                  Buy
                </Button>

                <Button
                  onClick={() =>
                    dispatch({
                      type: "SET_FILTER",
                      payload: {
                        title: "listingType",
                        value: "Rent",
                      },
                    })
                  }
                  sx={{
                    color: "rgba(255,255,255,.6)",
                    justifyContent: "flex-start",
                    p: 0,
                  }}
                >
                  Rent
                </Button>
              </Stack>
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <Typography fontWeight={800} sx={{ mb: 2 }}>
                Account
              </Typography>

              <Stack spacing={1}>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "rgba(255,255,255,.6)",
                    justifyContent: "flex-start",
                    p: 0,
                  }}
                >
                  Login
                </Button>

                <Button
                  component={Link}
                  to="/register"
                  sx={{
                    color: "rgba(255,255,255,.6)",
                    justifyContent: "flex-start",
                    p: 0,
                  }}
                >
                  Register
                </Button>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Typography fontWeight={800} sx={{ mb: 2 }}>
                Contact
              </Typography>

              <Typography color="rgba(255,255,255,.6)">
                hello@estatehub.com
              </Typography>

              <Typography color="rgba(255,255,255,.6)" sx={{ mt: 1 }}>
                +20 100 000 0000
              </Typography>
            </Grid>
          </Grid>

          <Divider
            sx={{
              borderColor: "rgba(255,255,255,.12)",
              my: 4,
            }}
          />

          <Typography variant="body2" color="rgba(255,255,255,.45)">
            © 2026 EstateHub. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
