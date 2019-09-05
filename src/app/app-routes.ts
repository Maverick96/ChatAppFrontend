import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
// import { LeadListComponent } from './lead-list/lead-list.component';
// import { LeadDetailsComponent } from './lead-details/lead-details.component';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// import { AuthGuardService } from './shared/services/auth-guard.service'

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    // {
    //     path: 'lead-list',
    //     component: LeadListComponent,
    //     canActivate: [AuthGuardService]
    // },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    { path: '**', component: PageNotFoundComponent }
];

export { appRoutes };