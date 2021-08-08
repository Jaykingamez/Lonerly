import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage'
import { AccountService } from 'src/app/account.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';

@Component({
  selector: 'app-sign-up-profile',
  templateUrl: './sign-up-profile.page.html',
  styleUrls: ['./sign-up-profile.page.scss'],
})
export class SignUpProfilePage implements OnInit {
  // variable that will store any image uploaded by user
  file: any;
  // variable that will store the form
  signUpProfileForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private fireAuth: AngularFireAuth,
    private accountService: AccountService, private fireStorage: AngularFireStorage,
    private router: Router, private platform: Platform, private camera: Camera) {
    // creates form to handle profile information
    this.signUpProfileForm = formBuilder.group({
      'profilePhoto': '',
      'tagline': '',
      'description': ''
    });
  }

  ngOnInit() {
  }

  // functions runs if the user clicks or taps on element
  uploadImage() {
    console.log("click");
    // if the application is on mobile
    if (this.platform.is("mobile")) {
      this.mobileImage(this.camera.PictureSourceType.PHOTOLIBRARY);
    } else {
      // get the file by web
      document.getElementById("imageUploadSignUp").click();
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
      this.file = 'data:image/png;base64,' + imageData;
      // display image
      document.getElementById('profileImage').setAttribute("src", this.file);
    }, (err) => {
      // Handle error
      console.log(err);
    });
  }

  // if image is uploaded
  loadImage(files: FileList) {
    // get the first image in the FireList
    this.file = files.item(0);
    // display the image
    document.getElementById('profileImage').setAttribute("src", URL.createObjectURL(files.item(0)));
  }

  // upload information to Firebase
  sendToFirebase() {
    // send images to Firebase Storage
    this.sendtoFirebaseStorage();
    // add description and tagline to user's profile
    this.addDescriptionAndTagline();
    // navigate to sign-up/interests to get user's interests
    this.router.navigate(['/sign-up/interests']);
  }

  // upload image on Firebase Storage
  sendtoFirebaseStorage() {
    // get current user
    this.fireAuth.currentUser.then((data) => {
      if (this.platform.is("mobile")) {
        // upload image on Firebase on mobile
        this.fireStorage.ref("Images").child(data.uid + "." + 'png').putString(this.file, "data_url").then((snapshot) => {
          console.log("File uploaded");
        });
      } else {
        // upload image on Firebase by web
        this.fireStorage.ref("Images").child(data.uid + "." + 'png').put(this.file).then((snapshot) => {
          console.log("File uploaded");
        });
      }
    });
  }

  // add description and tagline to user's profile
  addDescriptionAndTagline() {
    // get current user
    this.fireAuth.currentUser.then((data) => {
      // upload description and tagline to user's profile
      this.accountService.addDescriptionaAndTagline(data.uid, this.signUpProfileForm.value.description, this.signUpProfileForm.value.tagline);
    });
  }
}
