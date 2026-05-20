'use client';

import { useState } from 'react';
import { AVAILABLE_ROLES, ROLE_METADATA } from '@/lib/roles';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  loading?: boolean;
  initialData?: UserFormData;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password?: string;
}

export function UserForm({ onSubmit, loading = false, initialData }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>(
    initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'viewer',
      password: ''
    }
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateEmail = async (email: string) => {
    if (!email) return;
    try {
      const response = await fetch(`/api/admin/users/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (data.exists && data.userId !== initialData?.email) {
        setEmailError('Email already in use');
      } else {
        setEmailError('');
      }
    } catch (error) {
      console.error('Email validation error:', error);
    }
  };

  const validatePhone = async (phone: string) => {
    if (!phone) return;
    try {
      const response = await fetch(`/api/admin/users/check-phone?phone=${encodeURIComponent(phone)}`);
      const data = await response.json();
      if (data.exists && data.userId !== initialData?.phone) { // assuming email was a typo in original instructions for phone checking
        setPhoneError('Phone number already in use');
      } else {
        setPhoneError('');
      }
    } catch (error) {
      console.error('Phone validation error:', error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    validateEmail(email);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setFormData({ ...formData, phone });
    validatePhone(phone);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First and last names are required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (emailError) {
      setError(emailError);
      return;
    }
    if (phoneError) {
      setError(phoneError);
      return;
    }
    if (!formData.role) {
      setError('Role is required');
      return;
    }
    if (!initialData && !formData.password) {
      setError('Password is required for new users');
      return;
    }

    try {
      await onSubmit(formData);
      setSuccess('User saved successfully');
      if (!initialData) {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: 'viewer',
          password: ''
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save user');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="John"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-gold focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Doe"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-gold focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={handleEmailChange}
          placeholder="user@example.com"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-gold focus:border-transparent ${
            emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          required
          disabled={loading}
        />
        {emailError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Phone Number</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="+1 (555) 000-0000"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-gold focus:border-transparent ${
            phoneError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          disabled={loading}
        />
        {phoneError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{phoneError}</p>}
        <p className="mt-1 text-xs text-gray-500">Optional</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Role *</label>
        <div className="space-y-3 mb-4">
          <select
            value={formData.role}
            onChange={handleRoleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-gold focus:border-transparent"
            required
            disabled={loading}
          >
            <option value="">-- Select a role --</option>
            {AVAILABLE_ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_METADATA[role].label} - {ROLE_METADATA[role].description}
              </option>
            ))}
          </select>
        </div>

        {formData.role && (
          <div className={`p-4 rounded-lg ${ROLE_METADATA[formData.role as keyof typeof ROLE_METADATA].color}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{ROLE_METADATA[formData.role as keyof typeof ROLE_METADATA].icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{ROLE_METADATA[formData.role as keyof typeof ROLE_METADATA].label}</h4>
                <p className="text-sm mb-3">{ROLE_METADATA[formData.role as keyof typeof ROLE_METADATA].description}</p>
                <details className="text-sm">
                  <summary className="cursor-pointer font-semibold hover:underline">View Permissions</summary>
                  <div className="mt-2 pl-4 border-l-2 space-y-1">
                    <p>✓ Can access assigned modules</p>
                    <p>✓ Limited to assigned actions</p>
                    <p>✓ Data filtered by role</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}
      </div>

      {!initialData && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Password *</label>
          <input
            type="password"
            value={formData.password || ''}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-gold focus:border-transparent"
            required={!initialData}
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">Minimum 8 characters recommended</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !!emailError || !!phoneError}
        className="w-full bg-gradient-to-r from-[#D4A017] to-[#B8860B] dark:from-[#FFD700] dark:to-[#FFC700] text-[#2B1D13] dark:text-[#1A1410] px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {initialData ? 'Update User' : 'Create User'}
      </button>
    </form>
  );
}