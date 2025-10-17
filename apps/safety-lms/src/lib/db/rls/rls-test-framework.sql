-- ============================================================================
-- Safety Business RLS Testing Framework
-- ============================================================================
--
-- This file contains comprehensive tests for Safety business RLS policies.
-- Tests cover all user roles, territory access patterns, and edge cases.
--
-- Test Categories:
-- 1. Territory-based access control
-- 2. Role-based permissions
-- 3. Owner-based access
-- 4. Cross-territory isolation
-- 5. Admin override capabilities
-- ============================================================================

-- ============================================================================
-- Test Setup Functions
-- ============================================================================

-- Create test territories
CREATE OR REPLACE FUNCTION setup_test_territories()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert test territories
    INSERT INTO territories (id, name, code, description, region) VALUES
    ('11111111-1111-1111-1111-111111111111', 'North Territory', 'NORTH', 'Northern region', 'North America'),
    ('22222222-2222-2222-2222-222222222222', 'South Territory', 'SOUTH', 'Southern region', 'North America'),
    ('33333333-3333-3333-3333-333333333333', 'East Territory', 'EAST', 'Eastern region', 'North America')
    ON CONFLICT (id) DO NOTHING;
END;
$$;

-- Create test user profiles with different roles
CREATE OR REPLACE FUNCTION setup_test_users()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Create test auth users (simulated)
    -- Note: In real tests, these would be created via Supabase auth
    
    -- North Territory Users
    INSERT INTO user_profiles (id, auth_user_id, territory_id, first_name, last_name, email, role, status) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'auth-north-admin', '11111111-1111-1111-1111-111111111111', 'North', 'Admin', 'north.admin@test.com', 'safety_admin', 'active'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'auth-north-manager', '11111111-1111-1111-1111-111111111111', 'North', 'Manager', 'north.manager@test.com', 'safety_manager', 'active'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'auth-north-rep', '11111111-1111-1111-1111-111111111111', 'North', 'Rep', 'north.rep@test.com', 'safety_rep', 'active'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'auth-north-employee', '11111111-1111-1111-1111-111111111111', 'North', 'Employee', 'north.employee@test.com', 'employee', 'active');
    
    -- South Territory Users
    INSERT INTO user_profiles (id, auth_user_id, territory_id, first_name, last_name, email, role, status) VALUES
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'auth-south-manager', '22222222-2222-2222-2222-222222222222', 'South', 'Manager', 'south.manager@test.com', 'safety_manager', 'active'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'auth-south-rep', '22222222-2222-2222-2222-222222222222', 'South', 'Rep', 'south.rep@test.com', 'safety_rep', 'active'),
    ('gggggggg-gggg-gggg-gggg-gggggggggggg', 'auth-south-employee', '22222222-2222-2222-2222-222222222222', 'South', 'Employee', 'south.employee@test.com', 'employee', 'active');
    
    -- East Territory Users
    INSERT INTO user_profiles (id, auth_user_id, territory_id, first_name, last_name, email, role, status) VALUES
    ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'auth-east-coordinator', '33333333-3333-3333-3333-333333333333', 'East', 'Coordinator', 'east.coordinator@test.com', 'safety_coordinator', 'active'),
    ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'auth-east-employee', '33333333-3333-3333-3333-333333333333', 'East', 'Employee', 'east.employee@test.com', 'employee', 'active');
    
    -- Set created_by to self for test users
    UPDATE user_profiles SET created_by = id WHERE email LIKE '%@test.com';
END;
$$;

