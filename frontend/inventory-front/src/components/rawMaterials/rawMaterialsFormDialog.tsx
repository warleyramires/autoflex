import { useEffect, useState } from "react";
import type { CreateRawMaterialDTO, UpdateRawMaterialDTO } from "../../types/rawMaterialDTO";
import type { RawMaterial } from "../../types/rawMaterial";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateRawMaterialDTO | UpdateRawMaterialDTO) => Promise<void>;
    initialData?: RawMaterial | null;
  };

export function RawMaterialFormDialog({ open, onClose, onSubmit, initialData }: Props) {

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [stockQuantity, setStockQuantity] = useState<number>(0);

    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const isEditMode = !!initialData;

    useEffect(() => {
        if (open) {
            if (initialData) {
                // Preencher campos com dados existentes (modo edição)
                setCode(initialData.code);
                setName(initialData.name);
                setStockQuantity(initialData.stockQuantity);
            } else {
                // Limpar campos (modo criação)
                setCode("");
                setName("");
                setStockQuantity(0);
            }
            setError(null);
            setSaving(false);
        }
    }, [open, initialData])

    async function handleSubmit() {
        setError(null);

        if (!code.trim() || !name.trim()) {
            setError("Code and Name are required")
            return;
        }
        if (stockQuantity <= 0) {
            setError("Stock quantity cannot be negativa or zero");
            return;
        }

        try {
            setSaving(true);

            await onSubmit({
                code: code.trim(),
                name: name.trim(),
                stockQuantity,
            })

            onClose();
        } catch (err: any) {
            setError(err?.response?.data || `Error ${isEditMode ? "updating" : "creating"} raw material`);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditMode ? "Edit Raw Material" : "New Raw Material"}</DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ marginTop: 2 }}>
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
                        label="Quantity"
                        type="number"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(Number(e.target.value))}
                        fullWidth
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ padding: 2 }}>
                <Button onClick={onClose} disabled={saving}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    )


}