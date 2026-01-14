"use client";

import React, { useState, useCallback, useRef, forwardRef } from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import clsx from "clsx";
import { Dialog } from "@headlessui/react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import useOutsideClick from "@/hooks/useOutsideClick";
import { Locale } from "@/lib/definitions";

import Logo from "./Logo";

interface NavLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
}

interface Props {
  locale: Locale;
  links: Array<NavLink>;
  logoUrl: string | null;
  logoText: string | null;
  messages: Record<string, string>;
}

interface MobileNavLink extends NavLink {
  closeMenu: () => void;
}

function NavLink({ url, text }: NavLink) {
  const path = usePathname();

  return (
    <li className="flex">
      <Link
        href={url}
        className={`flex items-center mx-4 -mb-1 border-b-2 dark:border-transparent ${
          path === url && "dark:text-violet-400 dark:border-violet-400"
        }}`}
      >
        {text}
      </Link>
    </li>
  );
}

function MobileNavLink({ url, text, closeMenu }: MobileNavLink) {
  const path = usePathname();
  const handleClick = () => {
    closeMenu();
  };
  return (
    <span className="flex">
      <Link
        href={url}
        onClick={handleClick}
        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-100 hover:bg-gray-900 ${
          path === url && "dark:text-violet-400 dark:border-violet-400"
        }}`}
      >
        {text}
      </Link>
    </span>
  );
}

export default function NavbarContent({ locale, links, logoUrl, logoText, messages }: Props) {
  const pathname = usePathname();

  const appMenuRef = useRef(null);
  const langSwitcherMenuRef = useRef(null);

  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const [langSwitcherMenuOpen, setLangSwitcherMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  useOutsideClick(appMenuRef, () => {
    setAppMenuOpen(false);
  });

  useOutsideClick(langSwitcherMenuRef, () => {
    setLangSwitcherMenuOpen(false);
  });

  const handleAppMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAppMenuOpen(!appMenuOpen);
  };

  const handleLangSwitcherMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLangSwitcherMenuOpen(!langSwitcherMenuOpen);
  };

  return (
    <IntlProvider locale={locale} messages={messages}>
      <nav className="sticky top-0 left-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="h-16 flex w-full items-center">
          {/* B区域：Logo模块（固定在左侧） */}
          <div className="flex-shrink-0">
            <div className="mx-2">
              <Logo src={logoUrl}>
                {logoText && <h2 className="text-2xl font-bold">{logoText}</h2>}
              </Logo>
            </div>
          </div>

          {/* C区域：右侧区域（菜单+图标） */}
          <div className="flex-grow h-full">
            <div className="flex items-center justify-end h-full">
              <div className="flex items-center">
                {/* 左侧：导航菜单（可扩展） */}
                <div className="hidden lg:flex">
                  <ul className="flex space-x-3">
                    {links && links.map((item: NavLink) => (
                      <NavLink key={item.id} {...item} />
                    ))}
                  </ul>
                </div>

                {/* 右侧：语言切换器和移动端菜单按钮（固定在最右边） */}
                <div className="flex items-center space-x-2">
                  {/* 移动端菜单按钮 */}
                  <button
                    className="p-2 lg:hidden"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Bars3Icon className="h-7 w-7 text-gray-100" aria-hidden="true" />
                  </button>

                  {/* 移动端对话框 */}
                  <Dialog
                    as="div"
                    className="lg:hidden"
                    open={mobileMenuOpen}
                    onClose={setMobileMenuOpen}
                  >
                    <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75" />
                    <Dialog.Panel className="fixed inset-y-0 rtl:left-0 ltr:right-0 z-50 w-full overflow-y-auto bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-inset sm:ring-white/10">
                      <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                          <span className="sr-only">Strapi</span>
                          {logoUrl && <img className="h-8 w-auto" src={logoUrl} alt="" />}
                        </a>
                        <button
                          type="button"
                          className="-m-2.5 rounded-md p-2.5 text-white"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="sr-only">Close menu</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-700">
                          <div className="space-y-2 py-6">
                            {links && links.map((item) => (
                              <MobileNavLink
                                key={item.id}
                                closeMenu={closeMenu}
                                {...item}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Dialog>

                  {/* 语言切换器按钮 */}
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-full p-1 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600"
                      id="lang-switcher-menu-button"
                      aria-haspopup="true"
                      aria-expanded={langSwitcherMenuOpen}
                      onClick={handleLangSwitcherMenuClick}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                        />
                      </svg>
                    </button>

                    {langSwitcherMenuOpen && (
                      <Menu ref={langSwitcherMenuRef} aria-labelledby="lang-switcher-menu-button">
                        <MenuItem href={`/en/${pathname.split("/").slice(2).join("/")}`} active={locale === "en"}>
                          <FormattedMessage id="common.language-switcher" values={{ locale: "en" }} />
                        </MenuItem>
                        <MenuItem href={`/zh/${pathname.split("/").slice(2).join("/")}`} active={locale === "zh"}>
                          <FormattedMessage id="common.language-switcher" values={{ locale: "zh" }} />
                        </MenuItem>
                      </Menu>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </IntlProvider>
  );
}

interface MenuProps {
  align: "left" | "right";
  children: React.ReactNode;
  [x: string]: any;
}

const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu({ align = "right", children, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="menu"
      className={clsx(
        "absolute z-10 w-48 mt-2 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
        { "left=0": align === "left", "right-0": align === "right" }
      )}
      aria-orientation="vertical"
      tabIndex={-1}
      {...rest}
    >
      {children}
    </div>
  );
});

interface MenuItemProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}

function MenuItem({ href, active, children }: MenuItemProps) {
  return (
    <Link
      href={href}
      tabIndex={-1}
      role="menuitem"
      className={clsx("block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200", { "bg-gray-200": active })}
    >
      {children}
    </Link>
  );
}
