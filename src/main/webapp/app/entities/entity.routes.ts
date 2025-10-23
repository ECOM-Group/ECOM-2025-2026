import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'ecom20252026App.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'customer',
    data: { pageTitle: 'ecom20252026App.customer.home.title' },
    loadChildren: () => import('./customer/customer.routes'),
  },
  {
    path: 'address',
    data: { pageTitle: 'ecom20252026App.address.home.title' },
    loadChildren: () => import('./address/address.routes'),
  },
  {
    path: 'product',
    data: { pageTitle: 'ecom20252026App.product.home.title' },
    loadChildren: () => import('./product/product.routes'),
  },
  {
    path: 'tag',
    data: { pageTitle: 'ecom20252026App.tag.home.title' },
    loadChildren: () => import('./tag/tag.routes'),
  },
  {
    path: 'illustrator',
    data: { pageTitle: 'ecom20252026App.illustrator.home.title' },
    loadChildren: () => import('./illustrator/illustrator.routes'),
  },
  {
    path: 'prod-order',
    data: { pageTitle: 'ecom20252026App.prodOrder.home.title' },
    loadChildren: () => import('./prod-order/prod-order.routes'),
  },
  {
    path: 'order-line',
    data: { pageTitle: 'ecom20252026App.orderLine.home.title' },
    loadChildren: () => import('./order-line/order-line.routes'),
  },
  {
    path: 'review',
    data: { pageTitle: 'ecom20252026App.review.home.title' },
    loadChildren: () => import('./review/review.routes'),
  },
  {
    path: 'payement-tunnel',
    data: { pageTitle: 'ecom20252026App.payementTunnel.home.title' },
    loadChildren: () => import('./payement-tunnel/payement-tunnel.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
