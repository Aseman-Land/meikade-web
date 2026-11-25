import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, ButtonBase, ButtonBaseProps, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { MkBookResult } from '../models/book';
import { theme } from "../utils/theme";
import AvatarPoemCard from "./avatarpoemcard";
import UserFullname from './userfullname';

export type BookPoemCardProps = {
    book: MkBookResult
} & ButtonBaseProps;

const BookPoemCard = (props: BookPoemCardProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const book = props.book;
    const view = book.total_views ?? 0;

    return <ButtonBase
        sx={{
            ...props.sx,
            display: 'flex',
            width: '100%',
            maxWidth: '100%',
            height: '80px',
            justifyContent: 'start',
            flexDirection: 'row',
            textAlign: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.background.paper,
            gap: '10px',
            borderRadius: '18px',
            boxSizing: 'border-box',
            cursor: 'pointer',
            color: theme.palette.text.primary,
            padding: '0px 10px'
        }}
        component={RouterLink}
        to={`/book/${book.id}`}
    >
        {book.author && <AvatarPoemCard avatar={book.author.avatar} size={45} innerSize={50} outerSize={55} />}
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minWidth: 0,
                textAlign: 'start',
            }}
        >
            <Typography sx={{
                fontSize: { xs: '14px', sm: '15px' },
                fontWeight: 600,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                display: 'flex',
                alignItems: 'center'
            }}
            >
                {book.title}
            </Typography>
            {book.author && <UserFullname
                user={book.author}
                fontSize={'13px'}
                sx={{
                    color: theme.palette.text.secondary,
                }}
            />}
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                gap: '2px'
            }}
            >
                <Typography sx={{
                    display: 'flex',
                    fontSize: '12px',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                >
                    {(view >= 1_000_000
                        ? `${(view / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
                        : view >= 1_000
                            ? `${(view / 1_000).toFixed(1).replace(/\.0$/, '')}K`
                            : view)}
                </Typography>
                <VisibilityOutlinedIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
            </Box>
        </Box>
    </ButtonBase>
}
export default BookPoemCard;