package com.roomease.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tenants")
public class Tenant extends BaseEntity {
  private String name;
  private double rent;
  private String roomName;
  private String paymentStatus;

  public Tenant() {
  }

  public Tenant(String name, double rent, boolean occupied, String roomName) {
    this.name = name;
    this.rent = rent;
    this.roomName = roomName;
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

  public String getPaymentStatus() {
    return paymentStatus;
  }

  public void setPaymentStatus(String paymentStatus) {
    this.paymentStatus = paymentStatus;
  }

  @Override
  public boolean isValid() {
    return name != null && !name.trim().isEmpty() && rent >= 0;
  }

  @Override
  public String getDisplayName() {
    return name != null ? name : "Unnamed Tenant";
  }
}
