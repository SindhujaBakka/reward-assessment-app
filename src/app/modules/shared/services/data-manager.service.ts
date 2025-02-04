import { computed, inject, Injectable, signal } from '@angular/core';
import { RewardState } from '../models/reward-state.model';
import { ApiService } from './api.service';
import { catchError, EMPTY, take, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Reward } from '../models/reward.model';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  // Services
  private apiService = inject(ApiService);

  // Data State
  private state = signal<RewardState>({
    isLoading: false,
    data: [],
    error: null,
  });

  // Selectors
  isLoading = computed(() => this.state().isLoading);
  errorMessage = computed(() => this.state().error);
  data = computed(() => this.state().data);

  // Reducers
  getRewardsData = () => {
    this.setLoadingIndicator(true);
    return this.apiService.getRewards()
            .pipe(
              take(1),
              catchError((error) => {
                  this.setError(error);
                  return EMPTY;
              }),
              tap((res: Reward[]) => {
                  this.state.update(state => ({
                      ...state,
                      data: res ?? [],
                      isLoading: false
                  }))
              })
            );
}

  private setLoadingIndicator(isLoading: boolean) {
    this.state.update(state => ({
    ...state,
    isLoading: isLoading
    }));
  }

  private setError(err: HttpErrorResponse) {
    const errorMessage = err.error instanceof ErrorEvent ? err.error.message : 
                          (err.error.error ? err.error.error : err.error ?? err.message);
    this.state.update(state => ({
        ...state,
        error: `${errorMessage}`,
        isLoading: false
    }));
}
}
