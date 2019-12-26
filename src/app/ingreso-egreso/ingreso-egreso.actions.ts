import { IngresoEgreso } from './ingreso-egreso.model'
import { Action } from '@ngrx/store'

export const SET_ITEMS = "[Ingreso Egreso] set items"
export const UNSET_ITEMS = "[Egreso Egreso] unset items"

export class SetItemsAction implements Action {
    readonly type = SET_ITEMS
    constructor(public items:IngresoEgreso[]){
        
    }
}

export class UnsetItemsAction implements Action {
    readonly type = UNSET_ITEMS
}

export type acciones = SetItemsAction | UnsetItemsAction