// Helpers for building optimized Cloudinary delivery URLs
const CLOUD = 'https://res.cloudinary.com/billymitchell';

// Image by public ID (with or without a file extension)
export const cloudinaryImage = (publicId, transforms = 'f_auto,q_auto') =>
  `${CLOUD}/image/upload/${transforms}/${publicId}`;

// Add transformations to a full Cloudinary delivery URL
export const withTransforms = (secureUrl, transforms) =>
  secureUrl ? secureUrl.replace('/upload/', `/upload/${transforms}/`) : '';

// Still frame (jpg) for a Cloudinary video URL
export const videoPoster = (secureUrl, transforms = 'so_0,q_auto,w_800,c_limit') =>
  withTransforms(secureUrl, transforms).replace(/\.(mp4|webm|ogg|mov|avi)$/i, '.jpg');
