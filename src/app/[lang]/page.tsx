import LangRedirect from './components/LangRedirect';
import { PageBlockRender, PageBlock } from './components/PageBlockRender';

// import componentResolver from './utils/component-resolver';
import {getPageBySlug} from "@/utils/get-page-by-slug";
import pagePopulate from '@/lib/populate/page';

export default async function RootRoute({params}: { params: { lang: string } }) {
    try {
      const page = await getPageBySlug('home', params.lang, pagePopulate)
      if (page.error && page.error.status == 401)
        throw new Error(
          'Missing or invalid credentials. Have you created an access token using the Strapi admin panel? http://localhost:1337/admin/'
        )
      console.log('page', page)
      if (page.data.length === 0) return null
      const contentSections = page.data[0].contentSections;
      return contentSections.map((section: PageBlock) => (
        <PageBlockRender key={section.id} section={section} />
      ))
      /* return contentSections.map((section: any, index: number) =>
        componentResolver(section, index)
      ) */
    } catch (error: any) {
      // 移除对window.alert的使用，改为返回错误信息组件
      return <div>Error: {error.message}</div>;
    }
}