import { BookmarksOutlined, EditOutlined, FavoriteBorder } from '@mui/icons-material';
import { Box, Button, Typography, alpha } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MkContentVerses } from '../../models/contentverses';
import { darkMode, globalBorderRadiusValue, theme } from '../../utils/theme';

export type VerseGroup = {
    verses: Array<MkContentVerses>
}

export type SingleVerseItemProps = {
    group: VerseGroup,
    listed?: boolean,
    rated?: boolean,
    note?: string,
    highlighted?: boolean,
    ganjoorAnalizing?: boolean,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>, text: string) => void,
    onEditNoteRequest?: () => void,
};

const SingleVerseItem = (props: SingleVerseItemProps) => {
    const { t } = useTranslation();

    const group = props.group;

    const [ganjoorAnalizing, setGanjoorAnalizing] = React.useState<boolean>(props.ganjoorAnalizing ?? false);
    const [ganjoorAnalizingText, setGanjoorAnalizingText] = React.useState<string | null>(null);

    React.useEffect(() => {
        var text = '';
        group.verses.forEach((v: MkContentVerses) => {
            if (v.ai_analize && v.ai_analize.ganjoor_analysis) {
                if (text.length > 0)
                    text += '\n';
                text += v.ai_analize.ganjoor_analysis;
            }
        });
        setGanjoorAnalizingText(text.length > 0 ? text : null);
    }, [group]);

    React.useEffect(() => {
        setGanjoorAnalizing(props.ganjoorAnalizing ?? false);
    }, [props.ganjoorAnalizing]);

    return <Button
        sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '3px',
            padding: '0px 24px 0px 6px',
            margin: '0px 0px',
            height: 'unset',
            alignItems: 'unset',
            borderRadius: '0px',
            color: props.highlighted ? '#fff' : theme.palette.text.primary,
            textTransform: 'unset',
        }}
        style={{
            background: props.highlighted ? alpha(theme.palette.primary.light, 1) : 'transparent',
            transition: 'background 0.2s ease-in-out',
        }}
        onClick={(event) => {
            var text: string = '';
            group.verses.forEach(v => {
                if (text.length != 0)
                    text += '\n';
                text += v.text;
            })
            if (props.onClick)
                props.onClick(event, text)
        }}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px 2px',
                alignItems: 'start',
                gap: '2px',
                // color: theme.palette.primary.main,
                opacity: 0.6,
                minWidth: '19px',
            }}
        >
            {props.rated && <FavoriteBorder sx={{ opacity: props.rated ? 1 : 0, fontSize: '15px' }} />}
            {props.listed && <BookmarksOutlined sx={{ opacity: props.listed ? 1 : 0, fontSize: '15px' }} />}
            {props.note && <EditOutlined sx={{ opacity: props.note ? 1 : 0, fontSize: '15px' }} />}
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px 0px',
                gap: '12px',
                width: '100%',
            }}
        >
            {group.verses.map((verse: MkContentVerses) => {
                const position = verse.position == -5 ? 4 : verse.position < 0 ? -2 - verse.position : verse.position;
                return <Typography
                    sx={{
                        wordBreak: 'break-word',
                        direction: verse.position < -1 ? 'rtl' : 'ltr',
                        textAlign: position === 4 || verse.position == -1 ? 'justify' : position === 0 ? 'start' : position === 1 ? 'end' : 'center',
                    }}
                >
                    {verse.text}
                </Typography>
            })}
            {ganjoorAnalizing && ganjoorAnalizingText &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'start',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: alpha(theme.palette.text.primary, darkMode ? 0.1 : 0.05),
                        padding: '0px 10px',
                        borderRadius: `${globalBorderRadiusValue / 2}px`
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
                            borderLeft: '2px solid ' + (props.highlighted ? theme.palette.primary.main : theme.palette.background.paper),
                            padding: '6px 6px 6px 8px',
                        }}
                    >
                        {ganjoorAnalizingText}
                    </Typography>
                </Box>
            }
            {props.note && props.note.length > 0 &&
                <Button
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        borderLeft: '2px solid ' + (props.highlighted ? '#fff' : theme.palette.primary.main),
                        padding: '4px 10px',
                        marginBottom: '10px',
                        marginTop: '-10px',
                        height: 'unset',
                        color: 'unset',
                        justifyContent: 'start',
                        borderRadius: 'unset',
                        textTransform: 'unset',
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        if (props.onEditNoteRequest)
                            props.onEditNoteRequest()
                    }}
                    onMouseDown={event => event.stopPropagation()}
                >
                    <Typography sx={{ fontSize: '12px', whiteSpace: 'pre-line', textAlign: 'left' }}>
                        {props.note}
                    </Typography>
                </Button>
            }
        </Box>
    </Button>
}

export default SingleVerseItem;