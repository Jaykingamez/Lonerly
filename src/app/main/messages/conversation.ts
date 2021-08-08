// conversation class that contains all the information about a conversation
export class Conversation{
    // other user's unique identifier
    private uid: string;
    // other user's username
    private username: string;
    
    // constructor to create the conversation, setting parameters to the variables
    constructor(uid: string, username: string){
        this.uid = uid; 
        this.username = username;
    }
    // get other user's uid
    public getUid(): string{
        return this.uid;
    }
    // get other user's username
    public getUsername(): string{
        return this.username;
    }
}