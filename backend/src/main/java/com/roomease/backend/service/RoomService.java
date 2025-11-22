package com.roomease.backend.service;

import com.roomease.backend.model.Room;
import com.roomease.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService implements EntityService<Room, String> {
    
    private final RoomRepository repository;

    @Autowired
    public RoomService(RoomRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Room> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Room> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public Room save(Room room) {
        validateRoom(room);
        return repository.save(room);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsById(String id) {
        return repository.existsById(id);
    }

    private void validateRoom(Room room) {
        if (room.getName() == null || room.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Room name cannot be empty");
        }
        if (room.getRent() < 0) {
            throw new IllegalArgumentException("Room rent cannot be negative");
        }
    }

    public Room updateRoomStatus(Room room, String status) {
        room.setStatus(status);
        return save(room);
    }
}

