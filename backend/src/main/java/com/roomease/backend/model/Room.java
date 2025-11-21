package com.roomease.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "rooms")
public class Room {
    @Id
    private String id;
    private String name;
    private double rent;
    private boolean isOccupied;
    private List<String> tenantNames; 

    public Room() {}

    public Room(String name, double rent, boolean isOccupied, List<String> tenantNames) {
        this.name = name;
        this.rent = rent;
        this.isOccupied = isOccupied;
        this.tenantNames = tenantNames;
    }

    // getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getRent() { return rent; }
    public void setRent(double rent) { this.rent = rent; }

    public boolean isOccupied() { return isOccupied; }
    public void setIsOccupied(boolean isOccupied) { this.isOccupied = isOccupied; }

    public List<String> getTenantNames() { return tenantNames; }
    public void setTenantNames(List<String> tenantNames) { this.tenantNames = tenantNames; }
}
