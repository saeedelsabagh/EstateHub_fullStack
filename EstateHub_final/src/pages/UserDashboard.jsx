import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Stack,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MessageIcon from "@mui/icons-material/Message";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

import api from "../api/axios";
import { useEstate } from "../ContextRorReducer";

const formatTime = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTitle = (property) =>
  property?.title ||
  property?.propertyTitle ||
  `Property #${property?.id ?? ""}`;

const getImage = (property) => property?.imageUrl || property?.image || "";

export default function UserDashboard() {
  const { state } = useEstate();
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [properties, setProperties] = useState([]);
  const [messagesByInquiry, setMessagesByInquiry] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [sending, setSending] = useState({});
  const [deleting, setDeleting] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = state.user?.id;

  const favorites = (state.favorites || []).filter(
    (item) => String(item.userId) === String(userId),
  );

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [inquiriesResponse, propertiesResponse] = await Promise.all([
          api.get(`/getInquiry/user/${userId}`),
          api.get("/property"),
        ]);

        const userInquiries = Array.isArray(inquiriesResponse.data)
          ? inquiriesResponse.data
          : [];

        const allProperties = Array.isArray(propertiesResponse.data)
          ? propertiesResponse.data
          : [];

        if (cancelled) return;

        setInquiries(userInquiries);
        setProperties(allProperties);

        const results = await Promise.all(
          userInquiries.map(async (inquiry) => {
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
        console.error(
          "Failed to load user dashboard:",
          err.response?.data || err,
        );

        if (!cancelled) {
          setError("Failed to load dashboard data. Please try again.");
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
  }, [userId]);

  const getInquiryProperty = (inquiry) =>
    properties.find(
      (property) => String(property.id) === String(inquiry.propertyId),
    );

  const openProperty = (property) => {
    if (!property?.id) return;

    navigate(`/properties/${property.id}`);
  };

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

      // Change this URL if your backend uses a different delete endpoint.
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
          "Failed to delete inquiry. Check the delete endpoint in your backend.",
      );
    } finally {
      setDeleting((previous) => ({
        ...previous,
        [inquiryId]: false,
      }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        py: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          width: "92%",
          maxWidth: 1150,
          mx: "auto",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <IconButton component={Link} to="/" sx={{ color: "text.secondary" }}>
            <HomeIcon sx={{ fontSize: 30 }} />
          </IconButton>

          <Button variant="outlined" component={Link} to="/properties">
            Browse Properties
          </Button>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} color="#102a43">
              My Dashboard
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Manage your favorites and property conversations.
            </Typography>
          </Box>

          <Button component={Link} to="/properties" variant="contained">
            Explore Properties
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
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

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FavoriteIcon color="error" sx={{ fontSize: 32 }} />

                  <Box>
                    <Typography color="text.secondary">Favorites</Typography>

                    <Typography variant="h4" fontWeight={800}>
                      {favorites.length}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <MessageIcon color="primary" sx={{ fontSize: 32 }} />

                  <Box>
                    <Typography color="text.secondary">My Inquiries</Typography>

                    <Typography variant="h4" fontWeight={800}>
                      {inquiries.length}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
          My Inquiries & Messages
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          View property details and continue your conversations with agents.
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : inquiries.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              textAlign: "center",
              p: 5,
              border: "1px solid #e5e7eb",
              borderRadius: 3,
            }}
          >
            <MessageIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />

            <Typography variant="h6" fontWeight={700}>
              No inquiries yet
            </Typography>

            <Typography color="text.secondary" sx={{ my: 2 }}>
              Send an inquiry from a property page to start a conversation.
            </Typography>

            <Button component={Link} to="/properties" variant="contained">
              Browse Properties
            </Button>
          </Card>
        ) : (
          <Stack spacing={3}>
            {inquiries
              .slice()
              .reverse()
              .map((inquiry) => {
                const property = getInquiryProperty(inquiry);
                const messages = messagesByInquiry[inquiry.id] || [];

                return (
                  <Card
                    key={inquiry.id}
                    elevation={0}
                    sx={{
                      border: "1px solid #dfe4ec",
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

                          <Typography variant="body2" color="text.secondary">
                            {inquiry.createdAt
                              ? `Created at ${formatTime(inquiry.createdAt)}`
                              : "Property inquiry"}
                          </Typography>
                        </Box>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip
                            label={inquiry.status || "ACTIVE"}
                            size="small"
                          />

                          <IconButton
                            color="error"
                            aria-label="Delete inquiry"
                            disabled={Boolean(deleting[inquiry.id])}
                            onClick={() => handleDeleteInquiry(inquiry.id)}
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
                            if (event.key === "Enter" || event.key === " ") {
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
                            border: "1px solid #e5e7eb",
                            borderRadius: 2,
                            backgroundColor: "#f8fafc",
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#eef4ff",
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={
                              getImage(property) || "/placeholder-property.jpg"
                            }
                            alt={getTitle(property)}
                            onError={(event) => {
                              event.currentTarget.style.visibility = "hidden";
                            }}
                            sx={{
                              width: { xs: 90, sm: 125 },
                              height: { xs: 75, sm: 95 },
                              objectFit: "cover",
                              borderRadius: 2,
                              backgroundColor: "#e5e7eb",
                              flexShrink: 0,
                            }}
                          />

                          <Box sx={{ minWidth: 0 }}>
                            <Typography fontWeight={800}>
                              {getTitle(property)}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {property.location || "Location unavailable"}
                            </Typography>

                            <Typography
                              color="primary"
                              fontWeight={700}
                              sx={{ mt: 0.5 }}
                            >
                              {property.price == null
                                ? "Price unavailable"
                                : `EGP ${Number(property.price).toLocaleString()}`}
                            </Typography>

                            <Typography variant="caption" color="primary">
                              Click to view property
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          Property details are unavailable.
                        </Alert>
                      )}

                      <Divider sx={{ mb: 2 }} />

                      <Typography fontWeight={800} sx={{ mb: 2 }}>
                        Conversation
                      </Typography>

                      {messages.length === 0 ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          No messages yet.
                        </Typography>
                      ) : (
                        <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                          {messages.map((message) => {
                            const isUser =
                              String(message.senderId) === String(userId);

                            return (
                              <Box
                                key={message.id}
                                sx={{
                                  alignSelf: isUser ? "flex-end" : "flex-start",
                                  maxWidth: "90%",
                                  minWidth: 100,
                                  p: 1.5,
                                  borderRadius: 2,
                                  backgroundColor: isUser
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
                                  {isUser ? "You" : "Agent"}
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
                        direction={{ xs: "column", sm: "row" }}
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
                            if (event.key === "Enter" && !event.shiftKey) {
                              event.preventDefault();
                              handleSendMessage(inquiry.id);
                            }
                          }}
                        />

                        <Button
                          variant="contained"
                          endIcon={<SendIcon />}
                          disabled={
                            !(replyInputs[inquiry.id] || "").trim() ||
                            Boolean(sending[inquiry.id])
                          }
                          onClick={() => handleSendMessage(inquiry.id)}
                        >
                          {sending[inquiry.id] ? "Sending..." : "Send"}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
