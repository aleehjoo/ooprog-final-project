package com.roomease.backend.model;

import org.springframework.data.annotation.Id;

public abstract class BaseEntity {
    @Id
    protected String id;

    public BaseEntity() {
    }

    protected BaseEntity(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public abstract boolean isValid();

    public String getDisplayName() {
        return "Entity";
    }
}

