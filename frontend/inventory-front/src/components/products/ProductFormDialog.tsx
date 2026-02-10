import { useEffect, useState } from "react";
import { useRawMaterials } from "../../hooks/rawMaterials/useRawMaterials";
import type{ ProductRequestDTO, ProductResponseDTO } from "../../types/productDTO";
import { 
    Dialog,
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Stack, 
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Typography,
    Box,
    Divider,
    Button

} from "@mui/material";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
 

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ProductRequestDTO) => Promise<void>;
    initialData?: ProductResponseDTO | null;
};

type RawMaterialItem = {
    rawMaterialCode: string;
    quantity: number;
};

export function ProductFormDialog({open, onClose, onSubmit, initialData}: Props){

    const { rawMaterials} = useRawMaterials();

    const[code, setCode] = useState<string>("");
    const[name, setName] = useState<string>("");
    const[price, setPrice] = useState<number>(0);
    const[rawMaterialItems, setRawMaterialItems] = useState<RawMaterialItem[]>([]);

    const [error, setError] = useState<string | null>(null);
    const[saving, setSaving] = useState(false);

    const isEditMode = !!initialData;

    useEffect(()=> {
        if(open){
            if(initialData){
                setCode(initialData.code);
                setName(initialData.name);
                setPrice(initialData.price);
                setRawMaterialItems(
                    initialData.rawMaterials.map((rm) => ({
                        rawMaterialCode: rm.code,
                        quantity: rm.quantity,
                    }))
                );
            } else {
                setCode("");
                setName("");
                setPrice(0);
                setRawMaterialItems([]);
            }
            setError(null);
            setSaving(false);
        }
    }, [open, initialData]);

    function handleAddRawMaterial() {
        setRawMaterialItems([...rawMaterialItems, { rawMaterialCode: "", quantity: 0 }]);
    }

    function handleRemoveRawMaterial(index: number) {
        setRawMaterialItems(rawMaterialItems.filter((_, i) => i !== index));
    }

    function handleRawMaterialChange(index: number, field: "rawMaterialCode" | "quantity", value: string | number) {
        const updated = [...rawMaterialItems];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setRawMaterialItems(updated);
    }

    async function handleSubmit() {
        setError(null);

        if (!code.trim() || !name.trim()) {
            setError("Code and Name are required");
            return;
        }

        if (price <= 0) {
            setError("Price must be greater than zero");
            return;
        }

        if (rawMaterialItems.length === 0) {
            setError("At least one raw material is required");
            return;
        }

        for (const item of rawMaterialItems) {
            if (!item.rawMaterialCode.trim()) {
                setError("All raw materials must have a code selected");
                return;
            }
            if (item.quantity <= 0) {
                setError("All raw materials must have a quantity greater than zero");
                return;
            }
        }

        try {
            setSaving(true);

            await onSubmit({
                code: code.trim(),
                name: name.trim(),
                price,
                rawMaterials: rawMaterialItems.map((item) => ({
                    rawMaterialCode: item.rawMaterialCode,
                    quantity: item.quantity,
                })),
            });

            onClose();
        } catch (err: any) {
            setError(err?.response?.data || `Error ${isEditMode ? "updating" : "creating"} product`);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{isEditMode ? "Edit Product" : "New Product"}</DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ marginTop: 2 }}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        label="Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={isEditMode}
                        fullWidth
                    />

                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        fullWidth
                        inputProps={{ step: "0.01", min: "0" }}
                    />

                    <Divider />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6">Raw Materials</Typography>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={handleAddRawMaterial}
                            variant="outlined"
                            size="small"
                        >
                            Add Raw Material
                        </Button>
                    </Box>

                    {rawMaterialItems.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                            No raw materials added. Click "Add Raw Material" to add one.
                        </Typography>
                    )}

                    {rawMaterialItems.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                gap: 2,
                                alignItems: "flex-start",
                                padding: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1,
                            }}
                        >
                            <FormControl fullWidth>
                                <InputLabel>Raw Material</InputLabel>
                                <Select
                                    value={item.rawMaterialCode}
                                    label="Raw Material"
                                    onChange={(e) =>
                                        handleRawMaterialChange(index, "rawMaterialCode", e.target.value)
                                    }
                                >
                                    {rawMaterials.map((rm) => (
                                        <MenuItem key={rm.code} value={rm.code}>
                                            {rm.code} - {rm.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Quantity"
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                    handleRawMaterialChange(index, "quantity", Number(e.target.value))
                                }
                                sx={{ minWidth: 150 }}
                                inputProps={{ step: "0.01", min: "0" }}
                            />

                            <IconButton
                                color="error"
                                onClick={() => handleRemoveRawMaterial(index)}
                                disabled={rawMaterialItems.length === 1}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ padding: 2 }}>
                <Button onClick={onClose} disabled={saving}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );

}