
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { useEstate } from "../ContextRorReducer";
import api from "../api/axios";
import { useState } from "react";

export default function Login() {
  const { state, dispatch } = useEstate();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!state.login.email || !state.login.password) {
      dispatch({
        type: "SET_LOGIN",
        payload: {
          type: "error",
          text: "Please enter email and password",
        },
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", {
        email: state.login.email,
        password: state.login.password,
      });

      const token =
        typeof response.data === "string"
          ? response.data
          : response.data.token;

      if (!token) {
        throw new Error("Backend did not return a JWT token");
      }

      localStorage.setItem("token", token);

      const userResponse = await api.get(
        `/email/${encodeURIComponent(state.login.email)}`
      );

      const user = userResponse.data;
      const role = String(user.role || "").toLowerCase();

      if (role === "admin") {
        navigate("/dashboard/admin");
      } else if (role === "agent") {
        navigate("/dashboard/agent");
      } else {
        navigate("/dashboard/user");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      dispatch({
        type: "SET_LOGIN",
        payload: {
          type: "error",
          text:
            error.response?.data?.message ||
            (typeof error.response?.data === "string"
              ? error.response.data
              : error.message) ||
            "Login failed",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !state.login.email || !state.login.password || loading;

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
      <Card sx={{ width: "100%", maxWidth: 450 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <HomeWorkIcon color="primary" sx={{ fontSize: 45 }} />

            <Typography variant="h4" fontWeight={900}>
              Welcome Back
            </Typography>

            <Typography color="text.secondary">
              Login to your EstateHub account
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={state.login.email}
              onChange={(e) =>
                dispatch({
                  type: "SET_LOGIN",
                  payload: {
                    name: "email",
                    value: e.target.value,
                  },
                })
              }
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={state.login.password}
              onChange={(e) =>
                dispatch({
                  type: "SET_LOGIN",
                  payload: {
                    name: "password",
                    value: e.target.value,
                  },
                })
              }
            />

            {state.actionmessages.error && (
              <Typography color="error" textAlign="center">
                {state.actionmessages.error}
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              disabled={isDisabled}
              onClick={handleLogin}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography textAlign="center">
            Don't have an account? <Link to="/register">Create one</Link>
          </Typography>

          <Button component={Link} to="/" fullWidth sx={{ mt: 2 }}>
            Back Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
