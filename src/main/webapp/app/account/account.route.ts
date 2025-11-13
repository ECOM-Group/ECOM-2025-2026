import { Routes } from '@angular/router';

import activateRoute from './activate/activate.route';
import passwordRoute from './password/password.route';
import orderHistoryRoute from './order-history/order-history.route';
import passwordResetFinishRoute from './password-reset/finish/password-reset-finish.route';
import passwordResetInitRoute from './password-reset/init/password-reset-init.route';
import registerRoute from './register/register.route';
import settingsRoute from './settings/settings.route';

const accountRoutes: Routes = [
  activateRoute,
  passwordRoute,
  orderHistoryRoute,
  passwordResetFinishRoute,
  passwordResetInitRoute,
  registerRoute,
  settingsRoute,
];

export default accountRoutes;
