import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box, Button, IconButton, Divider, Grid, TextField, Alert, Chip } from "@mui/material";
import { Delete, Add, Remove, ShoppingCart, ArrowBack, LocalShipping, Security, Replay } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { productService } from "../services/productService";
import { Product } from "../types";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartItemsCount, addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productService.getAllProducts();

        setProducts(productData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product");
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <ShoppingCart sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button variant="contained" size="large" onClick={handleContinueShopping} startIcon={<ArrowBack />}>
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.09; // 9% tax
  const total = subtotal + shipping + tax;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
        Shopping Cart ({getCartItemsCount()} {getCartItemsCount() === 1 ? "item" : "items"})
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Cart Items
              </Typography>
              <Button color="error" startIcon={<Delete />} onClick={clearCart} size="small">
                Clear Cart
              </Button>
            </Box>

            {cartItems.map((item, index) => (
              <Box key={item.product.id}>
                {index > 0 && <Divider sx={{ my: 2 }} />}

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {/* Product Image */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundImage: `url(${item.product.imageUrl || "https://via.placeholder.com/80x80?text=No+Image"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: 1,
                      mr: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/products/${item.product.id}`)}
                  />

                  {/* Product Info */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                      onClick={() => navigate(`/products/${item.product.id}`)}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product.category}
                    </Typography>
                    <Typography variant="body2" color={item.product.stock > 0 ? "success.main" : "error.main"}>
                      {item.product.stock > 0 ? "In stock" : "Out of stock"}
                    </Typography>
                  </Box>

                  {/* Price */}
                  <Typography variant="h6" sx={{ minWidth: 100, textAlign: "right", mr: 2 }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>

                {/* Quantity Controls */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton size="small" onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <Remove />
                    </IconButton>
                    <TextField
                      size="small"
                      value={item.quantity}
                      sx={{
                        width: 60,
                        mx: 1,
                        "& .MuiInputBase-input": {
                          textAlign: "center",
                          py: 0.5,
                        },
                      }}
                      inputProps={{
                        min: 1,
                        max: item.product.stock,
                        style: { textAlign: "center" },
                      }}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        handleQuantityChange(item.product.id, newQuantity);
                      }}
                    />
                    <IconButton size="small" onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock}>
                      <Add />
                    </IconButton>
                  </Box>

                  <IconButton color="error" onClick={() => removeFromCart(item.product.id)} size="small">
                    <Delete />
                  </IconButton>
                </Box>

                {/* Price per unit */}
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "right", mt: 0.5 }}>
                  ${item.product.price} each
                </Typography>
              </Box>
            ))}
          </Paper>

          {/* Continue Shopping Button */}
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleContinueShopping} sx={{ mt: 2 }}>
            Continue Shopping
          </Button>
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Order Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Subtotal ({getCartItemsCount()} items):</Typography>
                <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Shipping:</Typography>
                <Typography variant="body2">{shipping === 0 ? <Chip label="FREE" size="small" color="success" variant="outlined" /> : `$${shipping.toFixed(2)}`}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2">Tax (9%):</Typography>
                <Typography variant="body2">${tax.toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>

              {subtotal < 50 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </Alert>
              )}
            </Box>

            <Button variant="contained" size="large" fullWidth onClick={handleCheckout} disabled={cartItems.some((item) => item.product.stock === 0)} sx={{ py: 1.5, mb: 2 }}>
              Proceed to Checkout
            </Button>

            {cartItems.some((item) => item.product.stock === 0) && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Remove out-of-stock items to proceed with checkout.
              </Alert>
            )}

            {/* Trust Badges */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
                <LocalShipping color="action" />
                <Security color="action" />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Free shipping on orders over $50 • Secure and easy checkout • Dedicated customer support
              </Typography>
            </Box>
          </Paper>

          {/* Promo Code (Optional) */}
          <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Have a Promo Code?
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField placeholder="Enter code" size="small" fullWidth />
              <Button variant="outlined" size="small">
                Apply
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recently Viewed / Recommended Products (Optional) */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
          You Might Also Like
        </Typography>

        <Grid container spacing={2}>
          {/* Recommended products (excluding items already in cart) */}
          {products
            .filter((product) => !cartItems.some((item) => item.product.id === product.id))
            .slice(0, 4) // Show only 4 recommended products
            .map((product) => (
              <Grid size={{ xs: 6, md: 3 }} key={product.id}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => navigate(`/products/${product.id}`)}>
                  <Box
                    sx={{
                      height: 120,
                      backgroundImage: `url(${product.imageUrl || "https://via.placeholder.com/150x120?text=No+Image"})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      mb: 1,
                    }}
                  />
                  <Typography variant="body2" noWrap sx={{ fontWeight: "bold" }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                    {product.category}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: "bold" }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation to product page
                      addToCart(product);
                    }}>
                    Add to Cart
                  </Button>
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Cart;
