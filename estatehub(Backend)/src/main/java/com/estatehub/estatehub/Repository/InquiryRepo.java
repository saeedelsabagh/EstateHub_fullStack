package com.estatehub.estatehub.Repository;

import com.estatehub.estatehub.model.Inquiry;
import com.estatehub.estatehub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InquiryRepo extends JpaRepository<Inquiry, Integer> {

    List<Inquiry> findByUser(User user);

    List<Inquiry> findByAgent(User agent);
}