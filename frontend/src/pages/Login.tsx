import React, { useState } from "react";
import { Container, Paper, TextField, Button, Typography, Box, Alert, InputAdornment, IconButton, Link, Tooltip, Switch, FormGroup, FormControlLabel } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, AdminPanelSettings } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApp } from "../hooks/useApp";
import { LoginData } from "../types";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setLoading } = useApp();

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
    role: "customer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminChecked, setIsAdminChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleAdminSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setIsAdminChecked(checked);
    setFormData((prev) => ({
      ...prev,
      [name]: checked ? "admin" : "customer",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    console.log("formData before validation ", formData);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      setLoading(true);
      console.log("formData ", formData);
      await login(formData);

      // Check if user is admin and redirect accordingly
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Paper elevation={6} sx={{ padding: 4, width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <AdminPanelSettings color="primary" sx={{ fontSize: 40 }} />
            <Typography component="h1" variant="h4" sx={{ mt: 1 }}>
              {isAdminChecked ? "Admin" : "User"} Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access the {isAdminChecked ? "admin" : "user"} dashboard with your credentials
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={showPassword ? "Hide Password" : "Show Password"}>
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <FormGroup>
              <FormControlLabel control={<Switch checked={isAdminChecked} onChange={handleAdminSwitch} slotProps={{ input: { "aria-label": "controlled" } }} />} label="Admin" name="role" />
            </FormGroup>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link component={RouterLink} to="/register" variant="body2">
                  Register here
                </Link>
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <Link component={RouterLink} to="/" variant="body2">
                  Back to home
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Admin Login Hint */}
        <Paper elevation={2} sx={{ padding: 2, mt: 3, backgroundColor: "info.light", display: isAdminChecked ? "block" : "none" }}>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            <strong>Admin Note:</strong> Use your admin credentials to access the dashboard. If you don't have admin access, please contact your system administrator.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
