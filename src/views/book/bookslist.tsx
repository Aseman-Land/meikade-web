import { Add, BookOutlined } from '@mui/icons-material';
import { alpha, Box, BoxProps, Button, CircularProgress, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { MkBookResult } from '../../models/book';
import { MkUserServices } from '../../services/user';
import { theme } from '../../utils/theme';
import AddBookDialog from './addbookdialog';

type BooksListProps = {
    contentId?: number,
    verseId?: number,
    onSelected?: (book: MkBookResult) => void,
} & BoxProps;

const BooksList = (props: BooksListProps) => {
    const { t } = useTranslation();

    const [addBookDialog, setAddBookDialog] = React.useState<boolean>(false);
    const [books, setBooks] = React.useState<Array<MkBookResult>>([]);
    const [keyword, setKeyword] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);
    const [hasMore, setHasMore] = React.useState<boolean>(false);

    const limit: number = 50;

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const more = () => {
        reload(books.length);
    }

    const reload = async (offset: number) => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            if (offset == 0)
                setBooks([]);
            const lists = await MkUserServices.myBooks({
                limit: limit,
                offset: offset,
                search: keyword,
                parent_id: null,
                author_id: null,
            });
            if (lists.status && lists.result) {
                setBooks(offset > 0 ? [...books, ...lists.result] : lists.result);
                setHasMore(lists.result.length == limit);
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
            {books.map((book: MkBookResult) => {
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
                            props.onSelected(book);
                    }}
                >
                    <BookOutlined />
                    <Typography>{book.title}</Typography>
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
            onClick={() => setAddBookDialog(true)}
        >
            <Add />
            <Typography>{t('books.add')}</Typography>
        </Button>

        <AddBookDialog
            open={addBookDialog}
            onSuccessfull={() => {
                reload(0);
                setAddBookDialog(false);
            }}
            onCloseReuqest={() => setAddBookDialog(false)}
        />
    </Box>
}

export default BooksList;
