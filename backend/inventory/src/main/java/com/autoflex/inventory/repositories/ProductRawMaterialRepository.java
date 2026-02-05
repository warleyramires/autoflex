package com.autoflex.inventory.repositories;

import com.autoflex.inventory.entities.ProductRawMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRawMaterialRepository extends JpaRepository<ProductRawMaterial, Long> {

    List<ProductRawMaterial> findByProductId(Long productId);

    Optional<ProductRawMaterial> findByProductIdAndRawMaterialCode(Long productId, Long rawMaterialCode);

    boolean existsByProductIdAndRawMaterialCode(Long productId, Long rawMaterialCode);
}
