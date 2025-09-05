#!/bin/bash

# Script para executar todo o processo de migração de dados
# SEAPS - Sistema de Avaliação de Propriedades

set -e  # Para o script se houver erro

echo "=========================================="
echo "MIGRAÇÃO DE DADOS - SEAPS"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 não está instalado!"
    exit 1
fi

# Verificar se psql está instalado
if ! command -v psql &> /dev/null; then
    print_error "psql não está instalado! Certifique-se de que o PostgreSQL está instalado."
    exit 1
fi

# Verificar se o arquivo de dump existe
if [ ! -f "dump-postgres-202508081703.sql" ]; then
    print_error "Arquivo de dump não encontrado: dump-postgres-202508081703.sql"
    exit 1
fi

print_status "Verificando dependências Python..."
if ! python3 -c "import psycopg2" &> /dev/null; then
    print_warning "psycopg2 não está instalado. Instalando..."
    pip3 install -r requirements.txt
fi

print_success "Dependências verificadas!"

echo ""
print_status "Iniciando processo de migração..."

# Passo 1: Configurar bancos de dados
echo ""
print_status "Passo 1: Configurando bancos de dados..."
python3 setup_migration.py

if [ $? -ne 0 ]; then
    print_error "Erro na configuração dos bancos de dados!"
    exit 1
fi

print_success "Bancos de dados configurados!"

# Passo 2: Verificar se as migrações Knex foram executadas
echo ""
print_status "Passo 2: Verificando migrações Knex..."

# Verificar se existe o diretório de migrações
if [ ! -d "../migrations" ]; then
    print_warning "Diretório de migrações não encontrado. Certifique-se de executar as migrações Knex primeiro."
    echo "Execute: npm run migrate ou yarn migrate"
    read -p "Deseja continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Migração cancelada pelo usuário."
        exit 1
    fi
fi

print_success "Migrações Knex verificadas!"

# Passo 3: Executar migração de dados
echo ""
print_status "Passo 3: Executando migração de dados..."
python3 migrate_data.py

if [ $? -ne 0 ]; then
    print_error "Erro na migração de dados!"
    exit 1
fi

print_success "Migração de dados concluída!"

# Passo 4: Validar migração
echo ""
print_status "Passo 4: Validando migração..."
python3 validate_migration.py

if [ $? -eq 0 ]; then
    print_success "Migração validada com sucesso!"
else
    print_warning "Problemas encontrados na validação. Verifique o relatório: migration_validation_report.txt"
fi

echo ""
echo "=========================================="
print_success "PROCESSO DE MIGRAÇÃO CONCLUÍDO!"
echo "=========================================="
echo ""

# Mostrar informações finais
print_status "Arquivos gerados:"
echo "  - migration_validation_report.txt (relatório de validação)"

print_status "Próximos passos:"
echo "  1. Verifique o relatório de validação"
echo "  2. Teste a aplicação com o novo banco"
echo "  3. Faça backup do banco antigo se necessário"
echo "  4. Remova o banco antigo quando confirmar que tudo está funcionando"

echo ""
print_warning "IMPORTANTE: Sempre faça backup antes de executar este script!"
echo ""
