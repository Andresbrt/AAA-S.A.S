# Arquitectura del Backend - Grupo AAA

## 1. Diagrama de Arquitectura (Monolito Modular)

```mermaid
graph TD
    subgraph "Infraestructura Externa"
        DB[(PostgreSQL)]
        S3[AWS S3 / Supabase Storage]
        SMTP[Servidor SMTP]
    end

    subgraph "Monolito Modular (Spring Boot 3)"
        
        subgraph "Módulo: Project"
            P_API[API / Controllers]
            P_APP[Application / Use Cases]
            P_DOM[Domain Entities]
            P_INF[Infrastructure / Adapters]
        end
        
        subgraph "Módulo: Media"
            M_API[API / Controllers]
            M_APP[Application / Use Cases]
            M_DOM[Domain Entities]
            M_INF[Infrastructure / Storage Adapters]
        end
        
        subgraph "Módulo: Security & Auth"
            S_API[API / Controllers]
            S_APP[Auth Services]
            S_DOM[User & Token]
            S_INF[Spring Security / JWT]
        end
        
        %% Relaciones internas (Clean Architecture)
        P_API -.-> P_APP
        P_APP -.-> P_DOM
        P_INF -.-> P_DOM
        P_APP -.-> P_INF
        
        M_API -.-> M_APP
        M_APP -.-> M_DOM
        M_INF -.-> M_DOM
        M_APP -.-> M_INF
        
        %% Eventos de Dominio / Comunicación inter-módulo
        P_APP -- "ApplicationEvent" --> M_APP
    end

    %% Conexiones con el exterior
    P_INF --> DB
    S_INF --> DB
    M_INF --> S3
    
    Client[Next.js Frontend] --> P_API
    Client --> S_API
    Client --> M_API
```

## 2. Decisiones Técnicas Clave (ADR)

1. **Monolito Modular vs Microservicios:** Se opta por un monolito modular porque reduce la complejidad operativa en etapas tempranas y ahorra costos, pero mantiene las fronteras lógicas para una futura extracción.
2. **Virtual Threads (Java 21):** Se habilitarán en Spring Boot 3.2+ (`spring.threads.virtual.enabled=true`). Esto elimina la necesidad de pools de hilos pesados para tareas I/O (llamadas a la BD, S3 o SMTP).
3. **Paginación y Filtros (JPA Specifications):** Se usarán JPA Specifications en lugar de QueryDSL para no introducir dependencias extra de generación de código.
4. **Relaciones Polimórficas (Media):** En lugar de tener una tabla de imágenes por cada entidad, se usa `MediaFile` con `entity_type` y `entity_id`. Esto simplifica drásticamente el módulo `media`.
5. **Caché (Caffeine):** Se usará Caffeine en memoria para los endpoints públicos (`/public/projects`).
6. **Manejo de Errores (RFC 7807):** Spring Boot 3 soporta nativamente `ProblemDetail`. Lo extenderemos para incluir campos de validación (`invalid_params`).
