import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Lonely } from './lonely';

@Injectable({
  providedIn: 'root'
})

// Adds new users who made a post looking for companions
export class LonelyService {

  constructor(private firestore: AngularFirestore) { }

  // get all users who made such a post from the "Lonely" collection
  getLonely(){
    return this.firestore.collection("Lonely").ref.orderBy("timestamp", "desc").limit(10).get();
  }

  // get a certain user based on the userId from the "Lonely" collection
  getLonelyUser(userId: string){
    return this.firestore.collection("Lonely").doc(userId).get();
  }

  // add a new user based on their userId as well as the Lonely class parameter
  // into the "Lonely" collection
  uploadLonely(userId: string, lonely: Lonely){
    return this.firestore.collection("Lonely").doc(userId).set({
      username: lonely.username,
      tagline: lonely.tagline,
      description: lonely.description,
      firstInterest: lonely.firstInterest,
      secondInterest: lonely.secondInterest,
      thirdInterest: lonely.thirdInterest,
      latitude: lonely.latitude,
      longitude: lonely.longitude,
      timestamp: lonely.timestamp
    });
  }
}
