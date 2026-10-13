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
import { useNavigate } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import axios from "../api/axios";

const normalizeRole = (role) =>
  String(role || "UNKNOWN")
    .toUpperCase()
    .replace("ROLE_", "");

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/users")
      .then((res) => {
        setUsers(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load users. Check the backend endpoint.");
      })
      .finally(() => setLoading(false));
  }, []);

  const agents = users.filter((user) => normalizeRole(user.role) === "AGENT");

  const regularUsers = users.filter(
    (user) => normalizeRole(user.role) === "USER",
  );

  const admins = users.filter((user) => normalizeRole(user.role) === "ADMIN");

  const stats = [
    {
      label: "All Accounts",
      count: users.length,
      icon: <PeopleIcon />,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Regular Users",
      count: regularUsers.length,
      icon: <PersonIcon />,
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      label: "Agents",
      count: agents.length,
      icon: <BusinessCenterOutlinedIcon />,
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      label: "Admins",
      count: admins.length,
      icon: <PeopleIcon />,
      color: "#15803d",
      bg: "#f0fdf4",
    },
  ];

  const roleColor = {
    USER: "info",
    AGENT: "primary",
    ADMIN: "success",
    UNKNOWN: "default",
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
                bgcolor: "#ffffff",
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
              <ArrowBackRoundedIcon />
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
              Manage Users
            </Typography>

            <Typography sx={{ color: "#64748b", mt: 0.7, fontSize: 14 }}>
              View and manage accounts registered on EstateHub.
            </Typography>
          </Box>
        </Stack>

        <Chip
          icon={<PeopleIcon />}
          label={`${users.length} Accounts`}
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
                  {stat.icon}
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

      {/* Users Table */}
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
            Registered Accounts
          </Typography>

          <Typography sx={{ color: "#64748b", fontSize: 13, mt: 0.4 }}>
            Overview of users, agents, and administrators
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
            <Table sx={{ minWidth: 650 }}>
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
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email Address</TableCell>
                  <TableCell>Account Role</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map((user) => {
                  const role = normalizeRole(user.role);

                  return (
                    <TableRow
                      key={user.id}
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
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#64748b",
                            fontSize: 13,
                          }}
                        >
                          #{user.id}
                        </Typography>
                      </TableCell>

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
                              borderRadius: "50%",
                              bgcolor: "#eff6ff",
                              color: "#2563eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <PersonIcon fontSize="small" />
                          </Box>

                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: "#172b4d",
                              fontSize: 13,
                            }}
                          >
                            {user.name || "Unnamed User"}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>{user.email || "—"}</TableCell>

                      <TableCell>
                        <Chip
                          label={role}
                          color={roleColor[role] || "default"}
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

                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box sx={{ textAlign: "center", py: 7 }}>
                        <PeopleIcon
                          sx={{ fontSize: 42, color: "#cbd5e1", mb: 1 }}
                        />

                        <Typography sx={{ fontWeight: 600, color: "#475569" }}>
                          No users found
                        </Typography>

                        <Typography
                          sx={{ fontSize: 13, color: "#94a3b8", mt: 0.5 }}
                        >
                          Registered accounts will appear here.
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
