const PISTON_URL = 'https://emkc.org/api/v2/piston/execute'

const LANG_MAP = {
  java:       { language: 'java',       version: '15.0.2',  name: 'Main.java'  },
  python:     { language: 'python',     version: '3.10.0',  name: 'main.py'    },
  cpp:        { language: 'c++',        version: '10.2.0',  name: 'main.cpp'   },
  c:          { language: 'c',          version: '10.2.0',  name: 'main.c'     },
  javascript: { language: 'javascript', version: '18.15.0', name: 'main.js'    },
  typescript: { language: 'typescript', version: '5.0.3',   name: 'main.ts'    },
  go:         { language: 'go',         version: '1.16.2',  name: 'main.go'    },
  rust:       { language: 'rust',       version: '1.50.0',  name: 'main.rs'    },
  kotlin:     { language: 'kotlin',     version: '1.6.20',  name: 'main.kt'    },
  swift:      { language: 'swift',      version: '5.3.3',   name: 'main.swift' },
}

/**
 * Run code via Piston API.
 * @returns {{ ok: boolean, stdout: string, stderr: string, exitCode: number }}
 */
export async function runViaPiston(language, code, stdin = '') {
  const m = LANG_MAP[language] ?? { language, version: '*', name: `main.${language}` }

  try {
    const res = await fetch(PISTON_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: m.language,
        version: m.version,
        files: [{ name: m.name, content: code }],
        stdin,
      }),
    })

    if (!res.ok) {
      return { ok: false, stdout: '', stderr: `Piston API error: ${res.status} ${res.statusText}`, exitCode: -1 }
    }

    const data = await res.json()

    if (!data.run) {
      return { ok: false, stdout: '', stderr: data.message || 'No run result from Piston', exitCode: -1 }
    }

    const compileOk = data.compile == null || data.compile.code === 0
    const runOk     = data.run.code === 0
    const stderr    = [data.compile?.stderr, data.run.stderr].filter(Boolean).join('\n').trim()

    return {
      ok: compileOk && runOk,
      stdout: data.run.stdout ?? '',
      stderr: stderr || (!runOk ? `Exit code ${data.run.code}` : ''),
      exitCode: data.run.code ?? 0,
      compileStderr: data.compile?.stderr ?? '',
    }
  } catch (e) {
    return {
      ok: false,
      stdout: '',
      stderr: `Network error: ${e.message}. Check your internet connection.`,
      exitCode: -1,
    }
  }
}

/** Normalize output for comparison (trim trailing whitespace per line) */
export function normalizeOutput(s) {
  return (s ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trimEnd()
}

/** Run JS locally in a sandboxed Function (no network needed) */
export function runJavaScriptLocally(code, stdin = '') {
  let output = ''
  const fakeConsole = { log: (...a) => { output += a.map(String).join(' ') + '\n' } }
  try {
    const fn = new Function('console', `const stdin = ${JSON.stringify(stdin)};\n${code}`)
    fn(fakeConsole)
    return { ok: true, stdout: output, stderr: '', exitCode: 0 }
  } catch (e) {
    return { ok: false, stdout: output, stderr: String(e.message || e), exitCode: 1 }
  }
}

/** Unified execute: JS runs locally, everything else via Piston */
export async function executeCode(language, code, stdin = '') {
  if (language === 'javascript') return runJavaScriptLocally(code, stdin)
  return runViaPiston(language, code, stdin)
}
