package com.estatehub.estatehub.Repository;

import com.estatehub.estatehub.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import com.estatehub.estatehub.model.Property;
import com.estatehub.estatehub.model.User;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

public interface FavRepo extends JpaRepository<Favorite, Integer> {
    Optional<Favorite> findByUserAndProperty(User user, Property property);

    List<Favorite> findByUser(User user);
}