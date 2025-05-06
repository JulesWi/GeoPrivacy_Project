# Utiliser une image Ubuntu LTS comme base
FROM ubuntu:22.04

# Éviter les invites interactives pendant la construction de l'image
ENV DEBIAN_FRONTEND=noninteractive

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    curl \
    git \
    ca-certificates \
    build-essential \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Définir l'environnement pour noirup (sera installé dans /root/.nargo)
ENV NARGO_HOME="/root/.nargo"
ENV PATH="/root/.nargo/bin:${PATH}"

# Installer noirup
RUN curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash

# Utiliser noirup (maintenant dans le PATH grâce à ENV) pour installer et définir la version v0.28.0 de Nargo
RUN /root/.nargo/bin/noirup install v0.28.0 && /root/.nargo/bin/noirup default v0.28.0

# Créer un répertoire pour l'application et le définir comme répertoire de travail
WORKDIR /usr/src/app

# Par défaut, si le conteneur est lancé sans commande, afficher la version de nargo
CMD ["nargo", "--version"]
