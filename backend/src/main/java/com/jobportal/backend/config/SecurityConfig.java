package com.jobportal.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(@Lazy JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationProvider authenticationProvider) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> {})

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authenticationProvider(authenticationProvider)

                .authorizeHttpRequests(auth -> auth

                        // ==============================
                        // PUBLIC FRONTEND PAGES
                        // ==============================

                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login.html",
                                "/register.html",
                                "/jobs.html",
                                "/my-applications.html",
                                "/admin-dashboard.html",
                                "/profile.html",
                                "post-job.html",
                                "/css/**",
                                "/js/**"
                        ).permitAll()


                        // ==============================
                        // AUTH APIs
                        // ==============================

                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()


                        // ==============================
                        // JOB APIs
                        // ==============================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/jobs/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/jobs/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/jobs/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/jobs/**"
                        ).hasRole("ADMIN")


                        // ==============================
                        // APPLICATION APIs - USER
                        // ==============================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/applications/**"
                        ).hasRole("USER")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/my"
                        ).hasRole("USER")


                        // ==============================
                        // JOB MATCHING - USER
                        // ==============================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/job-matching/**"
                        ).hasRole("USER")


                        // ==============================
                        // APPLICATION APIs - ADMIN
                        // ==============================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/applications/**"
                        ).hasRole("ADMIN")


                        // ==============================
                        // ADMIN APIs
                        // ==============================

                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")


                        // ==============================
                        // EVERYTHING ELSE
                        // ==============================

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // ==========================================
    // AUTHENTICATION PROVIDER
    // ==========================================

    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(
                userDetailsService
        );

        provider.setPasswordEncoder(
                passwordEncoder
        );

        return provider;
    }


    // ==========================================
    // PASSWORD ENCODER
    // ==========================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // ==========================================
    // AUTHENTICATION MANAGER
    // ==========================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    // ==========================================
    // CORS CONFIGURATION
    // ==========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("*")
        );

        configuration.setAllowedMethods(
                List.of("*")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}