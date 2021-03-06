import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

declare var Auth0Lock: any;
@Injectable()
export class Auth0Service {

  lock = new Auth0Lock('gHhXS61sxta0CztzyZ5oJC3Zp4AYOq19', 'travelwithme.auth0.com', {});

  constructor() {


    this.lock.on("authenticated", (authResult:any) => {
      this.lock.getProfile(authResult.idToken,function (error:any,profile:any) {
        if (error){
          throw new Error(error);
        }

        localStorage.setItem('id_token',authResult.idToken);
        localStorage.setItem('profile',JSON.stringify(profile));

      });
    });


  }


public login() {
  // Call the show method to display the widget.
  this.lock.show();

}

public authenticated() {
  // Check if there's an unexpired JWT
  // This searches for an item in localStorage with key == 'id_token'
  return tokenNotExpired();
}

public logout() {
  // Remove token from localStorage
  localStorage.removeItem('id_token');
  localStorage.removeItem('profile');
}







}
