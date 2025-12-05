import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITag } from 'app/entities/tag/tag.model';

@Component({
  selector: 'app-tag-label',
  templateUrl: './tag-label.component.html',
  styleUrls: ['./tag-label.component.scss'],
})
export class TagLabelComponent {
  rotation: number = 0; // in degrees

  ngOnInit(): void {
    // Random tilt between -2 and 2 degrees
    this.rotation = Math.random() * 4 - 2;
  }

  @Input() tag!: ITag;

  /** Is tag selected (highlighted) */
  @Input() selected = false;

  /** Event emitted when tag is clicked */
  @Output() toggled = new EventEmitter<number>();

  get color(): string {
    // Static array of colors representing Magic: The Gathering mana colors
    const vibrantMtgColors = [
      '#FFF4A8', // White — bright, sunlit
      '#6DB8FF', // Blue — vibrant sky
      '#3A2E3F', // Black — deep, rich, vampiric purple-black
      '#FF6A5A', // Red — saturated ember red
      '#34D17A', // Green — lush, magical forest
      '#F7C846', // Gold — treasure style
      '#B06CF8', // Purple — arcane, mystic
    ];

    return vibrantMtgColors[this.tag.id! % vibrantMtgColors.length];
  }

  // Adjust text color based on background for readability
  getContrastColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#1f1f1f' : '#ffffff';
  }

  onClick(): void {
    this.toggled.emit(this.tag.id!);
  }
}
