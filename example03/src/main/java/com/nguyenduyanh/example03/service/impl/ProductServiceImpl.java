package com.nguyenduyanh.example03.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import com.nguyenduyanh.example03.entity.Product;
import com.nguyenduyanh.example03.service.ProductService;
import com.nguyenduyanh.example03.repository.ProductRepository;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {
    private ProductRepository productRepository;
    
}
