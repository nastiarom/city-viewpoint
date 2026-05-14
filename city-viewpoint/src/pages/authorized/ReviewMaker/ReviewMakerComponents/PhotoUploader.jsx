import React from 'react';

export default function PhotoUploader({ photos = [], setPhotos }) {
    const MAX = 5;
    const handleFiles = e => {
        const files = Array.from(e.target.files);
        const availableSlots = MAX - photos.length;
        const newFiles = files.slice(0, availableSlots);

        if (newFiles.length === 0) return;

        const updatedPhotos = [...photos, ...newFiles];
        setPhotos(updatedPhotos);

        e.target.value = null;
    };


    const removePhoto = index => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="photo-uploader-wrapper">
                <label className="photo-upload-button">
                    Выбрать файлы (до {MAX})
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFiles}
                        hidden
                        disabled={photos.length >= MAX}
                    />
                </label>
                <span className="photo-upload-text">
                    {photos.length > 0 ? `Выбрано: ${photos.length}` : "Файлов не выбрано"}
                </span>
            </div>

            <div className="photos-preview">
                {(Array.isArray(photos) ? photos : []).map((file, i) => (
                    <div key={i} className="photo-wrapper">
                        <img
                            src={file instanceof File ? URL.createObjectURL(file) : file}
                            alt="preview"
                            className="photo-img"
                        />
                        <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="photo-remove-button"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
