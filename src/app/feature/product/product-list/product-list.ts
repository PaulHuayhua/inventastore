import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/interfaces/product';
import { Alert } from '../../../shared/components/alert/alert';
import { FriendlyDatePipe } from '../../../core/pipes/friendly-date.pipe';
import { PenCurrencyPipe } from '../../../core/pipes/pen-currency.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatTableModule,
    Alert,
    FriendlyDatePipe,
    PenCurrencyPipe
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductList implements OnInit {
  dataSource = new MatTableDataSource<Product>([]);
  private products: Product[] = [];

  totalProductos = 0;
  productosActivos = 0;
  stockBajo = 0;
  sinStock = 0;
  valorTotal = 0;

  estadoFiltro: 'todos' | 'activo' | 'inactivo' = 'todos';
  textoFiltro = '';
  categoriaFiltro = 'todas';
  categorias: string[] = [];

  showAlert = false;
  confirmAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'info' | 'warning' = 'info';
  productToDelete: Product | null = null;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  ngOnInit() {
    this.route.data.subscribe(({ products }) => {
      this.products = products;
      this.categorias = [...new Set(this.products.map(p => p.category))];
      this.applyAllFilters();
      this.calcularIndicadores();
    });
  }

  applyAllFilters(): void {
    let filtered = [...this.products];

    if (this.estadoFiltro !== 'todos') {
      filtered = filtered.filter(p =>
        this.estadoFiltro === 'activo' ? p.state === 'A' : p.state === 'I'
      );
    }

    if (this.categoriaFiltro !== 'todas') {
      filtered = filtered.filter(p => p.category === this.categoriaFiltro);
    }

    const texto = this.textoFiltro.trim().toLowerCase();
    if (texto) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(texto) ||
        p.description.toLowerCase().includes(texto) ||
        p.category.toLowerCase().includes(texto)
      );
    }

    this.dataSource.data = filtered;
    this.calcularIndicadores();
  }

  applyFilter(event: Event) {
    this.textoFiltro = (event.target as HTMLInputElement).value;
    this.applyAllFilters();
  }

  filtrarPorEstado() {
    this.applyAllFilters();
  }

  private calcularIndicadores() {
    this.totalProductos = this.products.length;
    this.productosActivos = this.products.filter(p => p.state === 'A').length;
    this.stockBajo = this.products.filter(p => p.stock > 0 && p.stock <= 5).length;
    this.sinStock = this.products.filter(p => p.stock === 0).length;
    this.valorTotal = this.products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  }

  onEdit(product: Product) {
    this.router.navigate(['form', product.identifier], { relativeTo: this.route });
  }

  onDelete(product: Product) {
    this.alertMessage = `¿Estás seguro de desactivar el producto ${product.name}?`;
    this.alertType = 'warning';
    this.confirmAlert = true;
    this.showAlert = true;
    this.productToDelete = product;
  }

  onRestore(product: Product) {
    this.alertMessage = `¿Estás seguro de restaurar el producto ${product.name}?`;
    this.alertType = 'info';
    this.confirmAlert = true;
    this.showAlert = true;
    this.productToDelete = product;
  }

  handleAlertConfirm(confirmed: boolean) {
    if (confirmed && this.productToDelete) {
      const id = this.productToDelete.identifier!;
      const esActivo = this.productToDelete.state === 'A';

      const request$ = esActivo
        ? this.productService.updateState(id)
        : this.productService.restoreProduct(id);

      request$.subscribe({
        next: updated => {
          this.products = this.products.map(p =>
            p.identifier === updated.identifier ? updated : p
          );
          this.applyAllFilters();
          this.setAlert(esActivo ? 'Producto desactivado' : 'Producto restaurado', 'success');
        },
        error: err => {
          console.error(err);
          this.setAlert('Error al actualizar el producto.', 'error');
        }
      });
    }

    this.showAlert = false;
    this.confirmAlert = false;
  }

  setAlert(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), 3000);
  }

  reportPdf() {
    this.productService.reportPdf().subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte_producto.pdf';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  sortData(column: keyof Product) {
    this.dataSource.data.sort((a, b) => {
      const valA = a[column] ?? '';
      const valB = b[column] ?? '';
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    });
  }
}
