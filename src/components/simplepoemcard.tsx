import { ChevronLeft, VisibilityOffOutlined } from '@mui/icons-material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { alpha, Box, BoxProps, Button, ButtonBase, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { showContentMenu } from '../layouts/mainframe';
import { MkFullContent, MkFullContentVerses } from '../models/content';
import { MkContentVerses } from '../models/contentverses';
import { globalBorderRadius, globalBorderRadiusValue, theme } from '../utils/theme';
import ActionCard from './actioncard';
import AvatarPoemCard from './avatarpoemcard';
import ContentTitle from './contenttitle';
import DatePoemCard from './datepoemcard';
import UserFullname from './userfullname';

export type SimplePoemContent = MkFullContent;
export type SimplePoemHighlight = MkFullContentVerses | undefined;

type SimplePoemCardProps = {
    contentItem: SimplePoemContent,
    highlight?: SimplePoemHighlight,
    quoteContentVerse?: SimplePoemHighlight,
    contentNote?: string,
    contentVerseNote?: string,
    onReloadRequest: () => void,
};

type SimplePoemCardCoreProps = {
    simple?: boolean,
    reshareMode?: boolean,
} & SimplePoemCardProps & BoxProps;

export const SimplePoemCardCore = (props: SimplePoemCardCoreProps) => {
    const { t } = useTranslation();

    const content = props.contentItem;

    const verseIsHighlight = (verse: MkContentVerses): boolean => {
        return props.highlight != undefined && (props.highlight.id == verse.id || (verse.order - 1 == props.highlight.order && verse.master == 0) || (verse.order + 1 == props.highlight.order && verse.master == 1));
    }

    return <Box
        {...props}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: props.simple ? '6px' : '15px',
            ...props.sx,
        }}
    >
        <Box
            sx={{
                display: 'flex',
                gap: '12px',
                alignItems: 'fl',
            }}
        >
            {content.owner && <AvatarPoemCard avatar={content.owner.avatar} size={props.simple ? 22 : 37} userId={content.owner.username} />}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minWidth: 0,
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: '-2px',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        {content.owner && <ButtonBase component={RouterLink} to={`/user/${content.owner.username}`}>
                            <UserFullname
                                user={content.owner}
                                fontSize={'14px'}
                            />
                        </ButtonBase>}
                    </Box>

                    {!props.simple && <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '30px' }}>
                        {content.published == 0 && <VisibilityOffOutlined sx={{ fontSize: '18px', opacity: 0.8 }} />}
                        {content.owner && content.owner.verified_level < 3 && <DatePoemCard createdAt={content.created_at} />}
                        <Button
                            sx={{
                                minWidth: 'unset',
                                height: '30px',
                                margin: '0px',
                            }}
                            onClick={(e: React.MouseEvent<HTMLElement>) => {
                                e.preventDefault()
                                showContentMenu(content, props.highlight ?? props.quoteContentVerse, e, props.onReloadRequest ?? null);
                            }}
                        >
                            <MoreHorizIcon sx={{ fontSize: 20, color: theme.palette.text.secondary, marginRight: 'auto' }} />
                        </Button>
                    </Box>}
                </Box>
                {!props.simple && <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: '2px',
                        justifyContent: 'start',
                    }}
                >
                    {content.book && <>
                        <ButtonBase component={RouterLink} to={`/book/${content.book_id}`}>
                            <Typography sx={{
                                fontSize: '12px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {(content.book.title)}
                            </Typography>
                        </ButtonBase>
                        <ChevronLeft sx={{ fontSize: '12px' }} />
                    </>}
                    <ContentTitle
                        contentItem={content}
                        user={content.owner}
                        fontSize={'12px'}
                    />
                </Box>}
            </Box>
        </Box>
        {content.poem && content.poem.verses.length > 0 && <Box>
            {content.poem.verses.map((verse: MkContentVerses, index: number) => {
                const position = verse.position == -5 ? 4 : verse.position < 0 ? -2 - verse.position : verse.position;
                const highlighted: boolean = verseIsHighlight(verse);
                const next_highlighted: boolean = (content.poem && index + 1 < content.poem.verses.length ? verseIsHighlight(content.poem.verses[index + 1]) : false);

                return <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '14px',
                            wordBreak: 'break-word',
                            lineHeight: '28px',
                            direction: verse.position < -1 ? 'rtl' : 'ltr',
                            textAlign: position === 4 || verse.position == -1 ? 'justify' : position === 0 ? 'start' : position === 1 ? 'end' : 'center',
                            textDecoration: highlighted ? 'underline' : 'none',
                            color: highlighted ? theme.palette.primary.main : 'none',
                            margin: position === 4 || verse.position == -1 ? '10px 0px' : '0px',
                        }}
                    >
                        {verse.text}
                    </Typography>

                    {highlighted && !next_highlighted && props.contentVerseNote && <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            borderLeft: '2px solid ' + theme.palette.primary.main,
                            padding: '4px 10px',
                            marginBottom: '10px',
                            marginTop: '-10px',
                            height: 'unset',
                            color: 'unset',
                            justifyContent: 'start',
                            borderRadius: 'unset',
                            textTransform: 'unset',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="h6" >{t('poem.note')}</Typography>
                            <Typography sx={{ fontSize: '12px', whiteSpace: 'pre-line', textAlign: 'left' }}>
                                {props.contentVerseNote}
                            </Typography>
                        </Box>
                    </Box>}
                </Box>
            })}
        </Box>}
        {props.contentNote &&
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '14px 20px',
                    background: alpha(theme.palette.text.primary, 0.05),
                    borderRadius: `${globalBorderRadiusValue / 2}px`,
                }}
            >
                <Typography variant="h6" >{t('poem.note')}</Typography>
                <Typography sx={{ fontSize: '12px', whiteSpace: 'pre-line', textAlign: 'left' }}>{props.contentNote}</Typography>
            </Box>
        }
        {props.children}
    </Box>
}

