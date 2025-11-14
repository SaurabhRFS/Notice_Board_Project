package com.NoticeBoard.noticeboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.NoticeBoard.noticeboard.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>{
    // Spring Data JPA will automatically create a method
    // that finds a user by their email. We just have to define the name.
    Optional<User> findByEmail(String email);
}
