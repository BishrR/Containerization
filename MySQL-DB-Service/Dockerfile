FROM mysql:latest

# Environment variables
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=videosdb
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

# Copy the initialization script into the Docker container
COPY ./init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
