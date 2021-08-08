import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/account.service';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage'
import { Lonely } from 'src/app/lonely';
import { LonelyService } from 'src/app/lonely.service';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-lonely',
  templateUrl: './lonely.page.html',
  styleUrls: ['./lonely.page.scss'],
})
export class LonelyPage implements OnInit {

  // variables to store user's account information
  userId: string;
  username: string = "username";
  tagline: string = "tagline";
  description: string;
  firstInterest: string = "firstInterest";
  secondInterest: string = "secondInteest";
  thirdInterest: string = "thirdInterest";

  latitude: any;
  longitude: any;

  lonely: Lonely;


  constructor(private accountService: AccountService, private lonelyService: LonelyService, private router: Router,
    private fireAuth: AngularFireAuth, private geolocation: Geolocation, private fireStorage: AngularFireStorage) { }

  ngOnInit() {
    // get current user
    this.fireAuth.currentUser.then((user) => {
      // parse userId from response
      this.userId = user.uid;
      // get profile photo associated with userId
      this.fireStorage.ref("Images/" + user.uid + '.png').getDownloadURL().subscribe((url) => {
        document.getElementById('lonelyImage').setAttribute("src", url);
      })
      // get account of current user using the userId
      this.accountService.getAccount(user.uid).subscribe((account) => {
        // obtain account and store it in the following variables
        this.username = account.data()["username"];
        this.tagline = account.data()["tagline"];
        this.firstInterest = account.data()["firstInterest"];
        this.secondInterest = account.data()["secondInterest"];
        this.thirdInterest = account.data()["thirdInterest"]
      });
    });

  }

  // after html elements are initialized
  ngAfterViewInit(){
    // show the Google Maps used in the site
    this.showMap();
  }
  
  // show the Google Maps used in the site
  showMap() {
    console.log("Beginning to show map");
    // maximum age sets the maximum age the GPS data can be: 10 seconds
    // enableHighAccuracy to obtain the most accurate GPS data as possible
    // timeout to set the maximum time to be taken to show gps data: 10 seconds
    let options = {timeout: 10000, enableHighAccuracy: true, maximumAge: 10000};
    // get user's current position, passing the options as the parameter
    this.geolocation.getCurrentPosition(options).then((resp) => {
      console.log("Getting geolocation");
      // parse latitude and longitude from response
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      // location where the map will zoom onto
      const location = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
       // options to configure the display of the map
      const options = {
        center: location,
        zoom: 15,
        disableDefaultUI: true
      }
      // set the map onto a HTML element based on the options
      const map = new google.maps.Map(document.getElementById("mapLonely"), options);
      // creae a marker on the specified location
      new google.maps.Marker({
        position: location,
        map,
        title: "Here you are!",
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });;
  }
  // upload information on Firebase
  uploadToFirebase() {
    // create a new Lonely class containing all the information to be uploaded
    this.lonely = new Lonely(this.username, this.tagline, this.description, this.firstInterest, this.secondInterest,
       this.thirdInterest, this.latitude, this.longitude, new Date());
    // upload it with the use of lonelyService
    this.lonelyService.uploadLonely(this.userId, this.lonely);
    // navigate back to the home page
    this.router.navigate(['/main']);
  }


}
