import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {AppRouterProvider} from "./app.routes";
import { SearchComponent } from './components/search/search.component';
import {WeatherService} from "./shared/services/weather.service";
import { BlankComponent } from './components/blank/blank.component';
import {AngularFireModule, AuthMethods, AuthProviders} from "angularfire2";
import {FirebaseService} from "./shared/services/firebase.service";
import {Ng2Webstorage} from "ng2-webstorage";
import {ClickOutsideDirective} from "angular2-click-outside/clickOutside.directive";

const firebaseConfig = {
  apiKey: "Your API key",
  authDomain: "Your Domain",
  databaseURL: "Your Database url",
  storageBucket: "Your Storage Bucket",
  messagingSenderId: "Your Messaging sender id"
};

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    BlankComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouterProvider,
    AngularFireModule.initializeApp(firebaseConfig, {
      provider: AuthProviders.Password,
      method: AuthMethods.Password
    }),
    Ng2Webstorage
  ],
  providers: [WeatherService, FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
