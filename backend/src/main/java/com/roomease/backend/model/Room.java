package com.roomease.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "rooms")
public class Room extends BaseEntity {
    private String name;
    private double rent;
    private Boolean occupied;
    private String status;
    private List<String> tenantNames;

    public Room() {
    }

    public Room(String name, double rent, Boolean occupied, List<String> tenantNames) {
        this.name = name;
        this.rent = rent;
        this.occupied = occupied;
        this.tenantNames = tenantNames;
        if (occupied != null && occupied) {
            this.status = "occupied";
        } else {
            this.status = "available";
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getRent() {
        return rent;
    }

    public void setRent(double rent) {
        this.rent = rent;
    }

    public Boolean isOccupied() {
        return occupied;
    }

    public void setOccupied(Boolean occupied) {
        this.occupied = occupied;
        if (occupied != null && occupied) {
            this.status = "occupied";
        } else if (this.status == null || this.status.equals("occupied")) {
            this.status = "available";
        }
    }

    public List<String> getTenantNames() {
        return tenantNames;
    }

    public void setTenantNames(List<String> tenantNames) {
        this.tenantNames = tenantNames;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        if (status == null || status.isEmpty()) {
            this.status = "available";
            this.occupied = false;
        } else {
            this.status = status;
            this.occupied = status.equals("occupied");
        }
    }

    @Override
    public boolean isValid() {
        return name != null && !name.trim().isEmpty() && rent >= 0;
    }

    @Override
    public String getDisplayName() {
        return name != null ? name : "Unnamed Room";
    }
}
