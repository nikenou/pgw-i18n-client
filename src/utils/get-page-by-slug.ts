import {fetchAPI} from "@/utils/fetch-api";

export async function getPageBySlug(slug: string, lang: string, extraParams = {}) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    const path = `/pages`;
    const urlParamsObject = {
        filters: {slug}, 
        // locale: lang
    };
    const options = {headers: {Authorization: `Bearer ${token}`}};
    return await fetchAPI(path, {...urlParamsObject, ...extraParams}, options);
}