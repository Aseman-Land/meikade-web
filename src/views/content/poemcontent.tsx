import { BookmarksOutlined, ChevronLeft, ChevronRight, Close, ContentCopy, Favorite, FavoriteBorder, NoteAdd, Repeat, Share, TipsAndUpdatesOutlined } from '@mui/icons-material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { alpha, Box, Button, ButtonBase, CircularProgress, Container, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ActionCard from '../../components/actioncard';
import AvatarPoemCard from '../../components/avatarpoemcard';
import ContentTitle from '../../components/contenttitle';
import MeikadeAppBar from '../../components/meikadeappbar';
import SimpleContentCard from '../../components/simplecontentcard';
import UserFullname from '../../components/userfullname';
import { globalShowInfoMessage, showQuoteMenu, showSignInDialog } from '../../layouts/mainframe';
import { MkFullContent } from '../../models/content';
import { MkFullContentNote } from '../../models/contentnote';
import { MkContentVerses } from '../../models/contentverses';
import { MkContentServices } from '../../services/content';
import * as UserGlobal from "../../services/user-global";
import { darkMode, globalBorderRadius, globalBorderRadiusValue, theme } from '../../utils/theme';
import { sleep } from '../../utils/tools';
import { DefaultSignInDialog } from '../user/signin';
import AiAnalizingDialog from './aianalizingdialog';
import SingleVerseItem, { VerseGroup } from './singleverseitem';
import MeikadeDrawer from '../../components/meikadedrawer';
import ShareItem from '../user/shareitem';
import { SimplePoemContent } from '../../components/simplepoemcard';

export interface PoemContentRef {
    reload: () => Promise<void>;
    reloadListsStatuses: () => Promise<void>;
    reloadNotesStatuses: () => Promise<void>;
}

type PoemContentProps = {
    contentObj?: MkFullContent,
    onAddListsRequest?: (verseId: number | undefined) => void,
    onEditNoteRequest?: (verseId: number | undefined) => void,
};

type SelectedVerse = {
    verses: Array<MkContentVerses>,
    id: number,
};

