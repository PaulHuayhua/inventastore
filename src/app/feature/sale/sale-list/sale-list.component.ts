import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../../core/services/sale.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ProductService } from '../../../core/services/product';
import { UserService } from '../../../core/services/user.service';
import { SaleWithDetails, SaleDetail } from '../../../core/interfaces/sale';
import { Customer } from '../../../core/interfaces/customer';
import { Product } from '../../../core/interfaces/product';
import { User } from '../../../core/interfaces/user';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SaleListComponent implements OnInit {
  sales: SaleWithDetails[] = [];
  customers: Customer[] = [];
  products: Product[] = [];
  users: User[] = [];

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

  loadAllData(): void {
    this.saleService.getSales().subscribe((sales: SaleWithDetails[]) => {
      this.sales = sales;
    });

    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers.map(c => ({
        ...c,
        fullName: `${c.first_name} ${c.last_name}`
      }));
    });

    this.productService.findAll().subscribe(products => this.products = products);

    this.userService.getAll().subscribe(users => this.users = users);
  }

  getCustomerName(id: number | undefined): string {
    const customer = this.customers.find(c => c.identifier === id);
    return customer?.fullName ?? 'Desconocido';
  }

  getUserName(id: number | undefined): string {
    const user = this.users.find(u => u.identifier === id);
    return user?.name ?? 'Desconocido';
  }

  getProductName(id: number | undefined): string {
    const product = this.products.find(p => p.identifier === id);
    return product?.name ?? 'Desconocido';
  }

viewSale(sale: SaleWithDetails): void {
  // Navega al formulario en modo solo lectura
  this.router.navigate(['sales/form', sale.identifier], { queryParams: { view: true } });
}

editSale(sale: SaleWithDetails): void {
  // Navega al formulario en modo edición
  this.router.navigate(['sales/form', sale.identifier]);
}


}
