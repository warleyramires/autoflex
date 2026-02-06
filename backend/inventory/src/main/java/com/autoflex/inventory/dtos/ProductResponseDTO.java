package com.autoflex.inventory.dtos;

import java.math.BigDecimal;
import java.util.List;

public record ProductResponseDTO(
        Long id,
        String code,
        String name,
        BigDecimal price,
        List<ProductRawMaterialResponseDTO> rawMaterials
) { }
