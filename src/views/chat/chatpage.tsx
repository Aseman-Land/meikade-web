import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Send } from '@mui/icons-material';
import { Box, Button, Card, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import MeikadeAppBar from '../../components/meikadeappbar';
import { useChatStream } from '../../utils/chatstream';

import { MkChat } from '../../models/chat';
import { MkCreateMessage, MkFullChatMessage } from '../../models/chatmessage';
import { MkUser } from '../../models/user';
import { MkChatServices } from '../../services/chat';
import * as UserGlobal from "../../services/user-global";

type ChatMessage = {
    sent: boolean,
} & MkFullChatMessage;

const ChatPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { socket, latestMessage, connecting } = useChatStream();
    const params = useParams();

    const user_id: string = params.user_id!;

    const loadingRef = React.useRef<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [messages, setMessages] = React.useState<Array<ChatMessage>>();
    const [messagesMap, setMessagesMap] = React.useState<Map<number, ChatMessage>>();
    const [text, setText] = React.useState<string>('');


    const reload = async () => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            const result = await MkChatServices.getMessages(user_id.toString(), { limit: 100, offset: null });
            if (!result.status) {
                // TODO: handle error
            }

            const messages: Array<ChatMessage> = new Array<ChatMessage>();
            if (result.status && result.result) {
                result.result.forEach(msg => {
                    const new_msg: ChatMessage = {
                        ...msg,
                        sent: true,
                    };

                    messages.push(new_msg);
                });
            }

            pushMessages(messages);
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    };

    const pushMessages = (messages: Array<ChatMessage>) => {
        const map = new Map<number, ChatMessage>(messagesMap);
        messages.forEach((msg: ChatMessage) => {
            map.set(msg.order_timestamp, msg);
        });

        const values = [...map.entries()]
            .sort((a, b) => b[0] - a[0])
            .map(([_, value]) => value);

        setMessagesMap(map);
        setMessages(values);
    }

    const deleteMessage = (message_id: number) => {
        if (!messagesMap)
            return;

        const map = new Map(
            Array.from(messagesMap.entries())
                .filter(([_, msg]) => msg.id !== message_id)
        );

        const values = [...map.entries()]
            .sort((a, b) => b[0] - a[0])
            .map(([_, value]) => value);


        setMessagesMap(map);
        setMessages(values);
    }

    const send = async () => {
        try {
            const msg: MkCreateMessage = {
                message: text,
                order_timestamp: Date.now() * 1000,
                reply_to_id: null,
                fwd_id: null,
            };

            const message: ChatMessage = {
                sent: false,
                chat: {} as MkChat,
                chat_id: 0,
                fwd: null,
                fwd_from: null,
                fwd_id: null,
                has_media: 0,
                id: 0,
                message: msg.message,
                order_timestamp: msg.order_timestamp,
                out: true,
                reply_to: null,
                reply_to_id: null,
                reply_to_user: null,
                updated_at: new Date,
                created_at: new Date,
                user: (UserGlobal.user ?? {}) as MkUser,
                user_id: UserGlobal.userId,
            };
            pushMessages([message]);

            const result = await MkChatServices.sendMessages(user_id, msg);

            if (!result.status) {
                // TODO: handle error
            } else {
            }
        } catch {
        }
    }

    React.useEffect(() => {
        reload()
    }, [user_id]);

    React.useEffect(() => {
        if (!connecting)
            reload()
    }, [connecting]);

    React.useEffect(() => {
        if (!latestMessage)
            return;

        const data = JSON.parse(latestMessage);
        if (data.new_message) {
            const msg = {
                ...data.new_message,
                sent: true,
            }
            pushMessages([msg]);
        }
        if (data.edit_message) {
            const msg = {
                ...data.edit_message,
                sent: true,
            }
            pushMessages([msg]);
        }
        if (data.delete_message_id)
            deleteMessage(data.delete_message_id);
    }, [latestMessage]);

    return <Container maxWidth="sm">
        <MeikadeAppBar enableBackButton />
        <Box
            sx={{
                marginTop: '100px',
                paddingBottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}
        >
            {connecting && <Typography>{t('chats.connecting')}</Typography>}
            {isLoading && <CircularProgress sx={{ position: 'absolute', 'top': '320px' }} id="busy" />}
            {!isLoading && <>
                {messages?.map((msg: ChatMessage) => (
                    <Card sx={{ width: 'fit-content', padding: '10px', alignSelf: msg.out ? 'start' : 'end' }}>
                        <Typography>{msg.message}</Typography>
                        <Typography>{msg.sent ? 'sent' : 'sending'}</Typography>
                    </Card>
                ))}
            </>}
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                position: 'fixed',
                bottom: '10px',
                width: '100%',
                maxWidth: 'sm',
                alignItems: 'center',
            }}
        >
            <TextField
                fullWidth
                placeholder={t('chats.placeholder')!}
                value={text}
                onChange={(v) => setText(v.target.value)}
            />
            <Button
                disabled={text.trim().length == 0}
                onClick={send}
            >
                <Send />
            </Button>
        </Box>
    </Container>
}

export default ChatPage;