import React, { useState, useRef, useCallback, useEffect } from "react";
import styles from "./ImageUpload.module.css";
import Image from "next/image";

const ImageUpload = ({ onImagesChange, initialImages = [] }) => {
  const url = "https://thrift-shop.onrender.com";
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImagesChange = useCallback(
    (updatedImages) => {
      onImagesChange(updatedImages);
    },
    [onImagesChange]
  );

  useEffect(() => {
    if (initialImages.length > 0 && images.length === 0) {
      const formattedImages = initialImages.map((image) => ({
        file: null,
        previewUrl: image.previewUrl,
        isExisting: true,
        isDeleted: false,
      }));

      setImages(formattedImages);
      handleImagesChange(formattedImages);
    }
  }, [initialImages, images.length, handleImagesChange]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 3) {
      alert("최대 3개까지 이미지를 선택할 수 있습니다.");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isExisting: false,
      isDeleted: false,
    }));

    const updatedImages = [...images, ...newImages].slice(0, 3);
    setImages(updatedImages);
    handleImagesChange(updatedImages);
  };

  const handleImageDelete = (index) => {
    const updatedImages = images.map((img, i) => {
      if (i === index && img.isExisting) {
        return { ...img, isDeleted: true };
      }
      return img;
    });

    const filteredImages = updatedImages.filter((img) => !img.isDeleted);
    setImages(filteredImages);
    handleImagesChange(filteredImages);
  };

  return (
    <div className={styles.imageUploadContainer}>
      <div className={styles.imageGrid}>
        <div className={styles.imageItem}>
          <label htmlFor="imageInput" className={styles.imageLabel}>
            <div className={styles.imageUploadBox}>이미지 등록</div>
            <input
              type="file"
              id="imageInput"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {images.map((image, index) => (
          <div key={index} className={styles.imageItem}>
            <Image
              src={
                image.previewUrl.startsWith("blob:")
                  ? image.previewUrl
                  : url + image.previewUrl
              }
              alt={`미리보기 ${index + 1}`}
              className={styles.imagePreview}
              width={150}
              height={150}
            />
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => handleImageDelete(index)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
