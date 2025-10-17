-- ============================================================================
-- Safety Business RLS Policies
-- ============================================================================
-- 
-- This file contains comprehensive Row-Level Security (RLS) policies for 
-- Safety business tables (CRM functionality) while preserving existing
-- Safety training table policies.
--
-- Key Principles:
-- 1. Preserve existing auth.users, auth.sessions, and Safety training policies
-- 2. Implement territory-based access control for Safety business data
-- 3. Use role-based permissions with Safety-specific roles
-- 4. Ensure data isolation between territories
-- 5. Support owner-based access patterns
--
-- Safety Business Tables Covered:
-- - territories, user_profiles, accounts, branches, contacts
-- - activity_logs, opportunities, sales_facts, products, projects
-- ============================================================================

-- ============================================================================
-- Helper Functions for Safety Business RLS
-- ============================================================================

-- Get user's territory ID from user_profiles table
CREATE OR REPLACE FUNCTION get_user_territory_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT territory_id 
    FROM user_profiles 
    WHERE auth_user_id = get_current_user_id()
    AND is_active = true;
$$;

-- Get user's territory ID by user ID (for cross-user checks)
CREATE OR REPLACE FUNCTION get_user_territory_id_by_user(user_id UUID)
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT territory_id 
    FROM user_profiles 
    WHERE id = user_id
    AND is_active = true;
$$;

-- Check if user has Safety business role
CREATE OR REPLACE FUNCTION has_safety_role(user_id UUID, required_role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM user_profiles 
        WHERE id = user_id 
        AND role = required_role::user_role
        AND is_active = true
    );
$$;

-- Check if user is Safety admin or manager
CREATE OR REPLACE FUNCTION is_safety_admin_or_manager(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM user_profiles 
        WHERE id = user_id 
        AND role IN ('safety_admin', 'safety_manager')
        AND is_active = true
    );
$$;

-- Check if user can access territory (same territory or admin/manager)
CREATE OR REPLACE FUNCTION can_access_territory(user_id UUID, territory_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM user_profiles up
        WHERE up.id = user_id 
        AND up.is_active = true
        AND (
            up.territory_id = territory_id OR
            up.role IN ('safety_admin', 'safety_manager')
        )
    );
$$;

-- Check if user owns record or is admin/manager
CREATE OR REPLACE FUNCTION owns_record_or_is_admin(user_id UUID, owner_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT user_id = owner_id OR is_safety_admin_or_manager(user_id);
$$;

-- ============================================================================
-- RLS Policies for Safety Business Tables
-- ============================================================================

-- Enable RLS on all Safety business tables
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TERRITORIES Table Policies
-- ============================================================================

-- All authenticated users can view active territories
CREATE POLICY "All authenticated users can view active territories"
ON territories FOR SELECT
TO public
USING (is_active = true);

-- Safety admins can manage all territories
CREATE POLICY "Safety admins can manage all territories"
ON territories FOR ALL
TO public
USING (has_safety_role(get_current_user_id(), 'safety_admin'));

-- Safety managers can view all territories
CREATE POLICY "Safety managers can view all territories"
ON territories FOR SELECT
TO public
USING (has_safety_role(get_current_user_id(), 'safety_manager'));

-- ============================================================================
-- USER_PROFILES Table Policies
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON user_profiles FOR SELECT
TO public
USING (auth_user_id = get_current_user_id());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON user_profiles FOR UPDATE
TO public
USING (auth_user_id = get_current_user_id());

-- Safety admins can manage all user profiles
CREATE POLICY "Safety admins can manage all user profiles"
ON user_profiles FOR ALL
TO public
USING (has_safety_role(get_current_user_id(), 'safety_admin'));

-- Safety managers can view profiles in their territory
CREATE POLICY "Safety managers can view territory profiles"
ON user_profiles FOR SELECT
TO public
USING (
    can_access_territory(get_current_user_id(), territory_id)
    AND has_safety_role(get_current_user_id(), 'safety_manager')
);

-- Safety coordinators can view profiles in their territory
CREATE POLICY "Safety coordinators can view territory profiles"
ON user_profiles FOR SELECT
TO public
USING (
    can_access_territory(get_current_user_id(), territory_id)
    AND has_safety_role(get_current_user_id(), 'safety_coordinator')
);

-- ============================================================================
-- ACCOUNTS Table Policies
-- ============================================================================

-- Users can view accounts in their territory
CREATE POLICY "Users can view territory accounts"
ON accounts FOR SELECT
TO public
USING (
    can_access_territory(get_current_user_id(), territory_id)
    AND is_active = true
);

-- Users can view accounts they own
CREATE POLICY "Users can view owned accounts"
ON accounts FOR SELECT
TO public
USING (owner_id = get_current_user_id());

-- Safety admins can manage all accounts
CREATE POLICY "Safety admins can manage all accounts"
ON accounts FOR ALL
TO public
USING (has_safety_role(get_current_user_id(), 'safety_admin'));

-- Safety managers can manage territory accounts
CREATE POLICY "Safety managers can manage territory accounts"
ON accounts FOR ALL
TO public
USING (
    can_access_territory(get_current_user_id(), territory_id)
    AND has_safety_role(get_current_user_id(), 'safety_manager')
);

-- Safety reps can create and update accounts in their territory
CREATE POLICY "Safety reps can manage territory accounts"
ON accounts FOR ALL
TO public
USING (
    can_access_territory(get_current_user_id(), territory_id)
    AND has_safety_role(get_current_user_id(), 'safety_rep')
);

-- ============================================================================
-- BRANCHES Table Policies
-- ============================================================================

-- Users can view branches of accounts they can access
CREATE POLICY "Users can view accessible account branches"
ON branches FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = branches.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
        AND a.is_active = true
    )
    AND is_active = true
);

