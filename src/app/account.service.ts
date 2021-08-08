import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Account } from './account';

@Injectable({
  providedIn: 'root'
})

// Account Service deals with all CRUD operations relating to account information in Firebase
export class AccountService {

  // dependency injection of AngularFireStore to do CRUD operations
  constructor(private firestore: AngularFirestore) { }

  // get the document where the relevant username is stored
  // to obtain the email to perform authentication in Firebase
  getEmailPromise(username) {
    return this.firestore.collection("Accounts").ref.where("username", "==", username).get();
  }

  // get the document with the relevant userId where the account information is stored
  getAccount(userId: string){
    return this.firestore.collection("Accounts").doc(userId).get();
  }

  // store newly created account information using the newly created userId and
  // Account class object parsed in as parameters
  register(userId:string, accountClass: Account) {
    return this.firestore.collection("Accounts").doc(userId).set({
      username: accountClass.username,
      firstName: accountClass.firstName,
      lastName: accountClass.lastName,
      gender: accountClass.gender,
      mobileNumber: accountClass.mobileNumber,
      emailAddress: accountClass.emailAddress
    });
  }

  // handles alternative registration methods done through Google or Facebook
  altRegister(userId: string, username: string, email: string){
    return this.firestore.collection("Accounts").doc(userId).set({
      username: username,
      emailAddress: email
    })
  }

  // updates description and tagline in the account document
  addDescriptionaAndTagline(userId: string, description: string, tagline: string){
    return this.firestore.collection("Accounts").doc(userId).update({
      description: description,
      tagline: tagline 
    });
  }

  // updates interests in the account document
  addInterests(userId: string, firstInterest: string, secondInterest: string, thirdInterest: string){
    return this.firestore.collection("Accounts").doc(userId).update({
      firstInterest: firstInterest,
      secondInterest: secondInterest,
      thirdInterest: thirdInterest 
    });
  }

}
