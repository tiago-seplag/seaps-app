#!/usr/bin/env python3
"""
Script para configurar os bancos de dados antes da migração
"""

import psycopg2
import os
import sys
from typing import Dict, Any

def create_database_if_not_exists(db_config: Dict[str, Any], db_name: str):
    """Cria o banco de dados se não existir"""
    # Conectar ao postgres para criar o banco
    postgres_config = db_config.copy()
    postgres_config['database'] = 'postgres'
    
    try:
        conn = psycopg2.connect(**postgres_config)
        conn.autocommit = True
        
        with conn.cursor() as cursor:
            # Verificar se o banco existe
            cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
            exists = cursor.fetchone()
            
            if not exists:
                cursor.execute(f'CREATE DATABASE "{db_name}"')
                print(f"Banco de dados '{db_name}' criado com sucesso!")
            else:
                print(f"Banco de dados '{db_name}' já existe.")
        
        conn.close()
        
    except Exception as e:
        print(f"Erro ao criar banco de dados '{db_name}': {e}")
        sys.exit(1)

def restore_dump(dump_file: str, db_config: Dict[str, Any]):
    """Restaura o dump no banco de origem"""
    try:
        # Usar psql para restaurar o dump
        import subprocess
        
        cmd = [
            'psql',
            '-h', db_config['host'],
            '-p', str(db_config['port']),
            '-U', db_config['user'],
            '-d', db_config['database'],
            '-f', dump_file
        ]
        
        # Definir variável de ambiente para senha
        env = os.environ.copy()
        env['PGPASSWORD'] = db_config['password']
        
        print(f"Restaurando dump do arquivo: {dump_file}")
        result = subprocess.run(cmd, env=env, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("Dump restaurado com sucesso!")
        else:
            print(f"Erro ao restaurar dump: {result.stderr}")
            sys.exit(1)
            
    except FileNotFoundError:
        print("Erro: psql não encontrado. Certifique-se de que o PostgreSQL está instalado.")
        sys.exit(1)
    except Exception as e:
        print(f"Erro ao restaurar dump: {e}")
        sys.exit(1)

def main():
    """Função principal"""
    print("=== Configuração para Migração de Dados ===\n")
    
    # Configurações padrão
    db_config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': os.getenv('DB_PORT', '5432'),
        'user': os.getenv('DB_USER', 'seaps_user'),
        'password': os.getenv('DB_PASSWORD', 'your_password')
    }
    
    source_db_name = os.getenv('SOURCE_DB_NAME', 'seaps_old')
    target_db_name = os.getenv('TARGET_DB_NAME', 'seaps_new')
    dump_file = os.getenv('DUMP_FILE', 'dump-postgres-202508081703.sql')
    
    print(f"Configurações:")
    print(f"  Host: {db_config['host']}")
    print(f"  Port: {db_config['port']}")
    print(f"  User: {db_config['user']}")
    print(f"  Source DB: {source_db_name}")
    print(f"  Target DB: {target_db_name}")
    print(f"  Dump file: {dump_file}\n")
    
    # Verificar se o arquivo de dump existe
    if not os.path.exists(dump_file):
        print(f"Erro: Arquivo de dump '{dump_file}' não encontrado!")
        print("Certifique-se de que o arquivo está no diretório correto.")
        sys.exit(1)
    
    # Criar bancos de dados
    print("1. Criando bancos de dados...")
    create_database_if_not_exists(db_config, source_db_name)
    create_database_if_not_exists(db_config, target_db_name)
    
    # Restaurar dump no banco de origem
    print("\n2. Restaurando dump no banco de origem...")
    source_config = db_config.copy()
    source_config['database'] = source_db_name
    restore_dump(dump_file, source_config)
    
    print("\n=== Configuração concluída! ===")
    print("Agora você pode executar a migração com:")
    print("python migrate_data.py")

if __name__ == "__main__":
    main()
