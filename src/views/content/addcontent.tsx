import { CancelOutlined, Check } from '@mui/icons-material';
import { Box, Button, ButtonProps, CircularProgress, Collapse, Divider, Menu, MenuItem, Select, Switch, TextField, Typography } from '@mui/material';
import { alpha, BoxProps } from '@mui/system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import MeikadeDrawer from '../../components/meikadedrawer';
import { PoemEditTextField } from '../../components/poemedittextfield';
import PoemIcon, { PoemIconAlignmentType } from '../../components/poemicon';
import { SimplePoemCardCore, SimplePoemContent, SimplePoemHighlight } from '../../components/simplepoemcard';
import { globalShowInfoMessage } from '../../layouts/mainframe';
import { MkBook, MkBookResult } from '../../models/book';
import { MkAddContent, MkEditContent, MkFullContent } from '../../models/content';
import { MkAddContentVerses, MkContentVerses } from '../../models/contentverses';
import { MkContentServices } from '../../services/content';
import { globalBorderRadius, globalBorderRadiusValue, theme } from '../../utils/theme';
import { sleep } from '../../utils/tools';
import BooksList from '../book/bookslist';

type PoemButtonProps = {
    type: PoemIconAlignmentType,
    checked?: boolean,
} & ButtonProps;

const PoemButton = (props: PoemButtonProps) => {
    return <Button
        {...props}
        disableElevation
        variant='contained'
        onClick={(e) => {
            e.preventDefault();
            if (props.onClick)
                props.onClick(e);
        }}
        sx={{
            padding: '10px',
            minWidth: 'unset',
            background: props.checked ? alpha(theme.palette.text.primary, 0.1) : 'transparent',
        }}
    >
        <PoemIcon
            type={props.type}
            size={24}
            color={props.checked ? theme.palette.primary.main : theme.palette.text.primary}
            lineWidth={2}
        />
    </Button>
}

type PoemDetailsRowProps = {
    disableScroll?: boolean,
} & BoxProps;

