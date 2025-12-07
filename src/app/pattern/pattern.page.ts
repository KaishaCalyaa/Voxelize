import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';

interface Pattern {
  name: string;
  duration: string;
}

@Component({
  selector: 'app-pattern',
  templateUrl: 'pattern.page.html',
  styleUrls: ['pattern.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ]
})
export class PatternPage {
  constructor(private themeService: ThemeService) {}
  patterns: Pattern[] = [
    { name: 'Rainbow Wave', duration: '2:30' },
    { name: 'Color Wipe', duration: '1:45' },
    { name: 'Theater Chase', duration: '3:15' },
    { name: 'Fire', duration: '2:00' },
    { name: 'Confetti', duration: '1:30' },
    { name: 'Pride', duration: '2:45' },
    { name: 'Pulse', duration: '1:20' },
    { name: 'Strobe', duration: '0:50' },
    { name: 'Breathe', duration: '2:10' },
    { name: 'Twinkle', duration: '1:40' },
    { name: 'Meteor', duration: '2:05' },
    { name: 'Ocean', duration: '2:25' },
    { name: 'Aurora', duration: '3:05' },
    { name: 'Scanner', duration: '1:15' },
    { name: 'Sparkle', duration: '1:10' },
    { name: 'Wave Sweep', duration: '2:00' },
  ];

  currentPattern: Pattern | null = null;
  searchText: string = '';
  sortOption: 'name' | 'duration' = 'name';
  private favoriteNames = new Set<string>();
  favoritesOnly = false;

  get filteredPatterns(): Pattern[] {
    const q = this.searchText?.toLowerCase().trim();
    let base = this.patterns;
    if (q) {
      base = base.filter(p =>
        p.name.toLowerCase().includes(q) || p.duration.toLowerCase().includes(q)
      );
    }
    if (this.favoritesOnly) {
      base = base.filter(p => this.favoriteNames.has(p.name));
    }
    return base;
  }

  get sortedFilteredPatterns(): Pattern[] {
    const base = this.filteredPatterns.slice();
    if (this.sortOption === 'name') {
      base.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Extract seconds from mm:ss or m:ss; if non-numeric, push to end
      const parseDur = (d: string) => {
        const parts = d.split(':');
        if (parts.length === 2) {
          const m = parseInt(parts[0], 10);
          const s = parseInt(parts[1], 10);
          if (!isNaN(m) && !isNaN(s)) return m * 60 + s;
        }
        return Number.POSITIVE_INFINITY;
      };
      base.sort((a, b) => parseDur(a.duration) - parseDur(b.duration));
    }
    return base;
  }

  onSortChange(val: any) {
    if (val === 'name' || val === 'duration') this.sortOption = val;
  }

  toggleFavorite(p: Pattern) {
    if (this.favoriteNames.has(p.name)) {
      this.favoriteNames.delete(p.name);
    } else {
      this.favoriteNames.add(p.name);
    }
  }

  isFavorite(p: Pattern): boolean {
    return this.favoriteNames.has(p.name);
  }

  onFavToggle(ev: any) {
    this.favoritesOnly = !!ev?.detail?.checked;
  }

  selectPattern(pattern: Pattern) {
    if (this.currentPattern?.name === pattern.name) {
      this.currentPattern = null; // stop
      console.log('Stopped pattern:', pattern.name);
    } else {
      this.currentPattern = pattern; // play
      console.log('Selected pattern:', pattern.name);
    }
  }
}