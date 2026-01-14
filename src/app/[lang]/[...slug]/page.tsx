import {Metadata} from "next";
import {getPageBySlug} from "@/utils/get-page-by-slug";
import {FALLBACK_SEO} from "@/utils/constants";
import componentResolver from "../../../utils/component-resolver";
import { Locale } from "@/lib/definitions";

type Props = {
    params: {
        lang: Locale,
        slug: string
    }
}

// 删除Edge Runtime配置，静态导出不支持它
// export const runtime = 'edge';

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const page = await getPageBySlug(params.slug, params.lang);

    if (!page.data[0]?.attributes?.seo) return FALLBACK_SEO;
    const metadata = page.data[0].attributes.seo

    return {
        title: metadata.metaTitle,
        description: metadata.metaDescription
    }
}

export default async function PageRoute({params}: Props) {
    const page = await getPageBySlug(params.slug, params.lang);
    if (page.data.length === 0) return null;
    const contentSections = page.data[0].attributes.contentSections;
    return contentSections.map((section: any, index: number) => componentResolver(section, index));
}