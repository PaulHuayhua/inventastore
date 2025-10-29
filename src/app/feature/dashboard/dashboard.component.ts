import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { DashboardService } from '../../core/services/dashboard.service';
import { NotificationService } from '../../core/services/notification.service';

import { Sale } from '../../core/interfaces/sale';
import { Buy } from '../../core/interfaces/buy';
import { Product } from '../../core/interfaces/product';

interface NotificationItem {
  icon: string;
  color: 'primary' | 'accent' | 'warn';
  title: string;
  message: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatListModule
  ],
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  salesData = [
    { day: 'Lunes', total: 40 },
    { day: 'Martes', total: 70 },
    { day: 'Miércoles', total: 55 },
    { day: 'Jueves', total: 75 },
    { day: 'Viernes', total: 45 },
    { day: 'Sábado', total: 60 },
    { day: 'Domingo', total: 68 },
  ];

  lastSales = [
    { product: 'Yogurt', quantity: 2, date: '05-06-2025' },
    { product: 'KR', quantity: 1, date: '05-06-2025' },
  ];
  lastPurchases = [
    { product: 'Yogurt', quantity: 12, amount: 80 },
    { product: 'KR', quantity: 6, amount: 60 },
  ];
  salesColumns = ['product', 'quantity', 'date'];
  purchaseColumns = ['product', 'quantity', 'amount'];

  totalSales = 0;
  supplierCount = 0;
  activeProductCount = 0;
  purchaseCount = 0;

  recentSales: Sale[] = [];
  recentPurchases: Buy[] = [];
  notifications: NotificationItem[] = [];

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadNotifications();
    this.loadRecentActivity();
  }

  loadDashboardData(): void {
    this.dashboardService.getTotalSales().subscribe({
      next: total => this.totalSales = total,
      error: () => this.totalSales = 0
    });

    this.dashboardService.getSupplierCount().subscribe({
      next: count => this.supplierCount = count,
      error: () => this.supplierCount = 0
    });

    this.dashboardService.getActiveProductCount().subscribe({
      next: count => this.activeProductCount = count,
      error: () => this.activeProductCount = 0
    });

    this.dashboardService.getPurchaseCount().subscribe({
      next: count => this.purchaseCount = count,
      error: () => this.purchaseCount = 0
    });
  }

  loadRecentActivity(): void {
    this.notificationService.getRecentSales().subscribe({
      next: sales => this.recentSales = sales,
      error: () => this.recentSales = []
    });

    this.notificationService.getLastPurchase().subscribe({
      next: purchase => this.recentPurchases = [purchase],
      error: () => this.recentPurchases = []
    });
  }

  loadNotifications(): void {
    this.notifications = [];

    this.notificationService.getLowStock().subscribe({
      next: (products: Product[]) => {
        products.forEach(product => {
          this.notifications.push({
            icon: 'inventory_2',
            color: 'warn',
            title: 'Bajo stock',
            message: `${product.name} - Stock: ${product.stock}`
          });
        });
      },
      error: err => console.error(err)
    });

    this.notificationService.getExpiringSoon().subscribe({
      next: (products: Product[]) => {
        products.forEach(product => {
          const expiration = product.expirationDate
            ? new Date(product.expirationDate).toLocaleDateString()
            : 'Fecha no disponible';

          this.notifications.push({
            icon: 'event',
            color: 'accent',
            title: 'Próximo a vencer',
            message: `${product.name} - Vence: ${expiration}`
          });
        });
      },
      error: err => console.error(err)
    });

    this.notificationService.getRecentSales().subscribe({
      next: (sales: Sale[]) => {
        sales.forEach(sale => {
          this.notifications.push({
            icon: 'shopping_cart',
            color: 'primary',
            title: 'Venta reciente',
            message: `Venta #${sale.identifier} - Total: S/ ${sale.total_price ?? 0}`
          });
        });
      },
      error: err => console.error(err)
    });

    this.notificationService.getLastPurchase().subscribe({
      next: (purchase: Buy) => {
        const total = purchase.details.reduce(
          (acc, detail) => acc + detail.subtotal, 0
        );

        this.notifications.push({
          icon: 'local_shipping',
          color: 'primary',
          title: 'Compra reciente',
          message: `Compra #${purchase.identifier} - Total: S/ ${total}`
        });
      },
      error: err => console.error(err)
    });
  }

  removeNotification(index: number): void {
    this.notifications.splice(index, 1);
  }
}
