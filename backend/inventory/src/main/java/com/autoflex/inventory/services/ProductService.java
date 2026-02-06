package com.autoflex.inventory.services;

import com.autoflex.inventory.dtos.ProductRawMaterialResponseDTO;
import com.autoflex.inventory.dtos.ProductRequestDTO;
import com.autoflex.inventory.dtos.ProductResponseDTO;
import com.autoflex.inventory.dtos.ProductRawMaterialRequestDTO;
import com.autoflex.inventory.entities.Product;
import com.autoflex.inventory.entities.ProductRawMaterial;
import com.autoflex.inventory.entities.RawMaterial;
import com.autoflex.inventory.repositories.ProductRawMaterialRepository;
import com.autoflex.inventory.repositories.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private ProductRepository productRepository;
    private RawMaterialService rawMaterialService;
    private ProductRawMaterialRepository productRawMaterialRepository;

    public ProductService(ProductRepository productRepository, RawMaterialService rawMaterialService, ProductRawMaterialRepository productRawMaterialRepository) {
        this.productRepository = productRepository;
        this.rawMaterialService = rawMaterialService;
        this.productRawMaterialRepository = productRawMaterialRepository;
    }

    public ProductResponseDTO createProduct(ProductRequestDTO requestDTO) {

        if (productRepository.existsByCode(requestDTO.code())) {
            throw new RuntimeException("Product with code " + requestDTO.code() + " already exists.");
        }

        List<ProductRawMaterial> productRawMaterials = requestDTO.rawMaterials().stream()
                .map(rmDto -> {
                    RawMaterial rawMaterial = rawMaterialService.findEntityByCode(rmDto.rawMaterialCode());

                    return ProductRawMaterial.builder()
                            .rawMaterial(rawMaterial)
                            .quantityRequired(BigDecimal.valueOf(rmDto.quantity()))
                            .build();
                })
                .collect(Collectors.toList());

        Product product = Product.builder()
                .code(requestDTO.code())
                .name(requestDTO.name())
                .price(requestDTO.price())
                .rawMaterials(productRawMaterials)
                .build();

        productRawMaterials.forEach(prm -> prm.setProduct(product));

        Product savedProduct = productRepository.save(product);

        List<ProductRawMaterialResponseDTO> rawMaterialResponses = savedProduct.getRawMaterials().stream()
                .map(prm -> new ProductRawMaterialResponseDTO(
                        prm.getRawMaterial().getCode(),
                        prm.getRawMaterial().getName(),
                        prm.getQuantityRequired()
                ))
                .collect(Collectors.toList());

        return new ProductResponseDTO(
                savedProduct.getId(),
                savedProduct.getCode(),
                savedProduct.getName(),
                savedProduct.getPrice(),
                rawMaterialResponses
        );
    }

    public List<ProductResponseDTO> getAllProducts(){

        List<Product> productsList = productRepository.findAll();

        return productsList.stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public ProductResponseDTO getProductByCode(String code) {
        Product product = productRepository.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with code: " + code));

        return mapToResponseDTO(product);
    }

    @Transactional
    public ProductResponseDTO updateProduct(ProductRequestDTO requestDTO, String code) {

        Product product = productRepository.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with code: " + code));

        product.setCode(requestDTO.code());
        product.setName(requestDTO.name());
        product.setPrice(requestDTO.price());

        productRawMaterialRepository.deleteByProductId(product.getId());

        product.getRawMaterials().clear();

        List<ProductRawMaterial> updatedRawMaterials = requestDTO.rawMaterials().stream()
                .map(rmDto -> {
                    RawMaterial rawMaterial = rawMaterialService.findEntityByCode(rmDto.rawMaterialCode());

                    return ProductRawMaterial.builder()
                            .product(product)
                            .rawMaterial(rawMaterial)
                            .quantityRequired(BigDecimal.valueOf(rmDto.quantity()))
                            .build();
                })
                .toList();

        product.getRawMaterials().addAll(updatedRawMaterials);

        Product updatedProduct = productRepository.save(product);

        return mapToResponseDTO(updatedProduct);
    }

    public void deleteProduct(String code) {

        Product product = productRepository.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with code: " + code));

        productRepository.delete(product);
    }


    private ProductResponseDTO mapToResponseDTO(Product product){

        List<ProductRawMaterialResponseDTO> rawMaterials = product.getRawMaterials()
                .stream().map(prm -> new ProductRawMaterialResponseDTO(
                        prm.getRawMaterial().getCode(),
                        prm.getRawMaterial().getName(),
                        prm.getQuantityRequired()
                )).toList();

        return new ProductResponseDTO(
                product.getId(),
                product.getCode(),
                product.getName(),
                product.getPrice(),
                rawMaterials
        );
    }
}
