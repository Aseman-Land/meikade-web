import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import { Box, CircularProgress, SxProps, Theme } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface SmartImageProps {
    src: string;
    alt?: string;
    sx?: SxProps<Theme>;
    loaderSize?: number;
    objectFit?: 'contain' | 'cover' | 'scale-down';
}

export const SmartImage: React.FC<SmartImageProps> = ({
    src,
    alt = 'image',
    sx,
    loaderSize = 36,
    objectFit = 'contain',
}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        setError(false);
    }, [src]);

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                minHeight: loading ? 120 : 'auto',
                ...sx,
            }}
        >
            {loading && !error && (
                <CircularProgress
                    size={loaderSize}
                    sx={{
                        position: 'absolute',
                        zIndex: 1,
                    }}
                />
            )}

            {error && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'text.secondary',
                        p: 2,
                    }}
                >
                    <BrokenImageOutlinedIcon fontSize="large" />
                </Box>
            )}

            {!error && (
                <Box
                    component="img"
                    src={src}
                    alt={alt}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setLoading(false);
                        setError(true);
                    }}
                    sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: objectFit,
                        opacity: loading ? 0 : 1,
                        transition: 'opacity 0.3s ease-in-out',
                        pointerEvents: 'auto',
                        userSelect: 'none',
                        WebkitTouchCallout: 'default',
                    }}
                />
            )}
        </Box>
    );
};