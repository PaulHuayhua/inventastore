import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, startWith, map, switchMap } from 'rxjs';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ProductService } from '../../../core/services/product';
import { CustomerService } from '../../../core/services/customer.service';
import { UserService } from '../../../core/services/user.service';
import { SaleService } from '../../../core/services/sale.service';

import { Product } from '../../../core/interfaces/product';
import { Customer } from '../../../core/interfaces/customer';
import { User } from '../../../core/interfaces/user';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class SaleFormComponent implements OnInit {
  saleForm!: FormGroup;
  products: Product[] = [];
  users: User[] = [];

  filteredProducts!: Observable<Product[]>;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private customerService: CustomerService,
    private saleService: SaleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    this.setupAutocomplete();
    this.setupSubtotalCalculation();
  }

  initForm(): void {
    this.saleForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      userIdentifier: [''],
      issueDate: [new Date()],
      paymentMethod: ['Efectivo'],
      productInput: [''], // Campo de autocomplete
      product: [null],    // Producto seleccionado
      quantity: [1],
      subtotal: [{ value: 0, disabled: true }]
    });
  }

  loadData(): void {
    this.productService.findAll().subscribe(products => this.products = products);
    this.userService.getAll().subscribe(users => this.users = users);
  }

  setupAutocomplete(): void {
    this.filteredProducts = this.saleForm.get('productInput')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.name),
      map(name => name ? this.filterProducts(name) : this.products.slice())
    );
  }

  filterProducts(name: string): Product[] {
    const filterValue = name.toLowerCase();
    return this.products.filter(product => product.name.toLowerCase().includes(filterValue));
  }

  displayProduct(product: Product): string {
    return product ? `${product.name} - ${product.description} (${product.volumeWeight})` : '';
  }

  setupSubtotalCalculation(): void {
    this.saleForm.get('productInput')!.valueChanges.subscribe(value => {
      if (typeof value === 'object') {
        this.saleForm.get('product')!.setValue(value);
      } else {
        this.saleForm.get('product')!.setValue(null);
      }
      this.updateSubtotal();
    });
    this.saleForm.get('quantity')!.valueChanges.subscribe(() => this.updateSubtotal());
  }

  updateSubtotal(): void {
    const product: Product = this.saleForm.get('product')!.value;
    const quantity: number = this.saleForm.get('quantity')!.value;
    const subtotal = product && quantity ? product.price * quantity : 0;
    this.saleForm.get('subtotal')!.setValue(subtotal);
  }

  formatDateToLocalDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    const seconds = `${date.getSeconds()}`.padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  submit(): void {
    const formValue = this.saleForm.getRawValue();

    if (!formValue.product) {
      // Aquí podrías reemplazar con tu AlertComponent si quieres
      alert('Seleccione un producto válido');
      return;
    }

    const customerData = {
      first_name: formValue.firstName,
      last_name: formValue.lastName
    };

    this.customerService.createCustomer(customerData).pipe(
      switchMap(customerCreated => {
        const formattedDate = this.formatDateToLocalDateTime(new Date(formValue.issueDate));
        const salePayload = {
          issueDate: formattedDate,
          paymentMethod: formValue.paymentMethod,
          customerIdentifier: customerCreated.identifier,
          userIdentifier: formValue.userIdentifier,
          total_price: formValue.subtotal,
          details: [
            {
              productIdentifier: formValue.product.identifier,
              amount: formValue.quantity,
              subtotal: formValue.subtotal
            }
          ]
        };

        console.log('Payload final enviado al backend:', salePayload);
        return this.saleService.createSale(salePayload);
      })
    ).subscribe({
      next: () => {
        alert('Venta registrada correctamente');
        this.router.navigate(['/sales']);
      },
      error: () => alert('No se pudo registrar la venta')
    });
  }

  cancel(): void {
    this.router.navigate(['/sales']);
  }
}
