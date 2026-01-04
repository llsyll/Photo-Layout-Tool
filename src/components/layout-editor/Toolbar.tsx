'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';

interface ToolbarProps {
    onClear: () => void;
    onDownload: () => void;
    hasPhotos: boolean;
}

export function Toolbar({ onClear, onDownload, hasPhotos }: ToolbarProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onClear}
                    disabled={!hasPhotos}
                    className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    清空所有
                </Button>
            </div>

            <Button
                onClick={onDownload}
                disabled={!hasPhotos}
                className="w-full gap-2"
                variant="default"
            >
                <Download className="w-4 h-4" />
                下载排版 (A4)
            </Button>
        </div>
    );
}
