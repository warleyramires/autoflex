package com.autoflex.inventory.controllers;

import com.autoflex.inventory.dtos.ProductionPlanResponseDTO;
import com.autoflex.inventory.services.ProductionPlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/production")
public class ProductionPlanController {

    private final ProductionPlanService productionPlanService;

    public ProductionPlanController(ProductionPlanService productionPlanService){
        this.productionPlanService = productionPlanService;
    }

    @GetMapping
    public ResponseEntity<ProductionPlanResponseDTO> generateProductionPlan() {
        ProductionPlanResponseDTO response = productionPlanService.generateProductionPlan();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
