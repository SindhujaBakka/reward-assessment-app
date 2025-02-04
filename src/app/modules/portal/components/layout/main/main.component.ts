import { Component, effect, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataManagerService } from '../../../../shared/services/data-manager.service';
import { BrandCardComponent } from "../../../../shared/components/brand-card/brand-card.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reward } from '../../../../shared/models/reward.model';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SortOrder } from '../../../../shared/enums/sort-order.enum';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [BrandCardComponent, CommonModule, FormsModule, PaginationModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  private spinner = inject(NgxSpinnerService);
  private dataManagerService = inject(DataManagerService);
  
  private isLoading = this.dataManagerService.isLoading;

  rewardsData = this.dataManagerService.data;
  searchTerm = '';
  perPageOptions: number[] = [20, 40, 60, 80]; 
  itemsPerPage: number = this.perPageOptions[0]; 
  currentPage: number = 1;
  totalItems: number = 0;

  isFilterPanelOpen = false;
  sortOrder: string = SortOrder.AToZ;
  selectedSortOrder: string = '';
  SortOrderEnum = SortOrder;
  categories = [
    { name: 'e-Voucher', selected: true },
    { name: 'Products', selected: false },
    { name: 'Evergreen', selected: false },
    { name: 'Fashion & Retail', selected: false }
  ];

  // For Loading Data asynchronously
  #dataLoadingEffect = () => {
    if (this.isLoading()) {
      this.spinner.show();
    } else {
      this.spinner.hide();
    }
  }

  constructor() {
    effect(this.#dataLoadingEffect);
    this.dataManagerService.getRewardsData().subscribe();
    effect(() => {
      this.totalItems = this.rewardsData().length;
    }, {allowSignalWrites: true})
  }

  ngOnInit() {
    this.totalItems = this.rewardsData().length;
  }

  /// FILTERS
  removeFilter(filter: string) {
    const category = this.categories.find(c => c.name === filter);
    if (category) {
      category.selected = false;
    }
  }

  clearAllFilters() {
    this.categories.forEach(category => category.selected = false);
  }

  /// PAGINATION
  getPaginatedData(): any[] {
    if (!this.rewardsData() || this.rewardsData().length === 0) return []; 

    const sortedData = this.getSortedData();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return sortedData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
  }

  updatePagination() {
    this.totalItems = this.rewardsData().length; 
    this.currentPage = 1; 
  }

  /// SORTING
  getSortedData() {
    let sortedData = [...this.rewardsData()];
  
    if (this.sortOrder === SortOrder.AToZ) {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOrder === SortOrder.ZToA) {
      sortedData.sort((a, b) => b.name.localeCompare(a.name));
    }
  
    return sortedData;
  }

  toggleFilterPanel() {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
    if(this.isFilterPanelOpen) {
      this.selectedSortOrder = this.sortOrder;
    }
  }

  updateSort(order: string) {
    this.selectedSortOrder = order;
  }

  applySort() {
    this.isFilterPanelOpen = false; 
    this.sortOrder = this.selectedSortOrder;
    this.selectedSortOrder = "";
  }
}
