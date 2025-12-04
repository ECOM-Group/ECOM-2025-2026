package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Address;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.AddressRepository;
import com.mycompany.myapp.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/useraddress")
@Transactional
public class UserAddressResource {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public UserAddressResource(UserRepository userRepository, AddressRepository addressRepository) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    @GetMapping("/{id}/addresses")
    public ResponseEntity<List<Address>> getUserAddresses(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Address> addresses = addressRepository.findAllByUsersId(id);
        return ResponseEntity.ok(addresses);
    }

    @PostMapping("/{userId}/address")
    public ResponseEntity<Address> createOrAttachAddress(@PathVariable Long userId, @RequestBody Address input) {
        User user = userRepository.findById(userId).orElseThrow();
        // Chercher une adresse identique
        Optional<Address> existing = addressRepository.findByStreetAndZipcodeAndCity(
            input.getStreet(),
            input.getZipcode(),
            input.getCity()
        );

        Address finalAddress;

        if (existing.isPresent()) {
            finalAddress = existing.get();
        } else { // Adresses modifier ou créé
            Long id = input.getId();

            if (id != null) { // Adresse modifier : Delete l'ancienne adresse
                Address address = addressRepository.findById(id).orElseThrow();
                address.removeId(user);
                addressRepository.save(address);
                // Del l'adresse si elle n'est plus relié
                if (address.getIds().isEmpty()) addressRepository.delete(address);

                // Pour qu'il considère que c'est une nouvelle address si c'était une ancienne adresse
                input.setId(null);
            }
            finalAddress = addressRepository.save(input);
        }

        finalAddress.addId(user);
        addressRepository.save(finalAddress);

        return ResponseEntity.ok(finalAddress);
    }

    @DeleteMapping("/{userId}/address/{addressId}")
    public ResponseEntity<Void> detachAddress(@PathVariable Long userId, @PathVariable Long addressId) {
        User user = userRepository.findById(userId).orElseThrow();
        Address address = addressRepository.findById(addressId).orElseThrow();

        address.removeId(user);
        addressRepository.save(address);

        // Remove orphan address
        if (address.getIds().isEmpty()) {
            addressRepository.delete(address);
        }

        return ResponseEntity.noContent().build();
    }
}
