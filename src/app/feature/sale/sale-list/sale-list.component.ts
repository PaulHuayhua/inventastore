import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SaleService } from '../../../core/services/sale.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ProductService } from '../../../core/services/product';
import { UserService } from '../../../core/services/user.service';
import { SaleWithDetails } from '../../../core/interfaces/sale';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SaleListComponent implements OnInit {
  sales: SaleWithDetails[] = [];
  customerMap = new Map<number, string>();
  productMap = new Map<number, string>();
  userMap = new Map<number, string>();

  constructor(
    private saleService: SaleService,
    private customerService: CustomerService,
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  private loadAllData(): void {
    this.customerService.getCustomers().subscribe(customers => {
      customers.forEach(c => this.customerMap.set(c.identifier!, `${c.first_name} ${c.last_name}`));
    });

    this.productService.findAll().subscribe(products => {
      products.forEach(p => this.productMap.set(p.identifier!, p.name));
    });

    this.userService.getAll().subscribe(users => {
      users.forEach(u => this.userMap.set(u.identifier!, u.name));
    });

    this.saleService.getSales().subscribe(sales => {
      this.sales = sales;
    });
  }

  getCustomerName(id?: number): string {
    return id ? this.customerMap.get(id) ?? 'Desconocido' : 'Desconocido';
  }

  getUserName(id?: number): string {
    return id ? this.userMap.get(id) ?? 'Desconocido' : 'Desconocido';
  }

  getProductName(id?: number): string {
    return id ? this.productMap.get(id) ?? 'Desconocido' : 'Desconocido';
  }

  viewSale(sale: SaleWithDetails): void {
    this.router.navigate(['sales/form', sale.identifier], { queryParams: { view: true } });
  }

  editSale(sale: SaleWithDetails): void {
    this.router.navigate(['sales/form', sale.identifier]);
  }
}
