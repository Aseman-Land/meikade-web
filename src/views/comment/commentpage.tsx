import * as React from 'react';
import { useTranslation } from 'react-i18next';

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import { alpha, Box, ButtonBase, CircularProgress, Container, IconButton, InputAdornment, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import AvatarPoemCard from '../../components/avatarpoemcard';
import DatePoemCard from '../../components/datepoemcard';
import MeikadeAppBar from '../../components/meikadeappbar';
import SimpleContentCard from '../../components/simplecontentcard';
import { showSignInDialog } from '../../layouts/mainframe';
import { MkFullContent } from '../../models/content';
import { MkFullContentComment } from '../../models/contentcomment';
import { MkContentServices } from '../../services/content';
import * as UserGlobal from "../../services/user-global";
import { theme } from '../../utils/theme';


const CommentPage = () => {
    const { t } = useTranslation();
    const params = useParams();
    const content_id: number = parseInt(params.content_id!);

    const loadingRef = React.useRef<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [text, setText] = React.useState<string>('');
    const [commentMenuAnchor, setCommentMenuAnchor] = React.useState<null | HTMLElement>(null);
    const [selectedCommentId, setSelectedCommentId] = React.useState<number | null>(null);

    const isCommentMenuOpen = Boolean(commentMenuAnchor);
    const [content, setContent] = React.useState<MkFullContent>();
    const [comments, setComments] = React.useState<Array<MkFullContentComment>>();

    const reload = async () => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setIsLoading(true);
        try {
            const offset: number = 0;
            const limit: number = 50;

            const result = await MkContentServices.getContent(content_id);
            if (result.status && result.result)
                setContent(result.result);

            const list = await MkContentServices.getContentComments(content_id, { offset, limit });
            if (list.status)
                setComments(list.result);
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    };

    const send = async () => {
        if (!UserGlobal.user) { showSignInDialog(); return; }
        const value = text.trim();
        if (!value) return;
        setIsLoading(true);
        try {
            const result = await MkContentServices.postComment(content_id, { comment: value, parent_id: null });
            if (result.status) { setText(''); await reload(); }
        } catch { }
        setIsLoading(false);
    };

    const handleCommentMenuOpen = (event: React.MouseEvent<HTMLElement>, commentId: number) => {
        event.preventDefault();
        setCommentMenuAnchor(event.currentTarget);
        setSelectedCommentId(commentId);
    };

    const handleCommentMenuClose = () => {
        setCommentMenuAnchor(null);
        setSelectedCommentId(null);
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm("آیا از حذف این نظر مطمئن هستید؟")) return;
        try {
            const result = await MkContentServices.deleteComment(content_id, commentId);
            if (result.status) {
                setComments((prev) => prev?.filter((c) => c.id !== commentId));
                setContent((prev) => prev ? { ...prev, comments: Math.max(0, (prev.comments ?? 0) - 1) } : prev);
            }
        } catch (error) { console.error(error); }
    };

    React.useEffect(() => { reload() }, [content_id]);

    return (
        <Container maxWidth="sm" sx={{ position: 'relative' }}>
            <MeikadeAppBar enableBackButton />

            <Box sx={{ marginTop: '75px', paddingBottom: '120px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {isLoading && !comments && <CircularProgress sx={{ alignSelf: 'center', mt: 5 }} />}

                {content && <SimpleContentCard contentItem={content} onReloadRequest={reload} />}

                <Box sx={{ position: 'relative', mt: 1.5, pl: '28px' }}>

                    {comments && comments.length > 1 && (
                        <Box sx={{
                            position: 'absolute',
                            left: '6px',
                            top: '8px',
                            bottom: '20px',
                            width: '2px',
                            bgcolor: alpha(theme.palette.text.primary, 0.12),
                            zIndex: 0
                        }} />
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {comments?.map((comment) => (
                            <Box key={comment.id} sx={{ position: 'relative', display: 'flex', alignItems: 'flex-start' }}>

                                <Box sx={{
                                    position: 'absolute',
                                    left: '-28px',
                                    top: '0px',
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.background.default,
                                    border: `3px solid ${theme.palette.primary.main}`,
                                    zIndex: 2
                                }} />

                                <Box sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: '12px 16px',
                                    bgcolor: theme.palette.background.paper,
                                    width: '100%',
                                    borderRadius: '0px 18px 18px 18px',
                                    boxShadow: 'none',
                                    border: 'none',
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <AvatarPoemCard avatar={UserGlobal.user?.avatar ?? null} size={32} userId={comment.user?.username} />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                                                    {(comment.user?.firstname + (comment.user?.lastname ? ' ' + comment.user.lastname : '')).trim()}
                                                </Typography>
                                                {comment.user?.verified_level != undefined && comment.user?.verified_level > 0 && <VerifiedIcon sx={{ color: theme.palette.primary.main, fontSize: 14 }} />}
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <DatePoemCard createdAt={comment.created_at} />
                                            {UserGlobal.user?.id === comment.user?.id && (
                                                <IconButton onClick={(e) => handleCommentMenuOpen(e, comment.id)} size="small" sx={{ p: 0.5 }}>
                                                    <MoreHorizIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Box>

                                    <Typography sx={{ fontSize: '14px', lineHeight: '24px', color: 'text.primary', textAlign: 'left', mt: 0.5 }}>
                                        {comment.comment}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    {comments?.length === 0 && !isLoading && <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>{t('comments.no_comment')}</Typography>}
                </Box>
            </Box>

            <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', bgcolor: theme.palette.background.default, py: 1.5, zIndex: 1000, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <Box sx={{ width: '100%', maxWidth: '600px', px: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AvatarPoemCard avatar={UserGlobal.user?.avatar ?? null} size={38} />
                    <TextField
                        fullWidth
                        size='small'
                        placeholder={t('comments.placeholder')!}
                        value={text}
                        onChange={(v) => setText(v.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && send()}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '0px 20px 20px 20px',
                                bgcolor: alpha(theme.palette.text.primary, 0.03)
                            }
                        }}
                        slotProps={{
                            input: {
                                endAdornment: text.trim().length > 0 && (
                                    <InputAdornment position="end">
                                        <ButtonBase onClick={send} sx={{ width: '36px', height: '26px', bgcolor: theme.palette.primary.main, borderRadius: '20px', color: 'white' }}>
                                            <NorthOutlinedIcon fontSize="small" />
                                        </ButtonBase>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Box>
            </Box>

            <Menu
                anchorEl={commentMenuAnchor}
                open={isCommentMenuOpen}
                onClose={handleCommentMenuClose}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1,
                            borderRadius: '12px',
                            minWidth: '150px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            '&::before': {
                                content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                            },
                        },
                    },
                }}
            >
                <MenuItem onClick={() => { if (selectedCommentId !== null) handleDeleteComment(selectedCommentId); handleCommentMenuClose(); }} sx={{ color: 'error.main', py: 1.5 }}>
                    <DeleteOutlinedIcon fontSize="small" sx={{ ml: 1.5 }} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>حذف نظر</Typography>
                </MenuItem>
            </Menu>
        </Container>
    );
};

export default CommentPage;
