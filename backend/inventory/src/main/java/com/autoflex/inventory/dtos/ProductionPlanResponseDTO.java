package com.autoflex.inventory.dtos;

import java.math.BigDecimal;
import java.util.List;

public record ProductionPlanResponseDTO(
        List<ProductionItemResponseDTO> items,
        BigDecimal grandTotalValue
) {
}
