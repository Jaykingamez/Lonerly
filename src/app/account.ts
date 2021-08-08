//Account class contains all the account information
export class Account{
    // username of user
    username: string;
    // first name of user
    firstName: string;
    // last name of user
    lastName: string;
    // gender of user
    gender: string;
    // mobile number of user
    mobileNumber: string;
    // email address of user
    emailAddress: string;

    // constructor to create the Account, setting parameters to the variables
    constructor(username, firstName, lastName, gender, mobileNumber, emailAddress){
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.mobileNumber = mobileNumber;
        this.emailAddress = emailAddress;
    }
}