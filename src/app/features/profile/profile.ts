import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile {
  authService = inject(AuthService);
  snackbarService = inject(SnackbarService);

  isUpdating = false;

  triggerUpdateAnimation() {
    if (this.isUpdating) return;

    this.isUpdating = true;

    // Simulate the animation timeline
    setTimeout(() => {
      this.snackbarService.success('Profile updates coming soon! 🚀');

      // Reset after a brief moment
      setTimeout(() => {
        this.isUpdating = false;
      }, 1500);
    }, 800);
  }
}
