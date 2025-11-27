# Étape 1 : build JHipster
FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app

# Copier tous les fichiers nécessaires
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src src
COPY sonar-project.properties ./

COPY package.json ./
COPY package-lock.json ./


# Build prod
RUN ./mvnw -X -Pprod -DskipTests -DskipSonar package
#RUN ./mvnw -Pprod -DskipTests -DskipSonar package

# Étape 2 : runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
