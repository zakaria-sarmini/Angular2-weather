import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';
import {Observable, Subject} from "rxjs";

@Injectable()

export class WeatherService {

    constructor(private _http:Http) {
    }

    private currentWeatherSource = new Subject<any>();
    private status = new Subject<string>();
    currentWeather = this.currentWeatherSource.asObservable();
    currentStatus = this.status.asObservable();

    updateCurrentWeather(weather) {
        this.currentWeatherSource.next(weather);
    }

    updateStatus(status:string) {
        this.status.next(status);
    }

    getWeatherWithQuery(query:string) {
        return this._http.get('http://api.openweathermap.org/data/2.5/weather?q=' + query + ' &APPID=51c7f759b664d9c137b1ad5483d3dd3d&units=metric')
            .map(res => res.json())
            .catch(error => {
                console.error(error);
                return Observable.throw(error.json());
            })
    }

    getWeatherWithLocation(lat:number, long:number) {
        return this._http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&APPID=51c7f759b664d9c137b1ad5483d3dd3d&units=metric')
            .map(res => res.json())
            .catch(error => {
                console.error(error);
                return Observable.throw(error.json())
            })
    }

}
