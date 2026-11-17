export type TokenType = 'plain' | 'comment' | 'string' | 'keyword' | 'tag' | 'attr' | 'number' | 'punct';

export interface Token {
  text: string;
  type: TokenType;
}

const KEYWORDS =
  'import|from|export|default|function|return|const|let|var|if|else|type|interface|extends|new|await|async|true|false|null|undefined';

// Order matters: comments and strings first, so nothing inside them is re-read as code.
const PATTERN = new RegExp(
  [
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)', // 1 comment
    '(`(?:\\\\.|[^`\\\\])*`|\'(?:\\\\.|[^\'\\\\\\n])*\'|"(?:\\\\.|[^"\\\\\\n])*")', // 2 string
    '(<\\/?)([A-Za-z][\\w.]*)', // 3 tag bracket, 4 tag name
    `\\b(${KEYWORDS})\\b`, // 5 keyword
    '\\b(\\d+(?:\\.\\d+)?)\\b', // 6 number
    '([A-Za-z_$][\\w$-]*)(?==)', // 7 JSX attribute
    '(\\/?>)', // 8 closing bracket
  ].join('|'),
  'g',
);

/**
 * Small TSX/JSX tokenizer for the docs code view. It is deliberately simple:
 * enough for the short usage snippets shown on component pages, with no dependency.
 * Returns one token list per line, ready for line numbers.
 */
export function highlight(code: string): Token[][] {
  const tokens: Token[] = [];
  let last = 0;

  for (const match of code.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ text: code.slice(last, index), type: 'plain' });

    if (match[1]) tokens.push({ text: match[1], type: 'comment' });
    else if (match[2]) tokens.push({ text: match[2], type: 'string' });
    else if (match[3]) {
      tokens.push({ text: match[3], type: 'punct' });
      tokens.push({ text: match[4], type: 'tag' });
    } else if (match[5]) tokens.push({ text: match[5], type: 'keyword' });
    else if (match[6]) tokens.push({ text: match[6], type: 'number' });
    else if (match[7]) tokens.push({ text: match[7], type: 'attr' });
    else if (match[8]) tokens.push({ text: match[8], type: 'punct' });

    last = index + match[0].length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), type: 'plain' });

  // Split on newlines so each line can carry its own number.
  const lines: Token[][] = [[]];
  for (const token of tokens) {
    const parts = token.text.split('\n');
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ text: part, type: token.type });
    });
  }
  return lines;
}
