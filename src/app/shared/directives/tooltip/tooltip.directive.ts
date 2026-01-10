import { Directive, Input, ElementRef, HostListener, Renderer2, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipText = '';
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  private tooltipElement: HTMLElement | null = null;
  private delay = 200; // ms delay before showing
  private timeoutId: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipText) return;
    this.timeoutId = setTimeout(() => {
      this.showTooltip();
    }, this.delay);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.hideTooltip();
  }

  // Remove tooltip if component is destroyed while tooltip is shown
  ngOnDestroy() {
    this.hideTooltip();
  }

  private showTooltip() {
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.appendChild(this.tooltipElement, this.renderer.createText(this.tooltipText));

    this.renderer.appendChild(document.body, this.tooltipElement);

    // Styling
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background-color', '#333');
    this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
    this.renderer.setStyle(this.tooltipElement, 'padding', '6px 10px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '10000');
    this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
    this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 2px 5px rgba(0,0,0,0.2)');
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.2s');

    // Positioning
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipElement!.getBoundingClientRect();

    // Use a slight delay to ensure the DOM is updated for width calculations if needed, though simple measurements work
    // Position calculation
    let top, left;

    // Simple Top Positioning (Centering)
    top = hostPos.top - tooltipPos.height - 8; // 8px Offset
    left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

    // Boundary check (basic) specific for top placement defaults or if forced
    if (top < 0) {
      top = hostPos.bottom + 8;
    }

    this.renderer.setStyle(this.tooltipElement, 'top', `${top + window.scrollY}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left + window.scrollX}px`);

    // Fade in
    setTimeout(() => {
      if (this.tooltipElement) {
        this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
      }
    }, 10);
  }

  private hideTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
