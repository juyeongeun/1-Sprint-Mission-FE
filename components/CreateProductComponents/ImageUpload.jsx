import React, { useState, useRef } from "react";
import styles from "./ImageUpload.module.css";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid"; // UUID를 생성하기 위해 v4 사용

const ImageUpload = ({ onImagesChange }) => {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 3) {
      alert("최대 3개까지 이미지를 선택할 수 있습니다.");
      return;
    }

    // 새로운 이미지들에 UUID를 추가하여 고유 ID 생성
    const newImages = files.map((file) => ({
      id: uuidv4(), // UUID로 고유 ID 부여
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    const updatedImages = [...images, ...newImages].slice(0, 3);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleImageDelete = (id) => {
    const updatedImages = images.filter((image) => image.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages);
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

        {images.map((image) => (
          <div key={image.id} className={styles.imageItem}>
            <Image
              src={image.previewUrl}
              alt={`미리보기 ${image.id}`}
              className={styles.imagePreview}
              width={150}
              height={150}
            />
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => handleImageDelete(image.id)}
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
