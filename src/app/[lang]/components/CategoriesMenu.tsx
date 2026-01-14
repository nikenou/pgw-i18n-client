'use client';
import Link from "next/link";
import { useState, useRef } from "react";
import { ControlledMenu, MenuItem, SubMenu, useHover, useMenuState } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent?: Category;
  articles: Array<{}>;
  children?: Array<Category>;
}

function selectedFilter(current: string, selected: string) {
  return current === selected
    ? "px-3 py-1 rounded-lg hover:underline dark:bg-violet-700 dark:text-gray-100"
    : "px-3 py-1 rounded-lg hover:underline dark:bg-violet-400 dark:text-gray-900";
}

export default function CategoriesMenu({
  categories
}: {
  categories: Category[];
}) {
  // 递归组件：渲染分类菜单项及其子分类
  const CategoryMenuItem = ({ category }: { category: Category }) => {
    const hasChildren = category.children && category.children && category.children.length > 0;
    
    if (hasChildren && category.children) {
      return (
        <SubMenu label={<Link href={`/product/${category.slug}`}>{category.name}</Link>}>
          {category.children.map((child) => (
            <CategoryMenuItem key={child.id} category={child} />
          ))}
        </SubMenu>
      );
    } else {
      return (
        <MenuItem>
          <Link href={`/product/${category.slug}`}>
            {category.name}
          </Link>
        </MenuItem>
      );
    }
  };

  // 为每个顶级分类创建独立的状态和ref的组件
  const CategoryWithMenu = ({ category }: { category: Category }) => {
    const ref = useRef<HTMLDivElement>(null) as any;
    const [menuState, toggle] = useMenuState({ transition: true });
    const { anchorProps, hoverProps } = useHover(menuState.state, toggle);

    return (
      <div key={category.id} ref={ref} {...anchorProps}>
        <Link
          href={`/product/${category.slug}`}
          className={selectedFilter(
            category.slug,
            ''
          )}
        >
          {category.name}
        </Link>
        {category.children && category.children && category.children.length > 0 && (
          <ControlledMenu
            {...hoverProps}
            {...menuState}
            anchorRef={ref}
            onClose={() => toggle(false)}
          >
            {category.children.map((child) => (
              <CategoryMenuItem key={child.id} category={child} />
            ))}
          </ControlledMenu>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 rounded-lg dark:bg-gray-900 relative">
      <h4 className="text-xl font-semibold">Browse By Category</h4>

      <div>
        <div className="flex flex-wrap py-6 space-x-2 dark:border-gray-400">
          <div>
            <Link href={"/product"} className={selectedFilter("", "filter")}>
              全部
            </Link>
          </div>
          {categories.map((category: Category) => {
            if (category.parent === null) {
              return (
                <CategoryWithMenu key={category.id} category={category} />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
