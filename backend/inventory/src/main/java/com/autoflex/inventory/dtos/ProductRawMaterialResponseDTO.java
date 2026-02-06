package com.autoflex.inventory.dtos;

public record ProductRawMaterialResponseDTO(
        String code,
        String name,
        java.math.BigDecimal quantity
) {
}
