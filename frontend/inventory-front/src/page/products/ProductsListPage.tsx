import Typography from "@mui/material/Typography";
import { useProducts } from "../../hooks/products/useProducts";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";

import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Chip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import type { ProductResponseDTO } from "../../types/productDTO";
import { useState } from "react";
import type { ProductRequestDTO } from "../../types/productDTO";

import { ProductFormDialog } from "../../components/products/ProductFormDialog";

export function ProductsListPage() {
  const {
    products,
    loading,
    error,
    addProduct,
    removeProduct,
    editProduct,
    loadProductByCode,
    loadProducts,
  } = useProducts();

  const [openDialog, setOpenDialog] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProductCode, setSelectedProductCode] = useState<string | null>(null);

  const [searchType, setSearchType] = useState<"code">("code");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<ProductResponseDTO | null>(null);

  const [productToEdit, setProductToEdit] = useState<ProductResponseDTO | null>(null);

  async function handleCreateProduct(data: ProductRequestDTO) {
    await addProduct(data);
  }

  async function handleUpdateProduct(data: ProductRequestDTO) {
    if (!productToEdit) return;

    await editProduct(productToEdit.code, data);
    setProductToEdit(null);
  }

  async function handleSearch() {
    try {
      if (!searchValue.trim()) return;

      const result = await loadProductByCode(searchValue.trim());
      setSearchResult(result);
    } catch (err) {
      setSearchResult(null);
    }
  }

  function handleClearSearch() {
    setSearchValue("");
    setSearchResult(null);
    loadProducts();
  }

  function handleOpenDeleteDialog(code: string) {
    setSelectedProductCode(code);
    setOpenDeleteDialog(true);
  }

  function handleCloseDeleteDialog() {
    setOpenDeleteDialog(false);
    setSelectedProductCode(null);
  }

  async function handleConfirmDelete() {
    if (!selectedProductCode) return;

    try {
      await removeProduct(selectedProductCode);
      handleCloseDeleteDialog();
    } catch (err: any) {
      alert(err?.response?.data || "Error deleting product.");
    }
  }

  function handleOpenEditDialog(product: ProductResponseDTO) {
    setProductToEdit(product);
  }

  function handleCloseEditDialog() {
    setProductToEdit(null);
  }

  const listToShow = searchResult ? [searchResult] : products;

  function formatPrice(price: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Products
        </Typography>

        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          New Product
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <TextField
          label="Enter Code"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          fullWidth
        />

        <Button variant="outlined" onClick={handleSearch}>
          Search
        </Button>

        <Button variant="text" onClick={handleClearSearch}>
          Clear
        </Button>
      </Box>

      {/* TABLE */}
      <Paper sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>ID</b>
              </TableCell>
              <TableCell>
                <b>Code</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Price</b>
              </TableCell>
              <TableCell>
                <b>Raw Materials</b>
              </TableCell>
              <TableCell align="right">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}

            {error && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              listToShow.map((product: ProductResponseDTO) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {product.rawMaterials.map((rm, index) => (
                        <Chip
                          key={index}
                          label={`${rm.code} (${rm.quantity}kg)`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenEditDialog(product)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(product.code)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {!loading && !error && listToShow.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <ProductFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleCreateProduct}
      />

      <ProductFormDialog
        open={!!productToEdit}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdateProduct}
        initialData={productToEdit}
      />

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Product</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}