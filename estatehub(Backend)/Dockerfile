FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -DskipTests dependency:go-offline
COPY src ./src
RUN ./mvnw -DskipTests package
CMD ["sh", "-c", "java -jar target/*.jar"]
