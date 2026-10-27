import { projects } from './projects.js';

// Stable record identity, route, and sleeve palette. Narratives live in projects.js.
const collection = [
  {
    "id": "vinyl-sound",
    "title": "Vinyl & Sound",
    "lines": [
      "Vinyl",
      "& Sound"
    ],
    "color": "#c7ad65",
    "ink": "#25271d",
    "short": "Where engineering meets the ritual of listening.",
    "intro": "From a record playing in the robotics lab to digital archives and physical simulations: three ways of exploring sound.",
    "subjects": "Revinyl / Vinyl Heritage Vietnam / Vinylize",
    "projectIds": [
      "revinyl",
      "vinyl-heritage",
      "vinylize"
    ]
  },
  {
    "id": "language-access",
    "title": "Language & Access",
    "lines": [
      "Language",
      "& Access"
    ],
    "color": "#77a7b7",
    "ink": "#122f40",
    "short": "Building a bridge between language and learning.",
    "intro": "Could a translation app help ethnic minority students gain better access to knowledge?",
    "subjects": "TayTranslator / Offline translation",
    "projectIds": [
      "taytranslator"
    ]
  },
  {
    "id": "community",
    "title": "Community",
    "lines": [
      "Common",
      "ground."
    ],
    "color": "#c47151",
    "ink": "#39251d",
    "short": "Learning together, and making room for others.",
    "intro": "I have always believed that knowledge becomes more meaningful when it is shared.",
    "subjects": "Humanitas / The CodingBuddy",
    "projectIds": [
      "humanitas",
      "codingbuddy"
    ]
  },
  {
    "id": "robotics",
    "title": "Robotics",
    "lines": [
      "Think.",
      "Build.",
      "Repeat."
    ],
    "color": "#8e9caf",
    "ink": "#202c40",
    "short": "Code, iteration, and the people around the robot.",
    "intro": "What began with an unexpected invitation became a journey of building, competing, and mentoring.",
    "subjects": "VEX / MECKUP / AIGC / Kid Engineer / Newton",
    "projectIds": [
      "vex",
      "meckup",
      "aigc",
      "kid-engineer",
      "newton"
    ]
  },
  {
    "id": "research",
    "title": "Research",
    "lines": [
      "Asking",
      "better",
      "questions."
    ],
    "color": "#afa5c1",
    "ink": "#332d44",
    "short": "Questions about access, infrastructure, and listening.",
    "intro": "Questions about educational infrastructure, emotionally responsive technology, and privacy.",
    "subjects": "Rural infrastructure / Edge AI and listening",
    "projectIds": [
      "rural-research",
      "vinyl-research"
    ]
  },
  {
    "id": "experience",
    "title": "Experience & Leadership",
    "lines": [
      "Learning",
      "by doing."
    ],
    "color": "#a1ad7d",
    "ink": "#293525",
    "short": "Working with teams, from voice technology to STEM.",
    "intro": "Applying programming in product development, sharing STEM knowledge, and exploring business innovation.",
    "subjects": "VBEE / STEAMS / HKU & NTU",
    "projectIds": [
      "vbee",
      "steams",
      "hku-ntu"
    ]
  },
  {
    "id": "learning",
    "title": "Learning & Milestones",
    "lines": [
      "Stay",
      "curious."
    ],
    "color": "#ddc78d",
    "ink": "#49402d",
    "short": "The subjects, challenges, and milestones along the way.",
    "intro": "My interests don’t fit inside one subject. Language, mathematics, physics, and computer science give me different ways to ask a question and work toward an answer.",
    "subjects": "Education / Mathematics / Physics",
    "projectIds": [],
    "stories": [
      {
        "title": "Hanoi–Amsterdam High School for the Gifted",
        "status": "English honor class · 2024–2027",
        "paragraphs": [
          "The supplied résumé lists English as the honor class, alongside interests and projects in computer science, physics, and engineering."
        ],
        "media": [],
        "links": []
      },
      {
        "title": "Selected academic milestones",
        "status": "Scores reported in résumé",
        "paragraphs": [
          "SAT 1570, IELTS 8.5, AP Calculus BC 5, and AP Physics C 4. These are résumé-sourced figures; certificates are not included in this prototype."
        ],
        "media": [],
        "links": []
      },
      {
        "title": "Mathematics and physics",
        "status": "Selected honors · 2025–2026",
        "paragraphs": [
          "The résumé lists a 2025 UKMT Senior Mathematical Challenge Gold Prize, a 2026 IAPhO Gold Medal, and a 2026 Continental Calculus League Asian Gold Medal. Supporting documents can be added later."
        ],
        "media": [],
        "links": []
      }
    ]
  },
  {
    "id": "beyond",
    "title": "Beyond the Work",
    "lines": [
      "The",
      "long way",
      "home."
    ],
    "color": "#789e96",
    "ink": "#193831",
    "short": "Long runs, small observations, and time away from a screen.",
    "intro": "I have come to realize that running and programming have more in common than I once imagined.",
    "subjects": "Half marathons / Trail running / Empower Run",
    "projectIds": [
      "running"
    ]
  }
];

export const records=collection.map(({projectIds,...record})=>({...record,stories:record.stories??projectIds.map(id=>projects[id])}));
