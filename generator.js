// ────────────────────────────────────────────────
// Core name generation logic — all syllable & formatting rules live here
// ────────────────────────────────────────────────

const cultures = {
  elven: {
    prefixes:  ["Ae","Al","Ara","Bel","Cal","Eil","Fae","Il","Lae","Lor","Mira","Nae","Quel","Syl","Thal","Vaer","Yel","Ere","Fin","Lir"],
    cores:     ["dan","dil","dor","fal","lith","lyn","mir","nor","raen","riel","sin","thas","viel","wyn","zel","len","sar","thir","vae"],
    suffixes:  ["ael","ara","eth","ien","ion","ith","or","riel","thas","uil","ya","is","el","yn"],
    mutationChance: 0.48,
    mutations: ["apostrophe", "extendVowel"]
  },
  dwarven: {
    prefixes:  ["Dur","Thor","Borin","Dwal","Grim","Krag","Mor","Rur","Thrain","Bral","Dren","Gor","Har","Kor","Thur"],
    cores:     ["ak","dar","din","gar","grim","mar","rak","rin","thor","var","zur","bor","dur","krag","mor"],
    suffixes:  ["ak","bar","din","gar","grim","or","rak","rin","ur","var","orim","dur","thain"],
    mutationChance: 0.58,
    mutations: ["doubleConsonant"]
  },
  orcish: {
    prefixes:  ["Gorz","Krag","Mog","Ruk","Thrag","Urg","Vorg","Zag","Brak","Gruk","Skar","Dreg","Korz","Vrak"],
    cores:     ["ash","goth","grak","kraz","mog","ruk","thak","urg","vok","zarg","dush","grom","krag","throg"],
    suffixes:  ["ar","ash","goth","ok","tar","uk","ush","zog","g","k","sh"],
    mutationChance: 0.38,
    mutations: ["doubleConsonant"]
  },
  draconic: {
    prefixes:  ["Az","Drak","Ign","Krav","Syr","Vyr","Zor","Dra","Kyr","Ska","Thrax","Vra","Zyr","Rax"],
    cores:     ["ar","eth","gor","kar","nyx","rath","sar","thra","vor","zar","drax","keth","vyr"],
    suffixes:  ["ax","eth","or","rath","ur","yx","zar","is","oth","yx"],
    mutationChance: 0.42,
    mutations: ["apostrophe", "extendVowel"]
  },
  celestial: {
    prefixes:  ["Auri","Cael","Elys","Lumin","Sera","Zorah","Astra","Div","Lux","Sol","Ael","Ily","Ser"],
    cores:     ["el","ia","iel","ion","ira","ith","ora","riel","ura","yn","ara","eth","ora","lyn"],
    suffixes:  ["el","ia","iel","is","yn","ara","eth","ora","is","ara"],
    mutationChance: 0.52,
    mutations: ["extendVowel", "apostrophe"]
  },
  shadowborn: {
    prefixes:  ["Um","Nyx","Vor","Sable","Dusk","Zeth","Kral","Mor","Shade","Noct","Vyr","Neth","Gloom"],
    cores:     ["ath","ek","ith","or","ul","veth","zar","zeth","ekh","oth","ul","vyr"],
    suffixes:  ["ar","eth","is","or","ul","veth","zar","ek","ith","or"],
    mutationChance: 0.62,
    mutations: ["apostrophe", "doubleConsonant"]
  }
};

function generateBaseName(cultureKey) {
  const c = cultures[cultureKey];
  if (!c) return "???";

  const patterns = [
    () => randomItem(c.prefixes) + randomItem(c.cores) + randomItem(c.suffixes),
    () => randomItem(c.prefixes) + randomItem(c.cores),
    () => randomItem(c.prefixes) + randomItem(c.cores) + randomItem(c.cores),
    () => randomItem(c.cores) + randomItem(c.suffixes)
  ];

  let name = randomItem(patterns)().toLowerCase();

  // Basic cleanup — prevent ugly repeats
  name = name.replace(/([aeiou])\1{3,}/gi, '$1$1');
  name = name.replace(/([bcdfghjklmnpqrstvwxyz])\1{3,}/gi, '$1$1');

  // Apply cultural tone mutation
  if (Math.random() < c.mutationChance) {
    const mutType = randomItem(c.mutations);

    if (mutType === "apostrophe") {
      const pos = randomInt(2, name.length - 3);
      name = name.slice(0, pos) + "'" + name.slice(pos);
    }
    else if (mutType === "extendVowel") {
      name = name.replace(/[aeiou]/gi, m => m.repeat(randomInt(1, 3)));
    }
    else if (mutType === "doubleConsonant") {
      name = name.replace(/[bcdfghjklmnpqrstvwxyz]/gi, m =>
        Math.random() < 0.55 ? m + m : m
      );
    }
  }

  return capitalize(name);
}

function formatName(base, category) {
  switch (category) {
    case "characters":
      return base;

    case "places":
      const endings = ["Haven","Reach","Hold","Gate","Hollow","Spire","Crag","Vale","Forge","Peak","Den","Towers","Wells","Grove","Deep","Fall"];
      return base + " " + randomItem(endings);

    case "factions":
      const templates = [
        `Order of ${base}`,
        `The ${base} Covenant`,
        `Clan ${base}`,
        `The ${base} Legion`,
        `Brotherhood of ${base}`,
        `The ${base} Conclave`,
        `House ${base}`
      ];
      return randomItem(templates);

    case "artifacts":
      const art = [
        `Blade of ${base}`,
        `Crown of ${base}`,
        `Orb of ${base}`,
        `Tome of ${base}`,
        `Relic of ${base}`,
        `Staff of ${base}`,
        `Amulet of ${base}`,
        `Gauntlet of ${base}`
      ];
      return randomItem(art);

    case "creatures":
      const pluralEndings = ["ians","ari","kin","ra","th"," brood","spawn","borne","lings","im","yr","ae"];
      return base + randomItem(pluralEndings);

    default:
      return base;
  }
}

function generateNames(culture, category, count = 2 ) {
  const results = new Set();

  while (results.size < count) {
    const base = generateBaseName(culture);
    const formatted = formatName(base, category);
    results.add(formatted);
  }

  return [...results];
  }
