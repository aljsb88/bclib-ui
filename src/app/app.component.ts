import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AccountService } from './_services';
import { User } from './_models';
import { MenubarComponent } from './_components/menubar/menubar.component';

@Component({ 
    selector: 'app-root', 
    templateUrl: 'app.component.html', 
    standalone: true,
    imports: [NgIf, RouterOutlet, RouterLink, RouterLinkActive, MenubarComponent]
})
export class AppComponent { 
    user?: User | null;

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    logout() {
        this.accountService.logout();
    }
}