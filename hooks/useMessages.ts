import { getMessages } from '@/lib/firebase';
import React from 'react';

function useMessages(roomId: string) {
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {
        const unsubscribe = getMessages(roomId, setMessages);

        return unsubscribe;
    }, [roomId]);

    return messages;
}

export { useMessages };
