package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Customer;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.service.dto.CustomerDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {})
public interface CustomerMapper {
    @Mapping(source = "user.id", target = "userId")
    CustomerDTO toDto(Customer entity);

    @Mapping(source = "userId", target = "user")
    Customer toEntity(CustomerDTO dto);

    default User fromId(Long id) {
        if (id == null) return null;
        User user = new User();
        user.setId(id);
        return user;
    }
}
