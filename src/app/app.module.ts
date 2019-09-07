import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { appRoutes } from './app-routes';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './user-list/user-list.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptorService } from './shared/services/http-interceptor.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';

// material modules
import { MatButtonModule, MatSidenavModule, MatListModule, MatIconModule, MAT_DIALOG_DEFAULT_OPTIONS, MatProgressBarModule, MatProgressSpinnerModule } from '@angular/material';
import { VideoChatBoxComponent } from './video-chat-box/video-chat-box.component';
import { MatDialogModule } from "@angular/material";
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    HomeComponent,
    UserListComponent,
    MessageBoxComponent,
    VideoChatBoxComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    PickerModule,
    EmojiModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  },
  { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }],
  entryComponents: [VideoChatBoxComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
