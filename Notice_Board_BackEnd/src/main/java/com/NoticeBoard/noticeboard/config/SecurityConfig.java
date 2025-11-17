package com.NoticeBoard.noticeboard.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// New imports for the Popup Header Fix
import org.springframework.security.web.header.writers.CrossOriginOpenerPolicyHeaderWriter.CrossOriginOpenerPolicy;
import org.springframework.security.web.header.writers.CrossOriginEmbedderPolicyHeaderWriter.CrossOriginEmbedderPolicy;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); 
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173", 
            "https://notice-board-frontend-five.vercel.app"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
        
        http
            .cors(corsConfig -> corsConfig.configurationSource(corsConfigurationSource()))
            .csrf(csrfConfig -> csrfConfig.disable())

            // --- 1. HEADER FIX FOR GOOGLE POPUP ---
            .headers(headers -> headers
                .crossOriginOpenerPolicy(policy -> policy
                    .policy(CrossOriginOpenerPolicy.SAME_ORIGIN_ALLOW_POPUPS)
                )
                .crossOriginEmbedderPolicy(policy -> policy
                    .policy(CrossOriginEmbedderPolicy.UNSAFE_NONE)
                )
            )

            .exceptionHandling(ex -> ex
                .accessDeniedHandler((request, response, accessDeniedException) -> 
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN)
                )
            )
            .authorizeHttpRequests(auth -> auth
                // 2. Admin Only Routes
                .requestMatchers("/api/admin/**").hasRole("ADMIN") 
                
                // --- 3. THE FIX: ALLOW STUDENTS TO SEE DROPDOWNS ---
                .requestMatchers("/api/data/**").authenticated() 
                .requestMatchers("/api/profile/**").authenticated()

                // 4. Public Routes
                .requestMatchers("/api").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/login/oauth2/**").permitAll()

                // 5. Notice Permissions (Viewing allowed for everyone logged in)
                .requestMatchers(HttpMethod.GET, "/api/notices", "/api/notices/**").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                // Creating/Deleting Notices (Teachers/Admins only)
                .requestMatchers(HttpMethod.POST, "/api/notices", "/api/notices/**").hasAnyRole("TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/notices/**").hasAnyRole("TEACHER", "ADMIN")
                
                // 6. Catch-all
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}