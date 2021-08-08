// Lonely class stores all the information about the lonely user
export class Lonely{
    // username of user
    username: string;
    // tagline of user
    tagline: string;
    // description of user
    description: string;
    // first Interest of user
    firstInterest: string;
    // second Interest of user
    secondInterest: string;
    // third Interest of user
    thirdInterest: string;
    // latitude of the location of user
    latitude: number;
    // longitude of the location of user
    longitude: number;
    // timestamp where the user makes the lonely post
    timestamp: Date;
    // constructor to create Lonely user setting parameters to the variables
    constructor(username: string, tagline: string, description: string, firstInterest: string, 
        secondInterest: string, thirdInterest: string, latitude: number, longitude: number, timestamp: Date){
            this.username = username;
            this.tagline = tagline;
            this.description = description;
            this.firstInterest = firstInterest;
            this.secondInterest = secondInterest;
            this.thirdInterest = thirdInterest;
            this.longitude = longitude;
            this.latitude = latitude;
            this.timestamp = timestamp;
    }

}