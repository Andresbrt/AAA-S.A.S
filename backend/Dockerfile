# ═══════════════════════════════════════════════════════════════
# Multi-stage Dockerfile for inmobiliaria-api
# ═══════════════════════════════════════════════════════════════

# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and pom first for layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build
COPY src/ src/
RUN ./mvnw package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine AS runtime

# Security: run as non-root user
RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -D appuser

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# JVM options optimized for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

USER appuser
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