-- Safety admins can manage all branches
CREATE POLICY "Safety admins can manage all branches"
ON branches FOR ALL
TO public
USING (has_safety_role(get_current_user_id(), 'safety_admin'));

-- Safety managers can manage territory branches
CREATE POLICY "Safety managers can manage territory branches"
ON branches FOR ALL
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = branches.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
    )
    AND has_safety_role(get_current_user_id(), 'safety_manager')
);

-- ============================================================================
-- CONTACTS Table Policies
-- ============================================================================

-- Users can view contacts of accounts they can access
CREATE POLICY "Users can view accessible account contacts"
ON contacts FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = contacts.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
        AND a.is_active = true
    )
    AND is_active = true
);

-- Users can view contacts they own
CREATE POLICY "Users can view owned contacts"
ON contacts FOR SELECT
TO public
USING (owner_id = get_current_user_id());

-- Safety admins can manage all contacts
CREATE POLICY "Safety admins can manage all contacts"
ON contacts FOR ALL
TO public
USING (has_safety_role(get_current_user_id(), 'safety_admin'));

-- Safety managers can manage territory contacts
CREATE POLICY "Safety managers can manage territory contacts"
ON contacts FOR ALL
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = contacts.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
    )
    AND has_safety_role(get_current_user_id(), 'safety_manager')
);

-- Safety reps can create and update contacts in their territory
CREATE POLICY "Safety reps can manage territory contacts"
ON contacts FOR ALL
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = contacts.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
    )
    AND has_safety_role(get_current_user_id(), 'safety_rep')
);

-- ============================================================================
-- ACTIVITY_LOGS Table Policies
-- ============================================================================

-- Users can view their own activities
CREATE POLICY "Users can view own activities"
ON activity_logs FOR SELECT
TO public
USING (user_id = get_current_user_id());

-- Users can create their own activities
CREATE POLICY "Users can create own activities"
ON activity_logs FOR INSERT
TO public
WITH CHECK (user_id = get_current_user_id());

-- Users can update their own activities
CREATE POLICY "Users can update own activities"
ON activity_logs FOR UPDATE
TO public
USING (user_id = get_current_user_id());

-- Users can view activities for accounts they can access
CREATE POLICY "Users can view territory account activities"
ON activity_logs FOR SELECT
TO public
USING (
    account_id IS NOT NULL
    AND EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = activity_logs.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
        AND a.is_active = true
    )
);

-- Safety admins can manage all activities
CREATE POLICY "Safety admins can manage all activities"
ON activity_logs FOR ALL
TO public
USING (has_safety_role(get_current_user_id(), 'safety_admin'));

-- Safety managers can manage territory activities
CREATE POLICY "Safety managers can manage territory activities"
ON activity_logs FOR ALL
TO public
USING (
    (
        account_id IS NULL OR
        EXISTS (
            SELECT 1 FROM accounts a
            WHERE a.id = activity_logs.account_id
            AND can_access_territory(get_current_user_id(), a.territory_id)
        )
    )
    AND has_safety_role(get_current_user_id(), 'safety_manager')
);

-- ============================================================================
-- OPPORTUNITIES Table Policies
-- ============================================================================

-- Users can view opportunities for accounts they can access
CREATE POLICY "Users can view accessible account opportunities"
ON opportunities FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = opportunities.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
        AND a.is_active = true
    )
    AND is_active = true
);

-- Users can view opportunities they own
CREATE POLICY "Users can view owned opportunities"
ON opportunities FOR SELECT
TO public
USING (owner_id = get_current_user_id());

