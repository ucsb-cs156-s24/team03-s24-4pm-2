package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_menuitem() throws Exception {
        setupUser(true);

        page.getByText("UCSBDiningCommonsMenuItem").click();

        page.getByText("Create Menu Item").click();
        assertThat(page.getByText("Create New Dining Commons Menu Item")).isVisible();
        page.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode").fill("Ortega");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-name").fill("BakedPestoPastawithChicken");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-station").fill("EntreesSpecials");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-submit").click();
        
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-station"))
                .hasText("EntreesSpecials");

        // page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Edit-button").click();
        // assertThat(page.getByText("Edit Restaurant")).isVisible();
        // page.getByTestId("UCSBDiningCommonsMenuItemForm-description").fill("THE BEST");
        // page.getByTestId("UCSBDiningCommonsMenuItemForm-submit").click();

        // assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-description")).hasText("THE BEST");

        // page.getByTestId("RestaurantTable-cell-row-0-col-Delete-button").click();

        // assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_menuitem() throws Exception {
        setupUser(false);

        page.getByText("UCSBDiningCommonsMenuItem").click();

        assertThat(page.getByText("Create Menu Item")).not().isVisible();
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-station")).not().isVisible();
    }
}