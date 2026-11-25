import { Favorite, FavoriteBorder, InsertCommentOutlined, Repeat } from "@mui/icons-material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { alpha, Box, BoxProps, Button, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { showQuoteMenu, showSignInDialog } from "../layouts/mainframe";
import { MkContentServices } from "../services/content";
import * as UserGlobal from "../services/user-global";
import { theme } from "../utils/theme";
import { SimplePoemContent } from "./simplepoemcard";

export type ActionCardProps = {
    contentItem: SimplePoemContent,
    reshareMode?: boolean,
    achievementMode?: boolean,
    onReloadRequest?: () => void,
} & BoxProps;

const ActionCard = (props: ActionCardProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const content = props.contentItem;
    const view = content.views;

    const commentPath = `/content/${content.id}/comments`;
    const isCommentActive = location.pathname === commentPath;

    const handleComment = () => {
        if (isCommentActive) return;
        navigate(commentPath)
    };

    const [liked, setLiked] = React.useState<boolean>(content.me?.rate == 1 ? true : false);
    const [likesCount, setLikesCount] = React.useState<number>(content.rates);
    const loadingRef = React.useRef<boolean>(false);

    const handleLike = async () => {
        if (!UserGlobal.user) {
            showSignInDialog();
            return;
        }
        if (loadingRef.current)
            return;

        loadingRef.current = true;

        const newLiked: boolean = !liked;
        setLiked(newLiked);

        const rate = newLiked ? 1 : 0;
        const result = await MkContentServices.rateContent(content.id, { rate });

        if (result.status == false) {
            setLiked(!newLiked);
        } else if (result.result !== undefined) {
            setLikesCount(result.result);
        }
        loadingRef.current = false;
    };

    const repost = () => {
        if (!UserGlobal.user) {
            showSignInDialog();
            return;
        }

        showQuoteMenu({ content, verse: undefined }, () => {
            if (props.onReloadRequest)
                props.onReloadRequest();
        });
    }

    const iconsColor: string = alpha(theme.palette.text.primary, 0.7);

    const itemStyles = {
        display: 'flex',
        flexDirection: 'row',
        gap: '6px',
        padding: '8px 8px',
        minWidth: 'unset',
        minHeight: 'unset',
        alignItems: 'center',
        height: 'unset',
    };

    return (
        <Box
            {...props}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...props.sx,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 0.5
                }}
            >
                {!props.reshareMode && <>
                    <Button
                        sx={itemStyles}
                        onClick={(e) => {
                            e.preventDefault()
                            handleLike()
                        }}
                    >
                        {liked ? (
                            <Favorite
                                sx={{
                                    fontSize: 20,
                                    color: "#a72d24",
                                    transform: "scaleX(-1)"
                                }}
                            />
                        ) : (
                            <FavoriteBorder
                                sx={{
                                    fontSize: 20,
                                    color: iconsColor,
                                    transform: "scaleX(-1)"
                                }}
                            />
                        )}
                        {likesCount > 0 && (
                            <Typography sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '12px',
                                color: iconsColor,
                            }}
                            >
                                {(likesCount >= 1_000_000
                                    ? `${(likesCount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
                                    : likesCount >= 1_000
                                        ? `${(likesCount / 1_000).toFixed(1).replace(/\.0$/, '')}K`
                                        : likesCount)}
                            </Typography>
                        )}
                    </Button>
                    {content.allow_comment > 0 && <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '5px'
                        }}
                    >
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                handleComment();
                            }}
                            disabled={isCommentActive}
                            sx={{
                                ...itemStyles,
                                opacity: isCommentActive ? 0.5 : 1,
                                pointerEvents: isCommentActive ? "none" : "auto",
                            }}
                        >
                            <InsertCommentOutlined sx={{ fontSize: 20, color: iconsColor }} />
                            {content.comments > 0 && (
                                <Typography sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: iconsColor,
                                    fontSize: '12px'
                                }}
                                >
                                    {content.comments}
                                </Typography>
                            )}
                        </Button>
                    </Box>}
                </>}
                {!props.achievementMode && content.published > 0 && (!content.activity || (content.poem && content.poem.verses.length > 0)) && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                        sx={itemStyles}
                    >
                        <VisibilityOutlinedIcon sx={{ fontSize: 24, color: iconsColor }} />
                        <Typography sx={{ color: iconsColor, fontSize: 12 }}>
                            {(view >= 1_000_000
                                ? `${(view / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
                                : view >= 1_000
                                    ? `${(view / 1_000).toFixed(1).replace(/\.0$/, '')}K`
                                    : view)}
                        </Typography>
                    </Box>
                </Box>}
            </Box>
            {!props.achievementMode && <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '5px'
                }}
            >
                <Button
                    sx={itemStyles}
                    onClick={(e) => {
                        e.preventDefault()
                        repost();
                    }}
                >
                    <Repeat
                        sx={{
                            fontSize: 20,
                            color: iconsColor,
                            transform: "scaleX(-1)"
                        }}
                    />
                </Button>
            </Box>}
        </Box>
    );
}
export default ActionCard;