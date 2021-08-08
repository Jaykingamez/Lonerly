import { Injectable } from '@angular/core';

import {AngularFireDatabase} from '@angular/fire/database';
import { Conversation } from './main/messages/conversation';
import { Message } from './main/messages/message';

@Injectable({
  providedIn: 'root'
})

// Handles Real-Time messaging between users
export class MessageService {

  //dependency injects Angular's controller of Firebase RealTime Database
  constructor(private realTime: AngularFireDatabase) { }

  // get's all conversations that a user with a certain username with all other users
  getConversations(username: string){
    return this.realTime.list<Conversation>("Conversation/" + username).valueChanges();
  }

  // add's another conversation with a user
  addConversation(username: string, conversation: Conversation){
    return this.realTime.list<Conversation>("Conversation/" + username).set(conversation.getUsername(), conversation);
  }

  // gets all messages in a conversation
  getMessages(conversationName: string){
    return this.realTime.list<Message>("Message/" + conversationName).valueChanges();
  }

  // add a new messaging into the conversation
  addMessage(conversationName: string, message: Message){
    return this.realTime.list<Message>("Message/" + conversationName).push(message);
  }
}
