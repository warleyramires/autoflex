package com.autoflex.inventory.dtos;

import java.math.BigDecimal;

public record ProductionItemResponseDTO(
        Long productId,
        String productCode,
        String productName,
        Integer quantityProssible,
        BigDecimal unitValue,
        BigDecimal totalValue
) {
}
