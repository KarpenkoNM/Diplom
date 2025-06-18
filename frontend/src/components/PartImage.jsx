import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

const PartImage = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const fallback = "/images/fallback.png";

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <Card.Img
      className="part-image"
      variant="top"
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
};

export default PartImage;
