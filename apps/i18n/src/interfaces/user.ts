export interface IUser {
    inbox: string;
    allMessages: string;
    unreadMessages: string;
    readMessages: string;
    refreshMessages: string;
    reply: string;
    send: string;
    sendMessage: string;
    sendMessagePlaceholder: string;
    delete: string;
    markAsRead: string;
    markAsUnread: string;
    selectMessages: string;
    noMessagesDescription: string;
    loadingMessage: string;
    typeYourReply: string;
    pressCtrlCmdEnterToSend: string;
    sending: string;
    messages: {
        pleaseFillInAllFields: string;
        messageSentSuccessfully: string;
        failedToSendMessage: string;
    };
    messageSubjectPlaceholder: string;
    enterMessageSubjectPlaceholder: string;
    typeYourMessageToAdminPlaceholder: string;
    message: string;
}