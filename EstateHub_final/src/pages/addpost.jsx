import { useState } from "react";
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
  CardContent,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useEstate } from "../ContextRorReducer";
import api from "../api/axios";

import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";

export default function Addpost() {
  const { state, dispatch } = useEstate();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const property = state.newProperty;

  const isDisabled =
    loading ||
    !property.title?.trim() ||
    !property.location?.trim() ||
    property.price === "" ||
    property.price == null ||
    !property.type ||
    property.beds === "" ||
    property.beds == null ||
    property.baths === "" ||
    property.baths == null ||
    property.area === "" ||
    property.area == null ||
    !imageFile ||
    !property.description?.trim();

  const handleAdd = async () => {
    if (isDisabled) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Upload image
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadResponse = await api.post(
        "/files/upload",
        formData
      );

      const imageUrl = uploadResponse.data;

      // 2. Prepare DTO for Spring Boot
      const propertyData = {
        title: property.title.trim(),
        location: property.location.trim(),
        price: Number(property.price),
        propertyType: property.type,
        listingType: property.listingType || "SALE",
        bedrooms: Number(property.beds),
        bathrooms: Number(property.baths),
        area: Number(property.area),
        imageUrl,
        description: property.description.trim(),
      };

      // 3. Save property; backend gets the current agent from JWT
      await api.post("/property", propertyData);

      setSuccess("Property added successfully and is awaiting admin approval.");

      // Clear local form state after successful backend save
      dispatch({
        type: "RESET_PROPERTY",
      });

      setImageFile(null);

      setTimeout(() => {
        navigate("/dashboard/agent");
      }, 1200);
    } catch (err) {
      console.error("Failed to add property:", err);

      setError(
        err.response?.data?.message ||
          "Failed to add property. Please check your data and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
          <HomeWorkIcon sx={{ mr: 1 }} />

          <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1 }}>
            <Link
              to="/"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              EstateHub
            </Link>
          </Typography>

          <Button component={Link} to="/dashboard/agent" color="inherit">
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h3" fontWeight={900} sx={{ mb: 1 }}>
          Add Property
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Add a new property to your listings.
        </Typography>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <TextField
                fullWidth
                label="Property Title"
                placeholder="Modern Apartment"
                value={property.title || ""}
                onChange={(e) =>
                  dispatch({
                    type: "SET_PROPERTY",
                    payload: { title: "title", value: e.target.value },
                  })
                }
              />

              <TextField
                fullWidth
                label="Location"
                placeholder="New Cairo, Egypt"
                value={property.location || ""}
                onChange={(e) =>
                  dispatch({
                    type: "SET_PROPERTY",
                    payload: { title: "location", value: e.target.value },
                  })
                }
              />

              <TextField
                fullWidth
                label="Price"
                type="number"
                value={property.price ?? ""}
                onChange={(e) =>
                  dispatch({
                    type: "SET_PROPERTY",
                    payload: { title: "price", value: e.target.value },
                  })
                }
              />

              <TextField
                select
                fullWidth
                label="Property Type"
                value={property.type || "Apartment"}
                onChange={(e) =>
                  dispatch({
                    type: "SET_PROPERTY",
                    payload: { title: "type", value: e.target.value },
                  })
                }
              >
                <MenuItem value="Apartment">Apartment</MenuItem>
                <MenuItem value="Villa">Villa</MenuItem>
                <MenuItem value="House">House</MenuItem>
              </TextField>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Bedrooms"
                    type="number"
                    value={property.beds ?? ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_PROPERTY",
                        payload: { title: "beds", value: e.target.value },
                      })
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Bathrooms"
                    type="number"
                    value={property.baths ?? ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_PROPERTY",
                        payload: { title: "baths", value: e.target.value },
                      })
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Area (m²)"
                    type="number"
                    value={property.area ?? ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_PROPERTY",
                        payload: { title: "area", value: e.target.value },
                      })
                    }
                  />
                </Grid>
              </Grid>

              <Button component="label" variant="outlined" fullWidth>
                {imageFile ? imageFile.name : "Upload Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                    }
                  }}
                />
              </Button>

              <TextField
                fullWidth
                multiline
                rows={5}
                label="Description"
                placeholder="Describe the property..."
                value={property.description || ""}
                onChange={(e) =>
                  dispatch({
                    type: "SET_PROPERTY",
                    payload: {
                      title: "description",
                      value: e.target.value,
                    },
                  })
                }
              />

              <Button
                variant="contained"
                size="large"
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AddIcon />
                  )
                }
                onClick={handleAdd}
                disabled={isDisabled}
              >
                {loading ? "Saving..." : "Add Property"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
