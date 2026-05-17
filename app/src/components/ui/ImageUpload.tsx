'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    storagePath?: string | (() => string); // kept for API compatibility, unused
    shape?: 'square' | 'circle';
    placeholder?: string;
    className?: string;
}

const MAX_SIZE_MB = 1; // keep Firestore docs small
const MAX_DIMENSION = 800; // resize to max 800px

/** Resize + compress image and return a Base64 data URL */
function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Scale down if larger than MAX_DIMENSION
                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    if (width > height) {
                        height = Math.round((height * MAX_DIMENSION) / width);
                        width = MAX_DIMENSION;
                    } else {
                        width = Math.round((width * MAX_DIMENSION) / height);
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, width, height);

                // Try quality 0.8 first, drop to 0.6 if still too large
                let dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
                if (sizeKB > MAX_SIZE_MB * 1024) {
                    dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                }

                resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function ImageUpload({
    value,
    onChange,
    shape = 'square',
    placeholder = 'Click or drag to upload',
    className,
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        setUploading(true);
        try {
            const dataUrl = await compressImage(file);
            onChange(dataUrl);
        } catch (err) {
            console.error('Image processing failed:', err);
            alert('Failed to process image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const isCircle = shape === 'circle';

    return (
        <div className={cn('relative', className)}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
            />

            <div
                onClick={() => !uploading && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                    'relative overflow-hidden border-2 border-dashed transition-colors cursor-pointer group',
                    isCircle ? 'rounded-full aspect-square' : 'rounded-xl aspect-video',
                    dragOver ? 'border-gold-100 bg-gold-100/5' : 'border-beige-200 hover:border-gold-100/60',
                    uploading && 'cursor-wait pointer-events-none',
                )}
            >
                {/* Preview */}
                {value && !uploading && (
                    <img
                        src={value}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                {/* Overlay */}
                <div className={cn(
                    'absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity',
                    value && !uploading ? 'opacity-0 group-hover:opacity-100 bg-black/40' : 'opacity-100 bg-beige-50/30',
                )}>
                    {uploading ? (
                        <>
                            <Loader2 className="w-6 h-6 text-gold-100 animate-spin" />
                            <span className="text-xs font-medium text-muted-foreground">Processing...</span>
                        </>
                    ) : (
                        <>
                            <Upload className={cn('w-5 h-5', value ? 'text-white' : 'text-gold-100')} />
                            <span className={cn('text-xs text-center px-2', value ? 'text-white' : 'text-muted-foreground')}>
                                {placeholder}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Clear button */}
            {value && !uploading && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onChange(''); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}
