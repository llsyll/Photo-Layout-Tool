'use client';

import React from 'react';
import Image from 'next/image';
import { Photo } from '@/types';
import { X, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoCellProps {
    photo: Photo;
    index: number;
    onRemove: (id: string) => void;
    onEdit: (photo: Photo) => void;
}

export function PhotoCell({ photo, onRemove, onEdit }: PhotoCellProps) {
    // 1 inch photo ratio is 25:35 = 5:7 ≈ 0.714
    return (
        <div className="relative group aspect-[5/7] bg-gray-100 border border-gray-300 overflow-hidden">
            <Image
                src={photo.croppedUrl || photo.originalUrl}
                alt="ID Photo"
                fill
                className="object-cover"
            />

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                    onClick={() => onEdit(photo)}
                    className="p-1.5 bg-white text-black rounded-full hover:bg-white/90 transition-colors"
                    title="Edit"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onRemove(photo.id)}
                    className="p-1.5 bg-white text-red-500 rounded-full hover:bg-white/90 transition-colors"
                    title="Remove"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
