'use strict'

const form = document.getElementById('formAvailableCharacters');
const find = document.getElementById('find');
const grid = document.getElementById('grid');
const result = document.querySelector('.result');
const reset = document.getElementById('resetBtn');

const langOptions = {
  en: {
    length: 26,
    startCharCode: 65,
    chars: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'br', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'br', 'z', 'x', 'c', 'v', 'b', 'n', 'm']
  },
  ru: {
    length: 32,
    startCharCode: 1040,
    chars: ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'br', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'br', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю']
  },
};

let blockedLetters = [];

createCharsGrid('en');

function createCharsGrid(lang) {
  const letters = getAlphabet(lang);
  const fragment = new DocumentFragment()
  grid.textContent = '';

  letters.forEach(function (char) {
    const div = document.createElement('div');

    if (char === 'br') {
      div.classList.add('break');
    } else {
      div.classList.add('cell');
      div.textContent = char;
      div.id = char;
    }

    fragment.appendChild(div);
  });

  grid.appendChild(fragment);
}

function getAlphabet(lang) {
  return langOptions[lang]?.chars ?? [];
}

function validate(input) {
  const val = input.value;
  if (input.value === '') {
    // TODO: what if there are 2 repeated characters?
    document.getElementById((input.dataset.char).toLowerCase())?.classList.remove('selected');
  }

  input.value = val.replace(/[^A-Za-zA-Яа-я]/g, '');

  if (input.nextElementSibling && input.nextElementSibling.tagName === 'INPUT' && (val.charCodeAt(0) === 32 || ['ru', 'en'].includes(checkCharCode(val)))) {
    input.nextElementSibling.focus();
  }

  input.dataset.char = input.value.toLowerCase();
  const char = document.getElementById(input.value.toLowerCase());

  if (char) {
    char.className = 'cell selected';
  }
}

function checkCharCode(char) {
  if (!char) return '';
  if ((char.charCodeAt(0) >= langOptions.en.startCharCode && char.charCodeAt(0) < langOptions.en.startCharCode + langOptions.en.length) || (char.charCodeAt(0) >= 97 && char.charCodeAt(0) < 97 + langOptions.en.length)) return 'en';
  if (char.charCodeAt(0) >= langOptions.ru.startCharCode && char.charCodeAt(0) < langOptions.ru.startCharCode + langOptions.ru.length * 2) return 'ru';
  return 'noname';
}

function getLanguage(options) {
  const langArr = Object.values(options).reduce((total, value) => {
    const lang = checkCharCode(value);
    return lang !== '' && total.indexOf(lang) < 0 ? [...total, lang] : [...total];
  }, []);

  return langArr.length > 1 ? 'noname' : langArr[0];
}

function resetForm() {
  form.reset();
  result.classList.remove('on');
  reset.classList.remove('on');
  document.getElementById('langEn').click();
}

function showHint(value) {
  result.innerHTML = value;
  if (!result.classList.contains('on')) {
    result.classList.add('on');
  }
  if (!reset.classList.contains('on')) {
    reset.classList.add('on');
  }
}

function handleChangeLang(radio) {
  createCharsGrid(radio.value);
  document.body.className = radio.value;
}

form.addEventListener('send', e => e.preventDefault());

reset.addEventListener('click', resetForm);

find.addEventListener('click', e => {
  e.preventDefault();
  let hint = '<span class="en">Requires at least 2 letters</span><span class="ru">Введите минимум 2 буквы</span>';
  let wordLength = 0;
  let letters = 0;
  const options = {};
  const formData = new FormData(form);
  const dict = {
    words_ru: words_ru ?? [],
    words_en: words_en ?? [],
  }

  for (let p of formData) {
    options[p[0]] = p[1];
    if (p[1] !== '') {
      letters++;
    }
    wordLength++;
  }

  if (letters < 2) {
    showHint(hint);
    return;
  }

  const lang = getLanguage(options);
  if (lang === 'noname') {
    showHint('<span class="en">The language you are using is not supported.</span><span class="ru">Язык ввода не поддерживается.</span>');
    return;
  }

  hint = dict[`words_${lang}`].reduce((total, currentWord) => {
    if (currentWord.length === wordLength && !blockedLetters.some(v => currentWord.includes(v))) {
      const res = Object.values(options).every((value, i) => (currentWord[i] === value.toLowerCase() || value === ''));
      return res ? [...total, currentWord] : [...total];
    }
    return [...total];
  }, []);

  result.setAttribute('lang', lang);

  showHint(hint.length > 0 ? hint.join(' ') : '<span class="en">No result.</span><span class="ru">Ничего не найдено.</span>');
});

grid.addEventListener('click', e => {
  const target = e.target;

  if (target.classList.contains('cell') && !target.classList.contains('selected')) {
    target.classList.toggle('not');

    if (target.classList.contains('not')) {
      blockedLetters = [...blockedLetters, target.id.toLowerCase()];
    } else {
      blockedLetters = blockedLetters.filter(item => item !== target.id);
    }
  }
});
