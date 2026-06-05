'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface UserFormData {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
}

export function UserForm({ onSubmit, loading }: { onSubmit?: (data: UserFormData) => void; loading?: boolean }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data: UserFormData = {
      fullName: (form.elements.namedItem('fullName') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      role: (form.elements.namedItem('role') as HTMLSelectElement).value,
    };
    onSubmit?.(data);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
        Create New User
      </h2>

      <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
        {/* Full Name - Full width on all screens */}
        <Input
          name="fullName"
          label="Full Name"
          placeholder="Enter full name"
          className="w-full"
        />

        {/* Email & Phone - Side by side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="email"
            label="Email"
            type="email"
            placeholder="user@example.com"
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

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Role *
          </label>
          <select
            name="role"
            className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-background border text-foreground text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[44px]"
          >
            <option value="">-- Select a role --</option>
            <option value="super_admin">Super Admin</option>
            <option value="editor">Editor</option>
            <option value="sales">Sales Manager</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {/* Buttons - Full width on mobile, side by side on sm+ */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button variant="outline" size="lg" type="button" className="flex-1 min-h-[44px]">
            Cancel
          </Button>
          <Button variant="default" size="lg" type="submit" disabled={loading} className="flex-1 min-h-[44px]">
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </div>
      </form>
    </div>
  );
}