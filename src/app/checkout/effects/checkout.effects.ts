import { Address } from './../../core/models/address';
import { Action } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { LineItem } from './../../core/models/line_item';
import { CheckoutService } from './../../core/services/checkout.service';
import { CheckoutActions } from './../actions/checkout.actions';
import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Order } from '../../core/models/order';
import { AddressService } from '../address/services/address.service';
import { PaymentService } from '../payment/services/payment.service';

@Injectable()
export class CheckoutEffects {
  @Effect()
  AddToCart$ = this.actions$.ofType(CheckoutActions.ADD_TO_CART).pipe(
    switchMap<Action & {payload: {variant_id: number, quantity: number}}, LineItem>(action => {
      return this.checkoutService.createNewLineItem(
        action.payload.variant_id,
        action.payload.quantity
      );
    }),
    switchMap(lineItem => [
      this.actions.getOrderDetails(),
      this.actions.addToCartSuccess(lineItem)
    ])
  );

  @Effect()
  OrderDetails$ = this.actions$.ofType(CheckoutActions.GET_ORDER_DETAILS).pipe(
    switchMap<Action, Order>(_ => {
      return this.checkoutService.getOrder();
    }),
    map(order => this.actions.getOrderDetailsSuccess(order))
  );


  @Effect()
  BindAddress$ = this.actions$.ofType(CheckoutActions.BIND_ADDRESS).pipe(
    switchMap<Action & {payload: {address: Address, orderId: number}}, Order>(action => {
      return this.addressService.
        bindAddressToOrder(action.payload.address, action.payload.orderId);
    }),
    map(order => this.actions.getOrderDetailsSuccess(order))
  );


  @Effect()
  BindPayment$ = this.actions$.ofType(CheckoutActions.BIND_PAYMENT).pipe(
    switchMap<Action & {payload: {paymentMethodId: number, orderId: number, orderAmount: number}}, Order>(action => {
      return this.paymentService.addPaymentToOrder(
        action.payload.paymentMethodId,
        action.payload.orderId,
        action.payload.orderAmount);
    }),
    map(order => this.actions.getOrderPaymentsSuccess(order))
  );

  constructor(
    private actions$: Actions,
    private checkoutService: CheckoutService,
    private actions: CheckoutActions,
    private addressService: AddressService,
    private paymentService: PaymentService
  ) { }
}
