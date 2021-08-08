import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MessageService } from 'src/app/message.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AccountService } from 'src/app/account.service';
import { Conversation } from './conversation';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  // queryList to check if there are any changes to a specific html element
  @ViewChildren('conversations') conversations: QueryList<any>;
  // conversationList to store all conversations
  conversationList: Conversation[] = [];
  // current user's uid
  currentUid: string;

  constructor(private messageService: MessageService, private accountService: AccountService,
    private fireAuth: AngularFireAuth, private fireStorage: AngularFireStorage) { }

  ngOnInit() {
    // get current user
    this.fireAuth.currentUser.then((user) => {
      // parse user's unique identifier from response
      this.currentUid = user.uid;
      // get account user user's uid
      this.accountService.getAccount(user.uid).subscribe((account) => {
        // get all conversations associated with the account's username
        this.messageService.getConversations(account.data()["username"]).subscribe((conversations) => {
          // set conversationList variable to the returned conversations
          this.conversationList = conversations;
        });
      });
    });
  }
  // after all html elements initialize
  ngAfterViewInit() {
    // if there are any changes in the this.conversations html
    this.conversations.changes.subscribe(() =>{
      // parse all conversations
      this.parseConversations();
    })
  }
  // parse conversations for displays
  parseConversations() {
    // iterate through every element in conversationList
    for (let i = 0; i < this.conversationList.length; i++) {
      // set the message's message and timestamp in the display
      this.setMessageAndTimestamp(i ,this.conversationList[i]["uid"]);
      // display the user's profile image
      this.fireStorage.ref("Images/" + this.conversationList[i]["uid"] + '.png').getDownloadURL().subscribe((url) => {
        document.getElementById('messageImage' + i).setAttribute("src", url);
      });
    }
  }
  // set the message's message and timestamp in the display
  setMessageAndTimestamp(number: number, otherUid: string, ){
    // get all messages using the result from compareUids()
    this.messageService.getMessages(this.compareUids(this.currentUid, otherUid)).subscribe((messages) =>{
      console.log(messages);
      // display the content of the last message sent in the conversation
      document.getElementById('lastMessage' + number).innerHTML = messages.slice(-1)[0]["messageText"];
      // display the timestamp of the last message sent in the conversation
      document.getElementById('timestamp' + number).innerHTML = new Date(messages.slice(-1)[0]["messageTime"]).toString();
    });
  }
  // returns a string combining both uids in a unique order to serve as a unique uid for a specific conversation
  compareUids(firstUid: string, secondUid: string): string{
    // localeCompare returns a number indicating whether the firstUid comes before or after secondUid
    if(firstUid.localeCompare(secondUid) < 0){
      // if it is less than 0, firstUid comes before secondUid
      return firstUid + '_' + secondUid;
    }else{
      // if it is more than 0, secondUid comes before firstUid
      return secondUid + '_' + firstUid;
    }

  }



}
