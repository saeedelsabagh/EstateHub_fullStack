import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";

import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const getStatus = (property) =>
  String(property.propertyStatus || "PENDING").toUpperCase();

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [propertiesResponse, usersResponse] = await Promise.all([
        axios.get("/property"),
        axios.get("/users"),
      ]);

      console.log("Dashboard properties:", propertiesResponse.data);

      setProperties(
        Array.isArray(propertiesResponse.data) ? propertiesResponse.data : [],
      );

      setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to load dashboard data. Check the backend endpoints and admin permissions.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pending = properties.filter((p) => getStatus(p) === "PENDING");

  const approvedCount = properties.filter(
    (p) => getStatus(p) === "APPROVED",
  ).length;

  const rejectedCount = properties.filter(
    (p) => getStatus(p) === "REJECTED",
  ).length;

  const updateStatus = async (id, status) => {
    setBusyId(id);
    setError("");
    setMessage("");

    try {
      await axios.put(`/property/${id}/status`, { status });

      setProperties((previous) =>
        previous.map((p) =>
          p.id === id ? { ...p, propertyStatus: status } : p,
        ),
      );

      setMessage(
        status === "APPROVED"
          ? "Property approved successfully."
          : "Property rejected successfully.",
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.status === 403
          ? "Access denied. Only an admin can change property status."
          : "Failed to update property status. Check the backend endpoint.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const stats = [
    {
      label: "Users & Agents",
      value: users.length,
      icon: <PeopleAltIcon color="primary" />,
    },
    {
      label: "All Properties",
      value: properties.length,
      icon: <ApartmentIcon color="primary" />,
    },
    {
      label: "Pending",
      value: pending.length,
      icon: <PendingActionsIcon color="warning" />,
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: <ApartmentIcon color="success" />,
    },
    {
      label: "Rejected",
      value: rejectedCount,
      icon: <ApartmentIcon color="error" />,
    },
  ];

  const statusColor = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "error",
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f8fc" }}>
      <AppBar position="static">
        <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
          <HomeWorkIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1 }}>
            EstateHub Admin
          </Typography>

          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" fontWeight={900}>
          Admin Dashboard
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Manage users, agents and property approvals.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {message && (
          <Alert
            severity="success"
            onClose={() => setMessage("")}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: "100%", borderRadius: 3 }}>
                <CardContent>
                  {stat.icon}
                  <Typography color="text.secondary">{stat.label}</Typography>
                  <Typography variant="h4" fontWeight={900}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Button
            component={Link}
            to="/dashboard/admin/users"
            variant="contained"
          >
            Manage Users & Agents
          </Button>

          <Button
            component={Link}
            to="/dashboard/admin/posts"
            variant="outlined"
          >
            View All Posts
          </Button>
        </Stack>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={800}>
              Pending Properties
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Review properties before they appear publicly.
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Property</TableCell>
                      <TableCell>Agent ID</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {pending.map((property) => (
                      <TableRow key={property.id} hover>
                        <TableCell>{property.title}</TableCell>
                        <TableCell>{property.agentId ?? "—"}</TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell>{property.price}</TableCell>

                        <TableCell>
                          <Chip
                            label={getStatus(property)}
                            color={
                              statusColor[getStatus(property)] || "default"
                            }
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              disabled={busyId === property.id}
                              onClick={() =>
                                updateStatus(property.id, "APPROVED")
                              }
                            >
                              Approve
                            </Button>

                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              disabled={busyId === property.id}
                              onClick={() =>
                                updateStatus(property.id, "REJECTED")
                              }
                            >
                              Reject
                            </Button>

                            <Button
                              size="small"
                              onClick={() =>
                                navigate(`/properties/${property.id}`)
                              }
                            >
                              View
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}

                    {pending.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No pending properties.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
