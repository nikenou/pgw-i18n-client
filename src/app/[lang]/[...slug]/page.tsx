import {Metadata} from "next";
import {getPageBySlug} from "@/utils/get-page-by-slug";
import {FALLBACK_SEO} from "@/utils/constants";
import { PageBlockRender, PageBlock } from '../components/PageBlockRender';
// import componentResolver from "../../../utils/component-resolver";
import { Locale } from "@/lib/definitions";

type Props = {
    params: {
        lang: Locale,
        slug: string
    }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const page = await getPageBySlug(params.slug, params.lang);
    // console.log('slugPage', page);
    if (!page.data[0]?.seo) return FALLBACK_SEO;
    const metadata = page.data[0].seo

    return {
        title: metadata.metaTitle,
        description: metadata.metaDescription
    }
}

export default async function PageRoute({params}: Props) {
    const page = await getPageBySlug(params.slug, params.lang);
    if (page.data.length === 0) return null;
    const contentSections = page.data[0].contentSections;
      return contentSections.map((section: PageBlock) => (
        <PageBlockRender key={section.id} section={section} />
      ))
}