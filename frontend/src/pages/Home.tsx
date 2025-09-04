import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardActions, Chip, Rating } from "@mui/material";
import { ShoppingCart, LocalShipping, Security, SupportAgent, TrendingUp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { Product } from "../types";
import { productService } from "../services/productService";

const featuredProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    rating: 4.5,
    image: "https://via.placeholder.com/300x200?text=Headphones",
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation",
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    rating: 4.2,
    image: "https://via.placeholder.com/300x200?text=T-Shirt",
    category: "Clothing",
    description: "Comfortable organic cotton t-shirt in various colors",
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    rating: 4.7,
    image: "https://via.placeholder.com/300x200?text=Water+Bottle",
    category: "Lifestyle",
    description: "Eco-friendly stainless steel water bottle, keeps drinks cold for 24 hours",
  },
];

const features = [
  {
    icon: <LocalShipping sx={{ fontSize: 40 }} />,
    title: "Free Shipping",
    description: "Free delivery on orders over $50",
  },
  {
    icon: <Security sx={{ fontSize: 40 }} />,
    title: "Secure Payment",
    description: "100% secure payment processing",
  },
  {
    icon: <SupportAgent sx={{ fontSize: 40 }} />,
    title: "24/7 Support",
    description: "Round-the-clock customer support",
  },
  {
    icon: <TrendingUp sx={{ fontSize: 40 }} />,
    title: "Quality Products",
    description: "Curated selection of premium items",
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await productService.getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        console.error("No products found");
      }
    };

    fetchProducts();
  }, []);

  const handleShopNow = () => {
    navigate("/products");
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = (product: any, event: React.MouseEvent) => {
    event.stopPropagation();
    addToCart(product);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 8,
          mb: 6,
        }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}>
              Welcome to Creature Cove
            </Typography>
            <Typography
              variant="h5"
              component="p"
              gutterBottom
              sx={{
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: "1.1rem", md: "1.3rem" },
              }}>
              Discover amazing products at unbeatable prices. Quality you can trust, service you'll love.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleShopNow}
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "grey.100",
                  transform: "translateY(-2px)",
                },
                px: 6,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}>
              Shop Now
            </Button>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="lg">
        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "transform 0.3s ease-in-out",
                  },
                }}>
                <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Featured Products Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              mb: 6,
              color: "text.primary",
            }}>
            Featured Products
          </Typography>
          <Grid container spacing={4}>
            {products.slice(0, 3).map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => handleProductClick(product.id)}>
                  <Box
                    sx={{
                      height: 200,
                      backgroundImage: `url(${product.imageUrl})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Chip label={product.category} size="small" color="primary" variant="outlined" />
                      <Rating value={product.rating} precision={0.1} size="small" readOnly />
                    </Box>
                    <Typography gutterBottom variant="h6" component="h3">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                      ${product.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" startIcon={<ShoppingCart />} onClick={(e) => handleAddToCart(product, e)}>
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
            color: "white",
            borderRadius: 2,
            p: 6,
            textAlign: "center",
            mb: 4,
          }}>
          <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: "bold" }}>
            Ready to Explore More?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Browse our complete collection of products and find exactly what you need.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleShopNow}
            sx={{
              backgroundColor: "white",
              color: "primary.main",
              "&:hover": {
                backgroundColor: "grey.100",
                transform: "translateY(-2px)",
              },
              px: 6,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}>
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
