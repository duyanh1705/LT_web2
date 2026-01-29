package com.nguyenduyanh.example05.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nguyenduyanh.example05.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u JOIN u.addresses a WHERE a.addressId = :addressId")
    List<User> findByAddress(@Param("addressId") Long addressId);

    Optional<User> findByEmail(String email);
}
