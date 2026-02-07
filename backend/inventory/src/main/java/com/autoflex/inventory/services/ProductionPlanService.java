package com.autoflex.inventory.services;

import com.autoflex.inventory.dtos.ProductionItemResponseDTO;
import com.autoflex.inventory.dtos.ProductionPlanResponseDTO;
import com.autoflex.inventory.entities.Product;
import com.autoflex.inventory.entities.ProductRawMaterial;
import com.autoflex.inventory.entities.RawMaterial;
import com.autoflex.inventory.repositories.ProductRepository;
import com.autoflex.inventory.repositories.RawMaterialRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductionPlanService {

    private final ProductRepository productRepository;
    private final RawMaterialRepository rawMaterialRepository;

    public ProductionPlanService(ProductRepository productRepository, RawMaterialRepository rawMaterialRepository){
        this.productRepository = productRepository;
        this.rawMaterialRepository = rawMaterialRepository;
    }

    public ProductionPlanResponseDTO generateProductionPlan() {

        List<Product> products = productRepository.findAll();
        products.sort((p1, p2) -> p2.getPrice().compareTo(p1.getPrice()));

        Map<Long, BigDecimal> stockMap = new HashMap<>();
        List<RawMaterial> rawMaterials = rawMaterialRepository.findAll();

        for (RawMaterial rm : rawMaterials) {
            stockMap.put(rm.getId(), rm.getStockQuantity());
        }

        List<ProductionItemResponseDTO> items = new ArrayList<>();
        BigDecimal grandTotal = BigDecimal.ZERO;

        for (Product product : products) {

            List<ProductRawMaterial> requirements = product.getRawMaterials();

            if (requirements == null || requirements.isEmpty()) {
                continue;
            }

            int maxPossible = Integer.MAX_VALUE;

            for (ProductRawMaterial req : requirements) {
                Long rawMaterialId = req.getRawMaterial().getId();
                BigDecimal stockAvailable = stockMap.getOrDefault(rawMaterialId, BigDecimal.ZERO);

                BigDecimal requiredQty = req.getQuantityRequired();

                if (requiredQty == null || requiredQty.compareTo(BigDecimal.ZERO) <= 0) {
                    continue;
                }

                int possibleForThisMaterial = stockAvailable
                        .divide(requiredQty, 0, RoundingMode.DOWN)
                        .intValue();

                maxPossible = Math.min(maxPossible, possibleForThisMaterial);
            }

            if (maxPossible <= 0 || maxPossible == Integer.MAX_VALUE) {
                continue;
            }

            for (ProductRawMaterial req : requirements) {
                Long rawMaterialId = req.getRawMaterial().getId();
                BigDecimal requiredQty = req.getQuantityRequired();
                BigDecimal stockAvailable = stockMap.getOrDefault(rawMaterialId, BigDecimal.ZERO);
                BigDecimal totalConsumption = requiredQty.multiply(BigDecimal.valueOf(maxPossible));
                BigDecimal newStock = stockAvailable.subtract(totalConsumption);

                stockMap.put(rawMaterialId, newStock);
            }

            BigDecimal totalValue = product.getPrice()
                    .multiply(BigDecimal.valueOf(maxPossible));

            grandTotal = grandTotal.add(totalValue);

            items.add(new ProductionItemResponseDTO(
                    product.getId(),
                    product.getCode(),
                    product.getName(),
                    maxPossible,
                    product.getPrice(),
                    totalValue
            ));
        }
        return new ProductionPlanResponseDTO(items, grandTotal);
    }

}
