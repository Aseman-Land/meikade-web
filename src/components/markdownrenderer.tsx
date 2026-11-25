import { Box, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
    content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => <Typography variant="h4" component="h1" gutterBottom>{children}</Typography>,
                h2: ({ children }) => <Typography variant="h5" component="h2" gutterBottom>{children}</Typography>,
                h3: ({ children }) => <Typography variant="h6" component="h3" gutterBottom>{children}</Typography>,

                p: ({ children }) => <Typography variant="body1">{children}</Typography>,

                a: ({ href, children }) => (
                    <Link href={href} target="_blank" rel="noopener noreferrer" color="primary">
                        {children}
                    </Link>
                ),

                ul: ({ children }) => <Box component="ul" sx={{ pl: 3 }}>{children}</Box>,
                ol: ({ children }) => <Box component="ol" sx={{ pl: 3 }}>{children}</Box>,
                li: ({ children }) => <Typography component="li" variant="body1">{children}</Typography>,

                table: ({ children }) => (
                    <TableContainer component={Paper} sx={{ my: 2 }}>
                        <Table size="small">{children}</Table>
                    </TableContainer>
                ),
                thead: ({ children }) => <TableHead>{children}</TableHead>,
                tbody: ({ children }) => <TableBody>{children}</TableBody>,
                tr: ({ children }) => <TableRow>{children}</TableRow>,
                th: ({ children }) => <TableCell sx={{ fontWeight: 'bold' }}>{children}</TableCell>,
                td: ({ children }) => <TableCell>{children}</TableCell>,
            }}
        >
            {content}
        </ReactMarkdown>
    );
};