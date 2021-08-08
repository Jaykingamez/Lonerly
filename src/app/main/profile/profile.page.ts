import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/account.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage'
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/File/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  // variable that stores the form
  profileForm: FormGroup;
  // variable that stores the username
  username: string;
  // variable that stores a possible file uploaded by user
  uploadFile: any;
  // variable that stores userId associated with user
  userId: string;
  // boolean that checks whether the current user's profile is being displayed
  currentUser: boolean = true;

  constructor(private formBuilder: FormBuilder, private accountService: AccountService,
    private fireAuth: AngularFireAuth, private fireStorage: AngularFireStorage,
    private route: ActivatedRoute, private camera: Camera,
    private platform: Platform, private file: File) {
    // create new form and set it to profileForm
    this.profileForm = formBuilder.group({
      'profilePhoto': '',
      'tagline': '',
      'description': '',
      'firstInterest': '',
      'secondInterest': '',
      'thirdInterest': ''
    });
  }

  ngOnInit() {
    // get route parameters
    this.route.params.subscribe(params => {
      // if there is a userId parameter
      if (params['userId'] != null) {
        // store it under userId
        this.userId = params['userId'];
        // get current user
        this.fireAuth.currentUser.then((user) => {
          // check whether current user uid equals the userId retrieved from route parameters
          if (user.uid != this.userId) {
            // profile to be displayed is not the current user's one
            this.currentUser = false;
          }
        });
        // prepare profile for displayed
        this.initializeProfile();
      } else {
        // profile to be displayed is the current user's one
        this.fireAuth.currentUser.then((user) => {
          this.userId = user.uid;
          // prepare profile for displayed
          this.initializeProfile();
        });
      }
    });
  }
  // prepare profile for displayed
  initializeProfile() {
    // get image from firebase using userId
    this.fireStorage.ref("Images/" + this.userId + '.png').getDownloadURL().subscribe((url) => {
      // display image
      document.getElementById('mainProfileImage').setAttribute("src", url);
    });
    console.log(this.userId);
    // get user's account
    this.accountService.getAccount(this.userId).subscribe((account) => {
      console.log(account.data());
      // set user's username
      this.username = account.data()["username"];
      // set the various values in form based on account information
      this.profileForm.setValue({
        'profilePhoto': '',
        'tagline': account.data()["tagline"],
        'description': account.data()["description"],
        'firstInterest': account.data()["firstInterest"],
        'secondInterest': account.data()["secondInterest"],
        'thirdInterest': account.data()["thirdInterest"]
      });
    });
  }
  // functions runs if the user clicks or taps on element
  uploadImage() {
    console.log("click");
    // if the application is on mobile
    if (this.platform.is("mobile")) {
      this.mobileImage(this.camera.PictureSourceType.PHOTOLIBRARY);
    } else {
      // get the file by web
      document.getElementById("imageUploadProfile").click();
    }

  }
  // get image on mobile
  mobileImage(sourceType) {
    // set image options
    const options: CameraOptions = {
      sourceType: sourceType, // specifies the source of the images
      destinationType: this.camera.DestinationType.DATA_URL, // specifies the return of base64 string
      mediaType: this.camera.MediaType.PICTURE // specifies to return an image
    }
    // get image using the options
    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);
      // prepare image for display
      this.uploadFile = 'data:image/png;base64,' + imageData;
      // display image
      document.getElementById('mainProfileImage').setAttribute("src", this.uploadFile);
    }, (err) => {
      // Handle error
      console.log(err);
    });
  }

  // if image is uploaded
  loadImage(files: FileList) {
    console.log("Hello");
    // get the first image in the FireList
    this.uploadFile = files.item(0);
    // display the image
    document.getElementById('mainProfileImage').setAttribute("src", URL.createObjectURL(files.item(0)));
  }

  // executes if user decides to change their profile information
  updateProfile() {
    // get current user
    this.fireAuth.currentUser.then((user) => {
      // update user's interests
      this.accountService.addInterests(user.uid, this.profileForm.value.firstInterest,
        this.profileForm.value.secondInterest, this.profileForm.value.thirdInterest);
      // update user's description and tagline
      this.accountService.addDescriptionaAndTagline(user.uid, this.profileForm.value.description,
        this.profileForm.value.tagline);
      // if the user decides to change their profile photo
      if (this.uploadFile != null) {
        // if user is on mobile
        if (this.platform.is("mobile")) {
          // update the profile photo accordingly
          this.fireStorage.ref("Images").child(user.uid + "." + 'png').putString(this.uploadFile, "data_url").then((snapshot) => {
            console.log("File uploaded");
          });
          // if user is on web
        } else {
          // update the profile photo accordingly
          this.fireStorage.ref("Images").child(user.uid + "." + 'png').put(this.uploadFile).then((snapshot) => {
            console.log("File uploaded");
          });
        }

      }
    });
  }
}
