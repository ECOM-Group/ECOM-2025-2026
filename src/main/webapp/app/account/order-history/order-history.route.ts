import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrderHistoryComponent } from './order-history.component';

const orderHistoryRoute: Route = {
  path: 'orderHistory',
  component: OrderHistoryComponent,
  title: 'Historique',
  canActivate: [UserRouteAccessService],
};

export default orderHistoryRoute;
