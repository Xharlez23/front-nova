import { Component, inject, OnInit } from '@angular/core';
import { VotePanelComponent } from '../../../components/vote-panel/vote-panel.component';
import { AdminService } from '../../../core/admin.service';
import { Product, VoteValue } from '../../../shared/models';

@Component({
  selector: 'app-presentation',
  imports: [VotePanelComponent],
  templateUrl: './presentation.component.html',
  styleUrl: './presentation.component.css'
})
export class PresentationComponent implements OnInit {
  private admin = inject(AdminService);
  items: Product[] = []; i = 0; readonly needed = 2;

  ngOnInit() { this.admin.products().subscribe(r => this.items = r); }
  get cur(): Product | undefined { return this.items[this.i]; }
  get myVotes() { return this.items.filter(p => p.my_vote).length; }
  get decided() { return this.items.filter(p => p.eval_status !== 'pendiente').length; }
  go(d: number) { if (this.items.length) this.i = (this.i + d + this.items.length) % this.items.length; }
  vote(v: VoteValue) {
    const p = this.cur; if (!p) return;
    this.admin.vote(p.id, v).subscribe({
      next: r => { Object.assign(p, r); if (this.i < this.items.length - 1) this.i++; },
      error: e => alert(e.error?.error || 'No se pudo registrar el voto'),
    });
  }
  full() { document.documentElement.requestFullscreen?.(); }
}
