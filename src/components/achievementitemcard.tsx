import { Check, LockOutlined } from "@mui/icons-material";
import { Box, ButtonBase, ButtonBaseProps, Typography } from "@mui/material";
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MkAchievement } from "../models/achievement";
import { storageBaseUrl } from "../utils/axios";
import { darkMode, theme } from "../utils/theme";
import DatePoemCard from "./datepoemcard";

export type AchievementItem = {
    achievement: MkAchievement,
    count: number,
    created_at?: Date,
};

export type AchievementItemCardProps = {
    achievement: AchievementItem,
} & ButtonBaseProps;

const AchievementItemCard = (props: AchievementItemCardProps) => {
    const { achievement: itemData, sx, ...restProps } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLButtonElement>(null);

    const hasImage = itemData.count > 0 && !!itemData.achievement.image;
    const imageUrl = hasImage ? `${storageBaseUrl}${itemData.achievement.image}` : '';

    useEffect(() => {
        if (!hasImage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (cardRef.current) observer.unobserve(cardRef.current);
                }
            },
            { rootMargin: '100px' }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [hasImage]);

    return (
        <ButtonBase
            ref={cardRef}
            {...restProps}
            sx={{
                display: 'flex',
                width: '100%',
                maxWidth: '100%',
                height: '80px',
                justifyContent: 'space-between',
                flexDirection: 'row',
                textAlign: 'center',
                alignItems: 'center',
                backgroundColor: theme.palette.background.paper,
                backgroundImage: isVisible && hasImage ? `url(${imageUrl})` : 'none',
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: '18px',
                boxSizing: 'border-box',
                cursor: 'pointer',
                color: theme.palette.text.primary,
                padding: '0px 10px 0px 16px',
                position: 'relative',
                overflow: 'hidden',
                border: `${darkMode ? 1 : 2}px solid ${props.achievement.achievement.color}`,
                textShadow: `
                    0 0 4px rgba(0, 0, 0, 0.9),
                    0 2px 8px rgba(0, 0, 0, 0.8),
                    0 4px 16px rgba(0, 0, 0, 0.6)
                    `,
                ...sx,
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    left: '0px',
                    top: '0px',
                    backgroundColor: "#000",
                    opacity: itemData.count > 0 ? 0.3 : 0.8,
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'start',
                    zIndex: 2,
                    gap: '0px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '4px',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: '14px', sm: '15px' },
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            alignItems: 'center',
                            color: '#fff',
                            whiteSpace: "pre-line",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {itemData.achievement.title}
                    </Typography>
                    {itemData.count > 1 && (
                        <Typography
                            sx={{
                                fontSize: '12px',
                                fontWeight: 700,
                                background: '#fff',
                                color: '#333',
                                padding: '1px 4px',
                                borderRadius: '6px',
                                marginBottom: '4px',
                                direction: 'rtl',
                            }}
                        >
                            {'+' + itemData.count.toString()}
                        </Typography>
                    )}
                </Box>
                <Typography
                    sx={{
                        fontSize: '10px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        alignItems: 'center',
                        color: '#fff',
                        whiteSpace: "pre-line",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {itemData.achievement.summery}
                </Typography>
            </Box>
            {itemData.count === 0 && <LockOutlined sx={{ zIndex: 2, color: props.achievement.achievement.color, fontSize: '20px' }} />}
            {itemData.count > 0 &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '15px',
                    }}
                >
                    <Check sx={{ zIndex: 2, color: props.achievement.achievement.color, fontSize: '26px' }} />
                    {itemData.created_at &&
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'left',
                                gap: '2px',
                                color: '#fff',
                            }}
                        >
                            <DatePoemCard createdAt={itemData.created_at} sx={{ opacity: 1 }} />
                        </Box>
                    }
                </Box>
            }
        </ButtonBase>
    );
};

export default AchievementItemCard;