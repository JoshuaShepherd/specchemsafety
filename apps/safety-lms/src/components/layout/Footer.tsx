import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">SC</span>
              </div>
              <span className="text-xl font-bold">SpecChem Safety</span>
            </div>
            <p className="text-sm text-neutral-400">
              Internal safety training portal for SpecChem employees. OSHA-compliant training for concrete chemical manufacturing operations.
            </p>
            <div className="flex space-x-4">
              {/* Internal links */}
              <a href="mailto:safety@specchem.com" className="h-8 w-8 rounded bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors">
                <span className="text-xs">@</span>
              </a>
              <a href="/help" className="h-8 w-8 rounded bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors">
                <span className="text-xs">?</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links</h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Home
              </Link>
              <a
                href="/dashboard"
                className="block text-sm text-neutral-400 hover:text-white transition-colors"
              >
                My Progress
              </a>
              <a
                href="/help"
                className="block text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Help & Support
              </a>
              <a
                href="mailto:safety@specchem.com"
                className="block text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Contact Safety Team
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <div className="space-y-2">
              <a
                href="/reports"
                className="block text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Training Reports
              </a>
              <a
                href="/certificates"
                className="block text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Certificates
              </a>
              <a
                href="/compliance"
                className="block text-sm text-neutral-400 hover:text-white transition-colors"
              >
                OSHA Compliance
              </a>
              <a
                href="/policies"
                className="block text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Safety Policies
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <div className="space-y-2">
              <a
                href="/help"
                className="block text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Help Center
              </a>
              <a
                href="mailto:safety@specchem.com"
                className="block text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Safety Team
              </a>
              <a
                href="mailto:it@specchem.com"
                className="block text-sm text-neutral-400 hover:text-white transition-colors"
              >
                IT Support
              </a>
              <a
                href="/hr"
                className="block text-sm text-neutral-400 hover:text-white transition-colors"
              >
                HR Contact
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-neutral-400">
              Copyright © 2024 SpecChem Safety Training Portal. Internal use only.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="/privacy"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                IT Policies
              </a>
              <a
                href="/terms"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Safety Requirements
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
