import { Typography, TypographyProps } from "@mui/material";

type DatePoemCardProps = {
    createdAt: string | Date;
} & TypographyProps;

export default function DatePoemCard(props: DatePoemCardProps) {
    const createdAt = props.createdAt

    function getRelativeTime(dateString: string | Date) {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMs = now.getTime() - date.getTime();

        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInMinutes < 1) return "now";
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        if (diffInHours < 24) return `${diffInHours}h`;
        if (diffInDays < 7) return `${diffInDays}d`;
        if (diffInWeeks < 4) return `${diffInWeeks}w`;

        return date.toLocaleDateString("fa-IR");
    }

    return (
        <Typography
            {...props}
            sx={{
                fontSize: 12,
                opacity: 0.7,
                ...props.sx,
            }}
        >
            {getRelativeTime(createdAt)}
        </Typography>
    )
}