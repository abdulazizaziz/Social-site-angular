import { UsernameService } from './../username.service';
import { AbstractControl, ValidationErrors } from "@angular/forms";
import {
    HttpClient,
    HttpXhrBackend
 } from '@angular/common/http';


export class UsernameValidators {
    username: any
    
    static usernameuniqe(control: AbstractControl) : Promise<ValidationErrors | null> {
        const httpClient = new HttpClient(new HttpXhrBackend({
            build: () => new XMLHttpRequest()
         }));
        const username = new UsernameService(httpClient)

        return new Promise((resolve, rejects ) => {
            httpClient.get('http://localhost:8000/api/usernameuniqe/' + control.value + '/')
            .subscribe(res => {
                if(control.value != username.user.username){
                    if (res)
                        resolve( {usernameuniqe: true} )
                    else
                        resolve( null )
                }
                else
                    resolve( null )
              })
        })
    }

    static number(control: AbstractControl) : ValidationErrors | null {
        console.log(control.value)
        if (control.value.length != 10 || control.value[0] != '0' || control.value[1] != '7')
            return { nonumber: true }
        for (let i=0; i< control.value.length; i++) {
            if ( 
                control.value[i] != '0' &&
                control.value[i] != '1' &&
                control.value[i] != '2' &&
                control.value[i] != '3' &&
                control.value[i] != '4' &&
                control.value[i] != '5' &&
                control.value[i] != '6' &&
                control.value[i] != '7' &&
                control.value[i] != '8' &&
                control.value[i] != '9'
                ) {
                    return { nonumber: true }
                }
        }
        return null
    }
}