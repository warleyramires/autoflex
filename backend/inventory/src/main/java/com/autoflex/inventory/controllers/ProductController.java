package com.autoflex.inventory.controllers;

import com.autoflex.inventory.dtos.ProductRequestDTO;
import com.autoflex.inventory.dtos.ProductResponseDTO;
import com.autoflex.inventory.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductRequestDTO productRequestDTO){

        ProductResponseDTO created = productService.createProduct(productRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts(){
        List<ProductResponseDTO> listProducts = productService.getAllProducts();
        return ResponseEntity.status(HttpStatus.OK).body(listProducts);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ProductResponseDTO> getProductByCode(@PathVariable String code){
        ProductResponseDTO productResponseDTO = productService.getProductByCode(code);

        return ResponseEntity.status(HttpStatus.OK).body(productResponseDTO);
    }

    @PutMapping("/{code}")
    public ResponseEntity<ProductResponseDTO> updateProduct(@PathVariable String code, @Valid @RequestBody ProductRequestDTO productRequestDTO) {
        ProductResponseDTO updated = productService.updateProduct(productRequestDTO, code);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String code){
        productService.deleteProduct(code);
        return ResponseEntity.noContent().build();
    }

}
