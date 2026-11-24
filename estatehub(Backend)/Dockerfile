FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -DskipTests dependency:go-offline
COPY src ./src
RUN ./mvnw -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
RUN groupadd --system estatehub && useradd --system --gid estatehub estatehub \
    && mkdir /app/uploads && chown estatehub:estatehub /app/uploads
COPY --from=build /app/target/*.jar /app/estatehub.jar
USER estatehub
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app/estatehub.jar"]
