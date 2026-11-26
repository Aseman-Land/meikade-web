import { Box, BoxProps, Button, MenuItem, Select, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { SimplePoemContent } from '../../components/simplepoemcard';
import { SmartImage } from '../../components/smartimage';
import { baseUrl } from '../../utils/axios';
import { globalBorderRadius } from '../../utils/theme';

type Option = {
    key: string,
    title: string,
};

export const content_export_fonts: Array<Option> = [
    { key: 'v', title: "vazirmatn" },
    { key: 'y', title: "yekan" },
    { key: 'n', title: "nastaliq" },
];

export const content_export_colors: Array<Option> = [
    { key: 'm', title: "meikade" },
    { key: 'g', title: "gold" },
    { key: 'd', title: "dark" },
    { key: 'l', title: "light" },
    { key: 'n', title: "silver" },
    { key: 'b', title: "blue" },
    { key: 'c', title: "cyan" },
    { key: 't', title: "teal" },
    { key: 'p', title: "pink" },
    { key: 'v', title: "purple" },
    { key: 'z', title: "green" },
];

type ShareItemProps = {
    contentItem?: SimplePoemContent,
} & BoxProps;

const ShareItem = (props: ShareItemProps) => {
    const { t } = useTranslation();

    const [generatedLink, setGeneratedLink] = React.useState<string | null>(null);
    const [color, setColor] = React.useState<string>("l");
    const [background, setBackground] = React.useState<string>("m");
    const [font, setFont] = React.useState<string>("v");

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const reload = () => {
        if (!props.contentItem) {
            setGeneratedLink(null);
            return;
        }

        setGeneratedLink(`${baseUrl}/api/v4/content/${props.contentItem.id}/cover.png?o=${font}${background}${color}`)
    };

    const getText = (content: SimplePoemContent): string => {
        var text: string = '';
        if (!content || !content.poem)
            return text;

        content.poem.verses.forEach(v => {
            if (text.length > 0)
                text += '\n';
            text += v.text
        });

        return text;
    }

    const handleShare = (content: SimplePoemContent, text: string, link: string) => {
        const textToCopy: string = content.title + '\n' + (content.owner ? content.owner.firstname + ' ' + (content.owner.lastname ?? '') : '').trim() + (content.book ? '\n' + content.book.title : '') + '\n\n' + text;

        navigator.share({
            title: t('app.title') ?? 'Meikade',
            text: textToCopy,
            url: link,
        });
    }

    const share = () => {
        if (!props.contentItem)
            return;

        const link: string = props.contentItem ? window.location.origin + '/content/' + props.contentItem.id.toString() + `?o=${font}${background}${color}` : window.location.href;
        handleShare(props.contentItem, getText(props.contentItem), link);;
    }

    React.useEffect(() => {
        reload();
    }, [color, background, font, props.contentItem])

    return <Box
        {...props}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '18px 0px 0px 0px',
            gap: '10px',
        }}
    >
        <Typography variant='h6' sx={{ marginBottom: '10px' }}>{t('contents.share.title')}</Typography>
        {generatedLink &&
            <SmartImage
                src={generatedLink}
                sx={{
                    borderRadius: globalBorderRadius,
                }}
            />
        }
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'center',
                width: '100%',
                borderRadius: globalBorderRadius,
                padding: globalBorderRadius,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <Typography
                    sx={{
                        minWidth: '80px',
                    }}
                >
                    {t('contents.share.fonts.title')}
                </Typography>
                <Select
                    fullWidth
                    value={font}
                    onChange={(v) => {
                        const val = v.target.value!;
                        if (typeof val == 'string')
                            setFont(val);
                    }}
                >
                    {content_export_fonts.map((v: Option) => (
                        <MenuItem value={v.key}>{t('contents.share.fonts.' + v.title)}</MenuItem>
                    ))}
                </Select>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <Typography
                    sx={{
                        minWidth: '80px',
                    }}
                >
                    {t('contents.share.colors.color-title')}
                </Typography>
                <Select
                    fullWidth
                    value={background}
                    onChange={(v) => {
                        const val = v.target.value!;
                        if (typeof val == 'string')
                            setBackground(val);
                    }}
                >
                    {content_export_colors.map((v: Option) => (
                        <MenuItem value={v.key}>{t('contents.share.colors.' + v.title)}</MenuItem>
                    ))}
                </Select>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <Typography
                    sx={{
                        minWidth: '80px',
                    }}
                >
                    {t('contents.share.colors.background-title')}
                </Typography>
                <Select
                    fullWidth
                    value={color}
                    onChange={(v) => {
                        const val = v.target.value!;
                        if (typeof val == 'string')
                            setColor(val);
                    }}
                >
                    {content_export_colors.map((v: Option) => (
                        <MenuItem value={v.key}>{t('contents.share.colors.' + v.title)}</MenuItem>
                    ))}
                </Select>
            </Box>
        </Box>
        <Button
            variant='contained'
            disableElevation
            fullWidth
            onClick={share}
        >
            <Typography>
                {t('mainframe.content-menu.share')}
            </Typography>
        </Button>
    </Box>
}

export default ShareItem;
