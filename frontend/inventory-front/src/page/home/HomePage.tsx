import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import ProductionIcon from "@mui/icons-material/PrecisionManufacturing";

export function HomePage() {
    const navigate = useNavigate();

    const menuCards = [
        {
            title: "Raw Materials",
            description: "Manage raw materials inventory",
            icon: <InventoryIcon sx={{ fontSize: 60 }} />,
            path: "/raw-materials",
            color: "#1976d2",
        },
        {
            title: "Products",
            description: "Manage products and their raw materials",
            icon: <CategoryIcon sx={{ fontSize: 60 }} />,
            path: "/products",
            color: "#2e7d32",
        },
        {
            title: "Production Plan",
            description: "View production plan based on available stock",
            icon: <ProductionIcon sx={{ fontSize: 60 }} />,
            path: "/production",
            color: "#ed6c02",
        },
    ];

    return (
        <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
                Welcome to Inventory System
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ marginBottom: 4 }}>
                Manage your inventory, products, and production planning
            </Typography>

            <Grid container spacing={3}>
                {menuCards.map((card) => (
                    <Grid item xs={12} sm={6} md={4} key={card.title}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: 6,
                                },
                            }}
                            onClick={() => navigate(card.path)}
                        >
                            <CardContent
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    textAlign: "center",
                                    padding: 4,
                                }}
                            >
                                <Box sx={{ color: card.color, marginBottom: 2 }}>
                                    {card.icon}
                                </Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                                    {card.description}
                                </Typography>
                                <Button variant="contained" sx={{ marginTop: "auto" }}>
                                    Go to {card.title}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

