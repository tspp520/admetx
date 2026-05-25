'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FlaskConical, Boxes, ListChecks, Settings } from 'lucide-react';
import clsx from 'clsx';

const items = [
  { href: '/predict', icon: FlaskConical, label: '预测' },
  { href: '/models',  icon: Boxes,        label: '模型' },
  { href: '/tasks',   icon: ListChecks,   label: '任务' },
  { href: '/settings',icon: Settings,     label: '设置' },
];

export function SideNav() {
  const path = usePathname();
  return (
    <nav className="w-16 border-r bg-white flex flex-col items-center pt-4 gap-1">
      {items.map(({ href, icon: Icon, label }) => {
        const active = path.startsWith(href);
        return (
          <Link key={href} href={href}
            className={clsx(
              'flex flex-col items-center gap-1 py-3 w-full text-[11px]',
              active
                ? 'text-teal-600 border-l-2 border-teal-500 bg-teal-50'
                : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
            )}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
