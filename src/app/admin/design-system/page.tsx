'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

export default function DesignSystemPage() {
  return (
    <div className="space-y-12 p-8">
      <div>
        <h1 className="text-4xl font-bold text-neutral-dark dark:text-neutral-light mb-8">
          Design System - Color Palette
        </h1>

        {/* Color Grid */}
        <div className="grid grid-cols-4 gap-4">
          {/* Primary Colors */}
          <div className="space-y-2">
            <div className="bg-brand-green h-24 rounded-lg"></div>
            <p className="text-sm font-semibold">Primary Green</p>
            <p className="text-xs text-text-secondary">#2D9B5E</p>
          </div>

          <div className="space-y-2">
            <div className="bg-brand-green-dark h-24 rounded-lg"></div>
            <p className="text-sm font-semibold">Dark Green</p>
            <p className="text-xs text-text-secondary">#1B5E3F</p>
          </div>

          <div className="space-y-2">
            <div className="bg-brand-brown h-24 rounded-lg"></div>
            <p className="text-sm font-semibold">Dark Brown</p>
            <p className="text-xs text-text-secondary">#3C2417</p>
          </div>

          <div className="space-y-2">
            <div className="bg-brand-gold-bright h-24 rounded-lg"></div>
            <p className="text-sm font-semibold">Gold</p>
            <p className="text-xs text-text-secondary">#FFD700</p>
          </div>
        </div>
      </div>

      {/* Buttons Test */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light mb-4">
          Buttons
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="outline">Outline</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      {/* Input Test */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light mb-4">
          Form Inputs
        </h2>
        <div className="space-y-4 max-w-md">
          <Input label="Normal Input" placeholder="Type something..." />
          <Input
            label="Input with Error"
            placeholder="Error state..."
            error="This field is required"
          />
          <Input
            label="Input with Helper"
            placeholder="Helper text..."
            helperText="This is a helper text"
          />
        </div>
      </div>

      {/* Alerts Test */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light mb-4">
          Status Alerts
        </h2>
        <div className="space-y-4">
          <Alert type="success">✓ This is a success message</Alert>
          <Alert type="error">✕ This is an error message</Alert>
          <Alert type="warning">⚠ This is a warning message</Alert>
          <Alert type="info">ℹ This is an info message</Alert>
        </div>
      </div>

      {/* Cards Test */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light mb-4">
          Cards
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <Card hoverable>
            <h3 className="text-lg font-bold text-neutral-dark dark:text-neutral-light mb-2">
              Card Title
            </h3>
            <p className="text-text-secondary dark:text-text-light-secondary">
              Card description goes here
            </p>
          </Card>

          <Card hoverable>
            <h3 className="text-lg font-bold text-neutral-dark dark:text-neutral-light mb-2">
              Another Card
            </h3>
            <p className="text-text-secondary dark:text-text-light-secondary">
              More card content
            </p>
          </Card>

          <Card hoverable>
            <h3 className="text-lg font-bold text-neutral-dark dark:text-neutral-light mb-2">
              Third Card
            </h3>
            <p className="text-text-secondary dark:text-text-light-secondary">
              And more content
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}