package com.nguyenduyanh.example05.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

import com.nguyenduyanh.example05.entity.Product;
import com.nguyenduyanh.example05.payloads.ProductDTO;
import com.nguyenduyanh.example05.payloads.ProductResponse;

public interface ProductService {

    ProductDTO addProduct(Long categoryId, Product product);

    ProductResponse getAllProducts(
        Integer pageNumber,
        Integer pageSize,
        String sortBy,
        String sortOrder
    );

    ProductResponse searchByCategory(
        Long categoryId,
        Integer pageNumber,
        Integer pageSize,
        String sortBy,
        String sortOrder
    );

    ProductResponse searchProductByKeyword(
        String keyword,
        Long categoryId,
        Integer pageNumber,
        Integer pageSize,
        String sortBy,
        String sortOrder

        
    );

    ProductDTO getProductById(Long productId);

    ProductDTO updateProduct(Long productId, ProductDTO productDTO);

    ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException;
    InputStream getProductImage(String fileName) throws FileNotFoundException;


    String deleteProduct(Long productId);
}

