#!/bin/bash

BASE="http://localhost:3000"
PASS=0
FAIL=0

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "${GREEN}  ✅ PASS${NC} — $1"; ((PASS++)); }
fail() { echo -e "${RED}  ❌ FAIL${NC} — $1"; ((FAIL++)); }
info() { echo -e "${YELLOW}$1${NC}"; }

check_status() {
  local label=$1 expected=$2 actual=$3 body=$4
  if [ "$actual" -eq "$expected" ]; then
    ok "$label (status $actual)"
  else
    fail "$label — expected $expected, got $actual"
    echo "     body: $body"
  fi
}

echo ""
echo "========================================"
echo "  Library Auth Test Suite"
echo "========================================"
echo ""

# ── 0. Health check ──────────────────────────────────────
info "[ 0 ] Health"

RES=$(curl -s -o /dev/null -w "%{http_code}" $BASE/health)
check_status "GET /health" 200 "$RES" ""

# ── 1. Register users ────────────────────────────────────
info "\n[ 1 ] Register"

# Register Admin
RES=$(curl -s -w "\n%{http_code}" -X POST $BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Admin","email":"admin@test.com","password":"Admin1234","role":"Admin"}')
BODY=$(echo "$RES" | head -n1)
STATUS=$(echo "$RES" | tail -n1)
check_status "POST /api/auth/register (Admin)" 201 "$STATUS" "$BODY"

# Register Librarian
RES=$(curl -s -w "\n%{http_code}" -X POST $BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Librarian","email":"librarian@test.com","password":"Lib1234","role":"Librarian"}')
BODY=$(echo "$RES" | head -n1)
STATUS=$(echo "$RES" | tail -n1)
check_status "POST /api/auth/register (Librarian)" 201 "$STATUS" "$BODY"

# Register Member
RES=$(curl -s -w "\n%{http_code}" -X POST $BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Member","email":"member@test.com","password":"Member1234","role":"Member"}')
BODY=$(echo "$RES" | head -n1)
STATUS=$(echo "$RES" | tail -n1)
check_status "POST /api/auth/register (Member)" 201 "$STATUS" "$BODY"

# Duplicate email should fail
RES=$(curl -s -w "\n%{http_code}" -X POST $BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Dup","email":"admin@test.com","password":"Admin1234","role":"Admin"}')
BODY=$(echo "$RES" | head -n1)
STATUS=$(echo "$RES" | tail -n1)
check_status "POST /api/auth/register (duplicate email → 400)" 400 "$STATUS" "$BODY"

# ── 2. Login ─────────────────────────────────────────────
info "\n[ 2 ] Login"

# Admin login — capture token
RES=$(curl -s -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin1234"}')
ADMIN_TOKEN=$(echo $RES | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
if [ -n "$ADMIN_TOKEN" ]; then
  ok "POST /api/auth/login (Admin) — token received"
  ((PASS++))
else
  fail "POST /api/auth/login (Admin) — no token in response"
  echo "     body: $RES"
  ((FAIL++))
fi

# Librarian login — capture token
RES=$(curl -s -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"librarian@test.com","password":"Lib1234"}')
LIB_TOKEN=$(echo $RES | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
if [ -n "$LIB_TOKEN" ]; then
  ok "POST /api/auth/login (Librarian) — token received"
  ((PASS++))
else
  fail "POST /api/auth/login (Librarian) — no token in response"
  ((FAIL++))
fi

# Member login — capture token
RES=$(curl -s -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"member@test.com","password":"Member1234"}')
MEMBER_TOKEN=$(echo $RES | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
if [ -n "$MEMBER_TOKEN" ]; then
  ok "POST /api/auth/login (Member) — token received"
  ((PASS++))
else
  fail "POST /api/auth/login (Member) — no token in response"
  ((FAIL++))
fi

# Wrong password
RES=$(curl -s -w "\n%{http_code}" -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"wrongpassword"}')
STATUS=$(echo "$RES" | tail -n1)
check_status "POST /api/auth/login (wrong password → 401)" 401 "$STATUS" ""

# Missing fields
RES=$(curl -s -w "\n%{http_code}" -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com"}')
STATUS=$(echo "$RES" | tail -n1)
check_status "POST /api/auth/login (missing password → 400)" 400 "$STATUS" ""

# ── 3. GET /auth/me ──────────────────────────────────────
info "\n[ 3 ] GET /auth/me"

RES=$(curl -s -w "\n%{http_code}" $BASE/api/auth/me \
  -H "Authorization: Bearer $ADMIN_TOKEN")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/auth/me (valid token)" 200 "$STATUS" ""

RES=$(curl -s -w "\n%{http_code}" $BASE/api/auth/me)
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/auth/me (no token → 401)" 401 "$STATUS" ""

RES=$(curl -s -w "\n%{http_code}" $BASE/api/auth/me \
  -H "Authorization: Bearer invalidtoken")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/auth/me (bad token → 401)" 401 "$STATUS" ""

# ── 4. Public routes ─────────────────────────────────────
info "\n[ 4 ] Public routes"

RES=$(curl -s -w "\n%{http_code}" $BASE/api/ping)
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/ping (no token)" 200 "$STATUS" ""

# ── 5. RBAC — Admin only ─────────────────────────────────
info "\n[ 5 ] RBAC — /admin-only"

RES=$(curl -s -w "\n%{http_code}" $BASE/api/admin-only \
  -H "Authorization: Bearer $ADMIN_TOKEN")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/admin-only (Admin token → 200)" 200 "$STATUS" ""

RES=$(curl -s -w "\n%{http_code}" $BASE/api/admin-only \
  -H "Authorization: Bearer $LIB_TOKEN")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/admin-only (Librarian token → 403)" 403 "$STATUS" ""

RES=$(curl -s -w "\n%{http_code}" $BASE/api/admin-only \
  -H "Authorization: Bearer $MEMBER_TOKEN")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/admin-only (Member token → 403)" 403 "$STATUS" ""

RES=$(curl -s -w "\n%{http_code}" $BASE/api/admin-only)
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/admin-only (no token → 401)" 401 "$STATUS" ""

# ── 6. RBAC — Librarian only ─────────────────────────────
info "\n[ 6 ] RBAC — /librarian-only"

RES=$(curl -s -w "\n%{http_code}" $BASE/api/librarian-only \
  -H "Authorization: Bearer $LIB_TOKEN")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/librarian-only (Librarian token → 200)" 200 "$STATUS" ""

RES=$(curl -s -w "\n%{http_code}" $BASE/api/librarian-only \
  -H "Authorization: Bearer $ADMIN_TOKEN")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/librarian-only (Admin token → 403)" 403 "$STATUS" ""

RES=$(curl -s -w "\n%{http_code}" $BASE/api/librarian-only \
  -H "Authorization: Bearer $MEMBER_TOKEN")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/librarian-only (Member token → 403)" 403 "$STATUS" ""

# ── 7. RBAC — Member only ────────────────────────────────
info "\n[ 7 ] RBAC — /member-only"

RES=$(curl -s -w "\n%{http_code}" $BASE/api/member-only \
  -H "Authorization: Bearer $MEMBER_TOKEN")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/member-only (Member token → 200)" 200 "$STATUS" ""

RES=$(curl -s -w "\n%{http_code}" $BASE/api/member-only \
  -H "Authorization: Bearer $ADMIN_TOKEN")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/member-only (Admin token → 403)" 403 "$STATUS" ""

# ── 8. RBAC — Staff (Admin or Librarian) ─────────────────
info "\n[ 8 ] RBAC — /staff-only"

RES=$(curl -s -w "\n%{http_code}" $BASE/api/staff-only \
  -H "Authorization: Bearer $ADMIN_TOKEN")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/staff-only (Admin token → 200)" 200 "$STATUS" ""

RES=$(curl -s -w "\n%{http_code}" $BASE/api/staff-only \
  -H "Authorization: Bearer $LIB_TOKEN")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/staff-only (Librarian token → 200)" 200 "$STATUS" ""

RES=$(curl -s -w "\n%{http_code}" $BASE/api/staff-only \
  -H "Authorization: Bearer $MEMBER_TOKEN")
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/staff-only (Member token → 403)" 403 "$STATUS" ""

# ── 9. 404 ───────────────────────────────────────────────
info "\n[ 9 ] 404"

RES=$(curl -s -w "\n%{http_code}" $BASE/api/does-not-exist)
STATUS=$(echo "$RES" | tail -n1)
check_status "GET /api/does-not-exist → 404" 404 "$STATUS" ""

# ── Summary ──────────────────────────────────────────────
echo ""
echo "========================================"
TOTAL=$((PASS + FAIL))
echo -e "  Results: ${GREEN}${PASS} passed${NC} / ${RED}${FAIL} failed${NC} / ${TOTAL} total"
echo "========================================"

if [ "$FAIL" -eq 0 ]; then
  echo -e "\n  ${GREEN}✅ All tests passed. Auth is clean.${NC}\n"
else
  echo -e "\n  ${RED}❌ ${FAIL} test(s) failed. Check output above.${NC}\n"
  exit 1
fi
