/**
 * Z80 Assembler in Typescript
 *
 * File:        Parse.ts
 * Description: Fonctions uses by the parser to convert strings
 * Author:			Sebastien Andrivet
 * License:			GPLv3
 * Copyrights: 	Copyright (C) 2023 Sebastien Andrivet
 */

import {PosInfo} from "./z80";
import {CompilationError} from "../types/Error";
import {DEVICE_ZX81, parseData} from '../compiler/Compiler';

/**
 * Parse a number.
 * @param pos Position of the number in the source code.
 * @param str The characters of the number.
 * @param base The base of the number.
 * @param nbBytes The number of bytes to represent this number (1 or 2)
 */
export function parseNumber(pos: PosInfo, str: string, base: number, nbBytes: number): number {
  // Convert the string to a number.
  let v = parseInt(str, base);
  if(isNaN(v)) throw new CompilationError({filename: parseData.fileName, pos: pos},
    `Number '${str}' is invalid in base ${base}.`)
  switch(nbBytes) {
    case 1:
      // Must be able to fit this number into 8 bits.
      if(v > 255 || v < -256) throw new CompilationError({filename: parseData.fileName, pos: pos},
        `Number '${str}' does not fit into a byte.`);
      // If negative, take the 2-complement.
      if(v < 0) v = 256 + v;
      break;

    case 2:
      // Must be able to fit this number into 16 bits.
      if(v > 65535 || v < -65536) throw new CompilationError({filename: parseData.fileName, pos: pos},
        `Number '${str}' does not fit into a word.`);
      // If negative, take the 2-complement.
      if(v < 0) v = 65536 + v;
      break;

    default:
      throw new CompilationError({filename: parseData.fileName, pos: pos},
        `Invalid number of bytes (${nbBytes})`);
  }

  return v;
}

/**
 * Parse a simple escape, i.e. a backslash followed by a character.
 * @param pos Position of the character in the source code.
 * @param c The character after the backslash.
 */
export function parseSimpleEscape(pos: PosInfo, c: string): number[] {
  switch(c) {
    case 'n':  return [0x0B];
    case '"':  return [0x0B];
    default:  throw new CompilationError({filename: parseData.fileName, pos: pos},
      `Invalid escape: \\${c}`);
  }
}

/**
 * Parse an octal value.
 * @param pos Position of the value in the source code.
 * @param value The characters representing the value.
 */
export function parseOctalEscape(pos: PosInfo, value: string): number[] {
  const v = parseInt(value, 8);
  if(v > 255) throw new CompilationError({filename: parseData.fileName, pos: pos},
    `Number '${value}' in octal escape sequence does not fit into a byte.`);
  return [v];
}

/**
 * Parse a hexadecimal value.
 * @param pos Position of the value in the source code.
 * @param value The characters representing the value.
 */
export function parseHexadecimalEscape(pos: PosInfo, value: string): number[] {
  const v = parseInt(value, 16);
  if(v > 255) throw new CompilationError({filename: parseData.fileName, pos: pos},
    `Number '${value}' in hexadecimal escape sequence does not fit into a byte.`);
  return [v];
}

/**
 * Parse a character written in ASCII.
 * @param pos Position of the character in the source code.
 * @param c The ASCII character.
 */
export function parseChar(pos: PosInfo, c: string): [number] {
  try {
    return [parseData.mapCharacter(c)];
  } catch {
    throw new CompilationError({filename: parseData.fileName, pos: pos}, `Invalid character: ${c}`)
  }
}
