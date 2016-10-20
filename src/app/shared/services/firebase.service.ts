import {Injectable} from "@angular/core";
import {AngularFire} from "angularfire2";
import {LocalStorageService} from "ng2-webstorage";

@Injectable()

export class FirebaseService {

    constructor(private _af:AngularFire, private _localStorage:LocalStorageService) {
    }

    getUser() {
        return this._af.auth
    }

    getUserCities(uid:string) {
        return this._af.database.list('/users/' + uid + '/cities')
    }

    signUp(email:string, password:string) {
        this._af.auth.createUser({
            email: email,
            password: password
        })
            .then((user) => {
                console.log(user);
                this._localStorage.store('success', 'New account has been successfully created press sign in...');
                this._af.database.object('/users/' + user.uid).set({
                    email: user.auth.email,
                    cities: []
                })
            }, (error) => {
                console.trace(error);
                this._localStorage.store('error', error.message);
            })
    }

    signIn(email:string, password:string) {
        return this._af.auth.login({
            email: email,
            password: password
        })
    }

    logout():void {
        this._af.auth.logout();
    }

    addCity(uid:string, city:string) {
        return this._af.database.list('/users/' + uid + '/cities').push(city)
    }

    removeCity(uid:string, cityKey:string) {
        this._af.database.list('/users/' + uid + '/cities').remove(cityKey)
    }
}
