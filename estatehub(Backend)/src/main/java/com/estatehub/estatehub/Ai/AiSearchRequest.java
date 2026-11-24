
package com.estatehub.estatehub.Ai;

import jakarta.validation.constraints.NotBlank;

public class AiSearchRequest {

    @NotBlank(message = "Question is required")
    private String question;

    private AiSearchFilters currentFilters;

    public AiSearchRequest() {
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public AiSearchFilters getCurrentFilters() {
        return currentFilters;
    }

    public void setCurrentFilters(AiSearchFilters currentFilters) {
        this.currentFilters = currentFilters;
    }
}
