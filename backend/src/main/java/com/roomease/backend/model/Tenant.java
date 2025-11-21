package com.roomease.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tenants")
public class Tenant {
  @Id
  private String id;
  private String name;
  private double rent;
  private String roomName;

  public Tenant() {
  }

  public Tenant(String name, double rent, boolean occupied, String roomName) {
    this.name = name;
    this.rent = rent;
    this.roomName = roomName;
  }

  // getters & setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
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

  public String getRoomName() {
    return roomName;
  }

  public void setRoomName(String roomName) {
    this.roomName = roomName;
  }
}
