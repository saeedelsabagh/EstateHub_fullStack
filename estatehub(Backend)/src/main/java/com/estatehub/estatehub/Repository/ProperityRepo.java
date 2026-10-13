package com.estatehub.estatehub.Repository;

import com.estatehub.estatehub.model.Property;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProperityRepo extends JpaRepository<Property, Integer> {

    @Override
    @EntityGraph(attributePaths = {"agent"})
    List<Property> findAll();

    @Override
    @EntityGraph(attributePaths = {"agent"})
    Optional<Property> findById(Integer id);

    List<Property> findByAgent_Id(Integer agentId);

    List<Property> findBypropertyStatus(String propertyStatus);
}