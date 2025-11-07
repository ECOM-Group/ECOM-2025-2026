import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IProduct } from '../../entities/product/product.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';
import { IProdOrder } from 'app/entities/prod-order/prod-order.model';
import { IOrderLine } from 'app/entities/order-line/order-line.model';
import LoginComponent from 'app/login/login.component';

@Component({
  selector: 'jhi-fiche-produit',
  imports: [LoginComponent, NgStyle],
  templateUrl: './fiche-produit.component.html',
  styleUrl: './fiche-produit.component.scss',
})
export default class FicheProduitComponent implements OnInit {
  product: IProduct = {
    id: -1, // id temporaire
    price: null,
    desc: '',
    quantity: 0,
    imageHash: null,
    tags: [],
  };
  id: number = -1;
  isConnected: boolean = true;
  successMessages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id') ?? '-1');
    if (!isNaN(this.id) && this.id >= 0) {
      this.http
        .get(`/api/products/${this.id}`)
        .pipe(map((d: any): IProduct => d))
        .subscribe({
          next: data => {
            this.product = data;
          },
          error: err => {
            console.error('Erreur lors du chargement du produit :', err);
          },
        });
    }
  }

  public addToCart(id: number): void {
    // Récupérer le user connecté, récupérer l'utilisateur complet depuis l'API, puis gérer la commande
    this.accountService
      .identity()
      .pipe(
        switchMap(user => {
          if (!user || !user.login) {
            this.isConnected = false;
            throw new Error('Utilisateur non authentifié');
          }
          return this.http.get<any>(`/api/admin/users/${user.login}`);
        }),
        switchMap((userData: any) => {
          console.log('Utilisateur récupéré :', userData);
          return this.http.get<IProdOrder[]>(`/api/prod-orders`).pipe(
            switchMap((prodOrder: IProdOrder[]) => {
              const order = prodOrder.find((element: IProdOrder) => element.user?.id === userData.id && !element.valid);
              if (order) {
                console.log('Commande existante trouvée :', order);
                return this.http.get<IOrderLine[]>(`/api/order-lines`).pipe(
                  switchMap((orderLines: IOrderLine[]) => {
                    const line = orderLines.find((element: IOrderLine) => element.product?.id === id && element.prodOrder?.id === order.id);
                    if (line) {
                      console.log('Ligne de commande existante trouvée :', line);
                      const newQuantity = (line.quantity ?? 0) + 1;
                      return this.http.patch(`/api/order-lines/${line.id}`, {
                        id: line.id,
                        quantity: newQuantity,
                        unitPrice: this.product.price,
                        total: newQuantity * (this.product.price ?? 0),
                      });
                    } else {
                      console.log('Aucune ligne de commande existante trouvée, création dune nouvelle ligne.');
                      return this.http.post(`/api/order-lines`, {
                        product: { id },
                        prodOrder: { id: order.id },
                        quantity: 1,
                        unitPrice: this.product.price,
                        total: this.product.price,
                      });
                    }
                  }),
                );
              } else {
                console.log('Aucune commande valide trouvée, création d une nouvelle commande.');
                return this.http
                  .post<IProdOrder>(`/api/prod-orders`, {
                    user: userData,
                    valid: false,
                    promo: 0,
                  })
                  .pipe(
                    switchMap((newOrder: IProdOrder) => {
                      return this.http.post(`/api/order-lines`, {
                        product: { id },
                        prodOrder: { id: newOrder.id },
                        quantity: 1,
                        unitPrice: this.product.price,
                        total: this.product.price,
                      });
                    }),
                  );
              }
            }),
          );
        }),
      )
      .subscribe({
        next: response => {
          console.log('Commande mise à jour ou créée :', response);
          const message = `Produit ajouté au panier avec succès !`;
          this.successMessages.push(message);

          // Supprime ce message au bout de 3 secondes
          setTimeout(() => {
            this.successMessages.shift();
          }, 3000);
        },
        error: err => {
          console.error('Erreur lors du traitement de la commande :', err);
        },
      });
  }
}
