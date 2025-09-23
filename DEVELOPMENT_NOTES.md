# Development Notes & Production Checklist

## 🚨 CRITICAL: Flags to Consider Before Commit for Production

### API URL Configuration Changes
**Status: DEVELOPMENT ONLY - MUST REVERT BEFORE PRODUCTION**

The following files have been modified to use `localhost:3000` instead of the production API `https://api.waiz.cl`:

#### Modified Files:
- `apps/frontend/src/contexts/AuthContext.tsx`
  - Line ~49: `fetch('http://localhost:3000/auth/login'` → should be `fetch('https://api.waiz.cl/auth/login'`
  - Line ~76: `fetch('http://localhost:3000/auth/register'` → should be `fetch('https://api.waiz.cl/auth/register'`

- `apps/frontend/src/pages/AdminPage.tsx`
  - Line ~120: `fetch("http://localhost:3000/api/users"` → should be `fetch("https://api.waiz.cl/api/users"`
  - Line ~215: `fetch(\`http://localhost:3000/api/users/${selectedUser.id}/status\`` → should be `fetch(\`https://api.waiz.cl/api/users/${selectedUser.id}/status\``

- `apps/api/prisma/schema.prisma`
  - **CRITICAL**: Changed `provider = "sqlite"` → should be `provider = "postgresql"`
  - **BACKUP CREATED**: `schema.prisma.backup` contains original PostgreSQL version

- `apps/api/src/services/notificationService.js`
  - Line 8: Fixed `nodemailer.createTransporter` → `nodemailer.createTransport`

- `apps/api/.env` (NEW FILE - DO NOT COMMIT)
  - Contains development-only environment variables
  - **MUST DELETE** before production deployment

- `apps/api/simple-server.js` (NEW FILE - DEVELOPMENT ONLY)
  - Minimal API server for local testing
  - **DELETE** before production deployment

- `apps/frontend/src/pages/TestRegistration.tsx` (NEW FILE - DEVELOPMENT ONLY)
  - Test page for API connectivity debugging
  - **DELETE** before production deployment

- `apps/frontend/src/App.tsx`
  - Added import for TestRegistration component
  - Added `/test` route for debugging
  - **REMOVE** TestRegistration import and route before production

- `apps/frontend/src/contexts/AuthContext.tsx`
  - Added extensive console logging for debugging
  - **REMOVE** all console.log statements before production

- `apps/frontend/src/pages/RegisterPage.tsx`
  - Added console logging to form submission and button clicks
  - **REMOVE** all console.log statements before production

#### Additional files that may need checking:
- `apps/frontend/src/pages/AddCandidatePage.tsx`
- Any other pages with API calls

### Pre-Commit Production Checklist:

#### 1. API Configuration
- [ ] Revert all `http://localhost:3000` back to `https://api.waiz.cl`
- [ ] Verify no hardcoded localhost URLs remain in the codebase
- [ ] Test with production API endpoints

#### 2. Environment Variables
- [ ] Remove any development `.env` files from API directory
- [ ] **DELETE** `apps/api/.env` (contains development database URL and secrets)
- [ ] **DELETE** `apps/api/simple-server.js` (development-only mock server)
- [ ] **DELETE** `apps/frontend/src/pages/TestRegistration.tsx` (debug page)
- [ ] Ensure production environment variables are properly configured
- [ ] Verify DATABASE_URL points to production database

#### 3. Frontend Cleanup
- [ ] **REMOVE** TestRegistration import from `apps/frontend/src/App.tsx`
- [ ] **REMOVE** `/test` route from `apps/frontend/src/App.tsx`
- [ ] **REMOVE** all console.log debugging from `apps/frontend/src/contexts/AuthContext.tsx`
- [ ] **REMOVE** all console.log debugging from `apps/frontend/src/pages/RegisterPage.tsx`

#### 4. Database Schema
- [ ] **RESTORE** `apps/api/prisma/schema.prisma` from backup
- [ ] Verify `provider = "postgresql"` (not "sqlite")
- [ ] Run `cp apps/api/prisma/schema.prisma.backup apps/api/prisma/schema.prisma`

#### 4. Console Logging Cleanup

Before deploying to production, all debug console logging must be removed from these files:

- `apps/frontend/src/contexts/AuthContext.tsx`:
  - Remove all console.log statements in login() and register() functions
  - Remove debug logging for localStorage operations
  - Remove API response debugging

- `apps/frontend/src/pages/RegisterPage.tsx`:
  - Remove console.log statements for form submissions
  - Remove button click debugging

- `apps/frontend/src/pages/TestRegistration.tsx`:
  - DELETE ENTIRE FILE - This is only for local testing

Cleanup command:
```bash
# Use grep to find all console.log statements that need removal
grep -r "console.log" apps/frontend/src/
```

#### 5. Build Verification
- [ ] Run `npm run build` in frontend to ensure production build works
- [ ] Test production build locally before deployment
- [ ] Verify all dependencies are properly installed

#### 4. Security
- [ ] Ensure no development secrets or API keys are committed
- [ ] Verify JWT_SECRET is production-ready
- [ ] Check that debug logs are disabled

### Quick Revert Commands:

```bash
# Navigate to frontend directory
cd apps/frontend

# Revert API URLs (run these before commit)
find src -name "*.tsx" -exec sed -i '' 's|http://localhost:3000|https://api.waiz.cl|g' {} \;

# Navigate to API directory  
cd ../api

# Restore original Prisma schema
cp prisma/schema.prisma.backup prisma/schema.prisma

# Remove development files
rm -f .env simple-server.js

# Verify schema is correct
grep "provider.*postgresql" prisma/schema.prisma

# Or manually revert in these files:
# - src/contexts/AuthContext.tsx
# - src/pages/AdminPage.tsx  
# - src/pages/AddCandidatePage.tsx (if modified)
# - src/services/notificationService.js (fix createTransport)
```

### Development Context:
These changes were made on **September 22, 2025** because:
- Production API server `https://api.waiz.cl` was down
- Local development environment was set up for testing admin registration
- Frontend was temporarily configured to use local API server
- Prisma schema temporarily changed from PostgreSQL to SQLite for local development
- Simple mock server created to enable registration testing
- Nodemailer bug fixed (createTransporter → createTransport)

---

## Development Setup Notes

### Local API Server Setup:
- Created `.env` file in `apps/api/` with development configuration
- Uses PostgreSQL connection for local development
- JWT_SECRET set for development only

### Current Development URLs:
- Frontend: `http://localhost:5174`
- API: `http://localhost:3000` (when running locally)
- Production Frontend: `https://app.waiz.cl`
- Production API: `https://api.waiz.cl`

---

**⚠️ REMEMBER: Always run the revert commands before pushing to production!**