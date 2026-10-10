'use strict';

const menu = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }
});

const projects = {
  strategy: {
    title: 'Connected audiences.',
    description: 'A release travels across markets, but an audience never exists in the abstract. Connect the global ambition with the cultural context, local insight and campaign positioning that make it meaningful.',
    points: ['Audience and cultural insight', 'Film-release positioning and campaign architecture', 'Cross-territory thinking with local relevance']
  },
  live: {
    title: 'Beyond the screen.',
    description: 'The audience experience can begin before the first frame and carry on long after the credits. Bring the film into the world through immersive activations, live moments and gatherings with a clear creative purpose.',
    points: ['Experiential ideas that invite participation', 'Launch events, premieres and audience moments', 'Parties, atmosphere and guest experience']
  }
};
const projectDialog = document.getElementById('project-dialog');
const enquiryDialog = document.getElementById('enquiry-dialog');
function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add('modal-open');
}
[projectDialog, enquiryDialog].forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
});
document.querySelectorAll('[data-project]').forEach(card => card.addEventListener('click', () => {
  const project = projects[card.dataset.project];
  document.getElementById('project-title').textContent = project.title;
  document.getElementById('project-description').textContent = project.description;
  const points = document.getElementById('project-points');
  points.replaceChildren(...project.points.map(text => {
    const point = document.createElement('li');
    point.textContent = text;
    return point;
  }));
  openDialog(projectDialog);
}));
document.getElementById('project-contact').addEventListener('click', () => projectDialog.close());
document.getElementById('open-enquiry').addEventListener('click', () => openDialog(enquiryDialog));
document.getElementById('year').textContent = String(new Date().getFullYear());

document.getElementById('enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const text = `CPC — PROJECT BRIEF\nCartwright - Prochak Consultants\n\nName: ${values.get('name')}\nEmail: ${values.get('email')}\nCompany / studio: ${values.get('company') || 'Not provided'}\nArea: ${values.get('service')}\n\nTHE AMBITION\n${values.get('brief')}\n\nPrepared locally. This brief has not been sent to CPC.\n`;
  const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'CPC-project-brief.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.getElementById('form-result').textContent = 'Your brief is ready to save. Nothing has been sent or stored on a server.';
});
