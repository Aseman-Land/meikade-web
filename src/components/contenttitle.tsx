import { Diamond } from "@mui/icons-material";
import { Box, Typography, TypographyProps } from "@mui/material";
import { MkUserWithBooks } from "../models/book";
import { MkContent, MkFullContent } from "../models/content";
import { MkUser } from "../models/user";
import { theme } from "../utils/theme";

type ContentTitleProps = {
    contentItem: MkContent | MkFullContent,
    user?: MkUser | MkUserWithBooks | null,
    customText?: string,
    fontSize?: string | number,
    fontWeight?: string | number,
    shadow?: boolean,
} & TypographyProps;

const ContentTitle = (props: ContentTitleProps) => {
    const content = props.contentItem;
    const user = props.user;
    const shadowColor = content.treasure < 3 ? 'white' : 'black';

    if (content.title.trim().length == 0)
        return <></>;

    return <Box
        {...props}
        sx={{
            ...props.sx,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '3px',
        }}
    >
        <Typography
            sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: 'break-all',
                fontSize: props.fontSize ? props.fontSize : 'unset',
                fontWeight: props.fontWeight ? props.fontWeight : 'unset',
            }}
        >
            {props.customText ?? (content.title).trim()}
        </Typography>
        {content.treasure > 0 && (!user || user.verified_level < content.treasure) &&
            <Diamond
                sx={{
                    color: content.treasure == 3 ? '#D4AF37' : theme.palette.primary.main,
                    alignItems: 'center',
                    fontSize: '14px',
                    filter: props.shadow ? `
                        drop-shadow(1px 0 0 ${shadowColor})
                        drop-shadow(-1px 0 0 ${shadowColor})
                        drop-shadow(0 1px 0 ${shadowColor})
                        drop-shadow(0 -1px 0 ${shadowColor})
                    ` : 'unset',
                }}
            />}
    </Box>
}

export default ContentTitle;
