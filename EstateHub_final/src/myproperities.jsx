import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import axios from "./api/axios";
import { Alert, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import { useNavigate } from "react-router-dom";
import { useEstate } from "./ContextRorReducer";
import { getImageUrl } from "./utils/imageUrl";

export default function MyProperties() {
  const navigate = useNavigate();

  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyProperties = async () => {
    try {
      setError("");

      const response = await axios.get("/property/my");
      setMyPosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Failed to load your properties.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`/property/${id}`);

      setMyPosts((previous) =>
        previous.filter((property) => property.id !== id),
      );
    } catch (err) {
      setError(
        err.response?.status === 403
          ? "You are not allowed to delete this property."
          : "Failed to delete property.",
      );
      console.error(err);
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {loading && <CircularProgress />}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color="#102a43">
            My Properties
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage the properties you have posted.
          </Typography>
        </Box>

        <Chip
          label={`${myPosts.length} Properties`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Empty State */}
      {!loading && !error && myPosts.length === 0 ? (
        <Card
          sx={{
            borderRadius: 3,
            textAlign: "center",
            py: 7,
            border: "1px solid #e2e8f0",
            boxShadow: "none",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            No Properties Yet
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            You haven't posted any properties yet.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {myPosts.map((property) => (
            <Grid
              size={{
                xs: 12,
                sm: 6,
                lg: 4,
              }}
              key={property.id}
            >
              <Card
                onClick={() => navigate(`/properties/${property.id}`)}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 15px rgba(15,23,42,0.06)",
                  transition: "0.2s",

                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 25px rgba(15,23,42,0.1)",
                  },
                }}
              >
                <Chip
                  label={property.propertyStatus || "PENDING"}
                  color={
                    property.propertyStatus === "APPROVED"
                      ? "success"
                      : property.propertyStatus === "REJECTED"
                        ? "error"
                        : "warning"
                  }
                  size="small"
                  sx={{
                    mt: 1,
                    mb: 1,
                    mr: 2,
                    fontWeight: 700,
                    display: "flex",
                    width: "fit-content",
                    ml: "auto",
                    mr: 2,
                  }}
                />
                {/* Image */}
                <Box
                  sx={{
                    position: "relative",
                    height: 210,
                    backgroundColor: "#e2e8f0",
                  }}
                >
                  <Box
                    component="img"
                    src={getImageUrl(property.imageUrl)}
                    alt={property.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Status */}
                  <Chip
                    label={property.propertyStatus || "Active"}
                    color={
                      property.propertyStatus === "Approved"
                        ? "success"
                        : "warning"
                    }
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      fontWeight: 700,
                      backgroundColor: "#fff",
                    }}
                  />
                </Box>

                {/* Content */}
                <CardContent sx={{ p: 2.5 }}>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {property.title}
                  </Typography>

                  {/* Location */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 1,
                    }}
                  >
                    <LocationOnIcon
                      sx={{
                        fontSize: 18,
                        color: "text.secondary",
                      }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {property.location}
                    </Typography>
                  </Box>

                  {/* Price */}
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    color="primary"
                    sx={{ mt: 1.5 }}
                  >
                    ${property.price}
                  </Typography>

                  {/* Details */}
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      borderTop: "1px solid #e2e8f0",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <BedIcon sx={{ fontSize: 19 }} />

                      <Typography variant="body2">
                        {property.bedrooms || 0} bedrooms
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <BathtubIcon sx={{ fontSize: 19 }} />

                      <Typography variant="body2">
                        {property.bathrooms || 0} bathrooms
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <SquareFootIcon sx={{ fontSize: 19 }} />

                      <Typography variant="body2">
                        {property.area || 0} m²
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Actions */}
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button
                      fullWidth
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(property.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
