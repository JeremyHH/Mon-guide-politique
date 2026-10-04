// Calculé dans le navigateur pour rester juste sans reconstruire le site chaque jour.
const JOUR = 86400000;

export function compteARebours(el: HTMLElement) {
  el.textContent = String(Math.max(0, Math.ceil((Date.parse(el.dataset.cible!) - Date.now()) / JOUR)));
}
