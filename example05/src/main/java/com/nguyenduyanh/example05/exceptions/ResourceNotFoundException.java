package com.nguyenduyanh.example05.exceptions;

public class ResourceNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    String resourceName;
    String field;
    String fieldName;
    Long filedId;
    
    public ResourceNotFoundException() {
    }
    
    public ResourceNotFoundException(String resourceName, String field, String fieldName) {
        super("%s not found with %s : %s".formatted(resourceName, field, fieldName));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldName = fieldName;
    }
    
    public ResourceNotFoundException(String resourceName, String field, Long filedId) {
        super("%s not found with %s : %d".formatted(resourceName, field, filedId));
        this.resourceName = resourceName;
        this.field = field;
        this.filedId = filedId;
    }
}
