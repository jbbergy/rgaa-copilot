/**
 * RGAA 4.1 Criteria Definitions - Complete 106 Criteria
 * Official French government accessibility standard
 */

export const rgaaCriteria = [
  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 1: IMAGES (9 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "1.1", topic: 1, topicTitle: { fr: "Images", en: "Images" },
    title: { fr: "Chaque image porteuse d'information a-t-elle une alternative textuelle ?", en: "Does each informative image have a text alternative?" },
    wcagMapping: ["1.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les personnes aveugles ou malvoyantes utilisent des lecteurs d'écran qui lisent le texte alternatif à voix haute. Sans alternative textuelle, ces utilisateurs ne peuvent pas comprendre le contenu ou la fonction de l'image. Par exemple, une image de graphique sans description rend les données complètement inaccessibles.",
      en: "Blind or visually impaired users rely on screen readers that read alt text aloud. Without text alternatives, these users cannot understand the image's content or purpose. For example, a chart image without description makes the data completely inaccessible."
    },
    affectedUsers: ["blind", "low-vision", "cognitive"]
  },
  {
    id: "1.2", topic: 1, topicTitle: { fr: "Images", en: "Images" },
    title: { fr: "Chaque image de décoration est-elle correctement ignorée par les technologies d'assistance ?", en: "Is each decorative image correctly ignored by assistive technologies?" },
    wcagMapping: ["1.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les images décoratives (bordures, icônes purement visuelles) n'apportent aucune information. Si elles sont annoncées par les lecteurs d'écran, cela crée du bruit inutile et ralentit la navigation. Un alt vide (alt='') permet aux technologies d'assistance de les ignorer.",
      en: "Decorative images (borders, purely visual icons) convey no information. If announced by screen readers, they create unnecessary noise and slow down navigation. An empty alt (alt='') allows assistive technologies to skip them."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "1.3", topic: 1, topicTitle: { fr: "Images", en: "Images" },
    title: { fr: "Pour chaque image porteuse d'information ayant une alternative textuelle, cette alternative est-elle pertinente ?", en: "For each informative image with a text alternative, is this alternative relevant?" },
    wcagMapping: ["1.1.1"], level: "A", automated: false,
    whyItMatters: {
      fr: "Un texte alternatif comme 'image' ou 'photo.jpg' n'aide personne. L'alternative doit transmettre la même information que l'image véhicule visuellement. Un utilisateur aveugle doit pouvoir comprendre le contexte et prendre les mêmes décisions qu'un utilisateur voyant.",
      en: "Alt text like 'image' or 'photo.jpg' helps no one. The alternative must convey the same information the image communicates visually. A blind user should be able to understand the context and make the same decisions as a sighted user."
    },
    affectedUsers: ["blind", "low-vision", "cognitive"]
  },
  {
    id: "1.4", topic: 1, topicTitle: { fr: "Images", en: "Images" },
    title: { fr: "Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d'identifier la nature et la fonction de l'image ?", en: "For each image used as CAPTCHA or test image, does the text alternative identify the nature and function?" },
    wcagMapping: ["1.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les CAPTCHA visuels sont souvent impossibles à résoudre pour les personnes aveugles. L'alternative textuelle doit au minimum expliquer qu'il s'agit d'un test de sécurité et indiquer si une alternative audio ou autre existe.",
      en: "Visual CAPTCHAs are often impossible for blind users to solve. The text alternative should at least explain it's a security test and indicate if an audio or other alternative exists."
    },
    affectedUsers: ["blind", "low-vision", "cognitive"]
  },
  {
    id: "1.5", topic: 1, topicTitle: { fr: "Images", en: "Images" },
    title: { fr: "Pour chaque image utilisée comme CAPTCHA, une solution d'accès alternatif au contenu ou à la fonction du CAPTCHA est-elle présente ?", en: "For each CAPTCHA image, is an alternative access solution present?" },
    wcagMapping: ["1.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Sans alternative (audio, logique, etc.), un CAPTCHA visuel bloque complètement l'accès aux personnes aveugles. C'est une barrière absolue qui empêche l'inscription, l'achat ou toute action protégée par ce CAPTCHA.",
      en: "Without an alternative (audio, logic-based, etc.), a visual CAPTCHA completely blocks access for blind users. It's an absolute barrier preventing registration, purchases, or any action protected by that CAPTCHA."
    },
    affectedUsers: ["blind", "low-vision", "cognitive", "motor"]
  },
  {
    id: "1.6", topic: 1, topicTitle: { fr: "Images", en: "Images" },
    title: { fr: "Chaque image porteuse d'information a-t-elle, si nécessaire, une description détaillée ?", en: "Does each informative image have a detailed description if necessary?" },
    wcagMapping: ["1.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les images complexes (graphiques, schémas, infographies) contiennent souvent trop d'informations pour un simple texte alternatif. Une description détaillée permet aux utilisateurs de technologies d'assistance d'accéder à toutes les données.",
      en: "Complex images (charts, diagrams, infographics) often contain too much information for a simple alt text. A detailed description allows assistive technology users to access all the data."
    },
    affectedUsers: ["blind", "low-vision", "cognitive"]
  },
  {
    id: "1.7", topic: 1, topicTitle: { fr: "Images", en: "Images" },
    title: { fr: "Pour chaque image porteuse d'information ayant une description détaillée, cette description est-elle pertinente ?", en: "For each informative image with a detailed description, is this description relevant?" },
    wcagMapping: ["1.1.1"], level: "A", automated: false,
    whyItMatters: {
      fr: "Une description détaillée incomplète ou inexacte peut induire en erreur. Pour un graphique financier, une description qui omet des tendances importantes ou des valeurs clés peut conduire à de mauvaises décisions.",
      en: "An incomplete or inaccurate detailed description can be misleading. For a financial chart, a description that omits important trends or key values could lead to poor decisions."
    },
    affectedUsers: ["blind", "low-vision", "cognitive"]
  },
  {
    id: "1.8", topic: 1, topicTitle: { fr: "Images", en: "Images" },
    title: { fr: "Chaque image texte porteuse d'information, en l'absence d'un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée ?", en: "Each text image should be replaced by styled text when possible. Is this rule respected?" },
    wcagMapping: ["1.4.5"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Le texte dans les images ne peut pas être agrandi, ne s'adapte pas aux préférences de contraste, et ne peut pas être lu par les lecteurs d'écran. Les personnes malvoyantes qui agrandissent le texte verront une image pixelisée au lieu d'un texte net.",
      en: "Text in images cannot be enlarged, doesn't adapt to contrast preferences, and cannot be read by screen readers. Low-vision users who enlarge text will see a pixelated image instead of sharp text."
    },
    affectedUsers: ["blind", "low-vision", "cognitive"]
  },
  {
    id: "1.9", topic: 1, topicTitle: { fr: "Images", en: "Images" },
    title: { fr: "Chaque légende d'image est-elle, si nécessaire, correctement reliée à l'image correspondante ?", en: "Is each image caption correctly linked to its corresponding image?" },
    wcagMapping: ["1.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Sans association programmatique entre l'image et sa légende, les utilisateurs de lecteurs d'écran peuvent ne pas comprendre que la légende se rapporte à l'image. L'utilisation de <figure> et <figcaption> crée ce lien sémantique.",
      en: "Without programmatic association between image and caption, screen reader users may not understand that the caption relates to the image. Using <figure> and <figcaption> creates this semantic link."
    },
    affectedUsers: ["blind", "cognitive"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 2: FRAMES (2 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "2.1", topic: 2, topicTitle: { fr: "Cadres", en: "Frames" },
    title: { fr: "Chaque cadre a-t-il un titre de cadre ?", en: "Does each frame have a frame title?" },
    wcagMapping: ["4.1.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les iframes sans titre sont annoncées comme 'cadre' sans plus de contexte. Les utilisateurs de lecteurs d'écran ne peuvent pas savoir s'ils doivent entrer dans ce cadre ou le sauter. Un titre comme 'Vidéo de présentation' ou 'Formulaire de contact' permet une navigation efficace.",
      en: "Iframes without titles are announced as 'frame' with no context. Screen reader users cannot know whether to enter the frame or skip it. A title like 'Presentation video' or 'Contact form' enables efficient navigation."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "2.2", topic: 2, topicTitle: { fr: "Cadres", en: "Frames" },
    title: { fr: "Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent ?", en: "For each frame with a title, is this title relevant?" },
    wcagMapping: ["4.1.2"], level: "A", automated: false,
    whyItMatters: {
      fr: "Un titre générique comme 'iframe' ou 'cadre 1' n'aide pas à comprendre le contenu. L'utilisateur doit pouvoir décider rapidement s'il veut explorer ce cadre basé sur un titre descriptif de son contenu réel.",
      en: "A generic title like 'iframe' or 'frame 1' doesn't help understand the content. Users need to quickly decide whether to explore the frame based on a descriptive title of its actual content."
    },
    affectedUsers: ["blind", "cognitive"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 3: COLORS (3 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "3.1", topic: 3, topicTitle: { fr: "Couleurs", en: "Colors" },
    title: { fr: "Dans chaque page web, l'information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?", en: "Information must not be given by color alone. Is this rule respected?" },
    wcagMapping: ["1.4.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Environ 8% des hommes sont daltoniens. Si un graphique utilise uniquement le rouge/vert pour distinguer les données, ou si un message d'erreur est signalé uniquement par la couleur rouge, ces utilisateurs ne percevront pas l'information.",
      en: "About 8% of men are colorblind. If a chart uses only red/green to distinguish data, or if an error message is indicated only by red color, these users won't perceive the information."
    },
    affectedUsers: ["colorblind", "low-vision"]
  },
  {
    id: "3.2", topic: 3, topicTitle: { fr: "Couleurs", en: "Colors" },
    title: { fr: "Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé ?", en: "Is the contrast between text and background color sufficiently high?" },
    wcagMapping: ["1.4.3"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Un contraste insuffisant rend le texte difficile ou impossible à lire pour les personnes malvoyantes, âgées, ou dans des conditions d'éclairage difficiles (soleil sur l'écran). Le ratio minimum de 4.5:1 assure une lisibilité pour la majorité des utilisateurs.",
      en: "Insufficient contrast makes text difficult or impossible to read for low-vision users, elderly people, or in poor lighting conditions (sun on screen). The minimum 4.5:1 ratio ensures readability for most users."
    },
    affectedUsers: ["low-vision", "colorblind", "elderly"]
  },
  {
    id: "3.3", topic: 3, topicTitle: { fr: "Couleurs", en: "Colors" },
    title: { fr: "Dans chaque page web, les couleurs utilisées dans les composants d'interface ou les éléments graphiques porteurs d'informations sont-elles suffisamment contrastées ?", en: "Are colors in UI components or informative graphics sufficiently contrasted?" },
    wcagMapping: ["1.4.11"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Les boutons, champs de formulaire, icônes et graphiques doivent être visibles. Un bouton gris clair sur fond blanc ou une icône peu contrastée peut être invisible pour les personnes malvoyantes. Le ratio 3:1 minimum s'applique.",
      en: "Buttons, form fields, icons and graphics must be visible. A light gray button on white background or a low-contrast icon may be invisible to low-vision users. The minimum 3:1 ratio applies."
    },
    affectedUsers: ["low-vision", "colorblind", "elderly"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 4: MULTIMEDIA (13 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "4.1", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "Chaque média temporel pré-enregistré a-t-il, si nécessaire, une transcription textuelle ou une audiodescription ?", en: "Does each pre-recorded time-based media have a text transcript or audio description?" },
    wcagMapping: ["1.2.1", "1.2.3"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les personnes sourdes ne peuvent pas entendre l'audio d'une vidéo. Les personnes aveugles ne peuvent pas voir les éléments visuels. Une transcription et/ou audiodescription permet à tous d'accéder au contenu complet.",
      en: "Deaf users cannot hear video audio. Blind users cannot see visual elements. A transcript and/or audio description allows everyone to access the complete content."
    },
    affectedUsers: ["deaf", "blind", "deafblind"]
  },
  {
    id: "4.2", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "Pour chaque média temporel pré-enregistré ayant une transcription textuelle ou une audiodescription synchronisée, celles-ci sont-elles pertinentes ?", en: "For each pre-recorded media with transcript or audio description, are they relevant?" },
    wcagMapping: ["1.2.1", "1.2.3"], level: "A", automated: false,
    whyItMatters: {
      fr: "Une transcription incomplète ou une audiodescription qui omet des informations visuelles clés laisse l'utilisateur avec une compréhension partielle du contenu. La qualité est aussi importante que la présence.",
      en: "An incomplete transcript or audio description that omits key visual information leaves users with partial understanding of the content. Quality is as important as presence."
    },
    affectedUsers: ["deaf", "blind", "deafblind"]
  },
  {
    id: "4.3", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés ?", en: "Does each pre-recorded synchronized media have synchronized subtitles?" },
    wcagMapping: ["1.2.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les sous-titres permettent aux personnes sourdes ou malentendantes de suivre les dialogues et sons importants d'une vidéo. Ils sont aussi utiles dans les environnements bruyants ou silencieux (transports, bureaux).",
      en: "Subtitles enable deaf or hard-of-hearing users to follow dialogue and important sounds in a video. They're also useful in noisy or quiet environments (transport, offices)."
    },
    affectedUsers: ["deaf", "hard-of-hearing"]
  },
  {
    id: "4.4", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ?", en: "For each pre-recorded synchronized media with subtitles, are they relevant?" },
    wcagMapping: ["1.2.2"], level: "A", automated: false,
    whyItMatters: {
      fr: "Des sous-titres inexacts, mal synchronisés ou incomplets (qui omettent les effets sonores importants) ne remplissent pas leur fonction. Les utilisateurs sourds doivent avoir accès à la même information audio que les autres.",
      en: "Inaccurate, poorly synchronized, or incomplete subtitles (omitting important sound effects) don't serve their purpose. Deaf users must have access to the same audio information as others."
    },
    affectedUsers: ["deaf", "hard-of-hearing"]
  },
  {
    id: "4.5", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audiodescription synchronisée ?", en: "Does each pre-recorded time-based media have a synchronized audio description?" },
    wcagMapping: ["1.2.5"], level: "AA", automated: true,
    whyItMatters: {
      fr: "L'audiodescription décrit les éléments visuels (actions, expressions, décors) pendant les pauses du dialogue. Sans elle, les personnes aveugles manquent le contexte visuel essentiel à la compréhension.",
      en: "Audio description narrates visual elements (actions, expressions, settings) during dialogue pauses. Without it, blind users miss the visual context essential to understanding."
    },
    affectedUsers: ["blind", "low-vision"]
  },
  {
    id: "4.6", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "Pour chaque média temporel pré-enregistré ayant une audiodescription synchronisée, celle-ci est-elle pertinente ?", en: "For each pre-recorded media with audio description, is it relevant?" },
    wcagMapping: ["1.2.5"], level: "AA", automated: false,
    whyItMatters: {
      fr: "Une audiodescription qui omet des détails visuels importants ou qui est mal synchronisée ne permet pas de suivre correctement le contenu. La description doit couvrir tous les éléments visuels nécessaires à la compréhension.",
      en: "Audio description that omits important visual details or is poorly synchronized doesn't allow proper content understanding. It must cover all visual elements necessary for comprehension."
    },
    affectedUsers: ["blind", "low-vision"]
  },
  {
    id: "4.7", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "Chaque média temporel est-il clairement identifiable ?", en: "Is each time-based media clearly identifiable?" },
    wcagMapping: ["1.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Un lecteur vidéo ou audio doit être identifiable comme tel. Les utilisateurs de lecteurs d'écran doivent savoir qu'ils interagissent avec un média et comprendre son contenu avant de le lancer.",
      en: "A video or audio player must be identifiable as such. Screen reader users need to know they're interacting with media and understand its content before playing it."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "4.8", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "Chaque média non temporel a-t-il, si nécessaire, une alternative ?", en: "Does each non-time-based media have an alternative if necessary?" },
    wcagMapping: ["1.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les médias non temporels (cartes interactives, animations Canvas, visualisations) nécessitent des alternatives pour les utilisateurs qui ne peuvent pas les percevoir visuellement ou interagir avec eux.",
      en: "Non-time-based media (interactive maps, Canvas animations, visualizations) need alternatives for users who cannot perceive them visually or interact with them."
    },
    affectedUsers: ["blind", "motor", "cognitive"]
  },
  {
    id: "4.9", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "Pour chaque média non temporel ayant une alternative, cette alternative est-elle pertinente ?", en: "For each non-time-based media with an alternative, is it relevant?" },
    wcagMapping: ["1.1.1"], level: "A", automated: false,
    whyItMatters: {
      fr: "Une alternative comme 'carte' pour une carte interactive ne suffit pas. L'alternative doit fournir les mêmes informations ou fonctionnalités que le média original.",
      en: "An alternative like 'map' for an interactive map isn't enough. The alternative must provide the same information or functionality as the original media."
    },
    affectedUsers: ["blind", "motor", "cognitive"]
  },
  {
    id: "4.10", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "Chaque son déclenché automatiquement est-il contrôlable par l'utilisateur ?", en: "Is each automatically triggered sound controllable by the user?" },
    wcagMapping: ["1.4.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les utilisateurs de lecteurs d'écran entendent déjà une synthèse vocale. Un son automatique superposé rend leur lecteur d'écran inaudible. Ils doivent pouvoir arrêter, mettre en pause ou baisser le volume de tout son.",
      en: "Screen reader users already hear speech synthesis. Auto-playing sound overlapping makes their screen reader inaudible. They must be able to stop, pause, or lower the volume of any sound."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "4.11", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "La consultation de chaque média temporel est-elle, si nécessaire, contrôlable par le clavier et tout dispositif de pointage ?", en: "Is each time-based media controllable by keyboard and pointing device?" },
    wcagMapping: ["2.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les personnes ayant un handicap moteur utilisent souvent le clavier seul ou des dispositifs spéciaux. Si les contrôles vidéo (lecture, pause, volume) ne sont pas accessibles au clavier, ces utilisateurs ne peuvent pas utiliser le média.",
      en: "People with motor disabilities often use keyboard alone or special devices. If video controls (play, pause, volume) aren't keyboard accessible, these users cannot use the media."
    },
    affectedUsers: ["motor", "blind"]
  },
  {
    id: "4.12", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "La consultation de chaque média non temporel est-elle contrôlable par le clavier et tout dispositif de pointage ?", en: "Is each non-time-based media controllable by keyboard and pointing device?" },
    wcagMapping: ["2.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les cartes interactives, visualisations et autres médias non temporels doivent être navigables au clavier. Un utilisateur à mobilité réduite doit pouvoir zoomer, déplacer et interagir sans souris.",
      en: "Interactive maps, visualizations and other non-time-based media must be keyboard navigable. A user with limited mobility must be able to zoom, pan and interact without a mouse."
    },
    affectedUsers: ["motor", "blind"]
  },
  {
    id: "4.13", topic: 4, topicTitle: { fr: "Multimédia", en: "Multimedia" },
    title: { fr: "Chaque média temporel et non temporel est-il compatible avec les technologies d'assistance ?", en: "Is each time-based and non-time-based media compatible with assistive technologies?" },
    wcagMapping: ["4.1.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Un lecteur vidéo personnalisé doit exposer son état (lecture/pause) et ses contrôles aux technologies d'assistance. Sans cela, les utilisateurs de lecteurs d'écran ne savent pas comment interagir avec le média.",
      en: "A custom video player must expose its state (playing/paused) and controls to assistive technologies. Without this, screen reader users don't know how to interact with the media."
    },
    affectedUsers: ["blind", "motor"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 5: TABLES (8 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "5.1", topic: 5, topicTitle: { fr: "Tableaux", en: "Tables" },
    title: { fr: "Chaque tableau de données complexe a-t-il un résumé ?", en: "Does each complex data table have a summary?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les tableaux complexes (en-têtes multiples, cellules fusionnées) sont difficiles à comprendre pour les utilisateurs de lecteurs d'écran. Un résumé expliquant la structure aide à s'orienter avant d'explorer les données.",
      en: "Complex tables (multiple headers, merged cells) are difficult for screen reader users to understand. A summary explaining the structure helps orient before exploring data."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "5.2", topic: 5, topicTitle: { fr: "Tableaux", en: "Tables" },
    title: { fr: "Pour chaque tableau de données complexe ayant un résumé, celui-ci est-il pertinent ?", en: "For each complex table with a summary, is it relevant?" },
    wcagMapping: ["1.3.1"], level: "A", automated: false,
    whyItMatters: {
      fr: "Un résumé vague comme 'tableau de données' n'aide pas. Il doit décrire comment le tableau est organisé, quelles informations sont dans les lignes/colonnes, et comment naviguer efficacement.",
      en: "A vague summary like 'data table' doesn't help. It should describe how the table is organized, what information is in rows/columns, and how to navigate effectively."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "5.3", topic: 5, topicTitle: { fr: "Tableaux", en: "Tables" },
    title: { fr: "Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?", en: "For each layout table, does linearized content remain understandable?" },
    wcagMapping: ["1.3.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les lecteurs d'écran lisent le contenu cellule par cellule. Si un tableau est utilisé pour la mise en page, l'ordre de lecture doit rester logique quand le contenu est 'aplati' en une seule colonne.",
      en: "Screen readers read content cell by cell. If a table is used for layout, the reading order must remain logical when content is 'flattened' into a single column."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "5.4", topic: 5, topicTitle: { fr: "Tableaux", en: "Tables" },
    title: { fr: "Chaque tableau de données a-t-il un titre ?", en: "Does each data table have a title?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Un titre de tableau (<caption>) permet aux utilisateurs de lecteurs d'écran de comprendre rapidement le sujet du tableau avant de l'explorer. Sans titre, ils doivent parcourir le contenu pour deviner le sujet.",
      en: "A table caption allows screen reader users to quickly understand the table's subject before exploring it. Without a caption, they must browse content to guess the subject."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "5.5", topic: 5, topicTitle: { fr: "Tableaux", en: "Tables" },
    title: { fr: "Pour chaque tableau de données ayant un titre, celui-ci est-il pertinent ?", en: "For each data table with a title, is it relevant?" },
    wcagMapping: ["1.3.1"], level: "A", automated: false,
    whyItMatters: {
      fr: "Un titre comme 'Tableau 1' ne renseigne pas sur le contenu. Le titre doit décrire clairement ce que représente le tableau, par exemple 'Ventes trimestrielles par région 2024'.",
      en: "A title like 'Table 1' provides no information about content. The title should clearly describe what the table represents, such as 'Quarterly sales by region 2024'."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "5.6", topic: 5, topicTitle: { fr: "Tableaux", en: "Tables" },
    title: { fr: "Pour chaque tableau de données, chaque en-tête de colonne et chaque en-tête de ligne sont-ils correctement déclarés ?", en: "For each data table, are column and row headers correctly declared?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les balises <th> avec l'attribut scope permettent aux lecteurs d'écran d'annoncer les en-têtes quand l'utilisateur navigue dans les cellules. Sans cela, '125' n'a pas de contexte - est-ce un prix, une quantité, un code?",
      en: "<th> tags with scope attribute allow screen readers to announce headers when navigating cells. Without this, '125' has no context - is it a price, quantity, code?"
    },
    affectedUsers: ["blind"]
  },
  {
    id: "5.7", topic: 5, topicTitle: { fr: "Tableaux", en: "Tables" },
    title: { fr: "Pour chaque tableau de données, la technique appropriée permettant d'associer chaque cellule avec ses en-têtes est-elle utilisée ?", en: "Is the appropriate technique used to associate each cell with its headers?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Dans les tableaux complexes, les attributs id/headers ou scope doivent lier explicitement chaque cellule à ses en-têtes. Sans cette association, les données perdent leur sens pour les utilisateurs de lecteurs d'écran.",
      en: "In complex tables, id/headers or scope attributes must explicitly link each cell to its headers. Without this association, data loses meaning for screen reader users."
    },
    affectedUsers: ["blind"]
  },
  {
    id: "5.8", topic: 5, topicTitle: { fr: "Tableaux", en: "Tables" },
    title: { fr: "Chaque tableau de mise en forme ne doit pas utiliser d'éléments propres aux tableaux de données. Cette règle est-elle respectée ?", en: "Layout tables must not use data table elements. Is this rule respected?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Utiliser <th>, <caption> ou scope dans un tableau de mise en page induit les lecteurs d'écran en erreur. Ils annoncent des en-têtes et structures qui n'ont pas de sens sémantique réel.",
      en: "Using <th>, <caption>, or scope in a layout table misleads screen readers. They announce headers and structures that have no real semantic meaning."
    },
    affectedUsers: ["blind"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 6: LINKS (2 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "6.1", topic: 6, topicTitle: { fr: "Liens", en: "Links" },
    title: { fr: "Chaque lien est-il explicite ?", en: "Is each link explicit?" },
    wcagMapping: ["2.4.4"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les utilisateurs de lecteurs d'écran naviguent souvent en listant tous les liens d'une page. Des liens comme 'cliquez ici', 'en savoir plus' ou 'lire la suite' sont incompréhensibles hors contexte. Le lien doit décrire sa destination.",
      en: "Screen reader users often navigate by listing all links on a page. Links like 'click here', 'learn more', or 'read more' are meaningless out of context. Links must describe their destination."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "6.2", topic: 6, topicTitle: { fr: "Liens", en: "Links" },
    title: { fr: "Dans chaque page web, chaque lien a-t-il un intitulé ?", en: "Does each link have a label?" },
    wcagMapping: ["2.4.4"], level: "A", automated: true,
    whyItMatters: {
      fr: "Un lien sans texte visible ni accessible (comme une image-lien sans alt) est annoncé comme 'lien' sans plus d'information. L'utilisateur ne peut pas savoir où mène ce lien ni décider de cliquer dessus.",
      en: "A link with no visible or accessible text (like an image link without alt) is announced as just 'link'. Users cannot know where the link leads or decide to click it."
    },
    affectedUsers: ["blind"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 7: SCRIPTS (5 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "7.1", topic: 7, topicTitle: { fr: "Scripts", en: "Scripts" },
    title: { fr: "Chaque script est-il, si nécessaire, compatible avec les technologies d'assistance ?", en: "Is each script compatible with assistive technologies if necessary?" },
    wcagMapping: ["4.1.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les composants JavaScript personnalisés (menus, onglets, modales) doivent utiliser ARIA pour communiquer leur rôle et état. Sans cela, les lecteurs d'écran ne peuvent pas interpréter ces composants correctement.",
      en: "Custom JavaScript components (menus, tabs, modals) must use ARIA to communicate their role and state. Without this, screen readers cannot interpret these components correctly."
    },
    affectedUsers: ["blind", "motor"]
  },
  {
    id: "7.2", topic: 7, topicTitle: { fr: "Scripts", en: "Scripts" },
    title: { fr: "Pour chaque script ayant une alternative, cette alternative est-elle pertinente ?", en: "For each script with an alternative, is it relevant?" },
    wcagMapping: ["1.1.1"], level: "A", automated: false,
    whyItMatters: {
      fr: "Si un script fournit une fonctionnalité (ex: calculateur, filtre) et qu'une alternative existe, celle-ci doit fournir les mêmes résultats. Une alternative dégradée crée une expérience inégale.",
      en: "If a script provides functionality (e.g., calculator, filter) and an alternative exists, it must provide the same results. A degraded alternative creates an unequal experience."
    },
    affectedUsers: ["blind", "motor", "cognitive"]
  },
  {
    id: "7.3", topic: 7, topicTitle: { fr: "Scripts", en: "Scripts" },
    title: { fr: "Chaque script est-il contrôlable par le clavier et par tout dispositif de pointage ?", en: "Is each script controllable by keyboard and pointing device?" },
    wcagMapping: ["2.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les personnes ayant des handicaps moteurs ne peuvent souvent pas utiliser une souris. Chaque fonctionnalité JavaScript (drag-and-drop, sliders, menus) doit avoir un équivalent clavier accessible.",
      en: "People with motor disabilities often cannot use a mouse. Every JavaScript feature (drag-and-drop, sliders, menus) must have an accessible keyboard equivalent."
    },
    affectedUsers: ["motor", "blind"]
  },
  {
    id: "7.4", topic: 7, topicTitle: { fr: "Scripts", en: "Scripts" },
    title: { fr: "Pour chaque script qui initie un changement de contexte, l'utilisateur est-il averti ou en a-t-il le contrôle ?", en: "For scripts initiating context changes, is user warned or in control?" },
    wcagMapping: ["3.2.1", "3.2.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les changements de contexte inattendus (nouvelle fenêtre, soumission automatique, redirection) désorientent les utilisateurs, particulièrement ceux utilisant des lecteurs d'écran ou ayant des difficultés cognitives.",
      en: "Unexpected context changes (new window, auto-submit, redirect) disorient users, especially those using screen readers or with cognitive difficulties."
    },
    affectedUsers: ["blind", "cognitive", "motor"]
  },
  {
    id: "7.5", topic: 7, topicTitle: { fr: "Scripts", en: "Scripts" },
    title: { fr: "Dans chaque page web, les messages de statut sont-ils correctement restitués par les technologies d'assistance ?", en: "Are status messages correctly rendered by assistive technologies?" },
    wcagMapping: ["4.1.3"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Les messages comme 'Article ajouté au panier', 'Erreur de validation', ou 'Chargement en cours' doivent être annoncés automatiquement par les lecteurs d'écran via aria-live. Sinon, l'utilisateur ne sait pas que l'action a réussi ou échoué.",
      en: "Messages like 'Item added to cart', 'Validation error', or 'Loading' must be automatically announced by screen readers via aria-live. Otherwise, users don't know if the action succeeded or failed."
    },
    affectedUsers: ["blind"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 8: MANDATORY ELEMENTS (10 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "8.1", topic: 8, topicTitle: { fr: "Éléments obligatoires", en: "Mandatory Elements" },
    title: { fr: "Chaque page web est-elle définie par un type de document ?", en: "Is each web page defined by a document type?" },
    wcagMapping: ["4.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Le DOCTYPE définit comment le navigateur doit interpréter le code HTML. Sans lui, le navigateur peut entrer en mode 'quirks' et rendre le contenu de manière imprévisible, affectant les technologies d'assistance.",
      en: "DOCTYPE defines how the browser should interpret HTML code. Without it, browsers may enter 'quirks mode' and render content unpredictably, affecting assistive technologies."
    },
    affectedUsers: ["blind", "motor"]
  },
  {
    id: "8.2", topic: 8, topicTitle: { fr: "Éléments obligatoires", en: "Mandatory Elements" },
    title: { fr: "Pour chaque page web, le code source généré est-il valide selon le type de document spécifié ?", en: "Is the source code valid according to the specified document type?" },
    wcagMapping: ["4.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Un code HTML invalide (balises mal fermées, IDs dupliqués) peut causer des comportements imprévisibles dans les lecteurs d'écran. La validation assure que le contenu sera interprété correctement.",
      en: "Invalid HTML code (unclosed tags, duplicate IDs) can cause unpredictable behavior in screen readers. Validation ensures content will be interpreted correctly."
    },
    affectedUsers: ["blind"]
  },
  {
    id: "8.3", topic: 8, topicTitle: { fr: "Éléments obligatoires", en: "Mandatory Elements" },
    title: { fr: "Dans chaque page web, la langue par défaut est-elle présente ?", en: "Is the default language present in each web page?" },
    wcagMapping: ["3.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "L'attribut lang sur <html> permet aux lecteurs d'écran de choisir la synthèse vocale correcte. Sans cette indication, un texte français pourrait être lu avec un accent anglais, rendant le contenu incompréhensible.",
      en: "The lang attribute on <html> allows screen readers to choose the correct speech synthesis. Without it, French text might be read with an English accent, making content incomprehensible."
    },
    affectedUsers: ["blind"]
  },
  {
    id: "8.4", topic: 8, topicTitle: { fr: "Éléments obligatoires", en: "Mandatory Elements" },
    title: { fr: "Pour chaque page web ayant une langue par défaut, le code de langue est-il pertinent ?", en: "For each page with a default language, is the language code relevant?" },
    wcagMapping: ["3.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Un code de langue incorrect (ex: 'en' pour une page française) est pire que son absence. Le lecteur d'écran utilisera la mauvaise synthèse vocale, rendant tout le contenu difficile à comprendre.",
      en: "An incorrect language code (e.g., 'en' for a French page) is worse than none. The screen reader will use the wrong speech synthesis, making all content hard to understand."
    },
    affectedUsers: ["blind"]
  },
  {
    id: "8.5", topic: 8, topicTitle: { fr: "Éléments obligatoires", en: "Mandatory Elements" },
    title: { fr: "Chaque page web a-t-elle un titre de page ?", en: "Does each web page have a page title?" },
    wcagMapping: ["2.4.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Le titre de page (<title>) est la première information annoncée par les lecteurs d'écran. Il aide à identifier les onglets et apparaît dans l'historique et les favoris. Sans titre, la navigation est confuse.",
      en: "The page title (<title>) is the first information announced by screen readers. It helps identify tabs and appears in history and bookmarks. Without a title, navigation is confusing."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "8.6", topic: 8, topicTitle: { fr: "Éléments obligatoires", en: "Mandatory Elements" },
    title: { fr: "Pour chaque page web ayant un titre de page, ce titre est-il pertinent ?", en: "For each page with a title, is it relevant?" },
    wcagMapping: ["2.4.2"], level: "A", automated: false,
    whyItMatters: {
      fr: "Un titre comme 'Page' ou 'Untitled' n'aide pas. Le titre doit identifier clairement le contenu de la page, idéalement avec le nom du site et le sujet spécifique de la page.",
      en: "A title like 'Page' or 'Untitled' doesn't help. The title should clearly identify the page content, ideally with the site name and specific page subject."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "8.7", topic: 8, topicTitle: { fr: "Éléments obligatoires", en: "Mandatory Elements" },
    title: { fr: "Dans chaque page web, chaque changement de langue est-il indiqué dans le code source ?", en: "Is each language change indicated in the source code?" },
    wcagMapping: ["3.1.2"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Les citations ou termes dans une autre langue doivent être marqués avec l'attribut lang. Sans cela, le lecteur d'écran les prononcera avec la mauvaise synthèse vocale.",
      en: "Quotes or terms in another language must be marked with the lang attribute. Without it, the screen reader will pronounce them with the wrong speech synthesis."
    },
    affectedUsers: ["blind"]
  },
  {
    id: "8.8", topic: 8, topicTitle: { fr: "Éléments obligatoires", en: "Mandatory Elements" },
    title: { fr: "Dans chaque page web, le code de langue de chaque changement de langue est-il valide ?", en: "Is the language code valid for each language change?" },
    wcagMapping: ["3.1.2"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Un code de langue invalide ou incorrect ne sera pas reconnu par le lecteur d'écran, qui continuera à utiliser la synthèse vocale par défaut au lieu de celle de la langue ciblée.",
      en: "An invalid or incorrect language code won't be recognized by the screen reader, which will continue using the default speech synthesis instead of the target language."
    },
    affectedUsers: ["blind"]
  },
  {
    id: "8.9", topic: 8, topicTitle: { fr: "Éléments obligatoires", en: "Mandatory Elements" },
    title: { fr: "Dans chaque page web, les balises ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?", en: "Tags must not be used only for presentation. Is this rule respected?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Utiliser des <h2> ou <table> uniquement pour le style visuel induit les lecteurs d'écran en erreur. Ces utilisateurs perçoivent une structure qui n'a pas de sens sémantique réel.",
      en: "Using <h2> or <table> only for visual styling misleads screen readers. These users perceive a structure that has no real semantic meaning."
    },
    affectedUsers: ["blind"]
  },
  {
    id: "8.10", topic: 8, topicTitle: { fr: "Éléments obligatoires", en: "Mandatory Elements" },
    title: { fr: "Dans chaque page web, les changements du sens de lecture sont-ils signalés ?", en: "Are changes in reading direction indicated?" },
    wcagMapping: ["1.3.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les langues comme l'arabe ou l'hébreu se lisent de droite à gauche. Sans l'attribut dir='rtl', les lecteurs d'écran et le navigateur ne peuvent pas adapter la direction de lecture, rendant le texte confus.",
      en: "Languages like Arabic or Hebrew read right-to-left. Without dir='rtl' attribute, screen readers and browsers can't adapt reading direction, making text confusing."
    },
    affectedUsers: ["blind", "cognitive"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 9: STRUCTURE (4 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "9.1", topic: 9, topicTitle: { fr: "Structuration de l'information", en: "Information Structure" },
    title: { fr: "Dans chaque page web, l'information est-elle structurée par l'utilisation appropriée de titres ?", en: "Is information structured by appropriate use of headings?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les utilisateurs de lecteurs d'écran naviguent souvent de titre en titre (h1-h6) pour parcourir rapidement une page. Sans titres structurés correctement, ils doivent lire tout le contenu linéairement.",
      en: "Screen reader users often navigate heading to heading (h1-h6) to quickly browse a page. Without properly structured headings, they must read all content linearly."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "9.2", topic: 9, topicTitle: { fr: "Structuration de l'information", en: "Information Structure" },
    title: { fr: "Dans chaque page web, la structure du document est-elle cohérente ?", en: "Is the document structure consistent?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les balises sectionnantes (header, nav, main, footer) permettent aux lecteurs d'écran de proposer des raccourcis de navigation. Un utilisateur peut sauter directement au contenu principal ou au pied de page.",
      en: "Sectioning tags (header, nav, main, footer) allow screen readers to offer navigation shortcuts. A user can jump directly to main content or footer."
    },
    affectedUsers: ["blind", "motor"]
  },
  {
    id: "9.3", topic: 9, topicTitle: { fr: "Structuration de l'information", en: "Information Structure" },
    title: { fr: "Dans chaque page web, chaque liste est-elle correctement structurée ?", en: "Is each list correctly structured?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les lecteurs d'écran annoncent 'liste de 5 éléments' et permettent de naviguer de liste en liste. Sans les balises ul/ol/dl, cette information structurelle et ces raccourcis sont perdus.",
      en: "Screen readers announce 'list of 5 items' and allow navigating between lists. Without ul/ol/dl tags, this structural information and shortcuts are lost."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "9.4", topic: 9, topicTitle: { fr: "Structuration de l'information", en: "Information Structure" },
    title: { fr: "Dans chaque page web, chaque citation est-elle correctement indiquée ?", en: "Is each quotation correctly indicated?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les balises <blockquote> et <q> indiquent aux lecteurs d'écran qu'il s'agit d'une citation. Sans cette sémantique, l'utilisateur ne peut pas distinguer les propos de l'auteur de ceux qu'il cite.",
      en: "<blockquote> and <q> tags indicate to screen readers that it's a quotation. Without this semantics, users can't distinguish the author's words from what they're quoting."
    },
    affectedUsers: ["blind", "cognitive"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 10: PRESENTATION (14 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "10.1", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l'information ?", en: "Are stylesheets used to control information presentation?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Séparer la présentation (CSS) du contenu (HTML) permet aux utilisateurs de personnaliser l'affichage. Les personnes malvoyantes peuvent appliquer leurs propres feuilles de style pour améliorer la lisibilité.",
      en: "Separating presentation (CSS) from content (HTML) allows users to customize display. Low-vision users can apply their own stylesheets to improve readability."
    },
    affectedUsers: ["low-vision", "cognitive"]
  },
  {
    id: "10.2", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Dans chaque page web, le contenu visible reste-t-il présent lorsque les feuilles de styles sont désactivées ?", en: "Does visible content remain when stylesheets are disabled?" },
    wcagMapping: ["1.3.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Certains utilisateurs désactivent les CSS pour une meilleure lisibilité ou utilisent des lecteurs d'écran qui ignorent les styles. Le contenu généré par CSS (content:) peut alors disparaître.",
      en: "Some users disable CSS for better readability or use screen readers that ignore styles. Content generated by CSS (content:) may then disappear."
    },
    affectedUsers: ["blind", "low-vision"]
  },
  {
    id: "10.3", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Dans chaque page web, l'information reste-t-elle compréhensible lorsque les feuilles de styles sont désactivées ?", en: "Does information remain understandable when stylesheets are disabled?" },
    wcagMapping: ["1.3.2"], level: "A", automated: false,
    whyItMatters: {
      fr: "Sans CSS, l'ordre du DOM détermine l'ordre de lecture. Si le CSS réorganise visuellement le contenu (flexbox order, grid), l'ordre logique sans CSS doit rester compréhensible.",
      en: "Without CSS, DOM order determines reading order. If CSS visually rearranges content (flexbox order, grid), the logical order without CSS must remain understandable."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "10.4", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu'à 200% ?", en: "Does text remain readable when font size is increased to 200%?" },
    wcagMapping: ["1.4.4"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Les personnes malvoyantes agrandissent souvent le texte à 200% ou plus. Si la mise en page casse (texte tronqué, chevauchement), le contenu devient illisible pour ces utilisateurs.",
      en: "Low-vision users often enlarge text to 200% or more. If the layout breaks (truncated text, overlap), content becomes unreadable for these users."
    },
    affectedUsers: ["low-vision"]
  },
  {
    id: "10.5", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Dans chaque page web, les déclarations CSS de couleurs de fond d'élément et de police sont-elles correctement utilisées ?", en: "Are CSS background and font color declarations correctly used?" },
    wcagMapping: ["1.4.8"], level: "AAA", automated: true,
    whyItMatters: {
      fr: "Si seule la couleur du texte OU du fond est définie, l'utilisateur qui personnalise ses couleurs peut se retrouver avec un texte invisible (noir sur noir, blanc sur blanc).",
      en: "If only text OR background color is defined, users who customize their colors may end up with invisible text (black on black, white on white)."
    },
    affectedUsers: ["low-vision", "colorblind"]
  },
  {
    id: "10.6", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Dans chaque page web, chaque lien dont la nature n'est pas évidente est-il visible par rapport au texte environnant ?", en: "Is each non-obvious link visible compared to surrounding text?" },
    wcagMapping: ["1.4.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Si les liens n'ont pas de soulignement et ne diffèrent que par la couleur, les personnes daltoniennes peuvent ne pas les identifier. Un soulignement ou une autre indication non-colorée est nécessaire.",
      en: "If links have no underline and differ only by color, colorblind users may not identify them. An underline or other non-color indication is necessary."
    },
    affectedUsers: ["colorblind", "low-vision"]
  },
  {
    id: "10.7", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Dans chaque page web, pour chaque élément recevant le focus, la prise de focus est-elle visible ?", en: "Is focus visible for each element receiving focus?" },
    wcagMapping: ["2.4.7"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Les utilisateurs naviguant au clavier doivent voir où se trouve le focus. Sans indicateur visible (contour, changement de style), ils sont perdus sur la page et ne savent pas quel élément est actif.",
      en: "Keyboard users must see where focus is. Without a visible indicator (outline, style change), they're lost on the page and don't know which element is active."
    },
    affectedUsers: ["motor", "low-vision"]
  },
  {
    id: "10.8", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d'assistance ?", en: "Are hidden contents meant to be ignored by assistive technologies?" },
    wcagMapping: ["1.3.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Un contenu visuellement caché (display:none, visibility:hidden) mais accessible aux lecteurs d'écran crée de la confusion. À l'inverse, un contenu destiné aux lecteurs d'écran ne doit pas être complètement masqué.",
      en: "Content visually hidden (display:none, visibility:hidden) but accessible to screen readers creates confusion. Conversely, content intended for screen readers shouldn't be completely hidden."
    },
    affectedUsers: ["blind"]
  },
  {
    id: "10.9", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Dans chaque page web, l'information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?", en: "Information must not be given only by shape, size or position. Is this rule respected?" },
    wcagMapping: ["1.3.3"], level: "A", automated: true,
    whyItMatters: {
      fr: "Des instructions comme 'cliquez sur le bouton rond' ou 'l'erreur est dans le champ à droite' sont inutiles pour les personnes aveugles. L'information doit aussi être fournie textuellement.",
      en: "Instructions like 'click the round button' or 'the error is in the field on the right' are useless for blind users. Information must also be provided textually."
    },
    affectedUsers: ["blind"]
  },
  {
    id: "10.10", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Dans chaque page web, l'information ne doit pas être donnée par la forme, taille ou position uniquement. Cette règle est-elle implémentée de façon pertinente ?", en: "Is the sensory information rule implemented relevantly?" },
    wcagMapping: ["1.3.3"], level: "A", automated: false,
    whyItMatters: {
      fr: "Même si une alternative textuelle existe, elle doit être équivalente. Dire 'étape actuelle indiquée en gras' n'aide pas si l'alternative textuelle ne précise pas quelle étape est active.",
      en: "Even if a text alternative exists, it must be equivalent. Saying 'current step shown in bold' doesn't help if the text alternative doesn't specify which step is active."
    },
    affectedUsers: ["blind"]
  },
  {
    id: "10.11", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Pour chaque page web, les contenus peuvent-ils être présentés sans avoir recours à un défilement vertical pour une fenêtre ayant une hauteur de 256 px ou à un défilement horizontal pour une fenêtre ayant une largeur de 320 px ?", en: "Can content be presented without scrolling at 256px height or 320px width?" },
    wcagMapping: ["1.4.10"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Les personnes malvoyantes utilisent souvent un zoom important (400%). À ce niveau, une page de 1280px de large n'affiche que 320px. Si le contenu nécessite un défilement horizontal, c'est très difficile à utiliser.",
      en: "Low-vision users often use significant zoom (400%). At this level, a 1280px wide page shows only 320px. If content requires horizontal scrolling, it's very difficult to use."
    },
    affectedUsers: ["low-vision"]
  },
  {
    id: "10.12", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Dans chaque page web, les propriétés d'espacement du texte peuvent-elles être redéfinies par l'utilisateur sans perte de contenu ou de fonctionnalité ?", en: "Can text spacing properties be redefined without content loss?" },
    wcagMapping: ["1.4.12"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Les personnes dyslexiques ou malvoyantes ont souvent besoin d'augmenter l'espacement des lignes, lettres et mots. Si la mise en page casse avec ces ajustements, le contenu devient inaccessible.",
      en: "People with dyslexia or low vision often need to increase line, letter, and word spacing. If the layout breaks with these adjustments, content becomes inaccessible."
    },
    affectedUsers: ["low-vision", "cognitive", "dyslexia"]
  },
  {
    id: "10.13", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l'activation d'un composant d'interface sont-ils contrôlables par l'utilisateur ?", en: "Are additional contents appearing on hover/focus controllable?" },
    wcagMapping: ["1.4.13"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Les tooltips et menus au survol peuvent masquer du contenu important. Les utilisateurs doivent pouvoir les fermer (Echap), les maintenir affichés et les survoler pour lire de longs contenus.",
      en: "Tooltips and hover menus can obscure important content. Users must be able to dismiss them (Escape), keep them visible, and hover over them to read long content."
    },
    affectedUsers: ["low-vision", "motor", "cognitive"]
  },
  {
    id: "10.14", topic: 10, topicTitle: { fr: "Présentation de l'information", en: "Information Presentation" },
    title: { fr: "Dans chaque page web, les contenus additionnels apparaissant via les styles CSS uniquement peuvent-ils être rendus visibles au clavier et par tout dispositif de pointage ?", en: "Can CSS-only additional content be made visible by keyboard?" },
    wcagMapping: ["2.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les contenus qui n'apparaissent qu'au survol (:hover) sont inaccessibles aux utilisateurs clavier. Un équivalent au focus (:focus) doit exister pour que tous puissent accéder à cette information.",
      en: "Content that only appears on hover (:hover) is inaccessible to keyboard users. A focus equivalent (:focus) must exist so everyone can access this information."
    },
    affectedUsers: ["motor", "blind"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 11: FORMS (13 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "11.1", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "Chaque champ de formulaire a-t-il une étiquette ?", en: "Does each form field have a label?" },
    wcagMapping: ["1.3.1", "3.3.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Sans étiquette (<label>) associée programmatiquement, les lecteurs d'écran annoncent juste 'champ de saisie' sans indiquer ce qu'il faut entrer. L'utilisateur ne sait pas s'il doit saisir un nom, un email ou un mot de passe.",
      en: "Without a programmatically associated <label>, screen readers announce just 'edit field' without indicating what to enter. Users don't know if they should enter a name, email, or password."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "11.2", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "Chaque étiquette associée à un champ de formulaire est-elle pertinente ?", en: "Is each form field label relevant?" },
    wcagMapping: ["2.4.6"], level: "AA", automated: false,
    whyItMatters: {
      fr: "Une étiquette comme 'Champ 1' ou 'Donnée' n'aide pas. L'étiquette doit clairement décrire l'information attendue, incluant le format si nécessaire (ex: 'Date de naissance (JJ/MM/AAAA)').",
      en: "A label like 'Field 1' or 'Data' doesn't help. The label should clearly describe expected information, including format if needed (e.g., 'Birth date (DD/MM/YYYY)')."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "11.3", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ?", en: "Are repeated labels consistent?" },
    wcagMapping: ["3.2.4"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Si un champ 'Recherche' s'appelle parfois 'Chercher' ou 'Trouver', cela crée de la confusion. La cohérence aide tous les utilisateurs, particulièrement ceux ayant des difficultés cognitives.",
      en: "If a 'Search' field is sometimes called 'Find' or 'Lookup', it creates confusion. Consistency helps all users, particularly those with cognitive difficulties."
    },
    affectedUsers: ["cognitive", "blind"]
  },
  {
    id: "11.4", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés ?", en: "Is each label adjacent to its field?" },
    wcagMapping: ["3.3.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Pour les utilisateurs malvoyants qui zooment, ou ceux utilisant une loupe d'écran, une étiquette éloignée de son champ rend l'association difficile à comprendre. L'étiquette doit être visuellement proche.",
      en: "For low-vision users who zoom, or those using screen magnifiers, a label far from its field makes the association hard to understand. Labels should be visually close."
    },
    affectedUsers: ["low-vision", "cognitive"]
  },
  {
    id: "11.5", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ?", en: "Are same-nature fields grouped if necessary?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Regrouper les champs liés (adresse de livraison, informations de paiement) dans des <fieldset> aide les utilisateurs de lecteurs d'écran à comprendre la structure du formulaire et le contexte de chaque champ.",
      en: "Grouping related fields (shipping address, payment info) in <fieldset> helps screen reader users understand the form structure and context of each field."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "11.6", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "Dans chaque formulaire, chaque regroupement de champs de formulaire a-t-il une légende ?", en: "Does each field group have a legend?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "La <legend> d'un <fieldset> est annoncée par les lecteurs d'écran avant chaque champ du groupe. Sans elle, l'utilisateur ne sait pas dans quel contexte il remplit les champs (livraison vs facturation).",
      en: "The <legend> of a <fieldset> is announced by screen readers before each field in the group. Without it, users don't know in what context they're filling fields (shipping vs billing)."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "11.7", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "Dans chaque formulaire, chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?", en: "Is each fieldset legend relevant?" },
    wcagMapping: ["1.3.1"], level: "A", automated: false,
    whyItMatters: {
      fr: "Une légende comme 'Groupe 1' n'apporte rien. Elle doit décrire clairement le contexte du groupe, par exemple 'Adresse de livraison' ou 'Informations de contact d'urgence'.",
      en: "A legend like 'Group 1' provides nothing. It should clearly describe the group context, such as 'Shipping address' or 'Emergency contact information'."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "11.8", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "Dans chaque formulaire, les items de même nature d'une liste de choix sont-ils regroupés de manière pertinente ?", en: "Are same-nature items in a select grouped relevantly?" },
    wcagMapping: ["1.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les <optgroup> dans les listes déroulantes permettent de regrouper les options par catégorie. Sans ce regroupement, une longue liste devient difficile à parcourir pour tous les utilisateurs.",
      en: "<optgroup> in dropdown lists groups options by category. Without this grouping, a long list becomes difficult to browse for all users."
    },
    affectedUsers: ["blind", "cognitive", "motor"]
  },
  {
    id: "11.9", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "Dans chaque formulaire, l'intitulé de chaque bouton est-il pertinent ?", en: "Is each button label relevant?" },
    wcagMapping: ["2.4.6"], level: "A", automated: true,
    whyItMatters: {
      fr: "Un bouton 'OK' ou 'Soumettre' ne dit pas ce qui va se passer. 'Confirmer la commande', 'Envoyer le message' ou 'Supprimer le compte' informe clairement de l'action qui sera effectuée.",
      en: "A button labeled 'OK' or 'Submit' doesn't say what will happen. 'Confirm order', 'Send message', or 'Delete account' clearly informs what action will be performed."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "11.10", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente ?", en: "Is input validation used relevantly?" },
    wcagMapping: ["3.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les messages d'erreur doivent être clairs, localisés près du champ concerné, et accessibles aux lecteurs d'écran. Un simple 'Erreur' sans explication laisse l'utilisateur sans savoir comment corriger.",
      en: "Error messages must be clear, located near the relevant field, and accessible to screen readers. A simple 'Error' without explanation leaves users not knowing how to fix it."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "11.11", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ?", en: "Are input errors accompanied by correction suggestions?" },
    wcagMapping: ["3.3.3"], level: "AA", automated: true,
    whyItMatters: {
      fr: "'Format de date invalide' n'aide pas autant que 'Veuillez entrer la date au format JJ/MM/AAAA'. Les suggestions concrètes permettent de corriger rapidement sans avoir à deviner.",
      en: "'Invalid date format' doesn't help as much as 'Please enter date in DD/MM/YYYY format'. Concrete suggestions allow quick correction without guessing."
    },
    affectedUsers: ["cognitive", "blind"]
  },
  {
    id: "11.12", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou un examen, ou dont la validation a des conséquences financières ou juridiques, les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l'utilisateur ?", en: "Can user data be modified, updated or recovered for critical forms?" },
    wcagMapping: ["3.3.4"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Pour les actions critiques (achat, suppression, examen), les utilisateurs doivent pouvoir vérifier, corriger ou annuler leur action. Ceci protège particulièrement les personnes ayant des difficultés cognitives ou motrices.",
      en: "For critical actions (purchase, deletion, exam), users must be able to verify, correct, or cancel their action. This especially protects people with cognitive or motor difficulties."
    },
    affectedUsers: ["cognitive", "motor", "blind"]
  },
  {
    id: "11.13", topic: 11, topicTitle: { fr: "Formulaires", en: "Forms" },
    title: { fr: "La finalité d'un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l'utilisateur ?", en: "Can field purpose be deduced for autocomplete?" },
    wcagMapping: ["1.3.5"], level: "AA", automated: true,
    whyItMatters: {
      fr: "L'attribut autocomplete permet aux navigateurs de pré-remplir les champs (nom, email, adresse). Ceci aide particulièrement les personnes avec des difficultés motrices ou cognitives qui ont du mal à saisir des informations.",
      en: "The autocomplete attribute allows browsers to pre-fill fields (name, email, address). This especially helps people with motor or cognitive difficulties who struggle to enter information."
    },
    affectedUsers: ["motor", "cognitive"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 12: NAVIGATION (11 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "12.1", topic: 12, topicTitle: { fr: "Navigation", en: "Navigation" },
    title: { fr: "Chaque ensemble de pages dispose-t-il de deux systèmes de navigation différents, au moins ?", en: "Does each set of pages have at least two different navigation systems?" },
    wcagMapping: ["2.4.5"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Différents utilisateurs préfèrent différentes méthodes : menu, recherche, plan du site. Offrir plusieurs options permet à chacun de trouver le contenu selon ses capacités et préférences.",
      en: "Different users prefer different methods: menu, search, sitemap. Offering multiple options allows everyone to find content according to their abilities and preferences."
    },
    affectedUsers: ["blind", "cognitive", "motor"]
  },
  {
    id: "12.2", topic: 12, topicTitle: { fr: "Navigation", en: "Navigation" },
    title: { fr: "Dans chaque ensemble de pages, le menu et les barres de navigation sont-ils toujours à la même place ?", en: "Are menu and navigation bars always in the same place?" },
    wcagMapping: ["3.2.3"], level: "AA", automated: true,
    whyItMatters: {
      fr: "La cohérence de la position des éléments de navigation aide les utilisateurs à développer des habitudes. Les personnes ayant des difficultés cognitives ou utilisant un lecteur d'écran s'orientent grâce à cette prévisibilité.",
      en: "Consistent positioning of navigation elements helps users develop habits. People with cognitive difficulties or using screen readers orient themselves through this predictability."
    },
    affectedUsers: ["cognitive", "blind", "low-vision"]
  },
  {
    id: "12.3", topic: 12, topicTitle: { fr: "Navigation", en: "Navigation" },
    title: { fr: "La page « plan du site » est-elle pertinente ?", en: "Is the sitemap page relevant?" },
    wcagMapping: ["2.4.5"], level: "AA", automated: false,
    whyItMatters: {
      fr: "Un plan du site bien organisé offre une vue d'ensemble de la structure du site. Pour les utilisateurs de lecteurs d'écran, c'est souvent le moyen le plus rapide de comprendre l'organisation du contenu.",
      en: "A well-organized sitemap provides an overview of site structure. For screen reader users, it's often the quickest way to understand content organization."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "12.4", topic: 12, topicTitle: { fr: "Navigation", en: "Navigation" },
    title: { fr: "Dans chaque ensemble de pages, la page « plan du site » est-elle atteignable de manière identique ?", en: "Is the sitemap page reachable identically?" },
    wcagMapping: ["2.4.5"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Si le lien vers le plan du site change de position ou de libellé selon les pages, les utilisateurs perdent du temps à le chercher. La cohérence facilite la navigation pour tous.",
      en: "If the sitemap link changes position or label across pages, users waste time finding it. Consistency makes navigation easier for everyone."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "12.5", topic: 12, topicTitle: { fr: "Navigation", en: "Navigation" },
    title: { fr: "Dans chaque ensemble de pages, le moteur de recherche est-il atteignable de manière identique ?", en: "Is the search engine reachable identically?" },
    wcagMapping: ["2.4.5"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Le moteur de recherche est souvent le moyen le plus efficace de trouver un contenu spécifique. Son accès doit être prévisible et cohérent sur toutes les pages du site.",
      en: "Search is often the most efficient way to find specific content. Its access must be predictable and consistent across all site pages."
    },
    affectedUsers: ["blind", "cognitive", "motor"]
  },
  {
    id: "12.6", topic: 12, topicTitle: { fr: "Navigation", en: "Navigation" },
    title: { fr: "Les zones de regroupement de contenus présentes dans plusieurs pages web (zones d'en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche) peuvent-elles être atteintes ou évitées ?", en: "Can landmark regions be reached or skipped?" },
    wcagMapping: ["2.4.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les landmarks ARIA (banner, navigation, main, contentinfo) permettent aux lecteurs d'écran de proposer des raccourcis. L'utilisateur peut sauter directement au contenu principal ou à la navigation sans tout parcourir.",
      en: "ARIA landmarks (banner, navigation, main, contentinfo) allow screen readers to offer shortcuts. Users can jump directly to main content or navigation without browsing everything."
    },
    affectedUsers: ["blind", "motor"]
  },
  {
    id: "12.7", topic: 12, topicTitle: { fr: "Navigation", en: "Navigation" },
    title: { fr: "Dans chaque page web, un lien d'évitement ou d'accès rapide à la zone de contenu principal est-il présent ?", en: "Is a skip link to main content present?" },
    wcagMapping: ["2.4.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Sans lien d'évitement ('Aller au contenu principal'), les utilisateurs clavier doivent tabuler à travers toute la navigation répétitive sur chaque page. Ce lien permet d'accéder directement au contenu.",
      en: "Without a skip link ('Skip to main content'), keyboard users must tab through all repetitive navigation on every page. This link allows direct access to content."
    },
    affectedUsers: ["motor", "blind"]
  },
  {
    id: "12.8", topic: 12, topicTitle: { fr: "Navigation", en: "Navigation" },
    title: { fr: "Dans chaque page web, l'ordre de tabulation est-il cohérent ?", en: "Is tab order consistent?" },
    wcagMapping: ["2.4.3"], level: "A", automated: true,
    whyItMatters: {
      fr: "L'ordre de tabulation doit suivre l'ordre logique de lecture (généralement gauche à droite, haut en bas). Un ordre incohérent désoriente les utilisateurs clavier et ceux utilisant des lecteurs d'écran.",
      en: "Tab order should follow logical reading order (usually left to right, top to bottom). Inconsistent order disorients keyboard users and those using screen readers."
    },
    affectedUsers: ["motor", "blind"]
  },
  {
    id: "12.9", topic: 12, topicTitle: { fr: "Navigation", en: "Navigation" },
    title: { fr: "Dans chaque page web, la navigation ne doit pas contenir de piège au clavier. Cette règle est-elle respectée ?", en: "Navigation must not contain keyboard traps. Is this rule respected?" },
    wcagMapping: ["2.1.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Un piège clavier empêche l'utilisateur de sortir d'un élément (modal, widget) avec Tab ou Echap. C'est un blocage complet pour ceux qui ne peuvent pas utiliser de souris.",
      en: "A keyboard trap prevents users from exiting an element (modal, widget) with Tab or Escape. It's a complete block for those who cannot use a mouse."
    },
    affectedUsers: ["motor", "blind"]
  },
  {
    id: "12.10", topic: 12, topicTitle: { fr: "Navigation", en: "Navigation" },
    title: { fr: "Dans chaque page web, les raccourcis clavier n'utilisant qu'une seule touche (lettre minuscule ou majuscule, ponctuation, chiffre ou symbole) sont-ils contrôlables par l'utilisateur ?", en: "Are single-key shortcuts controllable by user?" },
    wcagMapping: ["2.1.4"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les raccourcis à une seule touche peuvent être déclenchés accidentellement par les utilisateurs de reconnaissance vocale ou ceux ayant des difficultés motrices. Ils doivent pouvoir les désactiver ou les modifier.",
      en: "Single-key shortcuts can be accidentally triggered by voice recognition users or those with motor difficulties. They must be able to disable or remap them."
    },
    affectedUsers: ["motor", "speech"]
  },
  {
    id: "12.11", topic: 12, topicTitle: { fr: "Navigation", en: "Navigation" },
    title: { fr: "Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l'activation d'un composant d'interface sont-ils si nécessaire atteignables au clavier ?", en: "Are additional contents reachable by keyboard?" },
    wcagMapping: ["2.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les tooltips, sous-menus et autres contenus révélés au survol doivent aussi être accessibles au clavier. Sinon, les utilisateurs clavier n'ont pas accès aux mêmes informations.",
      en: "Tooltips, submenus, and other hover-revealed content must also be keyboard accessible. Otherwise, keyboard users don't have access to the same information."
    },
    affectedUsers: ["motor", "blind"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC 13: CONSULTATION (12 criteria)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "13.1", topic: 13, topicTitle: { fr: "Consultation", en: "Consultation" },
    title: { fr: "Pour chaque page web, l'utilisateur a-t-il le contrôle de chaque limite de temps modifiant le contenu ?", en: "Does user have control of time limits?" },
    wcagMapping: ["2.2.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les limites de temps (sessions, formulaires) peuvent empêcher les personnes lentes à taper, utilisant des technologies d'assistance, ou ayant des troubles cognitifs de terminer leurs tâches. Elles doivent pouvoir désactiver ou prolonger ces délais.",
      en: "Time limits (sessions, forms) can prevent slow typists, assistive technology users, or those with cognitive disabilities from completing tasks. They must be able to disable or extend these limits."
    },
    affectedUsers: ["motor", "cognitive", "blind"]
  },
  {
    id: "13.2", topic: 13, topicTitle: { fr: "Consultation", en: "Consultation" },
    title: { fr: "Dans chaque page web, l'ouverture d'une nouvelle fenêtre ne doit pas être déclenchée sans action de l'utilisateur. Cette règle est-elle respectée ?", en: "New windows must not open without user action. Is this rule respected?" },
    wcagMapping: ["3.2.5"], level: "AAA", automated: true,
    whyItMatters: {
      fr: "L'ouverture automatique de nouvelles fenêtres ou onglets désoriente les utilisateurs de lecteurs d'écran et perturbe la navigation clavier. Le bouton retour ne fonctionne plus comme attendu.",
      en: "Automatic opening of new windows or tabs disorients screen reader users and disrupts keyboard navigation. The back button no longer works as expected."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "13.3", topic: 13, topicTitle: { fr: "Consultation", en: "Consultation" },
    title: { fr: "Dans chaque page web, chaque document bureautique en téléchargement possède-t-il, si nécessaire, une version accessible ?", en: "Does each downloadable document have an accessible version?" },
    wcagMapping: ["1.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les documents PDF, Word ou Excel non accessibles sont illisibles pour les lecteurs d'écran. Une version accessible (balisée correctement) ou une alternative HTML est nécessaire.",
      en: "Inaccessible PDF, Word, or Excel documents are unreadable by screen readers. An accessible version (properly tagged) or HTML alternative is needed."
    },
    affectedUsers: ["blind", "low-vision"]
  },
  {
    id: "13.4", topic: 13, topicTitle: { fr: "Consultation", en: "Consultation" },
    title: { fr: "Pour chaque document bureautique ayant une version accessible, cette version offre-t-elle la même information ?", en: "Does the accessible version offer the same information?" },
    wcagMapping: ["1.1.1"], level: "A", automated: false,
    whyItMatters: {
      fr: "Une version accessible incomplète ou obsolète crée une discrimination. Les utilisateurs handicapés doivent avoir accès exactement aux mêmes informations que les autres.",
      en: "An incomplete or outdated accessible version creates discrimination. Users with disabilities must have access to exactly the same information as others."
    },
    affectedUsers: ["blind", "low-vision"]
  },
  {
    id: "13.5", topic: 13, topicTitle: { fr: "Consultation", en: "Consultation" },
    title: { fr: "Dans chaque page web, chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) a-t-il une alternative ?", en: "Does each cryptic content have an alternative?" },
    wcagMapping: ["1.1.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "L'art ASCII, les émoticônes texte (>_<) et les abréviations cryptiques sont incompréhensibles pour les lecteurs d'écran ou les personnes avec des troubles cognitifs. Une alternative textuelle est nécessaire.",
      en: "ASCII art, text emoticons (>_<), and cryptic abbreviations are incomprehensible to screen readers or people with cognitive disabilities. A text alternative is needed."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "13.6", topic: 13, topicTitle: { fr: "Consultation", en: "Consultation" },
    title: { fr: "Dans chaque page web, pour chaque contenu cryptique ayant une alternative, cette alternative est-elle pertinente ?", en: "Is the cryptic content alternative relevant?" },
    wcagMapping: ["1.1.1"], level: "A", automated: false,
    whyItMatters: {
      fr: "Une alternative non pertinente (ex: décrire \":-)\" comme \"deux points tiret parenthèse\") ne transmet pas le sens. L'alternative doit exprimer la signification (\"sourire\").",
      en: "An irrelevant alternative (e.g., describing ':-)' as 'colon dash parenthesis') doesn't convey meaning. The alternative must express the meaning ('smile')."
    },
    affectedUsers: ["blind", "cognitive"]
  },
  {
    id: "13.7", topic: 13, topicTitle: { fr: "Consultation", en: "Consultation" },
    title: { fr: "Dans chaque page web, les changements brusques de luminosité ou les effets de flash sont-ils correctement utilisés ?", en: "Are sudden brightness changes or flash effects correctly used?" },
    wcagMapping: ["2.3.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les contenus qui flashent plus de 3 fois par seconde peuvent déclencher des crises d'épilepsie photosensible. Ce critère protège la santé des utilisateurs épileptiques.",
      en: "Content flashing more than 3 times per second can trigger photosensitive epileptic seizures. This criterion protects the health of epileptic users."
    },
    affectedUsers: ["epileptic"]
  },
  {
    id: "13.8", topic: 13, topicTitle: { fr: "Consultation", en: "Consultation" },
    title: { fr: "Dans chaque page web, chaque contenu en mouvement ou clignotant est-il contrôlable par l'utilisateur ?", en: "Is moving or blinking content controllable?" },
    wcagMapping: ["2.2.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les animations, carrousels et contenus clignotants distraient les personnes ayant des troubles de l'attention (TDAH) et peuvent rendre la lecture impossible. L'utilisateur doit pouvoir les arrêter.",
      en: "Animations, carousels, and blinking content distract people with attention disorders (ADHD) and can make reading impossible. Users must be able to stop them."
    },
    affectedUsers: ["cognitive", "epileptic"]
  },
  {
    id: "13.9", topic: 13, topicTitle: { fr: "Consultation", en: "Consultation" },
    title: { fr: "Dans chaque page web, le contenu proposé est-il consultable quelle que soit l'orientation de l'écran ?", en: "Is content viewable regardless of screen orientation?" },
    wcagMapping: ["1.3.4"], level: "AA", automated: true,
    whyItMatters: {
      fr: "Certains utilisateurs ont des appareils montés en position fixe (fauteuils roulants, supports). Forcer une orientation spécifique les empêche d'utiliser le contenu.",
      en: "Some users have devices mounted in fixed positions (wheelchairs, stands). Forcing a specific orientation prevents them from using the content."
    },
    affectedUsers: ["motor"]
  },
  {
    id: "13.10", topic: 13, topicTitle: { fr: "Consultation", en: "Consultation" },
    title: { fr: "Dans chaque page web, les fonctionnalités utilisables ou disponibles au moyen d'un geste complexe peuvent-elles être également disponibles au moyen d'un geste simple ?", en: "Are complex gestures also available via simple gestures?" },
    wcagMapping: ["2.5.1"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les gestes complexes (pincer, glisser plusieurs doigts) sont impossibles pour les personnes ayant des difficultés motrices. Une alternative à un seul point de contact doit exister.",
      en: "Complex gestures (pinch, multi-finger swipe) are impossible for people with motor difficulties. A single-point alternative must exist."
    },
    affectedUsers: ["motor"]
  },
  {
    id: "13.11", topic: 13, topicTitle: { fr: "Consultation", en: "Consultation" },
    title: { fr: "Dans chaque page web, les actions déclenchées au moyen d'un dispositif de pointage sur un point unique de l'écran peuvent-elles faire l'objet d'une annulation ?", en: "Can single-point pointer actions be cancelled?" },
    wcagMapping: ["2.5.2"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les personnes ayant des tremblements ou des difficultés motrices cliquent souvent accidentellement. Pouvoir annuler (en relâchant hors de l'élément) évite les erreurs.",
      en: "People with tremors or motor difficulties often click accidentally. Being able to cancel (by releasing outside the element) prevents errors."
    },
    affectedUsers: ["motor"]
  },
  {
    id: "13.12", topic: 13, topicTitle: { fr: "Consultation", en: "Consultation" },
    title: { fr: "Dans chaque page web, les fonctionnalités qui impliquent un mouvement de l'appareil ou vers l'appareil peuvent-elles être satisfaites de manière alternative ?", en: "Can motion-activated features be satisfied alternatively?" },
    wcagMapping: ["2.5.4"], level: "A", automated: true,
    whyItMatters: {
      fr: "Les utilisateurs en fauteuil roulant ou avec un appareil monté ne peuvent pas secouer leur téléphone. Les fonctionnalités basées sur le mouvement doivent avoir une alternative (bouton).",
      en: "Wheelchair users or those with mounted devices cannot shake their phone. Motion-based features must have an alternative (button)."
    },
    affectedUsers: ["motor"]
  }
]

// Helper functions
export function getCriterion(id) {
  return rgaaCriteria.find(c => c.id === id)
}

export function getAutomatedCriteria() {
  return rgaaCriteria.filter(c => c.automated)
}

export function getCriteriaByTopic(topicNumber) {
  return rgaaCriteria.filter(c => c.topic === topicNumber)
}

export function getAllCriteria() {
  return rgaaCriteria
}
