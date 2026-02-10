import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { getProductionPlan } from "../../api/productApi";
import type { ProductionPlanResponseDTO, ProductionItemResponseDTO } from "../../types/product"

export function ProductionPlanPage() {
    const [plan, setPlan] = useState<ProductionPlanResponseDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    async function loadProductionPlan() {
        try {
            setLoading(true);
            setError(null);

            const data = await getProductionPlan();
            setPlan(data);
        } catch (err: any) {
            setError(err?.response?.data || "Error loading production plan");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProductionPlan();
    }, []);

    function formatPrice(price: number): string {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    }

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
                    Production Plan
                </Typography>

                <Button variant="contained" onClick={loadProductionPlan}>
                    Refresh
                </Button>
            </Box>

            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && plan && (
                <>
                    <Paper sx={{ marginTop: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <b>Product Code</b>
                                    </TableCell>
                                    <TableCell>
                                        <b>Product Name</b>
                                    </TableCell>
                                    <TableCell align="right">
                                        <b>Quantity Possible</b>
                                    </TableCell>
                                    <TableCell align="right">
                                        <b>Unit Value</b>
                                    </TableCell>
                                    <TableCell align="right">
                                        <b>Total Value</b>
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {plan.items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No products can be produced with current stock.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    plan.items.map((item: ProductionItemResponseDTO) => (
                                        <TableRow key={item.productId}>
                                            <TableCell>{item.productCode}</TableCell>
                                            <TableCell>{item.productName}</TableCell>
                                            <TableCell align="right">{item.quantityProssible}</TableCell>
                                            <TableCell align="right">
                                                {formatPrice(item.unitValue)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatPrice(item.totalValue)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Paper>

                    {plan.items.length > 0 && (
                        <Box
                            sx={{
                                marginTop: 3,
                                padding: 2,
                                backgroundColor: "primary.light",
                                borderRadius: 1,
                                textAlign: "right",
                            }}
                        >
                            <Typography variant="h5" fontWeight="bold" color="primary.contrastText">
                                Grand Total: {formatPrice(plan.grandTotalValue)}
                            </Typography>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}