import { ProductActions } from './../../product/actions/product-actions';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { SearchActions } from './../../home/reducers/search.actions';
import { getTaxonomies } from './../../product/reducers/selectors';
import { getTotalCartItems } from './../../checkout/reducers/selectors';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Input
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../interfaces';
import { getAuthStatus } from '../../auth/reducers/selectors';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from '../../auth/actions/auth.actions';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Directive, Renderer2, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LayoutState } from '../reducers/layout.state';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(window:scroll)': 'updateHeader($event)'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  @Input() layoutState: LayoutState;
  freeShippingAmount = environment.config.freeShippingAmount
  currency = environment.config.currency_symbol
  isModalShown = false;
  isSearchopen = true;
  isAuthenticated: Observable<boolean>;
  totalCartItems: Observable<number>;
  taxonomies$: Observable<any>;
  user$: Observable<any>;
  headerConfig = environment.config.header;
  isScrolled = false;
  currPos: Number = 0;
  startPos: Number = 0;
  changePos: Number = 100;
  isMobile = false;
  screenwidth: any;
  modalRef: BsModalRef;
  config = {
    backdrop: false,
    ignoreBackdropClick: false
  };

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private authActions: AuthActions,
    private searchActions: SearchActions,
    private actions: ProductActions,
    private router: Router,
    private modalService: BsModalService,
    private renderer: Renderer2
  ) {
    this.taxonomies$ = this.store.select(getTaxonomies);
    this.store.dispatch(this.actions.getAllTaxonomies());
    if (this.isSearchopen) {
      this.renderer.addClass(document.body, 'issearchopen');
    } else {
      this.renderer.removeClass(document.body, 'issearchopen');
    }
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'cat-mobile' }, this.config)
    );
  }
  ngOnInit() {
    this.store.dispatch(this.authActions.authorize());
    this.store.dispatch(this.authActions.login());
    this.isAuthenticated = this.store.select(getAuthStatus);
    this.totalCartItems = this.store.select(getTotalCartItems);
    this.screenwidth = window.innerWidth;
    this.calculateInnerWidth();
  }
  calculateInnerWidth() {
    if (this.screenwidth <= 1000) {
      this.isScrolled = false;
      this.isMobile = this.screenwidth;
    }
  }
  selectTaxon(taxon) {
    this.router.navigateByUrl('/');
    this.store.dispatch(this.searchActions.addFilter(taxon));
  }
  showModal(): void {
    this.isModalShown = !this.isModalShown;
    this.isSearchopen = !this.isSearchopen;
    if (this.isModalShown) {
      this.renderer.addClass(document.body, 'isModalShown');
    } else {
      this.renderer.removeClass(document.body, 'isModalShown');
    }
    if (this.isSearchopen) {
      this.renderer.addClass(document.body, 'issearchopen');
    } else {
      this.renderer.removeClass(document.body, 'issearchopen');
    }
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }
  onHidden(): void {
    this.isModalShown = false;
  }

  updateHeader(evt) {
    if (this.screenwidth >= 1000) {
      this.currPos =
        (window.pageYOffset || evt.target.scrollTop) -
        (evt.target.clientTop || 0);
      if (this.currPos >= this.changePos) {
        this.isScrolled = true;
      } else {
        this.isScrolled = false;
      }
    }
  }
  childCatLoaded(status) {
    this.isModalShown = status;
    this.isSearchopen = !status;
  }
  allmenuClosed(status) {
    this.isModalShown = status;
    this.isSearchopen = !status;
    if (this.isSearchopen) {
      this.renderer.addClass(document.body, 'issearchopen');
    } else {
      this.renderer.removeClass(document.body, 'issearchopen');
    }
  }
}
