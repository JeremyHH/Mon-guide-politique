// Calculé dans le navigateur pour rester juste sans reconstruire le site chaque jour.
const JOUR = 86400000;

export function compteARebours(el: HTMLElement) {
  el.textContent = String(Math.max(0, Math.ceil((Date.parse(el.dataset.cible!) - Date.now()) / JOUR)));
}

/** Grise les étapes passées et met en avant la prochaine. */
export function marquerEtapes(liste: HTMLElement | null) {
  if (!liste) return;
  let suivante = false;
  liste.querySelectorAll<HTMLLIElement>("li").forEach((li) => {
    if (Date.parse(li.dataset.date!) + JOUR < Date.now()) li.classList.add("past");
    else if (!suivante) {
      suivante = true;
      li.classList.add("next");
      li.lastElementChild!.insertAdjacentHTML("afterbegin", "<strong>Prochaine étape · </strong>");
    }
  });
}
