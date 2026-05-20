'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function UserForm() {
  return (
    <Card className="max-w-2xl">
      <h2 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light mb-6">
        Create New User
      </h2>

      <form className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter full name"
          className="w-full"
        />

        <Input
          label="Email"
          type="email"
          placeholder="user@example.com"
          className="w-full"
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          className="w-full"
        />

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-semibold text-neutral-dark dark:text-neutral-light mb-2">
            Role *
          </label>
          <select className="w-full px-4 py-2 rounded-lg bg-white dark:bg-brand-brown border border-border-light dark:border-border-dark text-neutral-dark dark:text-neutral-light focus:border-brand-green dark:focus:border-brand-gold-bright focus:ring-2 focus:ring-brand-green/20 dark:focus:ring-brand-gold-bright/20">
            <option value="">-- Select a role --</option>
            <option value="super_admin">Super Admin</option>
            <option value="editor">Editor</option>
            <option value="sales">Sales Manager</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div className="pt-4">
          <Button variant="primary" size="lg" type="submit">
            Create User
          </Button>
        </div>
      </form>
    </Card>
  );
}