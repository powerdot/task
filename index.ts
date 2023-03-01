import db from "./db";

/*
- Задача:
Получить список всех партнеров с % токенов среди всех токенов

- Что является токеном партнера:
Когда game и dep токена относятся к играм этого партнера
// game: Y*, dep: Y* - зачитывается партнеру
// game: Y*, dep: X* - не зачитывается партнеру
// game: X*, dep: Y* - не зачитывается партнеру

- Нужно вернуть массив объектов, в каждом из которых id, name и tokensPercent партнера.
- Отсортированный по массиву partnersOrder
*/


function orderArray(arrayWithIds: any, order_array: any) {
  let result: any = [];
  for (var order of order_array) {
    let object = arrayWithIds.find((x: any) => x.id === order);
    if (!object) continue;
    result.push(object);
  }
  if (result.length !== arrayWithIds.length) {
    let notIncludedCategories = arrayWithIds.filter((x: any) => !result.find((y: any) => y.id === x.id));
    notIncludedCategories = notIncludedCategories.sort((a: any, b: any) => a.id - b.id);
    result = result.concat(notIncludedCategories);
  }

  return result;
}

function getPartnersTokensPercent() {
  let partnes: any = [];
  let partnersCount = 0;

  for (let i = 0; i < 100; i++) {
    var db_partners = db.partners;
    const db_tokens = db.tokens;
    var partner = db_partners[i];
    if (!partner) break;
    partnersCount = i + 1;
    var ptokens: any = [];
    var pgames: any = partner.games.toString();
    for (var ti in db_tokens) {
      let t = db_tokens[ti];
      var f = pgames.indexOf(t.game) >= 0 && pgames.indexOf(t.dep) >= 0;
      if (f && !!t) ptokens[ptokens.length] = { ...t, weight: 1 / db_tokens.length };
    }

    type Partner = {
      id: number;
      name: string;
      list: any;
      alllist: any;
      onetokenweight: number;
    }

    var partner2: any = {} as Partner;
    partner2.id = partner.id;
    partner2.name = partner.name;
    partner2.list = ptokens;
    partner2.alllist = db_tokens;
    partner2.onetokenweight = 1 / ptokens.length;
    partnes[partnes.length] = partner2;
  }

  let result: any = [];

  for (let i = 0; i < partnersCount; i++) {
    let partner = partnes[i];
    let partnerweight = 0;

    for (let ti = 0; ti < partner.list.length; ti++)
      partnerweight = partnerweight + partner.list[ti].weight;

    result[result.length] = {
      id: partner.id,
      name: partner.name,
      tokensPercent: partnerweight
    }
  }

  var otsortirovano = orderArray(result, db.partnersOrder);

  return result = otsortirovano;
}

console.log(getPartnersTokensPercent());