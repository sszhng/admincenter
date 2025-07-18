'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function CaretIcon() {
  return (
    <svg className="block size-full" fill="none" viewBox="0 0 14 7">
      <path
        clipRule="evenodd"
        d="M7 7L0 0H14L7 7Z"
        fill="currentColor"
        fillOpacity="0.6"
        fillRule="evenodd"
      />
    </svg>
  );
}

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  isSelected?: boolean;
}

function NavItem({ href, children, isSelected }: NavItemProps) {
  return (
    <Link 
      href={href}
      className={`relative flex w-full items-center ${isSelected ? 'text-[rgba(0,0,0,0.9)]' : 'text-[rgba(0,0,0,0.75)]'}`}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 h-full w-1 bg-[rgba(0,0,0,0.9)]" />
      )}
      <div className="flex w-full items-center py-3 pl-6 pr-4">
        <span className="text-[16px] font-semibold tracking-[-0.32px] leading-[1.25]">
          {children}
        </span>
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <nav className="relative h-screen w-80 bg-white flex flex-col">
      {/* Company Section */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-2">
            {/* Company Logo */}
            <div className="size-12 bg-[#00D647] flex items-center justify-center text-white font-bold text-[10px]">
              FLEXIS
            </div>
            
            {/* Company Info */}
            <div className="flex flex-col py-[5px]">
              <span className="text-[16px] font-semibold leading-[1.25] text-[rgba(0,0,0,0.9)] tracking-[-0.32px]">
                Flexis
              </span>
              <span className="text-[14px] leading-[1.25] text-[rgba(0,0,0,0.6)] tracking-[-0.15px]">
                akingsley@flexis.com
              </span>
            </div>
          </div>
          
          {/* Dropdown Caret */}
          <div className="size-6 text-black">
            <div className="relative h-[7px] w-3.5 left-[5px] top-[9px]">
              <CaretIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col">
        <NavItem href="/overview" isSelected={pathname === '/overview'}>
          Overview
        </NavItem>
        <NavItem href="/recommendations" isSelected={pathname === '/recommendations'}>
          Recommendations
        </NavItem>
        <NavItem href="/user-license-management" isSelected={pathname === '/user-license-management'}>
          User & license management
        </NavItem>
      </div>

      {/* Spacer to push content to top but allow sidebar to extend full height */}
      <div className="flex-1" />

      {/* Right Border Shadow */}
      <div className="absolute inset-0 pointer-events-none shadow-[-1px_0px_0px_0px_inset_rgba(0,0,0,0.08)]" />
    </nav>
  );
} 