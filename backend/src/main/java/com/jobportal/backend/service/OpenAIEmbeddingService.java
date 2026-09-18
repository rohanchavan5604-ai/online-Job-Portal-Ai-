package com.jobportal.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class OpenAIEmbeddingService {

    private final RestTemplate restTemplate;

    private static final String OLLAMA_URL =
            "http://localhost:11434/api/embeddings";

    private static final String MODEL =
            "nomic-embed-text";

    public OpenAIEmbeddingService() {
        this.restTemplate = new RestTemplate();
    }

    public List<Double> createEmbedding(String text) {

        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException(
                    "Text cannot be empty for embedding"
            );
        }

        OllamaEmbeddingRequest request =
                new OllamaEmbeddingRequest(
                        MODEL,
                        text
                );

        OllamaEmbeddingResponse response =
                restTemplate.postForObject(
                        OLLAMA_URL,
                        request,
                        OllamaEmbeddingResponse.class
                );

        if (response == null ||
                response.embedding() == null ||
                response.embedding().isEmpty()) {

            throw new RuntimeException(
                    "Failed to generate embedding from Ollama"
            );
        }

        return response.embedding();
    }

    private record OllamaEmbeddingRequest(
            String model,
            String prompt
    ) {
    }

    private record OllamaEmbeddingResponse(
            List<Double> embedding
    ) {
    }
}