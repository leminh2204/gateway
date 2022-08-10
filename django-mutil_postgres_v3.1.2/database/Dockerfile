FROM postgres
RUN mkdir -p /var/lib/postgresql/data
RUN chmod -R 777 /var/lib/postresql/data
COPY create-multiple-postgresql-databases.sh /docker-entrypoint-initdb.d/

