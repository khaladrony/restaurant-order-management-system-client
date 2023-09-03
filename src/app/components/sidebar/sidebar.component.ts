import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  type: string;
  isCollapsed: boolean;
  children: any;
}
export const ROUTES: RouteInfo[] = [
  {
    path: '/admin/user-profile', title: 'User profile', icon: 'ni-single-02 text-yellow',  type: 'submenu', isCollapsed: true,
    children: [
      { path: '/admin/user-profile', title: 'User', type: 'link' },
      { path: '/admin/role', title: 'Roles', type: 'link' },
      { path: '/admin/feature', title: 'Features', type: 'link' },
      { path: '/admin/feature-map', title: 'Features Mapping', type: 'link' }
    ]
  },
  // { path: '/admin/organization', title: 'Organization', icon: 'ni-world-2 text-info', class: '', type: 'link', isCollapsed: false, collapse: '', children: [] },
  { path: '/admin/restaurant', title: 'Restaurant Info', icon: 'ni-basket text-info', type: 'link', isCollapsed: false, children: [] },
  { path: '/admin/food-category', title: 'Food Category', icon: 'ni-chart-pie-35 text-default', type: 'link', isCollapsed: false, children: [] },
  { path: '/admin/dish', title: 'Dish', icon: 'ni-palette text-danger', type: 'link', isCollapsed: false, children: [] },
  // { path: '/admin/customer-order', title: 'Order', icon: 'ni-cart text-success', type: 'link', isCollapsed: false, children: [] },
  { path: '/admin/restaurant-dish', title: 'Restaurant Dish', icon: 'ni-cart text-success', type: 'link', isCollapsed: false, children: [] }
  
];

export const ALLROUTES: any[] = [
  { path: '/admin/user-profile', title: 'User' },
  { path: '/admin/role', title: 'Roles' },
  { path: '/admin/feature', title: 'Features' },
  { path: '/admin/feature-map', title: 'Features Mapping' },
  // { path: '/admin/organization', title: 'Organization' },
  { path: '/admin/restaurant', title: 'Restaurant Information'},
  { path: '/admin/food-category', title: 'Food Category'},
  { path: '/admin/dish', title: 'Dish'},
  { path: '/admin/customer-order', title: 'Order'},
  { path: '/admin/restaurant-dish', title: 'Restaurant Dish'}
]

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
