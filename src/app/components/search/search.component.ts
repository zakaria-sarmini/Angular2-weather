import {
    Component, OnInit, style, keyframes, animate, transition, state, trigger,
} from '@angular/core';
import {Location} from "@angular/common";
import {HostBinding} from "@angular/core/src/metadata/directives";
import {WeatherService} from "../../shared/services/weather.service";
import {Subject} from "rxjs";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    animations: [
        trigger('routeAnimation', [
            state('*', style({opacity: 1, transform: 'translateX(0)'})),
            transition('void => *', [
                animate('0.2s 0.2s', keyframes([
                    style({opacity: 0, transform: 'translateY(20%)', offset: 0}),
                    style({opacity: 1, transform: 'translateY(10%)', offset: 0.3}),
                    style({opacity: 1, transform: 'translateY(0)', offset: 1.0})
                ]))
            ]),
            transition('* => void', [
                animate('0.2s', keyframes([
                    style({opacity: 1, transform: 'translateY(0)', offset: 0}),
                    style({opacity: 1, transform: 'translateY(10%)', offset: 0.3}),
                    style({opacity: 0, transform: 'translateY(20%)', offset: 1})
                ]))
            ])
        ])
    ],
    outputs: ['weather']
})
export class SearchComponent implements OnInit {

    private query = new Subject<string>();
    public location:string;
    public weather:any;

    @HostBinding('@routeAnimation') get routeAnimation() {
        return true;
    }

    @HostBinding('style.position') get position() {
        return 'absolute';
    }

    @HostBinding('style.width') get width() {
        return '100%';
    }


    constructor(private _location:Location, private _weatherService:WeatherService) {
    }

    searchForIt(query) {
        this.query
            .next(query);
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getPosition.bind(this));
        }
    }

    getPosition(position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        this._weatherService.getWeatherWithLocation(lat, long)
            .subscribe(weather => {
                this._location.back();
                this._weatherService.updateCurrentWeather(weather);
            })
    }

    updateWeather() {
        this._location.back();
        this._weatherService.updateCurrentWeather(this.weather)
    }

    goBack():void {
        this._location.back()
    }

    ngOnInit() {
        this.query
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap((query:string) => this._weatherService.getWeatherWithQuery(query))
            .subscribe(location => {
                this.location = location.name;
                this.weather = location
            })
    }

}
