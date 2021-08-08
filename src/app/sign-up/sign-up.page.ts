import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Account } from '../account';
import { AccountService } from '../account.service';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  signUpForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private accountService: AccountService,
    private authService: AuthService, private router: Router, private fireAuth: AngularFireAuth) {
    // creates form to handle sign up information
    this.signUpForm = formBuilder.group({
      'username': '',
      'password': '',
      'firstName': '',
      'lastName': '',
      'gender': '',
      'mobileNumber': '',
      'emailAddress': ''
    });
  }

  ngOnInit() {
  }

  // once the user chooses to sign up
  signUp() {
    // add the new user under Firebase Authentication
    this.authService.register(this.signUpForm.value.emailAddress, this.signUpForm.value.password).then(() => {
      this.fireAuth.currentUser.then((user) => {
        // create a new object called Account storing all of the new user's information
        let accountClass = new Account(this.signUpForm.value.username, this.signUpForm.value.firstName, this.signUpForm.value.lastName,
          this.signUpForm.value.gender, this.signUpForm.value.mobileNumber, this.signUpForm.value.emailAddress);
        // then get the new user's uid and use it with accountClass for registration
        this.accountService.register(user.uid, accountClass).then(() => {
          // naviagte to another page to obtain more information from user
          this.router.navigate(['/sign-up/profile']);
        }).catch((error) => {
          // if there are any errors, output it
          console.log(error);
        });
      });
    });
  }



}
