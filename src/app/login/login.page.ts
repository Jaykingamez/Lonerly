import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private authService: AuthService) {
    // creates form for logging in
    this.loginForm = formBuilder.group({
      'username': '',
      'password': '',
    });
  }

  ngOnInit() {
  }

  login() {
    // gets all documents with matching usernames
    this.accountService.getEmailPromise(this.loginForm.value.username).then((snapshot) => {
      console.log(snapshot);
      // if there is no matching username, log it in the console 
      if (snapshot.empty) {
        console.log("noMatchingUsername");
      } else {
      // if there is matching usernames, iterate through them and authenticate with the password
      // to find the account to sign into
        snapshot.forEach(snap =>{
          this.authService.login(snap.data()["emailAddress"], this.loginForm.value.password);
        })
      }
    });
  }

}
