package com.roomease.backend.controller;

import com.roomease.backend.model.Room;
import com.roomease.backend.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public List<Room> list() { 
        return roomService.findAll();
    }

    @PostMapping
    public ResponseEntity<Room> create(@RequestBody Room room) {
        Room saved = roomService.save(room);
        return ResponseEntity.created(URI.create("/api/rooms/" + saved.getId())).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> get(@PathVariable String id) {
        Optional<Room> r = roomService.findById(id);
        return r.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> update(@PathVariable String id, @RequestBody Room updated) {
        Optional<Room> existing = roomService.findById(id);

        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Room room = existing.get();
        room.setName(updated.getName());
        room.setRent(updated.getRent());
        if (updated.getStatus() != null) {
            room.setStatus(updated.getStatus());
        } else if (updated.isOccupied() != null) {
            room.setOccupied(updated.isOccupied());
        }
        room.setTenantNames(updated.getTenantNames());

        Room saved = roomService.save(room);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Room> patch(
            @PathVariable String id,
            @RequestBody Room updated) {
        Optional<Room> existingOpt = roomService.findById(id);

        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Room room = existingOpt.get();

        if (updated.getName() != null) {
            room.setName(updated.getName());
        }
        if (updated.getRent() != 0) {
            room.setRent(updated.getRent());
        }
        if (updated.getStatus() != null) {
            room.setStatus(updated.getStatus());
        } else if (updated.isOccupied() != null) {
            room.setOccupied(updated.isOccupied());
        }

        if (updated.getTenantNames() != null) {
            room.setTenantNames(updated.getTenantNames());
        }

        Room saved = roomService.save(room);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!roomService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        roomService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
