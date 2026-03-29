# 🔧 Fixes Applied - Network Error & 404 Issues

**Date:** October 27, 2025
**Issue:** Frontend not rendering on Mac/Android, 404 errors, network errors

---

## 🎯 Root Causes Identified

### 1. **Package Version Issues**
- **axios 1.8.4** - Bleeding edge version causing network errors
- **React Query version mismatch** - Different versions across packages causing hydration issues
- **framer-motion 12.x** - Very new version with potential SSR issues

### 2. **Environment Variable Problems**
- `NEXT_PUBLIC_*` variables not embedded during Docker build
- Module-level initialization with undefined env vars causing broken navigation
- API config falling back to wrong origin (`window.location.origin`)

### 3. **Code Issues**
- Navigation links initialized at module level with `undefined` values
- No graceful handling of missing environment variables
- Poor error messages making debugging difficult

---

## ✅ Changes Made

### **1. Package Downgrades** (Stable Versions)

#### `packages/lib/package.json`
```json
"axios": "^1.7.7"  // ← Downgraded from 1.8.4
```

#### `apps/auth/package.json` & `packages/ui/package.json`
```json
"@tanstack/react-query": "^5.56.2",                    // ← From 5.72.1
"@tanstack/react-query-persist-client": "^5.56.2",     // ← From ^5.72.1
"@tanstack/query-sync-storage-persister": "^5.56.2",   // ← From ^5.72.1
"@tanstack/react-query-devtools": "^5.56.2"            // ← From ^5.72.1
```

**Why:**
- axios 1.8.4 is too new and has potential breaking changes
- React Query versions were mismatched across packages
- Using stable, well-tested versions reduces bugs

---

### **2. Fixed Component-Level Environment Variables**

#### Files Updated:
- ✅ `apps/auth/app/components/AuthNavBarClient.tsx`
- ✅ `apps/auth/app/page.tsx`
- ✅ `apps/marketplace/app/page.tsx`
- ✅ `apps/marketplace/components/MarketplaceNavBarClient.tsx`
- ✅ `apps/driverjobs/app/components/DriverJobsNavBarClient.tsx`

**Before (BROKEN):**
```typescript
// ❌ Module-level initialization - undefined becomes permanent
const MARKETPLACE_BASE = process.env.NEXT_PUBLIC_MARKETPLACE_URL!;
const authNavLinks: NavLinkItem[] = [
  { key: "BUY_SELL", href: `${MARKETPLACE_BASE}/posts` }, // undefined/posts
];
```

**After (FIXED):**
```typescript
// ✅ Inside component with fallbacks
const AuthNavBarClient = () => {
  const MARKETPLACE_BASE = process.env.NEXT_PUBLIC_MARKETPLACE_URL || '';

  const authNavLinks: NavLinkItem[] = useMemo(() => [
    { key: "BUY_SELL", href: `${MARKETPLACE_BASE}/posts` },
  ], [MARKETPLACE_BASE]);

  // ... rest of component
}
```

**Benefits:**
- Handles missing env vars gracefully
- No broken `undefined/posts` URLs
- Uses `useMemo` to prevent unnecessary re-renders
- Page will still render even if env vars are missing

---

### **3. Added Environment Variable Validation**

#### New File: `apps/auth/lib/env.ts`

Utility functions to:
- Validate critical environment variables at runtime
- Provide helpful error messages pointing to Coolify setup
- Log current values for debugging
- Safe fallbacks for missing values

**Usage Example:**
```typescript
import { validateEnv, getEnvVar } from '~/lib/env';

// Validate all env vars (call in root layout or app startup)
validateEnv();

// Get a specific env var with fallback
const apiUrl = getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000');
```

---

### **4. Improved API Config Error Messages**

#### File: `packages/lib/src/api/config.ts`

**Changes:**
- Better console error messages explaining the problem
- Clear instructions for fixing in Coolify
- Returns empty string instead of `window.location.origin` to make failures obvious
- API calls will fail fast rather than silently going to wrong URL

**Error Output (when env var missing):**
```
❌ CRITICAL: API_BASE_URL not embedded during build!
   Current location: https://auth.sslip.io
   This means NEXT_PUBLIC_API_BASE_URL was not set as a build arg
   API calls will fail because they're going to the wrong origin
   FIX: Set NEXT_PUBLIC_API_BASE_URL in Coolify Build Args
```

---

## 🚀 Next Steps - Coolify Configuration

### **CRITICAL: You MUST Set Build Args in Coolify**

For **EACH** of your three app deployments (auth, marketplace, driverjobs), add these as **BUILD ARGS** (not runtime env vars):

#### **Auth App:**
```bash
NEXT_PUBLIC_API_BASE_URL=https://backend.drova.com
NEXT_PUBLIC_AUTH_BASE_URL=https://auth.sslip.io
NEXT_PUBLIC_MARKETPLACE_URL=https://marketplace.sslip.io
NEXT_PUBLIC_MARKETPLACE_BASE_URL=https://marketplace.sslip.io
NEXT_PUBLIC_DRIVERJOBS_BASE_URL=https://driverjobs.sslip.io
NEXT_PUBLIC_DRIVERJOBS_URL=https://driverjobs.sslip.io
```

