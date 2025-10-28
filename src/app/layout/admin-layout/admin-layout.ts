import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.scss']
})
export class AdminLayout {
  sidebarExpanded = true;
  constructor(private router: Router) {}

  onToggleSidebar(expanded: boolean) {
    this.sidebarExpanded = expanded;
  }
  
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }
}