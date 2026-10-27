// The résumé on the site (site/resume.pdf, lily-feng.com/resume.pdf): Xinyue's LaTeX résumé, the copy she sends
// out, made public: no GPA, and the site's email in place of the Kean one (it closes after graduation). Nothing
// else changes. The source stays out of this repository, because it has her GPA in it.
//
//   node build-resume.mjs [path/to/Xinyue_Feng_Resume.tex]
//   (default ~/Downloads/Xinyue_Feng_Resume_v2/Xinyue_Feng_Resume.tex, its fonts/ folder beside it)
//
// Needs tectonic (brew install tectonic) and poppler's pdftotext and pdfinfo. It stops, publishing nothing, if
// either change no longer fits the source, or if the PDF still shows the GPA or the Kean address.
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'site', 'resume.pdf');
const source = path.resolve(process.argv[2] || path.join(os.homedir(), 'Downloads', 'Xinyue_Feng_Resume_v2', 'Xinyue_Feng_Resume.tex'));
const EMAIL = 'lily.china@outlook.com';

const fail = (why) => {
  console.error(`build-resume: ${why}`);
  process.exit(1);
};
const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: 'utf8', ...opts });
  if (r.error) fail(`${cmd}: ${r.error.message}`);
  if (r.status !== 0) fail(`${cmd} ${args.join(' ')} failed:\n${(r.stderr || r.stdout).trim().split('\n').slice(-12).join('\n')}`);
  return r.stdout;
};

// the two changes, each to be found exactly once
let tex = readFileSync(source, 'utf8');
const gpa = [...tex.matchAll(/ \$\|\$ \\textbf\{GPA: ([^}]*)\}/g)];
if (gpa.length !== 1) fail(`expected one " $|$ \\textbf{GPA: …}" in ${source}, found ${gpa.length}`);
tex = tex.replace(gpa[0][0], '');
const kean = tex.split('fengxin@kean.edu').length - 1;
if (kean !== 1) fail(`expected the Kean address once in ${source}, found ${kean}`);
tex = tex.replace('fengxin@kean.edu', EMAIL);

// built beside a link to its fonts, with the source's own date in the PDF (the same source, the same file)
const dir = mkdtempSync(path.join(os.tmpdir(), 'resume-'));
try {
  writeFileSync(path.join(dir, 'Xinyue_Feng_Resume.tex'), tex);
  symlinkSync(path.join(path.dirname(source), 'fonts'), path.join(dir, 'fonts'));
  const epoch = String(Math.floor(statSync(source).mtimeMs / 1000));
  run('tectonic', ['-X', 'compile', 'Xinyue_Feng_Resume.tex'], { cwd: dir, env: { ...process.env, SOURCE_DATE_EPOCH: epoch } });
  const pdf = path.join(dir, 'Xinyue_Feng_Resume.pdf');

  const pages = Number(/^Pages:\s+(\d+)/m.exec(run('pdfinfo', [pdf]))?.[1]);
  const text = run('pdftotext', ['-layout', pdf, '-']);
  if (pages !== 1) fail(`the résumé is ${pages} pages, not one`);
  if (/GPA/i.test(text) || text.includes(gpa[0][1])) fail('the GPA is still in the PDF');
  if (/kean\.edu/i.test(text)) fail('the Kean address is still in the PDF');
  if (!text.includes(EMAIL)) fail(`${EMAIL} is not in the PDF`);

  copyFileSync(pdf, out);
  const bytes = readFileSync(out);
  console.log(`${path.relative(process.cwd(), out)}: 1 page, ${bytes.length} bytes, sha256 ${createHash('sha256').update(bytes).digest('hex')}`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
