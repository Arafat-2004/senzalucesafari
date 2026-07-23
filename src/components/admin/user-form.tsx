'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  password?: string;
}

export function UserForm({ onSubmit, loading, roles }: { onSubmit?: (data: UserFormData) => void; loading?: boolean; roles: Array<{ name: string; displayName: string }> }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data: UserFormData = {
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value || undefined,
      role: (form.elements.namedItem('role') as HTMLSelectElement).value,
      password: (form.elements.namedItem('password') as HTMLInputElement).value,
    };
    onSubmit?.(data);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
        Create New User
      </h2>

      <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
        {/* First Name & Last Name - Side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="firstName"
            label="First Name *"
            placeholder="First name"
            required
            className="w-full"
          />
          <Input
            name="lastName"
            label="Last Name *"
            placeholder="Last name"
            required
            className="w-full"
          />
        </div>

        {/* Email & Phone - Side by side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="email"
            label="Email *"
            type="email"
            placeholder="user@example.com"
            required
            className="w-full"
          />
          <Input
            name="phone"
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="w-full"
          />
        </div>

        {/* Password - Full width */}
        <Input
          name="password"
          label="Password *"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          className="w-full"
        />

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Role *
          </label>
          <select
            name="role"
            required
            className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-background border text-foreground text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[44px]"
          >
            <option value="">-- Select a role --</option>
            {roles.map(role => <option key={role.name} value={role.name}>{role.displayName}</option>)}
          </select>
        </div>

        {/* Buttons - Full width on mobile, side by side on sm+ */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button variant="default" size="lg" type="submit" disabled={loading} className="flex-1 min-h-[44px]">
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </div>
      </form>
    </div>
  );
}
