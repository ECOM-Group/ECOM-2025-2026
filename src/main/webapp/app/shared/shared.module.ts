import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCreditCard, faClockRotateLeft, faCartShopping, faReply } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faInstagram, faTwitter, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

import FindLanguageFromKeyPipe from './language/find-language-from-key.pipe';
import TranslateDirective from './language/translate.directive';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';

/**
 * Application wide Module
 */
@NgModule({
  imports: [AlertComponent, AlertErrorComponent, FindLanguageFromKeyPipe, TranslateDirective],
  exports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    AlertComponent,
    AlertErrorComponent,
    TranslateModule,
    FindLanguageFromKeyPipe,
    TranslateDirective,
  ],
})
export default class SharedModule {
    // ⬇️ AJOUTER UN CONSTRUCTEUR ET INJECTER FaIconLibrary
    constructor(iconLibrary: FaIconLibrary) {
        // Ajouter les icônes 'Solid'
        iconLibrary.addIcons(faCreditCard, faClockRotateLeft, faCartShopping, faReply);

        // Ajouter les icônes 'Brands'
        iconLibrary.addIcons(faLinkedin, faInstagram, faTwitter, faFacebookF);
    }
}
