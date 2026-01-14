import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
// import Content from "@/components/Content";
import Footer from "./components/Footer";

import { getUser } from "@/lib/data";
import { Locale } from "@/lib/definitions";
import { getStrapiMedia, getStrapiURL } from "../../utils/api-helpers";
import { fetchAPI } from "@/utils/fetch-api";

import { i18n } from "../../../i18n-config";
import {FALLBACK_SEO} from "@/utils/constants";

import "@/app/globals.css";

async function getGlobal(lang: string): Promise<any> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: [
      "metadata",
      "favicon",
      "navbar.links",
      "navbar.navbarLogo.logoImg",
      "footer.footerLogo.logoImg",
      "footer.menuLinks",
      "footer.legalLinks",
      "footer.socialLinks",
      "footer.categories",
    ],
    // locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
}

// 获取翻译

export async function generateMetadata({ params } : { params: {lang: string}}): Promise<Metadata> {
  const meta = await getGlobal(params.lang);

  if (!meta.data) return FALLBACK_SEO;

  const { metadata, favicon } = meta.data;
  const { url } = favicon;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
    icons: {
      icon: [new URL(url, getStrapiURL())],
    },
  };
}

interface Props {
  params: { lang: Locale };
  children: React.ReactNode;
}

export default async function RootLayout({ params, children }: Props) {
  const user = await getUser();
  const global = await getGlobal(params.lang);
  
  // TODO: CREATE A CUSTOM ERROR PAGE
  if (!global.data) return null;
  const { navbar, footer } = global.data;

  const navbarLogoUrl = getStrapiMedia(
    navbar.navbarLogo.logoImg.url
  );

  const footerLogoUrl = getStrapiMedia(
    footer.footerLogo.logoImg.url
  );

  return (
    <html lang={params.lang}>
      <body className="relative min-h-screen overflow-y-auto bg-gray-50">
        <Navbar 
          locale={params.lang}
          links={navbar.links}
          logoUrl={navbarLogoUrl}
          logoText={navbar.navbarLogo.logoText}
          user={user} 
        />

        <main className="dark:bg-black dark:text-gray-100 min-h-screen">
          {children}
        </main>
        <Footer
          logoUrl={footerLogoUrl}
          logoText={footer.footerLogo.logoText}
          menuLinks={footer.menuLinks}
          categoryLinks={footer.categories}
          legalLinks={footer.legalLinks}
          socialLinks={footer.socialLinks}
        />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
