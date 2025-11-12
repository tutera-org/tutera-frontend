"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkProps {
  href: string;
  linkText: string;
}

export default function NavLink({ href, linkText }: LinkProps) {
  const pathName = usePathname();

  const isActive = pathName === href || pathName.endsWith(href);

  return (
    <Link
      className={`
        font-semibold lg:text-sm text-base leading-tight rounded-2xl px-4  py-2 transition-all
        ${
          isActive
            ? "bg-primary-400 text-white"
            : "text-neutral-900 hover:bg-primary-400 hover:text-white"
        }
      `}
      href={href}
    >
      {linkText}
    </Link>
  );
}
