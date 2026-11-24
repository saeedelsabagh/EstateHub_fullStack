
package com.estatehub.estatehub.Ai;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AiSearchService {

    private final RestClient restClient;

    public AiSearchService() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:5000")
                .build();
    }

    public AiSearchFilters understandQuestion(
            AiSearchRequest request
    ) {
        try {
            AiSearchFilters filters = restClient.post()
                    .uri("/ai/search")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(AiSearchFilters.class);

            if (filters == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "AI service returned an empty response"
                );
            }

            return filters;

        } catch (RestClientException exception) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "AI service is unavailable. "
                            + "Make sure Flask and Ollama are running.",
                    exception
            );
        }
    }
}
