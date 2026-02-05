package com.autoflex.inventory.controllers;

import com.autoflex.inventory.dtos.RawMaterialRequestDTO;
import com.autoflex.inventory.dtos.RawMaterialResponseDTO;
import com.autoflex.inventory.services.RawMaterialService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
public class RawMaterialController {

    private final RawMaterialService rawMaterialService;

    public RawMaterialController(RawMaterialService rawMaterialService){
        this.rawMaterialService = rawMaterialService;
    }

    @PostMapping
    public ResponseEntity<RawMaterialResponseDTO> createRawMaterial(
            @Valid @RequestBody RawMaterialRequestDTO requestDTO) {

        RawMaterialResponseDTO created = rawMaterialService.createRawMaterial(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<RawMaterialResponseDTO>> getAllRawMaterials(){
        List<RawMaterialResponseDTO> list = rawMaterialService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RawMaterialResponseDTO> getRawMaterialById(@PathVariable Long id){
        RawMaterialResponseDTO dto = rawMaterialService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<RawMaterialResponseDTO> getRawMaterialByCode(@PathVariable String code) {
        RawMaterialResponseDTO dto = rawMaterialService.findByCode(code);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    @PutMapping("/{code}")
    public ResponseEntity<RawMaterialResponseDTO> updateRawMaterial(
            @PathVariable String code,
            @Valid @RequestBody RawMaterialRequestDTO requestDTO) {

        RawMaterialResponseDTO updated = rawMaterialService.updateRawMaterial(requestDTO, code);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteRawMaterial(@PathVariable String code) {

        rawMaterialService.deleteByCode(code);
        return ResponseEntity.noContent().build();
    }
}
