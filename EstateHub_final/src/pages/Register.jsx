import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { useEstate } from "../ContextRorReducer";
import api from "../api/axios";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const { state, dispatch } = useEstate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !state.register.name.trim() ||
      !state.register.email.trim() ||
      !state.register.password ||
      !state.register.confirmPassword
    ) {
      dispatch({
        type: "SET_Action_MESSAGE",
        payload: {
          type: "error",
          text: "Please fill in all fields",
        },
      });
      return;
    }

    if (state.register.password !== state.register.confirmPassword) {
      dispatch({
        type: "SET_Action_MESSAGE",
        payload: {
          type: "error",
          text: "Passwords do not match",
        },
      });
      return;
    }

    setLoading(true);

    try {
     
      const response = await api.post("/adduser", {
        name: state.register.name.trim(),
        email: state.register.email.trim(),
        password: state.register.password,
        role: state.register.role.toUpperCase(),
      });


      dispatch({
        type: "SET_Action_MESSAGE",
        payload: {
          type: "success",
          text: "Account created successfully. Please log in.",
        },
      });

      navigate("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      console.error("BACKEND RESPONSE:", error.response?.data);

      const responseData = error.response?.data;

      const message =
        typeof responseData === "string"
          ? responseData
          : responseData?.message ||
            responseData?.error ||
            error.message ||
            "Registration failed";

      dispatch({
        type: "SET_Action_MESSAGE",
        payload: {
          type: "error",
          text: message,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !state.register.name?.trim() ||
    !state.register.email?.trim() ||
    !state.register.password ||
    !state.register.confirmPassword ||
    loading;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 500 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <HomeWorkIcon color="primary" sx={{ fontSize: 45 }} />

            <Typography variant="h4" fontWeight={900}>
              Create Account
            </Typography>

            <Typography color="text.secondary">Join EstateHub today</Typography>
          </Stack>

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={state.register.name}
              onChange={(e) =>
                dispatch({
                  type: "SET_REGISTER",
                  payload: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={state.register.email}
              onChange={(e) =>
                dispatch({
                  type: "SET_REGISTER",
                  payload: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={state.register.password}
              onChange={(e) =>
                dispatch({
                  type: "SET_REGISTER",
                  payload: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={state.register.confirmPassword}
              onChange={(e) =>
                dispatch({
                  type: "SET_REGISTER",
                  payload: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
            />

            <TextField
              select
              fullWidth
              label="Account Type"
              value={state.register.role}
              onChange={(e) =>
                dispatch({
                  type: "SET_REGISTER",
                  payload: {
                    name: "role",
                    value: e.target.value,
                  },
                })
              }
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="agent">Agent</MenuItem>
            </TextField>

            {state.actionmessages.error && (
              <Typography color="error" textAlign="center">
                {state.actionmessages.error}
              </Typography>
            )}

            {state.actionmessages.success && (
              <Typography color="success.main" textAlign="center">
                {state.actionmessages.success}
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              disabled={isDisabled}
              onClick={handleRegister}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography textAlign="center">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
