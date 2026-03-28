/**
 * app.test.js — Unit tests for application logic
 *
 * Tests core utility functions and validates the build
 * configuration works correctly. Runs during Jenkins "Test" stage.
 */

const path = require('path');
const fs = require('fs');

describe('Project Structure', () => {

  it('should have a valid package.json', () => {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    expect(fs.existsSync(pkgPath)).toBe(true);

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    expect(pkg).toHaveProperty('name');
    expect(pkg).toHaveProperty('scripts');
    expect(pkg.scripts).toHaveProperty('start');
    expect(pkg.scripts).toHaveProperty('test');
    expect(pkg.scripts).toHaveProperty('lint');
    expect(pkg.scripts).toHaveProperty('build');
  });

  it('should have index.html in public/', () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    expect(fs.existsSync(htmlPath)).toBe(true);
  });

  it('should have style.css in public/css/', () => {
    const cssPath = path.join(__dirname, '..', 'public', 'css', 'style.css');
    expect(fs.existsSync(cssPath)).toBe(true);
  });

  it('should have app.js in public/js/', () => {
    const jsPath = path.join(__dirname, '..', 'public', 'js', 'app.js');
    expect(fs.existsSync(jsPath)).toBe(true);
  });

  it('should have a Jenkinsfile', () => {
    const jenkinsPath = path.join(__dirname, '..', 'Jenkinsfile');
    expect(fs.existsSync(jenkinsPath)).toBe(true);
  });

  it('should have a Dockerfile', () => {
    const dockerPath = path.join(__dirname, '..', 'Dockerfile');
    expect(fs.existsSync(dockerPath)).toBe(true);
  });

  it('should have a docker-compose.yml', () => {
    const composePath = path.join(__dirname, '..', 'docker-compose.yml');
    expect(fs.existsSync(composePath)).toBe(true);
  });
});

describe('index.html content', () => {
  let html;

  beforeAll(() => {
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    html = fs.readFileSync(htmlPath, 'utf-8');
  });

  it('should have a valid DOCTYPE', () => {
    expect(html).toMatch(/<!DOCTYPE html>/i);
  });

  it('should include meta viewport tag', () => {
    expect(html).toContain('viewport');
  });

  it('should reference the CSS file', () => {
    expect(html).toContain('css/style.css');
  });

  it('should reference the JS file', () => {
    expect(html).toContain('js/app.js');
  });

  it('should have a resume preview section', () => {
    expect(html).toContain('resume-preview');
  });
});
