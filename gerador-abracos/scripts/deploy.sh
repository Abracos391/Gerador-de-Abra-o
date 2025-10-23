#!/bin/bash

# Script simples para deploy no Render

echo "Iniciando deploy do Gerador de Abraços..."

# Instala dependências
npm install

# Roda o servidor em modo produção
npm run start

echo "Deploy concluído!"
