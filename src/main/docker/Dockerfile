# -----------------------------------------------------------------------------------
# ÉTAPE 1: Build (facultatif si le build est fait par CI, mais inclus pour l'exhaustivité)
# On utilise une image de base avec JDK 17 et Maven pour effectuer le build.
# Si votre CI produit déjà le JAR et le passe au contexte Docker, cette étape est ignorée.
# -----------------------------------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier le fichier de configuration Maven (pour accélérer si déjà mis en cache)
COPY pom.xml .

# Copier le code source de l'application
COPY src /usr/src/app/src

# Construire l'application JHipster. 
# On utilise le profil 'prod' pour inclure le frontend compilé et 'jib' pour optimiser 
# les couches du JAR, même si nous ne créons pas l'image avec Jib directement ici.
# Le profil 'skipTests' est souvent utilisé pour un build Docker rapide.
# La commande 'mvn package' génère le JAR dans target/.
RUN ./mvnw -Pprod,skipTests package -DskipTests

# -----------------------------------------------------------------------------------
# ÉTAPE 2: Image d'exécution (Runtime)
# Utilise une image JRE légère pour minimiser la taille finale de l'image.
# C'est l'image finale qui sera déployée.
# -----------------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-focal AS runtime

# Installer curl et/ou d'autres utilitaires nécessaires au diagnostic si besoin
# RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Définir des variables d'environnement
# JHipster utilise traditionnellement le profil 'prod' par défaut pour Docker
ENV SPRING_PROFILES_ACTIVE=prod
# JHipster est souvent configuré pour écouter sur le port 8080
ENV SERVER_PORT=8080

# Exposer le port par défaut de l'application
EXPOSE 8080

# Définir le répertoire de travail
WORKDIR /app

# Copier l'application JAR depuis l'étape de build
# Le nom du JAR est généralement 'jhipster-app.jar' ou le nom du projet suivi de la version.
# Adapter le nom du JAR si nécessaire.
COPY --from=builder /usr/src/app/target/*.jar app.jar

# Copier le script d'entrée (entrypoint) qui gère le démarrage
COPY src/main/docker/entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

# Commande d'entrée pour démarrer l'application
# Le 'entrypoint.sh' assure un démarrage robuste et l'exécution du JAR.
ENTRYPOINT ["./entrypoint.sh"]
CMD ["java", "-jar", "/app/app.jar"]
