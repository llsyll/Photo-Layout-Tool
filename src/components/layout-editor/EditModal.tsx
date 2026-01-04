'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Photo } from '@/types';
import { getCroppedImg } from '@/lib/cropImage';

interface EditModalProps {
    photo: Photo | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (photoId: string, newUrl: string, crop: { x: number; y: number }, zoom: number) => void;
}

export function EditModal({ photo, isOpen, onClose, onSave }: EditModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    // 1 inch ratio default, but this should ideally match current settings aspect ratio?
    // Let's assume standard 5:7 for now or we might need to pass aspect in props if we want strict enforcement.
    // Given user just asked for localization, let's keep aspect hardcoded or passed. 
    // Let's stick to default behavior but translate UI.
    const ASPECT_RATIO = 25 / 35;

    useEffect(() => {
        if (photo) {
            setCrop(photo.crop || { x: 0, y: 0 });
            setZoom(photo.zoom || 1);
        }
    }, [photo]);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!photo || !croppedAreaPixels) return;
        try {
            const croppedImage = await getCroppedImg(photo.originalUrl, croppedAreaPixels);
            if (croppedImage) {
                onSave(photo.id, croppedImage, crop, zoom);
            }
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    if (!photo) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>编辑照片</DialogTitle>
                </DialogHeader>

                <div className="relative w-full h-96 bg-black rounded-md overflow-hidden">
                    <Cropper
                        image={photo.originalUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={ASPECT_RATIO}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>

                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">缩放</span>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(vals) => setZoom(vals[0])}
                            className="flex-1"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>取消</Button>
                    <Button onClick={handleSave}>保存修改</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
