package com.autoflex.inventory.services;

import com.autoflex.inventory.dtos.RawMaterialRequestDTO;
import com.autoflex.inventory.dtos.RawMaterialResponseDTO;
import com.autoflex.inventory.entities.RawMaterial;
import com.autoflex.inventory.repositories.RawMaterialRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class RawMaterialService {

    private final RawMaterialRepository rawMaterialRepository;

    public RawMaterialService(RawMaterialRepository rawMaterialRepository) {
        this.rawMaterialRepository = rawMaterialRepository;
    }


    public RawMaterialResponseDTO createRawMaterial(RawMaterialRequestDTO dto) {

        if (rawMaterialRepository.existsByCode(dto.code())) {
            throw new IllegalArgumentException("Raw material code already exists: " + dto.code());
        }

        RawMaterial rawMaterial = toEntity(dto);
        RawMaterial saved = rawMaterialRepository.save(rawMaterial);

        return toResponseDTO(saved);
    }

    public RawMaterialResponseDTO findById(Long id){

        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        RawMaterial rawMaterial = rawMaterialRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Raw material not found with id: " + id));

        return toResponseDTO(rawMaterial);

    }

    public RawMaterialResponseDTO findByCode(String code){

        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code cannot be null or blank");
        }

        RawMaterial rawMaterial = rawMaterialRepository.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Raw material not found with code: " + code));

        return new RawMaterialResponseDTO(rawMaterial.getId(), rawMaterial.getCode(), rawMaterial.getName(), rawMaterial.getStockQuantity());
    }

    public List<RawMaterialResponseDTO> findAll(){
        return rawMaterialRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public RawMaterialResponseDTO updateRawMaterial(RawMaterialRequestDTO dto, String code ){

        if(code == null || code.isBlank()){
            throw new IllegalArgumentException("Code cannot be null or blank");
        }
        RawMaterial existing = rawMaterialRepository.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Raw material not found with code: " + code));

        existing.setName(dto.name());
        existing.setStockQuantity(BigDecimal.valueOf(dto.stockQuantity()));

        return toResponseDTO(rawMaterialRepository.save(existing));

    }

    public void deleteByCode(String code){
        if(code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code cannot be null or blank");
        }

        RawMaterial existingRawMaterial = rawMaterialRepository.findByCode(code)
            .orElseThrow(
                ()-> new EntityNotFoundException("Raw material not found with code: " + code));

        rawMaterialRepository.delete(existingRawMaterial);
    }

    private RawMaterialResponseDTO toResponseDTO(RawMaterial rawMaterial){
        return new RawMaterialResponseDTO(
                rawMaterial.getId(),
                rawMaterial.getCode(),
                rawMaterial.getName(),
                rawMaterial.getStockQuantity()
        );
    }

    private RawMaterial toEntity(RawMaterialRequestDTO dto) {
        RawMaterial rawMaterial = new RawMaterial();
        rawMaterial.setCode(dto.code());
        rawMaterial.setName(dto.name());
        rawMaterial.setStockQuantity(BigDecimal.valueOf(dto.stockQuantity()));
        return rawMaterial;
    }

}
