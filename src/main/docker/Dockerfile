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

# 1. Installer Node et NPM (Nécessaire avant d'utiliser la commande npm)
# Cette étape est correcte, elle télécharge les binaires.
RUN ./mvnw frontend:install-node-and-npm

# 2. Installer les dépendances NPM (L'ÉTAPE CORRIGÉE)
# Nous devons modifier le PATH pour que 'npm' soit trouvé
RUN export PATH="$PATH:/app/target/node/node_modules/npm/bin" && \
    export PATH="$PATH:/app/target/node/bin" && \
    npm ci --loglevel verbose

# 3. Exécuter le build de production front-end (Doit être corrigé de la même manière)
RUN export PATH="$PATH:/app/target/node/node_modules/npm/bin" && \
    export PATH="$PATH:/app/target/node/bin" && \
    npm run webapp:prod -- --loglevel debug || (echo ">>> ERREUR DE COMPILATION FRONTEND: VÉRIFIER LE LOG CI-DESSUS <<<" && exit 1)

# 4. Finaliser le package Maven
RUN ./mvnw -Pprod -DskipTests -DskipSonar -DskipClient package

# Étape 2 : runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