#### **Marketplace App:**
```bash
NEXT_PUBLIC_API_BASE_URL=https://backend.drova.com
NEXT_PUBLIC_AUTH_BASE_URL=https://auth.sslip.io
NEXT_PUBLIC_MARKETPLACE_URL=https://marketplace.sslip.io
NEXT_PUBLIC_MARKETPLACE_BASE_URL=https://marketplace.sslip.io
NEXT_PUBLIC_DRIVERJOBS_BASE_URL=https://driverjobs.sslip.io
NEXT_PUBLIC_DRIVERJOBS_URL=https://driverjobs.sslip.io
```

#### **DriverJobs App:**
```bash
NEXT_PUBLIC_API_BASE_URL=https://backend.drova.com
NEXT_PUBLIC_AUTH_BASE_URL=https://auth.sslip.io
NEXT_PUBLIC_MARKETPLACE_URL=https://marketplace.sslip.io
NEXT_PUBLIC_MARKETPLACE_BASE_URL=https://marketplace.sslip.io
NEXT_PUBLIC_DRIVERJOBS_BASE_URL=https://driverjobs.sslip.io
NEXT_PUBLIC_DRIVERJOBS_URL=https://driverjobs.sslip.io
```

### **How to Set in Coolify:**

1. Go to your app deployment settings
2. Find **"Build Args"** or **"Build-time Environment Variables"** section
3. Add each variable as shown above
4. **Important:** These must be BUILD ARGS, not just runtime environment variables
5. Trigger a new build
6. Verify in build logs that variables are set

### **Verification After Deployment:**

#### In Browser Console:
```javascript
// Should show actual URLs, NOT undefined
console.log('API:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('Marketplace:', process.env.NEXT_PUBLIC_MARKETPLACE_URL);
console.log('DriverJobs:', process.env.NEXT_PUBLIC_DRIVERJOBS_BASE_URL);
```

#### In Network Tab:
- Make a login request
- Check the URL - should be: `https://backend.drova.com/api/v1/...`
- NOT: `https://auth.sslip.io/api/v1/...`

---

## 📦 Install Updated Packages

After pulling these changes, run:

```bash
# Install updated packages
pnpm install

# Clean build
pnpm run build

# Test locally
pnpm run dev
```

---

## 🔍 How to Debug Issues

### **1. Check if env vars are embedded:**
Open browser console on deployed site:
```javascript
console.log('Env vars:', {
  API: process.env.NEXT_PUBLIC_API_BASE_URL,
  MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_URL,
  DRIVERJOBS: process.env.NEXT_PUBLIC_DRIVERJOBS_BASE_URL
});
```

### **2. Check API calls:**
Open Network tab and look for API requests:
- ✅ Good: `https://backend.drova.com/api/v1/...`
- ❌ Bad: `https://auth.sslip.io/api/v1/...`
- ❌ Bad: `/api/v1/...` (empty base URL)

### **3. Check navigation links:**
Inspect navigation elements:
```javascript
// In browser console
document.querySelectorAll('a').forEach(a => {
  if (a.href.includes('undefined')) {
    console.error('Broken link:', a.href);
  }
});
```

### **4. Check build logs in Coolify:**
Look for these messages:
```
🔍 NEXT_PUBLIC_API_BASE_URL from process.env: https://backend.drova.com
```

---

## 🎉 Expected Improvements

After these changes and setting Coolify build args:

1. ✅ **Frontend renders on all devices** (Mac, Android, Windows)
2. ✅ **No more 404 errors** from API calls going to wrong origin
3. ✅ **No more "undefined" in URLs** - navigation links work correctly
4. ✅ **Better error messages** when something is misconfigured
5. ✅ **Stable package versions** - no bleeding-edge bugs
6. ✅ **Graceful degradation** - app still loads even with missing env vars

---

## 📝 Summary

### What Was Wrong:
1. axios 1.8.4 causing network issues
2. React Query version mismatches
3. Environment variables not embedded during build
4. Module-level initialization with undefined values
5. Poor error handling

### What Was Fixed:
1. ✅ Downgraded to stable package versions
2. ✅ Aligned React Query versions across all packages
3. ✅ Moved env var initialization inside components
4. ✅ Added fallbacks and validation
5. ✅ Improved error messages
6. ✅ Created debugging utilities

### What You Need To Do:
1. 🔥 **CRITICAL:** Set build args in Coolify (see above)
2. Run `pnpm install` to update packages
3. Rebuild and redeploy all three apps
4. Test on Mac/Android/Windows
5. Verify env vars in browser console

---

## 🆘 If Issues Persist

1. Check Coolify build logs for env var values
2. Check browser console for error messages
3. Check Network tab for API call URLs
4. Use the validation utility: `validateEnv()` in your app
5. Share build logs and browser console errors

---

**Good luck! Your app should now work correctly on all devices! 🚀**

