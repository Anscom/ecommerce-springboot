package com.anscom.ecommerce.constant;

public enum CategoryEnum {
    T_SHIRT("T-SHIRT"),
    SHORTS("SHORTS"),
    SHIRTS("SHIRTS"),
    HOODIE("HOODIE"),
    JEANS("JEANS");

    private final String displayName;

    CategoryEnum(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
