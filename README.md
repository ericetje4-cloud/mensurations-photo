# 🧍 Mensurations Photo

**Adresse de l'application :** https://ericetje4-cloud.github.io/mensurations-photo/

Petite application web qui estime les mensurations d'une personne à partir d'une
photo du corps entier, prise à l'appareil photo ou importée depuis la photothèque.

- **100 % privée** : tout le calcul se fait dans le navigateur (IA MediaPipe de
  Google exécutée localement). Aucune photo n'est envoyée sur un serveur.
- **Gratuite et sans compte**.

## ⚠️ Précision — à lire avant utilisation

Une photo 2D ne peut **pas** donner des mesures exactes au millimètre
(pas de profondeur, perspective, posture…). Résultat réaliste :

| Type de mesure | Fiabilité |
|---|---|
| Longueurs et largeurs (épaules, bras, jambes, torse, entrejambe) | ± 3–6 cm environ |
| « Tours » (poitrine, taille, hanches) | estimation indicative seulement (± 5–10 cm) |

L'app demande la **taille debout** de la personne : elle sert d'étalon pour
convertir les pixels en centimètres. Plus elle est juste, mieux c'est.

Pour des mesures de couture précises, garde un mètre ruban : l'app est faite
pour gagner du temps et fournir des ordres de grandeur fiables.

## 📱 Installer sur téléphone (Android / iPhone)

1. Ouvrir **https://ericetje4-cloud.github.io/mensurations-photo/** dans Chrome (Android)
   ou Safari (iPhone).
2. Menu du navigateur → **« Installer l'application »** (Android) ou
   **Partager → « Sur l'écran d'accueil »** (iPhone).
3. L'icône apparaît comme une vraie app ; elle fonctionne hors ligne après
   le premier lancement.

## 💻 Tester sur le Mac

```bash
cd "Documents/Mensurations Photo/mensurations-photo"
python3 -m http.server 8123
```

Puis ouvrir http://localhost:8123 (la caméra du Mac fonctionne).

Mode test interne (analyse automatique d'une photo d'exemple incluse) :
http://localhost:8123/?test=1

## 📷 Conseils pour une bonne mesure

- Personne **debout, bien de face**, pieds légèrement écartés.
- **Bras légèrement écartés du corps** (pas collés, pas en l'air).
- Tête et pieds **entièrement visibles** dans le cadre.
- Photographe à 2–3 m, à hauteur du nombril, téléphone bien vertical.
- Connaître la taille exacte de la personne (mesurée sans chaussures).

## 🗂️ Fichiers

- `index.html` — toute l'application (interface + calculs).
- `test-image.jpg` — photo d'exemple pour le mode test.
- `apercu-resultat.png` — capture d'écran du résultat.

## 🔧 Comment ça marche (technique)

L'IA MediaPipe Pose Landmarker (Google) détecte 33 points du corps sur la
photo. La distance « épaules → talons » en pixels est mise en correspondance
avec la taille déclarée via des ratios anthropométriques standard (épaules ≈
0,82 × taille debout, etc.), ce qui donne l'échelle cm/pixel. Les largeurs
sont converties des points d'articulation vers les largeurs « hors tout ».
Les tours sont estimés à partir des largeurs avec des coefficients issus de
tables anthropométriques moyennes (ANSUR) — d'où leur caractère indicatif.

Améliorations possibles : photo de profil pour vraiment mesurer les tours,
saisie d'un objet de référence (carte bancaire) quand la taille est inconnue,
export PDF de la fiche.
