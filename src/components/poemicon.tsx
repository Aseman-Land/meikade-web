import React, { useEffect, useRef } from 'react';

export type PoemIconAlignmentType = 'ltr-poem' | 'rtl-poem' | 'ltr' | 'rtl';

interface PoemIconProps {
    type: PoemIconAlignmentType;
    size?: number;
    color?: string;
    lineWidth?: number;
}

const PoemIcon: React.FC<PoemIconProps> = ({
    type,
    size = 100,
    color = '#000000',
    lineWidth = 6,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, size, size);

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';

        const padding = size * 0.2;
        const availableWidth = size - padding * 2;
        const startY = size * 0.25;
        const rowGap = size * 0.16;

        const longWidth = availableWidth;
        const shortWidth = availableWidth * 0.65;

        let lines: { width: number; align: 'left' | 'center' | 'right' }[] = [];

        switch (type) {
            case 'ltr-poem':
                lines = [
                    { width: shortWidth, align: 'left' },
                    { width: shortWidth, align: 'right' },
                    { width: shortWidth, align: 'left' },
                    { width: shortWidth, align: 'right' },
                ];
                break;
            case 'rtl-poem':
                lines = [
                    { width: shortWidth, align: 'right' },
                    { width: shortWidth, align: 'left' },
                    { width: shortWidth, align: 'right' },
                    { width: shortWidth, align: 'left' },
                ];
                break;
            case 'ltr':
                lines = [
                    { width: longWidth, align: 'left' },
                    { width: shortWidth, align: 'left' },
                    { width: longWidth, align: 'left' },
                    { width: shortWidth, align: 'left' },
                ];
                break;
            case 'rtl':
                lines = [
                    { width: longWidth, align: 'right' },
                    { width: shortWidth, align: 'right' },
                    { width: longWidth, align: 'right' },
                    { width: shortWidth, align: 'right' },
                ];
                break;
        }

        lines.forEach((line, index) => {
            const y = startY + index * rowGap;
            let xStart = padding;

            if (line.align === 'right') {
                xStart = padding + (longWidth - line.width);
            } else if (line.align === 'center') {
                xStart = padding + (longWidth - line.width) / 2;
            }

            ctx.beginPath();
            ctx.moveTo(xStart, y);
            ctx.lineTo(xStart + line.width, y);
            ctx.stroke();
        });
    }, [type, size, color, lineWidth]);

    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            style={{ display: 'inline-block', verticalAlign: 'middle' }}
        />
    );
};

export default PoemIcon;