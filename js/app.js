const form = document.getElementById('form');
const find = document.getElementById('find');
const result = document.querySelector('.result');
const reset = document.getElementById('resetBtn');

function validate(input) {
  input.value = input.value.replace(/\d/g, '').substr(0, 1).toUpperCase();
}

function checkCharCode(char) {
  if (!char) return '';
  if (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 123) return 'en';
  if (char.charCodeAt(0) > 1024 && char.charCodeAt(0) < 1106) return 'ru';
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
}

function showHint(value) {
  result.textContent = value;
  if (!result.classList.contains('on')) {
    result.classList.add('on');
  }
  if (!reset.classList.contains('on')) {
    reset.classList.add('on');
  }
}

form.addEventListener('send', e => e.preventDefault());
reset.addEventListener('click', resetForm);

find.addEventListener('click', e => {
  e.preventDefault();
  let hint = 'Requires at least 2 letters';
  let wordLength = 0;
  let letters = 0;
  const options = {};
  const formData = new FormData(form);
  const dict = {
    words_ru: words_ru || [],
    words_en: words_en || [],
  }

  for (let p of formData) {
    options[p[0]] = p[1];
    if(p[1] !== '') {
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
    showHint('Your language not supported, sorry!');
    return;
  }

  hint = dict[`words_${lang}`].reduce((total, currentWord) => {
    if(currentWord.length === wordLength) {
      const res = Object.values(options).every((value, i) => currentWord[i] === value.toLowerCase() || value === '');
      return res ? [...total, currentWord] : [...total];
    }
    return [...total];
  }, []);

  result.setAttribute('lang', lang);

  showHint(hint.length > 0 ? hint.join(' ') : 'No result');
});
