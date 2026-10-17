# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and pom
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Copy source and build
COPY src/ src/
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Runtime (usando Ubuntu JRE con glibc completo para resolver DNS de AWS/Supabase)
FROM eclipse-temurin:21-jre-noble AS runtime

RUN useradd -u 1001 -m appuser

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom -Djava.net.preferIPv4Stack=true"

USER appuser
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
