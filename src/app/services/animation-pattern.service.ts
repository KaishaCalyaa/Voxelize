import { Injectable } from '@angular/core';

export interface AnimationPattern {
  id: string;
  name: string;
  duration: string;
  frameRate: number;
  animNumber: number; // Firebase animation ID (1-10, 0 = stop)
  generateFrame: (frameIndex: number) => boolean[];
  jsonCode?: string; // JSON code required to play this animation
}

@Injectable({
  providedIn: 'root'
})
export class AnimationPatternService {
  private patterns: AnimationPattern[] = [];

  constructor() {
    this.initializePatterns();
  }

  getPatterns(): AnimationPattern[] {
    return this.patterns;
  }

  getPatternById(id: string): AnimationPattern | undefined {
    return this.patterns.find(p => p.id === id);
  }

  private initializePatterns() {
    this.patterns = [
      {
        id: 'diagonal-bounce',
        name: 'Diagonal Bounce',
        duration: '2:00',
        frameRate: 150,
        animNumber: 1,
        jsonCode: '{"animation":1,"type":"diagonal-bounce","version":"1.0"}',
        generateFrame: this.generateDiagonalBounce.bind(this)
      },
      {
        id: 'box-rotate',
        name: 'Box Rotate',
        duration: '2:30',
        frameRate: 200,
        animNumber: 2,
        jsonCode: '{"animation":2,"type":"box-rotate","version":"1.0"}',
        generateFrame: this.generateBoxRotate.bind(this)
      },
      {
        id: 'wave',
        name: 'Wave',
        duration: '2:15',
        frameRate: 150,
        animNumber: 3,
        jsonCode: '{"animation":3,"type":"wave","version":"1.0"}',
        generateFrame: this.generateWave.bind(this)
      },
      {
        id: 'heartbeat',
        name: 'Heartbeat',
        duration: '1:45',
        frameRate: 300,
        animNumber: 4,
        jsonCode: '{"animation":4,"type":"heartbeat","version":"1.0"}',
        generateFrame: this.generateHeartbeat.bind(this)
      },
      {
        id: 'checker',
        name: 'Checker',
        duration: '2:00',
        frameRate: 250,
        animNumber: 5,
        jsonCode: '{"animation":5,"type":"checker","version":"1.0"}',
        generateFrame: this.generateChecker.bind(this)
      },
      {
        id: 'spiral',
        name: 'Spiral',
        duration: '3:00',
        frameRate: 200,
        animNumber: 6,
        jsonCode: '{"animation":6,"type":"spiral","version":"1.0"}',
        generateFrame: this.generateSpiral.bind(this)
      },
      {
        id: 'rain',
        name: 'Rain',
        duration: '2:30',
        frameRate: 100,
        animNumber: 7,
        jsonCode: '{"animation":7,"type":"rain","version":"1.0"}',
        generateFrame: this.generateRain.bind(this)
      },
      {
        id: 'cross',
        name: 'Cross',
        duration: '1:30',
        frameRate: 200,
        animNumber: 8,
        jsonCode: '{"animation":8,"type":"cross","version":"1.0"}',
        generateFrame: this.generateCross.bind(this)
      },
      {
        id: 'border-chase',
        name: 'Border Chase',
        duration: '2:45',
        frameRate: 150,
        animNumber: 9,
        jsonCode: '{"animation":9,"type":"border-chase","version":"1.0"}',
        generateFrame: this.generateBorderChase.bind(this)
      },
      {
        id: 'blink-all',
        name: 'Blink All',
        duration: '1:00',
        frameRate: 500,
        animNumber: 10,
        jsonCode: '{"animation":10,"type":"blink-all","version":"1.0"}',
        generateFrame: this.generateBlinkAll.bind(this)
      }
    ];
  }

  // Pattern Generator Functions for LED Matrix (6x6 grid)

  private generateDiagonalBounce(frameIndex: number): boolean[] {
    const grid = new Array(36).fill(false);
    const pos = frameIndex % 11; // 0-10 positions for diagonal movement
    
    // Diagonal from top-left to bottom-right, then back
    if (pos < 6) {
      // Moving down-right
      for (let i = 0; i <= pos; i++) {
        const row = i;
        const col = pos - i;
        if (row < 6 && col < 6) {
          grid[row * 6 + col] = true;
        }
      }
    } else {
      // Moving back up-left
      const backPos = 10 - pos;
      for (let i = 0; i <= backPos; i++) {
        const row = i;
        const col = backPos - i;
        if (row < 6 && col < 6) {
          grid[row * 6 + col] = true;
        }
      }
    }
    return grid;
  }

