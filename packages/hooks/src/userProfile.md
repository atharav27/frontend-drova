# User Profile Hooks

This module provides reusable React Query hooks for managing user profile data across all applications in the monorepo.

## Available Hooks

### `useUserProfile(options?)`
Fetches the current user's profile data.

**Parameters:**
- `options.enabled?: boolean` - Whether the query should be enabled (default: true)

**Returns:** React Query result with user profile data

**Example:**
```tsx
import { useUserProfile } from '@repo/hooks';

function ProfileComponent() {
  const { data: profile, isLoading, error } = useUserProfile();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Welcome, {profile?.fullName}!</div>;
}
```

### `useUpdateUserProfile()`
Updates the current user's profile data.

**Returns:** React Query mutation for updating user profile

**Example:**
```tsx
import { useUpdateUserProfile } from '@repo/hooks';

function EditProfileForm() {
  const updateProfile = useUpdateUserProfile();

  const handleSubmit = (data) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        toast.success('Profile updated!');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### `useLogout()`
Logs out the current user and redirects to the auth app.

**Returns:** React Query mutation for logging out

**Example:**
```tsx
import { useLogout } from '@repo/hooks';

function LogoutButton() {
  const logout = useLogout();

  return (
    <button onClick={() => logout.mutate()}>
      Logout
    </button>
  );
}
```

### `useAddRole()`
Adds a new role to the current user.

**Returns:** React Query mutation for adding a role

**Example:**
```tsx
import { useAddRole } from '@repo/hooks';

function AddDriverRole() {
  const addRole = useAddRole();

  const handleAddDriverRole = () => {
    addRole.mutate({
      userId: 'user-id',
      dateOfBirth: '1990-01-01',
      licenseNumber: 'DL123456789',
      licenseCategory: 'LMV',
      licenseFrontImage: 'license.jpg'
    });
  };

  return (
    <button onClick={handleAddDriverRole}>
      Add Driver Role
    </button>
  );
}
```

## Types

### `Profile`
The main user profile interface containing all user data.

### `UserDocuments`
Interface for user document information (Aadhaar, PAN, License).

### `UpdateUserInput`
Interface for updating user profile data.

### `AddRoleRequest`
Interface for adding a new role to a user.

### `AddRoleResponse`
Interface for the response when adding a role.

## Usage in Different Apps

### Marketplace App
```tsx
import { useUserProfile, useUpdateUserProfile, useLogout, useAddRole } from '@repo/hooks';
```

### Driver Jobs App
```tsx
import { useUserProfile, useAddRole } from '@repo/hooks';
```

### Auth App
```tsx
import { useUserProfile } from '@repo/hooks';
```

## Notes

- All hooks use React Query for caching and state management
- Authentication is handled via cookies (credentials: 'include')
- The hooks automatically invalidate related queries on successful mutations
- Cross-app logout is supported via window events
