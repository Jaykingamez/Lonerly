import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InterestsService } from '../../interests.service';
import { AccountService } from 'src/app/account.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-interests',
  templateUrl: './sign-up-interests.page.html',
  styleUrls: ['./sign-up-interests.page.scss'],
})
export class SignUpInterestsPage implements OnInit {
  // variable that will store the form
  signUpInterestsForm: FormGroup;
  // store all the possible interests
  results: any = [];
  // store the interest selected by user
  selectedInterest: string = '';
  // store the selected Field interest 
  selectedField: string;
  // store the selected Category interest
  selectedCategory: string;
  // store the selected Specific interest
  selectedSpecific: string;
  // stores all possible field Interests
  fieldInterestArray: Array<string> = [];
  // store all possible category Interests
  categoryInterestArray: Array<string> = [];
  // store all specific Interests
  specificInterestArray: Array<string> = [];

  constructor(private formBuilder: FormBuilder, private fireAuth: AngularFireAuth, 
    private interestsService: InterestsService, private accountService: AccountService, 
    private router: Router) {
    // creates form to handle interests
    this.signUpInterestsForm = formBuilder.group({
      'firstInterest': '',
      'secondInterest': '',
      'thirdInterest': '',
    });
    // get all interests
    this.interestsService.getInterests().subscribe((data) => {
      // store the response
      this.results = data;
      console.log(this.results);
    });
  }

  ngOnInit(){

  }

  // function that executes if user selects an interest
  selectInterest(interest: string) {
    // store interest under selectedInterest
    this.selectedInterest = interest;
    // if selectInterest is not 0
    if (this.selectInterest.length != 0) {
      // get field Interests
      this.setFieldInterests();
    }
  }
  // set the field interests
  setFieldInterests() {
    // get all the keys of JSON results and store the array into fieldInterestArray
    this.fieldInterestArray = Object.keys(this.results);
  }
  // set the category interests
  setCategoryInterests(field: string) {
    // empty the field Interest array
    this.fieldInterestArray = [];
    // store the selectedField
    this.selectedField = field;
    // if there is a category key
    if (this.results[field].hasOwnProperty("Category")) {
      // combine the results and the category field and store it under category interest array 
      this.categoryInterestArray = this.results[field]["Category"].concat(Object.keys(this.results[field]));
    } else {
      // else just store the results under category interest array 
      this.categoryInterestArray = Object.keys(this.results[field]);
    }
  }
  // set specific interests
  setSpecificInterests(category: string) {
    // empty the category Interest array
    this.categoryInterestArray = [];
    // store the selectedCategory
    this.selectedCategory = category;
    // if there is a selectedCategory key
    if (this.results[this.selectedField].hasOwnProperty(category)) {
      // set results on specificInterestArray
      this.specificInterestArray = this.results[this.selectedField][category];
    } else {
      // set the interest
      this.setInterest(category);
    }
  }
  // set the selected Interest
  setInterest(interest: string) {
    // empty specificInterestArray
    this.specificInterestArray = [];
    // store selected Interest under id
    let id: string = this.selectedInterest;
    // change this.selectedInterest into a blank string
    this.selectedInterest = '';
    // display interest under the id html
    (<HTMLInputElement>document.getElementById(id)).value = interest;
  }
  // upload interests to Firebase
  uploadInterest(){
    // get current user
    this.fireAuth.currentUser.then((data) =>{
      // update user's profile with interests
      this.accountService.addInterests( data.uid ,this.signUpInterestsForm.value.firstInterest, 
        this.signUpInterestsForm.value.secondInterest, this.signUpInterestsForm.value.thirdInterest);
    });
    // navigate to the main page
    this.router.navigate(['/main']);
  }

}
