"use client";
import { Slide } from "react-slideshow-image";
import { getStrapiMedia } from "@/utils/api-helpers";
import Image from "next/image";

interface Image {
  alternativeText: string | null;
  caption: string | null;
  url: string;
}

interface Slider {
  id: string;
  image: Image;
  title: string;
  url: string;
}

export interface SliderShowProps {
  __component: "sections.image-sliders";
  id: string;
  name: string;
  sliders: Slider[];
}

export function ImageSliders({ section }: {section: SliderShowProps} ) {
  return (
    <div className="slide-container">
      {<Slide slidesToScroll={1} slidesToShow={3} indicators={true}>
        {section.sliders.map((slider: Slider, index) => {
          const imageUrl = getStrapiMedia(slider.image.url);
          return (
            <div key={index}>
              {imageUrl && <Image className="w-full h-96 object-cover" height={400} width={600} alt="alt text" src={imageUrl} />}
              <a href={slider.url} target="_blank" rel="noopener noreferrer"><p className="text-center">{slider.title || 'Image'}</p></a>
            </div>
          );
        })}
      </Slide>}
    </div>
  );
}
