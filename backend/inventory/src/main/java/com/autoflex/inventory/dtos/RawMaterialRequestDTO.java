package com.autoflex.inventory.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record RawMaterialRequestDTO(

        @NotBlank
        String code,

        @NotBlank
        String name,

        @NotNull
        @Positive
        Double stockQuantity
) {
}
