"use client";

import NextLink from "next/link";
import { FaInstagram, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Link } from "@heroui/react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-default-200/50 bg-background/80 backdrop-blur-md'>
      <div className='container mx-auto flex h-16 max-w-7xl items-center justify-between px-6'>
        {/* Brand */}
        <NextLink
          className='flex items-center gap-2'
          href='/'
          onClick={() => setIsMenuOpen(false)}>
          <Logo />
        </NextLink>

        {/* Desktop nav */}
        <ul className='hidden gap-6 sm:flex'>
          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <NextLink
                className='text-foreground transition-colors hover:text-primary data-[active=true]:font-medium data-[active=true]:text-primary'
                href={item.href}>
                {item.label}
              </NextLink>
            </li>
          ))}
        </ul>

        {/* Desktop right side */}
        <div className='hidden items-center gap-4 sm:flex'>
          <Link
            aria-label='Instagram'
            href={siteConfig.links.instagram}
            rel='noopener noreferrer'
            target='_blank'>
            <FaInstagram className='text-default-500 size-6' />
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile right side */}
        <div className='flex items-center gap-3 sm:hidden'>
          <Link
            aria-label='Instagram'
            href={siteConfig.links.instagram}
            rel='noopener noreferrer'
            target='_blank'>
            <FaInstagram className='text-default-500 size-5' />
          </Link>
          <ThemeToggle />
          <button
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            className='rounded-md p-2 text-default-700 transition-colors hover:bg-default-100'
            onClick={() => setIsMenuOpen((v) => !v)}>
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen ? (
        <div className='border-t border-default-200/50 bg-background sm:hidden'>
          <ul className='container mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4'>
            {siteConfig.navMenuItems.map((item) => (
              <li key={item.href}>
                <NextLink
                  className={cn(
                    "block rounded-md px-3 py-2 text-base text-foreground transition-colors",
                    "hover:bg-default-100",
                  )}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
};
