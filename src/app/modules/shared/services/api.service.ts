import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reward } from '../models/reward.model';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = `assets/data/brand_records.json`;

  constructor(private http: HttpClient) { }

  getRewards() {
    return this.http.get<Reward[]>(this.apiUrl).pipe(delay(1000));
  }
}
