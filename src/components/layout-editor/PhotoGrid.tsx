'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Photo, A4_WIDTH_MM, A4_HEIGHT_MM, LayoutSettings } from '@/types';
import { PhotoCell } from './PhotoCell';

interface PhotoGridProps {
    photos: Photo[];
    settings: LayoutSettings;
    onRemove: (id: string) => void;
    onEdit: (photo: Photo) => void;
}

export function PhotoGrid({ photos, settings, onRemove, onEdit }: PhotoGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const { offsetWidth, offsetHeight } = containerRef.current;
                const padding = 40;
                const availableWidth = offsetWidth - padding;
                const availableHeight = offsetHeight - padding;

                if (availableWidth <= 0 || availableHeight <= 0) return;

                const MM_TO_PX = 3.7795;
                const a4WidthPx = A4_WIDTH_MM * MM_TO_PX;
                const a4HeightPx = A4_HEIGHT_MM * MM_TO_PX;

                const scaleX = availableWidth / a4WidthPx;
                const scaleY = availableHeight / a4HeightPx;

                setScale(Math.min(scaleX, scaleY, 1));
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    const cols = Math.floor((A4_WIDTH_MM + settings.gap) / (settings.photoWidth + settings.gap));
    const rows = Math.floor((A4_HEIGHT_MM + settings.gap) / (settings.photoHeight + settings.gap));

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden relative min-h-[500px]"
        >
            <div
                id="a4-paper"
                className="bg-white shadow-2xl relative transition-transform origin-center"
                style={{
                    width: `${A4_WIDTH_MM}mm`,
                    height: `${A4_HEIGHT_MM}mm`,
                    minWidth: `${A4_WIDTH_MM}mm`,
                    minHeight: `${A4_HEIGHT_MM}mm`,
                    transform: `scale(${scale})`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${cols}, ${settings.photoWidth}mm)`,
                        gridTemplateRows: `repeat(${rows}, ${settings.photoHeight}mm)`,
                        gap: `${settings.gap}mm`,
                    }}
                >
                    {photos.map((photo, index) => (
                        index < cols * rows && (
                            <div key={`${photo.id}-${index}`} style={{ width: `${settings.photoWidth}mm`, height: `${settings.photoHeight}mm` }}>
                                <PhotoCell
                                    photo={photo}
                                    index={index}
                                    onRemove={onRemove}
                                    onEdit={onEdit}
                                />
                            </div>
                        )
                    ))}

                    {photos.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-muted-foreground/20 text-4xl font-light tracking-widest uppercase select-none">
                                A4 空画布
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
