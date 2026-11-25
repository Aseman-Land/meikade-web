import { Avatar, AvatarProps, Box, ButtonBase, lighten } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { storageBaseUrl } from '../utils/axios';
import { theme } from '../utils/theme';

export type AvatarPoemCardProps = {
    userId?: number | string;
    avatar: string | null;
    size?: number;
    outerSize?: number | string;
    innerSize?: number | string;
    hideFrame?: boolean;
    onAvatarClick?: () => void;
} & AvatarProps;

const AvatarPoemCard = (props: AvatarPoemCardProps) => {
    const { avatar, userId, hideFrame, onAvatarClick, size = 30 } = props;
    const innerSize = props.innerSize ?? size + 4;
    const outerSize = props.outerSize ?? size + 8;

    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (containerRef.current) {
                        observer.unobserve(containerRef.current);
                    }
                }
            },
            {
                rootMargin: '100px',
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const imageUrl = avatar && avatar.length > 0
        ? (avatar.indexOf('://') > 0 ? avatar : storageBaseUrl + avatar)
        : '';

    const object = (
        <Avatar
            src={isVisible ? imageUrl : undefined}
            sx={{
                width: size,
                height: size,
                borderRadius: '50%'
            }}
        />
    );

    const core = (
        <Box ref={containerRef} sx={{ display: 'inline-block' }}>
            {!hideFrame ? (
                <Box
                    sx={{
                        display: 'flex',
                        width: outerSize,
                        height: outerSize,
                        minWidth: outerSize,
                        minHeight: outerSize,
                        background: `linear-gradient(135deg, #000000, ${theme.palette.primary.main}, ${lighten(theme.palette.primary.main, 0.5)})`,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50px',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            width: innerSize,
                            height: innerSize,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: '50px',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {object}
                    </Box>
                </Box>
            ) : (
                object
            )}
        </Box>
    );

    if (onAvatarClick) {
        return <ButtonBase onClick={onAvatarClick}>{core}</ButtonBase>;
    } else if (userId) {
        return <Link to={`/user/${userId}`}>{core}</Link>;
    } else {
        return core;
    }
};

export default AvatarPoemCard;