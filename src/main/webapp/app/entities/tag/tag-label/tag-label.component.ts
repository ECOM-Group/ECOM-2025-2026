import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITag } from 'app/entities/tag/tag.model';

@Component({
  selector: 'app-tag-label',
  templateUrl: './tag-label.component.html',
  styleUrls: ['./tag-label.component.scss'],
})
export class TagLabelComponent {
  /** Tag entity to display */
  @Input() tag!: ITag;

  /** Is tag selected (highlighted) */
  @Input() selected = false;

  /** Event emitted when tag is clicked */
  @Output() toggled = new EventEmitter<number>();

  onClick(): void {
    this.toggled.emit(this.tag.id!);
  }
}
