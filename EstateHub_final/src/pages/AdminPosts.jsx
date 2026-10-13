import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HomeWorkIcon from "@mui/icons-material/HomeWork";



const normalizeStatus = (status) => String(status || "PENDING").toUpperCase();

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/property")
      .then((res) => {
        setPosts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load properties.");
      })
      .finally(() => setLoading(false));
  }, []);

  const pending = posts.filter(
    (p) => normalizeStatus(p.propertyStatus) === "PENDING",
  ).length;

  const approved = posts.filter(
    (p) => normalizeStatus(p.propertyStatus) === "APPROVED",
  ).length;

  const rejected = posts.filter(
    (p) => normalizeStatus(p.propertyStatus) === "REJECTED",
  ).length;

  const stats = [
    {
      label: "All Posts",
      count: posts.length,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Pending",
      count: pending,
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      label: "Approved",
      count: approved,
      color: "#15803d",
      bg: "#f0fdf4",
    },
    {
      label: "Rejected",
      count: rejected,
      color: "#dc2626",
      bg: "#fef2f2",
    },
  ];

  const statusColor = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "error",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f8fc",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Page Header */}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Tooltip title="Back to Admin Dashboard">
            <IconButton
              onClick={() => navigate("/dashboard/admin")}
              sx={{
                bgcolor: "#fff",
                color: "#2563eb",
                border: "1px solid #e2e8f0",
                borderRadius: 2.5,
                width: 44,
                height: 44,
                "&:hover": {
                  bgcolor: "#eff6ff",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: 25, md: 30 },
                color: "#172b4d",
                letterSpacing: "-0.6px",
              }}
            >
              Manage Posts
            </Typography>

            <Typography sx={{ color: "#64748b", mt: 0.7, fontSize: 14 }}>
              Review property listings and monitor their approval status.
            </Typography>
          </Box>
        </Stack>

        <Chip
          icon={<HomeWorkIcon />}
          label={`${posts.length} Properties`}
          variant="outlined"
          sx={{
            bgcolor: "#fff",
            borderColor: "#e2e8f0",
            fontWeight: 600,
            height: 36,
            px: 0.5,
          }}
        />
      </Stack>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                p: { xs: 1.75, sm: 2.25 },
                border: "1px solid #e8edf5",
                borderRadius: 3,
                bgcolor: "#fff",
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: stat.bg,
                    color: stat.color,
                  }}
                >
                  <HomeWorkOutlinedIcon />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#172b4d",
                      fontSize: { xs: 25, sm: 29 },
                      lineHeight: 1.3,
                      fontWeight: 800,
                    }}
                  >
                    {stat.count}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Properties Table */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8edf5",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid #edf0f5" }}>
          <Typography sx={{ fontSize: 17, fontWeight: 700, color: "#172b4d" }}>
            Property Listings
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 13, mt: 0.4 }}>
            Overview of all submitted properties
          </Typography>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress size={30} />
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "#f8fafc",
                    "& th": {
                      color: "#64748b",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.4px",
                      py: 1.8,
                      borderBottom: "1px solid #e8edf5",
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  <TableCell>Property</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Agent ID</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {posts.map((post) => {
                  const status = normalizeStatus(post.propertyStatus);

                  return (
                    <TableRow
                      key={post.id}
                      hover
                      sx={{
                        "& td": {
                          py: 2,
                          borderBottom: "1px solid #edf0f5",
                          fontSize: 13,
                          color: "#334155",
                        },
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              flexShrink: 0,
                              borderRadius: 2,
                              bgcolor: "#eff6ff",
                              color: "#2563eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <HomeWorkOutlinedIcon fontSize="small" />
                          </Box>

                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: "#172b4d",
                              fontSize: 13,
                            }}
                          >
                            {post.title || "Untitled Property"}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>{post.location || "—"}</TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#172b4d",
                            fontSize: 13,
                          }}
                        >
                          {post.price != null
                            ? Number(post.price).toLocaleString("en-US")
                            : "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>{post.agentId ?? "—"}</TableCell>

                      <TableCell>
                        <Chip
                          label={status}
                          color={statusColor[status] || "default"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: 10,
                            height: 25,
                            borderRadius: 1.5,
                            "& .MuiChip-label": { px: 1.2 },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}

                {posts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box sx={{ textAlign: "center", py: 7 }}>
                        <HomeWorkOutlinedIcon
                          sx={{ fontSize: 42, color: "#cbd5e1", mb: 1 }}
                        />
                        <Typography sx={{ fontWeight: 600, color: "#475569" }}>
                          No properties found
                        </Typography>
                        <Typography
                          sx={{ fontSize: 13, color: "#94a3b8", mt: 0.5 }}
                        >
                          Properties will appear here when available.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
}
