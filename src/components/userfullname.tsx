import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Typography, TypographyProps } from "@mui/material";
import { MkUserWithBooks } from "../models/book";
import { MkUser } from "../models/user";
import { theme } from "../utils/theme";

type UserFullnameProps = {
    user: MkUser | MkUserWithBooks,
    customText?: string,
    fontSize?: string | number,
    fontWeight?: string | number,
    shadow?: boolean,
} & TypographyProps;

const UserFullname = (props: UserFullnameProps) => {
    const user = props.user
    const shadowColor = user.verified_level == 2 ? 'white' : 'black';

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
            {props.customText ?? (user.firstname + ' ' + (user.lastname ?? '')).trim()}
        </Typography>
        {user.verified_level > 0 &&
            <VerifiedIcon
                sx={{
                    color: user.verified_level == 3 ? '#D4AF37' : theme.palette.primary.main,
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

export default UserFullname;
