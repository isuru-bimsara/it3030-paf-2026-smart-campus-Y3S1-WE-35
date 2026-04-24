//package com.smart.Uni.service;
//
//import com.smart.Uni.dto.request.CommentRequest;
//import com.smart.Uni.dto.response.CommentResponse;
//import com.smart.Uni.entity.Comment;
//import com.smart.Uni.entity.Ticket;
//import com.smart.Uni.entity.User;
//import com.smart.Uni.exception.ResourceNotFoundException;
//import com.smart.Uni.repository.CommentRepository;
//import com.smart.Uni.repository.TicketRepository;
//import com.smart.Uni.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class CommentService {
//
//    private final CommentRepository commentRepository;
//    private final TicketRepository ticketRepository;
//    private final UserRepository userRepository;
//
//    public CommentResponse addComment(Long ticketId, CommentRequest request, String email) {
//        Ticket ticket = ticketRepository.findById(ticketId)
//                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//        Comment comment = Comment.builder()
//                .ticket(ticket)
//                .user(user)
//                .content(request.getContent())
//                .build();
//        return toResponse(commentRepository.save(comment));
//    }
//
//    public List<CommentResponse> getCommentsByTicket(Long ticketId) {
//        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
//                .map(this::toResponse).collect(Collectors.toList());
//    }
//
//    private CommentResponse toResponse(Comment c) {
//        return CommentResponse.builder()
//                .id(c.getId())
//                .ticketId(c.getTicket().getId())
//                .userId(c.getUser().getId())
//                .userName(c.getUser().getName())
//                .content(c.getContent())
//                .createdAt(c.getCreatedAt())
//                .build();
//    }
//}


package com.smart.Uni.service;

import com.smart.Uni.dto.request.CommentRequest;
import com.smart.Uni.dto.response.CommentResponse;
import com.smart.Uni.entity.Comment;
import com.smart.Uni.entity.Ticket;
import com.smart.Uni.entity.User;
import com.smart.Uni.exception.ResourceNotFoundException;
import com.smart.Uni.repository.CommentRepository;
import com.smart.Uni.repository.TicketRepository;
import com.smart.Uni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CommentResponse addComment(Long ticketId, CommentRequest request, String email) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Comment comment = Comment.builder()
                .ticket(ticket)
                .user(user)
                .content(request.getContent())
                .build();
        Comment saved = commentRepository.save(comment);

        notificationService.notifyCommentAdded(ticket, user); // NEW
        return toResponse(saved);
    }

    public List<CommentResponse> getCommentsByTicket(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    private CommentResponse toResponse(Comment c) {
        return CommentResponse.builder()
                .id(c.getId())
                .ticketId(c.getTicket().getId())
                .userId(c.getUser().getId())
                .userName(c.getUser().getName())
                .content(c.getContent())
                .createdAt(c.getCreatedAt())
                .build();
    }
}