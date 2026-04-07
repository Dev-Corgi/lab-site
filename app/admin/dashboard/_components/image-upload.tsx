"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function ImageUpload({ value, onChange, folder = "general" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("images").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("images").getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
  }, [folder, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".svg"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleRemove = () => onChange("");

  if (value) {
    return (
      <div className="relative inline-block">
        <img src={value} alt="" className="h-24 w-24 rounded-lg object-cover border border-white/10" />
        <button onClick={handleRemove}
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700">
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div {...getRootProps()}
      className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 cursor-pointer transition-colors ${
        isDragActive ? "border-red-500/50 bg-red-500/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"
      }`}>
      <input {...getInputProps()} />
      {uploading ? (
        <p className="text-xs text-gray-500">업로드 중...</p>
      ) : (
        <>
          <Upload className="h-5 w-5 text-gray-600 mb-2" />
          <p className="text-xs text-gray-500">클릭 또는 드래그하여 업로드</p>
          <p className="text-[10px] text-gray-600 mt-1">PNG, JPG, WebP (최대 5MB)</p>
        </>
      )}
    </div>
  );
}
