const form = document.getElementById('form');
const find = document.getElementById('find');
const result = document.querySelector('.result');
const reset = document.getElementById('resetBtn');

function validate(input) {
  input.value = input.value.replace(/\d/g, '').substr(0, 1).toUpperCase();
}

function resetForm() {
  document.getElementById('form').reset();
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

  for (var p of formData) {
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

  hint = words?.reduce((total, currentValue) => {
    if(currentValue.length === wordLength) {
      const res = Object.entries(options).every(([key, value], i) => currentValue[i] === value.toLowerCase() || value === '');
      return res ? [...total, currentValue] : [...total];
    }
    return [...total];
  }, []);

  showHint(hint.length > 0 ? hint.join(' ') : 'No result');
});
