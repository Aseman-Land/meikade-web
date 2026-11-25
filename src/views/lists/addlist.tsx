import { Add, ListOutlined } from '@mui/icons-material';
import { alpha, Box, BoxProps, Button, CircularProgress, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { MkListResult } from '../../models/list';
import { MkListServices } from '../../services/list';
import { theme } from '../../utils/theme';
import AddListDialog from './addlistdialog';

type AddListProps = {
    contentId?: number,
    verseId?: number,
    onSelected?: (list: MkListResult) => void,
} & BoxProps;

const AddsList = (props: AddListProps) => {
    const { t } = useTranslation();

    const [addListDialog, setAddListDialog] = React.useState<boolean>(false);
    const [lists, setLists] = React.useState<Array<MkListResult>>([]);
    const [keyword, setKeyword] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);
    const [hasMore, setHasMore] = React.useState<boolean>(false);

    const limit: number = 50;

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const more = () => {
        reload(lists.length);
    }

    const reload = async (offset: number) => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            if (offset == 0)
                setLists([]);
            const res = await MkListServices.myLists({
                limit: limit,
                offset: offset,
                search: keyword,
                user_id: null,
            });
            if (res.status && res.result) {
                setLists(offset > 0 ? [...lists, ...res.result] : res.result);
                setHasMore(res.result.length == limit);
            }
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    React.useEffect(() => {
        reload(0)
    }, []);

    React.useEffect(() => {
        if (inView && hasMore) {
            more();
        }
    }, [inView]);

    return <Box
        {...props}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            ...props.sx,
        }}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                overflowY: 'scroll',
                maxHeight: '350px',
                minHeight: '200px',
            }}
        >
            {lists.map((list: MkListResult) => {
                return <Button
                    sx={{
                        color: theme.palette.text.primary,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'unset',
                        padding: '24px 20px',
                        gap: '20px',
                        backgroundColor: 'unset',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'transparent',
                    }}
                    onClick={() => {
                        if (props.onSelected)
                            props.onSelected(list);
                    }}
                >
                    <ListOutlined />
                    <Typography>{list.title}</Typography>
                </Button>
            })}
            <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                {isLoading && <CircularProgress sx={{ alignSelf: 'center', margin: '20px 10px' }} id="busy" />}
            </Box>
        </Box>
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
            onClick={() => setAddListDialog(true)}
        >
            <Add />
            <Typography>{t('lists.add')}</Typography>
        </Button>

        <AddListDialog
            open={addListDialog}
            onSuccessfull={() => {
                reload(0);
                setAddListDialog(false);
            }}
            onCloseReuqest={() => setAddListDialog(false)}
        />
    </Box>
}

export default AddsList;
