package com.estatehub.estatehub.Repository;

import com.estatehub.estatehub.model.Inquiry;
import com.estatehub.estatehub.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepo extends JpaRepository<Message, Integer> {

    List<Message> findByInquiry(Inquiry inquiry);
}