/* app-code.component.ts (standalone, sin PrimeNG, sin StackBlitz/CodeSandbox) */

import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  Inject,
  Input,
  NgModule,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  DOCUMENT
} from '@angular/core';
import { CzIconComponent } from 'codezium-ui';
import { Code as CodeIcon } from 'lucide-angular';

/* TIPOS */
export interface Code {
  basic?: string;
  html?: string;
  typescript?: string;
  scss?: string;
  data?: string;
  command?: string;
  [k: string]: string | undefined;
}
export interface ExtFile { path: string; content: string; }
export interface RouteFile { path: string; content: string; }

@Component({
  selector: 'app-code',
  standalone: true,
  imports: [CzIconComponent],
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss']
})
export class AppCodeComponent implements AfterViewChecked, OnInit {
  @Input() code!: Code;
  @Input() selector!: string;
  @Input() preview!: boolean;

  @ViewChild('codeElement', { static: false }) codeElement!: ElementRef<HTMLElement>;

  readonly codeIcon = CodeIcon;
  fullCodeVisible = false;
  lang!: string;
  tab: 'preview' | 'code' = 'preview';
  copyTitle = 'Copy code';

  constructor(
    @Inject(PLATFORM_ID) public platformId: any,
    @Inject(DOCUMENT) public document: Document
  ) { }

  ngOnInit() {
    this.lang = this.getInitialLang();
  }

  ngAfterViewChecked() {
    if (isPlatformBrowser(this.platformId)) {
      const win: any = window as any;
      if (win['Prism'] && this.codeElement) {
        try {
          win['Prism'].highlightElement(this.codeElement.nativeElement);
        } catch { }
      }
    }
  }

  getInitialLang(): string {
    if (this.code) {
      const keys = Object.keys(this.code);
      return keys.length ? keys[0] : 'basic';
    }
    return 'basic';
  }

  changeLang(lang: string) {
    this.lang = lang;
    this.tab = 'code';
  }

  toggleCode() {
    this.fullCodeVisible = !this.fullCodeVisible;
    this.lang = this.code.html ? 'html' : (this.code.typescript ? 'typescript' : 'basic');
    this.tab = this.fullCodeVisible ? 'code' : 'preview';
  }

  async copyCode() {
    const text = this.code[this.lang] ?? '';
    try {
      await navigator.clipboard.writeText(text);
      this.copyTitle = 'Copied';
      setTimeout(() => (this.copyTitle = 'Copy code'), 1200);
    } catch {
      this.copyTitle = 'Copy failed';
      setTimeout(() => (this.copyTitle = 'Copy code'), 1200);
    }
  }
}

@NgModule({
  imports: [AppCodeComponent],
  exports: [AppCodeComponent]
})
export class AppCodeModule { }
