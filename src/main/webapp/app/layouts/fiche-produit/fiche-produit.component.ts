import { Component, inject, OnInit } from '@angular/core';
import { NgStyle, Location } from '@angular/common';
import { IProduct } from '../../entities/product/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';
import { IProdOrder } from 'app/entities/prod-order/prod-order.model';
import { IOrderLine } from 'app/entities/order-line/order-line.model';
import { RouterModule } from '@angular/router';
import LoginComponent from 'app/login/login.component';
import { CartService } from 'app/service/cart/cart.service';
import { ProductService } from 'app/entities/product/service/product.service';
import { MiniFicheComponent } from '../mini-fiche/mini-fiche.component';
import { CommentComponent } from '../comment/comment.component';
import { OrderLineService } from 'app/entities/order-line/service/order-line.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';
import { TagLabelComponent } from 'app/entities/tag/tag-label/tag-label.component';

@Component({
  selector: 'jhi-fiche-produit',
  imports: [LoginComponent, NgStyle, RouterModule, MiniFicheComponent, CommentComponent, TagLabelComponent],
  templateUrl: './fiche-produit.component.html',
  styleUrl: './fiche-produit.component.scss',
})
export default class FicheProduitComponent implements OnInit {
  private cartService = inject(CartService);

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
  showZoom = false;
  backgroundPosition = '0% 0%';
  zoomLevel = 200; // augmente pour zoomer plus
  images: string[] = [];
  alikeProducts: IProduct[] = [];
  alikeLimit = 5; // Nombre de produits similaires à charger
  tags: ITag[] = [];
  currentIndex = 0;
  maxStock = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private accountService: AccountService,
    private location: Location,
    private productService: ProductService,
    private orderLineService: OrderLineService,
    private router: Router,
    private tagService: TagService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id') ?? '-1');
      if (!isNaN(id) && id >= 0) {
        this.id = id;
        this.loadProduct(this.id);
      } else {
        console.error('ID produit invalide', params.get('id'));
      }
    });
  }

  private loadProduct(id: number): void {
    this.http.get<IProduct>(`/api/products/${id}`).subscribe({
      next: product => {
        this.product = product;

        // Produits similaires
        this.productService.findAlikeProducts(this.id, this.alikeLimit).subscribe(alikeProducts => {
          this.alikeProducts = alikeProducts;
        });

        // Images du produit
        this.http.get<any[]>(`/api/product-images/by-product/${id}`).subscribe(images => {
          this.images = images.length > 0 ? images.map(img => img.url) : [''];
        });

        // Tags du produit
        this.tagService.getTagsByProduct(this.product.id).subscribe({
          next: tags => (this.tags = tags),
          error: err => console.error('Error loading tags:', err),
        });
      },
      error: err => console.error('Erreur lors du chargement du produit :', err),
    });
  }

  goback(): void {
    this.location.back();
  }

  onMouseMove(event: MouseEvent): void {
    const img = event.target as HTMLElement;
    const rect = img.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    this.backgroundPosition = `${xPercent}% ${yPercent}%`;
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  // :one: Récupère l'utilisateur complet (comme dans le code original)
  private getUser(): Observable<any> {
    return this.accountService.identity().pipe(
      switchMap(user => {
        if (!user?.login) {
          this.isConnected = false;
          throw new Error('Utilisateur non authentifié');
        }
        // Charge l'entité utilisateur complète (exactement comme avant)
        return this.http.get<any>(`/api/account`);
      }),
    );
  }

  // :two: Récupère la commande non validée du user
  private getCurrentOrder(userId: number): Observable<IProdOrder | null> {
    return this.http.get<IProdOrder[]>(`/api/prod-orders`).pipe(map(orders => orders.find(o => o.user?.id === userId && !o.valid) ?? null));
  }

  // :three: Récupère la ligne de commande pour un produit
  private getOrderLine(orderId: number, productId: number): Observable<IOrderLine | null> {
    return this.http
      .get<IOrderLine[]>(`/api/order-lines`)
      .pipe(map(lines => lines.find(l => l.product?.id === productId && l.prodOrder?.id === orderId) ?? null));
  }

  // :five: POST une nouvelle ligne (identique à l'original)
  private createOrderLine(orderId: number, productId: number): Observable<any> {
    return this.http.post(`/api/order-lines`, {
      product: { id: productId },
      prodOrder: { id: orderId },
      quantity: 1,
      unitPrice: this.product.price, // identique à l’original
      total: this.product.price,
    });
  }

  // :six: POST une nouvelle commande (identique à l’original)
  private createOrder(userData: any): Observable<IProdOrder> {
    return this.http.post<IProdOrder>(`/api/prod-orders`, {
      user: userData,
      valid: false,
      promo: 0,
    });
  }

  // :seven: Fonction principale (fidèle à l’original)
  public addToCart(productId: number): void {
    this.getUser()
      .pipe(
        switchMap(user =>
          this.getCurrentOrder(user.id).pipe(
            switchMap(order => {
              if (order) {
                // Il existe une commande non validée → check line
                return this.getOrderLine(order.id, productId).pipe(
                  switchMap(line => (line ? this.orderLineService.incrementQuantity(line) : this.createOrderLine(order.id, productId))),
                );
              }

              // Sinon créer une commande puis la ligne
              return this.createOrder(user).pipe(switchMap(newOrder => this.createOrderLine(newOrder.id, productId)));
            }),
          ),
        ),
      )
      .subscribe({
        next: () => {
          this.successMessages.push('Produit ajouté au panier avec succès !');
          setTimeout(() => this.successMessages.shift(), 3000);
          this.cartService.notifyCartUpdated();
        },
        error: err => {
          if (err.status === 409) {
            this.maxStock = true;
          }
          console.error('Erreur lors du traitement de la commande :', err);
        },
      });
  }

  handleMouseMove(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // 1. Si la souris est sur un bouton → zoom OFF
    if (target.classList.contains('no-zoom')) {
      this.showZoom = false;
      return;
    }

    // 2. Sinon → zoom ON (toujours actif sur l'image)
    this.showZoom = true;

    // 3. Mise à jour normale de la position du zoom
    const frame = (event.currentTarget as HTMLElement).getBoundingClientRect();

    const x = event.clientX - frame.left;
    const y = event.clientY - frame.top;

    const xPercent = (x / frame.width) * 100;
    const yPercent = (y / frame.height) * 100;

    this.backgroundPosition = `${xPercent}% ${yPercent}%`;
  }

  handleMouseLeave(): void {
    this.showZoom = false;
  }

  // Gestion des clics sur les tags
  onTagClicked(tagId: number): void {
    const tagName = this.tags.find(t => t.id === tagId)?.name;

    if (!tagName) return;
    this.router.navigate(['/search'], {
      queryParams: {
        tag: tagId,
      },
    });
  }
}
