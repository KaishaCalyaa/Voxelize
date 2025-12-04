import { Injectable } from '@angular/core';

export type ThemeMode = 'edubox';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: ThemeMode = 'edubox';
  private isDarkModeEnabled: boolean = false;

  constructor() {
    // Always set to edubox theme
    this.setTheme('edubox');

    // Load saved dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('app-dark-mode');
    if (savedDarkMode === 'true') {
      this.setDarkMode(true);
    }
  }

  /**
   * Set the application theme
   * @param theme - The theme to apply ('edubox')
   */
  setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;

    // Remove existing theme classes
    document.body.classList.remove('theme-edubox');

    // Add new theme class
    document.body.classList.add(`theme-${theme}`);

    // Save to localStorage
    localStorage.setItem('app-theme', theme);

    console.log(`Theme switched to: ${theme}`);
  }

  /**
   * Get the current theme
   * @returns The current theme mode
   */
  getTheme(): ThemeMode {
    return this.currentTheme;
  }

  /**
   * Get the appropriate header icon based on current theme
   * @returns The icon name for the current theme
   */
  getHeaderIcon(): string {
    return 'cube';
  }

  /**
   * Get the theme display name
   * @returns The user-friendly name of the current theme
   */
  getThemeDisplayName(): string {
    return 'EDUBOX';
  }

  /**
   * Check if a specific theme is currently active
   * @param theme - The theme to check
   * @returns True if the specified theme is active
   */
  isThemeActive(theme: ThemeMode): boolean {
    return this.currentTheme === theme;
  }

  /**
   * Set dark mode state
   * @param enabled - True to enable dark mode, false to disable
   */
  setDarkMode(enabled: boolean): void {
    this.isDarkModeEnabled = enabled;

    if (enabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Save to localStorage
    localStorage.setItem('app-dark-mode', enabled.toString());

    console.log(`Dark mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Toggle dark mode on/off
   */
  toggleDarkMode(): void {
    this.setDarkMode(!this.isDarkModeEnabled);
  }

  /**
   * Check if dark mode is currently enabled
   * @returns True if dark mode is enabled
   */
  isDarkMode(): boolean {
    return this.isDarkModeEnabled;
  }
}
