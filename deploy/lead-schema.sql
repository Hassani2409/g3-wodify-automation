-- Apply using the Supabase migration role, after provisioning g3_lead_api securely.
CREATE SCHEMA IF NOT EXISTS g3_leads;
SET search_path TO g3_leads;

CREATE TABLE IF NOT EXISTS crm_contacts (
	id VARCHAR(36) NOT NULL, 
	email VARCHAR(254) NOT NULL, 
	first_name VARCHAR(100) NOT NULL, 
	last_name VARCHAR(100) NOT NULL, 
	phone VARCHAR(50), 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id)
)

;
CREATE UNIQUE INDEX IF NOT EXISTS ix_crm_contacts_email ON crm_contacts (email);
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS backend_only ON crm_contacts;
CREATE POLICY backend_only ON crm_contacts TO g3_lead_api USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS crm_intake_windows (
	bucket VARCHAR(12) NOT NULL, 
	count INTEGER NOT NULL, 
	PRIMARY KEY (bucket)
)

;
ALTER TABLE crm_intake_windows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS backend_only ON crm_intake_windows;
CREATE POLICY backend_only ON crm_intake_windows TO g3_lead_api USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS crm_inquiries (
	id VARCHAR(36) NOT NULL, 
	contact_id VARCHAR(36) NOT NULL, 
	idempotency_key VARCHAR(128) NOT NULL, 
	payload_hash VARCHAR(64) NOT NULL, 
	payload JSON NOT NULL, 
	status VARCHAR(20) NOT NULL, 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(contact_id) REFERENCES crm_contacts (id), 
	UNIQUE (idempotency_key)
)

;
CREATE INDEX IF NOT EXISTS ix_crm_inquiries_contact_id ON crm_inquiries (contact_id);
ALTER TABLE crm_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS backend_only ON crm_inquiries;
CREATE POLICY backend_only ON crm_inquiries TO g3_lead_api USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS crm_automation_previews (
	id VARCHAR(36) NOT NULL, 
	inquiry_id VARCHAR(36) NOT NULL, 
	kind VARCHAR(30) NOT NULL, 
	state VARCHAR(20) NOT NULL, 
	recipient VARCHAR(254) NOT NULL, 
	subject VARCHAR(200) NOT NULL, 
	body TEXT NOT NULL, 
	created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(inquiry_id) REFERENCES crm_inquiries (id)
)

;
CREATE INDEX IF NOT EXISTS ix_crm_automation_previews_inquiry_id ON crm_automation_previews (inquiry_id);
ALTER TABLE crm_automation_previews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS backend_only ON crm_automation_previews;
CREATE POLICY backend_only ON crm_automation_previews TO g3_lead_api USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS crm_sync_jobs (
	id VARCHAR(36) NOT NULL, 
	inquiry_id VARCHAR(36) NOT NULL, 
	provider VARCHAR(30) NOT NULL, 
	mode VARCHAR(10) NOT NULL, 
	state VARCHAR(20) NOT NULL, 
	attempts INTEGER NOT NULL, 
	next_attempt_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
	lease_token VARCHAR(36), 
	lease_until TIMESTAMP WITHOUT TIME ZONE, 
	remote_id VARCHAR(100), 
	last_error VARCHAR(100), 
	PRIMARY KEY (id), 
	UNIQUE (inquiry_id), 
	FOREIGN KEY(inquiry_id) REFERENCES crm_inquiries (id)
)

;
CREATE INDEX IF NOT EXISTS ix_crm_sync_jobs_state ON crm_sync_jobs (state);
CREATE INDEX IF NOT EXISTS ix_crm_sync_jobs_next_attempt_at ON crm_sync_jobs (next_attempt_at);
ALTER TABLE crm_sync_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS backend_only ON crm_sync_jobs;
CREATE POLICY backend_only ON crm_sync_jobs TO g3_lead_api USING (true) WITH CHECK (true);
GRANT USAGE ON SCHEMA g3_leads TO g3_lead_api;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA g3_leads TO g3_lead_api;
REVOKE ALL ON SCHEMA g3_leads FROM anon, authenticated;
