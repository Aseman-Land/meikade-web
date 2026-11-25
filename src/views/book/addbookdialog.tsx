import { alpha, Box, Button, CircularProgress, DialogProps, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import MeikadeDialog from "../../components/meikadedialog";
import { MkAddBook, MkBook } from '../../models/book';
import { MkFullBookResult } from '../../models/content';
import { MkBookServices } from '../../services/book';
import { theme } from '../../utils/theme';
import { sleep } from '../../utils/tools';

export type AddBookDialogProps = {
    editBook?: MkBook | MkFullBookResult,
    onSuccessfull?: () => void,
    onCloseReuqest?: () => void,
} & DialogProps;

const AddBookDialog = (props: AddBookDialogProps) => {
    const { t } = useTranslation();

    const [title, setTitle] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [isAddingBook, setIsAddingBook] = React.useState<boolean>(false);
    const addingBookRef = React.useRef<boolean>(false);

    const createBook = async () => {
        if (addingBookRef.current) return;

        addingBookRef.current = true;
        setIsAddingBook(true);
        try {
            const req: MkAddBook = {
                title: title.trim(),
                description: description.trim(),
                parent_id: null,
                public_book: 1,
            };

            const result = props.editBook ? await MkBookServices.edit(props.editBook.id, req) : await MkBookServices.insert(req);
            await sleep(500);
            if (result.status && result.result) {
                if (props.onSuccessfull)
                    props.onSuccessfull();
            }
        } catch {
        }
        setIsAddingBook(false);
        addingBookRef.current = false;
    }

    React.useEffect(() => {
        if (props.open) {
            setTitle(props.editBook?.title ? props.editBook.title : '');
            setDescription(props.editBook?.description ? props.editBook.description : '');
        }
    }, [props.open]);

    const close = () => {
        if (props.onCloseReuqest)
            props.onCloseReuqest();
    }

    return <MeikadeDialog
        {...props}
        slotProps={{
            paper: {
                sx: {
                    padding: '4px 10px',
                }
            }
        }}
        title={props.editBook ? t('books.edit')! : t('books.add')!}
        onClose={close}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'end',
                maxWidth: '400px',
                width: 'calc(100vw - 150px)',
            }}
        >
            {isAddingBook && <CircularProgress sx={{ alignSelf: 'center', marginTop: '30px', marginBottom: '30px' }} id="busy" />}
            {!isAddingBook && <>
                <TextField
                    fullWidth
                    variant='standard'
                    value={title}
                    onChange={(e) => setTitle(e.target.value!)}
                    placeholder={t('books.add-placeholder')!}
                    slotProps={{
                        input: {
                            disableUnderline: true,
                            sx: {
                                fontSize: '16px',
                                fontWeight: 700,
                                textAlign: 'start',
                                alignItems: 'start',
                            }
                        }
                    }}
                />
                <TextField
                    fullWidth
                    variant='standard'
                    value={description}
                    onChange={(e) => setDescription(e.target.value!)}
                    multiline
                    minRows={5}
                    maxRows={10}
                    placeholder={t('books.description')!}
                    slotProps={{
                        input: {
                            disableUnderline: true,
                            sx: {
                                fontSize: '14px',
                                textAlign: 'start',
                                alignItems: 'start',
                            }
                        }
                    }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', alignSelf: 'end' }}>
                    <Button
                        disableElevation
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '10px',
                            background: alpha(theme.palette.text.primary, 0.1),
                            color: theme.palette.text.primary,

                        }}
                        onClick={close}
                    >
                        <Typography>{t('books.cancel')}</Typography>
                    </Button>
                    <Button disabled={title.trim().length == 0} variant='contained' disableElevation onClick={createBook}>
                        <Typography>{props.editBook ? t('books.edit') : t('books.create')}</Typography>
                    </Button>
                </Box>
            </>}
        </Box>
    </MeikadeDialog>
}

export default AddBookDialog;
