package com.nguyenduyanh.example03.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nguyenduyanh.example03.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
}
