package com.smart.Uni.controller;

import com.smart.Uni.entity.Ticket;
import com.smart.Uni.entity.User;
import com.smart.Uni.enums.UserRole;
import com.smart.Uni.repository.TicketRepository;
import com.smart.Uni.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TicketControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @BeforeEach
    void setUp() {
        userRepository.findByEmail("student@example.com").orElseGet(() ->
                userRepository.save(User.builder()
                        .email("student@example.com")
                        .name("Student User")
                        .password("encoded-password")
                        .role(UserRole.USER)
                        .active(true)
                        .deleted(false)
                        .banned(false)
                        .build())
        );
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "USER")
    void createTicketPersistsContactDetails() throws Exception {
        MockMultipartFile ticketPart = new MockMultipartFile(
                "ticket",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                """
                {
                  "title": "Projector issue",
                  "description": "Projector is flickering during lectures",
                  "contactDetails": "student@example.com",
                  "category": "IT",
                  "priority": "HIGH"
                }
                """.getBytes(StandardCharsets.UTF_8)
        );

        mockMvc.perform(multipart("/api/tickets").file(ticketPart))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.contactDetails").value("student@example.com"))
                .andExpect(jsonPath("$.data.title").value("Projector issue"));

        Ticket saved = ticketRepository.findAll().stream().findFirst().orElseThrow();
        assertThat(saved.getContactDetails()).isEqualTo("student@example.com");
        assertThat(saved.isOther()).isFalse();
        assertThat(saved.isResolutionAcknowledged()).isFalse();
        assertThat(saved.isResolutionViewed()).isFalse();
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "USER")
    void createTicketReturnsValidationErrorWhenContactDetailsMissing() throws Exception {
        MockMultipartFile ticketPart = new MockMultipartFile(
                "ticket",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                """
                {
                  "title": "Broken chair",
                  "description": "Chair in lab 2 is broken",
                  "category": "OTHER",
                  "priority": "LOW"
                }
                """.getBytes(StandardCharsets.UTF_8)
        );

        mockMvc.perform(multipart("/api/tickets").file(ticketPart))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.data.contactDetails").value("Contact details are required"));
    }

    @Test
    @WithMockUser(username = "student@example.com", roles = "USER")
    void createTicketReturnsValidationErrorWhenContactDetailsBlank() throws Exception {
        MockMultipartFile ticketPart = new MockMultipartFile(
                "ticket",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                """
                {
                  "title": "Broken chair",
                  "description": "Chair in lab 2 is broken",
                  "contactDetails": "   ",
                  "category": "OTHER",
                  "priority": "LOW"
                }
                """.getBytes(StandardCharsets.UTF_8)
        );

        mockMvc.perform(multipart("/api/tickets").file(ticketPart))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.data.contactDetails").value("Contact details are required"));
    }
}
