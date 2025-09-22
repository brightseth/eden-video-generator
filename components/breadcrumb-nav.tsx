'use client';

import React from 'react';
import { ChevronRight, Home, Film, FileText } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ElementType;
  external?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="bg-black/60 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => {
            const IconComponent = item.icon;
            const isLast = index === items.length - 1;

            return (
              <React.Fragment key={index}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 transition-colors ${
                      isLast
                        ? 'text-white font-medium'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span className="helvetica-micro">{item.label}</span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 transition-colors ${
                      isLast
                        ? 'text-white font-medium'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span className="helvetica-micro">{item.label}</span>
                  </Link>
                )}

                {!isLast && (
                  <ChevronRight className="w-3 h-3 text-white/40" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

// Pre-configured breadcrumb sets
export const hubBreadcrumb: BreadcrumbItem = {
  label: 'SETH VIBE CODING',
  href: 'https://chapter-2-deck.vercel.app',
  icon: Home,
  external: true
};

export const videoBreadcrumb: BreadcrumbItem = {
  label: 'Video Generator',
  href: '/',
  icon: Film
};

export const directorBreadcrumb: BreadcrumbItem = {
  label: 'Director Mode',
  href: '/director',
  icon: Film
};

export const manualBreadcrumb: BreadcrumbItem = {
  label: 'Manual Mode',
  href: '/manual',
  icon: FileText
};