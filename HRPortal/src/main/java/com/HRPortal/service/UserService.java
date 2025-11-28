//package com.HRPortal.service;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class UserService implements UserDetailsService {
//    private final UserRepo repo;
//    private final UserMapper mapper;
//
//
//    @Autowired
//    private final BCryptPasswordEncoder passwordEncoder;
//    private static final Logger logger = LoggerFactory.getLogger(JWTFilter.class);
//    private final JWTHelper jwtHelper;
//
//
//    public Map<String, Object> createUser(UserRequest request) {
//        try {
//            // Check if user already exists
//            if (repo.findByEmail(request.email()).isPresent()) {
//                return Map.of(
//                        "success", false,
//                        "message", "User already registered. Please log in."
//                );
//            }
//
//            // Encrypt the password
//            String encryptedPassword = passwordEncoder.encode(request.password());
//
//            // Create and save the user
//            User user = mapper.toEntity(request, encryptedPassword);
//            repo.save(user);
//
//            // Generate JWT token after signup
//            String token = jwtHelper.generateToken(request.email());
//
//
//            UserSummaryDTO userSummary = new UserSummaryDTO(
//                    user.getUserId(),
//                    user.getFirstName(),
//                    user.getLastName(),
//                    user.getEmail(),
//                    user.getUserInfo()
//            );
//
//            // Build the response
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", true);
//            response.put("token", token);
//            response.put("user", userSummary);
//
//            return response;
//
//        } catch (Exception e) {
//            // Catch any unexpected error and respond
//            return Map.of(
//                    "success", false,
//                    "message", "Something went wrong while creating user.",
//                    "error", e.getMessage()
//            );
//        }
//    }
//
//
//
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        logger.debug("Loading user details for username: {}", username);
//        User user = repo.findByEmail(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
//        return new CustomUserDetails(user); // Wrapping Customer in CustomUserDetails
//    }
//
//    public Map<String, Object> login(LoginRequest request) {
//        try {
//            // Find user by email
//            User user = repo.findByEmail(request.email())
//                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.email()));
//
//            // Check if password matches
//            boolean matches = passwordEncoder.matches(request.password(), user.getEncryptedpassword());
//
//            if (!matches) {
//                return Map.of(
//                        "success", false,
//                        "message", "Wrong password or email."
//                );
//            }
//
//            // Generate JWT token
//            String token = jwtHelper.generateToken(request.email());
//
//
//            UserSummaryDTO userSummary = new UserSummaryDTO(
//                    user.getUserId(),
//                    user.getFirstName(),
//                    user.getLastName(),
//                    user.getEmail(),
//                    user.getUserInfo()
//            );
//
//            // Build the response
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", true);
//            response.put("token", token);
//            response.put("user", userSummary);
//
//            return response;
//
//        } catch (Exception e) {
//            // Catch any unexpected error and respond
//            return Map.of(
//                    "success", false,
//                    "message", "Something went wrong while logging in.",
//                    "error", e.getMessage()
//            );
//        }
//    }
//
//}
//
