//package com.HRPortal.controller;
//
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.RequestMapping;
//
//@RestController
//@RequestMapping("/api/auth")
//@RequiredArgsConstructor
//public class UserController {
//    private final UserService userService;
//
//    @GetMapping("/health")
//    public String checkHealth() {
//        return "Server is up and running!";
//    }
//
//    @PostMapping("/signup")
//    public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody UserRequest userRequest) {
//        Map<String, Object> response = userService.createUser(userRequest);
//        return ResponseEntity.ok(response);
//    }
//
//
//    @PostMapping("/login")
//    public ResponseEntity<Map<String, Object>> login(@RequestBody @Valid LoginRequest request) {
//        Map<String, Object> response = userService.login(request);
//        return ResponseEntity.ok(response);
//    }
//}