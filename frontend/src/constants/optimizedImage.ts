import imageManifest from './optimizedImages.json';

type ImageEntry = {
  width: number;
  height: number;
  variants: { width: number; src: string }[];
};

const images: Record<string, ImageEntry> = imageManifest;

export function optimizedImage(original: string, sizes: string) {
  const image = images[original];
  if (!image) throw new Error(`Missing optimized image metadata: ${original}`);

  return {
    src: encodeURI(image.variants[image.variants.length - 1].src),
    srcSet: image.variants.map(({ src, width }) => `${encodeURI(src)} ${width}w`).join(', '),
    sizes,
    width: image.width,
    height: image.height,
  };
}
