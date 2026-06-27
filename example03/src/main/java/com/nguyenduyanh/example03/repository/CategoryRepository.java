package com.nguyenduyanh.example03.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nguyenduyanh.example03.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    
}
