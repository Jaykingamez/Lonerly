import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InterestsService {

  constructor(private http: HttpClient) { 
  }
  // retrieves the interests json stored on github
  getInterests(){
    return this.http.get("https://raw.githubusercontent.com/Jaykingamez/json-container/main/facebookInterests.json");
  }
}
