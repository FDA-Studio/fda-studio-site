/** Typographie française : espace fine insécable avant ; : ! ? » et après «, pour éviter les retours à la ligne orphelins. */
export const frTypo = (s: string) => s.replace(/ ([:;!?»])/g, "\u202F$1").replace(/« /g, "«\u202F");
