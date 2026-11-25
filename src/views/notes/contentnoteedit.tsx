import { Check } from '@mui/icons-material';
import { alpha, Box, BoxProps, Button, CircularProgress, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MkFullContentNote, MkFullContentVerseNote } from '../../models/contentnote';
import { MkContentServices } from '../../services/content';
import { theme } from '../../utils/theme';
import { sleep } from '../../utils/tools';

type ContentNoteEditProps = {
    contentId: number,
    verseId?: number,
    onSubmited?: () => void,
} & BoxProps;

const ContentNoteEdit = (props: ContentNoteEditProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const params = useParams();

    const [note, setNote] = React.useState<MkFullContentVerseNote | MkFullContentNote | null>(null);
    const [text, setText] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [focused, setFocused] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const reload = async () => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            var note: MkFullContentVerseNote | MkFullContentNote | null = null;
            const query = {
                limit: 50,
                offset: null,
            };

            if (props.verseId) {
                const list = await MkContentServices.getContentVerseNotes(props.contentId, props.verseId, query);
                if (list.result && list.result.length > 0) {
                    note = list.result[0];
                }
            } else {
                const list = await MkContentServices.getContentNotes(props.contentId, query);
                if (list.result && list.result.length > 0) {
                    note = list.result[0];
                }
            }
            setNote(note);
            setText(note ? note.note : '');
        } catch {
        }

        await sleep(500);
        setIsLoading(false);
        loadingRef.current = false;
    }

    const saveNote = async () => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);

        try {
            if (text.length) {
                if (note) {
                    if (props.verseId) {
                        await MkContentServices.updateVerseNote(props.contentId, props.verseId, note.id, {
                            note: text,
                            parent_id: null,
                        });
                    } else {
                        await MkContentServices.updateNote(props.contentId, note.id, {
                            note: text,
                            parent_id: null,
                        });
                    }
                } else {
                    if (props.verseId) {
                        await MkContentServices.postVerseNote(props.contentId, props.verseId, {
                            note: text,
                            parent_id: null,
                        });
                    } else {
                        await MkContentServices.postNote(props.contentId, {
                            note: text,
                            parent_id: null,
                        });
                    }
                }
            } else {
                if (note) {
                    if (props.verseId) {
                        await MkContentServices.deleteVerseNote(props.contentId, props.verseId, note.id);
                    } else {
                        await MkContentServices.deleteNote(props.contentId, note.id);
                    }
                }
            }

            await sleep(500);
            if (props.onSubmited)
                props.onSubmited()
        } catch {

        }

        setIsLoading(false);
        loadingRef.current = false;
    };

    React.useEffect(() => {
        reload()
    }, []);

    return <Box
        {...props}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            ...props.sx,
        }}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                transition: 'height 0.2s ease-in-out',
                minHeight: '170px',
            }}
        >
            {isLoading && <CircularProgress sx={{ alignSelf: 'center', marginTop: '50px', marginBottom: '50px' }} id="busy" />}
            {!isLoading && <TextField
                multiline
                fullWidth
                variant="standard"
                minRows={8}
                maxRows={8}
                placeholder={t('note-page.placeholder')!}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                slotProps={{
                    input: {
                        disableUnderline: true,
                        sx: {
                            textAlign: 'start',
                            alignItems: 'start',
                            "& .MuiInputBase-input": {
                                padding: '0px 16px',
                            },
                        }
                    }
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />}
        </Box>
        <Button
            disabled={isLoading}
            sx={{
                width: 'calc(100% - 20px)',
                display: 'flex',
                flexDirection: 'row',
                padding: '24px 20px',
                gap: '10px',
                background: alpha(theme.palette.text.primary, 0.1),
                color: theme.palette.text.primary,

            }}
            onClick={saveNote}
        >
            <Check />
            <Typography>{t('notes.save')}</Typography>
        </Button>
    </Box>
}

export default ContentNoteEdit;
