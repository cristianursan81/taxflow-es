-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "stripe_customer_id" TEXT,
    "membership_plan" TEXT,
    "membership_expires_at" DATETIME,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "storage_used" INTEGER NOT NULL DEFAULT 0,
    "storage_limit" INTEGER NOT NULL DEFAULT -1,
    "ai_balance" INTEGER NOT NULL DEFAULT 0,
    "business_name" TEXT,
    "business_address" TEXT,
    "business_bank_details" TEXT,
    "business_logo" TEXT
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" DATETIME,
    "refresh_token_expires_at" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "value" TEXT,
    CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#000000',
    "llm_prompt" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#000000',
    "llm_prompt" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fields" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',
    "llm_prompt" TEXT,
    "options" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_visible_in_list" BOOLEAN NOT NULL DEFAULT false,
    "is_visible_in_analysis" BOOLEAN NOT NULL DEFAULT false,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "is_extra" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "fields_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "metadata" JSONB,
    "is_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "is_splitted" BOOLEAN NOT NULL DEFAULT false,
    "cached_parse_result" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "merchant" TEXT,
    "total" INTEGER,
    "currency_code" TEXT,
    "converted_total" INTEGER,
    "converted_currency_code" TEXT,
    "type" TEXT DEFAULT 'expense',
    "items" JSONB NOT NULL DEFAULT [],
    "note" TEXT,
    "files" JSONB NOT NULL DEFAULT [],
    "extra" JSONB,
    "category_code" TEXT,
    "project_code" TEXT,
    "issued_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "text" TEXT,
    "supplier_name" TEXT,
    "supplier_tax_id" TEXT,
    "invoice_number" TEXT,
    "invoice_type" TEXT,
    "base_amount" INTEGER,
    "vat_rate" DECIMAL,
    "vat_amount" INTEGER,
    "irpf_rate" DECIMAL,
    "irpf_amount" INTEGER,
    "gross_total" INTEGER,
    "deductible" BOOLEAN DEFAULT true,
    "tax_validation_status" TEXT DEFAULT 'pending',
    CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_category_code_user_id_fkey" FOREIGN KEY ("category_code", "user_id") REFERENCES "categories" ("code", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_project_code_user_id_fkey" FOREIGN KEY ("project_code", "user_id") REFERENCES "projects" ("code", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "currencies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "app_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "app" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    CONSTRAINT "app_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB,
    "current" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "settings_user_id_code_key" ON "settings"("user_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_user_id_code_key" ON "categories"("user_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "projects_user_id_code_key" ON "projects"("user_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "fields_user_id_code_key" ON "fields"("user_id", "code");

-- CreateIndex
CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");

-- CreateIndex
CREATE INDEX "transactions_project_code_idx" ON "transactions"("project_code");

-- CreateIndex
CREATE INDEX "transactions_category_code_idx" ON "transactions"("category_code");

-- CreateIndex
CREATE INDEX "transactions_issued_at_idx" ON "transactions"("issued_at");

-- CreateIndex
CREATE INDEX "transactions_name_idx" ON "transactions"("name");

-- CreateIndex
CREATE INDEX "transactions_merchant_idx" ON "transactions"("merchant");

-- CreateIndex
CREATE INDEX "transactions_total_idx" ON "transactions"("total");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_user_id_code_key" ON "currencies"("user_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "app_data_user_id_app_key" ON "app_data"("user_id", "app");

-- CreateIndex
CREATE INDEX "progress_user_id_idx" ON "progress"("user_id");
