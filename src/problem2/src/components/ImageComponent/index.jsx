import { useEffect, useState } from "react";

const ImageComponent = ({ src, ...props }) => {
  const [isValidImage, setIsValidImage] = useState(true);
  useEffect(() => {
    async function checkImage(src) {
      try {
        const response = await fetch(src);
        setIsValidImage(response.ok);
      } catch (error) {
        setIsValidImage(false);
      }
    }

    checkImage(src);
  }, [src]);

  if (!isValidImage) {
    return null;
  }

  return <img src={src} {...props} />;
};

export default ImageComponent;