const PoemContent = React.forwardRef<PoemContentRef, PoemContentProps>((props: PoemContentProps, objectRef) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const content = props.contentObj;

    const quoteContentVerse = content ? content.activity?.target_content_verse : undefined;
    const quoteContent = quoteContentVerse ? quoteContentVerse.content : content ? content.activity?.target_content : undefined;

    const coverHeight: number = 180;
    const toolBarHeight: number = 36;
    const actionBarHeight: number = 50;

    const [isCopied, setIsCopied] = React.useState<boolean>(false);

    const [selectedText, setSelectedText] = React.useState<string>('');
    const [note, setNote] = React.useState<MkFullContentNote | null>(null);

    const [shareContent, setShareContent] = React.useState<SimplePoemContent | null>(null);

    const [listedVerseIds, setListedVerseIds] = React.useState<Array<number>>([]);
    const [ratedVerseIds, setRatedVerseIds] = React.useState<Array<number>>([]);
    const [notedVerseIds, setNotedVerseIds] = React.useState<Map<number, string>>(new Map<number, string>());

    const coverRef = React.useRef<HTMLDivElement | null>(null);
    const [actionBarBottomY, setActionBarBottomY] = React.useState<number>(0);
    const [actionBarVisible, setActionBarVisible] = React.useState<boolean>(true);

    const [hasGanjoorAnalizing, setHasGanjoorAnalizing] = React.useState<boolean>(false);
    const [ganjoorAnalizing, setGanjoorAnalizing] = React.useState<boolean>(localStorage.getItem('ganjoor_analizing_visible') == 'true' ? true : false);
    const [ganjoorAnalizingWarn, setGanjoorAnalizingWarn] = React.useState<boolean>(localStorage.getItem('ganjoor_analizing_warn_closed') == 'true' ? false : true);

    const [aiAnalizing, setAiAnalizing] = React.useState<boolean>(false);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const [selectedVerseId, setSelectedVerseId] = React.useState<SelectedVerse | undefined>(undefined);
    const [anchorElVerse, setAnchorElVerse] = React.useState<null | HTMLElement>(null);
    const menuOpenVerse = Boolean(anchorElVerse);

    const [versesList, setVersesList] = React.useState<Array<MkContentVerses>>([]);
    const [verses, setVerses] = React.useState<Array<VerseGroup>>([]);
    const lastScrollYRef = React.useRef<number>(0);
    const [scrollY, setScrollY] = React.useState<number>(() =>
        typeof window !== "undefined" ? window.scrollY : 0
    );

    const [isLoadingNote, setIsLoadingNote] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isInitializing, setIsInitializing] = React.useState<boolean>(true);
    const loadingRef = React.useRef<boolean>(false);
    const initializedRef = React.useRef<boolean>(false);

    const [hasMore, setHasMore] = React.useState<boolean>(false);

    const limit: number = 100;

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const toggleGanjoorAnalizing = () => {
        const new_state = !ganjoorAnalizing;
        if (new_state) {
            closeGanjoorWarn();
            localStorage.setItem('ganjoor_analizing_visible', 'true');
        } else {
            localStorage.setItem('ganjoor_analizing_visible', 'false');
        }
        setGanjoorAnalizing(new_state);
    }

    const closeGanjoorWarn = () => {
        localStorage.setItem('ganjoor_analizing_warn_closed', 'true');
        setGanjoorAnalizingWarn(false);
    }

    const more = () => {
        load(versesList.length);
    }

    const reload = async () => {
        load(0);
    }

    const load = async (offset: number) => {
        if (loadingRef.current || !content) return;

        loadingRef.current = true;
        setIsLoading(true);
        if (!initializedRef.current)
            setIsInitializing(true);
        try {
            if (offset == 0) {
                setVersesList([]);
                setVerses([]);
            }

            const result = await MkContentServices.getContentVerses(content.id, { offset, limit });
            if (result.status && result.result) {
                const list: Array<VerseGroup> = new Array<VerseGroup>
                var hasGanjoorAnalizing: boolean = false;
                result.result.verses.forEach((verse: MkContentVerses) => {
                    if (verse.ai_analize && verse.ai_analize.ganjoor_analysis) {
                        hasGanjoorAnalizing = true;
                    }
                    if (list.length > 0 && verse.position == 1 || verse.position == 3) {
                        const group = list[list.length - 1];
                        if (group.verses.length > 0) {
                            if (group.verses[group.verses.length - 1].position == 0 && verse.position == 1) {
                                group.verses.push(verse);
                                return;
                            } else if (group.verses[group.verses.length - 1].position == 2 && verse.position == 3) {
                                group.verses.push(verse);
                                return;
                            }
                        }
                    }

                    list.push({
                        verses: [verse]
                    });
                })
                await sleep(500);

                setHasGanjoorAnalizing(hasGanjoorAnalizing);
                setVersesList(offset > 0 ? [...versesList, ...result.result.verses] : result.result.verses);
                setVerses(offset > 0 ? [...verses, ...list] : list);
                setHasMore(result.result.verses.length == limit);
            }

            if (UserGlobal.user) {
                const rates_verses = await MkContentServices.getContentAllVerseRates(content.id);
                if (rates_verses.status && rates_verses.result) {
                    const ids: Array<number> = new Array<number>();
                    rates_verses.result.forEach(l => {
                        if (l.rate > 0)
                            ids.push(l.verse_id);
                    });
                    setRatedVerseIds(ids);
                }
            }
        } catch {
        }

        await sleep(500);
        initializedRef.current = true;

        if (UserGlobal.user) {
            await reloadListsStatuses();
            await reloadNotesStatuses();
        }

        setIsLoading(false);
        setIsInitializing(false);
        loadingRef.current = false;
    }

    const reloadListsStatuses = async () => {
        if (!content) return;
        if (!initializedRef.current) return;

        try {
            const result = await MkContentServices.getPersonalVersesLists(content.id);
            if (result.status && result.result) {
                const ids: Array<number> = new Array<number>();
                result.result.forEach(l => {
                    ids.push(l.verse_id);
                });
                setListedVerseIds(ids);
            }
        } catch {
        }
    }

    const reloadNotesStatuses = async () => {
        if (!content) return;
        if (!initializedRef.current) return;

        setIsLoadingNote(true);
        try {
            const notes = await MkContentServices.getContentNotes(content.id, { offset: null, limit: 200 });
            setNote(notes.result && notes.result.length ? notes.result[0] : null);
        } catch {
        }

        try {
            const notes_verses = await MkContentServices.getContentAllVerseNotes(content.id, { offset: null, limit: 200 });
            if (notes_verses.status && notes_verses.result) {
                const notes: Map<number, string> = new Map<number, string>();
                notes_verses.result.forEach(n => {
                    notes.set(n.verse_id, n.note);
                });
                setNotedVerseIds(notes);
            }
        } catch {
        }

        await sleep(500);
        setIsLoadingNote(false);
    }

    const handleCopy = async (text: string) => {
        if (!content)
            return;

        try {
            await navigator.clipboard.writeText(text);
            globalShowInfoMessage(t('messages.info.copied'));
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleShare = (text: string) => {
        if (!content)
            return;

        const textToCopy: string = content.title + '\n' + (content.owner ? content.owner.firstname + ' ' + (content.owner.lastname ?? '') : '').trim() + (content.book ? '\n' + content.book.title : '') + '\n\n' + text;

        navigator.share({
            title: t('app.title') ?? 'Meikade',
            text: textToCopy,
            url: window.location.href,
        });
    }

    const getText = (): string => {
        var text: string = '';

        versesList.forEach(v => {
            if (text.length > 0)
                text += '\n';
            text += v.text
        });

        return text;
    }

    React.useImperativeHandle(objectRef, () => ({
        reload, reloadListsStatuses, reloadNotesStatuses,
    }));

    const toggleVerseRate = async (verse_id: number) => {
        if (!UserGlobal.user) {
            showSignInDialog();
            return;
        }
        if (!content) return;

        const items = [...ratedVerseIds];
        const idx = items.indexOf(verse_id);
        if (idx < 0) {
            items.push(verse_id);
        } else {
            items.splice(idx, 1);
        }
        setRatedVerseIds(items);

        try {
            const result = await MkContentServices.rateContentVerse(content.id, verse_id, { rate: idx < 0 ? 1 : 0 });
            if (!result.status || !result.result)
                throw false;
        } catch {
            const remove_items = [...items];
            const idx = remove_items.indexOf(verse_id);
            if (idx < 0) {
                remove_items.push(verse_id);
            } else {
                remove_items.splice(idx, 1);
            }
            setRatedVerseIds(remove_items);
        }
    };

    const editNote = (verseId: number | undefined) => {
        if (!UserGlobal.user) {
            showSignInDialog();
            return;
        }
        if (props.onEditNoteRequest)
            props.onEditNoteRequest(verseId);
        handleCloseVerse();
    }

    const addList = (selectedVerseId: number | undefined) => {
        if (!UserGlobal.user) {
            showSignInDialog();
            return;
        }
        if (props.onAddListsRequest)
            props.onAddListsRequest(selectedVerseId);
        handleClose();
    }

    const showAIAnalizer = () => {
        if (!UserGlobal.user) {
            showSignInDialog();
            return;
        }
        setAiAnalizing(true);
    }

    React.useEffect(() => {
        const update = () => {
            if (!coverRef.current)
                return;

            const rect = coverRef.current.getBoundingClientRect();
            setActionBarBottomY(rect.bottom);
        };

        update();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update);

        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update);
        };
    }, []);

    React.useEffect(() => {
        if (inView && hasMore) {
            more();
        }
    }, [inView]);

    React.useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY ?? document.documentElement.scrollTop ?? 0;
            setScrollY(y);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    React.useEffect(() => {
        const y = scrollY;
        if (actionBarVisible) {
            if (y > lastScrollYRef.current) {
                if (y > lastScrollYRef.current + 100 && y > 400) {
                    setActionBarVisible(false);
                    lastScrollYRef.current = y;
                }
            } else {
                lastScrollYRef.current = y;
            }
        } else {
            if (y < lastScrollYRef.current) {
                if (y < lastScrollYRef.current - 100) {
                    setActionBarVisible(true);
                    lastScrollYRef.current = y;
                }
            } else {
                lastScrollYRef.current = y;
            }
        }
    }, [scrollY]);

    React.useEffect(() => {
        reload()
    }, [content]);

    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const openMenuVerse = (event: React.MouseEvent<HTMLButtonElement>, verse: SelectedVerse) => {
        setSelectedVerseId(verse);
        setAnchorElVerse(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseVerse = () => {
        setAnchorElVerse(null);
    };

    if (!content || !content.poem)
        return <Box />

    return <Container maxWidth="sm" style={{ padding: '0px' }}>
        <MeikadeAppBar
            enableBackButton
            enableSearchButton
            onSearchButtonClick={() => {
                if (!content)
                    return;

                navigate(`/content/${content.id}/search`)
            }}
        />
        <Box
            sx={{
                marginTop: '60px',
                paddingBottom: '100px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: coverHeight.toString() + 'px',
                    alignItems: 'center',
                }}
            >
                <Box
                    ref={coverRef}
                    sx={{
                        width: '100%',
                        maxWidth: 'sm',
                        height: Math.max(toolBarHeight, coverHeight - scrollY).toString() + 'px',
                        background: 'url(/assets/images/meikade_cover.jpg)',
                        backgroundColor: theme.palette.primary.light,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: 'fixed',
                        zIndex: coverHeight - scrollY < 100 || scrollY <= 3 ? 100 : -100,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: "#fff",
                            position: 'absolute',
                            opacity: Math.max(0, (coverHeight - scrollY - toolBarHeight) / (coverHeight - toolBarHeight)),
                        }}
                    >
                        {content.owner && <>
                            <AvatarPoemCard avatar={content.owner.avatar!} size={64} innerSize={68} outerSize={74} userId={content.owner.username} />
                            <ButtonBase
                                component={RouterLink}
                                to={`/user/${content.owner.username}`}
                            >
                                <UserFullname
                                    user={content.owner}
                                    fontSize={'16px'}
                                    shadow
                                    sx={{
                                        marginTop: '10px',
                                        margin: '0px 20px',
                                    }}
                                />
                            </ButtonBase>
                        </>}
                        <ContentTitle
                            contentItem={content}
                            user={content.owner}
                            fontSize={'20px'}
                            shadow
                            sx={{
                                margin: '0px 20px',
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%',
                            padding: '0px 10px 0px 20px',
                            color: "#fff",
                            position: 'absolute',
                            gap: '10px',
                            opacity: 1 - Math.max(0, (coverHeight - scrollY - toolBarHeight) / (coverHeight - toolBarHeight)),
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '4px',
                            }}
                        >
                            {content.owner && <ButtonBase
                                component={RouterLink}
                                to={`/user/${content.owner.username}`}
                            >
                                <UserFullname user={content.owner} shadow />
                            </ButtonBase>}
                            {content.book && <>
                                <ChevronLeft />
                                <ButtonBase
                                    component={RouterLink}
                                    to={`/book/${content.book.id}`}
                                >
                                    <Typography sx={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}>
                                        {content.book.title}
                                    </Typography>
                                </ButtonBase>
                            </>}
                            <ChevronLeft />
                            <ContentTitle
                                contentItem={content}
                                user={content.owner}
                                shadow
                            />
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: Math.max(0, (coverHeight - scrollY - toolBarHeight) / (coverHeight - toolBarHeight)) > 0.1 ? 'flex' : 'none',
                            flexDirection: 'row',
                            padding: '20px',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            position: 'absolute',
                            width: 'calc(100% + 20px)',
                            opacity: Math.max(0, (coverHeight - scrollY - toolBarHeight) / (coverHeight - toolBarHeight)),
                        }}
                    >
                        <Box>
                            {content.previous_content_id && <Button
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    color: '#fff',
                                    padding: '0px',
                                    width: '34px',
                                    minWidth: 'unset',
                                    height: Math.max(toolBarHeight, coverHeight - scrollY).toString() + 'px',
                                }}
                                onClick={() => navigate(`/content/${content.previous_content_id}`, { replace: true })}
                            >
                                <ChevronRight />
                            </Button>}
                        </Box>
                        <Box>
                            {content.next_content_id && <Button
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    color: '#fff',
                                    padding: '0px',
                                    width: '34px',
                                    minWidth: 'unset',
                                    height: Math.max(toolBarHeight, coverHeight - scrollY).toString() + 'px',
                                }}
                                onClick={() => navigate(`/content/${content.next_content_id}`, { replace: true })}
                            >
                                <ChevronLeft />
                            </Button>}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {versesList.length > 0 && <>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 'sm',
                            height: actionBarHeight.toString() + 'px',
                            zIndex: 10,
                            position: toolBarHeight < coverHeight - scrollY ? 'absolute' : 'fixed',
                            top: toolBarHeight < coverHeight - scrollY ? 'unset' : actionBarBottomY.toString() + 'px',
                            transition: 'margin-top 0.15s ease-in-out',
                            marginTop: (actionBarVisible ? 0 : -actionBarHeight).toString() + 'px'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                background: alpha(theme.palette.background.paper, 1),
                                margin: (globalBorderRadiusValue / 2).toString() + 'px',
                                borderRadius: globalBorderRadius,
                                padding: '0px 10px',
                                backdropFilter: 'blur(8px)',
                                borderWidth: '2px',
                                borderColor: theme.palette.background.default,
                                borderStyle: 'solid',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <ActionCard
                                contentItem={content}
                                sx={{ width: '100%' }}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                {/* <Typography>{content.created_at.toString()}</Typography> */}
                                {hasGanjoorAnalizing && <IconButton
                                    onClick={toggleGanjoorAnalizing}
                                    sx={{
                                        backgroundColor: ganjoorAnalizing ? alpha(theme.palette.text.primary, 0.05) : 'transparent',
                                        border: '1px solid ' + (ganjoorAnalizing ? alpha(theme.palette.text.primary, 0.1) : 'transparent'),
                                        maxHeight: '32px',
                                        color: ganjoorAnalizing ? theme.palette.primary.main : theme.palette.text.primary,
                                        fontWeight: ganjoorAnalizing ? '900' : '300',
                                        borderRadius: `${globalBorderRadiusValue / 2}px`
                                    }}
                                >
                                    <Typography sx={{ fontSize: '14px', paddingTop: '2px' }}>
                                        {"AI"}
                                    </Typography>
                                </IconButton>}
                                <IconButton onClick={openMenu}>
                                    <MoreHorizIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: '1px', height: actionBarHeight }} />
                    {hasGanjoorAnalizing && ganjoorAnalizingWarn &&
                        <Box
                            sx={{
                                margin: '10px 10px 0px 10px',
                                padding: '4px 10px',
                                backgroundColor: theme.palette.background.paper,
                                border: '1px solid ' + alpha(theme.palette.primary.main, 0.2),
                                borderRadius: globalBorderRadius,
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '10px',
                                justifyContent: 'start',
                                alignItems: 'center',
                            }}
                        >
                            <TipsAndUpdatesOutlined />
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography
                                    sx={{
                                        borderLeft: '1px solid ' + alpha(theme.palette.primary.main, 0.2),
                                        padding: '4px 6px 4px 8px',
                                        fontSize: '11px',
                                        whiteSpace: 'pre-line',
                                        textAlign: 'justify'
                                    }}
                                >
                                    {t('poem.ai-message')}
                                </Typography>
                                <IconButton
                                    sx={{
                                        margin: '0px',
                                    }}
                                    onClick={closeGanjoorWarn}
                                >
                                    <Close />
                                </IconButton>
                            </Box>
                        </Box>
                    }
                    <Button
                        sx={{
                            height: 'unset',
                            color: 'unset',
                            alignItems: 'start',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: theme.palette.background.paper,
                            margin: '10px 10px 0px 10px',
                            padding: '10px 16px',
                            gap: '4px',
                            borderRadius: globalBorderRadius,
                            textTransform: 'unset',
                        }}
                        onClick={() => editNote(undefined)}
                    >
                        {isLoadingNote && <CircularProgress sx={{ alignSelf: 'center', maxWidth: '32px', maxHeight: '32px', margin: '20px' }} id="busy" />}
                        {!isLoadingNote && <>
                            <Typography variant="h6" >{t('poem.note')}</Typography>
                            <Typography sx={{ fontSize: '12px', whiteSpace: 'pre-line', textAlign: 'justify' }}>
                                {note && note.note.trim().length > 0 ? note.note : t('poem.write-note')}
                            </Typography>
                        </>}
                    </Button>
                    {ganjoorAnalizing && content.ai_analize && content.ai_analize.ganjoor_analysis &&
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'start',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: theme.palette.background.paper,
                                margin: '10px 10px 0px 10px',
                                padding: '10px 16px',
                                borderRadius: globalBorderRadius,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '16px',
                                }}
                            >
                                {"AI"}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '12px',
                                    textAlign: 'justify',
                                    borderLeft: '2px solid ' + alpha(theme.palette.text.primary, darkMode ? 0.1 : 0.05),
                                    padding: '6px 6px 6px 8px',
                                }}
                            >
                                {content.ai_analize.ganjoor_analysis}
                            </Typography>
                        </Box>
                    }
                    {!isInitializing && <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '16px 0px',
                            margin: '10px 10px 0px 10px',
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: globalBorderRadius,
                        }}
                    >
                        {verses.map((group: VerseGroup) => {
                            if (group.verses.length == 0)
                                return <Box />

                            const mainVerse = group.verses[0];
                            return <SingleVerseItem
                                group={group}
                                listed={listedVerseIds.indexOf(mainVerse.id) < 0 ? false : true}
                                rated={ratedVerseIds.indexOf(mainVerse.id) < 0 ? false : true}
                                note={notedVerseIds.has(mainVerse.id) ? notedVerseIds.get(mainVerse.id) : undefined}
                                highlighted={menuOpenVerse && selectedVerseId && selectedVerseId.id == mainVerse.id ? true : false}
                                ganjoorAnalizing={ganjoorAnalizing}
                                onClick={(event, text: string) => {
                                    setSelectedText(text);
                                    openMenuVerse(event, { id: mainVerse.id, verses: group.verses });
                                }}
                                onEditNoteRequest={() => editNote(mainVerse.id)}
                            />
                        })}
                    </Box>}
                </>}
                <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', p: '40px 0px', m: '-40px 0px' }}>
                    {(isLoading || isInitializing) && <CircularProgress sx={{ alignSelf: 'center', margin: versesList.length == 0 || isInitializing ? '150px 0px' : '50px 10px' }} id="busy" />}
                </Box>
                {!isLoading && !isInitializing && <>
                    {content.poem.phrase &&
                        <Box
                            sx={{
                                height: 'unset',
                                color: 'unset',
                                alignItems: 'start',
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: theme.palette.background.paper,
                                margin: '10px 10px 0px 10px',
                                padding: '10px 16px',
                                gap: '4px',
                                borderRadius: globalBorderRadius,
                                textTransform: 'unset',
                            }}
                        >
                            <Typography variant="h6" >{t('poem.phrase')}</Typography>
                            <Typography sx={{ fontSize: '12px', whiteSpace: 'pre-line', textAlign: 'left' }}>
                                {content.poem.phrase}
                            </Typography>
                        </Box>
                    }

                    {quoteContent &&
                        <Box
                            sx={{
                                height: 'unset',
                                color: 'unset',
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: theme.palette.background.paper,
                                margin: '10px 10px 0px 10px',
                                gap: '4px',
                                borderRadius: globalBorderRadius,
                                textTransform: 'unset',
                                padding: '10px 16px',
                            }}
                        >
                            <Typography variant="h6" >{t('poem.quote')}</Typography>
                            <Box
                                sx={{
                                    border: '1px solid ' + alpha(theme.palette.text.primary, 0.1),
                                    borderRadius: globalBorderRadius,
                                }}
                            >
                                <SimpleContentCard
                                    contentItem={quoteContent}
                                    highlight={quoteContentVerse ?? undefined}
                                    onReloadRequest={reload}
                                />
                            </Box>
                        </Box>
                    }

                    {content.source && <Typography
                        sx={{
                            alignSelf: 'center',
                            padding: '20px 0px 0px 0px',
                            opacity: 0.6,
                        }}
                    >
                        {t('poem.source-text').replaceAll('%1', content.source)}
                    </Typography>}

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '20px',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box>
                            {content.previous_content_id && <Button
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                onClick={() => navigate(`/content/${content.previous_content_id}`, { replace: true })}
                            >
                                <ChevronRight />
                                <Typography>{t('poem.previous-poem')}</Typography>
                            </Button>}
                        </Box>
                        <Box>
                            {content.next_content_id && <Button
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                onClick={() => navigate(`/content/${content.next_content_id}`, { replace: true })}
                            >
                                <Typography>{t('poem.next-poem')}</Typography>
                                <ChevronLeft />
                            </Button>}
                        </Box>
                    </Box>
                </>}
            </Box>
        </Box>

        <Menu
            anchorEl={anchorElVerse}
            open={menuOpenVerse}
            onClose={handleCloseVerse}
            onClick={handleCloseVerse}
            transformOrigin={{ horizontal: 'center', vertical: 'center' }}
            anchorOrigin={{ horizontal: 'center', vertical: 'center' }}
        >
            <MenuItem
                onClick={() => {
                    if (selectedVerseId) {
                        showQuoteMenu({ content, verse: selectedVerseId }, () => {
                            navigate('/');
                        });
                    }
                }}
            >
                <ListItemIcon>
                    <Repeat fontSize="small" />
                </ListItemIcon>
                <Typography>{t('poem.reshare')}</Typography>
            </MenuItem>
            <MenuItem onClick={() => {
                if (selectedVerseId)
                    toggleVerseRate(selectedVerseId.id);
            }}>
                {selectedVerseId && ratedVerseIds.indexOf(selectedVerseId.id) >= 0 ?
                    <>
                        <ListItemIcon>
                            <Favorite fontSize="small" />
                        </ListItemIcon>
                        <Typography>{t('poem.unrate')}</Typography>
                    </>
                    :
                    <>
                        <ListItemIcon>
                            <FavoriteBorder fontSize="small" />
                        </ListItemIcon>
                        <Typography>{t('poem.rate')}</Typography>
                    </>
                }
            </MenuItem>
            {content.owner && content.owner.verified_level >= 3 && false && <>
                <Divider />
                <MenuItem
                    onClick={showAIAnalizer}
                >
                    <ListItemIcon>
                        <NoteAdd fontSize="small" />
                    </ListItemIcon>
                    <Typography>{t('poem.ai-analize')}</Typography>
                </MenuItem>
            </>}
            <Divider />
            <MenuItem
                onClick={() => {
                    if (selectedVerseId)
                        addList(selectedVerseId.id)
                }}
            >
                <ListItemIcon>
                    <BookmarksOutlined fontSize="small" />
                </ListItemIcon>
                <Typography>{t('poem.add-to-list')}</Typography>
            </MenuItem>
            <MenuItem
                onClick={() => {
                    if (selectedVerseId)
                        editNote(selectedVerseId.id)
                }}
            >
                <ListItemIcon>
                    <NoteAdd fontSize="small" />
                </ListItemIcon>
                <Typography>{t('poem.add-note')}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => {
                handleCopy(selectedText);
                handleCloseVerse()
            }}>
                <ListItemIcon>
                    <ContentCopy fontSize="small" />
                </ListItemIcon>
                <Typography>{t('poem.copy-verse')}</Typography>
            </MenuItem>
            <MenuItem onClick={() => {
                handleShare(selectedText);
                handleCloseVerse()
            }}>
                <ListItemIcon>
                    <Share fontSize="small" />
                </ListItemIcon>
                <Typography>{t('poem.share')}</Typography>
            </MenuItem>
        </Menu>

        <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            slotProps={{
                paper: {
                    sx: {
                        mt: '2px',
                        mr: '-5px',
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: globalBorderRadius,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                },
            }}
        >
            <MenuItem
                onClick={() => addList(undefined)}
            >
                <ListItemIcon>
                    <BookmarksOutlined fontSize="small" />
                </ListItemIcon>
                <Typography>{t('poem.add-to-list')}</Typography>
            </MenuItem>
            <MenuItem
                onClick={() => editNote(undefined)}
            >
                <ListItemIcon>
                    <NoteAdd fontSize="small" />
                </ListItemIcon>
                <Typography>{t('poem.add-note')}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => {
                handleCopy(getText());
                handleClose()
            }}>
                <ListItemIcon>
                    <ContentCopy fontSize="small" />
                </ListItemIcon>
                <Typography>{t('poem.copy')}</Typography>
            </MenuItem>
            <MenuItem onClick={() => {
                if (content && content.poem) {
                    setShareContent(content);
                } else {
                    handleShare(getText());
                }
                handleClose()
            }}>
                <ListItemIcon>
                    <Share fontSize="small" />
                </ListItemIcon>
                <Typography>{t('poem.share')}</Typography>
            </MenuItem>
        </Menu>

        <MeikadeDrawer
            open={shareContent != null}
            onClose={() => setShareContent(null)}
            anchor="bottom"
        >
            <ShareItem contentItem={shareContent ?? undefined} />
        </MeikadeDrawer>

        <AiAnalizingDialog
            open={aiAnalizing}
            onCloseRequest={() => setAiAnalizing(false)}
            contentId={content.id}
            verseId={selectedVerseId ? selectedVerseId.id : undefined}
        />
        <DefaultSignInDialog autoMode />
    </Container>
})

export default PoemContent;