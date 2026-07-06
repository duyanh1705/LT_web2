package com.nguyenduyanh.example05.security;

import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

@Component
public class JWTUtil {
    @Value("${jwt_secret}")
    private String secret;

    // 🔴 ĐÃ XÓA BIẾN expireDate TOÀN CỤC Ở ĐÂY

    public String generateToken(String email) throws IllegalArgumentException, JWTCreationException {
        // 🔴 ĐƯA XUỐNG ĐÂY: Mỗi lần gọi tạo token, thời gian hết hạn mới được tính từ thời điểm bấm nút
        Date dynamicExpireDate = new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10);

        return JWT.create()
            .withSubject("User Details")
            .withClaim("email", email)
            .withIssuedAt(new Date())
            .withExpiresAt(dynamicExpireDate) // 🔴 Dùng biến động vừa tạo
            .withIssuer("Event Scheduler")
            .sign(Algorithm.HMAC256(secret));
    }

    public String validateTokenAndRetrieveSubject(String token) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
            .withSubject("User Details")
            .withIssuer("Event Scheduler")
            .acceptLeeway(3600)
            .build();
        DecodedJWT jwt = verifier.verify(token);
        return jwt.getClaim("email").asString();
    }
}