package com.roomease.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "payments")
public class Payment {
  @Id
  private String id;
  private String tenantName;
  private double amount;
  private String roomName;

  public Payment() {
  }

  public Payment(String tenantName, double amount, boolean occupied, String roomName) {
    this.tenantName = tenantName;
    this.amount = amount;
    this.roomName = roomName;
  }

  // getters & setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getTenantName() {
    return tenantName;
  }

  public void setTenantName(String tenantName) {
    this.tenantName = tenantName;
  }

  public double getAmount() {
    return amount;
  }

  public void setAmount(double amount) {
    this.amount = amount;
  }

  public String getRoomName() {
    return roomName;
  }

  public void setRoomName(String roomName) {
    this.roomName = roomName;
  }
}
