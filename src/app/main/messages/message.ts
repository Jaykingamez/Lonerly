// Message class that contains all the information about a message
export class Message{
    // content of the message
    private messageText: string;
    // timestamp of the message
    private messageTime: string;
    // username of user who sent the message
    private messageUser: string;
    // unique identifier of user who sent the message
    private uid: string;

    // constructor to create the message, setting parameters to the variables
    constructor(messageText: string, messageTime: string, messageUser: string, uid: string){
        this.messageText = messageText;
        this.messageTime = messageTime;
        this.messageUser = messageUser;
        this.uid = uid;
    }
}