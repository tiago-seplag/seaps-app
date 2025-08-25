#!/usr/bin/env python3
"""
Script para migrar dados do dump PostgreSQL para a nova estrutura do banco
Baseado no dump: dump-postgres-202508081703.sql
Para a nova estrutura definida nas migrações Knex
"""

import psycopg2
import uuid
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DataMigrator:
    def __init__(self, source_db_config: Dict[str, str], target_db_config: Dict[str, str]):
        """
        Inicializa o migrador de dados
        
        Args:
            source_db_config: Configuração do banco de origem (dump)
            target_db_config: Configuração do banco de destino (nova estrutura)
        """
        self.source_config = source_db_config
        self.target_config = target_db_config
        self.source_conn = None
        self.target_conn = None
        
        # Mapeamento de IDs antigos para novos
        self.id_mapping = {
            'organizations': {},
            'users': {},
            'persons': {},
            'properties': {},
            'models': {},
            'items': {},
            'checklists': {},
            'checklist_items': {},
        }
    
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
    
    def generate_uuid(self) -> str:
        """Gera um novo UUID"""
        return str(uuid.uuid4())
    
    def migrate_organizations(self):
        """Migra dados da tabela organizations"""
        logger.info("Migrando organizations...")
        
        with self.source_conn.cursor() as source_cursor:
            source_cursor.execute("SELECT id, name FROM organizations")
            organizations = source_cursor.fetchall()
        
        with self.target_conn.cursor() as target_cursor:
            for org_id, name in organizations:
                new_id = self.generate_uuid()
                self.id_mapping['organizations'][org_id] = new_id
                
                target_cursor.execute("""
                    INSERT INTO organizations (id, name, acronym, is_active, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (new_id, name, None, True, datetime.now(), datetime.now()))
        
        self.target_conn.commit()
        logger.info(f"Migradas {len(organizations)} organizations")
    
    def migrate_users(self):
        """Migra dados da tabela users"""
        logger.info("Migrando users...")
        
        with self.source_conn.cursor() as source_cursor:
            source_cursor.execute("""
                SELECT id, name, email, cpf, password, avatar, is_active, is_deleted, 
                       created_at, updated_at, role
                FROM users
            """)
            users = source_cursor.fetchall()
        
        with self.target_conn.cursor() as target_cursor:
            for user_data in users:
                (user_id, name, email, cpf, password, avatar, is_active, 
                 is_deleted, created_at, updated_at, role) = user_data
                
                new_id = self.generate_uuid()
                self.id_mapping['users'][user_id] = new_id
                
                # Mapear role para o novo enum
                role_mapping = {
                    'ADMIN': 'ADMIN',
                    'SUPERVISOR': 'SUPERVISOR', 
                    'EVALUATOR': 'EVALUATOR'
                }
                new_role = role_mapping.get(role, 'EVALUATOR')
                
                target_cursor.execute("""
                    INSERT INTO users (id, cpf, name, email, password, avatar, role, 
                                     permissions, is_active, is_deleted, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (new_id, cpf, name, email, password, avatar, new_role, 
                     [], is_active, is_deleted, created_at or datetime.now(), 
                     updated_at or datetime.now()))
        
        self.target_conn.commit()
        logger.info(f"Migrados {len(users)} users")
    
    def migrate_persons(self):
        """Migra dados da tabela persons"""
        logger.info("Migrando persons...")
        
        with self.source_conn.cursor() as source_cursor:
            source_cursor.execute("""
                SELECT id, organization_id, name, email, phone, role, created_at, updated_at
                FROM persons
            """)
            persons = source_cursor.fetchall()
        
        with self.target_conn.cursor() as target_cursor:
            for person_data in persons:
                (person_id, org_id, name, email, phone, role, 
                 created_at, updated_at) = person_data
                
                new_id = self.generate_uuid()
                self.id_mapping['persons'][person_id] = new_id
                
                # Mapear organization_id
                new_org_id = self.id_mapping['organizations'].get(org_id)
                if not new_org_id:
                    logger.warning(f"Organization {org_id} não encontrada para person {person_id}")
                    continue
                
                target_cursor.execute("""
                    INSERT INTO persons (id, organization_id, name, email, phone, role, 
                                       created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (new_id, new_org_id, name, email, phone, role,
                     created_at or datetime.now(), updated_at or datetime.now()))
        
        self.target_conn.commit()
        logger.info(f"Migradas {len(persons)} persons")
    
    def migrate_properties(self):
        """Migra dados da tabela properties"""
        logger.info("Migrando properties...")
        
        with self.source_conn.cursor() as source_cursor:
            source_cursor.execute("""
                SELECT id, organization_id, person_id, name, address, type, location, 
                       created_at, updated_at
                FROM properties
            """)
            properties = source_cursor.fetchall()
        
        with self.target_conn.cursor() as target_cursor:
            for prop_data in properties:
                (prop_id, org_id, person_id, name, address, prop_type, location,
                 created_at, updated_at) = prop_data
                
                new_id = self.generate_uuid()
                self.id_mapping['properties'][prop_id] = new_id
                
                # Mapear foreign keys
                new_org_id = self.id_mapping['organizations'].get(org_id)
                new_person_id = self.id_mapping['persons'].get(person_id) if person_id else None
                
                if not new_org_id:
                    logger.warning(f"Organization {org_id} não encontrada para property {prop_id}")
                    continue
                
                # Mapear type para o novo enum
                type_mapping = {
                    'OWN': 'OWN',
                    'RENTED': 'RENTED',
                    'GRANT': 'GRANT'
                }
                new_type = type_mapping.get(prop_type, 'OWN')
                
                target_cursor.execute("""
                    INSERT INTO properties (id, organization_id, person_id, created_by, type,
                                          name, name_normalized, address, cep, state, city,
                                          neighborhood, street, coordinates, is_deleted,
                                          created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (new_id, new_org_id, new_person_id, None, new_type, name, None,
                     address, None, None, None, None, None, location, False,
                     created_at or datetime.now(), updated_at or datetime.now()))
        
        self.target_conn.commit()
        logger.info(f"Migradas {len(properties)} properties")
    
    def migrate_models(self):
        """Migra dados da tabela models"""
        logger.info("Migrando models...")
        
        with self.source_conn.cursor() as source_cursor:
            source_cursor.execute("""
                SELECT id, name, description, is_deleted, created_at, updated_at
                FROM models
            """)
            models = source_cursor.fetchall()
        
        with self.target_conn.cursor() as target_cursor:
            for model_data in models:
                (model_id, name, description, is_deleted, created_at, updated_at) = model_data
                
                new_id = self.generate_uuid()
                self.id_mapping['models'][model_id] = new_id
                
                target_cursor.execute("""
                    INSERT INTO models (id, name, description, is_deleted, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (new_id, name, description, is_deleted, created_at or datetime.now(),
                     updated_at or datetime.now()))
        
        self.target_conn.commit()
        logger.info(f"Migrados {len(models)} models")
    
    def migrate_items(self):
        """Migra dados da tabela items"""
        logger.info("Migrando items...")
        
        with self.source_conn.cursor() as source_cursor:
            source_cursor.execute("""
                SELECT id, item_id, level, name, is_deleted, created_at, updated_at
                FROM items
            """)
            items = source_cursor.fetchall()
        
        with self.target_conn.cursor() as target_cursor:
            for item_data in items:
                (item_id, parent_item_id, level, name, is_deleted, created_at, updated_at) = item_data
                
                new_id = self.generate_uuid()
                self.id_mapping['items'][item_id] = new_id
                
                # Mapear parent item_id se existir
                new_parent_id = self.id_mapping['items'].get(parent_item_id) if parent_item_id else None
                
                target_cursor.execute("""
                    INSERT INTO items (id, name, is_deleted, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s)
                """, (new_id, name, is_deleted, created_at or datetime.now(),
                     updated_at or datetime.now()))
        
        self.target_conn.commit()
        logger.info(f"Migrados {len(items)} items")
    
    def migrate_checklists(self):
        """Migra dados da tabela checklists"""
        logger.info("Migrando checklists...")
        
        with self.source_conn.cursor() as source_cursor:
            source_cursor.execute("""
                SELECT id, sid, organization_id, model_id, property_id, user_id, created_by,
                       person_id, score, finished_at, created_at, updated_at, classification,
                       status, is_deleted
                FROM checklists
            """)
            checklists = source_cursor.fetchall()
        
        with self.target_conn.cursor() as target_cursor:
            for checklist_data in checklists:
                (checklist_id, sid, org_id, model_id, prop_id, user_id, created_by,
                 person_id, score, finished_at, created_at, updated_at, classification,
                 status, is_deleted) = checklist_data
                
                new_id = self.generate_uuid()
                self.id_mapping['checklists'][checklist_id] = new_id
                
                # Mapear foreign keys
                new_org_id = self.id_mapping['organizations'].get(org_id)
                new_model_id = self.id_mapping['models'].get(model_id)
                new_prop_id = self.id_mapping['properties'].get(prop_id)
                new_user_id = self.id_mapping['users'].get(user_id)
                
                if not all([new_org_id, new_model_id, new_prop_id, new_user_id]):
                    logger.warning(f"Foreign key não encontrada para checklist {checklist_id}")
                    continue
                
                # Mapear status para o novo enum
                status_mapping = {
                    'OPEN': 'OPEN',
                    'CLOSED': 'CLOSED'
                }
                new_status = status_mapping.get(status, 'OPEN')
                
                target_cursor.execute("""
                    INSERT INTO checklists (id, sid, organization_id, model_id, property_id,
                                          user_id, score, classification, status, is_deleted,
                                          finished_at, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (new_id, sid, new_org_id, new_model_id, new_prop_id, new_user_id,
                     score, classification, new_status, is_deleted, finished_at,
                     created_at or datetime.now(), updated_at or datetime.now()))
        
        self.target_conn.commit()
        logger.info(f"Migrados {len(checklists)} checklists")
    
    def migrate_checklist_items(self):
        """Migra dados da tabela checklist_items"""
        logger.info("Migrando checklist_items...")
        
        with self.source_conn.cursor() as source_cursor:
            source_cursor.execute("""
                SELECT id, checklist_id, item_id, score, observation, image, is_inspected,
                       created_at, updated_at
                FROM checklist_items
            """)
            checklist_items = source_cursor.fetchall()
        
        with self.target_conn.cursor() as target_cursor:
            for item_data in checklist_items:
                (item_id, checklist_id, item_ref_id, score, observation, image,
                 is_inspected, created_at, updated_at) = item_data
                
                new_id = self.generate_uuid()
                self.id_mapping['checklist_items'][item_id] = new_id
                
                # Mapear foreign keys
                new_checklist_id = self.id_mapping['checklists'].get(checklist_id)
                new_item_ref_id = self.id_mapping['items'].get(item_ref_id)
                
                if not all([new_checklist_id, new_item_ref_id]):
                    logger.warning(f"Foreign key não encontrada para checklist_item {item_id}")
                    continue
                
                target_cursor.execute("""
                    INSERT INTO checklist_items (id, checklist_id, item_id, score, observation,
                                               image, is_inspected, is_valid, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (new_id, new_checklist_id, new_item_ref_id, score, observation,
                     image, is_inspected, None, created_at or datetime.now(),
                     updated_at or datetime.now()))
        
        self.target_conn.commit()
        logger.info(f"Migrados {len(checklist_items)} checklist_items")
    
    def migrate_checklist_item_images(self):
        """Migra dados da tabela checklist_item_images"""
        logger.info("Migrando checklist_item_images...")
        
        with self.source_conn.cursor() as source_cursor:
            source_cursor.execute("""
                SELECT id, checklist_item_id, image, observation, created_at
                FROM checklist_item_images
            """)
            images = source_cursor.fetchall()
        
        with self.target_conn.cursor() as target_cursor:
            for image_data in images:
                (image_id, checklist_item_id, image, observation, created_at) = image_data
                
                new_id = self.generate_uuid()
                
                # Mapear checklist_item_id
                new_checklist_item_id = self.id_mapping['checklist_items'].get(checklist_item_id)
                
                if not new_checklist_item_id:
                    logger.warning(f"Checklist item {checklist_item_id} não encontrado para image {image_id}")
                    continue
                
                target_cursor.execute("""
                    INSERT INTO checklist_item_images (id, checklist_item_id, image, size, format,
                                                     observation, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (new_id, new_checklist_item_id, image, None, None, observation,
                     created_at or datetime.now()))
        
        self.target_conn.commit()
        logger.info(f"Migradas {len(images)} checklist_item_images")
    
    def migrate_model_items(self):
        """Migra dados da tabela model_items"""
        logger.info("Migrando model_items...")
        
        with self.source_conn.cursor() as source_cursor:
            source_cursor.execute("""
                SELECT id, model_id, item_id, "order", created_at
                FROM model_items
            """)
            model_items = source_cursor.fetchall()
        
        with self.target_conn.cursor() as target_cursor:
            for model_item_data in model_items:
                (model_item_id, model_id, item_id, order_val, created_at) = model_item_data
                
                # Mapear foreign keys
                new_model_id = self.id_mapping['models'].get(model_id)
                new_item_id = self.id_mapping['items'].get(item_id)
                
                if not all([new_model_id, new_item_id]):
                    logger.warning(f"Foreign key não encontrada para model_item {model_item_id}")
                    continue
                
                target_cursor.execute("""
                    INSERT INTO model_items (id, model_id, item_id, created_at)
                    VALUES (%s, %s, %s, %s)
                """, (self.generate_uuid(), new_model_id, new_item_id,
                     created_at or datetime.now()))
        
        self.target_conn.commit()
        logger.info(f"Migrados {len(model_items)} model_items")
    
    def run_migration(self):
        """Executa toda a migração na ordem correta"""
        try:
            self.connect_databases()
            
            # Ordem de migração considerando dependências
            self.migrate_organizations()
            self.migrate_users()
            self.migrate_persons()
            self.migrate_properties()
            self.migrate_models()
            self.migrate_items()
            self.migrate_checklists()
            self.migrate_checklist_items()
            self.migrate_checklist_item_images()
            self.migrate_model_items()
            
            logger.info("Migração concluída com sucesso!")
            
        except Exception as e:
            logger.error(f"Erro durante a migração: {e}")
            self.target_conn.rollback()
            raise
        finally:
            self.close_connections()

def main():
    """Função principal"""
    # Configurações dos bancos - ajuste conforme necessário
    source_db_config = {
        'host': '172.24.155.34',
        'port': '5432',
        'database': 'seap_db',  # Nome do banco com o dump
        'user': 'local_user',
        'password': 'root'
    }
    
    target_db_config = {
        'host': '172.24.155.34',
        'port': '5432',
        'database': 'local_db',  # Nome do novo banco
        'user': 'local_user',
        'password': 'root'
    }
    
    # Verificar se as variáveis de ambiente estão definidas
    if os.getenv('DB_HOST'):
        source_db_config['host'] = target_db_config['host'] = os.getenv('DB_HOST')
    if os.getenv('DB_PORT'):
        source_db_config['port'] = target_db_config['port'] = os.getenv('DB_PORT')
    if os.getenv('DB_USER'):
        source_db_config['user'] = target_db_config['user'] = os.getenv('DB_USER')
    if os.getenv('DB_PASSWORD'):
        source_db_config['password'] = target_db_config['password'] = os.getenv('DB_PASSWORD')
    if os.getenv('SOURCE_DB_NAME'):
        source_db_config['database'] = os.getenv('SOURCE_DB_NAME')
    if os.getenv('TARGET_DB_NAME'):
        target_db_config['database'] = os.getenv('TARGET_DB_NAME')
    
    migrator = DataMigrator(source_db_config, target_db_config)
    migrator.run_migration()

if __name__ == "__main__":
    main()
