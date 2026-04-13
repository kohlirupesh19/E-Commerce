package com.obsidian.curator.repository;

import com.obsidian.curator.entity.Address;
import com.obsidian.curator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    List<Address> findByUser(User user);
    Optional<Address> findByIdAndUser(UUID id, User user);
}
