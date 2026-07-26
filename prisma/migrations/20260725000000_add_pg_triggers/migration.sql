-- ============================================================
-- MIGRATION: 20260725000000_add_pg_triggers
-- Project:   Senza Luce Safaris
-- Author:    Principal PostgreSQL Engineer
-- Date:      2026-07-25
--
-- SUMMARY
--   Adds 5 PostgreSQL triggers and 2 supporting tables.
--   All operations are idempotent (safe to re-run).
--
-- SCOPE
--   trg_tours_rating_on_review   → maintains Tour.rating + reviewCount
--   trg_review_status_audit      → DB audit log for review status changes
--   trg_newsletter_stats         → subscriber counter table
--   trg_booking_status_guard     → enforces booking state machine
--   trg_transfer_status_guard    → validates transfer status values
--
-- EXCLUDED (by design)
--   Notification triggers    → would double-fire sendAdminPush()
--   Email triggers           → violates no-external-API rule
--   AdminAuditLog triggers   → userId FK not available in trigger context
--   User initialization      → no target tables in schema
--
-- ROLLBACK: See commented section at bottom.
-- ============================================================

BEGIN;

-- ============================================================
-- SUPPORTING TABLES
-- ============================================================

-- Table 1: Lightweight review status audit log
-- Separate from admin_audit_logs (that table requires userId FK
-- which is unavailable inside a trigger execution context).
CREATE TABLE IF NOT EXISTS sls_review_audit_log (
    id              uuid        NOT NULL DEFAULT gen_random_uuid(),
    review_id       text        NOT NULL,
    tour_id         text        NOT NULL,
    old_status      text,
    new_status      text        NOT NULL,
    customer_name   text,
    customer_email  text,
    rating          int,
    changed_at      timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT sls_review_audit_log_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_sls_review_audit_review_id
    ON sls_review_audit_log (review_id);

CREATE INDEX IF NOT EXISTS idx_sls_review_audit_changed_at
    ON sls_review_audit_log (changed_at DESC);

COMMENT ON TABLE sls_review_audit_log IS
    'DB-level audit trail for review status transitions. '
    'Written by trigger. Does not require admin userId FK.';

-- Table 2: Newsletter subscriber statistics singleton
CREATE TABLE IF NOT EXISTS sls_newsletter_stats (
    id              int         NOT NULL DEFAULT 1,
    total           int         NOT NULL DEFAULT 0,
    active          int         NOT NULL DEFAULT 0,
    inactive        int         NOT NULL DEFAULT 0,
    last_updated    timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT sls_newsletter_stats_pkey PRIMARY KEY (id),
    CONSTRAINT sls_newsletter_stats_singleton CHECK (id = 1)
);

INSERT INTO sls_newsletter_stats (id, total, active, inactive)
VALUES (1, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE sls_newsletter_stats IS
    'Singleton row maintained by trigger. Eliminates live COUNT(*) '
    'from dashboard API hot path.';

-- ============================================================
-- FUNCTION 1: sls_update_tour_rating
-- Recalculates Tour.rating and Tour.reviewCount from approved
-- reviews on INSERT / UPDATE / DELETE.
-- ============================================================
CREATE OR REPLACE FUNCTION sls_update_tour_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_tour_id   text;
    v_avg       numeric(4,2);
    v_count     int;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_tour_id := OLD."tourId";
    ELSE
        v_tour_id := NEW."tourId";
        -- On tour_id change, also recalculate the OLD tour
        IF TG_OP = 'UPDATE' AND OLD."tourId" IS DISTINCT FROM NEW."tourId" THEN
            SELECT
                COALESCE(ROUND((AVG(rating) * 2)::numeric, 2), 0),
                COUNT(*)
            INTO v_avg, v_count
            FROM reviews
            WHERE "tourId" = OLD."tourId"
              AND "isApproved" = true;

            UPDATE tours
            SET rating        = v_avg,
                "reviewCount" = v_count,
                "updatedAt"   = now()
            WHERE id = OLD."tourId";
        END IF;
    END IF;

    SELECT
        COALESCE(ROUND((AVG(rating) * 2)::numeric, 2), 0),
        COUNT(*)
    INTO v_avg, v_count
    FROM reviews
    WHERE "tourId" = v_tour_id
      AND "isApproved" = true;

    UPDATE tours
    SET rating        = v_avg,
        "reviewCount" = v_count,
        "updatedAt"   = now()
    WHERE id = v_tour_id;

    RETURN COALESCE(NEW, OLD);
END;
$$;

COMMENT ON FUNCTION sls_update_tour_rating() IS
    'Maintains Tour.rating and Tour.reviewCount from approved reviews.';

DROP TRIGGER IF EXISTS trg_tours_rating_on_review ON reviews;

CREATE TRIGGER trg_tours_rating_on_review
    AFTER INSERT OR UPDATE OF rating, "isApproved", "tourId" OR DELETE
    ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION sls_update_tour_rating();

COMMENT ON TRIGGER trg_tours_rating_on_review ON reviews IS
    'Keeps tours.rating + tours.reviewCount in sync with approved reviews.';

-- ============================================================
-- FUNCTION 2: sls_log_review_status_change
-- Records review status transitions into sls_review_audit_log.
-- ============================================================
CREATE OR REPLACE FUNCTION sls_log_review_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO sls_review_audit_log (
            review_id, tour_id, old_status, new_status,
            customer_name, customer_email, rating, changed_at
        ) VALUES (
            NEW.id, NEW."tourId",
            OLD.status::text, NEW.status::text,
            NEW."customerName", NEW."customerEmail",
            NEW.rating, now()
        );
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION sls_log_review_status_change() IS
    'Writes to sls_review_audit_log on every review status change.';

DROP TRIGGER IF EXISTS trg_review_status_audit ON reviews;

CREATE TRIGGER trg_review_status_audit
    AFTER UPDATE OF status
    ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION sls_log_review_status_change();

COMMENT ON TRIGGER trg_review_status_audit ON reviews IS
    'Audit trail for review status transitions → sls_review_audit_log.';

-- ============================================================
-- FUNCTION 3: sls_update_newsletter_stats
-- Maintains the singleton row in sls_newsletter_stats.
-- ============================================================
CREATE OR REPLACE FUNCTION sls_update_newsletter_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total    int;
    v_active   int;
    v_inactive int;
BEGIN
    SELECT
        COUNT(*),
        COUNT(*) FILTER (WHERE "isActive" = true),
        COUNT(*) FILTER (WHERE "isActive" = false)
    INTO v_total, v_active, v_inactive
    FROM newsletters;

    UPDATE sls_newsletter_stats
    SET total        = v_total,
        active       = v_active,
        inactive     = v_inactive,
        last_updated = now()
    WHERE id = 1;

    RETURN COALESCE(NEW, OLD);
END;
$$;

COMMENT ON FUNCTION sls_update_newsletter_stats() IS
    'Keeps sls_newsletter_stats accurate after every subscriber change.';

DROP TRIGGER IF EXISTS trg_newsletter_stats ON newsletters;

CREATE TRIGGER trg_newsletter_stats
    AFTER INSERT OR UPDATE OF "isActive"
    ON newsletters
    FOR EACH ROW
    EXECUTE FUNCTION sls_update_newsletter_stats();

COMMENT ON TRIGGER trg_newsletter_stats ON newsletters IS
    'Maintains sls_newsletter_stats singleton for fast dashboard reads.';

-- ============================================================
-- FUNCTION 4: sls_enforce_booking_status_transition
-- Enforces booking state machine at the database layer.
--
-- Valid transitions:
--   PENDING     → CONFIRMED, CANCELLED
--   CONFIRMED   → IN_PROGRESS, CANCELLED
--   IN_PROGRESS → COMPLETED, CANCELLED, NO_SHOW
--   COMPLETED   → (terminal)
--   CANCELLED   → (terminal)
--   NO_SHOW     → (terminal)
-- ============================================================
CREATE OR REPLACE FUNCTION sls_enforce_booking_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_allowed text[];
BEGIN
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    CASE OLD.status::text
        WHEN 'PENDING'     THEN v_allowed := ARRAY['CONFIRMED', 'CANCELLED'];
        WHEN 'CONFIRMED'   THEN v_allowed := ARRAY['IN_PROGRESS', 'CANCELLED'];
        WHEN 'IN_PROGRESS' THEN v_allowed := ARRAY['COMPLETED', 'CANCELLED', 'NO_SHOW'];
        WHEN 'COMPLETED'   THEN v_allowed := ARRAY[]::text[];
        WHEN 'CANCELLED'   THEN v_allowed := ARRAY[]::text[];
        WHEN 'NO_SHOW'     THEN v_allowed := ARRAY[]::text[];
        ELSE                    v_allowed := ARRAY[]::text[];
    END CASE;

    IF NOT (NEW.status::text = ANY(v_allowed)) THEN
        RAISE EXCEPTION
            'Invalid booking status transition: % → %. Booking: %. Allowed: [%]',
            OLD.status, NEW.status, OLD."bookingRef",
            array_to_string(v_allowed, ', ')
            USING ERRCODE = 'P0001';
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION sls_enforce_booking_status_transition() IS
    'Enforces booking state machine. Raises P0001 on invalid transition.';

DROP TRIGGER IF EXISTS trg_booking_status_guard ON bookings;

CREATE TRIGGER trg_booking_status_guard
    BEFORE UPDATE OF status
    ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION sls_enforce_booking_status_transition();

COMMENT ON TRIGGER trg_booking_status_guard ON bookings IS
    'Enforces booking state machine transitions at DB level.';

-- ============================================================
-- FUNCTION 5: sls_enforce_transfer_status
-- VehicleTransfer.status is a plain String (not a PG enum).
-- Enforces allowed values: pending, confirmed, cancelled.
-- ============================================================
CREATE OR REPLACE FUNCTION sls_enforce_transfer_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.status NOT IN ('pending', 'confirmed', 'cancelled') THEN
        RAISE EXCEPTION
            'Invalid vehicle_transfer status: %. Allowed: pending, confirmed, cancelled',
            NEW.status
            USING ERRCODE = 'P0001';
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION sls_enforce_transfer_status() IS
    'Guards vehicle_transfers.status against invalid string values.';

DROP TRIGGER IF EXISTS trg_transfer_status_guard ON vehicle_transfers;

CREATE TRIGGER trg_transfer_status_guard
    BEFORE INSERT OR UPDATE OF status
    ON vehicle_transfers
    FOR EACH ROW
    EXECUTE FUNCTION sls_enforce_transfer_status();

COMMENT ON TRIGGER trg_transfer_status_guard ON vehicle_transfers IS
    'Validates vehicle_transfers.status values at DB layer.';

-- ============================================================
-- BOOTSTRAP: Sync existing data into stat tables
-- ============================================================

-- Sync newsletter stats from existing rows
UPDATE sls_newsletter_stats
SET total        = (SELECT COUNT(*) FROM newsletters),
    active       = (SELECT COUNT(*) FROM newsletters WHERE "isActive" = true),
    inactive     = (SELECT COUNT(*) FROM newsletters WHERE "isActive" = false),
    last_updated = now()
WHERE id = 1;

-- Sync tour ratings from existing approved reviews
UPDATE tours t
SET rating        = COALESCE(
        (SELECT ROUND((AVG(r.rating) * 2)::numeric, 2)
         FROM reviews r WHERE r."tourId" = t.id AND r."isApproved" = true), 0),
    "reviewCount" = COALESCE(
        (SELECT COUNT(*) FROM reviews r
         WHERE r."tourId" = t.id AND r."isApproved" = true), 0),
    "updatedAt"   = now();

-- ============================================================
-- VALIDATION
-- ============================================================
DO $$
DECLARE v_count int;
BEGIN
    SELECT COUNT(DISTINCT trigger_name) INTO v_count
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
      AND trigger_name IN (
        'trg_tours_rating_on_review',
        'trg_review_status_audit',
        'trg_newsletter_stats',
        'trg_booking_status_guard',
        'trg_transfer_status_guard'
      );

    IF v_count <> 5 THEN
        RAISE EXCEPTION 'Validation failed: expected 5 distinct triggers, found %', v_count;
    END IF;

    RAISE NOTICE 'Migration 20260725000000 validated: % triggers active.', v_count;
END;
$$;

COMMIT;

-- ============================================================
-- ROLLBACK SCRIPT (run manually if needed)
-- ============================================================
/*
BEGIN;
DROP TRIGGER IF EXISTS trg_tours_rating_on_review     ON reviews;
DROP TRIGGER IF EXISTS trg_review_status_audit         ON reviews;
DROP TRIGGER IF EXISTS trg_newsletter_stats            ON newsletters;
DROP TRIGGER IF EXISTS trg_booking_status_guard        ON bookings;
DROP TRIGGER IF EXISTS trg_transfer_status_guard       ON vehicle_transfers;

DROP FUNCTION IF EXISTS sls_update_tour_rating();
DROP FUNCTION IF EXISTS sls_log_review_status_change();
DROP FUNCTION IF EXISTS sls_update_newsletter_stats();
DROP FUNCTION IF EXISTS sls_enforce_booking_status_transition();
DROP FUNCTION IF EXISTS sls_enforce_transfer_status();

-- WARNING: destroys audit log data
DROP TABLE IF EXISTS sls_review_audit_log;
DROP TABLE IF EXISTS sls_newsletter_stats;
COMMIT;
*/
