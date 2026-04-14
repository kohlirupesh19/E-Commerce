package com.obsidian.curator.config;

import com.obsidian.curator.entity.Address;
import com.obsidian.curator.entity.Category;
import com.obsidian.curator.entity.Coupon;
import com.obsidian.curator.entity.Product;
import com.obsidian.curator.entity.User;
import com.obsidian.curator.entity.enums.AddressType;
import com.obsidian.curator.entity.enums.DiscountType;
import com.obsidian.curator.entity.enums.Role;
import com.obsidian.curator.repository.AddressRepository;
import com.obsidian.curator.repository.CategoryRepository;
import com.obsidian.curator.repository.CouponRepository;
import com.obsidian.curator.repository.ProductRepository;
import com.obsidian.curator.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        User admin = seedAdmin();
        seedCategories();
        seedProducts();
        seedAddress(admin);
        seedCoupons();
    }

    private User seedAdmin() {
        return userRepository.findByEmailIgnoreCase("admin@obsidiancurator.com")
                .orElseGet(() -> {
                    User user = new User();
                    user.setName("Obsidian Admin");
                    user.setEmail("admin@obsidiancurator.com");
                    user.setPassword(passwordEncoder.encode("Admin@123"));
                    user.setRole(Role.ADMIN);
                    user.setIsVerified(true);
                    user.setPhone("9999999999");
                    return userRepository.save(user);
                });
    }

    private void seedCategories() {
        upsertCategory("timepieces", "Timepieces", "Watch", "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=900");
        upsertCategory("fashion", "Fashion", "Shirt", "https://images.unsplash.com/photo-1445205170230-053b83016050?w=900");
        upsertCategory("jewelry", "Jewelry", "Diamond", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900");
    }

    private void seedProducts() {
        Category watches = categoryRepository.findBySlug("timepieces").orElse(null);
        Category fashion = categoryRepository.findBySlug("fashion").orElse(null);
        Category jewelry = categoryRepository.findBySlug("jewelry").orElse(null);

        if (watches != null) {
            upsertProduct(
                    "obsidian-chrono-mk2",
                    "Obsidian Chronograph MK II",
                    "Precision chronograph with sapphire crystal and titanium body.",
                    new BigDecimal("14500.00"),
                    "Obsidian",
                    watches,
                    true,
                    List.of("https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=900")
            );
        }
        if (fashion != null) {
            upsertProduct(
                    "noir-architect-bag",
                    "Noir Architect Bag",
                    "Handcrafted leather bag built for premium utility and style.",
                    new BigDecimal("4250.00"),
                    "Atelier Noir",
                    fashion,
                    true,
                    List.of("https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900")
            );
        }
        if (jewelry != null) {
            upsertProduct(
                    "ethereal-gold-band",
                    "Ethereal Gold Band",
                    "Limited edition 18k gold band with obsidian inlay.",
                    new BigDecimal("2100.00"),
                    "Ethereal",
                    jewelry,
                    false,
                    List.of("https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900")
            );
        }
    }

    private void seedCoupons() {
        couponRepository.findByCodeIgnoreCase("WELCOME10").orElseGet(() -> {
            Coupon coupon = new Coupon();
            coupon.setCode("WELCOME10");
            coupon.setDiscountType(DiscountType.PERCENTAGE);
            coupon.setDiscountValue(new BigDecimal("10"));
            coupon.setMinOrderAmount(new BigDecimal("1000"));
            coupon.setMaxDiscount(new BigDecimal("1500"));
            coupon.setUsageLimit(1000);
            coupon.setExpiresAt(Instant.now().plusSeconds(60L * 60 * 24 * 180));
            coupon.setIsActive(true);
            return couponRepository.save(coupon);
        });
    }

    private Category upsertCategory(String slug, String name, String iconName, String imageUrl) {
        return categoryRepository.findBySlug(slug).map(existing -> {
            existing.setName(name);
            existing.setIconName(iconName);
            existing.setImageUrl(imageUrl);
            return categoryRepository.save(existing);
        }).orElseGet(() -> {
            Category category = new Category();
            category.setSlug(slug);
            category.setName(name);
            category.setIconName(iconName);
            category.setImageUrl(imageUrl);
            return categoryRepository.save(category);
        });
    }

    private void upsertProduct(
            String slug,
            String name,
            String description,
            BigDecimal price,
            String brand,
            Category category,
            boolean featured,
            List<String> images
    ) {
        Product product = productRepository.findBySlug(slug).orElseGet(Product::new);
        product.setSlug(slug);
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setBrand(brand);
        product.setCategory(category);
        product.setStock(20);
        product.setIsAvailable(true);
        product.setIsFeatured(featured);
        product.setImages(images);
        productRepository.save(product);
    }

    private void seedAddress(User admin) {
        if (addressRepository.findByUser(admin).isEmpty()) {
            Address address = new Address();
            address.setUser(admin);
            address.setFullName(" Julian Sterling");
            address.setPhone("+1 (212) 555-0198");
            address.setAddressType(AddressType.HOME);
            address.setStreet("722 Luxury Row, Manhattan");
            address.setCity("New York");
            address.setState("NY");
            address.setPincode("10019");
            address.setIsDefault(true);
            addressRepository.save(address);
        }
    }
}
