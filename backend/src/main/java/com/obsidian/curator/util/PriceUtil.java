package com.obsidian.curator.util;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class PriceUtil {

    public BigDecimal tax(BigDecimal subtotal) {
        return subtotal.multiply(new BigDecimal("0.08")).setScale(2, RoundingMode.HALF_UP);
    }
}
