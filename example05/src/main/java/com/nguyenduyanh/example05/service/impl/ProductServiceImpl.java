package com.nguyenduyanh.example05.service.impl;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nguyenduyanh.example05.entity.Cart;
import com.nguyenduyanh.example05.entity.Category;
import com.nguyenduyanh.example05.entity.Product;
import com.nguyenduyanh.example05.exceptions.APIException;
import com.nguyenduyanh.example05.exceptions.ResourceNotFoundException;
import com.nguyenduyanh.example05.payloads.CartDTO;
import com.nguyenduyanh.example05.payloads.ProductDTO;
import com.nguyenduyanh.example05.payloads.ProductResponse;
import com.nguyenduyanh.example05.repository.CartRepo;
import com.nguyenduyanh.example05.repository.CategoryRepo;
import com.nguyenduyanh.example05.repository.ProductRepo;
import com.nguyenduyanh.example05.service.CartService;
import com.nguyenduyanh.example05.service.FileService;
import com.nguyenduyanh.example05.service.ProductService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private CategoryRepo categoryRepo;
    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private CartService cartService;
    @Autowired
    private FileService fileService;
    @Autowired
    private ModelMapper modelMapper;
    @Value("${project.image}")
    private String path;

    @Override
    public ProductDTO addProduct(Long categoryId, Product product) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));
        boolean isProductNotPresent = true;
        List<Product> products = category.getProducts();
        for (int i = 0; i < products.size(); i++) {
            if (products.get(i).getProductName().equals(product.getProductName())
                    && products.get(i).getDescription().equals(product.getDescription())) {
                isProductNotPresent = false;
                break;
            }
        }
        if (isProductNotPresent) {
            product.setImage("default.png");
            product.setCategory(category);
            double specialPrice = product.getPrice() - (product.getDiscount() * 0.01) * product.getPrice();
            product.setSpecialPrice(specialPrice);
            Product savedProduct = productRepo.save(product);
            return mapToDTOWithImage(savedProduct);
        } else {
            throw new APIException("Product already exists !!!");
        }
    }

    @Override
    public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts = productRepo.findAll(pageDetails);
        List<Product> products = pageProducts.getContent();

        List<ProductDTO> productDTOs = products.stream()
                .map(this::mapToDTOWithImage)
                .collect(Collectors.toList());

        ProductResponse productResponse = new ProductResponse();

        productResponse.setContent(productDTOs);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());
        return productResponse;
    }

    @Override
    public ProductDTO getProductById(Long productId) {
        Optional<Product> productOptional = productRepo.findById(productId);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            return mapToDTOWithImage(product);
        } else {
            throw new ResourceNotFoundException("Product", "productId", productId);
        }
    }

    @Override
    public ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy,
            String sortOrder) {
        // Category category = categoryRepo.findById(categoryId).orElseThrow(() -> new
        // ResourceNotFoundException("Category", "categoryId", categoryId));
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts = productRepo.findByCategoryCategoryId(categoryId, pageDetails);
        List<Product> products = pageProducts.getContent();

        // if(products.size() == 0) {
        // throw new APIException(category.getCategoryName() + " category doesn't
        // contain any products !!!");
        // }

        List<ProductDTO> productDTOs = products.stream()
                .map(this::mapToDTOWithImage)
                .collect(Collectors.toList());

        ProductResponse productResponse = new ProductResponse();

        productResponse.setContent(productDTOs);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());
        return productResponse;
    }

    @Override
    public ProductResponse searchProductByKeyword(String keyword, Long categoryId, Integer pageNumber, Integer pageSize,
            String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts = productRepo.findByProductNameLike("%" + keyword + "%", pageDetails);
        List<Product> products = pageProducts.getContent();
        // if(products.size() ==0){
        // throw new APIException("No products found with keyword: " + keyword);
        // }
        if (categoryId != 0 && categoryId != null) {
            products = products.stream().filter(product -> {
                if (product.getCategory() != null && product.getCategory().getCategoryId() != null) {
                    Long productCategoryId = product.getCategory().getCategoryId();
                    return productCategoryId == categoryId;
                }
                return false;
            })
                    .collect(Collectors.toList());
        }

        List<ProductDTO> productDTOs = products.stream()
                .map(this::mapToDTOWithImage)
                .collect(Collectors.toList());

        ProductResponse productResponse = new ProductResponse();

        productResponse.setContent(productDTOs);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements((long) products.size());
        productResponse.setTotalPages((int) Math.ceil((double) products.size() / pageSize));
        productResponse.setLastPage(pageProducts.isLast());
        return productResponse;
    }

    @Override
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        Product productFromDB = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        if (productFromDB == null) {
            throw new APIException("Product not found with productId: " + productId);
        }
        Product product =modelMapper.map(productDTO, Product.class);

        productFromDB.setProductName(productDTO.getProductName());
        productFromDB.setDescription(productDTO.getDescription());
        productFromDB.setPrice(productDTO.getPrice());
        productFromDB.setDiscount(productDTO.getDiscount());
        productFromDB.setQuantity(productDTO.getQuantity());

        // giữ nguyên image cũ
        productFromDB.setImage(productFromDB.getImage());

        // giữ nguyên category cũ
        productFromDB.setCategory(productFromDB.getCategory());

        // tính lại special price
        double specialPrice = productDTO.getPrice()
                - ((productDTO.getDiscount() * 0.01) * productDTO.getPrice());
        productFromDB.setSpecialPrice(specialPrice);

        Product savedProduct = productRepo.save(productFromDB);

        List<Cart> carts = cartRepo.findCartsByProductId(productId);

        List<CartDTO> cartDTOs = carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
            List<ProductDTO> products = cart.getCartItems().stream()
                    .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class)).collect(Collectors.toList());
            cartDTO.setProducts(products);
            return cartDTO;
        }).collect(Collectors.toList());
        cartDTOs.forEach(cart -> cartService.updateProductInCarts(cart.getCartId(), productId));
        return mapToDTOWithImage(savedProduct);
    }

    @Override
    public InputStream getProductImage(String fileName) throws FileNotFoundException {
        String imagePath = path + File.separator + fileName;
        return new FileInputStream(imagePath);
    }

    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {

        Product productFromDB = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        // 🔥 XOÁ ẢNH CŨ
        String oldImage = productFromDB.getImage();
        if (oldImage != null && !oldImage.equals("default.png")) {
            fileService.deleteImage(path, oldImage);
        }

        // upload ảnh mới
        String fileName = fileService.uploadImage(path, image);
        productFromDB.setImage(fileName);

        Product updatedProduct = productRepo.save(productFromDB);

        return mapToDTOWithImage(updatedProduct);
    }

    @Override
    public String deleteProduct(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        List<Cart> carts = cartRepo.findCartsByProductId(productId);
        carts.forEach(cart -> cartService.deleteProductFromCart(cart.getCartId(), productId));
        productRepo.delete(product);
        return "Product with productId: " + productId + " deleted successfully !!!";
    }

private ProductDTO mapToDTOWithImage(Product product) {
    ProductDTO dto = modelMapper.map(product, ProductDTO.class);
    
    // 🔴 SỬA LẠI ĐOẠN ĐANG DÙNG TRY-CATCH THÀNH DÒNG NÀY:
    if (product.getCategory() != null) {
        dto.setCategoryName(product.getCategory().getCategoryName()); 
        // ⚠️ Nếu dòng này báo lỗi đỏ (gạch chân): Chứng tỏ bạn chưa tạo hàm setCategoryName trong ProductDTO.java.
        // Bạn chỉ cần mở ProductDTO.java lên thêm @Data hoặc viết hàm setter là xong!
    }

    if (product.getImage() != null && !product.getImage().isEmpty()) {
        dto.setImage(
            "http://localhost:8080/images/" + product.getImage()
        );
    }
    return dto;
}


}
