import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Alert } from '../../../shared/components/alert/alert';
import { UserService } from '../../../core/services/user.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ProductService } from '../../../core/services/product';
import { SaleService } from '../../../core/services/sale.service';
import { SaleDetail } from '../../../core/interfaces/sale';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatTableModule, MatIconModule, Alert
  ],
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss']
})
export class SaleForm implements OnInit {
  form!: FormGroup;
  isReadOnly = false;

  users: any[] = [];
  customers: any[] = [];
  products: any[] = [];

  detalles: SaleDetail[] = [];
  detalle: SaleDetail = { productIdentifier: 0, amount: 0, subtotal: 0 };

  displayedDetailColumns: string[] = [];
  showAlert = false;
  confirmAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'info' | 'warning' = 'info';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private customerService: CustomerService,
    private productService: ProductService,
    private saleService: SaleService
  ) {
    this.form = this.fb.group({
      user_identifier: [null, Validators.required],
      customer_identifier: [null, Validators.required],
      payment_method: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const isView = this.route.snapshot.queryParamMap.get('view');
    if (isView === 'true') {
      this.isReadOnly = true;
      this.form.disable();
    }

    this.displayedDetailColumns = this.isReadOnly
      ? ['producto','cantidad','precio','subtotal']
      : ['producto','cantidad','precio','subtotal','accion'];

    this.userService.getAll().subscribe(users => this.users = users);
    this.customerService.getCustomers().subscribe(customers => this.customers = customers);
    this.productService.findAll().subscribe(products => this.products = products);
  }

  calcularSubtotal() {
    this.detalle.subtotal = this.detalle.amount * (this.detalle.unitPrice ?? 0);
  }

  agregarDetalle() {
    if (!this.detalle.productIdentifier || this.detalle.amount <= 0 || (this.detalle.unitPrice ?? 0) <= 0) {
      this.showAlertMessage('Completa correctamente los campos del detalle', 'warning');
      return;
    }
    this.detalles.push({ ...this.detalle });
    this.detalle = { productIdentifier: 0, amount: 0, subtotal: 0 };
  }

  eliminarDetalle(index: number) {
    if (this.isReadOnly) return;
    this.detalles.splice(index, 1);
  }

  calcularTotalVenta() {
    return this.detalles.reduce((acc, det) => acc + det.subtotal, 0);
  }

  getNombreProducto(id?: number) {
    if (id == null) return 'Desconocido';
    return this.products.find(p => p.identifier === id)?.name ?? 'Desconocido';
  }

  onlyNumbers(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) event.preventDefault();
  }

  onlyDecimal(event: KeyboardEvent) {
    if (!/[0-9.]/.test(event.key)) event.preventDefault();
  }

  onSubmit() {
    if (this.form.invalid || this.detalles.length === 0) {
      this.showAlertMessage('Completa todos los campos antes de registrar', 'warning');
      return;
    }
    this.showAlertMessage('¿Deseas registrar esta venta?', 'info', true);
  }

  handleAlertConfirm(confirmed: boolean) {
    if (!confirmed) return;
    this.showAlertMessage('Venta registrada exitosamente', 'success');
    setTimeout(() => this.onCancel(), 2500);
  }

  onCancel() {
    this.router.navigate(['sales']);
  }

  showAlertMessage(message: string, type: 'success' | 'error' | 'info' | 'warning', confirm = false) {
    this.alertMessage = message;
    this.alertType = type;
    this.confirmAlert = confirm;
    this.showAlert = true;
  }
}
