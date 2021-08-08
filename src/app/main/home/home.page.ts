import { Component, OnInit, AfterViewInit, Directive, QueryList, ViewChildren } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage'
import { LonelyService } from 'src/app/lonely.service';
declare var google: any;

@Component({
  selector: 'app-main-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  snapshotArray: any = [];
  // queryList to check for changes
  @ViewChildren('theLonelyList') list: QueryList<any>;

  constructor(private lonelyService: LonelyService, private fireStorage: AngularFireStorage) {
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    // empty array
    this.snapshotArray = [];
    console.log("Hello");
    // get all users seekping for companionship
    this.lonelyService.getLonely().then((snapshots) => {
      // if there are no such users, console logs "No one is lonely"
      if (snapshots.empty) {
        console.log("No one is lonely");
      } else {
      // else iterate through every user and add it to this.snapshotArray
        snapshots.forEach(snapshot => {
          this.snapshotArray.push(snapshot);
        });
      }
    });
  }

  ngAfterViewInit() {
    // after HTMLL view that is linked with this.list changes
    // run this.parseLonely()
    this.list.changes.subscribe(() => {
      this.parseLonely();
    })
  }
  
  // show the Google Maps used in the site
  showMap(number: number, latitude: number, longitude: number) {

    // location where the map will zoom onto
    const location = new google.maps.LatLng(latitude, longitude);

    // options to configure the display of the map
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }

    // set the map onto a HTML element based on the options
    const map = new google.maps.Map(document.getElementById("map" + number), options);

    // create a marker on the map
    new google.maps.Marker({
      position: location,
      map,
      title: "Here you are!",
    });
  }

  // parse the receieved items array
  parseLonely() {
    for (let i = 0; i < this.snapshotArray.length; i++) {
      // set the user's username
      document.getElementById("username" + i).innerHTML = this.snapshotArray[i].data()["username"];
      // set the user's tagline
      document.getElementById("tagline" + i).innerHTML = this.snapshotArray[i].data()["tagline"];
      // set the user's longitude and latitude on the map
      this.showMap(i, this.snapshotArray[i].data()["latitude"], this.snapshotArray[i].data()["longitude"]);
      // set user's profile photo
      this.fireStorage.ref("Images/" + this.snapshotArray[i].id + '.png').getDownloadURL().subscribe((url) => {
        document.getElementById('profileImage' + i).setAttribute("src", url);
      })
    }
  }

}
