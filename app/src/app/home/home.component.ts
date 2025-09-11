import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';
import { Resume } from '../models/resume';
import { ResumeService } from '../services/resume.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stars" aria-hidden="true"></div>
    <div class="nebula" aria-hidden="true"></div>
    <div class="shooting-stars" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <header class="hero" id="top">
      <div class="container">
        <nav class="nav">
          <a class="brand" href="#top">{{ resume()?.name || 'Your Name' }}</a>
          <div class="links">
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#education">Education</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div class="intro">
          <div class="avatar" *ngIf="resume()?.photo as photo">
            <img [src]="photo" alt="{{ resume()?.name }}" />
          </div>
          <h1>{{ resume()?.name }}</h1>
          <p class="title">{{ resume()?.title }}</p>
          <p class="loc" *ngIf="resume()?.location">{{ resume()?.location }}</p>
          <p class="summary" *ngIf="resume()?.summary">{{ resume()?.summary }}</p>
          <div class="actions">
            <a *ngIf="resume()?.github" [href]="resume()?.github" target="_blank" rel="noopener" class="btn">GitHub</a>
            <a *ngIf="resume()?.linkedin" [href]="resume()?.linkedin" target="_blank" rel="noopener" class="btn btn-secondary">LinkedIn</a>
            <a *ngIf="resume()?.website" [href]="resume()?.website" target="_blank" rel="noopener" class="btn btn-ghost">Website</a>
          </div>
        </div>
      </div>
    </header>

    <main class="container main">
      <section id="experience">
        <h2>Experience</h2>
        <div class="timeline" [@staggerList]>
          <div class="tl-item" *ngFor="let exp of resume()?.experience" [@fadeIn]>
            <div class="tl-dot"></div>
            <div class="tl-card hoverable">
              <div class="card-head">
                <div>
                  <h3>{{ exp.role }}</h3>
                  <div class="meta">{{ exp.company }} &bull; {{ exp.location || '' }}</div>
                </div>
                <div class="dates">{{ exp.start }} &mdash; {{ exp.end }}</div>
              </div>
              <ul class="highlights" *ngIf="exp.highlights?.length">
                <li *ngFor="let h of exp.highlights">{{ h }}</li>
              </ul>
              <div class="tags" *ngIf="exp.technologies?.length">
                <span class="tag" *ngFor="let t of exp.technologies">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects">
        <h2>Projects</h2>
        <div class="grid" [@staggerList]>
          <article class="card hoverable" *ngFor="let p of resume()?.projects" [@fadeIn]>
            <div class="card-head">
              <h3>{{ p.name }}</h3>
              <div class="links">
                <a *ngIf="p.url" [href]="p.url" target="_blank" rel="noopener">Live</a>
                <a *ngIf="p.repo" [href]="p.repo" target="_blank" rel="noopener">Code</a>
              </div>
            </div>
            <p *ngIf="p.description" class="description">{{ p.description }}</p>
            <ul class="highlights" *ngIf="p.highlights?.length">
              <li *ngFor="let h of p.highlights">{{ h }}</li>
            </ul>
            <div class="tags" *ngIf="p.technologies?.length" [@staggerList]>
              <span class="tag" *ngFor="let t of p.technologies">{{ t }}</span>
            </div>
          </article>
        </div>
      </section>

      <section id="skills">
        <h2>Skills</h2>
        <div class="tags" [@staggerList]>
          <span class="tag" *ngFor="let s of resume()?.skills">{{ s }}</span>
        </div>
        <h3 *ngIf="resume()?.tools?.length">Tools</h3>
        <div class="tags" *ngIf="resume()?.tools?.length" [@staggerList]>
          <span class="tag" *ngFor="let t of resume()?.tools">{{ t }}</span>
        </div>
      </section>

      <section id="education">
        <h2>Education</h2>
        <div class="card hoverable" *ngFor="let e of resume()?.education" [@fadeIn]>
          <div class="card-head">
            <h3>{{ e.degree }}</h3>
            <div class="dates">{{ e.start || '' }}<span *ngIf="e.start || e.end"> &mdash; </span>{{ e.end || '' }}</div>
          </div>
          <div class="meta">{{ e.institution }} &bull; {{ e.location || '' }}</div>
          <ul class="highlights" *ngIf="e.highlights?.length">
            <li *ngFor="let h of e.highlights">{{ h }}</li>
          </ul>
        </div>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <ul class="contact" [@staggerList]>
          <li *ngIf="resume()?.email"><strong>Email:</strong> <a [href]="'mailto:' + resume()?.email">{{ resume()?.email }}</a></li>
          <li *ngIf="resume()?.phone"><strong>Phone:</strong> {{ resume()?.phone }}</li>
          <li *ngIf="resume()?.website"><strong>Website:</strong> <a [href]="resume()?.website" target="_blank" rel="noopener">{{ resume()?.website }}</a></li>
          <li *ngIf="resume()?.linkedin"><strong>LinkedIn:</strong> <a [href]="resume()?.linkedin" target="_blank" rel="noopener">{{ resume()?.linkedin }}</a></li>
          <li *ngIf="resume()?.github"><strong>GitHub:</strong> <a [href]="resume()?.github" target="_blank" rel="noopener">{{ resume()?.github }}</a></li>
        </ul>
      </section>
    </main>

    <footer class="footer">
      <div class="container">
        <span>© {{ year }} {{ resume()?.name }}</span>
      </div>
    </footer>
  `,
  styles: `
    :host { display: block; color: var(--fg); background: var(--bg); }
    /* Animated background layers */
    .stars, .stars::before, .stars::after { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
    .stars {
      background:
        radial-gradient(1px 1px at 7% 12%, rgba(255,255,255,0.45) 50%, transparent 52%),
        radial-gradient(1px 1px at 18% 72%, rgba(108,92,231,0.5) 50%, transparent 52%),
        radial-gradient(1px 1px at 31% 22%, rgba(255,255,255,0.35) 50%, transparent 52%),
        radial-gradient(1px 1px at 44% 64%, rgba(108,92,231,0.45) 50%, transparent 52%),
        radial-gradient(1px 1px at 53% 15%, rgba(255,255,255,0.35) 50%, transparent 52%),
        radial-gradient(1px 1px at 66% 78%, rgba(108,92,231,0.4) 50%, transparent 52%),
        radial-gradient(1px 1px at 77% 28%, rgba(255,255,255,0.35) 50%, transparent 52%),
        radial-gradient(1px 1px at 89% 52%, rgba(108,92,231,0.4) 50%, transparent 52%);
      animation: starDrift 85s linear infinite, twinkle 8s ease-in-out infinite alternate;
      opacity: .7;
    }
    .stars::before { content: "";
      background:
        radial-gradient(1px 1px at 12% 34%, rgba(255,255,255,0.35) 50%, transparent 52%),
        radial-gradient(1px 1px at 25% 86%, rgba(108,92,231,0.35) 50%, transparent 52%),
        radial-gradient(1px 1px at 38% 10%, rgba(255,255,255,0.3) 50%, transparent 52%),
        radial-gradient(1px 1px at 50% 58%, rgba(108,92,231,0.35) 50%, transparent 52%),
        radial-gradient(1px 1px at 65% 20%, rgba(255,255,255,0.3) 50%, transparent 52%),
        radial-gradient(1px 1px at 78% 70%, rgba(108,92,231,0.35) 50%, transparent 52%),
        radial-gradient(1px 1px at 90% 24%, rgba(255,255,255,0.3) 50%, transparent 52%);
      animation: starDrift 110s linear infinite reverse, twinkle 10s ease-in-out infinite alternate;
      opacity: .55;
    }
    .stars::after { content: "";
      background:
        radial-gradient(2px 2px at 8% 48%, rgba(255,255,255,0.22) 50%, transparent 52%),
        radial-gradient(2px 2px at 28% 18%, rgba(108,92,231,0.25) 50%, transparent 52%),
        radial-gradient(2px 2px at 48% 82%, rgba(255,255,255,0.22) 50%, transparent 52%),
        radial-gradient(2px 2px at 68% 36%, rgba(108,92,231,0.25) 50%, transparent 52%),
        radial-gradient(2px 2px at 88% 66%, rgba(255,255,255,0.22) 50%, transparent 52%);
      animation: starDrift 140s linear infinite, twinkle 12s ease-in-out infinite alternate;
      opacity: .45;
    }
    @keyframes starDrift { from { transform: translate3d(0,0,0); } to { transform: translate3d(-600px, 600px, 0); } }
    @keyframes twinkle { 0% { filter: brightness(1); } 100% { filter: brightness(1.35); } }

    /* Soft animated nebula glow */
    .nebula { position: fixed; inset: -10%; pointer-events:none; z-index:0; opacity:.32; filter: blur(42px) saturate(120%);
      background:
        radial-gradient(40% 30% at 20% 30%, rgba(108,92,231,0.25), transparent 60%),
        radial-gradient(35% 25% at 75% 65%, rgba(0,180,255,0.18), transparent 60%),
        radial-gradient(30% 20% at 60% 20%, rgba(255,0,204,0.10), transparent 60%);
      animation: nebulaShift 60s ease-in-out infinite alternate;
    }
    @keyframes nebulaShift { 0% { transform: translate3d(0,0,0) rotate(0deg) scale(1);} 100% { transform: translate3d(-4%,3%,0) rotate(8deg) scale(1.06);} }

    /* Occasional shooting stars */
    .shooting-stars { position: fixed; inset: 0; pointer-events:none; z-index:0; overflow:hidden; }
    .shooting-stars span { position:absolute; width: 140px; height: 2px; background: linear-gradient(90deg, rgba(255,255,255,.85), rgba(255,255,255,0));
      transform: rotate(-35deg); opacity:0; filter: drop-shadow(0 0 6px rgba(108,92,231,.8)); will-change: transform, opacity; animation: shoot 5.5s linear infinite; }
    .shooting-stars span:nth-child(1){ top:12%; left:82%; animation-delay: 1s; }
    .shooting-stars span:nth-child(2){ top:26%; left:88%; animation-delay: 7s; }
    .shooting-stars span:nth-child(3){ top:44%; left:90%; animation-delay: 12s; }
    .shooting-stars span:nth-child(4){ top:58%; left:86%; animation-delay: 18s; }
    .shooting-stars span:nth-child(5){ top:70%; left:92%; animation-delay: 24s; }
    .shooting-stars span:nth-child(6){ top:82%; left:84%; animation-delay: 31s; }
    @keyframes shoot { 0% { opacity:0; transform: translate3d(0,0,0) rotate(-35deg);} 5% { opacity:1; } 100% { opacity:0; transform: translate3d(-120vh, 120vh, 0) rotate(-35deg);} }
    .nav { position: sticky; top: 0; z-index: 10; display:flex; justify-content:space-between; align-items:center; padding: 1rem 0; background: linear-gradient(180deg, rgba(11,12,16,0.85), rgba(11,12,16,0)); backdrop-filter: blur(6px); }
    .brand { font-weight: 700; text-decoration: none; color: var(--fg); }
    .links a { position:relative; margin-left: 1rem; color: var(--muted-fg); text-decoration: none; }
    .links a::after { content:''; position:absolute; left:0; right:0; bottom:-4px; height:2px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform .2s ease; opacity:.85; }
    .links a:hover { color: var(--fg); }
    .links a:hover::after { transform: scaleX(1); }
    .hero { position: relative; z-index: 1; background: radial-gradient(100% 50% at 50% 0%, rgba(108,92,231,0.16) 0%, transparent 60%); }
    .intro { padding: 3.25rem 0 2.25rem; text-align: center; }
    .intro h1 { margin: .75rem 0 .25rem; font-size: clamp(1.8rem, 3.2vw, 3rem); }
    .title { margin: 0; color: var(--muted-fg); font-weight: 600; }
    .loc { margin: .25rem 0 0; color: var(--muted-fg); }
    .summary { max-width: 840px; margin: .9rem auto 1.25rem; color: var(--muted-fg); }
    .actions { display:flex; gap:.75rem; justify-content:center; }
    .btn { padding:.6rem 1.1rem; border-radius: .6rem; background: var(--accent); color:#fff; text-decoration:none; transition: transform .08s ease, filter .2s ease; }
    .btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
    .btn-secondary { background: var(--fg); color: var(--bg); }
    .btn-ghost { background: transparent; color: var(--fg); border: 1px solid var(--border); }
    .avatar { display:flex; justify-content:center; }
    .avatar img { width: 104px; height: 104px; border-radius: 999px; border: 2px solid var(--border); object-fit: cover; box-shadow: 0 0 0 0 rgba(108,92,231,0.5); animation: pulseGlow 3s ease-in-out infinite; }
    .container { width: min(1100px, 92%); margin: 0 auto; }
    .main { position: relative; z-index: 1; padding: 2rem 0 4rem; }
    section { margin: 2.5rem 0; }
    h2 { font-size: 1.4rem; margin: 0 0 1rem; }
    h3 { margin: 0; font-size: 1.1rem; }
    .card { border: 1px solid var(--border); border-radius: .8rem; padding: 1rem; margin: 1rem 0; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00)), var(--surface); box-shadow: 0 6px 20px rgba(0,0,0,0.25); transition: transform .15s ease, box-shadow .2s ease, border-color .2s ease; }
    .hoverable:hover { transform: translateY(-2px) scale(1.01); border-color: color-mix(in oklab, var(--border) 60%, var(--accent)); box-shadow: 0 12px 28px rgba(0,0,0,0.3); }
    .card-head { display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; }
    .highlights { list-style: none; padding-left: 0; margin: .5rem 0 0 0; }
    .highlights li { margin: .35rem 0; position: relative; padding-left: 1.2rem; }
    .highlights li::before { content: ''; position: absolute; left: 0; top: .55rem; width: .5rem; height: .5rem; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px rgba(108,92,231,0.18); animation: bulletPulse 2.2s ease-in-out infinite; }
    .dates { color: var(--muted-fg); white-space: nowrap; }
    .meta { color: var(--muted-fg); }
    .tags { display:flex; flex-wrap: wrap; gap: .4rem; margin-top: .5rem; }
    .tag { padding: .25rem .55rem; border-radius: 999px; background: var(--chip); color: var(--fg); font-size: .85rem; border: 1px solid var(--border); }
    .description { color: var(--muted-fg); margin: .25rem 0 .5rem; }
    .contact { list-style: none; padding: 0; margin: .5rem 0 0; }
    .contact li { margin: .25rem 0; }
    .footer { position: relative; z-index: 1; border-top: 1px solid var(--border); padding: 1rem 0; text-align: center; color: var(--muted-fg); }
    .grid { display:grid; grid-template-columns: repeat(12, 1fr); gap: 1rem; }
    .grid .card { grid-column: span 6; }
    @media (max-width: 960px){ .grid .card{ grid-column: span 12; } }
    @media (max-width: 720px){ .links{ display:none; } .card-head{ flex-direction:column; align-items:flex-start; } }
    .timeline { position: relative; margin-left: .6rem; }
    .timeline::before { content:''; position: absolute; left: .6rem; top: .2rem; bottom: .2rem; width: 2px; background: var(--border); }
    .tl-item { position: relative; padding-left: 2rem; margin: 1.1rem 0; }
    .tl-dot { position: absolute; left: -.1rem; top: .4rem; width: .8rem; height: .8rem; border-radius: 999px; background: var(--accent); box-shadow: 0 0 0 3px rgba(108,92,231,0.25); }
    .tl-card { padding: 1rem; border: 1px solid var(--border); border-radius: .8rem; background: var(--surface); transition: transform .15s ease, box-shadow .2s ease, border-color .2s ease; }
    @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(108,92,231,0.5);} 70% { box-shadow: 0 0 0 12px rgba(108,92,231,0);} 100% { box-shadow: 0 0 0 0 rgba(108,92,231,0);} }
    @keyframes bulletPulse { 0% { transform: scale(0.9); box-shadow: 0 0 0 2px rgba(108,92,231,0.18);} 50% { transform: scale(1.05); box-shadow: 0 0 0 4px rgba(108,92,231,0.12);} 100% { transform: scale(0.9); box-shadow: 0 0 0 2px rgba(108,92,231,0.18);} }
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ]),
    trigger('staggerList', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(80, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent {
  private resumeSvc = inject(ResumeService);
  private title = inject(Title);
  private meta = inject(Meta);
  resume = signal<Resume | null>(null);
  year = new Date().getFullYear();

  constructor() {
    this.resumeSvc.getResume().subscribe(r => {
      this.resume.set(r);
      if (r?.name) this.title.setTitle(`${r.name} - ${r.title || 'Portfolio'}`);
      const desc = r?.summary || 'Portfolio';
      this.meta.updateTag({ name: 'description', content: desc });
    });
  }
}

