import { Component, Input } from '@angular/core';
import { Reward } from '../../models/reward.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-brand-card',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './brand-card.component.html',
  styleUrl: './brand-card.component.scss'
})
export class BrandCardComponent {
  @Input() reward!: Reward;
}
