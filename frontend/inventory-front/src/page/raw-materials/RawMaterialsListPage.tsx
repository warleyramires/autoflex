import Typography from "@mui/material/Typography";
import { useRawMaterials } from "../../hooks/rawMaterials/useRawMaterials";
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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import type { RawMaterial } from "../../types/rawMaterial";
import { useState } from "react";
import type {
  CreateRawMaterialDTO,
  UpdateRawMaterialDTO,
} from "../../types/rawMaterialDTO";

import { RawMaterialFormDialog } from "../../components/rawMaterials/rawMaterialsFormDialog";

export function RawMaterialListPage() {
  const {
    rawMaterials,
    loading,
    error,
    addRawMaterial,
    removeRawMaterial,
    editRawMaterial,
    loadRawMaterialByCode,
    loadRawMaterialById,
    loadRawMaterials,
  } = useRawMaterials();

  const [openDialog, setOpenDialog] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRawMaterialCode, setSelectedRawMaterialCode] = useState<string | null>(null);

  const [searchType, setSearchType] = useState<"id" | "code">("code");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<RawMaterial | null>(null);

  const [rawMaterialToEdit, setRawMaterialToEdit] = useState<RawMaterial | null>(null);

  async function handleCreateRawMaterial(data: CreateRawMaterialDTO) {
    await addRawMaterial(data);
  }

  async function handleUpdateRawMaterial(data: UpdateRawMaterialDTO) {
    if (!rawMaterialToEdit) return;

    await editRawMaterial(rawMaterialToEdit.code, data);
    setRawMaterialToEdit(null);
  }

  async function handleSearch() {
    try {
      if (!searchValue.trim()) return;

      if (searchType === "code") {
        const result = await loadRawMaterialByCode(searchValue.trim());
        setSearchResult(result);
      }

      if (searchType === "id") {
        const id = Number(searchValue);
        if (isNaN(id)) return;

        const result = await loadRawMaterialById(id);
        setSearchResult(result);
      }
    } catch (err) {
      setSearchResult(null);
    }
  }

  function handleClearSearch() {
    setSearchValue("");
    setSearchResult(null);
    loadRawMaterials();
  }

  function handleOpenDeleteDialog(code: string) {
    setSelectedRawMaterialCode(code);
    setOpenDeleteDialog(true);
  }

  function handleCloseDeleteDialog() {
    setOpenDeleteDialog(false);
    setSelectedRawMaterialCode(null);
  }

  async function handleConfirmDelete() {
    if (!selectedRawMaterialCode) return;

    try {
      await removeRawMaterial(selectedRawMaterialCode);
      handleCloseDeleteDialog();
    } catch (err: any) {
      alert(err?.response?.data || "Error deleting raw material.");
    }
  }

  function handleOpenEditDialog(rm: RawMaterial) {
    setRawMaterialToEdit(rm);
  }

  function handleCloseEditDialog() {
    setRawMaterialToEdit(null);
  }

  const listToShow = searchResult ? [searchResult] : rawMaterials;

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Raw Materials
        </Typography>

        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          New Raw Material
        </Button>
      </Box>

      {/* SEARCH */}
      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Search By</InputLabel>

          <Select
            value={searchType}
            label="Search By"
            onChange={(e) => setSearchType(e.target.value as "id" | "code")}
          >
            <MenuItem value="code">Code</MenuItem>
            <MenuItem value="id">ID</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label={searchType === "id" ? "Enter ID" : "Enter Code"}
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
                <b>Stock(Kg)</b>
              </TableCell>
              <TableCell align="right">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}

            {error && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              listToShow.map((rm: RawMaterial) => (
                <TableRow key={rm.id}>
                  <TableCell>{rm.id}</TableCell>
                  <TableCell>{rm.code}</TableCell>
                  <TableCell>{rm.name}</TableCell>
                  <TableCell>{rm.stockQuantity}</TableCell>

                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenEditDialog(rm)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(rm.code)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {!loading && !error && listToShow.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No raw materials found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* CREATE DIALOG */}
      <RawMaterialFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleCreateRawMaterial}
      />

      {/* EDIT DIALOG */}
      <RawMaterialFormDialog
        open={!!rawMaterialToEdit}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdateRawMaterial}
        initialData={rawMaterialToEdit}
      />

      {/* DELETE DIALOG */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Raw Material</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this raw material? This action cannot
            be undone.
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