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
# ...

# --------------- NOUVELLES ÉTAPES DE BUILD FRONTEND ISOLÉES ---------------

# 1. Installer Node et NPM (Nécessaire avant d'utiliser la commande npm)
# Le goal install-node-and-npm est sûr
RUN ./mvnw frontend:install-node-and-npm

# 2. Installer les dépendances NPM
# npm ci (clean install) est plus adapté au CI/CD que npm install.
# Nous utilisons --loglevel verbose pour forcer l'affichage maximal.
RUN npm ci --loglevel verbose

# 3. Exécuter le build de production front-end (C'EST L'ÉTAPE QUI ÉCHOUE)
# Nous l'exécutons manuellement pour forcer l'affichage de l'erreur de compilation
# Le `|| exit 1` assure que l'erreur est remontée.
RUN npm run webapp:prod -- --loglevel debug || (echo ">>> ERREUR DE COMPILATION FRONTEND: VÉRIFIER LE LOG CI-DESSUS <<<" && exit 1)

# 4. Finaliser le package Maven (sans le front-end)
# Nous sautons la partie client/frontend (-DskipClient) qui est déjà faite
# pour ne pas refaire les étapes 2 et 3, et éviter le plantage Maven.
RUN ./mvnw -Pprod -DskipTests -DskipSonar -DskipClient package

# Étape 2 : runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