const SimplePoemCard = (props: SimplePoemCardProps) => {
    const { t } = useTranslation();
    const content = props.contentItem;
    const quoteContentVerse = props.contentItem.activity?.target_content_verse;
    const quoteContent = quoteContentVerse ? quoteContentVerse.content : props.contentItem.activity?.target_content;
    const reshareMode = quoteContent && (!content.poem || content.poem.verses.length == 0);

    return <ButtonBase
        sx={{
            display: 'flex',
            width: '100%',
            maxWidth: '100%',
            flexDirection: 'column',
            padding: '15px 15px 8px 15px',
            gap: '15px',
            backgroundColor: theme.palette.background.paper,
            borderRadius: globalBorderRadius,
            boxSizing: 'border-box',
            textAlign: 'unset',
            alignItems: 'unset',
        }}
        disableRipple
        disableTouchRipple
        component={RouterLink}
        to={reshareMode ? `/content/${quoteContent.id}` : `/content/${content.id}`}
    >
        <SimplePoemCardCore
            {...props}
            quoteContentVerse={quoteContentVerse ?? undefined}
            reshareMode={reshareMode ?? undefined}
        >
            {quoteContent && <ButtonBase
                disableRipple
                disableTouchRipple
                component={RouterLink}
                to={quoteContent.activity?.target_user_achievement?.achievement ? `/user/${quoteContent.owner?.username}` : `/content/${quoteContent.id}`}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'unset',
                    alignItems: 'unset',
                    padding: '15px',
                    border: '1px solid ' + alpha(theme.palette.text.primary, 0.1),
                    borderRadius: globalBorderRadius,
                }}
            >
                <SimplePoemCardCore
                    simple
                    contentItem={quoteContent}
                    highlight={quoteContentVerse ?? undefined}
                    onReloadRequest={props.onReloadRequest}
                />
            </ButtonBase>}
        </SimplePoemCardCore>
        <ActionCard
            contentItem={content}
            sx={{ width: '100%' }}
            reshareMode={reshareMode ?? undefined}
            onReloadRequest={props.onReloadRequest}
        />
    </ButtonBase>
}

export default SimplePoemCard;
