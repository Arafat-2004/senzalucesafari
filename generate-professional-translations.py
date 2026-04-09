"""
Professional Translation Generator for Senza Luce Safaris
Generates proper translations for German (de), French (fr), Spanish (es), and Italian (it)
"""
import json
import copy

# Read English master file
with open('messages/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Professional translation dictionaries for common/navigation sections
translations = {
    'de': {
        'common': {
            'appName': 'Senza Luce Safaris',
            'tagline': 'Erkunde Tansania wie nie zuvor',
            'language': 'Sprache',
            'loading': 'Laden...',
            'error': 'Etwas ist schiefgelaufen',
            'backToHome': 'Zurück zur Startseite',
            'readMore': 'Mehr lesen',
            'viewAll': 'Alle anzeigen',
            'contactUs': 'Kontaktieren Sie uns',
            'bookNow': 'Jetzt buchen',
            'inquireNow': 'Jetzt anfragen',
            'learnMore': 'Mehr erfahren',
            'skipToContent': 'Zum Hauptinhalt springen'
        },
        'navigation': {
            'home': 'Startseite',
            'about': 'Über uns',
            'safarisTours': 'Safari & Touren',
            'destinations': 'Reiseziele',
            'blog': 'Blog & Neuigkeiten',
            'contact': 'Kontakt',
            'vehicles': 'Unsere Fahrzeuge',
            'faq': 'FAQ'
        }
    },
    'fr': {
        'common': {
            'appName': 'Senza Luce Safaris',
            'tagline': 'Explorez la Tanzanie comme jamais auparavant',
            'language': 'Langue',
            'loading': 'Chargement...',
            'error': 'Une erreur est survenue',
            'backToHome': 'Retour à l\'accueil',
            'readMore': 'Lire la suite',
            'viewAll': 'Voir tout',
            'contactUs': 'Contactez-nous',
            'bookNow': 'Réserver maintenant',
            'inquireNow': 'Demander maintenant',
            'learnMore': 'En savoir plus',
            'skipToContent': 'Aller au contenu principal'
        },
        'navigation': {
            'home': 'Accueil',
            'about': 'À propos',
            'safarisTours': 'Safaris & Circuits',
            'destinations': 'Destinations',
            'blog': 'Blog & Actualités',
            'contact': 'Contact',
            'vehicles': 'Nos Véhicules',
            'faq': 'FAQ'
        }
    },
    'es': {
        'common': {
            'appName': 'Senza Luce Safaris',
            'tagline': 'Explora Tanzania como nunca antes',
            'language': 'Idioma',
            'loading': 'Cargando...',
            'error': 'Algo salió mal',
            'backToHome': 'Volver al inicio',
            'readMore': 'Leer más',
            'viewAll': 'Ver todo',
            'contactUs': 'Contáctenos',
            'bookNow': 'Reservar ahora',
            'inquireNow': 'Consultar ahora',
            'learnMore': 'Saber más',
            'skipToContent': 'Ir al contenido principal'
        },
        'navigation': {
            'home': 'Inicio',
            'about': 'Sobre nosotros',
            'safarisTours': 'Safaris & Tours',
            'destinations': 'Destinos',
            'blog': 'Blog & Noticias',
            'contact': 'Contacto',
            'vehicles': 'Nuestros Vehículos',
            'faq': 'FAQ'
        }
    },
    'it': {
        'common': {
            'appName': 'Senza Luce Safaris',
            'tagline': 'Esplora la Tanzania come mai prima d\'ora',
            'language': 'Lingua',
            'loading': 'Caricamento...',
            'error': 'Qualcosa è andato storto',
            'backToHome': 'Torna alla home',
            'readMore': 'Leggi di più',
            'viewAll': 'Vedi tutto',
            'contactUs': 'Contattaci',
            'bookNow': 'Prenota ora',
            'inquireNow': 'Richiedi ora',
            'learnMore': 'Scopri di più',
            'skipToContent': 'Vai al contenuto principale'
        },
        'navigation': {
            'home': 'Home',
            'about': 'Chi siamo',
            'safarisTours': 'Safari & Tour',
            'destinations': 'Destinazioni',
            'blog': 'Blog & Notizie',
            'contact': 'Contatti',
            'vehicles': 'I Nostri Veicoli',
            'faq': 'FAQ'
        }
    }
}

# Tour Card translations
tour_card_translations = {
    'de': {
        'from': 'Ab',
        'perPerson': '/Person',
        'pp': 'p.P.',
        'viewDetails': 'Details anzeigen',
        'details': 'Details',
        'highlights': 'Höhepunkte',
        'days': '{days} Tage',
        'bookNow': 'Jetzt buchen'
    },
    'fr': {
        'from': 'À partir de',
        'perPerson': '/personne',
        'pp': 'pp',
        'viewDetails': 'Voir les détails',
        'details': 'Détails',
        'highlights': 'Points forts',
        'days': '{days} Jours',
        'bookNow': 'Réserver maintenant'
    },
    'es': {
        'from': 'Desde',
        'perPerson': '/persona',
        'pp': 'pp',
        'viewDetails': 'Ver detalles',
        'details': 'Detalles',
        'highlights': 'Aspectos destacados',
        'days': '{days} Días',
        'bookNow': 'Reservar ahora'
    },
    'it': {
        'from': 'Da',
        'perPerson': '/persona',
        'pp': 'pp',
        'viewDetails': 'Visualizza dettagli',
        'details': 'Dettagli',
        'highlights': 'Punti salienti',
        'days': '{days} Giorni',
        'bookNow': 'Prenota ora'
    }
}

# Destination Card translations
destination_card_translations = {
    'de': {'discover': 'Entdecken'},
    'fr': {'discover': 'Découvrir'},
    'es': {'discover': 'Descubrir'},
    'it': {'discover': 'Scoprire'}
}

# Breadcrumb translations
breadcrumb_translations = {
    'de': {
        'home': 'Startseite',
        'goToHomepage': 'Zur Startseite'
    },
    'fr': {
        'home': 'Accueil',
        'goToHomepage': 'Aller à l\'accueil'
    },
    'es': {
        'home': 'Inicio',
        'goToHomepage': 'Ir al inicio'
    },
    'it': {
        'home': 'Home',
        'goToHomepage': 'Vai alla home'
    }
}

# Not Found page translations
not_found_translations = {
    'de': {
        'title': 'Seite Nicht Gefunden',
        'description': 'Die gesuchte Seite existiert nicht oder wurde verschoben. Lassen Sie uns Ihnen weiterhelfen!',
        'goHome': 'Zur Startseite',
        'contactSupport': 'Support Kontaktieren',
        'popularPages': 'Beliebte Seiten'
    },
    'fr': {
        'title': 'Page Non Trouvée',
        'description': 'La page que vous recherchez n\'existe pas ou a été déplacée. Revenons sur la bonne voie !',
        'goHome': 'Aller à l\'Accueil',
        'contactSupport': 'Contacter le Support',
        'popularPages': 'Pages Populaires'
    },
    'es': {
        'title': 'Página No Encontrada',
        'description': 'La página que buscas no existe o ha sido movida. ¡Volvamos al camino correcto!',
        'goHome': 'Ir al Inicio',
        'contactSupport': 'Contactar Soporte',
        'popularPages': 'Páginas Populares'
    },
    'it': {
        'title': 'Pagina Non Trovata',
        'description': 'La pagina che cerchi non esiste o è stata spostata. Torniamo sulla strada giusta!',
        'goHome': 'Vai alla Home',
        'contactSupport': 'Contatta il Supporto',
        'popularPages': 'Pagine Popolari'
    }
}

# About page translations
about_translations = {
    'de': {
        'values': {
            'safetyComfort': {'title': 'Sicherheit und Komfort', 'description': 'Ihr Wohlbefinden hat höchste Priorität'},
            'honestGuidance': {'title': 'Ehrliche Beratung', 'description': 'Transparente Planung ohne versteckte Kosten'},
            'localExpertise': {'title': 'Lokale Expertise', 'description': 'In Tansania geboren und aufgewachsen'},
            'respectNature': {'title': 'Respekt vor der Natur', 'description': 'Nachhaltige Tourismuspraktiken'}
        },
        'whyBook': {
            'reasons': [
                'Maßgeschneiderte Reiserouten nach Ihren Wünschen',
                'Zuverlässige Fahrzeuge und erfahrene, zertifizierte Guides',
                '24/7 Support vor, während und nach Ihrer Reise',
                'Wettbewerbsfähige Preise mit ausgezeichnetem Preis-Leistungs-Verhältnis',
                'Kleine Gruppen für persönliche Erlebnisse',
                'Tiefes Wissen über Tansanias Parks und Kultur'
            ]
        }
    },
    'fr': {
        'values': {
            'safetyComfort': {'title': 'Sécurité et confort', 'description': 'Votre bien-être est notre priorité absolue'},
            'honestGuidance': {'title': 'Conseils honnêtes', 'description': 'Planification transparente sans coûts cachés'},
            'localExpertise': {'title': 'Expertise locale', 'description': 'Né et élevé en Tanzanie'},
            'respectNature': {'title': 'Respect de la nature', 'description': 'Pratiques de tourisme durable'}
        },
        'whyBook': {
            'reasons': [
                'Itinéraires sur mesure conçus selon vos préférences',
                'Véhicules fiables et guides expérimentés et certifiés',
                'Support 24/7 avant, pendant et après votre voyage',
                'Prix compétitifs avec une excellente valeur',
                'Petits groupes pour des expériences personnalisées',
                'Connaissance approfondie des parcs et de la culture tanzaniens'
            ]
        }
    },
    'es': {
        'values': {
            'safetyComfort': {'title': 'Seguridad y comodidad', 'description': 'Tu bienestar es nuestra máxima prioridad'},
            'honestGuidance': {'title': 'Orientación honesta', 'description': 'Planificación transparente sin costos ocultos'},
            'localExpertise': {'title': 'Experiencia local', 'description': 'Nacido y criado en Tanzania'},
            'respectNature': {'title': 'Respeto por la naturaleza', 'description': 'Prácticas de turismo sostenible'}
        },
        'whyBook': {
            'reasons': [
                'Itinerarios personalizados diseñados según tus preferencias',
                'Vehículos confiables y guías experimentados y certificados',
                'Soporte 24/7 antes, durante y después de tu viaje',
                'Precios competitivos con excelente valor',
                'Grupos pequeños para experiencias personalizadas',
                'Profundo conocimiento de los parques y la cultura de Tanzania'
            ]
        }
    },
    'it': {
        'values': {
            'safetyComfort': {'title': 'Sicurezza e comfort', 'description': 'Il tuo benessere è la nostra massima priorità'},
            'honestGuidance': {'title': 'Guida onesta', 'description': 'Pianificazione trasparente senza costi nascosti'},
            'localExpertise': {'title': 'Competenza locale', 'description': 'Nato e cresciuto in Tanzania'},
            'respectNature': {'title': 'Rispetto per la natura', 'description': 'Pratiche di turismo sostenibile'}
        },
        'whyBook': {
            'reasons': [
                'Itinerari su misura progettati secondo le tue preferenze',
                'Veicoli affidabili e guide esperte e certificate',
                'Supporto 24/7 prima, durante e dopo il tuo viaggio',
                'Prezzi competitivi con eccellente rapporto qualità-prezzo',
                'Piccoli gruppi per esperienze personalizzate',
                'Profonda conoscenza dei parchi e della cultura della Tanzania'
            ]
        }
    }
}

# Blog page translations
blog_translations = {
    'de': {
        'hero': {'title': 'Safari-Journal', 'subtitle': 'Geschichten aus der Wildnis, experte Reisetipps und Insider-Wissen, um Ihr Tansania-Abenteuer zu inspirieren.', 'cta': 'Neueste Geschichten lesen'},
        'featured': {'label': 'FEATURED GESCHICHTE', 'readFullStory': 'Ganze Geschichte lesen'},
        'latest': {'title': 'Neueste Artikel', 'description': 'Entdecken Sie unsere Sammlung von Safari-Führern, Wildtier-Einblicken und Reiseinspiration.'},
        'categories': {'title': 'Nach Kategorie durchsuchen', 'description': 'Entdecken Sie Artikel nach Thema, um genau das zu finden, was Ihre Safari-Reise inspiriert', 'wildlife': 'Wildtiere', 'travelTips': 'Reisetipps', 'accommodation': 'Unterkunft', 'adventure': 'Abenteuer', 'culture': 'Kultur'},
        'newsletter': {'title': 'Inspiriert bleiben', 'description': 'Abonnieren Sie die neuesten Safari-Geschichten, Reisetipps und exklusiven Angebote direkt in Ihrem Posteingang.', 'placeholder': 'Geben Sie Ihre E-Mail ein', 'subscribe': 'Jetzt abonnieren'},
        'detail': {'backToBlog': 'Zurück zum Blog', 'readTime': 'Min. Lesezeit', 'share': 'Diesen Artikel teilen', 'relatedArticles': 'Verwandte Artikel', 'readMore': 'Weitere Artikel lesen'}
    },
    'fr': {
        'hero': {'title': 'Journal Safari', 'subtitle': 'Histoires de la nature, conseils d\'experts et connaissances initiatiques pour inspirer votre aventure tanzanienne.', 'cta': 'Lire les dernières histoires'},
        'featured': {'label': 'HISTOIRE EN VEDETTE', 'readFullStory': 'Lire l\'histoire complète'},
        'latest': {'title': 'Derniers Articles', 'description': 'Explorez notre collection de guides safari, d\'informations sur la faune et d\'inspiration voyage.'},
        'categories': {'title': 'Parcourir par Catégorie', 'description': 'Explorez les articles par sujet pour trouver exactement ce qui inspire votre voyage safari', 'wildlife': 'Faune', 'travelTips': 'Conseils Voyage', 'accommodation': 'Hébergement', 'adventure': 'Aventure', 'culture': 'Culture'},
        'newsletter': {'title': 'Restez Inspiré', 'description': 'Abonnez-vous pour recevoir les dernières histoires safari, conseils de voyage et offres exclusives directement dans votre boîte de réception.', 'placeholder': 'Entrez votre email', 'subscribe': 'Abonnez-vous maintenant'},
        'detail': {'backToBlog': 'Retour au Blog', 'readTime': 'min de lecture', 'share': 'Partager cet article', 'relatedArticles': 'Articles Connexes', 'readMore': 'Lire plus d\'articles'}
    },
    'es': {
        'hero': {'title': 'Diario de Safari', 'subtitle': 'Historias de la naturaleza, consejos expertos de viaje y conocimiento interno para inspirar tu aventura en Tanzania.', 'cta': 'Leer últimas historias'},
        'featured': {'label': 'HISTORIA DESTACADA', 'readFullStory': 'Leer historia completa'},
        'latest': {'title': 'Últimos Artículos', 'description': 'Explora nuestra colección de guías de safari, información sobre vida silvestre e inspiración de viaje.'},
        'categories': {'title': 'Explorar por Categoría', 'description': 'Explora artículos por tema para encontrar exactamente lo que inspira tu viaje de safari', 'wildlife': 'Vida Silvestre', 'travelTips': 'Consejos de Viaje', 'accommodation': 'Alojamiento', 'adventure': 'Aventura', 'culture': 'Cultura'},
        'newsletter': {'title': 'Mantente Inspirado', 'description': 'Suscríbete para recibir las últimas historias de safari, consejos de viaje y ofertas exclusivas directamente en tu bandeja de entrada.', 'placeholder': 'Ingresa tu email', 'subscribe': 'Suscríbete ahora'},
        'detail': {'backToBlog': 'Volver al Blog', 'readTime': 'min de lectura', 'share': 'Compartir este artículo', 'relatedArticles': 'Artículos Relacionados', 'readMore': 'Leer más artículos'}
    },
    'it': {
        'hero': {'title': 'Diario Safari', 'subtitle': 'Storie dalla natura, consigli esperti di viaggio e conoscenza interna per ispirare la tua avventura in Tanzania.', 'cta': 'Leggi le ultime storie'},
        'featured': {'label': 'STORIA IN EVIDENZA', 'readFullStory': 'Leggi la storia completa'},
        'latest': {'title': 'Ultimi Articoli', 'description': 'Esplora la nostra collezione di guide safari, informazioni sulla fauna e ispirazione di viaggio.'},
        'categories': {'title': 'Sfoglia per Categoria', 'description': 'Esplora articoli per argomento per trovare esattamente ciò che ispira il tuo viaggio safari', 'wildlife': 'Fauna Selvatica', 'travelTips': 'Consigli di Viaggio', 'accommodation': 'Alloggio', 'adventure': 'Avventura', 'culture': 'Cultura'},
        'newsletter': {'title': 'Rimani Ispirato', 'description': 'Iscriviti per ricevere le ultime storie safari, consigli di viaggio e offerte esclusive direttamente nella tua casella email.', 'placeholder': 'Inserisci la tua email', 'subscribe': 'Iscriviti ora'},
        'detail': {'backToBlog': 'Torna al Blog', 'readTime': 'min di lettura', 'share': 'Condividi questo articolo', 'relatedArticles': 'Articoli Correlati', 'readMore': 'Leggi altri articoli'}
    }
}

# Tour Detail page translations
tour_detail_translations = {
    'de': {
        'backToTours': 'Zurück zu allen Touren',
        'overview': 'Tour-Überblick',
        'highlights': 'Tour-Höhepunkte',
        'itinerary': 'Tag-für-Tag-Reiseroute',
        'included': 'Was ist enthalten',
        'excluded': 'Was ist nicht enthalten',
        'bestFor': 'Am besten geeignet für',
        'relatedTours': 'Verwandte Touren',
        'from': 'ab',
        'perPerson': 'pro Person',
        'days': 'Tage',
        'bookNow': 'Diese Safari buchen',
        'enquireNow': 'Jetzt anfragen',
        'quickNavigation': 'Schnellnavigation'
    },
    'fr': {
        'backToTours': 'Retour à tous les circuits',
        'overview': 'Aperçu du Circuit',
        'highlights': 'Points Forts du Circuit',
        'itinerary': 'Itinéraire Jour par Jour',
        'included': 'Ce qui est Inclus',
        'excluded': 'Ce qui est Exclu',
        'bestFor': 'Idéal Pour',
        'relatedTours': 'Circuits Connexes',
        'from': 'à partir de',
        'perPerson': 'par personne',
        'days': 'jours',
        'bookNow': 'Réserver ce Safari',
        'enquireNow': 'Demander maintenant',
        'quickNavigation': 'Navigation Rapide'
    },
    'es': {
        'backToTours': 'Volver a todos los tours',
        'overview': 'Descripción General del Tour',
        'highlights': 'Aspectos Destacados del Tour',
        'itinerary': 'Itinerario Día a Día',
        'included': 'Qué Está Incluido',
        'excluded': 'Qué Está Excluido',
        'bestFor': 'Ideal Para',
        'relatedTours': 'Tours Relacionados',
        'from': 'desde',
        'perPerson': 'por persona',
        'days': 'días',
        'bookNow': 'Reservar este Safari',
        'enquireNow': 'Consultar ahora',
        'quickNavigation': 'Navegación Rápida'
    },
    'it': {
        'backToTours': 'Torna a tutti i tour',
        'overview': 'Panoramica del Tour',
        'highlights': 'Punti Salienti del Tour',
        'itinerary': 'Itinerario Giorno per Giorno',
        'included': 'Cosa è Incluso',
        'excluded': 'Cosa è Escluso',
        'bestFor': 'Ideale Per',
        'relatedTours': 'Tour Correlati',
        'from': 'da',
        'perPerson': 'per persona',
        'days': 'giorni',
        'bookNow': 'Prenota questo Safari',
        'enquireNow': 'Richiedi ora',
        'quickNavigation': 'Navigazione Rapida'
    }
}

# FAQ page translations
faq_translations = {
    'de': {
        'hero': {'title': 'Häufig Gestellte Fragen', 'subtitle': 'Finden Sie Antworten auf häufige Fragen über Tansania-Safaris, Buchung und Reisen', 'cta': 'FAQs durchsuchen'},
        'search': {'placeholder': 'Fragen suchen...', 'noResults': 'Keine Fragen gefunden, die Ihrer Suche entsprechen'},
        'categories': {'booking': 'Buchung & Reservierungen', 'experience': 'Safari-Erlebnis', 'health': 'Gesundheit & Sicherheit', 'accommodation': 'Unterkunft & Verpflegung', 'general': 'Allgemeine Fragen'},
        'cta': {'title': 'Noch Fragen?', 'description': 'Unsere Safari-Experten helfen Ihnen bei der Planung der perfekten Reise', 'button': 'Kontaktieren Sie uns'}
    },
    'fr': {
        'hero': {'title': 'Questions Fréquemment Posées', 'subtitle': 'Trouvez des réponses aux questions courantes sur les safaris en Tanzanie, la réservation et les voyages', 'cta': 'Parcourir la FAQ'},
        'search': {'placeholder': 'Rechercher des questions...', 'noResults': 'Aucune question trouvée correspondant à votre recherche'},
        'categories': {'booking': 'Réservation & Réservations', 'experience': 'Expérience Safari', 'health': 'Santé & Sécurité', 'accommodation': 'Hébergement & Repas', 'general': 'Questions Générales'},
        'cta': {'title': 'Vous avez encore des questions?', 'description': 'Nos experts safari sont là pour vous aider à planifier le voyage parfait', 'button': 'Contactez-nous'}
    },
    'es': {
        'hero': {'title': 'Preguntas Frecuentes', 'subtitle': 'Encuentra respuestas a preguntas comunes sobre safaris en Tanzania, reservas y viajes', 'cta': 'Explorar FAQ'},
        'search': {'placeholder': 'Buscar preguntas...', 'noResults': 'No se encontraron preguntas que coincidan con tu búsqueda'},
        'categories': {'booking': 'Reservas y Reservaciones', 'experience': 'Experiencia de Safari', 'health': 'Salud y Seguridad', 'accommodation': 'Alojamiento y Comidas', 'general': 'Preguntas Generales'},
        'cta': {'title': '¿Aún tienes preguntas?', 'description': 'Nuestros expertos en safari están aquí para ayudarte a planificar el viaje perfecto', 'button': 'Contáctanos'}
    },
    'it': {
        'hero': {'title': 'Domande Frequenti', 'subtitle': 'Trova risposte alle domande comuni sui safari in Tanzania, prenotazioni e viaggi', 'cta': 'Sfoglia FAQ'},
        'search': {'placeholder': 'Cerca domande...', 'noResults': 'Nessuna domanda trovata corrispondente alla tua ricerca'},
        'categories': {'booking': 'Prenotazioni e Riserve', 'experience': 'Esperienza Safari', 'health': 'Salute e Sicurezza', 'accommodation': 'Alloggio e Pasti', 'general': 'Domande Generali'},
        'cta': {'title': 'Hai ancora domande?', 'description': 'I nostri esperti safari sono qui per aiutarti a pianificare il viaggio perfetto', 'button': 'Contattaci'}
    }
}

# Vehicle booking & configurator translations
vehicle_booking_translations = {
    'de': {
        'booking': {'title': 'Fahrzeugverfügbarkeit prüfen', 'subtitle': 'Wählen Sie Ihre Präferenzen und wir bestätigen die Verfügbarkeit sofort', 'vehicleType': 'Fahrzeugtyp auswählen', 'date': 'Datum auswählen', 'duration': 'Dauer auswählen', 'guests': 'Anzahl der Gäste', 'pickup': 'Abholort', 'submit': 'Verfügbarkeit prüfen'},
        'configurator': {'title': 'Bauen Sie Ihr perfektes Safari', 'subtitle': 'Beantworten Sie ein paar Fragen und wir empfehlen das ideale Fahrzeug und die Reiseroute', 'step': 'Schritt', 'of': 'von', 'back': 'Zurück', 'next': 'Weiter', 'groupSize': 'Wie groß ist Ihre Gruppe?', 'budget': 'Was ist Ihr Budget?', 'safariType': 'Welche Art von Safari interessiert Sie?', 'duration': 'Wie lange ist Ihre Safari?', 'specialReqs': 'Besondere Anforderungen?'}
    },
    'fr': {
        'booking': {'title': 'Vérifier la Disponibilité du Véhicule', 'subtitle': 'Sélectionnez vos préférences et nous confirmerons la disponibilité instantanément', 'vehicleType': 'Sélectionner le Type de Véhicule', 'date': 'Sélectionner la Date', 'duration': 'Sélectionner la Durée', 'guests': 'Nombre de Clients', 'pickup': 'Lieu de Prise en Charge', 'submit': 'Vérifier la Disponibilité'},
        'configurator': {'title': 'Construisez Votre Safari Parfait', 'subtitle': 'Répondez à quelques questions et nous recommanderons le véhicule et l\'itinéraire idéaux', 'step': 'Étape', 'of': 'sur', 'back': 'Retour', 'next': 'Suivant', 'groupSize': 'Quelle est la taille de votre groupe?', 'budget': 'Quelle est votre gamme de budget?', 'safariType': 'Quel type de safari vous intéresse?', 'duration': 'Combien de temps dure votre safari?', 'specialReqs': 'Des exigences particulières?'}
    },
    'es': {
        'booking': {'title': 'Verificar Disponibilidad del Vehículo', 'subtitle': 'Selecciona tus preferencias y confirmaremos la disponibilidad al instante', 'vehicleType': 'Seleccionar Tipo de Vehículo', 'date': 'Seleccionar Fecha', 'duration': 'Seleccionar Duración', 'guests': 'Número de Huéspedes', 'pickup': 'Lugar de Recogida', 'submit': 'Verificar Disponibilidad'},
        'configurator': {'title': 'Construye tu Safari Perfecto', 'subtitle': 'Responde algunas preguntas y recomendaremos el vehículo e itinerario ideales', 'step': 'Paso', 'of': 'de', 'back': 'Atrás', 'next': 'Siguiente', 'groupSize': '¿Cuál es el tamaño de tu grupo?', 'budget': '¿Cuál es tu rango de presupuesto?', 'safariType': '¿Qué tipo de safari te interesa?', 'duration': '¿Cuánto dura tu safari?', 'specialReqs': '¿Requisitos especiales?'}
    },
    'it': {
        'booking': {'title': 'Verifica Disponibilità Veicolo', 'subtitle': 'Seleziona le tue preferenze e confermeremo la disponibilità istantaneamente', 'vehicleType': 'Seleziona Tipo di Veicolo', 'date': 'Seleziona Data', 'duration': 'Seleziona Durata', 'guests': 'Numero di Ospiti', 'pickup': 'Luogo di Ritiro', 'submit': 'Verifica Disponibilità'},
        'configurator': {'title': 'Costruisci il Tuo Safari Perfetto', 'subtitle': 'Rispondi ad alcune domande e consiglieremo il veicolo e l\'itinerario ideali', 'step': 'Passo', 'of': 'di', 'back': 'Indietro', 'next': 'Avanti', 'groupSize': 'Qual è la dimensione del tuo gruppo?', 'budget': 'Qual è il tuo budget?', 'safariType': 'Che tipo di safari ti interessa?', 'duration': 'Quanto dura il tuo safari?', 'specialReqs': 'Requisiti speciali?'}
    }
}

# Footer translations
footer_translations = {
    'de': {
        'copyright': 'Copyright © {year} Alle Rechte Vorbehalten Senza Luce Safaris',
        'poweredBy': 'Bereitgestellt von'
    },
    'fr': {
        'copyright': 'Copyright © {year} Tous Droits Réservés Senza Luce Safaris',
        'poweredBy': 'Propulsé par'
    },
    'es': {
        'copyright': 'Copyright © {year} Todos los Derechos Reservados Senza Luce Safaris',
        'poweredBy': 'Desarrollado por'
    },
    'it': {
        'copyright': 'Copyright © {year} Tutti i Diritti Riservati Senza Luce Safaris',
        'poweredBy': 'Sostenuto da'
    }
}

# Home section translations
home_translations = {
    'de': {
        'hero': {
            'title': 'Erlebe die Magie Tansanias',
            'subtitle': 'Entdecke atemberaubende Wildtiere, unberührte Landschaften und unvergessliche Safari-Abenteuer mit erfahrenen lokalen Guides',
            'cta': 'Jetzt anfragen'
        },
        'quickInfo': {
            'greatValue': {
                'title': 'Preiswerte Angebote',
                'description': 'Beste Preisgarantie'
            },
            'wildlife': {
                'title': 'Wildtierbegegnungen',
                'description': 'Big 5 & mehr'
            },
            'flexible': {
                'title': 'Flexible Zeiten',
                'description': 'Reise wann du möchtest'
            },
            'eco': {
                'title': 'Öko & Ethisch',
                'description': 'Nachhaltiger Tourismus'
            }
        },
        'stats': {
            'happyTravelers': 'Zufriedene Reisende',
            'safariPackages': 'Safari-Pakete',
            'destinations': 'Reiseziele',
            'yearsExperience': 'Jahre Erfahrung'
        },
        'safariCategories': {
            'title': 'Plane deine Tansania-Safari mit uns',
            'wildlifeSafari': 'Wildlife-Safari',
            'kilimanjaro': 'Kilimandscharo-Besteigung',
            'beachHolidays': 'Strandurlaub',
            'culturalExperiences': 'Kulturelle Erlebnisse'
        },
        'experience': {
            'badge': 'SENZA LUCE SAFARIS ERLEBNIS',
            'title': 'Genieße deine Tansania-Safari mit Komfort',
            'description1': 'Tansania-Safari-Abenteuer bieten aufregende Wildtiere, weite Landschaften und authentischen Komfort mit Senza Luce Safaris.',
            'description2': 'Deine Sicherheit und dein Komfort stehen immer an erster Stelle. Wir gestalten jede Safari so, dass sie Spannung, Entspannung und großen Wert bietet.',
            'description3': 'Unsere Tansania-Safari-Guides sind erfahrene Geschichtenerzähler und geschickte Fahrer, die Natur und Kultur lebendig werden lassen.',
            'description4': 'Die Buchung einer Tansania-Safari ist einfach und flexibel. Senza Luce Safaris passt jede Reise an deinen Reisestil an.',
            'cta': 'Mehr erfahren'
        },
        'featuredSafaris': {
            'badge': 'EMPFOHLENE SAFARIS',
            'title': 'Kuratierte Safari-Erlebnisse',
            'description': 'Entdecke unsere gefragtesten Safari-Erlebnisse, die für anspruchsvolle Reisende gestaltet wurden',
            'viewAll': 'Alle Pakete anzeigen'
        },
        'destinations': {
            'badge': 'ENTDECKE TANSANIA',
            'title': 'Heilige Landschaften Tansanias',
            'description': 'Ausgewählte Umgebungen für den anspruchsvollen Naturforscher',
            'viewAll': 'Alle Reiseziele anzeigen',
            'badges': {
                'serengeti': 'Große Migration',
                'ngorongoro': 'Welterbe',
                'tarangire': 'Elefantenparadies',
                'lakeManyara': 'Baumkletternde Löwen',
                'zanzibar': 'Gewürzinsel'
            }
        }
    },
    'fr': {
        'hero': {
            'title': 'Vivez la Magie de la Tanzanie',
            'subtitle': 'Découvrez une faune à couper le souffle, des paysages immaculés et des aventures safari inoubliables avec des guides locaux experts',
            'cta': 'Demander maintenant'
        },
        'quickInfo': {
            'greatValue': {
                'title': 'Offres Excellent Rapport Qualité-Prix',
                'description': 'Meilleur prix garanti'
            },
            'wildlife': {
                'title': 'Rencontres avec la Faune',
                'description': 'Big 5 & plus'
            },
            'flexible': {
                'title': 'Horaires Flexibles',
                'description': 'Voyagez quand vous voulez'
            },
            'eco': {
                'title': 'Éco & Éthique',
                'description': 'Tourisme durable'
            }
        },
        'stats': {
            'happyTravelers': 'Voyageurs Satisfaits',
            'safariPackages': 'Forfaits Safari',
            'destinations': 'Destinations',
            'yearsExperience': 'Années d\'Expérience'
        },
        'safariCategories': {
            'title': 'Planifiez Votre Safari en Tanzanie Avec Nous',
            'wildlifeSafari': 'Safari Faune',
            'kilimanjaro': 'Escalade du Kilimandjaro',
            'beachHolidays': 'Vacances à la Plage',
            'culturalExperiences': 'Expériences Culturelles'
        },
        'experience': {
            'badge': 'EXPÉRIENCE SENZA LUCE SAFARIS',
            'title': 'Profitez de Votre Safari en Tanzanie avec Confort',
            'description1': 'Les aventures safari en Tanzanie offrent une faune passionnante, de vastes paysages et un confort authentique avec Senza Luce Safaris.',
            'description2': 'Votre sécurité et votre confort passent toujours en premier. Nous concevons chaque safari pour offrir excitement, détente et excellente valeur.',
            'description3': 'Nos guides safari en Tanzanie sont des conteurs experts et des conducteurs qualifiés qui donnent vie à la nature et à la culture.',
            'description4': 'Réserver un safari en Tanzanie est simple et flexible. Senza Luce Safaris adapte chaque voyage à votre style de voyage.',
            'cta': 'En Savoir Plus'
        },
        'featuredSafaris': {
            'badge': 'SAFARIS EN VEDETTE',
            'title': 'Expériences Safari Curatées',
            'description': 'Découvrez nos expériences safari les plus recherchées, conçues pour les voyageurs exigeants',
            'viewAll': 'Voir Tous les Forfaits'
        },
        'destinations': {
            'badge': 'EXPLOREZ LA TANZANIE',
            'title': 'Terrains Sacrés de Tanzanie',
            'description': 'Environnements sélectionnés pour le naturaliste exigeant',
            'viewAll': 'Voir Toutes les Destinations',
            'badges': {
                'serengeti': 'Grande Migration',
                'ngorongoro': 'Patrimoine Mondial',
                'tarangire': 'Paradis des Éléphants',
                'lakeManyara': 'Lions Grimpeurs',
                'zanzibar': 'Île aux Épices'
            }
        }
    },
    'es': {
        'hero': {
            'title': 'Experimenta la Magia de Tanzania',
            'subtitle': 'Descubre impresionantes vida silvestre, paisajes prístinos e aventuras de safari inolvidables con guías locales expertos',
            'cta': 'Consultar ahora'
        },
        'quickInfo': {
            'greatValue': {
                'title': 'Ofertas de Gran Valor',
                'description': 'Mejor precio garantizado'
            },
            'wildlife': {
                'title': 'Encuentros con la Fauna',
                'description': 'Los Cinco Grandes y más'
            },
            'flexible': {
                'title': 'Horarios Flexibles',
                'description': 'Viaja cuando quieras'
            },
            'eco': {
                'title': 'Eco y Ético',
                'description': 'Turismo sostenible'
            }
        },
        'stats': {
            'happyTravelers': 'Viajeros Felices',
            'safariPackages': 'Paquetes de Safari',
            'destinations': 'Destinos',
            'yearsExperience': 'Años de Experiencia'
        },
        'safariCategories': {
            'title': 'Planifica Tu Safari en Tanzania Con Nosotros',
            'wildlifeSafari': 'Safari de Vida Silvestre',
            'kilimanjaro': 'Escalada del Kilimanjaro',
            'beachHolidays': 'Vacaciones en la Playa',
            'culturalExperiences': 'Experiencias Culturales'
        },
        'experience': {
            'badge': 'EXPERIENCIA SENZA LUCE SAFARIS',
            'title': 'Disfruta Tu Safari en Tanzania con Comodidad',
            'description1': 'Las aventuras de safari en Tanzania ofrecen emocionante vida silvestre, vastos paisajes y comodidad auténtica con Senza Luce Safaris.',
            'description2': 'Tu seguridad y comodidad siempre son lo primero. Diseñamos cada safari para ofrecer emoción, relajación y gran valor.',
            'description3': 'Nuestros guías de safari en Tanzania son expertos narradores y conductores hábiles que dan vida a la naturaleza y la cultura.',
            'description4': 'Reservar un safari en Tanzania es simple y flexible. Senza Luce Safaris adapta cada viaje a tu estilo de viaje.',
            'cta': 'Saber Más'
        },
        'featuredSafaris': {
            'badge': 'SAFARIS DESTACADOS',
            'title': 'Experiencias de Safari Curadas',
            'description': 'Descubre nuestras experiencias de safari más buscadas, creadas para viajeros exigentes',
            'viewAll': 'Ver Todos los Paquetes'
        },
        'destinations': {
            'badge': 'EXPLORA TANZANIA',
            'title': 'Territorios Sagrados de Tanzania',
            'description': 'Entornos seleccionados para el naturalista exigente',
            'viewAll': 'Ver Todos los Destinos',
            'badges': {
                'serengeti': 'Gran Migración',
                'ngorongoro': 'Patrimonio Mundial',
                'tarangire': 'Paraíso de Elefantes',
                'lakeManyara': 'Leones Trepadores',
                'zanzibar': 'Isla de las Especias'
            }
        }
    },
    'it': {
        'hero': {
            'title': 'Vivi la Magia della Tanzania',
            'subtitle': 'Scopri fauna mozzafiato, paesaggi incontaminati e indimenticabili avventure safari con guide locali esperte',
            'cta': 'Richiedi ora'
        },
        'quickInfo': {
            'greatValue': {
                'title': 'Offerte di Grande Valore',
                'description': 'Miglior prezzo garantito'
            },
            'wildlife': {
                'title': 'Incontri con la Fauna',
                'description': 'Big 5 & oltre'
            },
            'flexible': {
                'title': 'Orari Flessibili',
                'description': 'Viaggia quando vuoi'
            },
            'eco': {
                'title': 'Eco & Etico',
                'description': 'Turismo sostenibile'
            }
        },
        'stats': {
            'happyTravelers': 'Viaggiatori Felici',
            'safariPackages': 'Pacchetti Safari',
            'destinations': 'Destinazioni',
            'yearsExperience': 'Anni di Esperienza'
        },
        'safariCategories': {
            'title': 'Pianifica Il Tuo Safari in Tanzania Con Noi',
            'wildlifeSafari': 'Safari Faunistico',
            'kilimanjaro': 'Scalata del Kilimangiaro',
            'beachHolidays': 'Vacanze al Mare',
            'culturalExperiences': 'Esperienze Culturali'
        },
        'experience': {
            'badge': 'ESPERIENZA SENZA LUCE SAFARIS',
            'title': 'Goditi Il Tuo Safari in Tanzania con Comfort',
            'description1': 'Le avventure safari in Tanzania offrono emozionante fauna selvatica, vasti paesaggi e comfort autentico con Senza Luce Safaris.',
            'description2': 'La tua sicurezza e il tuo comfort vengono sempre prima. Progettiamo ogni safari per offrire emozione, relax e grande valore.',
            'description3': 'Le nostre guide safari in Tanzania sono narratori esperti e abili conducenti che danno vita alla natura e alla cultura.',
            'description4': 'Prenotare un safari in Tanzania è semplice e flessibile. Senza Luce Safaris adatta ogni viaggio al tuo stile di viaggio.',
            'cta': 'Scopri di Più'
        },
        'featuredSafaris': {
            'badge': 'SAFARI IN EVIDENZA',
            'title': 'Esperienze Safari Curate',
            'description': 'Scopri le nostre esperienze safari più ricercate, create per viaggiatori esigenti',
            'viewAll': 'Vedi Tutti i Pacchetti'
        },
        'destinations': {
            'badge': 'ESPLORA LA TANZANIA',
            'title': 'Territori Sacri della Tanzania',
            'description': 'Ambienti selezionati per il naturalista esigente',
            'viewAll': 'Vedi Tutte le Destinazioni',
            'badges': {
                'serengeti': 'Grande Migrazione',
                'ngorongoro': 'Patrimonio Mondiale',
                'tarangire': 'Paradiso degli Elefanti',
                'lakeManyara': 'Leoni Arrampicatori',
                'zanzibar': 'Isola delle Spezie'
            }
        }
    }
}

# Process each language
languages = ['de', 'fr', 'es', 'it']

for lang in languages:
    print(f"🔄 Processing {lang}...")

    # Deep copy English structure
    lang_data = copy.deepcopy(en_data)

    # Apply translations for common & navigation
    if lang in translations:
        lang_data['common'] = translations[lang]['common']
        lang_data['navigation'] = translations[lang]['navigation']

    # Apply tour card translations
    if lang in tour_card_translations:
        lang_data['tourCard'] = tour_card_translations[lang]

    # Apply destination card translations
    if lang in destination_card_translations:
        lang_data['destinationCard'] = destination_card_translations[lang]

    # Apply breadcrumb translations
    if lang in breadcrumb_translations:
        lang_data['breadcrumb'] = breadcrumb_translations[lang]

    # Apply not found page translations
    if lang in not_found_translations:
        lang_data['notFound'] = not_found_translations[lang]

    # Apply about page translations
    if lang in about_translations:
        if 'about' not in lang_data:
            lang_data['about'] = {}
        for key, value in about_translations[lang].items():
            if key in lang_data['about']:
                if isinstance(value, dict):
                    for subkey, subvalue in value.items():
                        if subkey in lang_data['about'][key]:
                            lang_data['about'][key][subkey] = subvalue
                else:
                    lang_data['about'][key] = value

    # Apply blog page translations
    if lang in blog_translations:
        lang_data['blog'] = blog_translations[lang]

    # Apply tour detail page translations
    if lang in tour_detail_translations:
        lang_data['tourDetail'] = tour_detail_translations[lang]

    # Apply FAQ page translations
    if lang in faq_translations:
        lang_data['faq'] = faq_translations[lang]

    # Apply vehicle booking translations
    if lang in vehicle_booking_translations:
        if 'vehicles' not in lang_data:
            lang_data['vehicles'] = {}
        for key, value in vehicle_booking_translations[lang].items():
            lang_data['vehicles'][key] = value

    # Apply footer translations
    if lang in footer_translations:
        if 'footer' not in lang_data:
            lang_data['footer'] = {}
        for key, value in footer_translations[lang].items():
            lang_data['footer'][key] = value

    # Apply home section translations
    if lang in home_translations:
        for section, content in home_translations[lang].items():
            if section in lang_data.get('home', {}):
                if isinstance(content, dict):
                    # Deep merge nested dictionaries
                    for key, value in content.items():
                        if key in lang_data['home'][section]:
                            lang_data['home'][section][key] = value
                else:
                    lang_data['home'][section] = content

    # Write to file
    output_file = f'messages/{lang}.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(lang_data, f, indent=4, ensure_ascii=False)

    print(f"✅ Generated {lang}.json with professional translations")

print("\n✨ All translation files generated successfully!")
print("📝 Files now contain professional translations for:")
print("   - German (de)")
print("   - French (fr)")
print("   - Spanish (es)")
print("   - Italian (it)")
print("\n🌍 Translated sections:")
print("   - Common UI elements")
print("   - Navigation menu")
print("   - Homepage content")
print("   - Tour cards")
print("   - Destination cards")
print("   - Breadcrumb navigation")
print("   - 404 Not Found page")
print("   - Footer copyright")
