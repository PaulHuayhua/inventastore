import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BuyService } from '../../../core/services/buy.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { Buy } from '../../../core/interfaces/buy';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Alert } from '../../../shared/components/alert/alert';
import { UserService } from '../../../core/services/user.service';
import { ProductService } from '../../../core/services/product';
import { User } from '../../../core/interfaces/user';
import { Product } from '../../../core/interfaces/product';

@Component({
  selector: 'app-buy-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatIconModule,
    Alert
  ],
  templateUrl: './buy-form.html',
  styleUrls: ['./buy-form.scss']
})
export class BuyForm implements OnInit {
  form!: FormGroup;
  isReadOnly = false;

  suppliers: { identifier: number; company: string }[] = [];
  users: User[] = [];
  products: Product[] = [];
  detalles: {
    product_identifier: number;
    amount: number;
    unitCost: number;
    subtotal: number;
  }[] = [];

  detalle = {
    product_identifier: '',
    amount: 0,
    unitCost: 0,
    subtotal: 0
  };

  displayedDetailColumns: string[] = [];

  showAlert = false;
  confirmAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'info' | 'warning' = 'info';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private buyService: BuyService,
    private supplierService: SupplierService,
    private userService: UserService,
    private productService: ProductService
  ) {
    this.form = this.fb.group({
      code: [''],
      user_identifier: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      supplier_identifier: ['', Validators.required],
      payment_method: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/)]]
    });
  }

  ngOnInit(): void {
    const identifier = this.route.snapshot.paramMap.get('id');
    const isView = this.route.snapshot.queryParamMap.get('view');

    if (isView === 'true' && identifier) {
      this.isReadOnly = true;
      this.form.disable();
      this.loadCompra(+identifier);
    }

    this.displayedDetailColumns = this.isReadOnly
      ? ['producto', 'cantidad', 'costo', 'subtotal']
      : ['producto', 'cantidad', 'costo', 'subtotal', 'accion'];

    this.supplierService.findAll().subscribe((s) => {
      this.suppliers = s.filter((supplier) => supplier.state === 'A');
    });

    this.userService.getAll().subscribe(users => this.users = users);
    this.productService.findAll().subscribe(products => this.products = products);
  }

  loadCompra(id: number): void {
    this.buyService.findById(id).subscribe((buy: Buy) => {
      this.form.patchValue({
        code: buy.code,
        user_identifier: buy.user_identifier,
        supplier_identifier: buy.supplier_identifier,
        payment_method: buy.payment_method
      });
      this.detalles = buy.details;
    });
  }

  calcularSubtotal(): void {
    const cantidad = +this.detalle.amount;
    const costo = +this.detalle.unitCost;
    this.detalle.subtotal = cantidad * costo;
  }

  agregarDetalle(): void {
    if (this.isReadOnly) return;

    if (
      !this.detalle.product_identifier ||
      +this.detalle.amount <= 0 ||
      +this.detalle.unitCost <= 0
    ) {
      this.alertMessage = 'Completa correctamente los campos del detalle';
      this.alertType = 'warning';
      this.confirmAlert = false;
      this.showAlert = true;
      return;
    }

    this.detalles = [
      ...this.detalles,
      {
        product_identifier: +this.detalle.product_identifier,
        amount: +this.detalle.amount,
        unitCost: +this.detalle.unitCost,
        subtotal: +this.detalle.subtotal
      }
    ];

    this.detalle = {
      product_identifier: '',
      amount: 0,
      unitCost: 0,
      subtotal: 0
    };
  }

  eliminarDetalle(index: number): void {
    if (this.isReadOnly) return;
    this.detalles = this.detalles.filter((_, i) => i !== index);
  }

  calcularTotalCompra(): number {
    return this.detalles.reduce((total, det) => total + +det.subtotal, 0);
  }

  getNombreProducto(id: number): string {
    return this.products.find(p => p.identifier === id)?.name || 'Desconocido';
  }

  onSubmit(): void {
    if (this.isReadOnly) return;

    if (this.form.invalid || this.detalles.length === 0) {
      this.alertMessage = 'Completa todos los campos antes de registrar';
      this.alertType = 'warning';
      this.confirmAlert = false;
      this.showAlert = true;
      return;
    }

    this.alertMessage = '¿Deseas registrar esta compra?';
    this.alertType = 'info';
    this.confirmAlert = true;
    this.showAlert = true;
  }

  handleAlertConfirm(confirmed: boolean) {
    this.showAlert = false;
    this.confirmAlert = false;

    if (!confirmed) {
      return;
    }

    const compra: Buy = {
      code: '',
      buysDate: '',
      user_identifier: +this.form.value.user_identifier,
      supplier_identifier: +this.form.value.supplier_identifier,
      payment_method: this.form.value.payment_method,
      totalPrice: 0,
      details: this.detalles.map(d => ({
        product_identifier: +d.product_identifier,
        amount: +d.amount,
        unitCost: +d.unitCost,
        subtotal: +d.subtotal
      }))
    };

    this.buyService.save(compra).subscribe({
      next: () => {
        this.setAlert('Compra registrada exitosamente', 'success');

        // Espera 2.5 segundos antes de redirigir
        setTimeout(() => {
          this.onCancel();
        }, 2500);
      },
      error: () => {
        this.setAlert('Error al registrar la compra', 'error');
      }
    });

  }


  setAlert(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.showAlert = false;
    setTimeout(() => {
      this.alertMessage = message;
      this.alertType = type;
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    }, 0);
  }

  onlyNumbers(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  onlyDecimal(event: KeyboardEvent) {
    const pattern = /[0-9\.]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  onCancel(): void {
    this.router.navigate(['buys']);
  }
}