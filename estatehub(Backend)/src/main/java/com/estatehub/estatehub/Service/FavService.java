package com.estatehub.estatehub.Service;
import com.estatehub.estatehub.DTO.FavoriteDTO;
import com.estatehub.estatehub.model.Favorite;
import com.estatehub.estatehub.model.Property;
import com.estatehub.estatehub.model.User;
import com.estatehub.estatehub.Repository.FavRepo;
import com.estatehub.estatehub.Repository.ProperityRepo;
import com.estatehub.estatehub.Repository.UserRepo;
import com.estatehub.estatehub.Exception.PropertyNotFoundException;
import com.estatehub.estatehub.Exception.UserNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.estatehub.estatehub.DTO.PropertyDTO;
import java.util.List;
import java.util.ArrayList;

@Service
public class FavService {

    private final FavRepo favoriteRepository;
    private final UserRepo userRepository;
    private final ProperityRepo propertyRepository;

    public FavService(
            FavRepo favoriteRepository,
            UserRepo userRepository,
            ProperityRepo propertyRepository
    ) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
    }


    public FavoriteDTO toggleFavorite(FavoriteDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new PropertyNotFoundException("Property not found"));

        Optional<Favorite> existingFavorite =
                favoriteRepository.findByUserAndProperty(user, property);

        if (existingFavorite.isPresent()) {
            favoriteRepository.delete(existingFavorite.get());
            return null;
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setProperty(property);

        Favorite savedFavorite = favoriteRepository.save(favorite);

        FavoriteDTO response = new FavoriteDTO();
        response.setId(savedFavorite.getId());
        response.setUserId(user.getId());
        response.setPropertyId(property.getId());

        return response;
    }

    public List<PropertyDTO> getFavoritePosts(Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Favorite> favorites = favoriteRepository.findByUser(user);

        List<PropertyDTO> properties = new ArrayList<>();

        for (Favorite favorite : favorites) {

            Property property = favorite.getProperty();

            PropertyDTO dto = new PropertyDTO();

            dto.setId(property.getId());
            dto.setTitle(property.getTitle());
            dto.setLocation(property.getLocation());
            dto.setPrice(property.getPrice());
            dto.setPropertyType(property.getPropertyType());
            dto.setListingType(property.getListingType());
            dto.setBedrooms(property.getBedrooms());
            dto.setBathrooms(property.getBathrooms());
            dto.setArea(property.getArea());
            dto.setImageUrl(property.getImageUrl());
            dto.setDescription(property.getDescription());
            dto.setPropertyStatus(property.getPropertyStatus());

            if (property.getAgent() != null) {
                dto.setAgentId(property.getAgent().getId());
            }

            properties.add(dto);
        }

        return properties;
    }

}
