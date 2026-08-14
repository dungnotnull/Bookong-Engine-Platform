'use client';

import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2, X, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface ImageUploadInputProps {
  label?: string;
  value?: string;
  values?: string[];
  onChange?: (url: string) => void;
  onMultipleChange?: (urls: string[]) => void;
  multiple?: boolean;
  required?: boolean;
  maxFiles?: number;
}

// Helper function to normalize static uploaded image URLs
const normalizeImageUrl = (urlStr: string): string => {
  if (!urlStr) return '';
  if (urlStr.startsWith('http://') || urlStr.startsWith('https://') || urlStr.startsWith('data:')) {
    return urlStr;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const backendOrigin = apiBase.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
  const cleanPath = urlStr.startsWith('/') ? urlStr : `/${urlStr}`;
  return `${backendOrigin}${cleanPath}`;
};

export function ImageUploadInput({
  label,
  value,
  values,
  onChange,
  onMultipleChange,
  multiple = false,
  required = false,
  maxFiles = 10,
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Normalize image list: support both single `value` and array `values`
  const rawList: string[] = values
    ? values.filter(Boolean)
    : value
    ? [value]
    : [];

  const imageList: string[] = rawList.map(normalizeImageUrl);

  const updateImages = (newUrls: string[]) => {
    if (onMultipleChange) {
      onMultipleChange(newUrls);
    }
    if (onChange) {
      onChange(newUrls[0] || '');
    }
  };

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length === 0) return;

    // Reset value input so re-selecting the same files triggers onChange
    e.target.value = '';

    // Validate file formats & sizes
    const validFiles: File[] = [];
    for (const file of selectedFiles) {
      if (!file.type.match(/^image\/(jpeg|png|jpg|webp)$/)) {
        setErrorMsg(`Tệp "${file.name}" không đúng định dạng (.png, .jpg, .jpeg, .webp).`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(`Tệp "${file.name}" vượt quá kích thước cho phép (tối đa 5MB).`);
        return;
      }
      validFiles.push(file);
    }

    if (imageList.length + validFiles.length > maxFiles) {
      setErrorMsg(`Chỉ được phép tải lên tối đa ${maxFiles} hình ảnh.`);
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadProgress(`Đang tải ảnh ${i + 1}/${validFiles.length}...`);

        const formData = new FormData();
        formData.append('file', file);

        // Upload to POST /api/v1/upload/image
        const res: any = await apiClient.post('/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const url = res?.data?.url || res?.url;
        if (url && typeof url === 'string' && !url.startsWith('blob:')) {
          uploadedUrls.push(url);
        } else {
          throw new Error(`Đường dẫn ảnh trả về từ tệp "${file.name}" không hợp lệ`);
        }
      }

      if (uploadedUrls.length > 0) {
        if (multiple || values || onMultipleChange) {
          updateImages([...imageList, ...uploadedUrls]);
        } else {
          updateImages([uploadedUrls[0]]);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Tải tệp ảnh lên máy chủ thất bại. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const nextList = imageList.filter((_, idx) => idx !== indexToRemove);
    updateImages(nextList);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-800">{label}</label>
          {(multiple || values) && imageList.length > 0 && (
            <span className="text-[11px] font-semibold text-gray-500">
              Đã tải lên: <strong className="text-booking-blue">{imageList.length}</strong>/{maxFiles} ảnh
            </span>
          )}
        </div>
      )}

      {/* Modern Image Upload Grid / Container */}
      {multiple || values ? (
        <div className="space-y-3">
          {/* Thumbnails Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imageList.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className="relative h-32 rounded-xl overflow-hidden border border-gray-200 shadow-xs group bg-gray-100 transition-all hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-2 rounded-full bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-all flex items-center gap-1 shadow-md"
                    title="Xóa hình ảnh này"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {idx === 0 && (
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-booking-navy/90 backdrop-blur-sm text-white text-[9px] font-bold">
                    Ảnh đại diện
                  </div>
                )}
              </div>
            ))}

            {/* Add More Button Tile */}
            {imageList.length < maxFiles && (
              <label
                className={`flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 hover:border-booking-blue rounded-xl cursor-pointer bg-gray-50/50 hover:bg-blue-50/30 transition-all p-3 text-center ${
                  isUploading ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  multiple
                  onChange={handleFilesChange}
                  disabled={isUploading}
                  required={required && imageList.length === 0}
                  className="hidden"
                />
                {isUploading ? (
                  <div className="flex flex-col items-center gap-1.5 text-booking-blue">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-[10px] font-bold">{uploadProgress || 'Đang tải lên...'}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-gray-500">
                    <div className="p-2 rounded-full bg-blue-50 text-booking-blue">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-booking-blue">
                      {imageList.length > 0 ? 'Thêm ảnh khác' : 'Chọn ảnh từ máy tính'}
                    </span>
                    <span className="text-[10px] text-gray-400">Chọn 1 hoặc nhiều tệp</span>
                  </div>
                )}
              </label>
            )}
          </div>
        </div>
      ) : (
        /* Single Upload View */
        <div className="w-full">
          {imageList.length > 0 && imageList[0] ? (
            <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-gray-200 shadow-xs group bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageList[0]} alt="Uploaded Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(0)}
                  className="p-2 rounded-full bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-all flex items-center gap-1 shadow-md"
                >
                  <X className="w-4 h-4" /> Xóa ảnh
                </button>
              </div>
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Đã tải lên Server
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 hover:border-booking-blue rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-blue-50/30 transition-all p-4 text-center">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                multiple
                onChange={handleFilesChange}
                disabled={isUploading}
                required={required}
                className="hidden"
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-booking-blue">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-bold">{uploadProgress || 'Đang tải tệp ảnh lên máy chủ...'}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <div className="p-3 rounded-full bg-blue-50 text-booking-blue">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      Nhấp vào đây để chọn tệp ảnh từ máy tính (Có thể chọn nhiều ảnh)
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Hỗ trợ định dạng PNG, JPG, WEBP (Tối đa 5MB/tệp)
                    </p>
                  </div>
                </div>
              )}
            </label>
          )}
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] text-rose-600 font-bold mt-1 flex items-center gap-1">
          ⚠️ {errorMsg}
        </p>
      )}
    </div>
  );
}

