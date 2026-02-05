package com.autoflex.inventory.dtos;

public record RawMaterialResponseDTO(
        Long id,
        String code,
        String name,
        java.math.BigDecimal stockQuantity
) {
}
