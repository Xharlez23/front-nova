import { Component, HostListener, inject, OnInit } from '@angular/core';
import { VotePanelComponent } from '../../../components/vote-panel/vote-panel.component';
import { AdminService } from '../../../core/admin.service';
import { Product, VoteValue } from '../../../shared/models';
import { StatusBadgeComponent } from '../../../components/status-badge/status-badge.component';

@Component({
  selector: 'app-presentation',
  imports: [VotePanelComponent,StatusBadgeComponent],
  templateUrl: './presentation.component.html',
  styleUrl: './presentation.component.css'
})
export class PresentationComponent implements OnInit {
  private admin = inject(AdminService);
  items: Product[] = []; i = 0; onlyMine = false; busy = false;
  readonly needed = 2; readonly total = 3;

  ngOnInit() { this.admin.products().subscribe(r => this.items = r); }
  get list() { return this.onlyMine ? this.items.filter(p => !p.my_vote) : this.items; }
  get cur(): Product | undefined { return this.list[this.i]; }
  get myVotes() { return this.items.filter(p => p.my_vote).length; }
  get decided() { return this.items.filter(p => p.eval_status !== 'pendiente').length; }

  go(d: number) { const n = this.list.length; if (n) this.i = (this.i + d + n) % n; }
  toggleMine() { this.onlyMine = !this.onlyMine; this.i = 0; }
  vote(v: VoteValue) {
    const p = this.cur; if (!p || this.busy) return;
    this.busy = true;
    this.admin.vote(p.id, v).subscribe({
      next: r => {
        Object.assign(p, r); this.busy = false;
        // con el filtro activo, el producto votado sale de la lista y el siguiente ya ocupa su lugar
        if (!this.onlyMine && this.i < this.list.length - 1) this.i++;
        else this.i = Math.min(this.i, Math.max(0, this.list.length - 1));
      },
      error: e => { this.busy = false; alert(e.error?.error || 'No se pudo registrar el voto'); },
    });
  }
  full() { document.documentElement.requestFullscreen?.(); }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey || e.altKey) return; // para no chocar con Ctrl+R, etc.
    const k = e.key.toLowerCase();
    if (k === 'arrowright') this.go(1);
    else if (k === 'arrowleft') this.go(-1);
    else if (k === 'a') this.vote('aprobado');
    else if (k === 'r') this.vote('rechazado');
  }
}
