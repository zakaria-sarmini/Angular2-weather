import {Routes, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {SearchComponent} from "./components/search/search.component";
import {BlankComponent} from "./components/blank/blank.component";
const appRoutes: Routes = [
  {
    path: '',
    component: BlankComponent
  },
  {
    path: 'search',
    component: SearchComponent
  }
];

export const AppRouterProvider: ModuleWithProviders = RouterModule.forRoot(appRoutes);
