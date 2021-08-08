import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase'
import { AccountService } from './account.service';
import { Platform } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})

// Authentication service deals with Firebase authentication
export class AuthService {

  constructor(private fireAuth: AngularFireAuth, private router: Router,
    private accountService: AccountService, private platform: Platform,
    private facebook: Facebook, private googlePlus: GooglePlus) { }

  // creates a new user under Firebase Authentication
  register(email, password) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  // authenticates a user under Firebase Authentication
  login(email, password) {
    return this.fireAuth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          console.log("Login");
          this.router.navigate(['/main']);
        }
      }).catch((error) => {
        console.log(error);
      })
  }

  // signs a user out under Firebase Authentication
  logout() {
    return this.fireAuth.signOut().then(() => {
    });
  }

  // sign up with Google 
  signUpGoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider(), '/sign-up/profile', "Google");
  }

  // sign up with Facebook
  signUpFacebookAuth() {
    return this.AuthLogin(new firebase.auth.FacebookAuthProvider(), '/sign-up/profile', "Facebook")
  }

  // login with Google
  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider(), '/main', "Google");
  }

  // login with Facebook
  FacebookAuth() {
    return this.AuthLogin(new firebase.auth.FacebookAuthProvider(), '/main', "Facebook");
  }

  // Auth logic to run the auth providers ( Google, Facebook, etc.)
  AuthLogin(provider, destination, platform) {
    // if the user logs in through Facebook on Mobile
    if (platform === 'Facebook' && this.platform.is('mobile')) {
      console.log("on mobile and facebook");
      this.facebookSignIn(destination);
      //parse results
      return;
    }
    // if the user logs in through Google on Mobile
    if(platform === 'Google' && this.platform.is('mobile')){
      console.log("on mobile and Google");
      this.googleSignIn(destination);
      return;
    }
    // shows a popup for either Google or Facebook authentication depending on the user
    return this.fireAuth.signInWithPopup(provider)
      .then((result) => {
        //parse results
        this.parseLogin(result, destination);
      }).catch((error) => {
        console.log(error)
      })

  }

  // parse and handles login information
  parseLogin(result: any, destination: string) {
    console.log(result);
    console.log('You have been successfully logged in!');
    // if user is registering a new account
    if (destination === '/sign-up/profile') {
      console.log("register");
      this.fireAuth.currentUser.then((user) => {
        // register user's new account
        this.accountService.altRegister(user.uid, result.user.displayName, result.user.email);
      });
    }
    // navigate to user's allocated route depending on whether user is registering or logging in
    this.router.navigate([destination]);
  }
  // logs in a user on Facebook through mobile
  facebookSignIn(destination: string) {
    console.log("init");
    // obtain user's email and public profile information
    const FACEBOOK_PERMISSIONS = ['public_profile', 'email'];
    // check whether user is logged in
    this.facebook.getLoginStatus().then((status: FacebookLoginResponse) => {
      // if not logged in, allow the user to login to their Facebook Account
      if (status.status !='connected') {
        this.facebook.login(FACEBOOK_PERMISSIONS).then((response: FacebookLoginResponse) => {
          console.log("Hello")
          console.log(response.authResponse.accessToken);
          // get the access token from the response and turn it into a credential
          const credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
          // authenticate that credential through Firebase
          this.firebaseCredentialAuth(credential, destination);
        }).catch((error) => {
          console.log(error);
        });
      } else {
        // get the access token from the response and turn it into a credential
        const credential = firebase.auth.FacebookAuthProvider.credential(status.authResponse.accessToken);
        // authenticate that credential through Firebase
        this.firebaseCredentialAuth(credential, destination);
      }
    });
  }

  // Google Sign In on mobile
  googleSignIn(destination: string){
    // takes webClientId to login onto Google
    this.googlePlus.login({'webClientId': '830187853482-616f6suu20l667vtmk4cdrh1gnro9prq.apps.googleusercontent.com'}).then(response => {
      console.log(response);
      // get the id token from the response and turn it into a credential
      const credential = firebase.auth.GoogleAuthProvider.credential(response.idToken);
      // authenticate that credential through Firebase
      this.firebaseCredentialAuth(credential, destination);
    }).catch(error =>{
      console.log(error);
    })
  }

  // authenticates credentials through Firebase
  firebaseCredentialAuth(credential: firebase.auth.OAuthCredential, destination: string){
    // Firebase sign in with credential
    this.fireAuth.signInWithCredential(credential).then((response) => {
      // parse results
      this.parseLogin(response, destination);
    })
  }
}

