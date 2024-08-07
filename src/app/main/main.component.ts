import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { SecondaryChatComponent } from './main-chat/secondary-chat/secondary-chat.component';
import { MainChatComponent } from './main-chat/main-chat.component';
import { NewMessageComponent } from './new-message/new-message.component';
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';
import { ViewManagementService } from '../services/view-management.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProfilCardComponent } from './profil-card/profil-card.component';
import { ProfilCardService } from '../services/profil-card.service';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyDOC1-zE5bnxS1ES82HHfl_cg3qm5qyZTQ",
//   authDomain: "da-bubble-70ce4.firebaseapp.com",
//   projectId: "da-bubble-70ce4",
//   storageBucket: "da-bubble-70ce4.appspot.com",
//   messagingSenderId: "557141847139",
//   appId: "1:557141847139:web:633a63e27efd87edf3dc56"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBe7Ug-UvmiTUcqvyJOtEo9GKbJDbu6-w8",
  authDomain: "da-bubble-43cc0.firebaseapp.com",
  projectId: "da-bubble-43cc0",
  storageBucket: "da-bubble-43cc0.appspot.com",
  messagingSenderId: "884922893196",
  appId: "1:884922893196:web:6955f5ba2a6e52e1e94ca9",
  // measurementId: "G-8DCLSV0WDZ"
};


const app = initializeApp(firebaseConfig);

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SideBarComponent,
    MainChatComponent,
    SecondaryChatComponent,
    NewMessageComponent,
    EmojiPickerComponent,
    ProfilCardComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  // showMainChat: boolean = true;
  // showNewMessage: boolean = false;
  // // showSecondaryChat: boolean = false;
  // // showSidebar: boolean = false;
  
  //screenSizeNumb: number;

  auth = getAuth(app);
  subscription: Subscription = new Subscription();
  threadOpen: boolean = false;
  userLoaded: boolean = false;

  constructor(
    public chatService: ChatService,
    public viewManagementService: ViewManagementService,
    public serviceProfilCard: ProfilCardService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (!user) {
        this.router.navigateByUrl('/login');
      } else {
        this.userLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }

}
