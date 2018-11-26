export default interface ConnectionInterface {

    connect(): void;
    sendAnnouncement(announcement: {message: string, onlySendOnce: boolean}): void;

}
