-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT,
    "avatar" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "persons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "persons_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organization_id" TEXT NOT NULL,
    "person_id" TEXT,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "type" TEXT NOT NULL DEFAULT 'OWN',
    "location" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "properties_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "properties_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "item_id" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "checklists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sid" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "organization_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "user_id" TEXT,
    "created_by" TEXT,
    "person_id" TEXT,
    "score" REAL NOT NULL DEFAULT 0,
    "finished_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "checklists_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "checklists_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "checklists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "checklists_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "checklists_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "checklists_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "model_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "model_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "order" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "model_items_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "model_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "checklist_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checklist_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "score" INTEGER,
    "observation" TEXT,
    "image" TEXT,
    "is_inspected" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "checklist_items_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "checklists" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "checklist_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "checklist_item_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checklist_item_id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "observation" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "checklist_item_images_checklist_item_id_fkey" FOREIGN KEY ("checklist_item_id") REFERENCES "checklist_items" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_name_key" ON "organizations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "persons_email_key" ON "persons"("email");

-- CreateIndex
CREATE UNIQUE INDEX "models_id_key" ON "models"("id");

-- CreateIndex
CREATE UNIQUE INDEX "items_id_key" ON "items"("id");

-- CreateIndex
CREATE UNIQUE INDEX "checklists_id_key" ON "checklists"("id");
