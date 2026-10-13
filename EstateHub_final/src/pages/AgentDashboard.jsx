import { useEffect, useState } from "react";
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
  TextField,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import SendIcon from "@mui/icons-material/Send";
import MessageIcon from "@mui/icons-material/Message";
import DeleteIcon from "@mui/icons-material/Delete";

import api from "../api/axios";
import { getImageUrl } from "../utils/imageUrl";

const getStatus = (property) =>
  String(property.propertyStatus ?? property.status ?? "UNKNOWN").toUpperCase();

const getStatusColor = (status) => {
  const value = String(status).toUpperCase();

  if (value === "APPROVED") return "success";
  if (value === "PENDING") return "warning";
  if (value === "REJECTED") return "error";

  return "default";
};

const getPropertyTitle = (property) =>
  property.title || property.propertyTitle || `Property #${property.id}`;

const getPropertyImage = (property) =>
  getImageUrl(property.imageUrl || property.image);

const formatTime = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AgentDashboard() {
  const navigate = useNavigate();

  // بيانات الوكيل تأتي من الـ backend وليس من الـ Context
  const [agentId, setAgentId] = useState(null);

  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [messagesByInquiry, setMessagesByInquiry] = useState({});

  const [replyInputs, setReplyInputs] = useState({});
  const [sending, setSending] = useState({});
  const [deleting, setDeleting] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // جلب المستخدم الحالي ثم بيانات الداشبورد
  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const userResponse = await api.get("/users/me");
        const currentUser = userResponse.data;

        if (!currentUser?.id) {
          throw new Error("Could not identify the logged-in user.");
        }

        if (String(currentUser.role).toUpperCase() !== "AGENT") {
          throw new Error("This dashboard is only available to agents.");
        }

        if (cancelled) return;

        const currentAgentId = currentUser.id;
        setAgentId(currentAgentId);

        const [propertiesResponse, inquiriesResponse] = await Promise.all([
          api.get("/property"),
          api.get(`/getInquiry/agent/${currentAgentId}`),
        ]);

        const allProperties = Array.isArray(propertiesResponse.data)
          ? propertiesResponse.data
          : [];

        const agentProperties = allProperties.filter(
          (property) =>
            String(property.agentId ?? property.agent?.id) ===
            String(currentAgentId),
        );

        const agentInquiries = Array.isArray(inquiriesResponse.data)
          ? inquiriesResponse.data
          : [];

        if (cancelled) return;

        setProperties(agentProperties);
        setInquiries(agentInquiries);

        // تحميل الرسائل الخاصة بكل استفسار
        const results = await Promise.all(
          agentInquiries.map(async (inquiry) => {
            try {
              const response = await api.get(`/message/inquiry/${inquiry.id}`);

              return [
                inquiry.id,
                Array.isArray(response.data) ? response.data : [],
              ];
            } catch (err) {
              console.error(
                `Failed to load messages for inquiry ${inquiry.id}:`,
                err.response?.data || err,
              );

              return [inquiry.id, []];
            }
          }),
        );

        if (!cancelled) {
          setMessagesByInquiry(Object.fromEntries(results));
        }
      } catch (err) {
        console.error("Dashboard loading failed:", err.response?.data || err);

        if (!cancelled) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            setError(
              "Your session is invalid or you do not have permission to access this dashboard.",
            );
          } else {
            setError(
              err.response?.data?.message ||
                err.message ||
                "Failed to load dashboard data.",
            );
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const approvedProperties = properties.filter(
    (property) => getStatus(property) === "APPROVED",
  );

  const pendingProperties = properties.filter(
    (property) => getStatus(property) === "PENDING",
  );

  const rejectedProperties = properties.filter(
    (property) => getStatus(property) === "REJECTED",
  );

  const openProperty = (property) => {
    if (!property?.id) return;

    navigate(`/properties/${property.id}`);
  };

  // إرسال رسالة
  const handleSendMessage = async (inquiryId) => {
    const content = (replyInputs[inquiryId] || "").trim();

    if (!content || sending[inquiryId]) return;

    setError("");
    setSuccess("");

    try {
      setSending((previous) => ({
        ...previous,
        [inquiryId]: true,
      }));

      await api.post("/addmessage", {
        inquiryId,
        content,
      });

      const response = await api.get(`/message/inquiry/${inquiryId}`);

      setMessagesByInquiry((previous) => ({
        ...previous,
        [inquiryId]: Array.isArray(response.data) ? response.data : [],
      }));

      setReplyInputs((previous) => ({
        ...previous,
        [inquiryId]: "",
      }));

      setSuccess("Message sent successfully.");
    } catch (err) {
      console.error("Failed to send message:", err.response?.data || err);

      setError(err.response?.data?.message || "Failed to send the message.");
    } finally {
      setSending((previous) => ({
        ...previous,
        [inquiryId]: false,
      }));
    }
  };

  // حذف استفسار
  const handleDeleteInquiry = async (inquiryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inquiry?",
    );

    if (!confirmed || deleting[inquiryId]) return;

    setError("");
    setSuccess("");

    try {
      setDeleting((previous) => ({
        ...previous,
        [inquiryId]: true,
      }));

      await api.delete(`/inquiry/${inquiryId}`);

      setInquiries((previous) =>
        previous.filter((inquiry) => String(inquiry.id) !== String(inquiryId)),
      );

      setMessagesByInquiry((previous) => {
        const updated = { ...previous };
        delete updated[inquiryId];
        return updated;
      });

      setSuccess("Inquiry deleted successfully.");
    } catch (err) {
      console.error("Failed to delete inquiry:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
          "Failed to delete inquiry. Check the backend delete endpoint.",
      );
    } finally {
      setDeleting((previous) => ({
        ...previous,
        [inquiryId]: false,
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // جدول العقارات حسب الحالة
  const renderPropertyTable = (title, items, status) => (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="h6" fontWeight={800}>
            {title}
          </Typography>

          <Chip
            label={items.length}
            color={getStatusColor(status)}
            size="small"
          />
        </Stack>
      </CardContent>

      {items.length === 0 ? (
        <Box sx={{ px: 2, pb: 3, pt: 1 }}>
          <Typography color="text.secondary" variant="body2">
            No {title.toLowerCase()} properties.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell>Property</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((property) => (
                <TableRow
                  key={property.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => openProperty(property)}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        component="img"
                        src={
                          getPropertyImage(property) ||
                          "/placeholder-property.jpg"
                        }
                        alt={getPropertyTitle(property)}
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden";
                        }}
                        sx={{
                          width: 76,
                          height: 58,
                          objectFit: "cover",
                          borderRadius: 1.5,
                          backgroundColor: "#eef2f7",
                          flexShrink: 0,
                        }}
                      />

                      <Typography fontWeight={700}>
                        {getPropertyTitle(property)}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>{property.location || "N/A"}</TableCell>

                  <TableCell>
                    {property.price == null
                      ? "N/A"
                      : `EGP ${Number(property.price).toLocaleString()}`}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getStatus(property)}
                      color={getStatusColor(getStatus(property))}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f8fc",
      }}
    >
      <AppBar position="static" elevation={2}>
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <HomeWorkIcon sx={{ mr: 1 }} />

          <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1 }}>
            EstateHub Agent
          </Typography>

          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 250,
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "white",
            borderRight: "1px solid #e5e7eb",
            display: { xs: "none", md: "block" },
            flexShrink: 0,
          }}
        >
          <Stack sx={{ p: 2 }} spacing={1}>
            <Button
              fullWidth
              startIcon={<DashboardIcon />}
              sx={{
                justifyContent: "flex-start",
                px: 2,
                py: 1.3,
                backgroundColor: "#e3efff",
                color: "primary.main",
                fontWeight: 700,
                borderRadius: 2,
              }}
            >
              Dashboard
            </Button>

            <Button
              component={Link}
              to="/dashboard/agent/properties"
              fullWidth
              startIcon={<HomeIcon />}
              sx={{
                justifyContent: "flex-start",
                px: 2,
                py: 1.3,
              }}
            >
              My Properties
            </Button>

            <Button
              component={Link}
              to="/dashboard/agent/Addpost"
              fullWidth
              startIcon={<AddIcon />}
              sx={{
                justifyContent: "flex-start",
                px: 2,
                py: 1.3,
              }}
            >
              Add Property
            </Button>

            <Button
              fullWidth
              startIcon={<MessageIcon />}
              onClick={() =>
                document
                  .getElementById("agent-inquiries")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              sx={{
                justifyContent: "flex-start",
                px: 2,
                py: 1.3,
              }}
            >
              Inquiries & Messages
            </Button>

            <Divider sx={{ my: 1 }} />

            <Button
              component={Link}
              to="/"
              fullWidth
              startIcon={<HomeIcon />}
              sx={{
                justifyContent: "flex-start",
                px: 2,
                py: 1.3,
              }}
            >
              Visit Website
            </Button>

            <Button
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                justifyContent: "flex-start",
                px: 2,
                py: 1.3,
                color: "error.main",
              }}
            >
              Logout
            </Button>
          </Stack>
        </Box>

        {/* Main content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Container
            maxWidth={false}
            sx={{
              py: 5,
              px: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
              sx={{ mb: 4 }}
            >
              <Box>
                <Typography variant="h4" fontWeight={900}>
                  Agent Dashboard
                </Typography>

                <Typography color="text.secondary">
                  Manage your properties and communicate with customers.
                </Typography>
              </Box>

              <Button
                component={Link}
                to="/dashboard/agent/Addpost"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Add Property
              </Button>
            </Stack>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{ mb: 2 }}
                onClose={() => setSuccess("")}
              >
                {success}
              </Alert>
            )}

            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 8,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {[
                    {
                      label: "My Properties",
                      value: properties.length,
                      color: "#1976d2",
                    },
                    {
                      label: "Approved",
                      value: approvedProperties.length,
                      color: "#2e7d32",
                    },
                    {
                      label: "Pending",
                      value: pendingProperties.length,
                      color: "#ed6c02",
                    },
                    {
                      label: "Rejected",
                      value: rejectedProperties.length,
                      color: "#d32f2f",
                    },
                    {
                      label: "Customer Inquiries",
                      value: inquiries.length,
                      color: "#7b1fa2",
                    },
                  ].map((item) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.label}>
                      <Card
                        elevation={0}
                        sx={{
                          border: "1px solid #e5e7eb",
                          borderRadius: 3,
                        }}
                      >
                        <CardContent>
                          <Typography color="text.secondary">
                            {item.label}
                          </Typography>

                          <Typography
                            variant="h4"
                            fontWeight={900}
                            sx={{ color: item.color, mt: 1 }}
                          >
                            {item.value}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
                  Property Listings
                </Typography>

                {renderPropertyTable(
                  "Approved Properties",
                  approvedProperties,
                  "APPROVED",
                )}

                {renderPropertyTable(
                  "Pending Properties",
                  pendingProperties,
                  "PENDING",
                )}

                {renderPropertyTable(
                  "Rejected Properties",
                  rejectedProperties,
                  "REJECTED",
                )}

                {/* Inquiries and conversations */}
                <Card
                  id="agent-inquiries"
                  elevation={0}
                  sx={{
                    mt: 4,
                    border: "1px solid #e5e7eb",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                      Customer Inquiries & Messages
                    </Typography>

                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{ mb: 3 }}
                    >
                      Each inquiry has its own conversation.
                    </Typography>

                    {inquiries.length === 0 ? (
                      <Alert severity="info">
                        No inquiries found for your account.
                      </Alert>
                    ) : (
                      <Stack spacing={3}>
                        {inquiries
                          .slice()
                          .reverse()
                          .map((inquiry) => {
                            const property = properties.find(
                              (item) =>
                                String(item.id) === String(inquiry.propertyId),
                            );

                            const inquiryMessages =
                              messagesByInquiry[inquiry.id] || [];

                            return (
                              <Card
                                key={inquiry.id}
                                variant="outlined"
                                sx={{
                                  borderRadius: 3,
                                  overflow: "hidden",
                                  backgroundColor: "#fff",
                                }}
                              >
                                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{ mb: 2 }}
                                  >
                                    <Box>
                                      <Typography variant="h6" fontWeight={800}>
                                        Inquiry #{inquiry.id}
                                      </Typography>

                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        {inquiry.createdAt
                                          ? `Created at ${formatTime(
                                              inquiry.createdAt,
                                            )}`
                                          : "Customer inquiry"}
                                      </Typography>
                                    </Box>

                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                    >
                                      <Chip
                                        label={inquiry.status || "ACTIVE"}
                                        size="small"
                                      />

                                      <IconButton
                                        color="error"
                                        aria-label="Delete inquiry"
                                        disabled={Boolean(deleting[inquiry.id])}
                                        onClick={() =>
                                          handleDeleteInquiry(inquiry.id)
                                        }
                                      >
                                        {deleting[inquiry.id] ? (
                                          <CircularProgress size={20} />
                                        ) : (
                                          <DeleteIcon />
                                        )}
                                      </IconButton>
                                    </Stack>
                                  </Stack>

                                  {property ? (
                                    <Box
                                      role="button"
                                      tabIndex={0}
                                      onClick={() => openProperty(property)}
                                      onKeyDown={(event) => {
                                        if (
                                          event.key === "Enter" ||
                                          event.key === " "
                                        ) {
                                          event.preventDefault();
                                          openProperty(property);
                                        }
                                      }}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        p: 1.5,
                                        mb: 2.5,
                                        borderRadius: 2,
                                        backgroundColor: "#f8fafc",
                                        border: "1px solid #e5e7eb",
                                        cursor: "pointer",
                                        "&:hover": {
                                          backgroundColor: "#eef4ff",
                                        },
                                      }}
                                    >
                                      <Box
                                        component="img"
                                        src={
                                          getPropertyImage(property) ||
                                          "/placeholder-property.jpg"
                                        }
                                        alt={getPropertyTitle(property)}
                                        onError={(event) => {
                                          event.currentTarget.style.visibility =
                                            "hidden";
                                        }}
                                        sx={{
                                          width: 110,
                                          height: 85,
                                          objectFit: "cover",
                                          borderRadius: 2,
                                          flexShrink: 0,
                                          backgroundColor: "#e5e7eb",
                                        }}
                                      />

                                      <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                          fontWeight={800}
                                          sx={{ mb: 0.5 }}
                                        >
                                          {getPropertyTitle(property)}
                                        </Typography>

                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          {property.location ||
                                            "Location unavailable"}
                                        </Typography>

                                        <Typography
                                          color="primary"
                                          fontWeight={700}
                                          sx={{ mt: 0.5 }}
                                        >
                                          {property.price == null
                                            ? "Price unavailable"
                                            : `EGP ${Number(
                                                property.price,
                                              ).toLocaleString()}`}
                                        </Typography>

                                        <Typography
                                          variant="caption"
                                          color="primary"
                                        >
                                          View property details
                                        </Typography>
                                      </Box>
                                    </Box>
                                  ) : (
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                      The property details are not available.
                                    </Alert>
                                  )}

                                  <Divider sx={{ mb: 2 }} />

                                  <Typography fontWeight={800} sx={{ mb: 2 }}>
                                    Conversation
                                  </Typography>

                                  {inquiryMessages.length === 0 ? (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mb: 2 }}
                                    >
                                      No messages yet.
                                    </Typography>
                                  ) : (
                                    <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                                      {inquiryMessages.map((message) => {
                                        const isAgent =
                                          String(message.senderId) ===
                                          String(agentId);

                                        return (
                                          <Box
                                            key={message.id}
                                            sx={{
                                              alignSelf: isAgent
                                                ? "flex-end"
                                                : "flex-start",
                                              maxWidth: "90%",
                                              minWidth: "100px",
                                              p: 1.5,
                                              borderRadius: 2,
                                              backgroundColor: isAgent
                                                ? "#e3efff"
                                                : "#f1f3f5",
                                              overflowWrap: "anywhere",
                                            }}
                                          >
                                            <Typography
                                              variant="caption"
                                              fontWeight={700}
                                              display="block"
                                            >
                                              {isAgent
                                                ? "You (Agent)"
                                                : "Customer"}
                                            </Typography>

                                            <Typography sx={{ my: 0.5 }}>
                                              {message.content}
                                            </Typography>

                                            {message.createdAt && (
                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                              >
                                                {formatTime(message.createdAt)}
                                              </Typography>
                                            )}
                                          </Box>
                                        );
                                      })}
                                    </Stack>
                                  )}

                                  <Stack
                                    direction={{
                                      xs: "column",
                                      sm: "row",
                                    }}
                                    spacing={1}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      placeholder="Write a message..."
                                      value={replyInputs[inquiry.id] || ""}
                                      onChange={(event) =>
                                        setReplyInputs((previous) => ({
                                          ...previous,
                                          [inquiry.id]: event.target.value,
                                        }))
                                      }
                                      onKeyDown={(event) => {
                                        if (
                                          event.key === "Enter" &&
                                          !event.shiftKey
                                        ) {
                                          event.preventDefault();
                                          handleSendMessage(inquiry.id);
                                        }
                                      }}
                                    />

                                    <Button
                                      variant="contained"
                                      endIcon={<SendIcon />}
                                      disabled={
                                        !(
                                          replyInputs[inquiry.id] || ""
                                        ).trim() || Boolean(sending[inquiry.id])
                                      }
                                      onClick={() =>
                                        handleSendMessage(inquiry.id)
                                      }
                                    >
                                      {sending[inquiry.id]
                                        ? "Sending..."
                                        : "Send"}
                                    </Button>
                                  </Stack>
                                </CardContent>
                              </Card>
                            );
                          })}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
