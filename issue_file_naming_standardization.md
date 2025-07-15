# File Naming Standardization and Code Reference Updates

## Summary

Standardize all file names according to the UI development instructions (meaningful camelCase naming) and ensure all code references are properly updated to maintain functionality.

## Background

The project currently has inconsistent file naming conventions that don't align with the established UI development instructions which specify "meaningful camelCase naming." This creates potential confusion and maintenance issues.

## Current Issues Identified

### 1. Service Files with Inconsistent Casing

- `tokenService.ts` → should be `tokenService.ts` (already correct)
- `FormService.ts` → should be `formService.ts`
- `ToastService.ts` → should be `toastService.ts`

### 2. Configuration Files

- `authConfig.ts` → should be `authConfig.ts` (already correct)

### 3. Test File Duplication and Inconsistency

- Duplicate test files found: `src/tests/App.test.js` and `src/components/App.test.tsx`
- Mixed file extensions (`.js` vs `.tsx`)
- `setupTests.js` → should be `setupTests.ts` (TypeScript consistency)

### 4. Component Files (Generally Good)

Most component files already follow camelCase:

- ✅ `App.tsx`
- ✅ `Login.tsx`
- ✅ `Dashboard.tsx`
- ✅ `ToastDemo.tsx`
- ✅ `TokenDemo.tsx`
- ✅ `FormDemo.tsx`
- ✅ `ToastProvider.tsx`
- ✅ `FormModalProvider.tsx`
- ✅ `FormRouteDemo.tsx`

### 5. Form Files (Already Correct)

- ✅ `UserEditForm.tsx`
- ✅ `ProjectEditForm.tsx`
- ✅ `ButtonDemoForm.tsx`
- ✅ `ConfirmationForm.tsx`

### 6. Registry and Utility Files

- `FormRegistry.ts` → should be `formRegistry.ts`
- `EventEmitter.ts` → should be `eventEmitter.ts`

## Required Changes

### Phase 1: Rename Files

1. **Services Directory:**
   - `FormService.ts` → `formService.ts`
   - `ToastService.ts` → `toastService.ts`

2. **Registry Directory:**
   - `FormRegistry.ts` → `formRegistry.ts`

3. **Utils Directory:**
   - `EventEmitter.ts` → `eventEmitter.ts`

4. **Test Files:**
   - `setupTests.js` → `setupTests.ts`
   - Remove duplicate `src/tests/App.test.js` (keep `src/components/App.test.tsx`)

### Phase 2: Update All Import References

After renaming files, update all import statements in:

1. **Service imports:**
   - `src/services/useTokenService.ts` - update TokenService import
   - `src/services/FormService.ts` → `src/services/formService.ts` - update EventEmitter import
   - `src/services/ToastService.ts` → `src/services/toastService.ts` - update EventEmitter import
   - `src/services/apiService.ts` - update service imports
   - `src/hooks/useFormService.ts` - update FormService import
   - `src/hooks/useToast.ts` - update ToastService import

2. **Component imports:**
   - `src/components/FormModalProvider.tsx` - update FormService import
   - `src/components/ToastProvider.tsx` - update ToastService import
   - Any other components importing renamed services

3. **Registry imports:**
   - `src/services/FormService.ts` - update FormRegistry import
   - Any other files importing FormRegistry

### Phase 3: Verification

1. **Build Verification:**
   - Run `npm run build` to ensure no broken imports
   - Run `npm test` to verify all tests pass
   - Check TypeScript compilation for any errors

2. **Runtime Verification:**
   - Test authentication flow
   - Test form functionality
   - Test toast notifications
   - Verify all dynamic imports work correctly

## Acceptance Criteria

- [ ] All files follow camelCase naming convention as specified in UI instructions
- [ ] No duplicate test files exist
- [ ] All import statements are updated to reference renamed files
- [ ] Project builds successfully without errors
- [ ] All tests pass
- [ ] No runtime errors related to missing imports
- [ ] TypeScript compilation succeeds
- [ ] All application features continue to work as expected

## Priority

**Medium** - This is a maintenance task that improves code consistency and maintainability but doesn't affect functionality if done correctly.

## Estimated Effort

**2-3 hours** - Systematic renaming and import updates with thorough testing

## Notes

- This task requires careful attention to import paths and dependencies
- Consider using VS Code's "Rename Symbol" feature for safer refactoring
- Ensure all team members are notified of the changes to avoid merge conflicts
- Update any documentation that references the old file names

## Files to be Modified

- `src/services/FormService.ts`
- `src/services/ToastService.ts`
- `src/registry/FormRegistry.ts`
- `src/utils/EventEmitter.ts`
- `setupTests.js`
- All files with import statements referencing the renamed files
- Remove duplicate `src/tests/App.test.js`
