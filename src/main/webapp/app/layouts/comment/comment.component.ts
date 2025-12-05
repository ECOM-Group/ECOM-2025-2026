import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { IReview, NewReview } from 'app/entities/review/review.model';

@Component({
  selector: 'jhi-comment',
  standalone: true,
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() productId!: number;

  canComment = false;
  hasAlreadyCommented = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<boolean>(`/api/products/has-been-purchased/${this.productId}`).subscribe({
      next: hasBeenPurchased => {
        this.canComment = hasBeenPurchased;
        if (!hasBeenPurchased) return;

        this.http.get<IReview[]>(`/api/reviews/exists/${this.productId}`).subscribe({
          next: reviews => {
            this.hasAlreadyCommented = reviews.length > 0;
          },
          error: _ => {
            this.canComment = false;
          },
        });
      },
      error: _ => {
        this.canComment = false;
      },
    });
  }

  openPopup() {
    Swal.fire({
      title: 'Votre note et commentaire',
      html: `
      <div>
        <div id="stars" style="font-size: 28px; margin-bottom: 10px; cursor: pointer;">
          ★★★★★
        </div>
        <textarea id="comment-text"
          class="swal2-textarea"
          placeholder="Votre commentaire..."
          rows="4"
        ></textarea>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Envoyer',
      cancelButtonText: 'Annuler',
      didOpen: () => {
        const stars = document.getElementById('stars')!;
        let currentRating = 5; // ⭐ Par défaut 5 étoiles

        // Fonction pour afficher les étoiles selon currentRating
        const renderStars = () => {
          stars.innerHTML = '';
          for (let i = 1; i <= 5; i++) {
            stars.innerHTML += `<span data-index="${i}" style="color:${i <= currentRating ? '#ffc107' : '#ddd'}; cursor:pointer;">★</span>`;
          }
        };

        renderStars(); // Affiche initialement 5 étoiles jaunes

        // Gestion du clic sur les étoiles
        stars.addEventListener('click', (event: any) => {
          if (event.target.dataset.index) {
            currentRating = parseInt(event.target.dataset.index, 10);
            renderStars();
          }
        });

        // Fonction pour récupérer la note
        (Swal as any).getRating = () => currentRating;
      },
      preConfirm: () => {
        const comment = (document.getElementById('comment-text') as HTMLTextAreaElement).value;
        const rating = (Swal as any).getRating();

        if (!rating) {
          Swal.showValidationMessage('Veuillez mettre une note (1 à 5)');
          return false;
        }
        if (!comment.trim()) {
          Swal.showValidationMessage('Le commentaire ne peut pas être vide');
          return false;
        }

        return { comment, rating };
      },
    }).then(result => {
      if (result.isConfirmed) {
        this.sendComment(result.value.comment, result.value.rating);
      }
    });
  }

  sendComment(content: string, rating: number) {
    const review: NewReview = {
      id: null,
      desc: content,
      grade: rating,
      user: null,
      product: { id: this.productId },
    };

    this.http.post('/api/reviews', review).subscribe({
      next: () => {
        Swal.fire('Envoyé !', 'Votre commentaire a été enregistré.', 'success');
      },
      error: () => {
        Swal.fire('Erreur', "Impossible d'envoyer le commentaire.", 'error');
      },
    });
  }
}
