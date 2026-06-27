package com.nguyenduyanh.example03.controller;

import com.nguyenduyanh.example03.entity.Product;
import com.nguyenduyanh.example03.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        
        Product savedProduct = productRepository.save(product);
        
        
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }
}