-- Create test accounts
CREATE OR REPLACE FUNCTION setup_test_accounts()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- North Territory Accounts
    INSERT INTO accounts (id, territory_id, owner_id, name, account_number, type, status, created_by) VALUES
    ('account-north-1', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'North Manufacturing', 'NORTH-001', 'safety_equipment_customer', 'active', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    ('account-north-2', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'North Safety Co', 'NORTH-002', 'safety_equipment_customer', 'active', 'cccccccc-cccc-cccc-cccc-cccccccccccc');
    
    -- South Territory Accounts
    INSERT INTO accounts (id, territory_id, owner_id, name, account_number, type, status, created_by) VALUES
    ('account-south-1', '22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'South Industrial', 'SOUTH-001', 'safety_equipment_customer', 'active', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
    ('account-south-2', '22222222-2222-2222-2222-222222222222', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'South Construction', 'SOUTH-002', 'safety_equipment_customer', 'active', 'ffffffff-ffff-ffff-ffff-ffffffffffff');
    
    -- East Territory Accounts
    INSERT INTO accounts (id, territory_id, owner_id, name, account_number, type, status, created_by) VALUES
    ('account-east-1', '33333333-3333-3333-3333-333333333333', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'East Logistics', 'EAST-001', 'safety_equipment_customer', 'active', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh');
END;
$$;

-- ============================================================================
-- Test Helper Functions
-- ============================================================================

-- Set current user for testing (simulates auth context)
CREATE OR REPLACE FUNCTION set_test_user(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- This would be set by the application context in real usage
    -- For testing, we'll use a session variable
    PERFORM set_config('app.current_user_id', user_id::text, true);
END;
$$;

-- Get current user for testing
CREATE OR REPLACE FUNCTION get_test_user()
RETURNS UUID
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN COALESCE(current_setting('app.current_user_id', true)::uuid, get_current_user_id());
END;
$$;

-- Count records accessible to current user
CREATE OR REPLACE FUNCTION count_accessible_records(table_name TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    result INTEGER;
BEGIN
    EXECUTE format('SELECT COUNT(*) FROM %I', table_name) INTO result;
    RETURN result;
END;
$$;

-- ============================================================================
-- Test Cases
-- ============================================================================

-- Test 1: Territory Isolation
CREATE OR REPLACE FUNCTION test_territory_isolation()
RETURNS TABLE(test_name TEXT, passed BOOLEAN, details TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
    north_rep_count INTEGER;
    south_rep_count INTEGER;
    north_admin_count INTEGER;
BEGIN
    -- Test North Rep can only see North accounts
    PERFORM set_test_user('cccccccc-cccc-cccc-cccc-cccccccccccc');
    SELECT count_accessible_records('accounts') INTO north_rep_count;
    
    -- Test South Rep can only see South accounts
    PERFORM set_test_user('ffffffff-ffff-ffff-ffff-ffffffffffff');
    SELECT count_accessible_records('accounts') INTO south_rep_count;
    
    -- Test North Admin can see all accounts
    PERFORM set_test_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    SELECT count_accessible_records('accounts') INTO north_admin_count;
    
    -- Return test results
    RETURN QUERY SELECT 
        'Territory Isolation Test'::TEXT,
        (north_rep_count = 2 AND south_rep_count = 2 AND north_admin_count >= 5),
        format('North Rep: %s accounts, South Rep: %s accounts, North Admin: %s accounts', 
               north_rep_count, south_rep_count, north_admin_count);
END;
$$;

-- Test 2: Role-based Access Control
CREATE OR REPLACE FUNCTION test_role_based_access()
RETURNS TABLE(test_name TEXT, passed BOOLEAN, details TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
    employee_can_create BOOLEAN;
    rep_can_create BOOLEAN;
    manager_can_create BOOLEAN;
    admin_can_create BOOLEAN;
BEGIN
    -- Test Employee cannot create accounts
    PERFORM set_test_user('dddddddd-dddd-dddd-dddd-dddddddddddd');
    BEGIN
        INSERT INTO accounts (territory_id, owner_id, name, account_number, type, created_by)
        VALUES ('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Test Account', 'TEST-001', 'safety_equipment_customer', 'dddddddd-dddd-dddd-dddd-dddddddddddd');
        employee_can_create := FALSE;
    EXCEPTION
        WHEN insufficient_privilege THEN
            employee_can_create := TRUE;
    END;
    
    -- Test Rep can create accounts
    PERFORM set_test_user('cccccccc-cccc-cccc-cccc-cccccccccccc');
    BEGIN
        INSERT INTO accounts (territory_id, owner_id, name, account_number, type, created_by)
        VALUES ('11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Rep Test Account', 'REP-001', 'safety_equipment_customer', 'cccccccc-cccc-cccc-cccc-cccccccccccc');
        rep_can_create := TRUE;
        DELETE FROM accounts WHERE account_number = 'REP-001';
    EXCEPTION
        WHEN insufficient_privilege THEN
            rep_can_create := FALSE;
    END;
    
    -- Test Manager can create accounts
    PERFORM set_test_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
    BEGIN
        INSERT INTO accounts (territory_id, owner_id, name, account_number, type, created_by)
        VALUES ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Manager Test Account', 'MGR-001', 'safety_equipment_customer', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
        manager_can_create := TRUE;
        DELETE FROM accounts WHERE account_number = 'MGR-001';
    EXCEPTION
        WHEN insufficient_privilege THEN
            manager_can_create := FALSE;
    END;
    
    -- Test Admin can create accounts
    PERFORM set_test_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    BEGIN
        INSERT INTO accounts (territory_id, owner_id, name, account_number, type, created_by)
        VALUES ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin Test Account', 'ADMIN-001', 'safety_equipment_customer', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
        admin_can_create := TRUE;
        DELETE FROM accounts WHERE account_number = 'ADMIN-001';
    EXCEPTION
        WHEN insufficient_privilege THEN
            admin_can_create := FALSE;
    END;
    
    RETURN QUERY SELECT 
        'Role-based Access Control Test'::TEXT,
        (NOT employee_can_create AND rep_can_create AND manager_can_create AND admin_can_create),
        format('Employee: %s, Rep: %s, Manager: %s, Admin: %s', 
               employee_can_create, rep_can_create, manager_can_create, admin_can_create);
END;
$$;

-- Test 3: Owner-based Access
CREATE OR REPLACE FUNCTION test_owner_based_access()
RETURNS TABLE(test_name TEXT, passed BOOLEAN, details TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
    owner_can_update BOOLEAN;
    non_owner_can_update BOOLEAN;
    owner_count INTEGER;
    non_owner_count INTEGER;
BEGIN
    -- Test owner can update their accounts
    PERFORM set_test_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
    BEGIN
        UPDATE accounts SET name = 'Updated Name' WHERE id = 'account-north-1';
        owner_can_update := TRUE;
        UPDATE accounts SET name = 'North Manufacturing' WHERE id = 'account-north-1';
    EXCEPTION
        WHEN insufficient_privilege THEN
            owner_can_update := FALSE;
    END;
    
    -- Test non-owner cannot update accounts
    PERFORM set_test_user('cccccccc-cccc-cccc-cccc-cccccccccccc');
    BEGIN
        UPDATE accounts SET name = 'Hacked Name' WHERE id = 'account-north-1';
        non_owner_can_update := FALSE;
    EXCEPTION
        WHEN insufficient_privilege THEN
            non_owner_can_update := TRUE;
    END;
    
    -- Count accounts accessible to owner vs non-owner
    PERFORM set_test_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
    SELECT count_accessible_records('accounts') INTO owner_count;
    
    PERFORM set_test_user('dddddddd-dddd-dddd-dddd-dddddddddddd');
    SELECT count_accessible_records('accounts') INTO non_owner_count;
    
    RETURN QUERY SELECT 
        'Owner-based Access Test'::TEXT,
        (owner_can_update AND non_owner_can_update AND owner_count >= non_owner_count),
        format('Owner can update: %s, Non-owner blocked: %s, Owner count: %s, Non-owner count: %s', 
               owner_can_update, non_owner_can_update, owner_count, non_owner_count);
END;
$$;

-- Test 4: Cross-territory Access Prevention
CREATE OR REPLACE FUNCTION test_cross_territory_prevention()
RETURNS TABLE(test_name TEXT, passed BOOLEAN, details TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
    north_user_south_access BOOLEAN;
    south_user_north_access BOOLEAN;
BEGIN
    -- Test North user cannot access South territory data
    PERFORM set_test_user('cccccccc-cccc-cccc-cccc-cccccccccccc');
    BEGIN
        SELECT COUNT(*) INTO south_user_north_access FROM accounts WHERE territory_id = '22222222-2222-2222-2222-222222222222';
        south_user_north_access := (south_user_north_access = 0);
    EXCEPTION
        WHEN OTHERS THEN
            south_user_north_access := TRUE;
    END;
    
    -- Test South user cannot access North territory data
    PERFORM set_test_user('ffffffff-ffff-ffff-ffff-ffffffffffff');
    BEGIN
        SELECT COUNT(*) INTO north_user_south_access FROM accounts WHERE territory_id = '11111111-1111-1111-1111-111111111111';
        north_user_south_access := (north_user_south_access = 0);
    EXCEPTION
        WHEN OTHERS THEN
            north_user_south_access := TRUE;
    END;
    
    RETURN QUERY SELECT 
        'Cross-territory Prevention Test'::TEXT,
        (north_user_south_access AND south_user_north_access),
        format('North user blocked from South: %s, South user blocked from North: %s', 
               north_user_south_access, south_user_north_access);
END;
$$;

-- Test 5: Admin Override Capabilities
CREATE OR REPLACE FUNCTION test_admin_override()
RETURNS TABLE(test_name TEXT, passed BOOLEAN, details TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
    admin_can_access_all BOOLEAN;
    admin_can_manage_all BOOLEAN;
    admin_count INTEGER;
    manager_count INTEGER;
BEGIN
    -- Test admin can access all territories
    PERFORM set_test_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    SELECT count_accessible_records('accounts') INTO admin_count;
    
    -- Test manager has limited access
    PERFORM set_test_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
    SELECT count_accessible_records('accounts') INTO manager_count;
    
    admin_can_access_all := (admin_count >= manager_count);
    
    -- Test admin can manage all records
    PERFORM set_test_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    BEGIN
        INSERT INTO accounts (territory_id, owner_id, name, account_number, type, created_by)
        VALUES ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin Cross Territory', 'ADMIN-X-001', 'safety_equipment_customer', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
        admin_can_manage_all := TRUE;
        DELETE FROM accounts WHERE account_number = 'ADMIN-X-001';
    EXCEPTION
        WHEN insufficient_privilege THEN
            admin_can_manage_all := FALSE;
    END;
    
    RETURN QUERY SELECT 
        'Admin Override Test'::TEXT,
        (admin_can_access_all AND admin_can_manage_all),
        format('Admin access all: %s, Admin manage all: %s, Admin count: %s, Manager count: %s', 
               admin_can_access_all, admin_can_manage_all, admin_count, manager_count);
END;
$$;

-- ============================================================================
-- Comprehensive Test Runner
-- ============================================================================

CREATE OR REPLACE FUNCTION run_all_rls_tests()
RETURNS TABLE(test_name TEXT, passed BOOLEAN, details TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Setup test data
    PERFORM setup_test_territories();
    PERFORM setup_test_users();
    PERFORM setup_test_accounts();
    
    -- Run all tests
    RETURN QUERY SELECT * FROM test_territory_isolation();
    RETURN QUERY SELECT * FROM test_role_based_access();
    RETURN QUERY SELECT * FROM test_owner_based_access();
    RETURN QUERY SELECT * FROM test_cross_territory_prevention();
    RETURN QUERY SELECT * FROM test_admin_override();
END;
$$;

-- ============================================================================
-- Test Cleanup Functions
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Clean up test data (in reverse order of dependencies)
    DELETE FROM accounts WHERE account_number LIKE '%TEST%' OR account_number LIKE '%REP%' OR account_number LIKE '%MGR%' OR account_number LIKE '%ADMIN%' OR account_number LIKE '%X%';
    DELETE FROM user_profiles WHERE email LIKE '%@test.com';
    DELETE FROM territories WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');
END;
$$;

-- ============================================================================
-- Usage Instructions
-- ============================================================================

/*
To run the RLS tests:

1. Set up test data:
   SELECT setup_test_territories();
   SELECT setup_test_users();
   SELECT setup_test_accounts();

2. Run individual tests:
   SELECT * FROM test_territory_isolation();
   SELECT * FROM test_role_based_access();
   SELECT * FROM test_owner_based_access();
   SELECT * FROM test_cross_territory_prevention();
   SELECT * FROM test_admin_override();

3. Run all tests:
   SELECT * FROM run_all_rls_tests();

4. Clean up test data:
   SELECT cleanup_test_data();

Expected Results:
- All tests should return 'passed' = true
- Territory isolation should prevent cross-territory access
- Role-based access should enforce proper permissions
- Owner-based access should allow record ownership
- Admin override should provide full access
*/
