import * as React from 'react';

import { ChevronLeft, Delete, Edit, NotesOutlined, StarRateOutlined } from '@mui/icons-material';
import { alpha, Box, ButtonBase, CircularProgress, Container, Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import AvatarPoemCard from '../../components/avatarpoemcard';
import DeleteItem from '../../components/deleteitem';
import MeikadeAppBar from '../../components/meikadeappbar';
import MeikadeDrawer from '../../components/meikadedrawer';
import SimpleContentCard from '../../components/simplecontentcard';
import UserFullname from '../../components/userfullname';
import { MkFullContent, MkFullContentVerses, MkMyContentRate, MkMyContentVerseRate } from '../../models/content';
import { MkMyContentNote, MkMyContentVerseNote } from '../../models/contentnote';
import { MkFullListResult, MkListContent, MkListContentVerse } from '../../models/list';
import { MkContentServices } from '../../services/content';
import { MkListServices } from '../../services/list';
import * as UserGlobal from "../../services/user-global";
import { globalBorderRadius, globalBorderRadiusValue, theme } from '../../utils/theme';
import AddListDialog from './addlistdialog';

export type ListPageProps = {
    favorites?: boolean,
    notes?: boolean,
};

const ListPage = (props: ListPageProps) => {
    const params = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const list_id: number = parseInt(params.list_id!);

    type Item = {
        content: MkFullContent | null,
        verse: MkFullContentVerses | null,
        created_at: Date,
        id: number,
        updated_at: Date,
        note: string | undefined,
    };

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(menuAnchorEl);

    const [editListDialog, setEditListDialog] = React.useState<boolean>(false);
    const [deleteMenu, setDeleteMenu] = React.useState<boolean>(false);

    const [list, setList] = React.useState<MkFullListResult>();
    const [items, setItems] = React.useState<Array<Item>>([]);

    const [contents, setContents] = React.useState<Array<MkMyContentNote | MkMyContentRate | MkListContent>>([]);
    const [verses, setVerses] = React.useState<Array<MkMyContentVerseNote | MkMyContentVerseRate | MkListContentVerse>>([]);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const [hasMore, setHasMore] = React.useState<boolean>(false);

    const limit: number = 20;

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const more = () => {
        reload(contents.length, verses.length);
    }

    const deleteList = async (): Promise<boolean> => {
        if (!list || !list.owner)
            return false;

        const result = await MkListServices.deleteList(list.id);
        if (result.status && result.result) {
            navigate('/profile');
            return true;
        } else {
            return false;
        }
    }

    const reload = async (contentOffset: number, verseOffset: number) => {
        if (loadingRef.current)
            return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            if (contentOffset == 0 && verseOffset == 0)
                setItems([]);

            var contents: Array<MkMyContentNote | MkMyContentRate | MkListContent> = [];
            var verses: Array<MkMyContentVerseNote | MkMyContentVerseRate | MkListContentVerse> = []

            const content_notes: Map<number, string> = new Map<number, string>();
            const verse_notes: Map<number, string> = new Map<number, string>();

            if (props.notes) {
                const contents_res = await MkContentServices.myNotes({
                    offset: contentOffset,
                    limit: limit,
                });
                const verses_res = await MkContentServices.myVersesNotes({
                    offset: verseOffset,
                    limit: limit,
                });

                if (contents_res.status && contents_res.result) {
                    contents_res.result.forEach((c) => content_notes.set(c.id, c.note));
                    contents = contents_res.result;
                }
                if (verses_res.status && verses_res.result) {
                    verses_res.result.forEach((v) => verse_notes.set(v.id, v.note));
                    verses = verses_res.result;
                }
            } else if (props.favorites) {
                const contents_res = await MkContentServices.myRates({
                    offset: contentOffset,
                    limit: limit,
                });
                const verses_res = await MkContentServices.myVersesRates({
                    offset: verseOffset,
                    limit: limit,
                });

                if (contents_res.status && contents_res.result)
                    contents = contents_res.result;
                if (verses_res.status && verses_res.result)
                    verses = verses_res.result;
            } else {
                const list = await MkListServices.getOneList(list_id);

                if (list.status && list.result) {
                    const contents_res = await MkListServices.getListContents(list_id, {
                        offset: contentOffset,
                        limit: limit,
                    });
                    const verses_res = await MkListServices.getListVerses(list_id, {
                        offset: verseOffset,
                        limit: limit,
                    });

                    setList(list.result);
                    if (contents_res.status && contents_res.result)
                        contents = contents_res.result;
                    if (verses_res.status && verses_res.result)
                        verses = verses_res.result;
                }
            }

            let itemsList: Array<Item> = [];
            contents.forEach((c) => {
                itemsList.push({
                    id: c.id,
                    content: c.content,
                    verse: null,
                    note: content_notes.get(c.id),
                    updated_at: c.updated_at,
                    created_at: c.created_at,
                });
            });

            verses.forEach((v) => {
                itemsList.push({
                    id: v.id,
                    content: null,
                    verse: v.verse,
                    note: verse_notes.get(v.id),
                    updated_at: v.updated_at,
                    created_at: v.created_at,
                })
            })

            itemsList.sort((a, b) => {
                if (a.created_at < b.created_at)
                    return 1;
                if (a.created_at > b.created_at)
                    return -1;
                return 0;
            });
            itemsList = itemsList.slice(0, limit);

            const latestDate: Date = itemsList.length > 0 ? itemsList[itemsList.length - 1].created_at : new Date;

            const contentsList: Array<MkMyContentNote | MkMyContentRate | MkListContent> = [];
            contents.forEach((c) => {
                if (c.created_at >= latestDate)
                    contentsList.push(c);
            });

            const versesList: Array<MkMyContentVerseNote | MkMyContentVerseRate | MkListContentVerse> = [];
            verses.forEach((v) => {
                if (v.created_at >= latestDate)
                    versesList.push(v);
            });

            setContents(contentsList);
            setVerses(versesList);
            setItems(itemsList);

            setItems(contentOffset > 0 || verseOffset > 0 ? [...items, ...itemsList] : itemsList);
            setHasMore(itemsList.length == limit);
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    React.useEffect(() => {
        reload(0, 0);
    }, []);

    React.useEffect(() => {
        if (inView && hasMore) {
            more();
        }
    }, [inView]);

    return <Container maxWidth="sm">
        <MeikadeAppBar
            enableBackButton
            enableMenuButton={list && list.owner && list.owner.id == UserGlobal.userId ? true : false}
            onMenuClick={handleMenuOpen}
        >
            {list && <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '5px 10px',
                    maxWidth: 'sm',
                    width: 'calc(100% - 20px)',
                    margin: '0px 10px 10px 10px',
                    background: alpha(theme.palette.text.primary, 0.05),
                    borderRadius: `${globalBorderRadiusValue / 2}px`,
                    alignItems: 'center',
                }}
            >
                <ButtonBase
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '8px',
                        padding: '5px',
                        borderRadius: `${globalBorderRadiusValue / 2}px`,
                    }}
                    component={RouterLink}
                    to={`/user/${list?.owner?.username}`}
                >
                    <AvatarPoemCard avatar={list.owner?.avatar ?? null} size={18} innerSize={20} outerSize={22} />
                    {list.owner && <UserFullname
                        user={list.owner}
                    />}
                </ButtonBase>
                <ChevronLeft />
                <Typography sx={{ padding: '5px' }}>
                    {list.title}
                </Typography>
            </Box>}
            {props.favorites && <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '5px 10px',
                    maxWidth: '550px',
                    width: 'calc(100% - 40px)',
                    margin: '0px 10px 10px 10px',
                    background: alpha(theme.palette.text.primary, 0.05),
                    borderRadius: `${globalBorderRadiusValue / 2}px`,
                    alignItems: 'center',
                }}
            >
                <StarRateOutlined sx={{ fontSize: '22px', color: theme.palette.primary.main, }} />
                <Typography sx={{ padding: '5px' }}>
                    {t("user.favorite")}
                </Typography>
            </Box>}
            {props.notes && <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '5px 10px',
                    maxWidth: '550px',
                    width: 'calc(100% - 40px)',
                    margin: '0px 10px 10px 10px',
                    background: alpha(theme.palette.text.primary, 0.05),
                    borderRadius: `${globalBorderRadiusValue / 2}px`,
                    alignItems: 'center',
                }}
            >
                <NotesOutlined sx={{ fontSize: '22px', color: theme.palette.primary.main, }} />
                <Typography sx={{ padding: '5px' }}>
                    {t("user.note")}
                </Typography>
            </Box>}
        </MeikadeAppBar>
        <Box
            sx={{
                marginTop: '120px',
                paddingBottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
            }}
        >
            {items.map((item: Item, index: number) => (
                <>
                    {item.content && <SimpleContentCard
                        contentItem={item.content}
                        contentNote={item.note}
                        onReloadRequest={() => {
                            reload(0, 0);
                        }}
                    />}
                    {item.verse && item.verse.content && <SimpleContentCard
                        contentItem={item.verse.content}
                        highlight={item.verse}
                        contentVerseNote={item.note}
                        onReloadRequest={() => {
                            reload(0, 0);
                        }}
                    />}
                </>
            ))}

            <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                {isLoading && <CircularProgress sx={{ alignSelf: 'center', margin: items.length == 0 ? '40% 0px' : '20px 10px' }} id="busy" />}
            </Box>
        </Box>

        <Menu
            anchorEl={menuAnchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
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
                onClick={() => {
                    setEditListDialog(true);
                    handleMenuClose();
                }}
            >
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                {t('lists.edit')}
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={() => {
                    setDeleteMenu(true);
                    handleMenuClose();
                }}
            >
                <ListItemIcon>
                    <Delete fontSize="small" />
                </ListItemIcon>
                {t('lists.delete')}
            </MenuItem>
        </Menu>


        <MeikadeDrawer
            open={deleteMenu}
            title={t('lists.delete')!}
            onClose={() => setDeleteMenu(false)}
            anchor="bottom"
        >
            <DeleteItem
                deleteMessage={t('lists.delete-message').replaceAll('%1', list?.title ?? '')}
                deleteMethod={deleteList}
                onDissmiss={() => {
                    setDeleteMenu(false)
                }}
                onSuccessfull={() => {
                    setDeleteMenu(false);
                }}
            />
        </MeikadeDrawer>


        <AddListDialog
            open={editListDialog}
            editList={list}
            onSuccessfull={() => {
                reload(0, 0);
                setEditListDialog(false);
            }}
            onCloseReuqest={() => setEditListDialog(false)}
        />
    </Container>
}

export default ListPage;