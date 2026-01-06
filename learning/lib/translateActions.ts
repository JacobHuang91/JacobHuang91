'use server';

import translate from '@vitalets/google-translate-api';

export async function translateText(text: string, to: string = 'zh-CN'): Promise<string> {
  try {
    const result = await translate(text, { to });
    return result.text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

export async function translateCard(card: any): Promise<any> {
  try {
    const [
      translatedTitle,
      translatedOneLineEssence,
      translatedUseWhen,
      translatedTypicalCase,
      translatedRisks,
      translatedWhenNotToUse,
    ] = await Promise.all([
      translateText(card.title),
      translateText(card.oneLineEssence),
      translateText(card.useWhen),
      Promise.all(card.typicalCase.map((c: string) => translateText(c))),
      card.risks ? translateText(card.risks) : Promise.resolve(undefined),
      card.whenNotToUse ? translateText(card.whenNotToUse) : Promise.resolve(undefined),
    ]);

    return {
      ...card,
      title: translatedTitle,
      oneLineEssence: translatedOneLineEssence,
      useWhen: translatedUseWhen,
      typicalCase: translatedTypicalCase,
      risks: translatedRisks,
      whenNotToUse: translatedWhenNotToUse,
    };
  } catch (error) {
    console.error('Card translation error:', error);
    return card;
  }
}
