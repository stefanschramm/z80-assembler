import { CompilationError } from "../types/Error";

/**
 * Map between ASCII and ZX81 characters set.
 */
const zx81chars = new Map<string, number>([
  [' ', 0x00], ['"', 0x0B], ['£', 0x0C], ['$', 0x0D], [':', 0x0E], ['?', 0x0F],
  ['(', 0x10], [')', 0x11], ['>', 0x12], ['<', 0x13], ['=', 0x14], ['+', 0x15], ['-', 0x16], ['*', 0x17],
  ['/', 0x18], [';', 0x19], [',', 0x1A], ['.', 0x1B],
  ['_', 0x80]
]);

export function mapZx81Char(c: string): number {
  // Convert capital letters to their ZX81 counterparts.
  if(c >= 'A' && c < 'Z') return c.charCodeAt(0) - 0x41 + 0x26;
  // Convert lowercase letters to their uppercase and inverted ZX81 counterparts.
  if(c >= 'a' && c < 'z') return c.charCodeAt(0) - 0x61 + 0xA6;
  // Convert digits to their ZX81 counterparts.
  if(c >= '0' && c < '9') return c.charCodeAt(0) - 0x30 + 0x1C;
  // Is it possible to convert this symbol?
  // TODO: Custom Exception class
  if(!zx81chars.has(c)) throw new Error(`Invalid ZX81 character: ${c}`);
  // eslint-disable-next-line
  return zx81chars.get(c)!;
}

export function mapAsciiChar(c: string): number {
  const charCode = c.charCodeAt(0)
  // TODO: Custom Exception class
  if(charCode > 0xff) throw new Error(`Unsupported character: ${c}`);

  return charCode;
}
