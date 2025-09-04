import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ShoppingCart, Search, Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { Product } from "../types";
import { productService } from "../services/productService";

const categories = ["All", "Toy", "Apparel & Accessory", "Animal Figurine", "Decoration", "Miscellaneous"];
const sortOptions = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "newest", label: "Newest" },
];

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productsData = await productService.getAllProducts();
        const productsWithRatings = productsData.map((product) => {
          const { ratingValue, ratingCounter } = getRandomNumberWithStep(0, 5, 0.5);
          return {
            ...product,
            rating: ratingValue,
            ratingCounter: ratingCounter,
          };
        });
        setProducts(productsWithRatings);
        setFilteredProducts(productsWithRatings);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, sortBy, products]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleAddToCart = (product: Product) => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
    setQuantity(1);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuantity(1);
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const getRandomNumberWithStep = (min: number, max: number, step: number): { ratingValue: number; ratingCounter: number } => {
    if (step <= 0) {
      throw new Error("Step must be a positive number.");
    }
    if (min > max) {
      throw new Error("Min cannot be greater than max.");
    }

    const range = (max - min) / step;
    const randomStep = Math.floor(Math.random() * (range + 1));
    const ratingValue = min + randomStep * step;
    const ratingCounter = Math.floor(Math.random() * 101);
    return { ratingValue, ratingCounter };
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
        Our Products
      </Typography>

      {/* Filters and Search */}
      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Search products..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
          }}
          sx={{ minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} label="Category" onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Chip label={`${filteredProducts.length} products found`} color="primary" variant="outlined" />
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          No products found matching your criteria. Try adjusting your filters.
        </Alert>
      ) : (
        <>
          {/* Products Grid */}
          <Grid container spacing={3}>
            {currentProducts.map((product, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}>
                  <Box
                    sx={{
                      height: 200,
                      cursor: "pointer",
                      backgroundImage: `url(${product.imageUrl})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                    onClick={() => handleProductClick(product.id)}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                      <Chip label={product.category} size="small" color="primary" variant="outlined" />
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Rating value={product.rating} precision={0.5} size="small" readOnly />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3 }}>
                          {product.ratingCounter}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      sx={{
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                      onClick={() => handleProductClick(product.id)}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                      ${product.price}
                    </Typography>
                    <Typography variant="body2" color={product.stock > 0 ? "success.main" : "error.main"}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => handleQuickView(product)} disabled={product.stock === 0}>
                      Quick View
                    </Button>
                    <Button size="small" color="primary" startIcon={<ShoppingCart />} onClick={() => addToCart(product)} disabled={product.stock === 0}>
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination count={totalPages} page={currentPage} onChange={(_, value) => setCurrentPage(value)} color="primary" />
            </Box>
          )}
        </>
      )}

      {/* Quick View Dialog */}
      <Dialog open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} maxWidth="md" fullWidth>
        {quickViewProduct && (
          <>
            <DialogTitle>{quickViewProduct.name}</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      height: 300,
                      backgroundImage: `url(${quickViewProduct.imageUrl})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: "bold", mb: 2 }}>
                    ${quickViewProduct.price}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {quickViewProduct.description}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Category:
                    </Typography>
                    <Chip label={quickViewProduct.category} size="small" color="primary" variant="outlined" />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Availability:
                    </Typography>
                    <Typography variant="body2" color={quickViewProduct.stock > 0 ? "success.main" : "error.main"} sx={{ fontWeight: "bold" }}>
                      {quickViewProduct.stock > 0 ? `${quickViewProduct.stock} in stock` : "Out of stock"}
                    </Typography>
                  </Box>

                  {quickViewProduct.stock > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        Quantity:
                      </Typography>
                      <IconButton size="small" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                        <Remove />
                      </IconButton>
                      <Typography variant="body1" sx={{ mx: 2 }}>
                        {quantity}
                      </Typography>
                      <IconButton size="small" onClick={() => handleQuantityChange(1)} disabled={quantity >= quickViewProduct.stock}>
                        <Add />
                      </IconButton>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setQuickViewProduct(null)}>Cancel</Button>
              <Button variant="contained" onClick={() => handleAddToCart(quickViewProduct)} disabled={quickViewProduct.stock === 0} startIcon={<ShoppingCart />}>
                Add to Cart
              </Button>
              <Button variant="outlined" onClick={() => handleProductClick(quickViewProduct.id)}>
                View Details
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Products;
