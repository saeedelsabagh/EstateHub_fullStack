import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";

import { Link, useParams } from "react-router-dom";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PhoneIcon from "@mui/icons-material/Phone";

import { useEstate } from "../ContextRorReducer";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PropertyDetails() {
  const { state, dispatch } = useEstate();
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState("");

  const userId = state.user?.id;

  // Get property from backend
  useEffect(() => {
    let active = true;

    setLoading(true);
    setProperty(null);

    api
      .get(`/property/${id}`)
      .then((response) => {
        if (!active) return;

        const p = response.data;

        setProperty({
          ...p,
          type: p.propertyType,
          image: p.imageUrl,
          beds: p.bedrooms,
          baths: p.bathrooms,
        });
      })
      .catch((error) => {
        if (!active) return;

        console.error("Failed to load property:", error);
        setProperty(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Get favorite status
  useEffect(() => {
    let active = true;

    if (!userId) {
      setIsFavorite(false);
      return;
    }

    api
      .get(`/favorite/${userId}`)
      .then((response) => {
        if (!active) return;

        setIsFavorite(
          response.data.some((item) => Number(item.id) === Number(id)),
        );
      })
      .catch((error) => {
        console.error("Failed to load favorites:", error);
      });

    return () => {
      active = false;
    };
  }, [userId, id]);

  const handleToggleFavorite = async () => {
    if (!userId) {
      console.log("Please log in to manage favorites.");
      return;
    }

    if (favoriteLoading) return;

    try {
      setFavoriteLoading(true);

      await api.post("/favorite/toggle", {
        userId: Number(userId),
        propertyId: Number(property.id),
      });

      setIsFavorite((previous) => !previous);
    } catch (error) {
      console.error(
        "Favorite error:",
        error.response?.status,
        error.response?.data,
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!property) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography color="error">
          Property not found. Check the console.
        </Typography>

        <Button component={Link} to="/properties" sx={{ mt: 2 }}>
          Back to Properties
        </Button>
      </Container>
    );
  }

  const handleSendInquiry = async () => {
    if (!state.user?.id) {
      navigate("/login");
      return;
    }

    if (!state.inquiry?.message?.trim()) {
      setInquiryError("Please enter your message.");
      return;
    }

    try {
      setInquiryLoading(true);
      setInquiryError("");
      setInquirySuccess("");

      // 1. Create the inquiry
      const inquiryResponse = await api.post("/addInquiry", {
        propertyId: Number(property.id),
      });

      const inquiryId = inquiryResponse.data.id;

      // 2. Send the first message for this inquiry
      await api.post("/addmessage", {
        inquiryId,
        content: state.inquiry.message.trim(),
      });

      setInquirySuccess("Your inquiry was sent successfully.");

      dispatch({ type: "RESET_INQUIRY" });
    } catch (error) {
      console.error("Request URL:", error.config?.url);
      console.error("Request Method:", error.config?.method);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      setInquiryError(
        error.response?.data?.message ??
          "Failed to send inquiry. Please try again.",
      );
    } finally {
      setInquiryLoading(false);
    }
  };
  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
          <HomeWorkIcon sx={{ mr: 1 }} />

          <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              EstateHub
            </Link>
          </Typography>

          <Button component={Link} to="/properties" color="inherit">
            Back to Properties
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              component="img"
              src={
                property.imageUrl
                  ? `http://localhost:8081${property.imageUrl}`
                  : "/placeholder-property.jpg"
              }
              alt={property.title}
              onError={(e) => {
                console.error(
                  "Failed to load property image:",
                  e.currentTarget.src,
                );
                e.currentTarget.style.display = "none";
              }}
              sx={{
                width: "100%",
                height: 500,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Chip label={property.type} color="primary" />

            <Typography variant="h3" fontWeight={900} sx={{ mt: 2 }}>
              {property.title}
            </Typography>

            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ my: 2 }}
            >
              <LocationOnIcon color="primary" />
              <Typography color="text.secondary">
                {property.location}
              </Typography>
            </Stack>

            <Typography variant="h4" color="primary" fontWeight={900}>
              {property.price} $
            </Typography>

            <Stack direction="row" spacing={2} sx={{ my: 3 }}>
              <Chip label={`${property.beds} Beds`} />
              <Chip label={`${property.baths} Baths`} />
              <Chip label={property.area} />
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<PhoneIcon />}
                onClick={() => {
                  document.getElementById("inquiry")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Contact Agent
              </Button>

              <IconButton
                disabled={favoriteLoading || !userId}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

        <Card id="inquiry" sx={{ mt: 5 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
              About this property
            </Typography>

            <Typography color="text.secondary" lineHeight={1.9}>
              {property.description}
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
              Send an inquiry
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={state.inquiry.name}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_INQUIRY",
                      payload: {
                        name: "name",
                        value: e.target.value,
                      },
                    })
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={state.inquiry.phone}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_INQUIRY",
                      payload: {
                        name: "phone",
                        value: e.target.value,
                      },
                    })
                  }
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Message"
                  value={state.inquiry.message}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_INQUIRY",
                      payload: {
                        name: "message",
                        value: e.target.value,
                      },
                    })
                  }
                />
              </Grid>

              <Grid size={12}>
                <Button
                  variant="contained"
                  onClick={handleSendInquiry}
                  disabled={inquiryLoading || !property}
                >
                  {inquiryLoading ? "Sending..." : "Send Inquiry"}
                </Button>

                {inquiryError && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {inquiryError}
                  </Typography>
                )}

                {inquirySuccess && (
                  <Typography color="success.main" sx={{ mt: 1 }}>
                    {inquirySuccess}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Typography sx={{ mt: 2 }} color="text.secondary">
          Property ID: {id}
        </Typography>
      </Container>
    </Box>
  );
}
