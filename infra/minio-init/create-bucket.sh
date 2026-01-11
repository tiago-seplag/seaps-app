#!/bin/sh

# Aguarda o MinIO iniciar
sleep 5

# Cria o bucket seaps-bucket
mc alias set local http://localhost:4566 minioadmin minioadmin
mc mb local/seaps-bucket --ignore-existing