import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = {items:[]}

  dataSource: CartItem[] = []
  displayedColumns: string[] = ['product', 'name', 'price', 'quantity', 'total', 'action']
  cartSubscription: Subscription | undefined

  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart.subscribe((_cart: Cart) => {
      this.dataSource = _cart.items
      this.cart = _cart
    })
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe()
    }
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items)
  }

  onClearCart(): void {
    this.cartService.clearCart()
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item)
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item)
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item)
  }

  onCheckout(): void {
    this.http.post('http://localhost:4242/checkout', {items: this.cart.items}).subscribe(async (res:any) => {
      let stripe = await loadStripe('pk_test_51PJfcwLHZ1VIQFLNhCpUbKUDSlH9gXjsdd68D6vvWaG3WSkG05MRbiR6PFQOz1inSsqYx1o8G71iDm6H0YMTWq7h00DnKCob8G')
      stripe?.redirectToCheckout({sessionId: res.id})
    })
  }
}
