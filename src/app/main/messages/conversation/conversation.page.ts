import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage'
import { MessageService } from 'src/app/message.service';
import { Message } from '../message';
import { AngularFireAuth } from '@angular/fire/auth';
import { AccountService } from 'src/app/account.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit {
  // queryList to check if there are any changes to a specific html element
  @ViewChildren('conversation') conversation: QueryList<any>;
  // unique identifier of current conversation
  conversationId: string;
  // variable that store all the messages in a conversation
  messages: any = [];
  // ngModel variable that stores the new message typed by the user
  newMessage: string = '';

  constructor(private route: ActivatedRoute, private fireStorage: AngularFireStorage,
    private messageService: MessageService, private fireAuth: AngularFireAuth, private accountService: AccountService) { }

  ngOnInit() {
    // get parameters in the url
    this.route.params.subscribe(params => {
      // obtain conversationId in parameters
      this.conversationId = params['id'];
      // get all messages using the conversationId
      this.messageService.getMessages(this.conversationId).subscribe(messages => {
        // set received messages to messages variable
        this.messages = messages;
      });
    });
  }
  // after html elements are initialized
  ngAfterViewInit() {
    // if there are any changes to queryList
    this.conversation.changes.subscribe(() => {
      // parse all messages 
      this.parseMesage();
    })
  }
  // parse messages for display
  parseMesage() {
    // iterate through all the messages
    for(let i=0; i < this.messages.length; i++){
      // display the message timestamp
      document.getElementById('timestamp' + i).innerHTML = new Date(this.messages[i]["messageTime"]).toString();
      // display the profile image of the sender of the message
      this.fireStorage.ref("Images/" + this.messages[i]["uid"] + '.png').getDownloadURL().subscribe((url) => {
        document.getElementById('messageProfile' + i).setAttribute("src", url);
      });
    }
  }
  // send a new message
  addMessage(){
    // get current user
    this.fireAuth.currentUser.then((user) =>{
      // get current user account using their uid
      this.accountService.getAccount(user.uid).subscribe((account) =>{
        //sebd the message
        this.messageService.addMessage(this.conversationId, new Message(this.newMessage, new Date().toString(),
        account.data()["username"], user.uid));
        // clear the message field for the user to retype a new message
        this.newMessage = '';
      });
    });
  }
}
