import {Component, OnInit, Renderer, ElementRef, AfterViewInit} from '@angular/core';
import {WeatherService} from "./shared/services/weather.service";
import {Observable} from "rxjs";
import {Location} from "@angular/common";
import {ViewChild} from "@angular/core/src/metadata/di";
import {LocalStorage, LocalStorageService} from "ng2-webstorage";
import {FirebaseService} from "./shared/services/firebase.service";
import {FirebaseListObservable} from "angularfire2";
import {isNullOrUndefined} from "util";
declare var jQuery:any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('rain') rain:ElementRef;
    @ViewChild('drizzle') drizzle:ElementRef;
    @ViewChild('sunny') sunny:ElementRef;
    @ViewChild('thunderStorm') thunderStorm:ElementRef;
    @ViewChild('dustRain') dustRain:ElementRef;
    @ViewChild('modalDismiss') modalDismiss:ElementRef;
    @ViewChild('forceSignIn') forceSignIn:ElementRef;

    @LocalStorage('success')
    public success:string;
    @LocalStorage('error')
    public error:string;
    /*@LocalStorage('welcomeMsg')
     public welcomeMsg;*/

    public date:number = Date.now();
    public weather:any;
    public listIsOpened:boolean = false;
    public signedIn:boolean = false;
    public user:any;
    public city:string;
    public cities:FirebaseListObservable<any>;
    public snackBar:boolean = false;
    public status:string = 'loading';

    constructor(private _weatherService:WeatherService, private _renderer:Renderer, private _location:Location, private _localStorage:LocalStorageService, private _firebaseService:FirebaseService) {
        _weatherService.getWeatherWithQuery('Damascus')
            .subscribe(weather => _weatherService.updateCurrentWeather(weather));
    }

    /*goBack() {
     this._location.back()
     }*/


    openList() {
        if (this.user) {
            this.cities = this._firebaseService.getUserCities(this.user.uid);
            this._firebaseService.getUserCities(this.user.uid).subscribe(data => console.log(data))
            this.listIsOpened = true;
        }
        else {
            this._localStorage.store('error', 'You need to be logged in in order to see your list !');
            setTimeout(() => {
                let event = new MouseEvent('click', {bubbles: true});
                this._renderer.invokeElementMethod(
                    this.forceSignIn.nativeElement, 'dispatchEvent', [event]);
            }, 0);
        }
    }

    snackBarTrigger() {
        this.snackBar = true;
        setTimeout(() => {
            this.snackBar = false;
        }, 3000)
    }


    closeList() {
        this.listIsOpened = false;
    }

    signUp(email:string, password:string) {
        this._firebaseService.signUp(email, password)
    }

    remove(event, cityKey) {
        event.preventDefault();
        event.stopPropagation();
        this._firebaseService.removeCity(this.user.uid, cityKey);
    }

    signIn(email:string, password:string) {
        this._firebaseService.signIn(email, password)
            .then((user) => {
                this.user = user;
                /*this._localStorage.store('welcomeMsg', 'Welcome ' + user.auth.email);*/
                setTimeout(() => {
                    let event = new MouseEvent('click', {bubbles: true});
                    this._renderer.invokeElementMethod(
                        this.modalDismiss.nativeElement, 'dispatchEvent', [event]);
                }, 0);
            }, (error) => {
                console.trace(error);
                this._localStorage.store('error', error.message)
            })
    }

    addToList() {
        if (this.user) {
            const uid = this.user.uid;
            const city = this.city;
            this._firebaseService.addCity(uid, city).then(success => this.snackBarTrigger())
        }
    }

    getWeather(city:string) {
        this._weatherService.getWeatherWithQuery(city).subscribe(weather => this._weatherService.updateCurrentWeather(weather))
    }

    emptyMsg():void {
        this._localStorage.store('success', '');
        this._localStorage.store('error', '');
        this._localStorage.store('welcomeMsg', '');
    }

    logout():void {
        this._firebaseService.logout();
        this.user = null;
        this.signedIn = false;
        this._localStorage.store('welcomeMsg', '');
    }


    ngAfterViewInit():void {
        jQuery(document).ready(function () {
            jQuery("body").tooltip({selector: '[data-toggle=tooltip]'});
        });
    }

    ngOnInit():void {
        this._weatherService.currentStatus.subscribe(status => this.status = status);
        this._firebaseService.getUser().subscribe(user => {
            if (user === null) {
                this.signedIn = false
            } else {
                this.signedIn = true;
                this.user = user;
                /*this._localStorage.store('welcomeMsg', 'welcome back ' + user.auth.email);*/
            }
        });
        this._weatherService.currentWeather.subscribe(weather => {
            this.weather = weather;
            this._weatherService.updateStatus('ready');
            this.city = weather.name;
            switch (weather.weather[0].description) {
                case "broken clouds" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.drizzle.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "light rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.drizzle.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "moderate rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.drizzle.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "heavy intensity rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.rain.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "very heavy rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.thunderStorm.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "extreme rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.thunderStorm.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "freezing rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.rain.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "light intensity shower rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.rain.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "shower rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.rain.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "heavy intensity shower rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.thunderStorm.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "ragged shower rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.thunderStorm.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "clear sky" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.sunny.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "few clouds" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.sunny.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "light intensity drizzle" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.drizzle.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "drizzle" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.drizzle.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "heavy intensity drizzle" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.drizzle.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "light intensity drizzle rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.drizzle.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "drizzle rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.drizzle.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "heavy intensity drizzle rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.drizzle.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "shower rain and drizzle" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.rain.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "heavy shower rain and drizzle" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.rain.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "shower drizzle" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.rain.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "thunderstorm with light rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.drizzle.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "thunderstorm with rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.thunderStorm.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "thunderstorm with heavy rain" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.thunderStorm.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                case "thunderstorm" :
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.thunderStorm.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
                    break;
                default:
                    setTimeout(() => {
                        let event = new MouseEvent('click', {bubbles: false});
                        this._renderer.invokeElementMethod(
                            this.sunny.nativeElement, 'dispatchEvent', [event]);
                    }, 0);
            }
        })
    }
}
