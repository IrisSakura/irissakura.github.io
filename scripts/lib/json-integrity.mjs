const NUMBER_PATTERN = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/;

export function assertJsonHasNoDuplicateKeys(source, label = '<json>') {
  let index = source.charCodeAt(0) === 0xFEFF ? 1 : 0;

  const fail = (message, at = index) => {
    const prefix = source.slice(0, at);
    const line = (prefix.match(/\n/g) ?? []).length + 1;
    const lastNewline = prefix.lastIndexOf('\n');
    const column = at - lastNewline;
    throw new SyntaxError(`${label}:${line}:${column}: ${message}`);
  };

  const skipWhitespace = () => {
    while (/\s/u.test(source[index] ?? '')) index += 1;
  };

  const parseString = () => {
    const start = index;
    if (source[index] !== '"') fail('expected a JSON string');
    index += 1;
    while (index < source.length) {
      if (source[index] === '"') {
        index += 1;
        const raw = source.slice(start, index);
        try {
          return JSON.parse(raw);
        } catch (error) {
          fail(`invalid JSON string: ${error.message}`, start);
        }
      }
      if (source[index] === '\\') index += 1;
      index += 1;
    }
    fail('unterminated JSON string', start);
  };

  const parseLiteral = (literal) => {
    if (source.slice(index, index + literal.length) !== literal) fail(`expected ${literal}`);
    index += literal.length;
  };

  const parseValue = (jsonPath) => {
    skipWhitespace();
    const token = source[index];
    if (token === '{') return parseObject(jsonPath);
    if (token === '[') return parseArray(jsonPath);
    if (token === '"') return parseString();
    if (token === 't') return parseLiteral('true');
    if (token === 'f') return parseLiteral('false');
    if (token === 'n') return parseLiteral('null');
    const number = source.slice(index).match(NUMBER_PATTERN)?.[0];
    if (number) {
      index += number.length;
      return;
    }
    fail('expected a JSON value');
  };

  const parseObject = (jsonPath) => {
    index += 1;
    skipWhitespace();
    const keys = new Set();
    if (source[index] === '}') {
      index += 1;
      return;
    }
    while (index < source.length) {
      skipWhitespace();
      const keyStart = index;
      const key = parseString();
      if (keys.has(key)) fail(`duplicate key ${JSON.stringify(key)} at ${jsonPath}`, keyStart);
      keys.add(key);
      skipWhitespace();
      if (source[index] !== ':') fail('expected a colon after an object key');
      index += 1;
      parseValue(`${jsonPath}.${key}`);
      skipWhitespace();
      if (source[index] === '}') {
        index += 1;
        return;
      }
      if (source[index] !== ',') fail('expected a comma or closing brace');
      index += 1;
    }
    fail('unterminated JSON object');
  };

  const parseArray = (jsonPath) => {
    index += 1;
    skipWhitespace();
    if (source[index] === ']') {
      index += 1;
      return;
    }
    let itemIndex = 0;
    while (index < source.length) {
      parseValue(`${jsonPath}[${itemIndex}]`);
      itemIndex += 1;
      skipWhitespace();
      if (source[index] === ']') {
        index += 1;
        return;
      }
      if (source[index] !== ',') fail('expected a comma or closing bracket');
      index += 1;
    }
    fail('unterminated JSON array');
  };

  parseValue('$');
  skipWhitespace();
  if (index !== source.length) fail('unexpected content after the JSON value');
}
