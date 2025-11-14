package com.NoticeBoard.noticeboard.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList; // <-- IMPORT
import java.util.List;

@Data
@Entity
@Table(name = "notices")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "expires_at", nullable = true)
    private LocalDateTime expiresAt;

    @Column(name = "is_pinned", nullable = false)
    private boolean isPinned = false; 

    @Enumerated(EnumType.STRING)
    @Column(name = "target_branch", nullable = true)
    private Branch targetBranch;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "notice_target_semesters", joinColumns = @JoinColumn(name = "notice_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "semester", nullable = false)
    private List<Semester> targetSemesters = new ArrayList<>(); // <-- Default empty list

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = true)
    private Subject subject;

    @ManyToOne 
    @JoinColumn(name = "author_user_id", nullable = false)
    private User author;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "notice_attachments", joinColumns = @JoinColumn(name = "notice_id"))
    @Column(name = "file_url", columnDefinition = "TEXT")
    private List<String> attachmentUrls = new ArrayList<>(); // <-- Default empty list

    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}