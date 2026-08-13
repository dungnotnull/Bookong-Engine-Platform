'use client';

import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, Loader2, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface ImageUploadInputProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export function ImageUploadInput({ label, value, onChange, required }: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|jpg|webp)$/)) {
      setErrorMsg('Vui lòng chỉ chọn tệp hình ảnh (.png, .jpg, .jpeg, .webp).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Kích thước tệp quá lớn (tối đa 5MB).');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to Backend POST /api/v1/upload/image
      const res: any = await apiClient.post('/upload/image', formData);
      const uploadedUrl = res?.data?.url || res?.url;

      if (uploadedUrl && typeof uploadedUrl === 'string' && !uploadedUrl.startsWith('blob:')) {
        onChange(uploadedUrl);
      } else {
        throw new Error('Đường dẫn ảnh trả về không hợp lệ');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Tải tệp ảnh lên máy chủ thất bại. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-semibold text-gray-700">{label}</label>}

      {value ? (
        <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-gray-200 shadow-xs group bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onChange('')}
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
            onChange={handleFileChange}
            disabled={isUploading}
            required={required && !value}
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-booking-blue">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">Đang tải tệp ảnh lên máy chủ...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <div className="p-3 rounded-full bg-blue-50 text-booking-blue">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">
                  Nhấp vào đây để chọn tệp ảnh từ máy tính
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Hỗ trợ định dạng PNG, JPG, WEBP (Tối đa 5MB)
                </p>
              </div>
            </div>
          )}
        </label>
      )}

      {errorMsg && (
        <p className="text-[11px] text-rose-600 font-bold mt-1 flex items-center gap-1">
          ⚠️ {errorMsg}
        </p>
      )}
    </div>
  );
}
