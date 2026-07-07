import { useState } from 'react';

export default function ImageWithFallback({ 
  src, 
  alt, 
  fallbackSrc = 'https://images.unsplash.com/photo-1596328322639-66c3c528f804?auto=format&fit=crop&w=600&q=80',
  className = '',
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={`object-cover ${className}`}
      {...props}
    />
  );
}
