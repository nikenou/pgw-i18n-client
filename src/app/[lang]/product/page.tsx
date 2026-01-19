"use client";
import { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "../../../utils/fetch-api";

import Loader from "../components/Loader";
// import ProductList from "../views/product-list";
import PageHeader from "../components/PageHeader";
import CategoriesMenu from "@/app/[lang]/components/CategoriesMenu";

interface Meta {
  pagination: {
    start: number;
    limit: number;
    total: number;
  };
}

async function fetchCategoriesData() {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const options = { headers: { Authorization: `Bearer ${token}` } };

    const categoriesResponse = await fetchAPI(
      "/categories",
      { 
        filters: {
          parent: {
            $null: true
          }
        },
        populate: {
          children: {
            populate: {
              children: "*"
            }
          }
        }
      },
      options
    );
    
    return categoriesResponse.data;
  } catch (error) {
    console.error(error);
  }
}

export default function Profile() {
  const [meta, setMeta] = useState<Meta | undefined>();
  const [productsData, setProductsData] = useState<any>([]);
  const [categoriesData, setCategoriesData] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchData = useCallback(async (start: number, limit: number) => {
    setLoading(true);
    try {
      const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
      const path = `/articles`;
      const urlParamsObject = {
        sort: { createdAt: "desc" },
        populate: {
          cover: { fields: ["url"] },
          category: { populate: "*" },
          author: {
            populate: "*",
          },
        },
        pagination: {
          start: start,
          limit: limit,
        },
      };
      const categoriesPath = `/categories`;
      const categoriesParamsObject = { 
        filters: {
          parent: {
            $null: true
          }
        },
        populate: {
          children: {
            populate: {
              children: "*"
            }
          },
          parent: {
            populate: "*"
          }
        }
      };
      const options = { headers: { Authorization: `Bearer ${token}` } };
      const responseData = await fetchAPI(path, urlParamsObject, options);
      const categoriesResponse = await fetchAPI(categoriesPath, categoriesParamsObject, options);

      if (start === 0) {
        setProductsData(responseData.data || []);
        setCategoriesData(categoriesResponse.data || []);
      } else {
        setProductsData((prevData: any[] ) => [...prevData, ...responseData.data]);
        setCategoriesData((prevData: any[] ) => [...prevData, ...categoriesResponse.data]);
      }

      setMeta(responseData.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  function loadMorePosts(): void {
    const nextPosts = meta!.pagination.start + meta!.pagination.limit;
    fetchData(nextPosts, Number(process.env.NEXT_PUBLIC_PAGE_LIMIT));
  }

  useEffect(() => {
    fetchData(0, Number(process.env.NEXT_PUBLIC_PAGE_LIMIT));
  }, [fetchData]);

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader heading="Our Products for You" text="Checkout Something Cool" />
      <CategoriesMenu categories={categoriesData} />
      {/* <ProductList data={productsData}>
        {meta!.pagination.start + meta!.pagination.limit <
          meta!.pagination.total && (
          <div className="flex justify-center">
            <button
              type="button"
              className="px-6 py-3 text-sm rounded-lg hover:underline dark:bg-gray-900 dark:text-gray-400"
              onClick={loadMorePosts}
            >
              Load more posts...
            </button>
          </div>
        )}
      </ProductList> */}
    </div>
  );
}
