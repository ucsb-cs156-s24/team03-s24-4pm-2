package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@Tag(name = "UCSBDiningCommonsMenuItem")
@RequestMapping("/api/ucsbdiningcommonsmenuitem")
@RestController
@Slf4j
public class UCSBDiningCommonsMenuItemController extends ApiController {

    @Autowired
    UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

    @Operation(summary= "List all ucsbdiningcommonsmenuitems")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBDiningCommonsMenuItem> allUCSBDiningCommonMenuItem() {
        Iterable<UCSBDiningCommonsMenuItem> commonsmenuitems = ucsbDiningCommonsMenuItemRepository.findAll();
        return commonsmenuitems;
    }

    //

    @Operation(summary= "Create a new UCSBDiningCommonsMenuItem")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBDiningCommonsMenuItem postCommonsMenuItem(
        @Parameter(name="diningCommonsCode") @RequestParam String diningCommonsCode,
        @Parameter(name="name") @RequestParam String name,
        @Parameter(name="station") @RequestParam String station
        )
        {

        UCSBDiningCommonsMenuItem commonsmenuitems = new UCSBDiningCommonsMenuItem();
        commonsmenuitems.setDiningCommonsCode(diningCommonsCode);
        commonsmenuitems.setName(name);
        commonsmenuitems.setStation(station);
        

        UCSBDiningCommonsMenuItem savedCommonsMenuItems = ucsbDiningCommonsMenuItemRepository.save(commonsmenuitems);

        return savedCommonsMenuItems;
    }

    @Operation(summary= "Get a single UCSBDiningCommonsMenuItem")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBDiningCommonsMenuItem getById(
            @Parameter(name="id") @RequestParam Long id) {
        UCSBDiningCommonsMenuItem commonsmenuitem = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

        return commonsmenuitem;
    }

    @Operation(summary= "Delete a UCSBDiningCommonsMenuItem")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteCommonsMenuItem(
            @Parameter(name="id") @RequestParam Long id) {
        UCSBDiningCommonsMenuItem commonsmenuitem = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));

        ucsbDiningCommonsMenuItemRepository.delete(commonsmenuitem);
        return genericMessage("UCSBDiningCommonsMenuItem with id %s deleted".formatted(id));
    }

    @Operation(summary= "Update a single UCSBDiningCommonsMenuItem")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBDiningCommonsMenuItem updateCommonsMenuItem(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid UCSBDiningCommonsMenuItem incoming) {

        UCSBDiningCommonsMenuItem commonsmenuitem = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItem.class, id));


                commonsmenuitem.setDiningCommonsCode(incoming.getDiningCommonsCode());
                commonsmenuitem.setName(incoming.getName());
                commonsmenuitem.setStation(incoming.getStation());

        ucsbDiningCommonsMenuItemRepository.save(commonsmenuitem);

        return commonsmenuitem;
    }
}