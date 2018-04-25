import { ProductService } from './../../core/services/product.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { Action } from '@ngrx/store';
import { UserService } from '../services/user.service';
import { UserActions } from '../actions/user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private userActions: UserActions,
    private productService: ProductService
  ) { }

  // tslint:disable-next-line:member-ordering
  @Effect()
  GetUserOrders$: Observable<Action> = this.actions$
    .ofType(UserActions.GET_USER_ORDERS)
    .switchMap(() => this.userService.getOrders())
    .filter((orders) => orders.length > 0)
    .map((orders) => this.userActions.getUserOrdersSuccess(orders));

  // tslint:disable-next-line:member-ordering
  @Effect()
  GetUserFavoriteProducts$: Observable<Action> = this.actions$
    .ofType(UserActions.GET_USER_FAVORITE_PRODUCTS)
    .switchMap(() => this.productService.getFavoriteProducts())
    .map((products) => this.userActions.getUserFavoriteProductsSuccess(products));

}
