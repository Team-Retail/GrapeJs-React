import React from 'react';

const LazyImage = ({ src, alt, ...props }) => {
  return <img src={src} alt={alt} {...props} />;
};

export default LazyImage;
