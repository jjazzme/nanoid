// nanoid generator class
import { TAlphabet, TOptions } from './types.js';
import { env } from './env.js';

export class Generator {
  alphabet: TAlphabet;
  constructor(alphabet: TAlphabet) {
    this.alphabet = alphabet;
  }

  usedAlphabet(options: TOptions) {
    let alphabet = env.alphabet.full;
    if (options.noDigits)
      alphabet = this.lettersRemover(alphabet, env.alphabet.digits);
    if (options.noLower)
      alphabet = this.lettersRemover(alphabet, env.alphabet.lowercase);
    if (options.noCapital)
      alphabet = this.lettersRemover(alphabet, env.alphabet.capital);
    if (options.noSymbols)
      alphabet = this.lettersRemover(alphabet, env.alphabet.symbols);
    if (options.noUnreadable)
      alphabet = this.lettersRemover(alphabet, env.alphabet.unreadable);

    if (alphabet.length < 10) alphabet = env.alphabet.full;
    return alphabet;
  }

  private lettersRemover(source: string, mask: string) {
    const maskSet = new Set(mask);
    const targetChars = source.split('').filter((char) => !maskSet.has(char));
    return targetChars.join('');
  }
}
