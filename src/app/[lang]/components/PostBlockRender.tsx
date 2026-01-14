import { Slider, SliderProps } from "./Slider";

type PageBlock = SliderProps;


const blocks: Record<
  PageBlock["__component"],
  React.ComponentType<{ section: PageBlock }>
> = {
  "blocks.slider": ({ section }: { section: PageBlock }) => (
    <Slider data={section as SliderProps} />
  ),
};



function PostBlockRender({ section }: { section: PageBlock }) {
  const BlockComponent = blocks[section.__component];
  return BlockComponent ? <BlockComponent section={section} /> : null;
}


export { PostBlockRender };
export type { PageBlock };
