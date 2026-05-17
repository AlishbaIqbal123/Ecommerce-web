'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    storagePath: string | (() => string);   // string or factory called at upload time
    shape?: 'square' | 'circle';
    placeholder?: string;
    className?: string;
}

export function ImageUpload({
    value,
    onChange,
    storagePath,
    shape = 'square',
    placeholder = 'Click or drag to upload',
    className,
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        setUploading(true);
        setProgress(0);
        try {
            const { ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage');
            const { storage } = await import('@/lib/firebase/config');
            // Resolve path at upload time so each upload gets a unique path
            const path = typeof storagePath === 'function' ? storagePath() : storagePath;
            const imageRef = ref(storage, path);
            const task = uploadBytesResumable(imageRef, file);
            await new Promise<void>((resolve, reject) => {
                task.on(
                    'state_changed',
                    (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
                    reject,
                    async () => {
                        const url = await getDownloadURL(task.snapshot.ref);
                        onChange(url);
                        resolve();
                    }
                );
            });
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
            setProgress(0);
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
                            <span className="text-xs font-medium text-white">{progress}%</span>
                            <div className="w-3/4 h-1 bg-white/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gold-100 transition-all duration-200"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
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
