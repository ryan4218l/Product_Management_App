import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Add, Edit, Delete, Visibility, ShoppingCart, AttachMoney, Inventory } from "@mui/icons-material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { useApp } from "../hooks/useApp";
import { useAuth } from "../hooks/useAuth";
import { Product } from "../types";
import { productService } from "../services/productService";

const CATEGORIES = ["Toy", "Apparel & Accessory", "Animal Figurine", "Decoration", "Miscellaneous"];

const AdminDashboard: React.FC = () => {
  const { setLoading } = useApp();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    category: "",
  });

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      window.location.href = "/";
    }
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productsData = await productService.getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Stats for widgets
  const stats = {
    totalProducts: products.length,
    lowStock: products.filter((p) => p.stock < 10).length,
    totalValue: products.reduce((sum, product) => sum + product.price * product.stock, 0),
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        stock: product.stock.toString(),
        imageUrl: product.imageUrl || "",
        category: product.category,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        category: "",
      });
    }
    setOpenDialog(true);
    setError("");
    setSuccess("");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name || !formData.price || !formData.stock) {
      setError("Name, price, and stock are required");
      return;
    }

    try {
      if (editingProduct) {
        const updatedProduct = await productService.updateProduct(editingProduct.id, {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          imageUrl: formData.imageUrl,
          category: formData.category,
        });

        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p)));
        setSuccess("Product updated successfully");
      } else {
        const newProduct = await productService.createProduct({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          imageUrl: formData.imageUrl,
          category: formData.category,
        });

        setProducts((prev) => [...prev, newProduct]);
        setSuccess("Product created successfully");
      }

      setTimeout(() => {
        handleCloseDialog();
        setSuccess("");
      }, 1500);
    } catch (error) {
      setError("Failed to save product");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setSuccess("Product deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError("Failed to delete product");
      }
    }
  };

  const CategorySelector = ({ formData, handleInputChange }: { formData: { category: string }; handleInputChange: (event: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement>) => void }) => {
    return (
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select autoFocus labelId="category-label" name="category" value={formData.category} onChange={handleInputChange} label="Category">
          {CATEGORIES.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      renderCell: (params) => <Box sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{params.value}</Box>,
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      renderCell: (params) => `$${params.value}`,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 100,
      renderCell: (params) => (
        <Box
          sx={{
            color: params.value < 10 ? "error.main" : "inherit",
            fontWeight: params.value < 10 ? "bold" : "normal",
          }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem icon={<Edit />} label="Edit" onClick={() => handleOpenDialog(params.row as Product)} />,
        <GridActionsCellItem icon={<Delete />} label="Delete" onClick={() => handleDelete(params.id as number)} showInMenu />,
      ],
    },
  ];

  if (user?.role !== "admin") {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mt: 2 }}>
          You don't have permission to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Stats Widgets */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Inventory sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h5" component="div">
                    {stats.totalProducts}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ShoppingCart sx={{ fontSize: 40, color: "warning.main", mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Low Stock Items
                  </Typography>
                  <Typography variant="h5" component="div">
                    {stats.lowStock}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AttachMoney sx={{ fontSize: 40, color: "success.main", mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Inventory Value
                  </Typography>
                  <Typography variant="h5" component="div">
                    ${stats.totalValue.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Products Table */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" component="h2">
            Product Management
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Add Product
          </Button>
        </Box>

        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <DataGrid
            rows={products}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          />
        </div>
      </Paper>

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField autoFocus margin="dense" name="name" label="Product Name" type="text" fullWidth variant="outlined" value={formData.name} onChange={handleInputChange} sx={{ mb: 2 }} />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.price}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            inputProps={{ step: "0.01", min: "0" }}
          />
          <TextField
            margin="dense"
            name="stock"
            label="Stock Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.stock}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            inputProps={{ min: "0" }}
          />
          <TextField margin="dense" name="imageUrl" label="Image URL" type="text" fullWidth variant="outlined" value={formData.imageUrl} onChange={handleInputChange} sx={{ mb: 2 }} />
          <CategorySelector formData={formData} handleInputChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProduct ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
