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
  QueryList,
  ViewChildren,
  DOCUMENT,
  ChangeDetectorRef
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

@Component({
  selector: 'app-code',
  standalone: true,
  imports: [CzIconComponent],
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss']
})
export class AppCodeComponent implements AfterViewChecked, OnInit {
  @Input() code!: Code;
  @Input() selector: string = '';

  @ViewChildren('codeElement') codeElements!: QueryList<ElementRef<HTMLElement>>;

  readonly codeIcon = CodeIcon;
  lang!: string;
  copyTitle = 'Copy';
  showCode = true;

  constructor(
    @Inject(PLATFORM_ID) public platformId: any,
    @Inject(DOCUMENT) public document: Document,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.lang = this.getInitialLang();
    this.formatAllCode();
  }

  ngAfterViewChecked() {
    if (isPlatformBrowser(this.platformId)) {
      const win: any = window as any;
      if (win['Prism'] && this.codeElements) {
        try {
          this.codeElements.forEach(el => {
            if (!el.nativeElement.hasAttribute('data-highlighted')) {
              win['Prism'].highlightElement(el.nativeElement);
              el.nativeElement.setAttribute('data-highlighted', 'true');
            }
          });
        } catch { }
      }
    }
  }

  private formatAllCode() {
    if (!this.code) return;
    if (this.code.html) this.code.html = this.formatHtml(this.code.html);
    if (this.code.basic) this.code.basic = this.formatHtml(this.code.basic);
  }

  private formatHtml(html: string): string {
    let formatted = '';
    let pad = 0;

    // Ensure tags are on new lines
    const splitHtml = html.replace(/(>)\s*(<)(\/*)/g, '$1\n$2$3').split('\n');

    for (let i = 0; i < splitHtml.length; i++) {
      let node = splitHtml[i].trim();
      if (!node) continue;

      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      }

      formatted += '  '.repeat(pad) + node + '\n';
      pad += indent;
    }

    return formatted.trim();
  }

  getInitialLang(): string {
    if (this.code) {
      if (this.code.html) return 'html';
      if (this.code.typescript) return 'typescript';
      const keys = Object.keys(this.code);
      return keys.length ? keys[0] : 'basic';
    }
    return 'basic';
  }

  changeLang(lang: string) {
    this.lang = lang;
  }

  toggleCode() {
    this.showCode = !this.showCode;
  }

  async copyCode() {
    const text = this.code[this.lang] ?? '';
    try {
      await navigator.clipboard.writeText(text);
      this.copyTitle = 'Copied';
      this.cdr.markForCheck();
      setTimeout(() => {
        this.copyTitle = 'Copy';
        this.cdr.markForCheck();
      }, 3000);
    } catch {
      this.copyTitle = 'Failed';
      this.cdr.markForCheck();
      setTimeout(() => {
        this.copyTitle = 'Copy';
        this.cdr.markForCheck();
      }, 3000);
    }
  }
}

@NgModule({
  imports: [AppCodeComponent],
  exports: [AppCodeComponent]
})
export class AppCodeModule { }
