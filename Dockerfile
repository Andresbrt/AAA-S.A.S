# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and pom from backend
COPY backend/.mvn/ .mvn/
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x mvnw

# Copy source and build jar
COPY backend/src/ src/
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine AS runtime

RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -D appuser

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

USER appuser
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
