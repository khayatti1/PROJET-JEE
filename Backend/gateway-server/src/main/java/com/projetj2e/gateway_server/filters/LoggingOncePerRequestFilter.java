package com.projetj2e.gateway_server.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class LoggingOncePerRequestFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("🌀 [GATEWAY-MVC PRE] " + request.getMethod() + " " + request.getRequestURI());
        try {
            filterChain.doFilter(request, response);
        } finally {
            System.out.println("✅ [GATEWAY-MVC POST] status=" + response.getStatus());
        }
    }
}
