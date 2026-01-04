'use client';

import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDropzone } from 'react-dropzone';
import {
    Photo,
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    LayoutSettings,
    DEFAULT_PHOTO_WIDTH_MM,
    DEFAULT_PHOTO_HEIGHT_MM,
    DEFAULT_GAP_MM
} from '@/types';
import { UploadZone } from './UploadZone';
import { PhotoGrid } from './PhotoGrid';
import { Toolbar } from './Toolbar';
import { EditModal } from './EditModal';
import { SettingsPanel } from './SettingsPanel';
import { cn } from '@/lib/utils';

export function LayoutEditor() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [settings, setSettings] = useState<LayoutSettings>({
        photoWidth: DEFAULT_PHOTO_WIDTH_MM,
        photoHeight: DEFAULT_PHOTO_HEIGHT_MM,
        gap: DEFAULT_GAP_MM
    });

    // Handlers
    const handleUpload = useCallback((files: File[]) => {
        const newPhotos = files.map(file => ({
            id: uuidv4(),
            originalUrl: URL.createObjectURL(file),
        }));
        setPhotos(prev => [...prev, ...newPhotos]);
    }, []);

    // Global Dropzone
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop: handleUpload,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
        noClick: true, // Disable click on root, we only use explicit buttons
        noKeyboard: true
    });

    const calculateGridCapacity = () => {
        const cols = Math.floor((A4_WIDTH_MM + settings.gap) / (settings.photoWidth + settings.gap));
        const rows = Math.floor((A4_HEIGHT_MM + settings.gap) / (settings.photoHeight + settings.gap));
        return cols * rows;
    };

    const handleClear = () => {
        if (confirm('确认清空所有照片吗?')) {
            setPhotos([]);
        }
    };

    const handleRemove = (id: string) => {
        setPhotos(prev => prev.filter(p => p.id !== id));
    };

    const handleEdit = (photo: Photo) => {
        setEditingPhoto(photo);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (photoId: string, newUrl: string, crop: { x: number; y: number }, zoom: number) => {
        setPhotos(prev => prev.map(p => {
            if (p.id === photoId) {
                return {
                    ...p,
                    croppedUrl: newUrl,
                    crop,
                    zoom
                };
            }
            return p;
        }));
    };

    const handleDownload = async () => {
        // Generate High-Res Canvas
        const DPI = 300;
        const MM_TO_PX = DPI / 25.4;

        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(A4_WIDTH_MM * MM_TO_PX);
        canvas.height = Math.ceil(A4_HEIGHT_MM * MM_TO_PX);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Background White
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cols = Math.floor((A4_WIDTH_MM + settings.gap) / (settings.photoWidth + settings.gap));
        const rows = Math.floor((A4_HEIGHT_MM + settings.gap) / (settings.photoHeight + settings.gap));

        const totalGridWidth = (cols * settings.photoWidth) + ((cols - 1) * settings.gap);
        const totalGridHeight = (rows * settings.photoHeight) + ((rows - 1) * settings.gap);

        const startXMM = (A4_WIDTH_MM - totalGridWidth) / 2;
        const startYMM = (A4_HEIGHT_MM - totalGridHeight) / 2;

        const loadImg = (url: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });

        const renderLimit = Math.min(photos.length, cols * rows);

        try {
            for (let i = 0; i < renderLimit; i++) {
                const col = i % cols;
                const row = Math.floor(i / cols);

                const xMM = startXMM + (col * (settings.photoWidth + settings.gap));
                const yMM = startYMM + (row * (settings.photoHeight + settings.gap));

                const photo = photos[i];
                const img = await loadImg(photo.croppedUrl || photo.originalUrl);

                ctx.drawImage(
                    img,
                    xMM * MM_TO_PX,
                    yMM * MM_TO_PX,
                    settings.photoWidth * MM_TO_PX,
                    settings.photoHeight * MM_TO_PX
                );

                ctx.strokeStyle = '#e5e5e5';
                ctx.lineWidth = 1;
                ctx.strokeRect(
                    xMM * MM_TO_PX,
                    yMM * MM_TO_PX,
                    settings.photoWidth * MM_TO_PX,
                    settings.photoHeight * MM_TO_PX
                );
            }

            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            const link = document.createElement('a');
            link.download = `id-photos-a4-${new Date().getTime()}.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Failed to generate image", err);
            alert("生成图片失败，请重试。");
        }
    };

    return (
        <div {...getRootProps()} className="flex flex-col h-screen overflow-hidden bg-background outline-none">
            <input {...getInputProps()} />

            {/* Drag Overlay */}
            {isDragActive && (
                <div className="absolute inset-0 z-50 bg-primary/20 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="bg-background/90 p-8 rounded-xl shadow-2xl border-2 border-primary border-dashed text-xl font-bold text-primary animate-pulse">
                        释放以添加照片...
                    </div>
                </div>
            )}

            <header className="flex-none border-b p-4 flex items-center justify-between bg-card z-10">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">证件照排版工具</h1>
                    <p className="text-muted-foreground text-xs hidden sm:block">A4 自动排版生成</p>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                <aside className="w-80 flex-none border-r bg-muted/10 overflow-y-auto p-4 space-y-6">
                    <UploadZone onClick={open} className="h-32 p-4" />

                    <SettingsPanel settings={settings} onSettingsChange={setSettings} />

                    <div className="bg-card rounded-lg border shadow-sm p-4">
                        <h3 className="font-semibold mb-3 text-sm">操作</h3>
                        <Toolbar
                            onClear={handleClear}
                            onDownload={handleDownload}
                            hasPhotos={photos.length > 0}
                        />
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                        <p>A4 尺寸: 210 x 297 mm</p>
                        <p>照片尺寸: {settings.photoWidth} x {settings.photoHeight} mm</p>
                        <p>间距: {settings.gap} mm</p>
                        <p>当前容量: {calculateGridCapacity()} 张</p>
                        <p className="font-medium text-primary">已插入: {photos.length} 张</p>
                    </div>
                </aside>

                <main className="flex-1 overflow-hidden relative bg-neutral-100 p-8 flex items-center justify-center">
                    <PhotoGrid
                        photos={photos}
                        settings={settings}
                        onRemove={handleRemove}
                        onEdit={handleEdit}
                    />
                </main>
            </div>

            <EditModal
                photo={editingPhoto}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEdit}
            />
        </div>
    );
}
