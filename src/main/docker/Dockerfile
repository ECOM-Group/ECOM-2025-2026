# Étape 1 : build JHipster
FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app

# Copier tous les fichiers nécessaires (conserver ces COPY)
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src src
COPY sonar-project.properties ./
COPY package.json ./
COPY package-lock.json ./ 

# 1. Installer Node et NPM
RUN ./mvnw frontend:install-node-and-npm

# 2. Installer les dépendances NPM (Correction du chemin)
# Exécution explicite du script NPM via le binaire Node
RUN /app/target/node/node /app/target/node/node_modules/npm/bin/npm-cli.js ci --loglevel verbose

# 3. Exécuter le build de production front-end (Correction du chemin)
RUN /app/target/node/node /app/target/node/node_modules/npm/bin/npm-cli.js run webapp:prod -- --loglevel debug || (echo ">>> ERREUR DE COMPILATION FRONTEND: VÉRIFIER LE LOG CI-DESSUS <<<" && exit 1)

# 4. Finaliser le package Maven
RUN ./mvnw -Pprod -DskipTests -DskipSonar -DskipClient package

# Étape 2 : runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
