import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2' 
import {map} from "rxjs/operators";
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth:AngularFireAuth, private router:Router, private afDB:AngularFirestore) { }
  crearUsuario(nombre:string, email:string, pasword:string){
    this.afAuth.auth.createUserWithEmailAndPassword(email, pasword).then(resp => {
      const user: User = {
        uid: resp.user.uid,
        nombre:nombre,
        email:resp.user.email
      }
      this.afDB.doc(`${user.uid}/usuario`).set(user).then(()=>{
        this.router.navigate(["/"])
      })
    }).catch(error => {
      Swal.fire({
        title: 'Error en el registro',
        text: error.message,
        type: 'error',
        icon:"error",
        confirmButtonText: 'Aceptar'
      })  

      
    })
  }
  initAuthListener(){
    this.afAuth.authState.subscribe(fbuser=>{
      console.log(fbuser);
      
    })
  }
  login(email:string, password:string){
    this.afAuth.auth.signInWithEmailAndPassword(email,password).then(resp=>{
      this.router.navigate(["/"])
    }).catch(error=>{
      Swal.fire({
        title: 'Error en el login',
        text: error.message,
        type: 'error',
        confirmButtonText: 'Aceptar'
      })  

      
    })
  }
  logout(){
    this.router.navigate(["/login"])
    this.afAuth.auth.signOut()
  }
  isAuth(){
    return this.afAuth.authState
    .pipe(
      map(resp => {
        if (resp == null) {
          this.router.navigate(["/login"])
        }
        return resp != null
      })
    )
  }

}
