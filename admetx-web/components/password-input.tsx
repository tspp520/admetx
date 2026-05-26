'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
};

export function PasswordInput({
  value, onChange, placeholder, autoComplete, className,
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={
          (className ?? '') +
          ' border rounded-md w-full pl-3 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400'
        }
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        aria-label={show ? '隐藏密码' : '显示密码'}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 p-1"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
