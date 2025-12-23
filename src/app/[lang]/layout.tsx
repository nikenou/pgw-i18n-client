import type { Metadata } from "next";
import "./globals.css";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";

// import Navbar from "@/components/Navbar";
// import Content from "@/components/Content";
// import Sidebar from "@/components/Sidebar";

import { getUser } from "@/lib/data";
import { Locale } from "@/lib/definitions";

import { i18n } from "../../../i18n-config";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import {FALLBACK_SEO} from "@/app/[lang]/utils/constants";

import "@/app/globals.css";

async function getGlobal(lang: string): Promise<any> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: [
      "metadata.shareImage",
      "favicon",
      "notificationBanner.link",
      "navbar.links",
      "navbar.navbarLogo.logoImg",
      "footer.footerLogo.logoImg",
      "footer.menuLinks",
      "footer.legalLinks",
      "footer.socialLinks",
      "footer.categories",
    ],
    locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
}

export async function generateMetadata({ params } : { params: {lang: string}}): Promise<Metadata> {
  const meta = await getGlobal(params.lang);

  if (!meta.data) return FALLBACK_SEO;

  const { metadata, favicon } = meta.data.attributes;
  const { url } = favicon.data.attributes;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
    icons: {
      icon: [new URL(url, getStrapiURL())],
    },
  };
}

interface Props {
  readonly children: React.ReactNode;
  readonly params: { lang: string };
}

export default async function Root({ params, children }: Props) {
  const user = await getUser();
  const global = await getGlobal(params.lang);

    // TODO: CREATE A CUSTOM ERROR PAGE
    if (!global.data) return null;
    const { notificationBanner, navbar, footer } = global.data.attributes;

    const navbarLogoUrl = getStrapiMedia(
      navbar.navbarLogo.logoImg.data?.attributes.url
    );

    const footerLogoUrl = getStrapiMedia(
      footer.footerLogo.logoImg.data?.attributes.url
    );

  return (
    <html lang={params.lang}>
      <body className="relative min-h-screen overflow-y-auto bg-gray-50">
        <Navbar
          links={navbar.links}
          logoUrl={navbarLogoUrl}
          logoText={navbar.navbarLogo.logoText}
        />

      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
