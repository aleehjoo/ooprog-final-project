package com.roomease.backend.controller;

import com.roomease.backend.model.Tenant;
import com.roomease.backend.service.TenantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tenants")
@CrossOrigin(origins = "http://localhost:3000")
public class TenantController {

  private final TenantService tenantService;

  public TenantController(TenantService tenantService) {
    this.tenantService = tenantService;
  }

  @GetMapping
  public List<Tenant> list() {
    return tenantService.findAll();
  }

  @PostMapping
  public ResponseEntity<Tenant> create(@RequestBody Tenant tenant) {
    Tenant saved = tenantService.save(tenant);
    return ResponseEntity.created(URI.create("/api/tenants/" + saved.getId())).body(saved);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Tenant> get(@PathVariable String id) {
    Optional<Tenant> t = tenantService.findById(id);
    return t.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}")
  public ResponseEntity<Tenant> update(@PathVariable String id, @RequestBody Tenant updated) {
    Optional<Tenant> existing = tenantService.findById(id);

    if (existing.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Tenant tenant = existing.get();
    tenant.setName(updated.getName());
    tenant.setRent(updated.getRent());
    tenant.setRoomName(updated.getRoomName());
    if (updated.getPaymentStatus() != null) {
      tenant.setPaymentStatus(updated.getPaymentStatus());
    }

    Tenant saved = tenantService.save(tenant);
    return ResponseEntity.ok(saved);
  }

  @PatchMapping("/{id}")
  public ResponseEntity<Tenant> patch(@PathVariable String id, @RequestBody Tenant updated) {
    Optional<Tenant> existingOpt = tenantService.findById(id);

    if (existingOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Tenant tenant = existingOpt.get();

    if (updated.getName() != null) {
      tenant.setName(updated.getName());
    }
    if (updated.getRent() != 0) {
      tenant.setRent(updated.getRent());
    }
    if (updated.getRoomName() != null) {
      tenant.setRoomName(updated.getRoomName());
    }
    if (updated.getPaymentStatus() != null) {
      tenant.setPaymentStatus(updated.getPaymentStatus());
    }

    Tenant saved = tenantService.save(tenant);
    return ResponseEntity.ok(saved);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    if (!tenantService.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    tenantService.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
