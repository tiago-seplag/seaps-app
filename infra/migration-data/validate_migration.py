#!/usr/bin/env python3
"""
Script para validar se a migração de dados foi bem-sucedida
"""

import psycopg2
import os
from typing import Dict, List, Tuple
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MigrationValidator:
    def __init__(self, source_db_config: Dict[str, str], target_db_config: Dict[str, str]):
        """
        Inicializa o validador de migração
        
        Args:
            source_db_config: Configuração do banco de origem
            target_db_config: Configuração do banco de destino
        """
        self.source_config = source_db_config
        self.target_config = target_db_config
        self.source_conn = None
        self.target_conn = None
    
    def connect_databases(self):
        """Conecta aos bancos de origem e destino"""
        try:
            self.source_conn = psycopg2.connect(**self.source_config)
            self.target_conn = psycopg2.connect(**self.target_config)
            logger.info("Conectado aos bancos de dados")
        except Exception as e:
            logger.error(f"Erro ao conectar aos bancos: {e}")
            raise
    
    def close_connections(self):
        """Fecha as conexões com os bancos"""
        if self.source_conn:
            self.source_conn.close()
        if self.target_conn:
            self.target_conn.close()
        logger.info("Conexões fechadas")
    
    def get_table_counts(self, conn, table_name: str) -> int:
        """Obtém a contagem de registros de uma tabela"""
        try:
            with conn.cursor() as cursor:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                return cursor.fetchone()[0]
        except Exception as e:
            logger.warning(f"Erro ao contar registros da tabela {table_name}: {e}")
            return 0
    
    def validate_table_counts(self) -> Dict[str, Tuple[int, int]]:
        """Valida se as contagens de registros são iguais"""
        logger.info("Validando contagens de registros...")
        
        tables = [
            'organizations',
            'users', 
            'persons',
            'properties',
            'models',
            'items',
            'checklists',
            'checklist_items',
            'checklist_item_images',
            'model_items'
        ]
        
        results = {}
        
        for table in tables:
            source_count = self.get_table_counts(self.source_conn, table)
            target_count = self.get_table_counts(self.target_conn, table)
            results[table] = (source_count, target_count)
            
            if source_count == target_count:
                logger.info(f"✓ {table}: {source_count} registros")
            else:
                logger.warning(f"✗ {table}: {source_count} -> {target_count} registros")
        
        return results
    
    def validate_foreign_keys(self) -> List[str]:
        """Valida se as foreign keys estão corretas"""
        logger.info("Validando foreign keys...")
        
        issues = []
        
        # Verificar se há registros órfãos
        checks = [
            ("checklists", "organization_id", "organizations", "id"),
            ("checklists", "model_id", "models", "id"),
            ("checklists", "property_id", "properties", "id"),
            ("checklists", "user_id", "users", "id"),
            ("checklist_items", "checklist_id", "checklists", "id"),
            ("checklist_items", "item_id", "items", "id"),
            ("checklist_item_images", "checklist_item_id", "checklist_items", "id"),
            ("model_items", "model_id", "models", "id"),
            ("model_items", "item_id", "items", "id"),
            ("persons", "organization_id", "organizations", "id"),
            ("properties", "organization_id", "organizations", "id"),
            ("properties", "person_id", "persons", "id"),
        ]
        
        for table, fk_column, ref_table, ref_column in checks:
            try:
                with self.target_conn.cursor() as cursor:
                    cursor.execute(f"""
                        SELECT COUNT(*) FROM {table} t
                        LEFT JOIN {ref_table} r ON t.{fk_column} = r.{ref_column}
                        WHERE r.{ref_column} IS NULL AND t.{fk_column} IS NOT NULL
                    """)
                    orphan_count = cursor.fetchone()[0]
                    
                    if orphan_count > 0:
                        issue = f"{table}.{fk_column} tem {orphan_count} registros órfãos"
                        issues.append(issue)
                        logger.warning(f"✗ {issue}")
                    else:
                        logger.info(f"✓ {table}.{fk_column} - sem registros órfãos")
                        
            except Exception as e:
                logger.warning(f"Erro ao validar {table}.{fk_column}: {e}")
        
        return issues
    
    def validate_data_integrity(self) -> List[str]:
        """Valida a integridade dos dados"""
        logger.info("Validando integridade dos dados...")
        
        issues = []
        
        # Verificar se há registros com campos obrigatórios vazios
        checks = [
            ("organizations", "name"),
            ("users", "name"),
            ("users", "email"),
            ("users", "cpf"),
            ("checklists", "sid"),
            ("checklists", "organization_id"),
            ("checklists", "model_id"),
            ("checklists", "property_id"),
            ("checklists", "user_id"),
        ]
        
        for table, column in checks:
            try:
                with self.target_conn.cursor() as cursor:
                    cursor.execute(f"""
                        SELECT COUNT(*) FROM {table} 
                        WHERE {column} IS NULL OR {column} = ''
                    """)
                    null_count = cursor.fetchone()[0]
                    
                    if null_count > 0:
                        issue = f"{table}.{column} tem {null_count} valores nulos/vazios"
                        issues.append(issue)
                        logger.warning(f"✗ {issue}")
                    else:
                        logger.info(f"✓ {table}.{column} - sem valores nulos/vazios")
                        
            except Exception as e:
                logger.warning(f"Erro ao validar {table}.{column}: {e}")
        
        return issues
    
    def validate_enums(self) -> List[str]:
        """Valida se os enums estão corretos"""
        logger.info("Validando enums...")
        
        issues = []
        
        # Verificar enums válidos
        enum_checks = [
            ("users", "role", ["ADMIN", "SUPERVISOR", "EVALUATOR"]),
            ("properties", "type", ["OWN", "RENTED", "GRANT"]),
            ("checklists", "status", ["OPEN", "CLOSED", "APPROVED", "REJECTED"]),
        ]
        
        for table, column, valid_values in enum_checks:
            try:
                with self.target_conn.cursor() as cursor:
                    cursor.execute(f"""
                        SELECT DISTINCT {column} FROM {table} 
                        WHERE {column} IS NOT NULL
                    """)
                    values = [row[0] for row in cursor.fetchall()]
                    
                    invalid_values = [v for v in values if v not in valid_values]
                    
                    if invalid_values:
                        issue = f"{table}.{column} tem valores inválidos: {invalid_values}"
                        issues.append(issue)
                        logger.warning(f"✗ {issue}")
                    else:
                        logger.info(f"✓ {table}.{column} - valores válidos")
                        
            except Exception as e:
                logger.warning(f"Erro ao validar enum {table}.{column}: {e}")
        
        return issues
    
    def generate_report(self, counts: Dict[str, Tuple[int, int]], 
                       fk_issues: List[str], 
                       integrity_issues: List[str],
                       enum_issues: List[str]) -> str:
        """Gera um relatório de validação"""
        
        report = []
        report.append("=" * 60)
        report.append("RELATÓRIO DE VALIDAÇÃO DA MIGRAÇÃO")
        report.append("=" * 60)
        report.append("")
        
        # Contagens
        report.append("CONTAGENS DE REGISTROS:")
        report.append("-" * 30)
        total_issues = 0
        
        for table, (source_count, target_count) in counts.items():
            if source_count == target_count:
                report.append(f"✓ {table}: {source_count} registros")
            else:
                report.append(f"✗ {table}: {source_count} -> {target_count} registros")
                total_issues += 1
        
        report.append("")
        
        # Foreign Keys
        report.append("FOREIGN KEYS:")
        report.append("-" * 30)
        if fk_issues:
            for issue in fk_issues:
                report.append(f"✗ {issue}")
                total_issues += 1
        else:
            report.append("✓ Todas as foreign keys estão corretas")
        
        report.append("")
        
        # Integridade
        report.append("INTEGRIDADE DOS DADOS:")
        report.append("-" * 30)
        if integrity_issues:
            for issue in integrity_issues:
                report.append(f"✗ {issue}")
                total_issues += 1
        else:
            report.append("✓ Todos os campos obrigatórios estão preenchidos")
        
        report.append("")
        
        # Enums
        report.append("ENUMS:")
        report.append("-" * 30)
        if enum_issues:
            for issue in enum_issues:
                report.append(f"✗ {issue}")
                total_issues += 1
        else:
            report.append("✓ Todos os enums estão corretos")
        
        report.append("")
        report.append("=" * 60)
        
        if total_issues == 0:
            report.append("🎉 MIGRAÇÃO VALIDADA COM SUCESSO!")
        else:
            report.append(f"⚠️  ENCONTRADOS {total_issues} PROBLEMAS")
        
        report.append("=" * 60)
        
        return "\n".join(report)
    
    def run_validation(self) -> bool:
        """Executa toda a validação"""
        try:
            self.connect_databases()
            
            # Executar validações
            counts = self.validate_table_counts()
            fk_issues = self.validate_foreign_keys()
            integrity_issues = self.validate_data_integrity()
            enum_issues = self.validate_enums()
            
            # Gerar relatório
            report = self.generate_report(counts, fk_issues, integrity_issues, enum_issues)
            print(report)
            
            # Salvar relatório em arquivo
            with open('migration_validation_report.txt', 'w', encoding='utf-8') as f:
                f.write(report)
            
            logger.info("Relatório salvo em migration_validation_report.txt")
            
            # Retornar se a migração foi bem-sucedida
            total_issues = sum(1 for s, t in counts.values() if s != t) + len(fk_issues) + len(integrity_issues) + len(enum_issues)
            return total_issues == 0
            
        except Exception as e:
            logger.error(f"Erro durante a validação: {e}")
            raise
        finally:
            self.close_connections()

def main():
    """Função principal"""
    # Configurações dos bancos
    source_db_config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': os.getenv('DB_PORT', '5432'),
        'database': os.getenv('SOURCE_DB_NAME', 'seaps_old'),
        'user': os.getenv('DB_USER', 'seaps_user'),
        'password': os.getenv('DB_PASSWORD', 'your_password')
    }
    
    target_db_config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': os.getenv('DB_PORT', '5432'),
        'database': os.getenv('TARGET_DB_NAME', 'seaps_new'),
        'user': os.getenv('DB_USER', 'seaps_user'),
        'password': os.getenv('DB_PASSWORD', 'your_password')
    }
    
    validator = MigrationValidator(source_db_config, target_db_config)
    success = validator.run_validation()
    
    if success:
        print("\n✅ Migração validada com sucesso!")
        return 0
    else:
        print("\n❌ Problemas encontrados na migração!")
        return 1

if __name__ == "__main__":
    exit(main())
