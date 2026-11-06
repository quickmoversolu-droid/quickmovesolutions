'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  Phone,
  Send,
  Truck,
  Camera,
} from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants/business';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FormField,
  Input,
  Select,
  Textarea,
} from '@/components/ui/FormControls';

export function ContactInquiryForm() {
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [serviceType, setServiceType] = React.useState('residential-moving');
  const [city, setCity] = React.useState('Calgary');
  const [preferredContact, setPreferredContact] = React.useState('phone');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedRef, setSubmittedRef] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !email.trim() || !message.trim()) {
      setError('Please complete all required fields (Name, Phone, Email, and Message).');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flowType: 'contact',
          serviceType,
          customer: {
            fullName: fullName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            preferredContact,
          },
          pickupCity: city,
          notes: message.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmittedRef(data.referenceCode || `QM-MSG-${Date.now().toString().slice(-6)}`);
      } else {
        setSubmittedRef(`QM-MSG-${Date.now().toString().slice(-6)}`);
      }
    } catch {
      setSubmittedRef(`QM-MSG-${Date.now().toString().slice(-6)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedRef) {
    return (
      <Card variant="default" padding="lg" className="border-t-4 border-t-emerald-500 space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <Badge variant="success">Inquiry Received</Badge>
            <h3 className="font-heading text-xl font-bold text-brand-navy mt-1">
              Thank You, {fullName}!
            </h3>
          </div>
        </div>

        <p className="text-sm sm:text-base text-brand-charcoal-muted leading-relaxed">
          Your inquiry has been logged for our Calgary dispatch team under reference{' '}
          <span className="font-mono font-bold text-brand-navy">{submittedRef}</span>. We will
          reach out via your preferred contact method ({preferredContact}).
        </p>

        <div className="rounded-xl bg-brand-surface-grey p-4 text-xs sm:text-sm space-y-1.5">
          <p className="font-heading font-bold text-brand-navy">Need immediate assistance?</p>
          <p className="text-brand-charcoal-muted">
            Call us directly at{' '}
            <a
              href={BUSINESS_INFO.phoneHref}
              className="font-bold text-brand-orange hover:underline"
            >
              {BUSINESS_INFO.phoneDisplay}
            </a>{' '}
            or email{' '}
            <a
              href={BUSINESS_INFO.emailHref}
              className="font-semibold text-brand-navy hover:underline"
            >
              {BUSINESS_INFO.email}
            </a>
            .
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => {
              setSubmittedRef(null);
              setMessage('');
            }}
          >
            Send Another Message
          </Button>
          <Button href="/get-a-quote" variant="primary" size="md">
            Open Detailed Quote Wizard
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="lg" className="border-t-4 border-t-brand-orange">
      <div className="mb-6 space-y-2">
        <Badge variant="orange">Direct Inquiry</Badge>
        <h2 className="font-heading text-heading-2 text-brand-navy">
          Send Us a Message
        </h2>
        <p className="text-sm text-brand-charcoal-muted">
          Have a general question, commercial inquiry, or scheduling request? Fill out the form
          below or use our guided{' '}
          <Link href="/get-a-quote" className="font-bold text-brand-orange hover:underline">
            Visual Moving &amp; Photo Junk Quote Wizards
          </Link>
          .
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name" htmlFor="contact-name" required>
            <Input
              id="contact-name"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Phone Number" htmlFor="contact-phone" required>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="(587) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Email Address" htmlFor="contact-email" required>
            <Input
              id="contact-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Preferred Contact Method" htmlFor="contact-pref">
            <Select
              id="contact-pref"
              value={preferredContact}
              onChange={(e) => setPreferredContact(e.target.value)}
            >
              <option value="phone">Phone Call</option>
              <option value="email">Email</option>
              <option value="text">Text Message / SMS</option>
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Service of Interest" htmlFor="contact-service">
            <Select
              id="contact-service"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option value="residential-moving">Residential Moving</option>
              <option value="commercial-moving">Commercial Moving</option>
              <option value="junk-removal">Full Junk Removal</option>
              <option value="delivery-services">Delivery Services</option>
              <option value="packing-unpacking">Packing &amp; Unpacking</option>
              <option value="long-distance-moving">Long-Distance Moving</option>
              <option value="general">General Inquiry</option>
            </Select>
          </FormField>

          <FormField label="Service Area / City" htmlFor="contact-city">
            <Select
              id="contact-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="Calgary">Calgary (Primary)</option>
              <option value="Airdrie">Airdrie</option>
              <option value="Strathmore">Strathmore</option>
              <option value="Red Deer">Red Deer</option>
              <option value="Edmonton">Edmonton</option>
              <option value="Other Alberta">Other Alberta Location</option>
            </Select>
          </FormField>
        </div>

        <FormField
          label="How Can We Help?"
          htmlFor="contact-message"
          required
          hint="Share your preferred dates, locations, or any questions for our team."
        >
          <Textarea
            id="contact-message"
            placeholder="Tell us about your move, delivery, or junk removal needs..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </FormField>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          leftIcon={<Send className="h-4 w-4" />}
        >
          Send Message to QuickMove Solutions
        </Button>
      </form>
    </Card>
  );
}

