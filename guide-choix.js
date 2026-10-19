/* Guide public, sans stockage ni requête réseau. */
(function (root) {
  'use strict';
  const DATA = Object.freeze({
    structurer: { title: 'Procédure opérationnelle', description: 'Documentez les rôles, les étapes, les contrôles et les conditions de validation.' },
    verifier: { title: 'Check-list de contrôle', description: 'Énumérez des points de contrôle clairs et observables, dans un ordre utile.' },
    transmettre: { title: 'Support de passation', description: 'Regroupez les informations clés, les responsabilités et les actions en cours.' }
  });
  function recommend(goal, frequency) {
    if (!Object.prototype.hasOwnProperty.call(DATA, goal)) return null;
    if (frequency !== 'regulier' && frequency !== 'ponctuel') return null;
    return {
      title: DATA[goal].title,
      description: DATA[goal].description,
      advice: frequency === 'regulier'
        ? 'Pour un usage régulier, prévoyez un responsable du document, une version et une date de révision.'
        : 'Pour un usage ponctuel, précisez le contexte et archivez la version utilisée.'
    };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { recommend };
  if (!root.document) return;
  const form = root.document.getElementById('orientation');
  if (!form) return;
  const title = root.document.getElementById('resultat-titre');
  const description = root.document.getElementById('resultat-description');
  const advice = root.document.getElementById('resultat-conseil');
  const panel = root.document.getElementById('resultat');
  let hasRecommendation = false;
  function invalidate() {
    if (!hasRecommendation) return;
    title.textContent = 'Vos choix ont changé';
    description.textContent = 'Validez de nouveau le formulaire pour actualiser votre orientation.';
    advice.textContent = '';
    hasRecommendation = false;
  }
  form.addEventListener('change', invalidate);
  form.addEventListener('reset', function () {
    title.textContent = 'Choisissez votre objectif';
    description.textContent = 'Le type de document recommandé apparaîtra ici après validation du formulaire.';
    advice.textContent = '';
    hasRecommendation = false;
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const goal = form.querySelector('input[name="objectif"]:checked');
    const frequency = form.querySelector('input[name="frequence"]:checked');
    const result = recommend(goal && goal.value, frequency && frequency.value);
    if (!result) return;
    title.textContent = result.title;
    description.textContent = result.description;
    advice.textContent = result.advice;
    hasRecommendation = true;
    panel.focus({ preventScroll: true });
  });
})(typeof window !== 'undefined' ? window : globalThis);
