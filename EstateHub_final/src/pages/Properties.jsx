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
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { Link } from "react-router-dom";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useEstate } from "../ContextRorReducer";
import api from "../api/axios";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `http://localhost:8081${
    imageUrl.startsWith("/") ? "" : "/"
  }${imageUrl}`;
};





export default function Properties() {
  const { state, dispatch } = useEstate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const {
    search,
    propertyType,
    listingType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
  } = state.filters;

  useEffect(() => {
    let active = true;

    api
      .get("/property")
      .then((response) => {
        if (!active) return;

        const mappedProperties = response.data.map((property) => ({
          ...property,
          type: property.propertyType,
          image: getImageUrl(property.imageUrl),
          beds: property.bedrooms,
          baths: property.bathrooms,
          status: property.propertyStatus,
        }));

        setProperties(mappedProperties);
        setLoadError(false);
      })
      .catch((error) => {
        console.error(
          "Failed to load properties:",
          error.response?.status,
          error.response?.data || error.message,
        );
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredProperties = properties
    .filter(
      (property) => String(property.status || "").toUpperCase() === "APPROVED",
    )
    .filter((property) => {
      const searchValue = (search || "").toLowerCase();
      const matchesSearch =
        (property.title || "").toLowerCase().includes(searchValue) ||
        (property.location || "").toLowerCase().includes(searchValue);

      const matchesType =
        propertyType === "all" ||
        String(property.type || "").toLowerCase() ===
          propertyType.toLowerCase();

      const matchesListingType =
        listingType === "all" ||
        String(property.listingType || "").toLowerCase() ===
          listingType.toLowerCase();

      const matchesMinPrice =
        minPrice === "" || Number(property.price) >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === "" || Number(property.price) <= Number(maxPrice);

      const matchesBedrooms = !bedrooms || Number(property.beds) >= 3;
      const matchesBathrooms = !bathrooms || Number(property.baths) >= 2;

      return (
        matchesSearch &&
        matchesType &&
        matchesListingType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesBedrooms &&
        matchesBathrooms
      );
    });

  return (
    <Box>
      {/* NAVBAR */}
      <AppBar position="static">
        <Toolbar
          sx={{
            maxWidth: 1200,
            width: "100%",
            mx: "auto",
          }}
        >
          <HomeWorkIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              EstateHub
            </Link>
          </Typography>
          <Button component={Link} to="/login" color="inherit">
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
          Find Properties
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          {/* FILTERS */}
          <Box
            sx={{
              width: 260,
              display: { xs: "none", md: "block" },
              flexShrink: 0,
            }}
          >
            <Card sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Filters
              </Typography>

              <TextField
                fullWidth
                label="Search"
                sx={{ mb: 2 }}
                value={search}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FILTER",
                    payload: { title: "search", value: e.target.value },
                  })
                }
              />

              <TextField
                select
                fullWidth
                label="Property Type"
                value={propertyType}
                sx={{ mb: 2 }}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FILTER",
                    payload: { title: "propertyType", value: e.target.value },
                  })
                }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="villa">Villa</MenuItem>
                <MenuItem value="house">House</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Min Price"
                type="number"
                value={minPrice}
                sx={{ mb: 2 }}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FILTER",
                    payload: { title: "minPrice", value: e.target.value },
                  })
                }
              />

              <TextField
                fullWidth
                label="Max Price"
                type="number"
                value={maxPrice}
                sx={{ mb: 2 }}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FILTER",
                    payload: { title: "maxPrice", value: e.target.value },
                  })
                }
              />

              <Typography fontWeight={700}>Features</Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={bedrooms}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FILTER",
                        payload: { title: "bedrooms", value: e.target.checked },
                      })
                    }
                  />
                }
                label="3+ Bedrooms"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={bathrooms}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FILTER",
                        payload: {
                          title: "bathrooms",
                          value: e.target.checked,
                        },
                      })
                    }
                  />
                }
                label="2+ Bathrooms"
              />

              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={() => dispatch({ type: "RESET_FILTERS" })}
              >
                Reset
              </Button>
            </Card>
          </Box>

          {/* PROPERTIES */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <Typography>Loading properties...</Typography>
            ) : loadError ? (
              <Typography color="error">
                Failed to load properties. Check the Console for the API error.
              </Typography>
            ) : (
              <>
                <Grid container spacing={3}>
                  {filteredProperties.map((property) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={property.id}>
                      <Card
                        component={Link}
                        to={`/properties/${property.id}`}
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "block",
                          height: "100%",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="210"
                          image={property.image}
                          alt={property.title}
                        />
                        <CardContent>
                          <Chip
                            label={property.type}
                            size="small"
                            color="primary"
                          />
                          <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{ mt: 1 }}
                          >
                            {property.title}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <LocationOnIcon fontSize="small" />
                            <Typography color="text.secondary">
                              {property.location}
                            </Typography>
                          </Stack>
                          <Typography
                            color="primary"
                            variant="h6"
                            fontWeight={800}
                            sx={{ mt: 1 }}
                          >
                            ${property.price}
                          </Typography>
                          <Typography color="text.secondary">
                            {property.beds} Beds • {property.baths} Baths
                          </Typography>
                          <Button sx={{ mt: 1 }}>View Details</Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {filteredProperties.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography variant="h6" fontWeight={700}>
                      No Properties Found
                    </Typography>
                    <Typography color="text.secondary">
                      Try changing your filters.
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
