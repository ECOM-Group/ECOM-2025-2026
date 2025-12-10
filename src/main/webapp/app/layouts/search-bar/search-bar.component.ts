import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'jhi-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
})
export class SearchBarComponent {
  query = '';

  constructor(private router: Router) {}

  onSearch(): void {
    if (!this.query.trim()) return;

    this.router.navigate(['/search'], {
      queryParams: { q: this.query },
    });

    this.query = '';
  }
}
