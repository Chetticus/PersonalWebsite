import { biography } from './projects.js';

// Replace the portrait here; no photograph of Nam has been supplied.
export const portrait = {
  src: '/portrait-placeholder.svg',
  alt: 'Replaceable portrait placeholder for Nguyen Hai Nam. No photograph supplied.',
  placeholder: true,
};

// The supplied statement leads; the longer autobiographical account expands in place.
const [lead,...background]=biography.statement.split(' From programming');
export const introduction = [
  {title:'Hi, I’m Hai Nam.',text:lead},
  {text:'From programming'+background.join(' From programming')},
  {text:biography.about[0]},
];
export const biographyMore=biography.about.slice(1);
export const biographyMedia=biography.media;
