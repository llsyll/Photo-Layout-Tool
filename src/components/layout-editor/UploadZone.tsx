'use client';

import React from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface UploadZoneProps {
    onUpload?: (files: File[]) => void; // Optional now as parent handles it, but we might pass click handler
    onClick?: () => void;
    className?: string;
}

export function UploadZone({ onClick, className }: UploadZoneProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:bg-muted/50 flex flex-col items-center justify-center border-muted-foreground/25',
                className
            )}
        >
            <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-background rounded-full shadow-sm ring-1 ring-muted">
                    <UploadCloud className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium leading-tight">
                        全屏皆可拖拽
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                        或点击此处上传
                    </p>
                </div>
            </div>
        </div>
    );
}
