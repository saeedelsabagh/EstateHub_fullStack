package com.estatehub.estatehub.Controller;

import com.estatehub.estatehub.DTO.FavoriteDTO;
import com.estatehub.estatehub.DTO.PropertyDTO;
import com.estatehub.estatehub.Service.FavService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FavCtrl {

    private final FavService favService;

    public FavCtrl(FavService favService) {
        this.favService = favService;
    }

    @PostMapping("/favorite/toggle")
    public FavoriteDTO toggleFavorite(
            @Valid @RequestBody FavoriteDTO dto
    ) {
        return favService.toggleFavorite(dto);
    }

    @GetMapping("/favorite/{userId}")
    public List<PropertyDTO> getFavoritePosts(
            @PathVariable Integer userId
    ) {
        return favService.getFavoritePosts(userId);
    }
}