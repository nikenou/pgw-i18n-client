import NavbarContent from "@/components/NavbarContent";

import { Locale } from "@/lib/definitions";

async function getMessages(locale: string) {
  return (await import(`../lang/${locale}.json`)).default;
}

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
}

export default async function Navbar({ locale, links, logoUrl, logoText }: Props) {
  const messages = await getMessages(locale);

  return <NavbarContent locale={locale} messages={messages} links={links} logoUrl={logoUrl} logoText={logoText} />;
}
