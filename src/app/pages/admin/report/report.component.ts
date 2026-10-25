import { Component, OnInit, inject } from '@angular/core';
import { AdminService } from '../../../core/admin.service';
import { CopPipe } from '../../../shared/cop.pipe';
import { Report } from '../../../shared/models';
import { downloadText } from '../../../shared/utils';
import { StatCardComponent } from '../../../components/stat-card/stat-card.component';
@Component({
  selector: 'app-report',
  imports: [CopPipe, StatCardComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  private admin = inject(AdminService);
  rep: Report | null = null;

  ngOnInit() { this.admin.report().subscribe(r => this.rep = r); }
  ev(s: string) { return this.rep?.evals.find(e => e.s === s)?.n ?? 0; }
  csv(kind: 'sales' | 'shopping') { this.admin.exportCsv(kind).subscribe(t => downloadText(kind + '.csv', t)); }
  print() { window.print(); }
}