import { alpha, Box, Button, CircularProgress, DialogProps, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import MeikadeDialog from "../../components/meikadedialog";
import { MkAddList, MkFullListResult, MkList } from '../../models/list';
import { MkListServices } from '../../services/list';
import { theme } from '../../utils/theme';
import { sleep } from '../../utils/tools';

export type AddListDialogProps = {
    editList?: MkList | MkFullListResult,
    onSuccessfull?: () => void,
    onCloseReuqest?: () => void,
} & DialogProps;

const AddListDialog = (props: AddListDialogProps) => {
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
            const req: MkAddList = {
                title: title.trim(),
                description: description.trim(),
                public_list: 1,
                color: ''
            };

            const result = props.editList ? await MkListServices.edit(props.editList.id, req) : await MkListServices.insert(req);
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
            setTitle(props.editList?.title ? props.editList.title : '');
            setDescription(props.editList?.description ? props.editList.description : '');
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
                    width: '420px',
                    maxWidth: 'calc(100vw - 40px)',
                }
            }
        }}
        title={t('lists.add')!}
        onClose={close}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'end',
            }}
        >
            {isAddingBook && <CircularProgress sx={{ alignSelf: 'center', marginTop: '30px', marginBottom: '30px' }} id="busy" />}
            {!isAddingBook && <>
                <TextField
                    fullWidth
                    variant='standard'
                    value={title}
                    onChange={(e) => setTitle(e.target.value!)}
                    placeholder={t('lists.add-placeholder')!}
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
                    placeholder={t('lists.description')!}
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
                        <Typography>{t('lists.cancel')}</Typography>
                    </Button>
                    <Button disabled={title.trim().length == 0} variant='contained' disableElevation onClick={createBook}>
                        <Typography>{props.editList ? t('lists.edit') : t('lists.create')}</Typography>
                    </Button>
                </Box>
            </>}
        </Box>
    </MeikadeDialog>
}

export default AddListDialog;
