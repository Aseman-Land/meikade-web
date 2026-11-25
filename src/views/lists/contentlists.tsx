import { Add, BookmarksOutlined } from '@mui/icons-material';
import { alpha, Box, BoxProps, Button, CircularProgress, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MkListResult } from '../../models/list';
import { MkContentServices } from '../../services/content';
import { MkListServices } from '../../services/list';
import { theme } from '../../utils/theme';

type ContentListsProps = {
    contentId?: number,
    verseId?: number,
    onSubmited?: () => void,
} & BoxProps;

const ContentLists = (props: ContentListsProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const params = useParams();

    const [selectedItems, setSelectedItems] = React.useState<Array<number>>([]);
    const [lists, setLists] = React.useState<Array<MkListResult>>([]);
    const [keyword, setKeyword] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const reload = async () => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            setLists([]);
            const lists = await MkListServices.myLists({
                limit: 200,
                offset: 0,
                search: keyword,
                user_id: null,
            });
            if (lists.status && lists.result)
                setLists(lists.result);

            const selectedItems: Array<number> = new Array<number>;
            if (props.contentId) {
                if (props.verseId) {
                    const selecteds = await MkContentServices.getPersonalSingleVerseLists(props.contentId, props.verseId);
                    if (selecteds.status && selecteds.result) {
                        selecteds.result.forEach(l => {
                            selectedItems.push(l.id)
                        });
                    }
                } else {
                    const selecteds = await MkContentServices.getPersonalLists(props.contentId);
                    if (selecteds.status && selecteds.result) {
                        selecteds.result.forEach(l => {
                            selectedItems.push(l.id)
                        });
                    }
                }
            }
            setSelectedItems(selectedItems)
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    const toggleList = async (listId: number) => {
        if (!props.contentId)
            return;

        const items = [...selectedItems];
        const idx = items.indexOf(listId);
        if (idx < 0) {
            items.push(listId);
        } else {
            items.splice(idx, 1);
        }
        setSelectedItems(items);

        try {
            if (idx < 0) {
                if (props.verseId) {
                    const result = await MkListServices.appendVerse(listId, { verse_id: props.verseId });
                    if (!result.status || !result.result)
                        throw false;
                } else {
                    const result = await MkListServices.append(listId, { content_id: props.contentId });
                    if (!result.status || !result.result)
                        throw false;
                }
            } else {
                if (props.verseId) {
                    const result = await MkListServices.removeVerse(listId, props.verseId);
                    if (!result.status || !result.result)
                        throw false;
                } else {
                    const result = await MkListServices.remove(listId, props.contentId);
                    if (!result.status || !result.result)
                        throw false;
                }
            }
            if (props.onSubmited)
                props.onSubmited();
        } catch {
            const remove_items = [...items];
            const idx = remove_items.indexOf(listId);
            if (idx < 0) {
                remove_items.push(listId);
            } else {
                remove_items.splice(idx, 1);
            }
            setSelectedItems(remove_items);
        }
    };

    React.useEffect(() => {
        reload()
    }, []);

    return <Box
        {...props}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            ...props.sx,
        }}
    >
        {isLoading && <CircularProgress sx={{ alignSelf: 'center', marginTop: '50px', marginBottom: '50px' }} id="busy" />}
        {!isLoading && <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    overflowY: 'scroll',
                    maxHeight: '400px',
                    minHeight: '200px',
                }}
            >
                {lists.map((list: MkListResult) => {
                    const selected: boolean = selectedItems.indexOf(list.id) < 0 ? false : true;
                    return <Button
                        sx={{
                            color: theme.palette.text.primary,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'unset',
                            padding: '24px 20px',
                            gap: '20px',
                            backgroundColor: selected ? alpha(theme.palette.primary.main, 0.1) : 'unset',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: selected ? alpha(theme.palette.primary.main, 0.3) : 'transparent',
                        }}
                        onClick={() => {
                            toggleList(list.id);
                        }}
                    >
                        <BookmarksOutlined />
                        <Typography>{list.title}</Typography>
                    </Button>
                })}
            </Box>
        </>}
        <Button
            disabled={isLoading}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                padding: '24px 20px',
                gap: '10px',
                background: alpha(theme.palette.text.primary, 0.1),
                color: theme.palette.text.primary,

            }}
            onClick={() => {
            }}
        >
            <Add />
            <Typography>{t('lists.add')}</Typography>
        </Button>
    </Box>
}

export default ContentLists;
