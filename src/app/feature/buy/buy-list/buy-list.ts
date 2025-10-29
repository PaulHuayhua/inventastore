import { Component, inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BuyService } from '../../../core/services/buy.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { Buy, BuyDetail } from '../../../core/interfaces/buy';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user';

@Component({
  standalone: true,
  selector: 'app-buy-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './buy-list.html',
  styleUrls: ['./buy-list.scss']
})
export class BuyList implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'code',
    'buys_date',
    'user_identifier',
    'supplier_identifier',
    'payment_method',
    'totalPrice',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Buy>([]);
  private buyService = inject(BuyService);
  private supplierService = inject(SupplierService);
  private userService = inject(UserService);
  private router = inject(Router);

  @ViewChild(MatSort) sort!: MatSort;

  suppliers: { identifier: number, company: string }[] = [];
  users: { identifier: number, name: string }[] = [];

  ngOnInit(): void {
    this.loadBuys();
    this.loadSuppliers();
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadBuys(): void {
    this.buyService.findAll().subscribe(buys => {
      this.dataSource.data = buys;
    });
  }

  loadSuppliers(): void {
    this.supplierService.findAll().subscribe(suppliers => {
      this.suppliers = suppliers;
    });
  }
  loadUsers(): void {
    this.userService.getAll().subscribe(users => {
      this.users = users;
    });
  }

  getSupplierName(identifier: number): string {
    return this.suppliers.find(s => s.identifier === identifier)?.company || 'Desconocido';
  }
  getUserName(identifier: number): string {
    return this.users.find(u => u.identifier === identifier)?.name || 'Desconocido';
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  goBuyForm(): void {
  this.buyService.setSelectedBuy(null);
  this.router.navigate(['buys', 'form']);  // Path para crear nueva compra
  }



  reportPdf(id: number) {
    this.buyService.reportPdf(id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket_compra_${id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  verDetalle(buy: Buy): void {
    this.router.navigate(['buys', 'form', buy.identifier], {
      queryParams: { view: true }
    });
  }

}