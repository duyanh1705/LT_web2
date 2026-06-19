package com.nguyenduyanh.example02.controller;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.nguyenduyanh.example02.entity.Product;
import com.nguyenduyanh.example02.service.ProductService;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@AllArgsConstructor
@RequestMapping("api/products")
public class ProductController {
    private ProductService productService;
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product Product){
        Product savedProduct = productService.createProduct(Product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }
    @GetMapping("{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") Long ProductId){
        Product Product = productService.getProductById(ProductId);
        return new ResponseEntity<>(Product, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(){
        List<Product> Products= productService.getAllProducts();
        return new ResponseEntity<>(Products, HttpStatus.OK);
    }
    @PutMapping("{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable("id") Long ProductId,@RequestBody Product Product){
        Product.setId(ProductId);
        Product updatedProduct = productService.updateProduct(Product);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") Long ProductId){
        productService.deleteProduct(ProductId);
        return new ResponseEntity<>("Product successfully deleted!", HttpStatus.OK);
    }
}
