package com.mycompany.myapp.web.rest.vm;

import com.mycompany.myapp.service.dto.AdminUserDTO;
import jakarta.validation.constraints.Size;
import java.util.List;

public class RegisterVM extends AdminUserDTO {

    public static final int PASSWORD_MIN_LENGTH = 4;
    public static final int PASSWORD_MAX_LENGTH = 100;

    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String password;

    // 👇 Ajout des champs personnalisés
    private List<AddressVM> addresses;

    public static class AddressVM {

        public String country;
        public String city;
        public String street;
        public Integer zipcode;
    }

    public RegisterVM() {}

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<AddressVM> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<AddressVM> addresses) {
        this.addresses = addresses;
    }
}