-- Safety admins can manage all opportunities
CREATE POLICY "Safety admins can manage all opportunities"
ON opportunities FOR ALL
TO public
USING (has_safety_role(get_current_user_id(), 'safety_admin'));

-- Safety managers can manage territory opportunities
CREATE POLICY "Safety managers can manage territory opportunities"
ON opportunities FOR ALL
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = opportunities.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
    )
    AND has_safety_role(get_current_user_id(), 'safety_manager')
);

-- Safety reps can create and update opportunities in their territory
CREATE POLICY "Safety reps can manage territory opportunities"
ON opportunities FOR ALL
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = opportunities.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
    )
    AND has_safety_role(get_current_user_id(), 'safety_rep')
);

-- ============================================================================
-- SALES_FACTS Table Policies
-- ============================================================================

-- Users can view sales facts for accounts they can access
CREATE POLICY "Users can view accessible account sales facts"
ON sales_facts FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = sales_facts.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
        AND a.is_active = true
    )
    AND is_active = true
);

-- Users can view their own sales facts
CREATE POLICY "Users can view own sales facts"
ON sales_facts FOR SELECT
TO public
USING (user_id = get_current_user_id());

-- Safety admins can manage all sales facts
CREATE POLICY "Safety admins can manage all sales facts"
ON sales_facts FOR ALL
TO public
USING (has_safety_role(get_current_user_id(), 'safety_admin'));

-- Safety managers can manage territory sales facts
CREATE POLICY "Safety managers can manage territory sales facts"
ON sales_facts FOR ALL
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = sales_facts.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
    )
    AND has_safety_role(get_current_user_id(), 'safety_manager')
);

-- ============================================================================
-- PRODUCTS Table Policies
-- ============================================================================

-- Users can view products in their territory
CREATE POLICY "Users can view territory products"
ON products FOR SELECT
TO public
USING (
    can_access_territory(get_current_user_id(), territory_id)
    AND is_active = true
);

-- Safety admins can manage all products
CREATE POLICY "Safety admins can manage all products"
ON products FOR ALL
TO public
USING (has_safety_role(get_current_user_id(), 'safety_admin'));

-- Safety managers can manage territory products
CREATE POLICY "Safety managers can manage territory products"
ON products FOR ALL
TO public
USING (
    can_access_territory(get_current_user_id(), territory_id)
    AND has_safety_role(get_current_user_id(), 'safety_manager')
);

-- ============================================================================
-- PROJECTS Table Policies
-- ============================================================================

-- Users can view projects for accounts they can access
CREATE POLICY "Users can view accessible account projects"
ON projects FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = projects.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
        AND a.is_active = true
    )
    AND is_active = true
);

-- Users can view projects they own
CREATE POLICY "Users can view owned projects"
ON projects FOR SELECT
TO public
USING (owner_id = get_current_user_id());

-- Safety admins can manage all projects
CREATE POLICY "Safety admins can manage all projects"
ON projects FOR ALL
TO public
USING (has_safety_role(get_current_user_id(), 'safety_admin'));

-- Safety managers can manage territory projects
CREATE POLICY "Safety managers can manage territory projects"
ON projects FOR ALL
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = projects.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
    )
    AND has_safety_role(get_current_user_id(), 'safety_manager')
);

-- Safety coordinators can create and update projects in their territory
CREATE POLICY "Safety coordinators can manage territory projects"
ON projects FOR ALL
TO public
USING (
    EXISTS (
        SELECT 1 FROM accounts a
        WHERE a.id = projects.account_id
        AND can_access_territory(get_current_user_id(), a.territory_id)
    )
    AND has_safety_role(get_current_user_id(), 'safety_coordinator')
);

-- ============================================================================
-- Comments and Documentation
-- ============================================================================

COMMENT ON FUNCTION get_user_territory_id() IS 'Returns the territory ID for the current authenticated user';
COMMENT ON FUNCTION get_user_territory_id_by_user(UUID) IS 'Returns the territory ID for a specific user';
COMMENT ON FUNCTION has_safety_role(UUID, TEXT) IS 'Checks if a user has a specific Safety business role';
COMMENT ON FUNCTION is_safety_admin_or_manager(UUID) IS 'Checks if a user is a Safety admin or manager';
COMMENT ON FUNCTION can_access_territory(UUID, UUID) IS 'Checks if a user can access a specific territory';
COMMENT ON FUNCTION owns_record_or_is_admin(UUID, UUID) IS 'Checks if a user owns a record or is an admin';

-- ============================================================================
-- End of Safety Business RLS Policies
-- ============================================================================
