import  { Shield } from 'lucide-react';
import React from 'react'

const AuthShell = ({children}: {children: React.ReactNode}) => {
  return (
    <section className='flex" min-h-screen bg-linear-to-br from-stone-900 via-stone-800 to-green-950'>
      {/* Left panel — branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex lg:w-1/2">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative">
          <div className="mb-16 flex items-center gap-3">
            <div className="bg-green-600 flex h-10 w-10 items-center justify-center rounded-xl">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white">
              PayLink
            </span>
          </div>
          <h1 className="mb-4 text-4xl leading-tight font-bold text-balance text-white">
            Collect M-Pesa payments with a single link.
          </h1>
          <p className="max-w-sm text-lg leading-relaxed text-stone-400">
            Generate professional payment links, trigger STK push automatically,
            and get branded PDF receipts — all in one place.
          </p>
        </div>
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { label: "Instant STK Push", desc: "Customer pays with PIN" },
            { label: "Auto Receipts", desc: "PDF sent on confirmation" },
            // { label: "Queue Backed", desc: "BullMQ + Redis reliability" },
          ].map(({ label, desc }) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="bg-brand-400 mb-3 h-1.5 w-1.5 rounded-full" />
              <p className="mb-0.5 text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-stone-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <div className="bg-brand-600 flex h-8 w-8 items-center justify-center rounded-lg">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-white">
              PayLink
            </span>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export default AuthShell