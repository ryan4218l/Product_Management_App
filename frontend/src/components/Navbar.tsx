import React from "react";
import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Box } from "@mui/material";
import { ShoppingCart, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../src/hooks/useCart";
import { useAuth } from "../../src/hooks/useAuth";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const cartItemsCount = getCartItemsCount();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
          Creature Cove
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button color="inherit" onClick={() => navigate("/products")}>
            Products
          </Button>

          <IconButton color="inherit" onClick={() => navigate("/cart")}>
            <Badge badgeContent={cartItemsCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {isAuthenticated ? (
            <>
              <IconButton color="inherit" onClick={() => navigate("/profile")}>
                <AccountCircle />
              </IconButton>
              <Button
                color="inherit"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
