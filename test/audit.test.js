const execa = require('execa');

const c = process.cwd();
const fixtures = `${c}/test/fixtures/audit`;
const cwd = name => `${fixtures}/${name}`;

test('Reports no errors with empty directory', async () => {
  const { stdout, exitCode } = await execa.command('pos-cli audit', { cwd: cwd('empty') });
  expect(exitCode).toBe(0);
  expect(stdout).toMatch('[Audit] 0 rules detected issues.');
});

describe('Audit - app directory', () => {
  test('Reports 1 error in app', async () => {
    const { stdout, exitCode } = await execa.command('pos-cli audit', { cwd: cwd('oneError') });
    expect(exitCode).toBe(0);
    expect(stdout).toMatch('[Audit] 1 rule detected issues.');
    expect(stdout).toMatch('enable_profiler: true');
    expect(stdout).toMatch('app/views/pages/error.liquid');
  });

  test('Reports 2 different errors in one file', async () => {
    const { stdout, exitCode } = await execa.command('pos-cli audit', { cwd: cwd('twoErrors') });
    expect(exitCode).toBe(0);
    expect(stdout).toMatch('[Audit] 2 rules detected issues.');
    expect(stdout).toMatch('enable_profiler: true');
    expect(stdout).toMatch('[DEPRECATED TAG] query_graph');
    expect(stdout).toMatch('app/views/pages/error.liquid');
  });

  test('Reports 3 different errors in two files', async () => {
    const { stdout, exitCode } = await execa.command('pos-cli audit', { cwd: cwd('threeErrors') });
    expect(exitCode).toBe(0);
    expect(stdout).toMatch('[Audit] 3 rules detected issues.');
    expect(stdout).toMatch('enable_profiler: true');
    expect(stdout).toMatch('[DEPRECATED TAG] query_graph');
    expect(stdout).toMatch('app/views/pages/error.liquid');
    expect(stdout).toMatch('app/views/pages/error2.liquid');
  });
});

describe('Audit - marketplace_builder directory', () => {
  test('Reports 3 different errors in two files', async () => {
    const { stdout, exitCode } = await execa.command('pos-cli audit', { cwd: cwd('threeErrors_mpb') });
    expect(exitCode).toBe(0);
    expect(stdout).toMatch('[Audit] 3 rules detected issues.');
    expect(stdout).toMatch('enable_profiler: true');
    expect(stdout).toMatch('[DEPRECATED TAG] query_graph');
    expect(stdout).toMatch('marketplace_builder/views/pages/error.liquid');
    expect(stdout).toMatch('marketplace_builder/views/pages/error2.liquid');
  });
});

describe('Audit - modules directory', () => {

  test('Reports errors for modules files', async () => {
    const { stdout, exitCode } = await execa.command('pos-cli audit', { cwd: cwd('modules') });
    expect(exitCode).toBe(0);
    expect(stdout).toMatch('[Audit] 3 rules detected issues.');
    expect(stdout).toMatch('enable_profiler: true');
    expect(stdout).toMatch('[DEPRECATED TAG] query_graph');
    expect(stdout).toMatch('modules/first/public/views/pages/error.liquid');
    expect(stdout).toMatch('modules/first/public/views/pages/error2.liquid');
    expect(stdout).toMatch('modules/second/private/views/pages/error.liquid');
    expect(stdout).toMatch('modules/second/private/views/pages/error2.liquid');
  });

});