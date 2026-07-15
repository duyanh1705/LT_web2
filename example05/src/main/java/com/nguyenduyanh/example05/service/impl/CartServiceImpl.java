package com.nguyenduyanh.example05.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nguyenduyanh.example05.entity.Cart;
import com.nguyenduyanh.example05.entity.CartItem;
import com.nguyenduyanh.example05.entity.Product;
import com.nguyenduyanh.example05.exceptions.APIException;
import com.nguyenduyanh.example05.exceptions.ResourceNotFoundException;
import com.nguyenduyanh.example05.payloads.CartDTO;
import com.nguyenduyanh.example05.payloads.ProductDTO;
import com.nguyenduyanh.example05.repository.CartItemRepo;
import com.nguyenduyanh.example05.repository.CartRepo;
import com.nguyenduyanh.example05.repository.ProductRepo;
import com.nguyenduyanh.example05.service.CartService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private ModelMapper modelMapper;

    private void enrichCartDTOWithUser(Cart cart, CartDTO cartDTO) {
        if (cart.getUser() != null) {
            cartDTO.setEmail(cart.getUser().getEmail());
            cartDTO.setCustomerName(cart.getUser().getFirstName() + " " + cart.getUser().getLastName());
        }
    }

    private double calculateTotalPrice(Cart cart) {
        return cart.getCartItems().stream()
                .mapToDouble(item -> item.getProductPrice() * item.getQuantity())
                .sum();
    }

    @Override
    public CartDTO addProductToCart(Long cartId, Long productId, Integer quantity) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
        if (cartItem != null) {
            throw new APIException("Product" + product.getProductName() + "  already exists in the cart");
        }
        if (product.getQuantity() == 0) {
            throw new APIException(product.getProductName() + " is not available");
        }
        if (product.getQuantity() < quantity) {
            throw new APIException("Please, make an order of the " + product.getProductName()
                    + " less than or equal to the quantity " + product.getQuantity() + ".");
        }
        CartItem newCartItem = new CartItem();

        newCartItem.setProduct(product);
        newCartItem.setCart(cart);
        newCartItem.setQuantity(quantity);
        newCartItem.setDiscount(product.getDiscount());
        newCartItem.setProductPrice(product.getSpecialPrice());
        cartItemRepo.save(newCartItem);
        cart.getCartItems().add(newCartItem);
        product.setQuantity(product.getQuantity() - quantity);
        cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        cart.setTotalPrice(calculateTotalPrice(cart));
        enrichCartDTOWithUser(cart, cartDTO);
        cartDTO.setTotalPrice(cart.getTotalPrice());
        List<ProductDTO> productDTOs = cart.getCartItems().stream()
                .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class)).collect(Collectors.toList());
        cartDTO.setProducts(productDTOs);
        return cartDTO;
    }

    @Override
    public List<CartDTO> getAllCarts() {
        List<Cart> carts = cartRepo.findAll();
        if (carts.size() == 0) {
            throw new APIException("No cart exists");
        }
        List<CartDTO> cartDTOs = carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
            cart.setTotalPrice(calculateTotalPrice(cart));
            enrichCartDTOWithUser(cart, cartDTO);
            cartDTO.setTotalPrice(cart.getTotalPrice());
            List<ProductDTO> products = cart.getCartItems().stream()
                    .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class)).collect(Collectors.toList());
            cartDTO.setProducts(products);
            return cartDTO;
        }).collect(Collectors.toList());
        return cartDTOs;
    }

    @Override
    public CartDTO getCart(String emailId, Long cartId) {
        Cart cart = cartRepo.findCartByEmailAndCartId(emailId, cartId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "cartId", cartId);
        }
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        cart.setTotalPrice(calculateTotalPrice(cart));
        enrichCartDTOWithUser(cart, cartDTO);
        cartDTO.setTotalPrice(cart.getTotalPrice());
        List<ProductDTO> products = cart.getCartItems().stream()
                .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class)).collect(Collectors.toList());
        cartDTO.setProducts(products);
        return cartDTO;
    }

    @Override
    public CartDTO getCartById(Long cartId) {

        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        cart.setTotalPrice(calculateTotalPrice(cart));
        enrichCartDTOWithUser(cart, cartDTO);
        cartDTO.setTotalPrice(cart.getTotalPrice());

        List<ProductDTO> products = cart.getCartItems()
                .stream()
                .map(item -> modelMapper.map(item.getProduct(), ProductDTO.class))
                .collect(Collectors.toList());

        cartDTO.setProducts(products);

        return cartDTO;
    }

    @Override
    public void updateProductInCarts(Long cartId, Long productId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
        if (cartItem == null) {
            throw new APIException("Product " + product.getProductName() + " not available in the cart!!!");
        }
        cartItem.setProductPrice(product.getSpecialPrice());
        cartItem = cartItemRepo.save(cartItem);
        cart.setTotalPrice(calculateTotalPrice(cart));
        cartRepo.save(cart);
    }

    @Override
    public CartDTO updateProductQuantityInCart(Long cartId, Long productId, Integer quantity) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        if (product.getQuantity() == 0) {
            throw new APIException(product.getProductName() + "is not available");
        }
        if (product.getQuantity() < quantity) {
            throw new APIException("Please, make an order of the" + product.getProductName()
                    + "less than or equal to the quantity" + product.getQuantity() + ".");
        }
        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
        if (cartItem == null) {
            throw new APIException("Product" + product.getProductName() + "not available in the cart!!!");
        }
        double cartPrice = cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity());
        product.setQuantity(product.getQuantity() + cartItem.getQuantity() - quantity);

        cartItem.setProductPrice(product.getSpecialPrice());
        cartItem.setQuantity(quantity);
        cartItem.setDiscount(product.getDiscount());

        cart.setTotalPrice(cartPrice + (cartItem.getProductPrice() * quantity));
        cartItem = cartItemRepo.save(cartItem);
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        List<ProductDTO> productDTOs = cart.getCartItems().stream()
                .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class)).collect(Collectors.toList());
        cartDTO.setProducts(productDTOs);
        return cartDTO;
    }
    @Override
    public void deleteCart(Long cartId) {
        Cart cart = cartRepo.findById(cartId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Cart", "cartId", cartId
            ));

        cartRepo.delete(cart);
    }

    @Override
    public String deleteProductFromCart(Long cartId, Long productId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
        if (cartItem == null) {
            throw new ResourceNotFoundException("Product", "productId", productId);
        }
        cart.setTotalPrice(cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity()));
        Product product = cartItem.getProduct();
        product.setQuantity(product.getQuantity() + cartItem.getQuantity());
        cartItemRepo.deleteCartItemByProductIdAndCartId(cartId, productId);
        return "Product" + cartItem.getProduct().getProductName() + "removed from the cart !!!";
    }
}
