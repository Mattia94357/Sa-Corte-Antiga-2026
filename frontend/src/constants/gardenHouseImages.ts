const gardenHouseBase = '/garden house images';

export const gardenHousePhotos = [
  { src: `${gardenHouseBase}/IMG20260913094650.jpg`, alt: 'Outdoor sink on the Garden House terrace' },
  { src: `${gardenHouseBase}/IMG20260913094225.jpg`, alt: 'Garden House living area' },
  { src: `${gardenHouseBase}/IMG20260913094213.jpg`, alt: 'Garden House living room' },
  { src: `${gardenHouseBase}/IMG20260913094131.jpg`, alt: 'Television and cabinet in the Garden House living room' },
  { src: `${gardenHouseBase}/IMG20250922084809.jpg`, alt: 'Kitchen counter and stove at Garden House' },
  { src: `${gardenHouseBase}/IMG20250922084744.jpg`, alt: 'Garden House dining area' },
  { src: `${gardenHouseBase}/IMG20250813185124.jpg`, alt: 'Garden House outdoor space at sunset' },
  { src: `${gardenHouseBase}/IMG20250813185055.jpg`, alt: 'Garden House sheltered terrace' },
  { src: `${gardenHouseBase}/IMG20250813095355.jpg`, alt: 'Garden House bathroom' },
  { src: `${gardenHouseBase}/IMG20250813095347.jpg`, alt: 'Garden House bathroom detail' },
  { src: `${gardenHouseBase}/IMG20250813095341.jpg`, alt: 'Toilet, bidet and sink in the Garden House bathroom' },
  { src: `${gardenHouseBase}/IMG20250813095254.jpg`, alt: 'Garden House bedroom' },
  { src: `${gardenHouseBase}/IMG20250813095236.jpg`, alt: 'Garden House bedroom interior' },
  { src: `${gardenHouseBase}/IMG20250813094925.jpg`, alt: 'Garden House kitchen and dining area' },
  { src: `${gardenHouseBase}/IMG20250730113619.jpg`, alt: 'Garden House sea-view veranda' },
  { src: `${gardenHouseBase}/IMG20250730113053.jpg`, alt: 'Washing machine beside the Garden House bedroom window' },
  { src: `${gardenHouseBase}/IMG20250730112427.jpg`, alt: 'Double bed, dresser and wardrobe in the Garden House bedroom' },
  { src: `${gardenHouseBase}/IMG20250730112427 (1).jpg`, alt: 'Garden House bedroom detail' },
] as const;

export const gardenHouseFeatured = {
  hero: `${gardenHouseBase}/outsideviewgardenhouse.png`,
  terrace: `${gardenHouseBase}/IMG20250813185055.jpg`,
  outdoor: `${gardenHouseBase}/seaviewgardenhouse.png`,
  dining: `${gardenHouseBase}/IMG20250922084744.jpg`,
  bedroom: `${gardenHouseBase}/IMG20250813095236.jpg`,
  living: `${gardenHouseBase}/IMG20260913094225.jpg`,
} as const;
