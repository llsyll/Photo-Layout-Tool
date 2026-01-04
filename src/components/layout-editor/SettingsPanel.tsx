'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LayoutSettings } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SettingsPanelProps {
    settings: LayoutSettings;
    onSettingsChange: (settings: LayoutSettings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {

    const handleChange = (key: 'photoWidth' | 'photoHeight', value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        // Always maintain current Aspect Ratio
        // Use the *current* settings to determine the ratio before the change
        const currentRatio = settings.photoWidth / settings.photoHeight;
        const safeRatio = currentRatio || (25 / 35);

        if (key === 'photoWidth') {
            // Width changed -> Update Height
            // Height = Width / Ratio
            const newHeight = parseFloat((numValue / safeRatio).toFixed(1));
            onSettingsChange({
                ...settings,
                photoWidth: numValue,
                photoHeight: newHeight
            });
        } else {
            // Height changed -> Update Width
            // Width = Height * Ratio
            const newWidth = parseFloat((numValue * safeRatio).toFixed(1));
            onSettingsChange({
                ...settings,
                photoHeight: numValue,
                photoWidth: newWidth
            });
        }
    };

    const handleGapChange = (value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            onSettingsChange({ ...settings, gap: numValue });
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">尺寸设置 (毫米/mm)</CardTitle>
                    <span className="text-xs text-muted-foreground">(已锁定比例)</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                    <div className="space-y-1.5 flex-1">
                        <Label htmlFor="width" className="text-xs">宽度</Label>
                        <Input
                            id="width"
                            type="number"
                            value={settings.photoWidth}
                            onChange={(e) => handleChange('photoWidth', e.target.value)}
                            step={1}
                        />
                    </div>

                    <div className="space-y-1.5 flex-1">
                        <Label htmlFor="height" className="text-xs">高度</Label>
                        <Input
                            id="height"
                            type="number"
                            value={settings.photoHeight}
                            onChange={(e) => handleChange('photoHeight', e.target.value)}
                            step={1}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="gap" className="text-xs">间距</Label>
                    <Input
                        id="gap"
                        type="number"
                        value={settings.gap}
                        onChange={(e) => handleGapChange(e.target.value)}
                        step={0.5}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
