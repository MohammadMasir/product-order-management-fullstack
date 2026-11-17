package com.interview.product_management.service;

import com.interview.product_management.dto.PriceQuantityProjection;
import com.interview.product_management.dto.product.CartDto;
import com.interview.product_management.dto.product.CartItemsDto;
import com.interview.product_management.dto.product.OrderDetailsDto;
import com.interview.product_management.dto.product.OrderDto;
import com.interview.product_management.model.Cart;
import com.interview.product_management.model.CartItems;
import com.interview.product_management.model.Product;
import com.interview.product_management.model.User;
import com.interview.product_management.repository.CartItemsRepository;
import com.interview.product_management.repository.CartRepository;
import com.interview.product_management.repository.ProductRepository;
import com.interview.product_management.repository.UserRepository;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemsRepository cartItemsRepository;
    private final ProductRepository productRepository;
    private final OrderService orderService;
    private final UserRepository userRepository;
    private final ProductService productService;

    private Cart checkCartExists(Long userId){
        return cartRepository.findByUsers_Id(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.BAD_REQUEST, "Invalid Request!"
                        ));
    }

    private Optional<CartItems> checkCartItemExists(Cart cart, Product product){
        return cartItemsRepository.findCartItemsByCartAndProduct(cart, product);
    }

    @Transactional
    public void addItemToCart(Long productId, User user) {
        Optional<CartItems> cartItem = checkCartItemExists(user.getCart(), productRepository.getReferenceById(productId));
        if (cartItem.isPresent()){
            throw new RuntimeException(
                    "Item already present in the Cart!"
            );
        }
        CartItems cartItems = new CartItems();
        Cart cart = checkCartExists(user.getId());
        cartItems.setCart(cart);
        cartItems.setProduct(productService.getActiveProductById(productId));
        CartItems cartItems1 = cartItemsRepository.save(cartItems);
        updateCartQuantity(new CartItemsDto(
                cartItems1.getCart().getId(),
                productId,
                1
                ), user, cartItems1);
    }

    public CartDto getCartItemsById(User user) {
        Cart cart = checkCartExists(user.getId());
        List<CartItems> cartItems = cartItemsRepository.findAllByCart_Id(cart.getId());
        List<CartItemsDto> cartItemsDtoList = cartItems.stream()
                .map(items -> new CartItemsDto(
                        items.getId(),
                        items.getProduct().getId(),
                        items.getQuantity()
                )).toList();
        List<PriceQuantityProjection> priceQuantityProjections = cartItemsRepository.getPriceQuantityByCartId(cart.getId());
        BigDecimal totalAmount = new BigDecimal(0);
        for (PriceQuantityProjection priceQuantityProjection : priceQuantityProjections) {
            totalAmount = totalAmount.add(priceQuantityProjection.getPrice()
                    .multiply(
                            BigDecimal.valueOf(priceQuantityProjection.getQuantity())
                    )
            );
        }
        return new CartDto(cartItemsDtoList, totalAmount);
    }

    @Transactional
    public void updateCartQuantity(CartItemsDto cartItemsDto, User user, @Nullable CartItems cartItems1) {
        if (cartItems1!=null){
            cartItems1.setQuantity(cartItemsDto.quantity());
            cartItemsRepository.save(cartItems1);
            return;
        }

        Cart cart = checkCartExists(user.getId());
        Product product = productRepository.getReferenceById(cartItemsDto.productId());
        CartItems cartItems = checkCartItemExists(cart, product).orElseThrow(() ->
                new ResponseStatusException(
                   HttpStatus.BAD_REQUEST, "Invalid Request OR no such Product exists!"
                ));

        if (cartItemsDto.quantity() == 0) {
            cartItemsRepository.deleteById(cartItemsDto.itemId());
            return;
        }
        cartItems.setQuantity(cartItemsDto.quantity());
        cartItemsRepository.save(cartItems);
    }

    @Transactional
    public OrderDetailsDto checkout(OrderDto orderDto, User user) {
        User user1 = userRepository.getReferenceById(user.getId());
        Cart cart = checkCartExists(user.getId());
        List<PriceQuantityProjection> priceQuantityProjections = cartItemsRepository.getPriceQuantityByCartId(cart.getId());

        if (priceQuantityProjections.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cart is empty!"
            );
        }

        BigDecimal totalAmount = priceQuantityProjections.stream()
                .map(priceQuantityProjection ->
                        priceQuantityProjection.getPrice().multiply(
                                BigDecimal.valueOf(priceQuantityProjection.getQuantity())
                        )
                )
                .reduce(BigDecimal::add).orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                "Oops, Something went wrong!"
                        )
                        );
//        for (PriceQuantityProjection priceQuantityProjection : priceQuantityProjections) {
//            totalAmount = totalAmount.add(priceQuantityProjection.getPrice()
//                    .multiply(
//                            BigDecimal.valueOf(priceQuantityProjection.getQuantity())
//                    )
//            );
//        }

        OrderDetailsDto orderDetails = orderService.createOrder(orderDto, user1, cart.getId(), totalAmount);
        clearCart(user1);
        return orderDetails;
    }

    @Transactional
    public void deleteCartItemByProductId(Long productId, User user) {
        checkCartExists(user.getId());
        cartItemsRepository.deleteByProduct_Id(productId);
    }

    @Transactional
    public void clearCart(User user) {
        Cart cart = checkCartExists(user.getId());
        cartItemsRepository.deleteAllByCart(cart);
    }

}
