package com.autoflex.inventory.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequestDTO(

        @NotBlank
        String code,

        @NotBlank
        String name,

        @NotNull
        BigDecimal price,

        @NotNull
        List<ProductRawMaterialRequestDTO> rawMaterials
) {
}
