package com.autoflex.inventory.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "product_raw_materials",
        uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "raw_material_id"})
        )
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRawMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "raw_material_id")
    private RawMaterial rawMaterial;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantityRequired;
}
