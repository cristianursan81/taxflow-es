-- Delete any duplicate verification rows (keep the most recent per identifier) before adding unique constraint.
-- Verification rows are short-lived (e.g. OTP); duplicates can occur if create succeeded but delete failed.
DELETE FROM "verification" a
USING "verification" b
WHERE a."identifier" = b."identifier"
  AND a."created_at" < b."created_at";

-- CreateIndex
CREATE UNIQUE INDEX "verification_identifier_key" ON "verification"("identifier");
