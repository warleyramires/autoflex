package com.autoflex.inventory.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductRawMaterialRequestDTO(

        @NotBlank
        String rawMaterialCode,

        @NotNull
        Double quantity
) {
}
