# Étape 1 : build JHipster
FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app

# Copier tous les fichiers nécessaires
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src src
COPY sonar-project.properties .   # fichier manquant
# Si tu as d'autres fichiers de config à la racine, copier aussi

# Build prod
RUN ./mvnw -Pprod -DskipTests package

# Étape 2 : runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
