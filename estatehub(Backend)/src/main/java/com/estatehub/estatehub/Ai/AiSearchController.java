
package com.estatehub.estatehub.Ai;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiSearchController {

    private final AiSearchService aiSearchService;

    public AiSearchController(AiSearchService aiSearchService) {
        this.aiSearchService = aiSearchService;
    }

    @PostMapping("/parse")
    public AiSearchFilters parseQuestion(
            @Valid @RequestBody AiSearchRequest request
    ) {
        return aiSearchService.understandQuestion(request);
    }
}
