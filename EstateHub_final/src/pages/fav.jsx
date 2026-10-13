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
  CardMedia,
  IconButton,
  Chip,
} from "@mui/material";

import { Link } from "react-router-dom";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEstate } from "../ContextRorReducer";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Favorites() {
  const { state } = useEstate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const userId = state.user?.id;

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    api
      .get(`/favorite/${userId}`)
      .then((response) => {
        setFavorites(response.data);
      })
      .catch((error) => {
        console.error("Failed to load favorites:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const handleDelete = async (propertyId) => {
    try {
      setDeletingId(propertyId);

      await api.post("/favorite/toggle", {
        userId: Number(userId),
        propertyId: Number(propertyId),
      });

      setFavorites((prev) =>
        prev.filter((property) => property.id !== propertyId)
      );
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    } finally {
      setDeletingId(null);
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

          <Button component={Link} to="/properties" color="inherit">
            Properties
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h3" fontWeight={900} sx={{ mb: 1 }}>
          My Favorites
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {favorites.length} saved properties
        </Typography>

        {loading ? (
          <Typography>Loading favorites...</Typography>
        ) : !userId ? (
          <Typography color="text.secondary">
            Please log in to view your favorites.
          </Typography>
        ) : favorites.length === 0 ? (
          <Typography color="text.secondary">
            You haven't added any properties to your favorites yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {favorites.map((property) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={property.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="220"
                    image={property.imageUrl}
                    alt={property.title}
                  />

                  <CardContent>
                    <Chip
                      label={property.propertyType}
                      color="primary"
                      size="small"
                    />

                    <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>
                      {property.title}
                    </Typography>

                    <Typography color="text.secondary">
                      {property.location}
                    </Typography>

                    <Typography
                      variant="h6"
                      color="primary"
                      fontWeight={900}
                      sx={{ mt: 1 }}
                    >
                      {property.price}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Button
                        component={Link}
                        to={`/properties/${property.id}`}
                        variant="contained"
                      >
                        View Details
                      </Button>

                      <IconButton
                        color="error"
                        disabled={deletingId === property.id}
                        onClick={() => handleDelete(property.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
