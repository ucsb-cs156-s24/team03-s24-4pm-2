package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = MenuItemReviewController.class)
@Import(TestConfig.class)
public class MenuItemReviewControllerTests extends ControllerTestCase{

    @MockBean
        MenuItemReviewRepository menuItemReviewRepository;

        @MockBean
        UserRepository userRepository;
    
     // Tests for GET /api/menuitemreviews/all

     @Test
     public void logged_out_users_cannot_get_all() throws Exception {
             mockMvc.perform(get("/api/menuitemreviews/all"))
                             .andExpect(status().is(403)); // logged out users can't get all
     }

     @WithMockUser(roles = { "USER" })
     @Test
     public void logged_in_users_can_get_all() throws Exception {
             mockMvc.perform(get("/api/menuitemreviews/all"))
                             .andExpect(status().is(200)); // logged
     }


    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_reviews() throws Exception {

                // arrange
                LocalDateTime reviewDate1 = LocalDateTime.parse("2022-01-03T00:00:00");

                MenuItemReview menuItemReview1 = MenuItemReview.builder()
                                .itemId((long)1)
                                .reviewerEmail("reviewer1@gmail.com")
                                .star(4)
                                .dateReviewed(reviewDate1)
                                .comments("Great dish.")
                                .build();

                LocalDateTime reviewDate2 = LocalDateTime.parse("2022-03-11T00:00:00");

                MenuItemReview menuItemReview2 = MenuItemReview.builder()
                                .itemId((long)2)
                                .reviewerEmail("reviewer2@gmail.com")
                                .star(5)
                                .dateReviewed(reviewDate2)
                                .comments("Loved it!")
                                .build();

                ArrayList<MenuItemReview> expectedReviews = new ArrayList<>();
                expectedReviews.addAll(Arrays.asList(menuItemReview1, menuItemReview2));

                when(menuItemReviewRepository.findAll()).thenReturn(expectedReviews);

                // act
                MvcResult response = mockMvc.perform(get("/api/menuitemreviews/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(menuItemReviewRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedReviews);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

    // Tests for POST /api/menuitemreviews/post...

    @Test
    public void logged_out_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/menuitemreviews/post"))
                            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/menuitemreviews/post"))
                            .andExpect(status().is(403)); // only admins can post
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_menuitemreview() throws Exception {
                // arrange

                LocalDateTime reviewDate1 = LocalDateTime.parse("2022-01-03T00:00:00");

                MenuItemReview menuItemReview1 = MenuItemReview.builder()
                                .itemId((long)2)
                                .reviewerEmail("reviewer3@gmail.com")
                                .star(1)
                                .comments("Disgusting")
                                .dateReviewed(reviewDate1)
                                .build();
                when(menuItemReviewRepository.save(eq(menuItemReview1))).thenReturn(menuItemReview1);
                // act
                MvcResult response = mockMvc.perform(
                                post("/api/menuitemreviews/post?itemId=2&reviewerEmail=reviewer3@gmail.com&star=1&comments=Disgusting&dateReviewed=2022-01-03T00:00:00")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();
                // assert
                verify(menuItemReviewRepository, times(1)).save(menuItemReview1);
                String expectedJson = mapper.writeValueAsString(menuItemReview1);
                String responseString = response.getResponse().getContentAsString();
                
                assertEquals(expectedJson, responseString);
        }

         // Tests for GET /api/menuItemReviews?id=...

         @Test
         public void logged_out_users_cannot_get_by_id() throws Exception {
                 mockMvc.perform(get("/api/menuitemreviews?id=1"))
                                 .andExpect(status().is(403)); // logged out users can't get by id
         }
 
         @WithMockUser(roles = { "USER" })
         @Test
         public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {
    
            // arrange
    
            when(menuItemReviewRepository.findById(eq((long)7))).thenReturn(Optional.empty());
    
            // act
            MvcResult response = mockMvc.perform(get("/api/menuitemreviews?id=25"))
                            .andExpect(status().isNotFound()).andReturn();
    
            // assert
    
            verify(menuItemReviewRepository, times(1)).findById(eq(25L));
            Map<String, Object> json = responseToJson(response);
            assertEquals("EntityNotFoundException", json.get("type"));
            assertEquals("MenuItemReview with id 25 not found", json.get("message"));
    }
 
         @WithMockUser(roles = { "USER" })
         @Test
         public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
    
            // arrange
            LocalDateTime reviewDate1 = LocalDateTime.parse("2022-01-03T00:00:00");

                MenuItemReview menuItemReview1 = MenuItemReview.builder()
                                .itemId((long)12)
                                .reviewerEmail("reviewer4@gmail.com")
                                .star(3)
                                .dateReviewed(reviewDate1)
                                .comments("Meh")
                                .build();

            when(menuItemReviewRepository.findById(eq(12L))).thenReturn(Optional.of(menuItemReview1));
    
            // act
            MvcResult response = mockMvc.perform(get("/api/menuitemreviews?id=12"))
                            .andExpect(status().isOk()).andReturn();
    
            // assert
    
            verify(menuItemReviewRepository, times(1)).findById(eq(12L));
            String expectedJson = mapper.writeValueAsString(menuItemReview1);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

     // Tests for DELETE /api/menuitemreviews?id=... 

     @WithMockUser(roles = { "ADMIN", "USER" })
     @Test
     public void admin_can_delete_a_date() throws Exception {
             // arrange

             LocalDateTime reviewDate1 = LocalDateTime.parse("2022-01-03T00:00:00");

                MenuItemReview menuItemReview1 = MenuItemReview.builder()
                            .itemId((long)2)
                            .reviewerEmail("reviewer4@gmail.com")
                            .star(3)
                            .dateReviewed(reviewDate1)
                            .comments("Meh")
                            .build();

             when(menuItemReviewRepository.findById(eq(2L))).thenReturn(Optional.of(menuItemReview1));

             // act
             MvcResult response = mockMvc.perform(
                             delete("/api/menuitemreviews?id=2")
                                             .with(csrf()))
                             .andExpect(status().isOk()).andReturn();

             // assert
             verify(menuItemReviewRepository, times(1)).findById(2L);
             verify(menuItemReviewRepository, times(1)).delete(any());

             Map<String, Object> json = responseToJson(response);
             assertEquals("MenuItemReview with id 2 deleted", json.get("message"));
     }

     @WithMockUser(roles = { "ADMIN", "USER" })
     @Test
     public void admin_tries_to_delete_non_existant_menuitemreview_and_gets_right_error_message()
                     throws Exception {
             // arrange

             when(menuItemReviewRepository.findById(eq(50L))).thenReturn(Optional.empty());

             // act
             MvcResult response = mockMvc.perform(
                             delete("/api/menuitemreviews?id=50")
                                             .with(csrf()))
                             .andExpect(status().isNotFound()).andReturn();

             // assert
             verify(menuItemReviewRepository, times(1)).findById(50L);
             Map<String, Object> json = responseToJson(response);
             assertEquals("MenuItemReview with id 50 not found", json.get("message"));
     }

      // Tests for PUT /api/menuitemreviews?id=... 

      @WithMockUser(roles = { "ADMIN", "USER" })
      @Test
      public void admin_can_edit_an_existing_menuitemreview() throws Exception {
              // arrange

              // arrange
              LocalDateTime reviewDate1 = LocalDateTime.parse("2022-01-03T00:00:00");

              MenuItemReview menuItemReview1 = MenuItemReview.builder()
                              .itemId((long)2)
                              .reviewerEmail("reviewer1@gmail.com")
                              .star(4)
                              .dateReviewed(reviewDate1)
                              .comments("Great dish.")
                              .build();

              LocalDateTime reviewDate2 = LocalDateTime.parse("2022-03-11T00:00:00");

              MenuItemReview menuItemReview2 = MenuItemReview.builder()
                              .itemId((long)1)
                              .reviewerEmail("reviewer2@gmail.com")
                              .star(5)
                              .dateReviewed(reviewDate2)
                              .comments("Loved it!")
                              .build();

              String requestBody = mapper.writeValueAsString(menuItemReview2);

              when(menuItemReviewRepository.findById(eq(30L))).thenReturn(Optional.of(menuItemReview1));

              // act
              MvcResult response = mockMvc.perform(
                              put("/api/menuitemreviews?id=30")
                                              .contentType(MediaType.APPLICATION_JSON)
                                              .characterEncoding("utf-8")
                                              .content(requestBody)
                                              .with(csrf()))
                              .andExpect(status().isOk()).andReturn();

              // assert
              verify(menuItemReviewRepository, times(1)).findById(30L);
              verify(menuItemReviewRepository, times(1)).save(menuItemReview2); // should be saved with correct user
              String responseString = response.getResponse().getContentAsString();
              assertEquals(requestBody, responseString);
      }

      @WithMockUser(roles = { "ADMIN", "USER" })
      @Test
      public void admin_cannot_edit_menuitemreview_that_does_not_exist() throws Exception {
              // arrange

              LocalDateTime reviewDate1 = LocalDateTime.parse("2022-01-03T00:00:00");

                MenuItemReview menuItemReview1 = MenuItemReview.builder()
                            .itemId((long)2)
                            .reviewerEmail("reviewer4@gmail.com")
                            .star(3)
                            .dateReviewed(reviewDate1)
                            .comments("Meh")
                            .build();

              String requestBody = mapper.writeValueAsString(menuItemReview1);

              when(menuItemReviewRepository.findById(eq(30L))).thenReturn(Optional.empty());

              // act
              MvcResult response = mockMvc.perform(
                              put("/api/menuitemreviews?id=30")
                                              .contentType(MediaType.APPLICATION_JSON)
                                              .characterEncoding("utf-8")
                                              .content(requestBody)
                                              .with(csrf()))
                              .andExpect(status().isNotFound()).andReturn();

              // assert
              verify(menuItemReviewRepository, times(1)).findById(30L);
              Map<String, Object> json = responseToJson(response);
              assertEquals("MenuItemReview with id 30 not found", json.get("message"));

      }
}