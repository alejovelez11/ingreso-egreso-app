import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2' 
import {map} from "rxjs/operators";
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private subscription:Subscription = new Subscription()
  private usuario:User
  constructor(private afAuth:AngularFireAuth, private router:Router, private afDB:AngularFirestore, private store:Store<AppState>) { }
  crearUsuario(nombre:string, email:string, pasword:string){
    this.store.dispatch(new ActivarLoadingAction())
    this.afAuth.auth.createUserWithEmailAndPassword(email, pasword).then(resp => {
      const user: User = {
        uid: resp.user.uid,
        nombre:nombre,
        email:resp.user.email
      }
      this.afDB.doc(`${user.uid}/usuario`).set(user).then(()=>{
        this.router.navigate(["/"])
        this.store.dispatch(new DesactivarLoadingAction())
        
      })
    }).catch(error => {
      this.store.dispatch(new DesactivarLoadingAction())
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
    this.afAuth.authState.subscribe(fbuser => {
      if (fbuser) {
        this.subscription = this.afDB.doc(`${fbuser.uid}/usuario`).valueChanges().subscribe((usuario:any)=>{
          const newUser = new User(usuario)
          this.store.dispatch(new SetUserAction(newUser))
          this.usuario = newUser
        })
      } else {
        this.usuario = null
        this.subscription.unsubscribe()
      }
      
    })
  }
  login(email:string, password:string){
    this.store.dispatch(new ActivarLoadingAction())
    this.afAuth.auth.signInWithEmailAndPassword(email,password).then(resp=>{
      this.router.navigate(["/"])
      this.store.dispatch(new DesactivarLoadingAction())
    }).catch(error=>{
      this.store.dispatch(new DesactivarLoadingAction())
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

  getUsuario(){
    return {...this.usuario}
  }


}
