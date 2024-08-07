import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfilCardComponent } from '../profil-card/profil-card.component';
import { CommonModule } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';
import { ProfilCardService } from '../../services/profil-card.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { ViewManagementService } from '../../services/view-management.service';
import { ChatService } from '../../services/chat.service';

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
const db = getFirestore(app);

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [ProfilCardComponent, CommonModule, MatIconModule, FormsModule],
})
export class HeaderComponent implements OnInit {
  authSubscription: any;

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (!user) {
        this.router.navigateByUrl('/login');
      } else {
        this.userLoaded = true;
      }
    });
  }

  auth = getAuth(app);
  userNameandSurname: string = '';
  profilePic: string = '';
  userId: string = '';
  headerUserNameandSurname: string;
  headerProfilePic: string;
  currentUser;
  userLoaded: boolean = false;
  isOverlayActive: boolean = false;
  currentUserProfil: boolean = false;
  showProfil: boolean = false;
  showDropdownMenu: boolean = false;
  inputValue: string = ''; // Initialisierung der Variable
  searchBarActive: boolean = true;

  firebaseConfig = {
    apiKey: "AIzaSyBe7Ug-UvmiTUcqvyJOtEo9GKbJDbu6-w8",
    authDomain: "da-bubble-43cc0.firebaseapp.com",
    projectId: "da-bubble-43cc0",
    storageBucket: "da-bubble-43cc0.appspot.com",
    messagingSenderId: "884922893196",
    appId: "1:884922893196:web:6955f5ba2a6e52e1e94ca9",
  };
  app = initializeApp(this.firebaseConfig);
  db = getFirestore(this.app);
  userRef = collection(this.db, 'users');

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public serviceProfilCard: ProfilCardService,
    public searchService: SearchService,
    public viewManagementService: ViewManagementService,
    public chatService: ChatService
  ) {
    this.serviceProfilCard.isProfilCardActiveChanged.subscribe(
      (isActive: boolean) => {
        this.showDropdownMenu = isActive; // Update local variable when service variable changes
      }
    );

    this.chatService.isSearchbarActive.subscribe((value) => {
      //console.log('Wir sind hier:', value);
      if (value !== null) {
        this.searchBarActive = false;
      } else {
        this.searchBarActive = true;
      }
    });
  }

  /**
   * Handles input change in the search bar.
   */
  onInputChange() {
    if (this.inputValue.startsWith('@')) {
      this.searchService.seachUsersAt(this.inputValue);
    }
    if (this.inputValue.startsWith('#')) {
      this.searchService.searchChannelsAt(this.inputValue);
    }
    this.searchService.searchUsers(this.inputValue);
    this.searchService.searchChannels(this.inputValue);
    this.searchService.searchThreads(this.inputValue);
    // console.log(this.searchService.threads);
  }

  /**
   * Opens a thread from the search bar results.
   * @param {string} threadId - The ID of the thread to open.
   * @param {string} channelId - The ID of the channel containing the thread.
   */
  openThreadfromSearchbar(threadId: string, channelId: string) {
    this.chatService.setActiveChannelId(channelId);
    this.chatService.openThread(threadId);
    this.viewManagementService.setView('secondaryChat');
  }

  /**
   * Checks if the length of the input value is greater than one.
   * @returns {boolean} - Returns true if the length of the input value is greater than one, otherwise false.
   */
  isInputValueGreaterThanOne(): boolean {
    return this.inputValue.length > 0;
  }

  /**
   * Handles clicks on menu items.
   * @param {string} option - The clicked option.
   */
  menuItemClicked(option: string) {
    //console.log('Option clicked:', option);
  }

  /**
   * Toggles the overlay and dropdown menu visibility.
   * @param {boolean} active - Determines whether to activate or deactivate the overlay and dropdown menu.
   */
  toggleOverlay(active: boolean) {
    this.isOverlayActive = active;
    this.showDropdownMenu = active;
  }

  /**
   * Toggles the dropdown menu visibility.
   * @param {boolean} active - Determines whether to activate or deactivate the dropdown menu.
   */
  toggleDropdownMenu(active: boolean) {
    this.serviceProfilCard.getTheLoggedInUser();
    this.showDropdownMenu = active;
    // this.isOverlayActive = active;
    if (!this.serviceProfilCard.isProfilCardActive) {
      this.serviceProfilCard.isOverlayActive = active;
    }
  }

  /**
   * Opens or closes the profile menu.
   * @param {boolean} active - Determines whether to open or close the profile menu.
   */
  openProfil(active: boolean): void {
    this.showProfil = active;
  }

  /**
   * Signs out the user from the application.
   * Updates the user's online status in the database.
   * Navigates the user to the login page after sign-out.
   * @returns {Promise<void>}
   */
  async signOut() {
    if (this.auth.currentUser.uid) {
      let userRef = doc(db, 'users', this.auth.currentUser.uid);
      updateDoc(userRef, {
        isOnline: false,
      });
      await this.auth.signOut();
      this.router.navigateByUrl('login');
      this.serviceProfilCard.isOverlayActive = false;
    } else {
      await this.auth.signOut();
      this.router.navigateByUrl('login');
      this.serviceProfilCard.isOverlayActive = false;
    }
  }

  ///////////////////////// closes the resultFeld when clicking outside of it /////////////////////////

  /**
   * Handles document click event to close the search field result.
   * @param {MouseEvent} event - The mouse event object.
   */
  onDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const isClickedOutside = !this.isDescendant(clickedElement, 'searchField');
    if (isClickedOutside) {
      this.inputValue = '';
    }
  }

  /**
   * Handles result click event to clear the input value.
   */
  onResultClick() {
    if (this.inputValue) {
      this.inputValue = '';
    }
  }

  /**
   * Checks if an element is a descendant of a given class.
   * @param {HTMLElement} element - The HTML element to check.
   * @param {string} className - The class name to check against.
   * @returns {boolean} - Returns true if the element is a descendant of the class, otherwise false.
   */
  private isDescendant(element: HTMLElement, className: string): boolean {
    if (!element) return false;

    if (element.classList.contains(className)) {
      return true;
    } else {
      return this.isDescendant(element.parentElement, className);
    }
  }

  /**
   * Shows the sidebar by setting the active channel and user to null and updating the view.
   */
  showSidebar() {
    this.chatService.setActiveChannelId(null);
    this.chatService.setSelectedUserId(null);
    this.viewManagementService.setView('sidebar');
  }
}