const PoemDetailsRow = (props: PoemDetailsRowProps) => {
    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: 'unset',
            borderRadius: `${globalBorderRadiusValue / 2}px`,
            color: 'unset',
            overflowX: props.disableScroll ? 'unset' : 'scroll',
            justifyContent: 'space-between',
            gap: '4px',
            ...props.sx,
        }}
    >
        <Box
            sx={{
                color: theme.palette.text.primary,
                borderRadius: `${globalBorderRadiusValue / 2}px 0px 0px ${globalBorderRadiusValue / 2}px`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography sx={{ fontSize: '15px' }}>{props.title}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', padding: '1px 4px', alignItems: 'center', justifyContent: 'center', }}>
            {props.children}
        </Box>
    </Box>
}

export type QuoteContentVerse = {
    verse?: {
        verses: Array<MkContentVerses>,
        id: number,
    },
    content: SimplePoemContent,
};

export type AddContentProps = {
    editContent?: SimplePoemContent,
    quoteContent?: QuoteContentVerse,
    quoteContentHighlight?: SimplePoemHighlight,
    onDissmiss?: () => void,
    onSuccessfull?: () => void,
} & BoxProps;

const AddContent = (props: AddContentProps) => {
    const { t } = useTranslation();

    const quoteContentVerse = props.quoteContent && props.quoteContent.verse ? props.quoteContent.verse : props.editContent && props.editContent.activity && props.editContent.activity && props.editContent.activity.target_content_verse ? { id: props.editContent.activity.target_content_verse.id, verses: props.editContent.activity.target_content_verse.content?.poem?.verses } : null;

    let quoteContentRaw = props.quoteContent ? props.quoteContent.content : props.editContent && props.editContent.activity && props.editContent.activity ? props.editContent.activity.target_content : null;
    if (quoteContentVerse && quoteContentVerse.verses) {
        if (!quoteContentRaw && props.editContent?.activity?.target_content_verse)
            quoteContentRaw = props.editContent.activity.target_content_verse.content;
        if (quoteContentRaw && quoteContentRaw.poem)
            quoteContentRaw.poem.verses = quoteContentVerse.verses;
    }

    let poemText: string = '';
    let poemTypeString: PoemIconAlignmentType = 'rtl-poem';
    if (props.editContent && props.editContent.poem && props.editContent.poem.verses.length > 0) {
        const verses = props.editContent.poem.verses;
        switch (verses[0].position) {
            case 0:
                if (verses.length > 1 && verses[1].position == 1)
                    poemTypeString = 'rtl-poem';
                else
                    poemTypeString = 'rtl';
                break;
            case -2:
                if (verses.length > 1 && verses[1].position == -3)
                    poemTypeString = 'ltr-poem';
                else
                    poemTypeString = 'ltr';
                break;
            case -6:
                poemTypeString = 'ltr';
                break;
            default:
                poemTypeString = 'rtl';
        }

        verses.forEach((v: MkContentVerses) => {
            poemText += v.text + '\n';
        });
        poemText = poemText.trim();
    }

    const [poemType, setPoemType] = React.useState<PoemIconAlignmentType>(poemTypeString);
    const poemTypes: Array<PoemIconAlignmentType> = ["rtl-poem", "rtl", "ltr-poem", "ltr"];

    const [quoteContent, setQuoteContent] = React.useState<MkFullContent | null>(null);
    const [selectBookDialog, setSelectBookDialog] = React.useState<boolean>(false);
    const [currentBook, setCurrentBook] = React.useState<MkBook | null>(props.editContent ? props.editContent.book : null);
    const [title, setTitle] = React.useState<string>(props.editContent ? props.editContent.title : '');
    const [poem, setPoem] = React.useState<string>(poemText);

    const [visiblity, setVisiblity] = React.useState<number>(() => Number(props.editContent ? props.editContent.published : localStorage.getItem('content/add/visiblity') || 1));
    const [allowComment, setAllowComment] = React.useState<number>(() => Number(props.editContent ? props.editContent.allow_comment : localStorage.getItem('content/add/allow-comment') || 1));

    const [more, setMore] = React.useState<boolean>(false);
    const [anchorElMore, setAnchorElMore] = React.useState<null | HTMLElement>(null);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const visibilityTypes = [
        { value: 1, title: t('add-content.visibilities.public') },
        { value: 0, title: t('add-content.visibilities.private') },
    ]

    const dissmiss = () => {
        if (props.onDissmiss)
            props.onDissmiss()
    }

    const post = async () => {
        if (loadingRef.current)
            return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            let description: string = '';
            const verses: Array<MkAddContentVerses> = [];
            const poemText = poem.trim();
            if (poemText.length > 0) {
                poem.split('\n').forEach((text: string, index: number) => {
                    if (index < 2)
                        description += text + '\n';
                    let position: number = 0;
                    let master: number = 0;
                    switch (poemType) {
                        case 'ltr':
                            position = -6;
                            master = 1;
                            break;
                        case 'ltr-poem':
                            position = (index % 2 == 0 ? -2 : -3);
                            master = (index % 2 == 0 ? 1 : 0);
                            break;
                        case 'rtl':
                            position = 4;
                            master = 1;
                            break;
                        case 'rtl-poem':
                            position = (index % 2 == 0 ? 0 : 1);
                            master = (index % 2 == 0 ? 1 : 0);
                            break;
                    }

                    verses.push({
                        position: position,
                        text: text,
                        master: master,
                    });
                });
            }

            const req: MkEditContent | MkAddContent = {
                book_id: currentBook ? currentBook.id : null,
                cover: null,
                title: title,
                image: null,
                description: description.trim(),
                allow_comment: allowComment,
                poem: {
                    verses: verses,
                },
                published: visiblity,
                quote_content_id: quoteContent && !quoteContentVerse ? quoteContent.id : undefined,
                quote_content_verse_id: quoteContentVerse ? quoteContentVerse.id : undefined,
                type_id: quoteContent && poem.length == 0 ? 2 : 1,
            };

            localStorage.setItem('content/add/visiblity', visiblity.toString());
            localStorage.setItem('content/add/allow-comment', allowComment.toString());

            const result = props.editContent ? await MkContentServices.edit(props.editContent.id, req as MkEditContent) : await MkContentServices.insert(req as MkAddContent);
            await sleep(1000)
            if (result.status && result.result) {
                if (props.editContent)
                    globalShowInfoMessage(t('add-content.messages.successfully-edited'));
                else
                    globalShowInfoMessage(t('add-content.messages.successfully-added'));

                if (props.onSuccessfull)
                    props.onSuccessfull();
                return;
            }
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    React.useEffect(() => {
        if (!quoteContentRaw)
            return;

        if (!quoteContentRaw.poem && quoteContentRaw.description.length == 0 && quoteContentRaw.activity && quoteContentRaw.activity.target_content) {
            setQuoteContent(quoteContentRaw.activity.target_content);
        } else {
            setQuoteContent(quoteContentRaw);
        }
    }, [quoteContentRaw]);

    return <Box
        {...props}
        sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
    >
        <Collapse in={isLoading} timeout={300} sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', opacity: isLoading ? 1 : 0 }}>
                <CircularProgress sx={{ alignSelf: 'center', margin: '80px 0px 120px 0px' }} id="busy" />
            </Box>
        </Collapse>
        <Collapse in={!isLoading} timeout={300} sx={{ width: '100%' }}>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: isLoading ? 0 : 1,
                }}
            >
                {!quoteContent && <TextField
                    fullWidth
                    variant="standard"
                    placeholder={t('add-content.placeholder.poem-title')!}
                    value={title}
                    onChange={(v) => setTitle(v.target.value)}
                    slotProps={{
                        input: {
                            disableUnderline: true,
                            sx: {
                                fontSize: '16px',
                                fontWeight: 700,
                                textAlign: 'start',
                                alignItems: 'start',
                                "& .MuiInputBase-input": {
                                    padding: '0px 16px 10px 16px',
                                },
                            }
                        }
                    }}
                />}
                <PoemEditTextField
                    placeholder={(t('add-content.placeholder.poem') + (quoteContent ? ' (' + t('add-content.placeholder.quote-note') + ')' : ''))!}
                    minHeight='160px'
                    alignMode={poemType}
                    value={poem}
                    onValueChange={(v: string) => setPoem(v)}
                    sx={{
                        fontSize: '15px',
                        border: 'unset',
                        padding: '0px 16px',
                        maxHeight: '160px',
                        background: 'transparent',
                        '&:focus': {
                            border: 'unset',
                        }
                    }}
                />
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '0px 20px',
                        maxWidth: 'calc(100% - 40px)',
                    }}
                >
                    <PoemDetailsRow title={t('add-content.style')! + ':'}>
                        {poemTypes.map((type: PoemIconAlignmentType) => (
                            <PoemButton
                                type={type}
                                checked={poemType == type}
                                onClick={() => {
                                    setPoemType(type);
                                }}
                            />
                        ))}
                    </PoemDetailsRow>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '4px',
                            marginTop: '-8px'
                        }}
                    >
                        <PoemDetailsRow title={t('add-content.book')! + ':'} disableScroll sx={{ marginTop: '-4px' }}>
                            <Button onClick={() => setSelectBookDialog(true)}>
                                <Typography
                                    sx={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {currentBook ? currentBook.title : t('add-content.select-book.title')}
                                </Typography>
                            </Button>
                            {currentBook && <Button
                                variant='text'
                                disableElevation
                                sx={{
                                    minWidth: 'unset',
                                    borderRadius: '50px',
                                    height: '32px',
                                    width: '32px',
                                }}
                                onClick={() => setCurrentBook(null)}
                            >
                                <CancelOutlined sx={{ fontSize: '18px' }} />
                            </Button>}
                        </PoemDetailsRow>
                        <Button
                            onClick={(e) => {
                                setAnchorElMore(e.currentTarget)
                                setMore(true)
                            }}
                        >
                            {t('add-content.permissions')}
                        </Button>
                    </Box>
                </Box>
                {quoteContent &&
                    <Box
                        sx={{
                            width: '100%',
                            padding: '15px',
                            margin: '10px',
                            border: '1px solid ' + alpha(theme.palette.text.primary, 0.1),
                            borderRadius: globalBorderRadius,
                        }}
                    >
                        <SimplePoemCardCore
                            simple
                            contentItem={quoteContent}
                            highlight={props.quoteContentHighlight}
                            onReloadRequest={() => { }}
                        />
                    </Box>
                }
                <Button
                    disableElevation
                    disabled={(title.trim().length == 0 || poem.trim().length == 0) && quoteContent == null}
                    variant='outlined'
                    sx={{
                        width: 'calc(100% - 30px)',
                        margin: '0px 0px',
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '24px 20px',
                        gap: '10px',
                        // background: alpha(theme.palette.text.primary, 0.1),
                        // color: theme.palette.text.primary,
                    }}
                    onClick={post}
                >
                    <Check />
                    <Typography>{(props.editContent ? t('add-content.send-edit') : quoteContent && poem.trim().length == 0 ? t('add-content.send-reshare') : quoteContent ? t('add-content.send-quote') : t('add-content.send'))!}</Typography>
                </Button>
            </Box>
        </Collapse>

        <Menu
            open={more}
            onClose={() => setMore(false)}
            anchorEl={anchorElMore}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            <Box
                sx={{
                    padding: '10px',
                }}
            >
                <PoemDetailsRow title={t('add-content.visibility')! + ':'} disableScroll >
                    <Select
                        variant='standard'
                        value={visiblity}
                        sx={{
                            minWidth: '80px',
                            color: theme.palette.primary.main,
                        }}
                        onChange={(e) => {
                            setVisiblity(e.target.value);
                        }}
                    >
                        {visibilityTypes.map((v) => (
                            <MenuItem value={v.value}>{v.title}</MenuItem>
                        ))}
                    </Select>
                </PoemDetailsRow>
            </Box>
            <Divider />
            <Box
                sx={{
                    padding: '10px',
                }}
            >
                <PoemDetailsRow title={t('add-content.allow-comment')! + ':'} disableScroll  >
                    <Switch
                        checked={allowComment > 0 ? true : false}
                        onChange={(v) => setAllowComment(v.target.checked ? 1 : 0)}
                    />
                </PoemDetailsRow>
            </Box>
        </Menu>

        <MeikadeDrawer
            open={selectBookDialog}
            onClose={() => setSelectBookDialog(false)}
            anchor='bottom'
            title={t('add-content.select-book.title')!}
            slotProps={{
                paper: {
                    sx: {
                        width: '490px',
                        maxWidth: 'calc(100% - 60px)',
                    }
                }
            }}
        >
            <BooksList
                onSelected={(book: MkBookResult) => {
                    setCurrentBook(book);
                    setSelectBookDialog(false);
                }}
            />
        </MeikadeDrawer>
    </Box>
}

export default AddContent;