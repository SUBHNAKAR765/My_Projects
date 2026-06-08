package com.skillbite.repository;

import com.skillbite.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUser_IdOrderBySubmittedAtDesc(Long userId);
    List<Submission> findByUser_IdAndProblem_IdOrderBySubmittedAtDesc(Long userId, Long problemId);
}
