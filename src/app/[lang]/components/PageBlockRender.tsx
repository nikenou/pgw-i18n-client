import Features from "./Features";
import { Hero, HeroProps } from "./Hero";
// import FormSubmit from "./FormSubmit";
import { ImageSliders, SliderShowProps } from "./ImageSliders";
// import LeadForm from "./LeadForm";

type PageBlock = HeroProps | SliderShowProps;


const blocks: Record<
  PageBlock["__component"],
  React.ComponentType<{ section: PageBlock }>
> = {
  "sections.hero": ({ section }: { section: PageBlock }) => (
    <Hero section={section as HeroProps} />
  ),
  "sections.image-sliders": ({ section }: { section: PageBlock }) => (
    <div></div>
  ),
};



function PageBlockRender({ section }: { section: PageBlock }) {
  const BlockComponent = blocks[section.__component];
  return BlockComponent ? <BlockComponent section={section} /> : null;
}


export { PageBlockRender };
export type { PageBlock };
