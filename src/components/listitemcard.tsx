import { Box, ButtonBase, ButtonBaseProps, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { MkFullListResult } from "../models/list";
import { theme } from "../utils/theme";
import UserFullname from "./userfullname";

export type ListItemCardProps = {
    list: MkFullListResult,
    disableUser?: boolean,
} & ButtonBaseProps;

const ListItemCard = (props: ListItemCardProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const list = props.list;
    const count = list.list_items_count;

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
            padding: '0px 20px',
        }}
        component={RouterLink}
        to={`/list/${list.id}`}
    >
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
                {list.title}
            </Typography>
            {!props.disableUser && <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4px',
                }}
            >
                <Typography sx={{
                    fontSize: { xs: '12px', sm: '13px' },
                    fontWeight: 600,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    display: 'flex',
                    alignItems: 'center'
                }}
                >
                    {t('list-card.by')}
                </Typography>
                {list.owner && <UserFullname
                    user={list.owner}
                    fontSize={'13px'}
                    sx={{
                        color: theme.palette.text.secondary,
                    }}
                />}
            </Box>}
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
                    {t('list-card.count').replaceAll("%1", (count >= 1_000_000
                        ? `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
                        : count >= 1_000
                            ? `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}K`
                            : count).toString())}
                </Typography>
            </Box>
        </Box>
    </ButtonBase>
}
export default ListItemCard;