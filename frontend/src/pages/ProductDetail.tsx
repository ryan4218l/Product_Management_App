import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography, Button, Box, Chip, Rating, Divider, IconButton, Alert, CircularProgress, Breadcrumbs, Link } from "@mui/material";
import { ShoppingCart, Favorite, Share, ArrowBack, Add, Remove } from "@mui/icons-material";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { Product } from "../types";
import { productService } from "../services/productService";

const features = ["Lorem ipsum dolor sit amet", "Duis aute irure", "sunt in culpa ", "Excepteur sint", "dolore magna aliqua. Ut enim ad minim", "sed do"];

const specifications = {
  weight: "Lorem ipsum g",
  connectivity: "Lorem ipsum 5.0",
  battery: "30 Lorem ipsum",
  charging: "Lorem ipsum-C",
  colors: ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [productImages, setProductImages] = useState<string[]>([]);

  // Mock images for gallery - in real app, these would come from the product data
  //   const productImages = [
  //     "https://www.plushinarush.com/cdn/shop/files/14-huggable-panda-891-3-988003712.jpg?v=1744962650",
  //     "https://www.edinburghart.com/wp-content/uploads/Penguin1.jpg",
  //     "https://www.edinburghart.com/wp-content/uploads/Penguin1.jpg",
  //     "https://www.edinburghart.com/wp-content/uploads/Penguin1.jpg",
  //   ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductById(parseInt(id || "0"));
        setProductImages(productData.imageUrl ? [productData.imageUrl, "https://www.plushinarush.com/cdn/shop/files/14-huggable-panda-891-3-988003712.jpg?v=1744962650"] : []);
        setProduct(productData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product");
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Show success message or notification
    }
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product?.stock || 1, prev + amount)));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show "Link copied" message
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Product not found"}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/products" color="inherit">
          Products
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Button startIcon={<ArrowBack />} onClick={() => navigate("/products")} sx={{ mb: 3 }}>
        Back to Products
      </Button>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                height: 400,
                backgroundImage: `url(${productImages[selectedImage]})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                mb: 2,
              }}
            />
            <Grid container spacing={1}>
              {productImages.map((image, index) => (
                <Grid key={index} size={{ xs: 3 }}>
                  <Box
                    sx={{
                      height: 80,
                      backgroundImage: `url(${image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                      border: selectedImage === index ? 2 : 0,
                      borderColor: "primary.main",
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Chip label={product.category} color="primary" variant="outlined" />
              <Box>
                <IconButton aria-label="add to favorites">
                  <Favorite />
                </IconButton>
                <IconButton aria-label="share" onClick={handleShare}>
                  <Share />
                </IconButton>
              </Box>
            </Box>

            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
              {product.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={4.5} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                (42 reviews)
              </Typography>
            </Box>

            <Typography variant="h3" color="primary" sx={{ fontWeight: "bold", mb: 3 }}>
              ${product.price}
            </Typography>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Stock Status */}
            <Typography variant="body1" color={product.stock > 0 ? "success.main" : "error.main"} sx={{ fontWeight: "bold", mb: 2 }}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Typography>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Quantity:
                </Typography>
                <IconButton size="small" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <Remove />
                </IconButton>
                <Typography variant="h6" sx={{ mx: 2 }}>
                  {quantity}
                </Typography>
                <IconButton size="small" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                  <Add />
                </IconButton>
              </Box>
            )}

            {/* Add to Cart Button */}
            <Button variant="contained" size="large" fullWidth startIcon={<ShoppingCart />} onClick={handleAddToCart} disabled={product.stock === 0} sx={{ py: 1.5, mb: 2 }}>
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>

            {/* Additional Info */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ✓ Free shipping on orders over $50
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ✓ Dedicated customer support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ✓ Secure and easy checkout
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Product Details */}
      <Grid container spacing={4} sx={{ mt: 1 }}>
        {/* Features */}
        {features && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                Features
              </Typography>
              <ul style={{ paddingLeft: "20px" }}>
                {features.map((feature, index) => (
                  <li key={index}>
                    <Typography variant="body1">{feature}</Typography>
                  </li>
                ))}
              </ul>
            </Paper>
          </Grid>
        )}

        {/* Specifications */}
        {specifications && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                Specifications
              </Typography>
              {Object.entries(specifications).map(([key, value]) => (
                <Box key={key} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </Typography>
                  <Typography variant="body1">{Array.isArray(value) ? value.join(", ") : value}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        )}

        {/* Reviews Section */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Customer Reviews
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={4.5} precision={0.5} readOnly />
              <Typography variant="h6" sx={{ ml: 1 }}>
                4.5 out of 5
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                (42 reviews)
              </Typography>
            </Box>

            {/* Sample Reviews */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Excellent product!</Typography>
                <Rating value={5} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  By John D. • January 15, 2024
                </Typography>
                <Typography variant="body1">This is one of the best products I've ever purchased. The quality is outstanding and it exceeded my expectations.</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Very good, but...</Typography>
                <Rating value={4} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  By Sarah M. • February 3, 2024
                </Typography>
                <Typography variant="body1">Overall a great product, but the quality could be better. Still would recommend!</Typography>
              </Box>
            </Box>

            <Button variant="outlined" sx={{ mt: 2 }}>
              See All Reviews
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
