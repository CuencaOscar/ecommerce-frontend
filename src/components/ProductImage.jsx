import React, { useState } from 'react';
import PropTypes from 'prop-types';

/** Product photo with a lazy load and a branded fallback when there is no image or it fails to load. */
function ProductImage({ src, name, className }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`product-image product-image--fallback ${className}`} aria-hidden="true">
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      className={`product-image ${className}`}
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

ProductImage.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ProductImage.defaultProps = { src: '', className: '' };

export default ProductImage;
