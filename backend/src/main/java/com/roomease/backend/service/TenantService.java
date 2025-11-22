package com.roomease.backend.service;

import com.roomease.backend.model.Tenant;
import com.roomease.backend.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TenantService implements EntityService<Tenant, String> {
    
    private final TenantRepository repository;

    @Autowired
    public TenantService(TenantRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Tenant> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Tenant> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public Tenant save(Tenant tenant) {
        validateTenant(tenant);
        return repository.save(tenant);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsById(String id) {
        return repository.existsById(id);
    }

    private void validateTenant(Tenant tenant) {
        if (tenant.getName() == null || tenant.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tenant name cannot be empty");
        }
        if (tenant.getRent() < 0) {
            throw new IllegalArgumentException("Tenant rent cannot be negative");
        }
    }

    public Tenant updatePaymentStatus(Tenant tenant, String paymentStatus) {
        tenant.setPaymentStatus(paymentStatus);
        return save(tenant);
    }
}

