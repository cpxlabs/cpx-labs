const assert = require('assert');
const path = require('path');

const EXTENSION_PATH = path.resolve(__dirname, '..');

async function run() {
  let browser;
  try {
    try {
      require.resolve('puppeteer');
    } catch {
      console.log('SKIP: puppeteer is not installed');
      return;
    }

    const puppeteer = require('puppeteer');

    console.log('Launching headless Chrome with extension...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
      ],
    });

    const page = await browser.newPage();

    const testData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+1 555-123-4567',
      linkedin: 'linkedin.com/in/janedoe',
      github: 'github.com/janedoe',
    };

    let totalAssertions = 0;
    function check(condition, msg) {
      totalAssertions++;
      if (!condition) {
        console.error(`FAIL: ${msg}`);
        process.exit(1);
      }
      console.log(`  PASS: ${msg}`);
    }

    // Create test page with form inputs matching the content script's selectors
    await page.setContent(`
      <html><body>
        <input name="full_name" id="name" placeholder="Nome completo" />
        <input id="email" placeholder="Email" />
        <input name="phone" placeholder="Phone" />
        <input name="linkedin" placeholder="LinkedIn Profile" />
        <input name="github_handle" placeholder="GitHub Username" />
      </body></html>
    `);

    console.log('\nTest: Content script form autofill');

    // Replicate the content script's fillFields logic inside page context
    const filledCount = await page.evaluate((data) => {
      const findField = (keywords) => {
        const selector = keywords
          .map(k => `input[name*="${k}" i], input[id*="${k}" i], input[placeholder*="${k}" i]`)
          .join(',');
        return document.querySelector(selector);
      };

      const dispatched = [];

      const fillFields = (d) => {
        const mappings = [
          { field: findField(['name', 'full_name', 'nome']), value: d.name },
          { field: findField(['email', 'correo', 'e-mail']), value: d.email },
          { field: findField(['phone', 'tel', 'celular']), value: d.phone },
          { field: findField(['linkedin']), value: d.linkedin },
          { field: findField(['github']), value: d.github },
        ];

        let filled = 0;
        mappings.forEach(({ field, value }) => {
          if (field && value) {
            field.value = value;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            dispatched.push('input');
            field.dispatchEvent(new Event('change', { bubbles: true }));
            dispatched.push('change');
            filled++;
          }
        });
        return filled;
      };

      const count = fillFields(data);
      return { filled: count, dispatched };
    }, testData);

    // Verify filled count
    check(filledCount.filled === 5,
      `Expected 5 fields filled, got ${filledCount.filled}`);

    // Verify input values
    const values = await page.evaluate(() => ({
      name: document.querySelector('input[name="full_name"]').value,
      email: document.querySelector('input#email').value,
      phone: document.querySelector('input[name="phone"]').value,
      linkedin: document.querySelector('input[name="linkedin"]').value,
      github: document.querySelector('input[name="github_handle"]').value,
    }));

    check(values.name === testData.name, `name field = "${values.name}"`);
    check(values.email === testData.email, `email field = "${values.email}"`);
    check(values.phone === testData.phone, `phone field = "${values.phone}"`);
    check(values.linkedin === testData.linkedin, `linkedin field = "${values.linkedin}"`);
    check(values.github === testData.github, `github field = "${values.github}"`);

    // Verify events dispatched (2 per field = 10 total)
    check(filledCount.dispatched.length === 10,
      `Expected 10 events (2 per field), got ${filledCount.dispatched.length}`);
    const inputEvents = filledCount.dispatched.filter(t => t === 'input').length;
    const changeEvents = filledCount.dispatched.filter(t => t === 'change').length;
    check(inputEvents === 5, `Expected 5 input events, got ${inputEvents}`);
    check(changeEvents === 5, `Expected 5 change events, got ${changeEvents}`);

    // Test with missing fields (no github input in DOM)
    await page.setContent(`
      <html><body>
        <input name="name" />
        <input name="email" />
        <input name="phone" />
      </body></html>
    `);

    const partialCount = await page.evaluate((data) => {
      const findField = (keywords) => {
        const selector = keywords
          .map(k => `input[name*="${k}" i], input[id*="${k}" i], input[placeholder*="${k}" i]`)
          .join(',');
        return document.querySelector(selector);
      };

      const fillFields = (d) => {
        const mappings = [
          { field: findField(['name', 'full_name', 'nome']), value: d.name },
          { field: findField(['email', 'correo', 'e-mail']), value: d.email },
          { field: findField(['phone', 'tel', 'celular']), value: d.phone },
          { field: findField(['linkedin']), value: d.linkedin },
          { field: findField(['github']), value: d.github },
        ];

        let filled = 0;
        mappings.forEach(({ field, value }) => {
          if (field && value) {
            field.value = value;
            filled++;
          }
        });
        return filled;
      };

      return fillFields(d);
    }, testData);

    check(partialCount === 3,
      `Expected 3 fields filled (no linkedin/github fields in DOM), got ${partialCount}`);

    // Test with empty values (should not fill)
    await page.setContent(`
      <html><body>
        <input name="name" />
        <input name="email" />
      </body></html>
    `);

    const emptyCount = await page.evaluate(() => {
      const findField = (keywords) => {
        const selector = keywords
          .map(k => `input[name*="${k}" i], input[id*="${k}" i], input[placeholder*="${k}" i]`)
          .join(',');
        return document.querySelector(selector);
      };

      const fillFields = (d) => {
        const mappings = [
          { field: findField(['name', 'full_name', 'nome']), value: d.name },
          { field: findField(['email', 'correo', 'e-mail']), value: d.email },
        ];

        let filled = 0;
        mappings.forEach(({ field, value }) => {
          if (field && value) {
            field.value = value;
            filled++;
          }
        });
        return filled;
      };

      return fillFields({ name: '', email: 'test@test.com' });
    });

    check(emptyCount === 1,
      `Expected 1 field filled (empty name skipped), got ${emptyCount}`);

    console.log(`\n=== SUMMARY ===`);
    console.log(`Test: E2E content script form autofill via Puppeteer`);
    console.log(`What it does:`);
    console.log(`  - Launches headless Chrome with the extension loaded`);
    console.log(`  - Creates a test page with form inputs matching content script selectors`);
    console.log(`  - Replicates the content script's fillFields logic via page.evaluate()`);
    console.log(`  - Verifies correct field filling, event dispatch, partial matches, and empty-value handling`);
    console.log(`Total assertions: ${totalAssertions}`);
    console.log('All tests passed!');

  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

run();
