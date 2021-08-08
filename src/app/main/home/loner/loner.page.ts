import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LonelyService } from 'src/app/lonely.service';
import { AngularFireStorage } from '@angular/fire/storage'
import { AlertController } from '@ionic/angular';
import { MessageService } from 'src/app/message.service';
import { Conversation } from '../../messages/conversation';
import { AccountService } from 'src/app/account.service';
import { AngularFireAuth } from '@angular/fire/auth';

declare var google: any;

@Component({
  selector: 'app-loner',
  templateUrl: './loner.page.html',
  styleUrls: ['./loner.page.scss'],
})
export class LonerPage implements OnInit {
  // variables to store user's account information
  userId: string;
  username: string = "username";
  tagline: string = "tagline";
  description: string = "description";
  firstInterest: string = "firstInterest";
  secondInterest: string = "secondInteest";
  thirdInterest: string = "thirdInterest";

  constructor(private route: ActivatedRoute, private lonelyService: LonelyService,
    private fireStorage: AngularFireStorage, private alertController: AlertController,
    private messageService: MessageService, private accountService: AccountService,
    private fireAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    // get parameters in the url
    this.route.params.subscribe(params => {
      // obtain userId in parameters
      this.userId = params['id'];
      // display user profile image
      this.fireStorage.ref("Images/" + this.userId + '.png').getDownloadURL().subscribe((url) => {
        document.getElementById('lonerImage').setAttribute("src", url);
      })

      // get specific lonely user
      this.lonelyService.getLonelyUser(this.userId).subscribe((lonely) => {
        // obtain data and store it in the following variables
        this.username = lonely.data()["username"];
        this.tagline = lonely.data()["tagline"];
        this.description = lonely.data()["description"];
        this.firstInterest = lonely.data()["firstInterest"];
        this.secondInterest = lonely.data()["secondInterest"];
        this.thirdInterest = lonely.data()["thirdInterest"];
        // display the location of the lonely user
        this.showMap(lonely.data()["latitude"], lonely.data()["longitude"]);
      })
    });
  }

  // show the Google Maps used in the site
  showMap(latitude: number, longitude: number) {
    // location where the map will zoom onto
    const location = new google.maps.LatLng(latitude, longitude);
    // options to configure the display of the map
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    // set the map onto a HTML element based on the options
    const map = new google.maps.Map(document.getElementById("mapLoner"), options);
    // creae a marker on the specified location
    new google.maps.Marker({
      position: location,
      map,
      title: "Here you are!",
    });
  }

  viewUser() {
    // create an alert overlay
    const alert = this.alertController.create({
      // displays user's username
      header: this.username,
      // displays user's tagline
      subHeader: this.tagline,
      message: `<img id="lonerProfile">`,
      buttons: [
        // cancel operation
        { text: 'Cancel', role: 'cancel' },
        // view user's profile
        { text: 'Profile', handler: (alertData) => {
          this.router.navigate(['main/profile/' + this.userId]);
        }},
        // message the user
        {
          text: 'Message',
          handler: (alertData) => { //takes the data
            // add user as a possible user to message to
            this.addConversation();
          }
        }
      ]
      // present the alrt
    }).then(alert => alert.present());
    // display user's profile image after alert intializes
    this.fireStorage.ref("Images/" + this.userId + '.png').getDownloadURL().subscribe((url) => {
      document.getElementById('lonerProfile').setAttribute("src", url);
    })
  }
  // add user as a possible user to message to
  addConversation(){
    // get current user
    this.fireAuth.currentUser.then((user) =>{
      // use current user's uid as a parameter to get the account
      this.accountService.getAccount(user.uid).subscribe((account) =>{
        // use the account's username and add a new Conversation containing the other user's information under it
        this.messageService.addConversation(account.data()["username"], new Conversation(this.userId, this.username));
        // use the other user's username, and add a new Conversation containing the current user's information under it
        this.messageService.addConversation(this.username, new Conversation(user.uid, account.data()["username"]));
      });
    }); 
  }
}