  private generateBoxRotate(frameIndex: number): boolean[] {
    const grid = new Array(36).fill(false);
    const step = frameIndex % 4;
    
    // Rotating box pattern
    if (step === 0) {
      // Top and left edges
      for (let i = 0; i < 6; i++) {
        grid[i] = true; // Top row
        grid[i * 6] = true; // Left column
      }
    } else if (step === 1) {
      // Top and right edges
      for (let i = 0; i < 6; i++) {
        grid[i] = true; // Top row
        grid[i * 6 + 5] = true; // Right column
      }
    } else if (step === 2) {
      // Bottom and right edges
      for (let i = 0; i < 6; i++) {
        grid[30 + i] = true; // Bottom row
        grid[i * 6 + 5] = true; // Right column
      }
    } else {
      // Bottom and left edges
      for (let i = 0; i < 6; i++) {
        grid[30 + i] = true; // Bottom row
        grid[i * 6] = true; // Left column
      }
    }
    return grid;
  }

  private generateWave(frameIndex: number): boolean[] {
    const grid = new Array(36).fill(false);
    const wavePos = frameIndex % 12;
    
    // Wave pattern moving across rows
    for (let row = 0; row < 6; row++) {
      const col = (wavePos + row * 2) % 12;
      if (col < 6) {
        grid[row * 6 + col] = true;
      } else {
        grid[row * 6 + (12 - col)] = true;
      }
    }
    return grid;
  }

  private generateHeartbeat(frameIndex: number): boolean[] {
    const grid = new Array(36).fill(false);
    const cycle = frameIndex % 6;
    
    // Heartbeat pattern: pulses in center
    if (cycle < 3) {
      // Expanding from center
      const size = cycle + 1;
      const centerRow = 2.5;
      const centerCol = 2.5;
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          const dist = Math.abs(row - centerRow) + Math.abs(col - centerCol);
          if (dist <= size) {
            grid[row * 6 + col] = true;
          }
        }
      }
    }
    return grid;
  }

  private generateChecker(frameIndex: number): boolean[] {
    const grid = new Array(36).fill(false);
    const offset = (frameIndex % 2);
    
    // Checkerboard pattern
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if ((row + col + offset) % 2 === 0) {
          grid[row * 6 + col] = true;
        }
      }
    }
    return grid;
  }

  private generateSpiral(frameIndex: number): boolean[] {
    const grid = new Array(36).fill(false);
    const step = frameIndex % 16;
    
    // Spiral pattern
    const center = 2.5;
    const angle = (step * Math.PI) / 8;
    const radius = (step % 8) / 2;
    
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        const dx = col - center;
        const dy = row - center;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const currentAngle = Math.atan2(dy, dx);
        
        if (Math.abs(dist - radius) < 0.5 && Math.abs(currentAngle - angle) < 0.3) {
          grid[row * 6 + col] = true;
        }
      }
    }
    return grid;
  }

  private generateRain(frameIndex: number): boolean[] {
    const grid = new Array(36).fill(false);
    
    // Rain drops falling down columns
    const drops = [];
    for (let col = 0; col < 6; col++) {
      const dropRow = (frameIndex + col * 3) % 12 - 6;
      if (dropRow >= 0 && dropRow < 6) {
        grid[dropRow * 6 + col] = true;
        // Add trail
        if (dropRow > 0) {
          grid[(dropRow - 1) * 6 + col] = true;
        }
      }
    }
    return grid;
  }

  private generateCross(frameIndex: number): boolean[] {
    const grid = new Array(36).fill(false);
    
    // Cross pattern (center row and column)
    const centerRow = Math.floor(frameIndex / 2) % 6;
    const centerCol = 3;
    
    // Horizontal line
    for (let col = 0; col < 6; col++) {
      grid[centerRow * 6 + col] = true;
    }
    
    // Vertical line
    for (let row = 0; row < 6; row++) {
      grid[row * 6 + centerCol] = true;
    }
    
    return grid;
  }

  private generateBorderChase(frameIndex: number): boolean[] {
    const grid = new Array(36).fill(false);
    const pos = frameIndex % 20; // 20 positions around the border
    
    // Chase around border
    if (pos < 6) {
      // Top row, left to right
      grid[pos] = true;
    } else if (pos < 11) {
      // Right column, top to bottom
      grid[(pos - 5) * 6 + 5] = true;
    } else if (pos < 16) {
      // Bottom row, right to left
      grid[30 + (15 - pos)] = true;
    } else {
      // Left column, bottom to top
      grid[(19 - pos) * 6] = true;
    }
    return grid;
  }

  private generateBlinkAll(frameIndex: number): boolean[] {
    const grid = new Array(36).fill(false);
    const isOn = frameIndex % 2 === 0;
    
    // All LEDs blink together
    if (isOn) {
      grid.fill(true);
    }
    return grid;
  }
}

